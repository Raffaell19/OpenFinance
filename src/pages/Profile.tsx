import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Mail, Phone, MapPin, Save } from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('Usuário');
  const [email, setEmail] = useState('usuario@exemplo.com');
  const [phone, setPhone] = useState('(11) 99999-9999');

  const handleSave = () => {
    // In a real app, this would update the store/backend
    alert('Perfil salvo com sucesso!');
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Meu Perfil</h1>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-4xl font-bold border-4 border-white dark:border-slate-900 shadow-md transition-colors duration-300">
              {name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-sm transition-colors">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" 
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" 
                type="tel"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/20">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
