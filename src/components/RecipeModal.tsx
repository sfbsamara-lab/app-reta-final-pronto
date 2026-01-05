import React, { useMemo } from 'react';
import { X, ChefHat, Leaf, Flame, ArrowRight, Utensils, Info } from 'lucide-react';
import { Button } from './Button';
import { LunchItem, TeaItem } from '../types';

// Interface para o Chá (deve bater com o que definimos no App.tsx)
interface Tea {
  name: string;
  desc: string;
  recipe: string;
}

interface RecipeModalProps {
  onClose: () => void;
  dailyTea?: Tea; // Opcional, caso você esqueça de passar no App.tsx
}

// --- BANCO DE DADOS DE ALMOÇOS (Simulado localmente) ---
const METABOLIC_LUNCHES = [
  {
    name: "Omelete de Forno Proteico",
    calories: "350 kcal",
    time: "15 min",
    ingredients: ["3 ovos inteiros", "Espinafre a gosto", "1 colher de cottage", "Tomate cereja"],
    prep: "Bata os ovos com cottage. Misture os vegetais. Asse por 15min ou faça na frigideira untada com azeite.",
    allergens: ["ovos", "laticínios"],
    substitutions: ["Substituir ovos: 2 colheres de sopa de farinha de grão-de-bico + água (ovo vegano) ou tofu mexido", "Substituir cottage: tofu amassado ou queijo vegano"]
  },
  {
    name: "Frango Grelhado com Purê de Abóbora",
    calories: "400 kcal",
    time: "20 min",
    ingredients: ["150g peito de frango", "Limão e páprica", "200g abóbora cabotiá cozida", "Canela em pó"],
    prep: "Tempere o frango e grelhe. Amasse a abóbora cozida com um garfo e finalize com uma pitada de canela (termogênico).",
    allergens: ["frango"],
    substitutions: ["Substituir frango por 150g tofu grelhado ou 150g grão-de-bico assado para versão vegana"]
  },
  {
    name: "Salada de Atum Power",
    calories: "320 kcal",
    time: "5 min",
    ingredients: ["1 lata de atum em água", "Mix de folhas verdes", "Pepino japonês", "1 colher de azeite extra virgem"],
    prep: "Escorra o atum. Misture tudo em um bowl. O azeite deve ser adicionado apenas na hora de comer.",
    allergens: ["peixe"],
    substitutions: ["Substituir atum por 1/2 xícara de grão-de-bico cozido para versão vegana"]
  },
  {
    name: "Carne Moída com Vagem",
    calories: "380 kcal",
    time: "15 min",
    ingredients: ["150g patinho moído", "1 xícara de vagem picada", "Alho e cebola", "Pimenta do reino"],
    prep: "Refogue a carne com temperos. Quando estiver quase pronta, adicione a vagem e deixe cozinhar no vapor da carne.",
    allergens: ["carne"],
    substitutions: ["Substituir carne por lentilha cozida ou proteína de soja texturizada para versão vegana"]
  }
];

export const RecipeModal: React.FC<RecipeModalProps> = ({ onClose, dailyTea }) => {
  // Seleciona o almoço baseado no dia do mês (para ser consistente com o chá)
  const todaysLunch: LunchItem = useMemo(() => {
    const dayIndex = new Date().getDate();
    return METABOLIC_LUNCHES[dayIndex % METABOLIC_LUNCHES.length];
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl relative shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Fixo */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500">
               <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">Cardápio do Dia</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Combinação Estratégica</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800/50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="overflow-y-auto p-5 space-y-6">
          
          {/* SEÇÃO 1: ALMOÇO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-yellow-500 bg-yellow-950/30 px-2 py-1 rounded border border-yellow-500/20 uppercase">Almoço</span>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {todaysLunch.calories}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-100">{todaysLunch.name}</h3>
            
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <div className="mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                  <Utensils className="w-3 h-3"/> Ingredientes
                </p>
                <ul className="space-y-1.5">
                  {todaysLunch.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="block w-1 h-1 bg-yellow-500 rounded-full mt-2 shrink-0"></span>
                      {ing}
                    </li>
                  ))}
                </ul>

                {Array.isArray((todaysLunch as any).allergens) && (todaysLunch as any).allergens.length > 0 && (
                  <p className="text-sm text-amber-300 font-bold mt-3">Atenção: contém {(todaysLunch as any).allergens.join(', ')}.</p>
                )}

                {Array.isArray((todaysLunch as any).substitutions) && (todaysLunch as any).substitutions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[12px] text-slate-400 font-bold mb-1">Sugestões de substituição:</p>
                    <ul className="list-disc list-inside text-sm text-slate-300">
                      {(todaysLunch as any).substitutions.map((s: string, sIdx: number) => (
                        <li key={sIdx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: CHÁ (Se disponível) */}
          {dailyTea && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-xs font-black text-green-500 bg-green-950/30 px-2 py-1 rounded border border-green-500/20 uppercase">Bebida Auxiliar</span>
              </div>

              <div className="bg-gradient-to-br from-green-950/40 to-slate-900 border border-green-900/50 rounded-xl p-4 relative overflow-hidden">
                <Leaf className="absolute -right-4 -top-4 w-24 h-24 text-green-900/20 rotate-12" />
                
                <h3 className="text-lg font-bold text-green-100 relative z-10">{dailyTea.name}</h3>
                <p className="text-xs text-green-400 mb-3 relative z-10">{dailyTea.desc}</p>
                
                <div className="bg-black/20 p-3 rounded-lg border border-white/5 relative z-10">
                   <p className="text-xs text-slate-300 font-mono"><span className="text-green-500 font-bold">RECEITA:</span> {dailyTea.recipe}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-900/20 border border-blue-800/30 p-3 rounded-lg flex gap-3 items-start">
             <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-200">
               <span className="font-bold">Dica de Ouro:</span> Evite líquidos 30min antes e depois da refeição para otimizar a digestão e absorção de nutrientes.
             </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/95 rounded-b-2xl">
          <Button fullWidth onClick={onClose}>
            Entendido <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};