export type TransactionType = 'expense' | 'income' | 'transfer';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Account {
  id: string;
  name: string;
  type: 'wallet' | 'bank' | 'credit_card';
  balance: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: string; // ISO string
  description: string;
  tags?: string[];
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  spent: number; // Calculated field usually, but storing for simplicity in prototype
}

export interface Recurring {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Day of month
  categoryId: string;
  active: boolean;
}
