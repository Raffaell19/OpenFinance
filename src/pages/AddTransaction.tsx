import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '@/components/CategoryIcon';

export function AddTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const initialType = searchParams.get('type') as 'expense' | 'income' || 'expense';
  
  const { addTransaction, updateTransaction, deleteTransaction, transactions, categories, accounts } = useStore();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>(initialType);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        setAmount(tx.amount.toString());
        setType(tx.type);
        setCategoryId(tx.categoryId);
        setAccountId(tx.accountId);
        setDate(tx.date.split('T')[0]);
        setDescription(tx.description);
      }
    }
  }, [id, transactions]);

  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
    setCategoryId('');
    setError('');
  };

  const handleDelete = () => {
    if (id) {
      if (confirm('Tem certeza que deseja excluir esta transação?')) {
        deleteTransaction(id);
        navigate(-1);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, insira um valor válido.');
      return;
    }

    if (!categoryId) {
      setError('Por favor, selecione uma categoria.');
      return;
    }

    if (!accountId) {
      setError('Por favor, selecione uma conta.');
      return;
    }

    const transactionData = {
      amount: parseFloat(amount),
      type,
      categoryId,
      accountId,
      date: new Date(date).toISOString(),
      description: description || categories.find(c => c.id === categoryId)?.name || 'Sem descrição',
    };

    if (id) {
      updateTransaction(id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {id ? 'Editar Transação' : 'Nova Transação'}
        </h1>
        {id ? (
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto pb-24">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valor</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-500">R$</span>
            <input
              type="number"
              step="0.01"
              autoFocus
              className="w-full bg-transparent text-4xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none pl-12"
              placeholder="0,00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
            />
          </div>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors duration-300">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={cn(
              "py-2.5 text-sm font-medium rounded-lg transition-all",
              type === 'expense' 
                ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            )}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={cn(
              "py-2.5 text-sm font-medium rounded-lg transition-all",
              type === 'income' 
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            )}
          >
            Receita
          </button>
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoria</label>
          <div className="grid grid-cols-3 gap-3">
            {categories
              .filter(c => c.type === type)
              .map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(cat.id);
                    if (error) setError('');
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                    categoryId === cat.id
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                >
                  <div className={cn("p-2 rounded-full", cat.color)}>
                    <CategoryIcon iconName={cat.icon} className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Account & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conta</label>
            <select
              className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</label>
            <input
              type="date"
              className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Descrição (Opcional)</label>
          <Input
            placeholder="Ex: Jantar, Uber, Salário..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/20">
          <Check className="mr-2 h-5 w-5" />
          Salvar Lançamento
        </Button>
      </form>
    </div>
  );
}
