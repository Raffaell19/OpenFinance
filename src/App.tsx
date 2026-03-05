/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { AddTransaction } from '@/pages/AddTransaction';
import { AddBudget } from '@/pages/AddBudget';
import { Budgets } from '@/pages/Budgets';
import { Reports } from '@/pages/Reports';
import { More } from '@/pages/More';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { Security } from '@/pages/Security';
import { Help } from '@/pages/Help';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import { supabase } from '@/lib/supabase';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'budgets', element: <Budgets /> },
      { path: 'reports', element: <Reports /> },
      { path: 'more', element: <More /> },
    ],
  },
  {
    path: '/add',
    element: (
      <RequireAuth>
        <AddTransaction />
      </RequireAuth>
    ),
  },
  {
    path: '/edit-transaction/:id',
    element: (
      <RequireAuth>
        <AddTransaction />
      </RequireAuth>
    ),
  },
  {
    path: '/add-budget',
    element: (
      <RequireAuth>
        <AddBudget />
      </RequireAuth>
    ),
  },
  { path: '/profile', element: <RequireAuth><Profile /></RequireAuth> },
  { path: '/settings', element: <RequireAuth><Settings /></RequireAuth> },
  { path: '/security', element: <RequireAuth><Security /></RequireAuth> },
  { path: '/help', element: <RequireAuth><Help /></RequireAuth> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
