import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryIcon } from '@/components/CategoryIcon';

const TAILWIND_COLORS: Record<string, string> = {
  slate: '#475569', gray: '#4b5563', zinc: '#52525b', neutral: '#525252', stone: '#57534e',
  red: '#dc2626', orange: '#ea580c', amber: '#d97706', yellow: '#ca8a04', lime: '#65a30d',
  green: '#16a34a', emerald: '#059669', teal: '#0d9488', cyan: '#0891b2', sky: '#0284c7',
  blue: '#2563eb', indigo: '#4f46e5', violet: '#7c3aed', purple: '#9333ea', fuchsia: '#c026d3',
  pink: '#db2777', rose: '#e11d48',
};

const getCategoryColor = (colorClass: string) => {
  const match = colorClass.match(/text-(\w+)-600/);
  if (match && match[1] && TAILWIND_COLORS[match[1]]) {
    return TAILWIND_COLORS[match[1]];
  }
  return '#94a3b8';
};

export function Dashboard() {
  const { transactions, accounts, budgets, categories, userName } = useStore();

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  // Calculate income/expense for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  // Calculate expenses by category for chart
  const expenseTransactions = monthlyTransactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const expensesByCategory = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const amount = expenseTransactions
        .filter(t => t.categoryId === cat.id)
        .reduce((acc, curr) => acc + curr.amount, 0);

      return {
        name: cat.name,
        value: amount,
        color: cat.color,
        hexColor: getCategoryColor(cat.color),
        icon: cat.icon,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Calculate budget progress
  const budgetProgress = budgets.map(b => {
    const category = categories.find(c => c.id === b.categoryId);
    const spent = monthlyTransactions
      .filter(t => t.categoryId === b.categoryId && t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      ...b,
      categoryName: category?.name || 'Unknown',
      categoryColor: category?.color || 'bg-slate-100',
      spent,
      percentage: Math.min((spent / b.limit) * 100, 100)
    };
  }).sort((a, b) => b.percentage - a.percentage).slice(0, 3);

  return (
    <div className="space-y-6 p-4 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-500">OpenFinance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Olá, {userName || 'Usuário'} 👋</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Button>
      </header>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 border-none">
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-emerald-100 text-sm font-medium">Saldo Total</p>
            <h2 className="text-3xl font-bold tracking-tight">{formatCurrency(totalBalance)}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="flex items-center gap-1 text-emerald-100 text-xs mb-1">
                <ArrowDownRight className="h-3 w-3" />
                Receitas
              </div>
              <p className="font-semibold text-lg">{formatCurrency(income)}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-emerald-100 text-xs mb-1">
                <ArrowUpRight className="h-3 w-3" />
                Despesas
              </div>
              <p className="font-semibold text-lg">{formatCurrency(expense)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 group transition-all">
          <Link to="/add?type=expense">
            <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">Lançar Gasto</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 group transition-all">
          <Link to="/add?type=income">
            <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">Lançar Receita</span>
          </Link>
        </Button>
      </div>

      {/* Expenses Chart */}
      {expensesByCategory.length > 0 && (
        <section>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Gastos por Categoria</h3>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Chart */}
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.hexColor} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#1e293b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>

              {/* List */}
              <div className="space-y-5">
                {expensesByCategory.map((category) => (
                  <div key={category.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-full ${category.color} transition-transform group-hover:scale-110`}>
                        <CategoryIcon iconName={category.icon} className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(category.value)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{category.percentage.toFixed(0)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Budgets */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Meus Orçamentos</h3>
          <Link to="/budgets" className="text-xs font-medium text-emerald-600 dark:text-emerald-500 hover:underline">Ver todos</Link>
        </div>
        <div className="space-y-3">
          {budgetProgress.map((budget) => (
            <div key={budget.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">{budget.categoryName}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <Progress value={budget.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Últimas Transações</h3>
          <Link to="/transactions" className="text-xs font-medium text-emerald-600 dark:text-emerald-500 hover:underline">Ver todas</Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((tx) => {
            const category = categories.find(c => c.id === tx.categoryId);
            return (
              <div key={tx.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${category?.color || 'bg-slate-100 dark:bg-slate-800'}`}>
                    <CategoryIcon iconName={category?.icon || 'AlertCircle'} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{tx.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
