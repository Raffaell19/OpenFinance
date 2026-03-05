import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Account, Budget, Category, Recurring, Transaction } from '../types';

interface AppState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  recurring: Recurring[];
  isLoading: boolean;

  fetchData: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateBudget: (categoryId: string, limit: number) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getCategory: (id: string) => Category | undefined;
  getAccount: (id: string) => Account | undefined;
}

const SEED_CATEGORIES = [
  { name: 'Mercado', icon: 'ShoppingCart', color: 'bg-orange-100 text-orange-600', type: 'expense' },
  { name: 'Lanche', icon: 'Coffee', color: 'bg-amber-100 text-amber-600', type: 'expense' },
  { name: 'Aluguel', icon: 'Home', color: 'bg-indigo-100 text-indigo-600', type: 'expense' },
  { name: 'Internet', icon: 'Wifi', color: 'bg-cyan-100 text-cyan-600', type: 'expense' },
  { name: 'Gás', icon: 'Flame', color: 'bg-red-100 text-red-600', type: 'expense' },
  { name: 'Luz', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600', type: 'expense' },
  { name: 'Água', icon: 'Droplet', color: 'bg-blue-100 text-blue-600', type: 'expense' },
  { name: 'Farmácia', icon: 'Pill', color: 'bg-pink-100 text-pink-600', type: 'expense' },
  { name: 'Serviços', icon: 'Wrench', color: 'bg-slate-100 text-slate-600', type: 'expense' },
  { name: 'Lojas', icon: 'Store', color: 'bg-purple-100 text-purple-600', type: 'expense' },
  { name: 'Lazer', icon: 'Gamepad2', color: 'bg-fuchsia-100 text-fuchsia-600', type: 'expense' },
  { name: 'Transporte', icon: 'Car', color: 'bg-emerald-100 text-emerald-600', type: 'expense' },
  { name: 'Gasolina', icon: 'Fuel', color: 'bg-stone-100 text-stone-600', type: 'expense' },
  { name: 'Salário', icon: 'Banknote', color: 'bg-emerald-100 text-emerald-600', type: 'income' },
  { name: 'Investimentos', icon: 'TrendingUp', color: 'bg-teal-100 text-teal-600', type: 'income' },
];

const SEED_ACCOUNTS = [
  { name: 'Carteira', type: 'wallet', balance: 0 },
  { name: 'Nubank', type: 'bank', balance: 0 },
  { name: 'Inter', type: 'bank', balance: 0 },
];

export const useStore = create<AppState>()((set, get) => ({
  accounts: [],
  categories: [],
  transactions: [],
  budgets: [],
  recurring: [],
  isLoading: false,

  fetchData: async () => {
    set({ isLoading: true });

    // Fetch from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isLoading: false });
      return;
    }

    let { data: categories } = await supabase.from('categories').select('*');

    if (!categories || categories.length === 0) {
      // Seed default data if empty
      const { data: newCategories } = await supabase.from('categories')
        .insert(SEED_CATEGORIES.map(c => ({ ...c, user_id: user.id })))
        .select('*');

      const { data: newAccounts } = await supabase.from('accounts')
        .insert(SEED_ACCOUNTS.map(a => ({ ...a, user_id: user.id })))
        .select('*');

      categories = newCategories || [];
    }

    const [
      { data: accounts },
      { data: transactions },
      { data: budgets }
    ] = await Promise.all([
      supabase.from('accounts').select('*'),
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('budgets').select('*')
    ]);

    set({
      accounts: accounts || [],
      categories: categories || [],
      transactions: transactions?.map(t => ({
        ...t,
        categoryId: t.category_id,
        accountId: t.account_id
      })) || [],
      budgets: budgets?.map(b => ({
        ...b,
        categoryId: b.category_id,
        limit: Number(b.limit_amount),
        spent: Number(b.spent_amount)
      })) || [],
      isLoading: false
    });
  },

  addTransaction: async (transaction) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // We do simple updates right away, or refetch
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: transaction.amount,
      type: transaction.type,
      category_id: transaction.categoryId,
      account_id: transaction.accountId,
      date: transaction.date,
      description: transaction.description,
      tags: transaction.tags || []
    });

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    // Also update account balance in DB
    const account = get().accounts.find(a => a.id === transaction.accountId);
    if (account) {
      const dbAmount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
      await supabase.from('accounts').update({ balance: Number(account.balance) + dbAmount }).eq('id', account.id);
    }

    await get().fetchData();
  },

  deleteTransaction: async (id) => {
    const transaction = get().transactions.find(t => t.id === id);
    if (!transaction) return;

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      const account = get().accounts.find(a => a.id === transaction.accountId);
      if (account) {
        const dbAmount = transaction.type === 'expense' ? transaction.amount : -transaction.amount;
        await supabase.from('accounts').update({ balance: Number(account.balance) + dbAmount }).eq('id', account.id);
      }
      await get().fetchData();
    }
  },

  updateTransaction: async (id, transaction) => {
    // Basic implementation: update transaction and refetch
    const oldTx = get().transactions.find(t => t.id === id);
    if (!oldTx) return;

    const { error } = await supabase.from('transactions').update({
      amount: transaction.amount,
      type: transaction.type,
      category_id: transaction.categoryId,
      account_id: transaction.accountId,
      date: transaction.date,
      description: transaction.description,
      tags: transaction.tags || []
    }).eq('id', id);

    if (!error) {
      // Very basic balance fix: revert old, apply new
      if (oldTx.accountId === transaction.accountId) {
        const account = get().accounts.find(a => a.id === transaction.accountId);
        if (account) {
          const oldAmount = oldTx.type === 'expense' ? oldTx.amount : -oldTx.amount;
          const newAmount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
          await supabase.from('accounts').update({ balance: Number(account.balance) + oldAmount + newAmount }).eq('id', account.id);
        }
      } else {
        // Complex logic if they change account
        const oldAccount = get().accounts.find(a => a.id === oldTx.accountId);
        const newAccount = get().accounts.find(a => a.id === transaction.accountId);
        if (oldAccount) {
          const revertOld = oldTx.type === 'expense' ? oldTx.amount : -oldTx.amount;
          await supabase.from('accounts').update({ balance: Number(oldAccount.balance) + revertOld }).eq('id', oldAccount.id);
        }
        if (newAccount) {
          const applyNew = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
          await supabase.from('accounts').update({ balance: Number(newAccount.balance) + applyNew }).eq('id', newAccount.id);
        }
      }

      await get().fetchData();
    }
  },

  updateBudget: async (categoryId, limit) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('budgets').upsert({
      user_id: user.id,
      category_id: categoryId,
      limit_amount: limit
    }, { onConflict: 'user_id,category_id' });

    if (!error) {
      await get().fetchData();
    }
  },

  deleteBudget: async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (!error) {
      set(state => ({ budgets: state.budgets.filter(b => b.id !== id) }));
    }
  },

  getCategory: (id) => get().categories.find(c => c.id === id),
  getAccount: (id) => get().accounts.find(a => a.id === id),
}));
