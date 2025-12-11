import React, { useState } from 'react';
import { X, Key, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { redeemCode } from '../firebase';

interface RedemptionModalProps {
  onClose: () => void;
  uid: string;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({ onClose, uid }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    setStatus('idle');
    setMessage('');

    const result = await redeemCode(uid, code);
    
    setLoading(false);
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Key className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-white uppercase italic">
            Resgatar Acesso
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Insira o código enviado no seu WhatsApp ou E-mail após a compra.
          </p>
        </div>

        <form onSubmit={handleRedeem} className="space-y-4">
          <div className="space-y-1">
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-600 rounded-lg py-4 px-4 text-center text-xl font-mono tracking-widest text-white focus:border-emerald-500 focus:outline-none transition-colors uppercase placeholder:text-slate-700"
              placeholder="CÓDIGO-AQUI"
              maxLength={20}
            />
          </div>

          {status === 'error' && (
            <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-xs animate-pulse justify-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {message}
            </div>
          )}

          {status === 'success' && (
            <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg flex items-center gap-2 text-emerald-400 text-xs justify-center">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {message}
            </div>
          )}

          <Button fullWidth type="submit" disabled={loading || status === 'success'} className="shadow-lg shadow-emerald-900/20 bg-emerald-600 hover:bg-emerald-500 border-emerald-500">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "VALIDAR CÓDIGO"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500">
            Ainda não tem um código? <a href="#" className="text-slate-400 underline hover:text-white">Fale com o suporte no WhatsApp</a>.
          </p>
        </div>

      </div>
    </div>
  );
};