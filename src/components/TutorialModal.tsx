import React, { useState, useCallback } from 'react';
import { Shield, Flame, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(async () => {
    setIsClosing(true);
    // Pequeno delay para evitar problemas de renderização simultânea em iOS
    await new Promise(resolve => setTimeout(resolve, 50));
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col" style={{ WebkitBackfaceVisibility: 'hidden', WebkitPerspective: '1000' }}>
        
        {/* Header Militar */}
        <div className="text-center mb-6 border-b border-slate-800 pb-4 flex-shrink-0">
          <div className="inline-block p-3 bg-slate-800 rounded-full mb-3 border border-slate-700">
            <Shield className="w-8 h-8 text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Briefing Operacional
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
            Instruções de Sobrevivência
          </p>
        </div>

        {/* Lista de Instruções */}
        <div className="space-y-4 mb-8 flex-grow">
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-900/20 rounded border border-orange-500/20 text-orange-500 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
<h3 className="text-white font-bold text-sm uppercase">O Fogo (Streak)</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Indica sua sequência de dias perfeitos. A cada ciclo completado, você desbloqueia <strong className="text-yellow-400">bônus exclusivos.</strong> Mas cuidado: se pular um dia, <strong className="text-orange-500">o fogo apaga e você volta ao zero.</strong> Não quebre a corrente.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-900/20 rounded border border-emerald-500/20 text-emerald-500 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase">Metas Diárias</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Água, Jejum e Treino. Complete a barra de progresso antes da meia-noite para evoluir. Agora você pode <strong className="text-blue-400">definir suas metas de hidratação e jejum</strong> para personalizar ainda mais seu plano.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-900/20 rounded border border-yellow-500/20 text-yellow-500 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase">Cadeados (Premium)</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Recursos avançados como o Arsenal de elite (Receitas e Áudios) e a <strong className="text-yellow-400">Biblioteca de Conteúdos</strong> estão disponíveis. Além disso, botões <strong className="text-yellow-400">"Ver Execução"</strong> em alguns treinos e no SOS levam a vídeos explicativos. Desbloqueie tudo ativando o <strong className="text-yellow-500">Modo General</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-900/20 rounded border border-red-500/20 text-red-500 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase">Botão SOS</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Comeu o que não devia? Aperte o botão vermelho para receber o protocolo de desintoxicação imediata.
              </p>
            </div>
          </div>

        </div>

        <div className="flex-shrink-0 mt-4">
          <Button fullWidth onClick={handleClose}>
            ENTENDIDO, INICIAR MISSÃO
          </Button>
        </div>

      </div>
    </div>
  );
};