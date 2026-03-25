import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AddBudget() {
  const navigate = useNavigate();
  const { updateBudget, categories, budgets } = useStore();
  
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState('1');
  const [installmentValue, setInstallmentValue] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Filter for expense categories only
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    const finalLimit = isInstallment 
      ? parseFloat(installmentValue) 
      : parseFloat(amount);

    if (isNaN(finalLimit)) return;

    updateBudget(categoryId, finalLimit, {
      is_installment: isInstallment,
      installments_total: isInstallment ? parseInt(installmentsCount) : undefined,
      installment_value: isInstallment ? parseFloat(installmentValue) : undefined,
      start_date: isInstallment ? startDate : undefined,
      description: description || undefined
    });
    
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Configurar Gasto Previsto</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto pb-24">
        {/* Toggle Installment */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">Gasto Parcelado?</Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">Marque se for uma compra em parcelas</p>
          </div>
          <Switch
            checked={isInstallment}
            onCheckedChange={setIsInstallment}
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isInstallment ? 'Valor da Parcela' : 'Limite Mensal'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-500">R$</span>
            <input
              type="number"
              step="0.01"
              autoFocus
              className="w-full bg-transparent text-4xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none pl-12"
              placeholder="0,00"
              value={isInstallment ? installmentValue : amount}
              onChange={(e) => isInstallment ? setInstallmentValue(e.target.value) : setAmount(e.target.value)}
            />
          </div>
        </div>

        {isInstallment && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-slate-500">Parcelas</Label>
              <Input
                type="number"
                value={installmentsCount}
                onChange={(e) => setInstallmentsCount(e.target.value)}
                placeholder="Ex: 5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-slate-500">Data Início</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  className="pl-9"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Description Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Descrição (Opcional)</label>
          <Input 
            placeholder="Ex: Crediário Loja de Roupas" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white dark:bg-slate-900"
          />
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoria</label>
          <div className="grid grid-cols-3 gap-3">
            {expenseCategories.map((cat) => {
              const hasBudget = budgets.some(b => b.categoryId === cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 relative",
                    categoryId === cat.id
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                >
                  {hasBudget && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" title="Já possui configuração" />
                  )}
                  <div className={cn("p-2 rounded-full", cat.color)}>
                    <CategoryIcon iconName={cat.icon} className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/20">
          <Check className="mr-2 h-5 w-5" />
          Salvar Gasto Previsto
        </Button>
      </form>
    </div>
  );
}
