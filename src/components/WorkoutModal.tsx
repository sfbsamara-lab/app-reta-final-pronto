import React, { useEffect } from 'react';
import { X, Clock, Repeat, Flame, AlertCircle, Activity, ExternalLink, Lock, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from './Button';
import { UserPlan } from '../types';

interface WorkoutModalProps {
  onClose: () => void;
  onComplete: () => void;
  userPlan: UserPlan;
  onUpgradeRequest: () => void;
}

// ============================================================================
// BANCO DE DADOS RICO
// ============================================================================
const WORKOUT_DB = [
  {
    title: "Full Body Metabólico",
    focus: "Derretimento de Gordura Total",
    exercises: [
      { 
        id: "1", 
        name: "Polichinelos (Aquecimento)", 
        reps: "45 segundos contínuos", 
        steps: [
          "Inicie em pé, pés juntos e braços ao lado do corpo.",
          "Salte abrindo as pernas e elevando os braços acima da cabeça.",
          "Mantenha um ritmo constante e respiração controlada.",
          "Amorteça a queda na ponta dos pés para proteger os joelhos."
        ], 
        query: "como fazer polichinelo execução correta", 
        isPremium: false 
      },
      { 
        id: "2", 
        name: "Agachamento Livre", 
        reps: "3 séries de 15 repetições", 
        steps: [
          "Pés na largura dos ombros, pontas levemente para fora.",
          "Desça jogando o quadril para trás, como se fosse sentar numa cadeira.",
          "Mantenha o peito estufado e o olhar para frente.",
          "Desça até as coxas ficarem paralelas ao chão e suba explodindo."
        ], 
        query: "execução correta agachamento livre", 
        isPremium: false 
      },
      { 
        id: "3", 
        name: "Flexão de Braço (Push-up)", 
        reps: "3 séries de 10-12 repetições", 
        steps: [
          "Mãos apoiadas no chão, um pouco mais largas que os ombros.",
          "Mantenha o corpo reto (prancha), contraindo abdômen e glúteos.",
          "Desça o peito até quase tocar o chão.",
          "Se estiver difícil, apoie os joelhos no chão, mas mantenha a técnica."
        ], 
        query: "como fazer flexão de braço iniciante", 
        isPremium: true 
      },
      { 
        id: "4", 
        name: "Burpees (Desafio Final)", 
        reps: "Máximo possível em 1 min", 
        steps: [
          "Comece em pé, agache e apoie as mãos no chão.",
          "Jogue os pés para trás entrando em posição de prancha.",
          "Traga os pés de volta para perto das mãos rapidamente.",
          "Salte esticando o corpo todo. Repita sem parar."
        ], 
        query: "como fazer burpee para iniciantes tutorial", 
        isPremium: true 
      }
    ]
  },
  {
    title: "Inferiores de Aço",
    focus: "Definição de Pernas e Glúteos",
    exercises: [
      { 
        id: "1", 
        name: "Agachamento Sumô", 
        reps: "3 séries de 15 repetições", 
        steps: [
          "Afaste as pernas além da largura dos ombros.",
          "Gire a ponta dos pés para fora (45 graus).",
          "Desça mantendo o joelho na direção da ponta do pé.",
          "Foco total na parte interna da coxa e glúteos na subida."
        ], 
        query: "agachamento sumo execução correta", 
        isPremium: false 
      },
      { 
        id: "2", 
        name: "Afundo Alternado", 
        reps: "3 séries de 12 (cada perna)", 
        steps: [
          "Dê um passo largo para trás.",
          "Desça até o joelho de trás quase tocar o chão.",
          "O joelho da frente não deve passar muito da ponta do pé.",
          "Mantenha o tronco ereto e o abdômen travado."
        ], 
        query: "afundo alternado execução", 
        isPremium: false 
      },
      { 
        id: "3", 
        name: "Elevação Pélvica", 
        reps: "3 séries de 20 repetições", 
        steps: [
          "Deite de barriga para cima, joelhos dobrados.",
          "Suba o quadril contraindo forte o glúteo no topo.",
          "Segure a contração por 2 segundos lá em cima.",
          "Desça devagar sem encostar o bumbum no chão."
        ], 
        query: "elevação pélvica solo execução", 
        isPremium: true 
      },
      { 
        id: "4", 
        name: "Agachamento Isométrico", 
        reps: "Falha (O máximo que aguentar)", 
        steps: [
          "Apoie as costas completamente numa parede.",
          "Desça até as pernas formarem um ângulo de 90 graus.",
          "Segure a posição estática. Respire fundo e aguente a queimação.",
          "Não apoie as mãos nas pernas."
        ], 
        query: "agachamento isometrico parede", 
        isPremium: true 
      }
    ]
  },
  {
    title: "Upper Body & Core",
    focus: "Braços Definidos e Barriga Chapada",
    exercises: [
      { 
        id: "1", 
        name: "Prancha Alta (Toque no Ombro)", 
        reps: "30 segundos", 
        steps: [
          "Posição de flexão de braço, corpo reto.",
          "Tire uma mão do chão e toque o ombro oposto.",
          "Troque o lado. O segredo é NÃO deixar o quadril balançar.",
          "Contraia o abdômen com força total."
        ], 
        query: "prancha alta toque no ombro execução", 
        isPremium: false 
      },
      { 
        id: "2", 
        name: "Abdominal Remador", 
        reps: "3 séries de 15 repetições", 
        steps: [
          "Deite-se totalmente esticado.",
          "Suba o tronco e dobre os joelhos simultaneamente.",
          "Abrace os joelhos no topo do movimento.",
          "Estique o corpo todo novamente sem encostar os pés no chão."
        ], 
        query: "abdominal remador execução correta", 
        isPremium: false 
      },
      { 
        id: "3", 
        name: "Tríceps Banco", 
        reps: "3 séries de 12 repetições", 
        steps: [
          "Apoie as mãos numa cadeira ou sofá firme.",
          "Estique as pernas (mais difícil) ou dobre (mais fácil).",
          "Desça o quadril rente ao móvel.",
          "Suba empurrando com os braços, focando no 'tchauzinho'."
        ], 
        query: "triceps banco em casa execução", 
        isPremium: true 
      },
      { 
        id: "4", 
        name: "Mountain Climbers", 
        reps: "30 segundos intenso", 
        steps: [
          "Posição de prancha alta.",
          "Traga um joelho em direção ao peito e troque rápido.",
          "Simule uma corrida no chão.",
          "Mantenha o ritmo acelerado para elevar a frequência cardíaca."
        ], 
        query: "mountain climber execução correta", 
        isPremium: true 
      }
    ]
  }
];

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ onClose, onComplete, userPlan, onUpgradeRequest }) => {
  
  // Lógica segura de seleção do dia
  const dayIndex = new Date().getDate() % WORKOUT_DB.length;
  const todaysWorkout = WORKOUT_DB[dayIndex] || WORKOUT_DB[0];

  // Travar scroll do fundo
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalStyle; };
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg sm:rounded-2xl rounded-t-3xl relative shadow-2xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">
        
        {/* CABEÇALHO */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 backdrop-blur z-10 sm:rounded-t-2xl rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" /> {todaysWorkout.title}
            </h2>
            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mt-1">Foco: {todaysWorkout.focus}</p>
          </div>
          <button onClick={handleClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CONTEÚDO COM SCROLL */}
        <div className="overflow-y-auto p-5 space-y-8 flex-1 scroll-smooth">
           
           <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex gap-4 items-center mb-2">
              <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                <Activity className="w-6 h-6" />
              </div>
              <p className="text-xs text-blue-200 leading-relaxed">
                <strong>Instruções:</strong> Realize os exercícios em circuito. Descanse 45 segundos ao final de cada volta completa. Faça 3 a 4 voltas.
              </p>
           </div>

           {todaysWorkout.exercises.map((ex, i) => {
             const isLocked = ex.isPremium && userPlan === 'basic';
             
             return (
               <div key={ex.id} className="space-y-4 relative">
                 {/* Título do Exercício */}
                 <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-lg text-white flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-800 text-slate-400 font-mono text-xs font-bold">{i+1}</span> 
                      {ex.name}
                    </h3>
                    {ex.isPremium && <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.4)]">Premium</span>}
                 </div>

                 {isLocked ? (
                   /* Card Bloqueado Premium */
                   <div onClick={(e) => { e.stopPropagation(); onUpgradeRequest(); }} className="relative group cursor-pointer overflow-hidden rounded-xl bg-slate-950 border border-yellow-500/30 p-8 text-center transition-all hover:border-yellow-500/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 to-transparent opacity-50"></div>
                      <div className="relative z-10 flex flex-col items-center gap-3">
                         <div className="p-3 bg-slate-900 rounded-full border border-yellow-500/50 shadow-lg shadow-yellow-900/40">
                           <Lock className="w-6 h-6 text-yellow-500" />
                         </div>
                         <div>
                           <h4 className="text-white font-black text-lg uppercase italic">Exercício Bloqueado</h4>
                           <p className="text-slate-400 text-xs mt-1">Disponível apenas no Modo General</p>
                         </div>
                         <div className="mt-2 flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest border-b border-yellow-500/30 pb-0.5 group-hover:border-yellow-500 transition-colors">
                           Liberar Agora <ArrowRight className="w-3 h-3" />
                         </div>
                      </div>
                   </div>
                 ) : (
                   /* Conteúdo do Exercício (Liberado) */
                   <div className="space-y-4 animate-in fade-in duration-500">
                     {/* Imagem/Video Placeholder Tático */}
                     <a 
                       href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.query)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="block relative rounded-xl overflow-hidden aspect-video border border-slate-700 bg-slate-950 group hover:border-orange-500/50 transition-all"
                     >
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                           <PlayCircle className="w-12 h-12 text-slate-700 group-hover:text-orange-500 transition-colors mb-2" />
                           <p className="text-slate-500 text-xs font-mono uppercase tracking-widest group-hover:text-slate-300">
                             Ver Execução Tática <ExternalLink className="w-3 h-3 inline ml-1" />
                           </p>
                        </div>
                        
                        {/* Tags */}
                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-slate-800 text-[10px] text-white font-mono flex items-center gap-1">
                           {ex.reps.includes('segundos') || ex.reps.includes('min') ? <Clock className="w-3 h-3 text-orange-500"/> : <Repeat className="w-3 h-3 text-emerald-500"/>}
                           {ex.reps}
                        </div>
                     </a>

                     {/* Passos */}
                     <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Protocolo de Execução:</p>
                        <ol className="list-none space-y-2">
                          {ex.steps.map((step, k) => (
                            <li key={k} className="text-sm text-slate-300 flex gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ol>
                     </div>
                   </div>
                 )}
               </div>
             );
           })}

           {/* Aviso de Dor/Recuperação */}
           <div className="mt-8 border-t border-slate-800 pt-6">
              <div className="flex items-center gap-2 mb-3 text-red-400">
                 <AlertCircle className="w-5 h-5" />
                 <h4 className="font-bold uppercase text-sm tracking-wide">Biohack de Recuperação</h4>
              </div>
              <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl space-y-3">
                 <p className="text-sm text-slate-300">
                   <strong className="text-white">Dor vs. Lesão:</strong> Dor muscular tardia (24-48h após treino) é normal. Dor aguda durante o exercício é sinal de PARE.
                 </p>
                 <p className="text-sm text-slate-300">
                   <strong className="text-white">Medicamentos:</strong> <span className="text-red-400 font-bold underline decoration-red-900/50">Evite anti-inflamatórios</span> logo após treinar para não bloquear a hipertrofia.
                 </p>
              </div>
           </div>
           
           <div className="h-4"></div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 sm:rounded-b-2xl shrink-0">
          <Button 
            onClick={handleComplete} 
            fullWidth 
            className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            CONCLUIR TREINO DO DIA
          </Button>
        </div>
      </div>
    </div>
  );
};