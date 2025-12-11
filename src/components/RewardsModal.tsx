import React, { useState, useEffect } from 'react';
import { X, Lock, Trophy, ChevronDown, ChevronUp, Gift } from 'lucide-react';
import { Button } from './Button';

interface RewardsModalProps {
  streak: number;
  onClose: () => void;
}

const REWARDS = [
  {
    days: 7,
    title: "Protocolo Seca-Pochete",
    desc: "3 Sucos secretos para acelerar o metabolismo.",
    content: "1. O Verde Radioativo: 1 maçã verde + 1 couve + gengibre + 1/2 limão.\n\n2. O Vermelho Termogênico: Melancia + pimenta caiena + linhaça."
  },
  {
    days: 14,
    title: "Hack Mental Anti-Doce",
    desc: "Técnica de 3 minutos para matar a vontade de açúcar.",
    content: "Quando a fissura bater:\n1. Beba água gelada (choque térmico).\n2. Escove os dentes (menta corta paladar doce).\n3. Espere 10min."
  },
  {
    days: 21,
    title: "Pizza Sem Culpa",
    desc: "A Regra 80/20 para refeição livre.",
    content: "No dia do lixo:\n1. Treino de perna intenso 2h antes.\n2. Proteína magra durante o dia.\n3. Muita água antes da refeição."
  }
];

export const RewardsModal: React.FC<RewardsModalProps> = ({ streak, onClose }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const toggleExpand = (idx: number, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    setExpandedId(expandedId === idx ? null : idx);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl flex flex-col max-h-[85vh] relative shadow-2xl">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-800 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-block p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic">Arsenal de Guerra</h2>
          <p className="text-xs text-slate-400 mt-1">Sua disciplina desbloqueia estratégias.</p>
        </div>

        {/* Lista */}
        <div className="p-4 space-y-3 overflow-y-auto bg-slate-900/50">
          {REWARDS.map((item, idx) => {
            const isUnlocked = streak >= item.days;
            const isExpanded = expandedId === idx;
            const daysLeft = Math.max(0, item.days - streak);

            return (
              <div 
                key={idx}
                onClick={() => toggleExpand(idx, isUnlocked)}
                className={`relative rounded-xl border transition-all overflow-hidden ${isUnlocked ? 'bg-slate-900 border-yellow-500/30 cursor-pointer' : 'bg-slate-950/50 border-slate-800 opacity-70 cursor-not-allowed'}`}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isUnlocked ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-slate-900 border-slate-700 text-slate-600'}`}>
                    {isUnlocked ? <Gift className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-2 rounded">{item.days} Dias</span>
                      {!isUnlocked && <span className="text-[10px] text-orange-500 font-bold uppercase">Faltam {daysLeft}</span>}
                      {isUnlocked && (isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>)}
                    </div>
                    <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                  </div>
                </div>

                {isUnlocked && isExpanded && (
                  <div className="px-4 pb-4 animate-in slide-in-from-top-2">
                    <div className="bg-yellow-950/20 border border-yellow-500/10 rounded-lg p-3">
                      <p className="text-sm text-slate-300 whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <Button fullWidth onClick={onClose} variant="secondary">Voltar ao Foco</Button>
        </div>
      </div>
    </div>
  );
};