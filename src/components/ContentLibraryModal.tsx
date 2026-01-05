import React from 'react';
import { X, CupSoda, Utensils, HeartPulse } from 'lucide-react';
import { TeaItem, RecipeItem } from '../types';

interface ContentLibraryModalProps {
  onClose: () => void;
  detoxTeas: TeaItem[];
  sosRecipes: RecipeItem[];
  sosCardio: { title: string; duration: string; intensity: string; tags?: string[]; desc: string; steps: string[]; youtubeLink?: string }[];
}

export const ContentLibraryModal: React.FC<ContentLibraryModalProps> = ({
  onClose,
  detoxTeas,
  sosRecipes,
  sosCardio,
}) => {
  const [activeTab, setActiveTab] = React.useState<'teas' | 'recipes' | 'cardio'>('teas');


  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl flex flex-col max-h-[85vh] relative shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-800 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 p-2">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black text-white uppercase italic">Biblioteca de Conteúdo</h2>
          <p className="text-xs text-slate-400 mt-1">Explore chás, sucos, receitas e treinos.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('teas')}
            className={`flex-1 py-4 text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === 'teas' ? 'bg-slate-800 text-white border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <CupSoda className="w-4 h-4" /> Chás e Sucos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-4 text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === 'recipes' ? 'bg-slate-800 text-white border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Utensils className="w-4 h-4" /> Receitas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cardio')}
            className={`flex-1 py-4 text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === 'cardio' ? 'bg-slate-800 text-white border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <HeartPulse className="w-4 h-4" /> Treinos
          </button>


        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {activeTab === 'teas' && (
            <div className="space-y-4">
              {detoxTeas.map((tea, idx) => {
                const raw = tea.recipe || '';
                // Normalize: remove leading redundant 'Preparo:' and any 'Preparo:' that sits right before 'Ingredientes:'
                const normalized = raw.replace(/^Preparo:\s*/i, '').replace(/Preparo:\s*(?=Ingredientes:)/ig, '').trim();

                const ingredientesMatch = normalized.match(/Ingredientes:\s*([\s\S]*?)(?=(Preparo:|Como tomar:|Tomar:?|$))/i);
                const preparoMatch = normalized.match(/Preparo:\s*([\s\S]*?)(?=(Como tomar:|Tomar:?|$))/i);
                const tomarMatch = normalized.match(/(?:Como tomar:|Tomar:?)([\s\S]*)/i);

                return (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h4 className="font-bold text-white text-lg mb-1">{tea.name}</h4>
                    <p className="text-xs text-slate-400 italic mb-2">{tea.desc}</p>

                    {ingredientesMatch && (
                      <p className="text-sm text-slate-300 mb-1"><strong>Ingredientes:</strong> {ingredientesMatch[1].trim()}</p>
                    )}

                    {preparoMatch && (
                      <p className="text-sm text-slate-300 mb-1"><strong>Preparo:</strong> {preparoMatch[1].trim()}</p>
                    )}

                    {tomarMatch && (
                      <p className="text-sm text-slate-300"><strong>Como tomar:</strong> {tomarMatch[1].trim()}</p>
                    )}

                    {!ingredientesMatch && !preparoMatch && !tomarMatch && (
                      <p className="text-sm text-slate-300">{normalized}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="space-y-4">
              {sosRecipes.map((recipe, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-bold text-white text-lg mb-1">{recipe.name}</h4>
                  <p className="text-xs text-emerald-400 italic mb-2">Benefícios: {recipe.benefits}</p>
                  <p className="text-sm text-slate-300 mb-2">Ingredientes: {recipe.ingredients.join(', ')}</p>
                  <p className="text-sm text-slate-300 mb-2">Preparo: {recipe.prep}</p>

                  {recipe.allergens && recipe.allergens.length > 0 && (
                    <p className="text-sm text-amber-300 font-bold mt-2">Atenção: contém {recipe.allergens.join(', ')}.</p>
                  )}

                  {recipe.substitutions && recipe.substitutions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[12px] text-slate-400 font-bold mb-1">Sugestões de substituição:</p>
                      <ul className="list-disc list-inside text-sm text-slate-300">
                        {recipe.substitutions.map((s, sIdx) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}



          {activeTab === 'cardio' && (
            <div className="space-y-4">
              <div className="mb-2">
                {sosCardio.map((cardio, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h4 className="font-bold text-white text-lg mb-1">{cardio.title}</h4>
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300 uppercase">{cardio.duration}</span>
                      <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300 uppercase">{cardio.intensity}</span>
                    </div>
                    <p className="text-xs text-yellow-400 italic mb-2">{cardio.desc}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mb-4">
                      {cardio.steps.map((step, stepIdx) => (
                        <li key={stepIdx}>{step}</li>
                      ))}
                    </ul>
                    {cardio.youtubeLink && (
                      <button
                        onClick={() => window.open(cardio.youtubeLink, '_blank')}
                        className="w-full text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition-colors"
                      >
                        VER EXECUÇÃO
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
