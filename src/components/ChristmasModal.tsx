import React, { useEffect, useState } from 'react';
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

  const CHECKLIST_ITEMS = [
    'Provar a fantasia com antecedência e ajustar',
    'Separar acessórios e adereços que garantam conforto',
    'Preparar kit ressaca: água de coco, gengibre, banana',
    'Hidratação: 2L no dia anterior ao bloco',
    'Agendar cuidados de pele (esfoliação leve, hidratação)',
    'Escolher 3 palavras de confiança para motivação'
  ];

  const [fantasiaChecked, setFantasiaChecked] = useState<Record<number, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('fantasiaChecklist_v1') || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('fantasiaChecklist_v1', JSON.stringify(fantasiaChecked));
  }, [fantasiaChecked]);

  const toggleFantasia = (i: number) => setFantasiaChecked(prev => ({ ...prev, [i]: !prev[i] }));

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
            <p className="text-xs text-slate-300 mt-1">Protocolo prático de blindagem: táticas simples e diretas para reduzir retenção e acelerar o metabolismo antes do bloco.</p>
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
                   <p className="text-sm text-slate-300"><strong className="text-white">Álcool Inteligente:</strong> Antes: pré-hidrate com água e eletrólitos. Durante: para cada bebida alcoólica, beba 1 copo de água; prefira cervejas leves e drinks simples com menos açúcar; evite misturar destilados e intercale goles de água entre doses. Ao acordar: reponha eletrólitos e inclua proteína para acelerar a recuperação e reduzir inchaço.</p>
                </div>
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

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-amber-400">
              <Utensils className="w-5 h-5" />
              <h3 className="font-black uppercase tracking-widest text-sm">Menu Ressaca — Exclusivo Desafio Musa</h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div>
                <h4 className="text-white font-bold">Água de Coco com Gengibre</h4>
                <p className="text-xs text-emerald-400 italic">Benefícios: reposição de eletrólitos e hidratação rápida.</p>
                <p className="text-sm text-slate-300 mb-1"><strong>Ingredientes:</strong> 200ml água de coco, 1 colher de chá gengibre ralado</p>
                <p className="text-sm text-slate-300"><strong>Preparo:</strong> Misture e beba lentamente ao acordar; repita 1x por hora até sentir melhora.</p>
              </div>

              <div>
                <h4 className="text-white font-bold">Suco de Couve com Abacaxi</h4>
                <p className="text-xs text-emerald-400 italic">Benefícios: reposição de vitaminas, ação anti-inflamatória e digestiva.</p>
                <p className="text-sm text-slate-300 mb-1"><strong>Ingredientes:</strong> 1 folha de couve, 1 fatia média de abacaxi, 200ml água de coco, hortelã a gosto.</p>
                <p className="text-sm text-slate-300"><strong>Preparo:</strong> Bata tudo no liquidificador com gelo; não coe para preservar fibras; beba em goles curtos.</p>
              </div>

              <div>
                <h4 className="text-white font-bold">Caldo Leve e Rápido</h4>
                <p className="text-xs text-emerald-400 italic">Benefícios: reidratação com sódio e reposição de aminoácidos.</p>
                <p className="text-sm text-slate-300 mb-1"><strong>Ingredientes:</strong> 400ml caldo de frango caseiro (coxa), cenoura, cebola, sal moderado.</p>
                <p className="text-sm text-slate-300"><strong>Preparo:</strong> Ferva os ingredientes por 20–30min; coe e consuma morno em pequenas colheradas para repor eletrólitos sem cansar o estômago.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-yellow-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-black uppercase tracking-widest text-sm">Bronzeamento Seguro</h3>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-sm text-slate-300">
               <p><strong>Dicas:</strong> Exposição gradual ao sol (15–30 min por dia), use FPS adequado para seu tipo de pele; hidrate a pele com óleo ou loção leve após banho. Na dieta, inclua fontes de betacaroteno (cenoura, abóbora, mamão) 7–10 dias antes para intensificar e manter a cor de forma saudável.</p>
            </div>

            <div className="flex items-center gap-2 text-pink-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-black uppercase tracking-widest text-sm">Checklist de Fantasia</h3>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
               <p className="text-sm text-slate-300">Marque seus itens e acompanhe o progresso: materiais, prova, acessórios e autoestima.</p>
               <div className="space-y-2">
                  {CHECKLIST_ITEMS.map((it, idx) => (
                    <label key={idx} className="flex items-center gap-3">
                      <input type="checkbox" checked={!!fantasiaChecked[idx]} onChange={() => toggleFantasia(idx)} className="h-4 w-4" />
                      <span className={`text-sm ${fantasiaChecked[idx] ? 'line-through text-slate-500' : 'text-slate-300'}`}>{it}</span>
                    </label>
                  ))}
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