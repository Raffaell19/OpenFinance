import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { useStore } from '@/store/useStore';
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

export function Reports() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeRange, setTimeRange] = useState('6M');
  const { transactions, categories } = useStore();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Cash Flow Calculations
  // "Último mês" (1M) = last closed month (previous month), not current
  const now = new Date();
  let periodLength = 6;
  let monthOffset = 0; // how many months back from current to start
  if (timeRange === '1M') {
    periodLength = 1;
    monthOffset = 1; // go back 1 month (last closed month)
  } else if (timeRange === '3M') {
    periodLength = 3;
    monthOffset = 1; // start from last closed month
  } else if (timeRange === '6M') {
    periodLength = 6;
    monthOffset = 1; // start from last closed month
  } else if (timeRange === '1Y') {
    // Show from January to last closed month
    periodLength = now.getMonth(); // Jan=0 means 0 months, but getMonth() in April=3, so Jan-Mar = 3 months
    if (periodLength === 0) periodLength = 12; // If January, show previous year
    monthOffset = 1;
  }

  const chartPeriods = Array.from({ length: periodLength }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthOffset - (periodLength - 1 - i));
    return {
      month: d.getMonth(),
      year: d.getFullYear(),
      name: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d).replace('.', '')
    };
  });

  const cashFlowData = chartPeriods.map(m => {
    const monthTxs = transactions.filter(t => {
      const [y, mm, dd] = t.date.split('T')[0].split('-').map(Number);
      const d = new Date(y, mm - 1, dd);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    });
    return {
      name: m.name.charAt(0).toUpperCase() + m.name.slice(1),
      income: monthTxs.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0),
      expense: monthTxs.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
    };
  });

  // Expense by Category Calculations — respects timeRange filter
  // For category breakdown, use all months in the selected period
  const categoryPeriodMonths = new Set(
    chartPeriods.map(p => `${p.year}-${p.month}`)
  );

  const monthlyTransactions = transactions.filter(t => {
    const [y, mm, dd] = t.date.split('T')[0].split('-').map(Number);
    const d = new Date(y, mm - 1, dd);
    return categoryPeriodMonths.has(`${d.getFullYear()}-${d.getMonth()}`);
  });

  const expenseTransactions = monthlyTransactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const expenseData = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const amount = expenseTransactions
        .filter(t => t.categoryId === cat.id)
        .reduce((acc, curr) => acc + curr.amount, 0);

      return {
        name: cat.name,
        value: amount,
        colorClass: cat.color,
        hexColor: getCategoryColor(cat.color),
        icon: cat.icon,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Highest Income / Expense from Cash Flow Data
  const highestIncome = [...cashFlowData].sort((a, b) => b.income - a.income)[0] || { income: 0, name: '-' };
  const highestExpense = [...cashFlowData].sort((a, b) => b.expense - a.expense)[0] || { expense: 0, name: '-' };

  return (
    <div className="space-y-6 p-4 pt-8 pb-24 transition-colors duration-300">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Relatórios</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Análise detalhada das suas finanças</p>
        </div>
      </header>

      {/* Monthly Cash Flow Chart */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            Fluxo de Caixa
          </h2>
          <select
            className="bg-slate-50 dark:bg-slate-800 border-none text-xs rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1M">Último mês</option>
            {/* Nota: "Último mês" exibe o mês anterior fechado */}
            <option value="3M">Últimos 3 meses</option>
            <option value="6M">Últimos 6 meses</option>
            <option value="1Y">Este ano</option>
          </select>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `R$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  borderColor: 'var(--tooltip-border)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: 'var(--tooltip-text)' }}
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-slate-600 dark:text-slate-400 text-xs ml-1">{value === 'income' ? 'Receitas' : 'Despesas'}</span>}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Category Pie Chart */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-indigo-500" />
            Gastos por Categoria
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="h-[220px] w-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hexColor}
                      strokeWidth={0}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    borderColor: 'var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: 'var(--tooltip-text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xs text-slate-400 dark:text-slate-500">Total</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            {expenseData.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm">Nenhuma despesa neste mês.</p>
            ) : (
              expenseData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${entry.colorClass.replace('text-', 'bg-').replace('600', '100')} dark:bg-opacity-20`}
                    >
                      <CategoryIcon iconName={entry.icon} className={`h-4 w-4 ${entry.colorClass}`} />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(entry.value)}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{entry.percentage.toFixed(0)}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Maior Receita</span>
          </div>
          <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{formatCurrency(highestIncome.income)}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">{highestIncome.name}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">Maior Despesa</span>
          </div>
          <p className="text-lg font-bold text-red-900 dark:text-red-100">{formatCurrency(highestExpense.expense)}</p>
          <p className="text-xs text-red-600 dark:text-red-400">{highestExpense.name}</p>
        </div>
      </div>

      <style>{`
        :root {
          --tooltip-bg: #ffffff;
          --tooltip-border: #e2e8f0;
          --tooltip-text: #0f172a;
        }
        .dark {
          --tooltip-bg: #0f172a;
          --tooltip-border: #1e293b;
          --tooltip-text: #f8fafc;
        }
      `}</style>
    </div>
  );
}
