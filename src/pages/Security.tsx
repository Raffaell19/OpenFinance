import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Lock, Fingerprint, ShieldCheck, Smartphone } from 'lucide-react';

export function Security() {
  const navigate = useNavigate();
  const [biometrics, setBiometrics] = useState(true);
  const [pinLock, setPinLock] = useState(false);
  const [hideValues, setHideValues] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Segurança</h1>
      </header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-24">
        
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3 transition-colors duration-300">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Seus dados estão seguros</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
              Todas as informações são armazenadas localmente no seu dispositivo e criptografadas.
            </p>
          </div>
        </div>

        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Biometria / FaceID</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Usar para entrar no app</p>
              </div>
            </div>
            <Switch checked={biometrics} onCheckedChange={setBiometrics} />
          </div>

          <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Bloqueio por PIN</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Exigir senha numérica</p>
              </div>
            </div>
            <Switch checked={pinLock} onCheckedChange={setPinLock} />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Ocultar Valores</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Esconder saldos na tela inicial</p>
              </div>
            </div>
            <Switch checked={hideValues} onCheckedChange={setHideValues} />
          </div>
        </section>

        <Button variant="outline" className="w-full border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 bg-white dark:bg-slate-900">
          Redefinir PIN de Segurança
        </Button>

      </div>
    </div>
  );
}
