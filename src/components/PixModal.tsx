import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { generatePixPayment, grantPremiumToUser, auth } from '../firebase'; 

interface PixModalProps {
  onClose: () => void;
  itemTitle: string;
  price: string;
}

export const PixModal: React.FC<PixModalProps> = ({ onClose, itemTitle, price}) => {
  const [step, setStep] = useState<'loading' | 'display' | 'verifying'>('loading');
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Inicia a geração assim que o modal abre
    const startGen = async () => {
      try {
        const result = await generatePixPayment(price, itemTitle);
        if (result.success && result.copyPasteCode) {
          setPixCode(result.copyPasteCode);
          setStep('display');
        }
      } catch (error) {
        console.error("Erro ao gerar PIX", error);
        onClose(); // Fecha se der erro
      }
    };
    startGen();
  }, [price, itemTitle, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    setStep('verifying');
    // Simulação de verificação
    setTimeout(async () => {
      // Simulação de verificação: conceder o premium ao usuário logado
      if (auth.currentUser && auth.currentUser.uid) {
        const uid = auth.currentUser.uid;
        const res = await grantPremiumToUser(uid);
        if (res.success) {
          alert('Pagamento confirmado — seu acesso PREMIUM e o Desafio Musa 2026 foram ativados.');
        } else {
          alert('Pagamento confirmado, mas houve um erro ao ativar seu plano. Contate o suporte.');
        }
      } else {
        alert('Pagamento confirmado. Faça login ou crie sua conta para liberar o acesso.');
      }
      onClose();
    }, 2000);
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-slate-900 uppercase italic">Pagamento PIX</h2>
          <p className="text-sm text-slate-500 mt-1">{itemTitle}</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{price}</p>
        </div>

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-sm font-bold text-slate-500 animate-pulse">Gerando QR Code único...</p>
          </div>
        )}

        {step === 'display' && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="bg-slate-100 p-4 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
               <QrCode className="w-32 h-32 text-slate-800 mb-2" />
               <p className="text-[10px] text-slate-500 uppercase font-bold">Escaneie com seu banco</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ou use o Copia e Cola</label>
              <button 
                onClick={handleCopy}
                className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${copied ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'}`}
              >
                <span className="text-xs font-mono truncate max-w-[200px]">{pixCode}</span>
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg flex gap-2 items-start border border-emerald-100">
               <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
               <p className="text-[10px] text-emerald-800 leading-tight">
                 Após o pagamento, o sistema libera seu acesso automaticamente em até 2 minutos.
               </p>
            </div>

            <Button fullWidth onClick={handleVerify} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200">
              JÁ FIZ O PAGAMENTO
            </Button>


          </div>
        )}

        {step === 'verifying' && (
           <div className="flex flex-col items-center justify-center py-8 space-y-4">
             <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
             <p className="text-sm font-bold text-slate-500">Verificando banco...</p>
           </div>
        )}

      </div>
    </div>
  );
};