import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Moon, Bell, Globe, DollarSign, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  
  const isDark = theme === 'dark';

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Configurações</h1>
      </header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-24">
        
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Aparência</h3>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Modo Escuro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isDark ? 'Ativado' : 'Desativado'}
                </p>
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Notificações</h3>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Alertas de Orçamento</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receber avisos de gastos</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Regional</h3>
          </div>
          <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Moeda Principal</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real Brasileiro (BRL)</p>
              </div>
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">BRL</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Idioma</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Português (Brasil)</p>
              </div>
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">PT-BR</span>
          </div>
        </section>

      </div>
    </div>
  );
}
