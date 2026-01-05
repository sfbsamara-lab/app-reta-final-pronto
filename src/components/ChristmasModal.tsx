import React, { useEffect } from 'react';
import { X, PartyPopper, Wine, Utensils, Droplets, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface ChristmasModalProps {
  onClose: () => void;
}

export const ChristmasModal: React.FC<ChristmasModalProps> = ({ onClose }) => {
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-red-950/30 border border-red-500/30 w-full max-w-lg rounded-2xl relative shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col max-h-[90vh]">
        
        {/* Header Carnavalesco */}
        <div className="p-6 border-b border-carnival-primary/20 bg-gradient-to-r from-carnival-secondary/50 to-slate-900 rounded-t-2xl flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PartyPopper className="w-5 h-5 text-carnival-primary animate-bounce" />
              <span className="text-[10px] font-bold bg-carnival-primary text-white px-2 py-0.5 rounded uppercase tracking-wider">Desafio Musa 2026</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase italic">
              Kit Blindagem Carnaval <br/><span className="text-carnival-secondary">Carnaval 2026</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">Estratégia de 6 semanas para acelerar o metabolismo e eliminar a retenção antes da folia.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-900/50 rounded-full text-slate-400 hover:text-white border border-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 scroll-smooth flex-1 bg-slate-900/80">
          
          {/* Section 1: Pré-Folia */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-carnival-primary">
                <Utensils className="w-5 h-5" />
                <h3 className="font-black uppercase tracking-widest text-sm">Estratégia de Guerra: Pré-Folia</h3>
             </div>
             
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex gap-3">
                   <div className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                   <p className="text-sm text-slate-300"><strong className="text-white">Proteína Primeiro:</strong> Prefira proteína magra antes de longos dias de festa (blocos e ensaios): reduz sensívelmente o inchaço e melhora saciedade.</p>
                </div>
                <div className="flex gap-3">
                   <div className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                   <p className="text-sm text-slate-300"><strong className="text-white">A Regra do Álcool — Atualizada:</strong> No Carnaval a maioria bebe cerveja e drinks; para cada bebida alcoólica, tome 1 copo de água, alterne goles de água entre drinks e evite misturar destilados para reduzir inchaço e mau estar.</p>
                </div>
             </div>
          </div>

          <div className="mt-3 border-t border-slate-800 pt-4 space-y-3">
             <div className="flex gap-3">
               <div className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
               <p className="text-sm text-slate-300"><strong className="text-white">O Ciclo do Álcool Inteligente:</strong> Planeje: pré-hidratação com água mineral e eletrólitos, limite destilados, prefira cervejas leves e drinks com baixa caloria; entre cada dose, 1 copo de água. Ao acordar, reponha eletrólitos e proteína para acelerar a recuperação.</p>
             </div>
          </div>

          {/* Section 2: Day After */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-black uppercase tracking-widest text-sm">Day After: O Desinchaço</h3>
             </div>
             
             <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/50 space-y-4">
                <div className="space-y-1">
                   <h4 className="text-white font-bold text-sm flex items-center gap-2">
                     <Droplets className="w-4 h-4 text-emerald-500"/> Shot Matinal Salva-Vidas
                   </h4>
                   <p className="text-xs text-slate-400">Em jejum total, misture e beba:</p>
                   <ul className="text-xs text-slate-300 list-disc pl-5 mt-2 space-y-1 font-mono">
                      <li>50ml de água morna</li>
                      <li>1 limão espremido</li>
                      <li>1 colher (café) de Cúrcuma</li>
                      <li>1 pitada de Pimenta Caiena</li>
                   </ul>
                </div>

                <div className="space-y-1 border-t border-emerald-900/30 pt-3">
                   <h4 className="text-white font-bold text-sm flex items-center gap-2">
                     <Wine className="w-4 h-4 text-emerald-500"/> Protocolo Zero Açúcar
                   </h4>
                   <p className="text-xs text-slate-300">
                     No dia seguinte (pós-folia), corte 100% dos carboidratos refinados. Consuma ovos, folhas e carnes para facilitar a eliminação da retenção hídrica pós-evento.
                   </p>
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl shrink-0">
          <Button fullWidth onClick={onClose} variant="secondary">
            ENTENDIDO, GENERAL
          </Button>
        </div>
      </div>
    </div>
  );
};