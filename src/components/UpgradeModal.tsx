import React from 'react';
import { X, Lock, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade?: () => void; 
  onRedeemClick: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onRedeemClick }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-yellow-500/50 w-full max-w-md rounded-2xl p-0 relative shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto" style={{ WebkitBackfaceVisibility: 'hidden', WebkitPerspective: '1000' }}>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px] pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20 bg-black/20 rounded-full p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-b from-yellow-500/20 to-transparent p-8 text-center relative z-10 border-b border-yellow-500/10">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900 border-2 border-yellow-500 rounded-full shadow-lg shadow-yellow-500/30 mb-4 relative">
             <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
               RESTRICTED
             </div>
             <Lock className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic leading-none drop-shadow-md">
            Acesso Restrito <br/>
            <span className="text-yellow-500">Plano Premium 🚀</span>
          </h2>
        </div>

        <div className="p-6 space-y-4 relative z-10 bg-slate-900/50">
          <p className="text-slate-300 text-center text-sm leading-relaxed font-medium">
            Você está operando no <span className="text-slate-400 font-bold">Modo Soldado (Básico)</span>. 
            <br/>Para acessar o arsenal completo de guerra, você precisa da credencial General.
          </p>

          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-3">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">O que você libera imediatamente:</p>
             <ul className="space-y-2">
               <li className="flex items-center gap-3 text-sm text-white">
                 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Treinos Avançados (C e D)
               </li>
               <li className="flex items-center gap-3 text-sm text-white">
                 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Botão Salva-Vidas (SOS Detox)
               </li>
               <li className="flex items-center gap-3 text-sm text-white">
                 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Cardápios Metabólicos
               </li>
             </ul>
          </div>
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-800 z-10 space-y-3">
          <Button variant="gold" fullWidth onClick={onRedeemClick} className="text-lg relative overflow-hidden group py-4 shadow-yellow-900/20">
            <span className="relative z-10 flex items-center justify-center gap-2">
              LIBERAR COM PIX (R$ 29,90) <ArrowRight className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3" />
            <span>Chave Pix Aleatória • Liberação via Código</span>
          </div>
        </div>
      </div>
    </div>
  );
}