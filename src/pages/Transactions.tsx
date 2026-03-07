import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Filter, Edit2, Trash2, X, UploadCloud, FileText } from 'lucide-react';
import { CategoryIcon } from '@/components/CategoryIcon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Transactions() {
  const navigate = useNavigate();
  const { transactions, categories, deleteTransaction, uploadReceipt, deleteReceipt } = useStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'history' | 'receipts'>('history');
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const clearFilters = () => {
    setFilterType('all');
    setFilterCategory('all');
    setFilterDateStart('');
    setFilterDateEnd('');
    setIsFilterOpen(false);
  };

  const activeFiltersCount = [
    filterType !== 'all',
    filterCategory !== 'all',
    filterDateStart !== '',
    filterDateEnd !== ''
  ].filter(Boolean).length;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory;

    const txDate = new Date(t.date);
    const startDate = filterDateStart ? new Date(filterDateStart) : null;
    const endDate = filterDateEnd ? new Date(filterDateEnd) : null;

    // Adjust end date to include the full day
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const matchesDate = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  return (
    <div className="space-y-6 p-4 pt-8 pb-24 transition-colors duration-300">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transações</h1>

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="relative rounded-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filtrar Transações</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                    className="flex-1"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterType === 'income' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('income')}
                    className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
                    style={filterType === 'income' ? { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' } : {}}
                  >
                    Receitas
                  </Button>
                  <Button
                    variant={filterType === 'expense' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('expense')}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/20"
                    style={filterType === 'expense' ? { backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' } : {}}
                  >
                    Despesas
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">De</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filterDateStart}
                    onChange={(e) => setFilterDateStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Até</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filterDateEnd}
                    onChange={(e) => setFilterDateEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
              <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-slate-700">
                Limpar Filtros
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Aplicar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'receipts' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          onClick={() => setActiveTab('receipts')}
        >
          Comprovantes
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <Input
          placeholder="Buscar transação..."
          className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterType !== 'all' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
              Tipo: {filterType === 'income' ? 'Receita' : 'Despesa'}
              <button onClick={() => setFilterType('all')} className="ml-1 hover:text-slate-900 dark:hover:text-slate-100"><X className="h-3 w-3" /></button>
            </div>
          )}
          {filterCategory !== 'all' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
              Cat: {categories.find(c => c.id === filterCategory)?.name}
              <button onClick={() => setFilterCategory('all')} className="ml-1 hover:text-slate-900 dark:hover:text-slate-100"><X className="h-3 w-3" /></button>
            </div>
          )}
          {(filterDateStart || filterDateEnd) && (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
              Data: {filterDateStart ? formatDate(filterDateStart) : 'Inicio'} - {filterDateEnd ? formatDate(filterDateEnd) : 'Fim'}
              <button onClick={() => { setFilterDateStart(''); setFilterDateEnd(''); }} className="ml-1 hover:text-slate-900 dark:hover:text-slate-100"><X className="h-3 w-3" /></button>
            </div>
          )}
          <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-700 underline px-1">Limpar tudo</button>
        </div>
      )}

      <div className="space-y-4">
        {filteredTransactions.map((tx) => {
          const category = categories.find(c => c.id === tx.categoryId);
          return (
            <div key={tx.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${category?.color || 'bg-slate-100 dark:bg-slate-800'}`}>
                  <CategoryIcon iconName={category?.icon || 'AlertCircle'} className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{tx.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{category?.name} • {formatDate(tx.date)}</p>
                </div>
              </div>
              {activeTab === 'history' ? (
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </span>
                  <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      onClick={() => navigate(`/edit-transaction/${tx.id}`)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente a transação.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteTransaction(tx.id)} className="bg-red-600 hover:bg-red-700 text-white">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {tx.receipt_url ? (
                    <>
                      <Button variant="outline" size="sm" asChild className="h-8 gap-1 dark:border-slate-800 dark:hover:bg-slate-800">
                        <a href={tx.receipt_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                          Ver
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteReceipt(tx.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        id={`receipt-${tx.id}`}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploading(tx.id);
                            await uploadReceipt(tx.id, file);
                            setIsUploading(null);
                          }
                        }}
                      />
                      <label htmlFor={`receipt-${tx.id}`}>
                        <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 h-8 px-3 gap-1 cursor-pointer">
                          {isUploading === tx.id ? (
                            <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UploadCloud className="h-4 w-4" />
                          )}
                          Anexar
                        </span>
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            Nenhuma transação encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
