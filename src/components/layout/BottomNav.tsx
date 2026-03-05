import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Plus, PieChart, MoreHorizontal, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Transações', icon: List, path: '/transactions' },
    { name: 'Lançar', icon: Plus, path: '/add', isFab: true },
    { name: 'Orçamentos', icon: PieChart, path: '/budgets' },
    { name: 'Relatórios', icon: BarChart3, path: '/reports' },
    { name: 'Mais', icon: MoreHorizontal, path: '/more' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 transition-colors duration-300">
      <div className="flex items-center justify-around px-2 pb-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          if (tab.isFab) {
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 hover:bg-emerald-500">
                  <Plus className="h-8 w-8" />
                </div>
                <span className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {tab.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 transition-colors active:scale-95",
                isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              <tab.icon className={cn("h-6 w-6", isActive && "fill-current/20")} />
              <span className="mt-1 text-[10px] font-medium">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
