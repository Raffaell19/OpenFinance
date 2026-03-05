import { Settings, User, Shield, HelpCircle, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import { supabase } from '@/lib/supabase';

export function More() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { icon: User, label: 'Perfil', desc: 'Gerenciar dados pessoais', path: '/profile' },
    { icon: Settings, label: 'Configurações', desc: 'Moeda, idioma, notificações', path: '/settings' },
    { icon: Shield, label: 'Segurança', desc: 'PIN, Biometria', path: '/security' },
    { icon: HelpCircle, label: 'Ajuda', desc: 'FAQ e Suporte', path: '/help' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6 p-4 pt-8 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mais</h1>
      </header>

      <div className="space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Modo Escuro</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {theme === 'dark' ? 'Ativado' : 'Desativado'}
            </p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-emerald-600' : 'bg-slate-200'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">{item.label}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-8">
        <Button onClick={handleLogout} variant="destructive" className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-none shadow-none">
          <LogOut className="mr-2 h-4 w-4" />
          Sair do App
        </Button>
      </div>
    </div>
  );
}
