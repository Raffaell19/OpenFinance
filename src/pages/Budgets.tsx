import { useStore } from '@/store/useStore';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PieChart, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Budgets() {
  const { budgets, categories, transactions, updateBudget, deleteBudget, fetchData } = useStore();
  const [editingBudget, setEditingBudget] = useState<{ id: string, categoryId: string, limit: number } | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState('');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
  });

  const budgetData = budgets.map(b => {
    const category = categories.find(c => c.id === b.categoryId);
    const categoryTransactions = monthlyTransactions
      .filter(t => t.categoryId === b.categoryId);
    const spent = categoryTransactions
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return {
      ...b,
      categoryName: category?.name || 'Unknown',
      categoryColor: category?.color || 'bg-slate-100',
      categoryIcon: category?.icon || 'AlertCircle',
      spent,
      percentage: Math.min((spent / b.limit) * 100, 100),
      isOverBudget: spent > b.limit,
      transactions: categoryTransactions
    };
  });

  const handleEdit = (budget: any) => {
    setEditingBudget({ id: budget.id, categoryId: budget.categoryId, limit: budget.limit });
    setNewLimit(budget.limit.toString());
  };

  const handleSaveEdit = () => {
    if (editingBudget && newLimit) {
      updateBudget(editingBudget.categoryId, parseFloat(newLimit));
      setEditingBudget(null);
      setNewLimit('');
    }
  };

  const handleDelete = (id: string) => {
    setDeletingBudget(id);
  };

  const handleConfirmDelete = () => {
    if (deletingBudget) {
      deleteBudget(deletingBudget);
      setDeletingBudget(null);
    }
  };

  return (
    <div className="space-y-6 p-4 pt-8 pb-24 transition-colors duration-300">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <PieChart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gastos Previstos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Controle seus gastos fixos e parcelados</p>
        </div>
      </header>

      <div className="space-y-4">
        {budgetData.map((budget) => (
          <div key={budget.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${budget.categoryColor}`}>
                  <CategoryIcon iconName={budget.categoryIcon} className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{budget.categoryName}</h3>
                  {budget.is_installment ? (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      Parcelado: {budget.installments_total}x de {formatCurrency(budget.installment_value || 0)}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Restante: <span className="font-medium text-emerald-600 dark:text-emerald-500">{formatCurrency(Math.max(0, budget.limit - budget.spent))}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(budget.spent)}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">de {formatCurrency(budget.limit)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600" onClick={() => handleEdit(budget)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(budget.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress 
                value={budget.percentage} 
                className={`h-3 ${budget.isOverBudget ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}
              />
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400 dark:text-slate-500">0%</span>
                <span className={budget.isOverBudget ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-500'}>
                  {Math.round(budget.percentage)}%
                </span>
              </div>
            </div>

            {budget.transactions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Transações do mês</h4>
                <div className="space-y-3">
                  {budget.transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{tx.description}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(tx.date)}</p>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="p-6 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Quer controlar mais categorias?</p>
          <Link to="/add-budget" className="text-emerald-600 dark:text-emerald-500 font-semibold text-sm hover:underline inline-block">
            + Configurar gasto previsto
          </Link>
        </div>
      </div>

      <Dialog open={!!editingBudget} onOpenChange={(open) => !open && setEditingBudget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Orçamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Novo Limite</Label>
              <Input
                id="limit"
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                placeholder="Ex: 1000.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBudget(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-700 text-white">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingBudget} onOpenChange={(open) => !open && setDeletingBudget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Orçamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
