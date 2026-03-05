import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

export function Help() {
  const navigate = useNavigate();

  const faqs = [
    { q: 'Como adicionar uma nova conta?', a: 'Vá em Mais > Configurações > Contas ou clique no ícone de carteira na tela inicial.' },
    { q: 'Meus dados ficam na nuvem?', a: 'Não. O OpenFinance funciona offline-first e seus dados ficam salvos apenas no seu dispositivo.' },
    { q: 'Como criar um orçamento?', a: 'Acesse a aba "Orçamentos" e clique em "Criar novo orçamento" para definir limites por categoria.' },
    { q: 'Posso exportar meus dados?', a: 'Sim, em breve teremos a função de exportar para CSV e PDF na tela de Transações.' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ajuda e Suporte</h1>
      </header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-24">
        
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
              Perguntas Frequentes
            </h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">{faq.q}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 px-1">Precisa de mais ajuda?</h3>
          
          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-slate-100">Fale Conosco</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Chat ou E-mail</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-slate-100">Termos de Uso</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Política de Privacidade</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </button>
        </section>

      </div>
    </div>
  );
}
