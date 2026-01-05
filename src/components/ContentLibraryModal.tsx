import React, { useState } from 'react';
import { X, CupSoda, Utensils, HeartPulse } from 'lucide-react';

interface ContentLibraryModalProps {
  onClose: () => void;
  detoxTeas: { name: string; desc: string; recipe: string }[];
  sosRecipes: { name: string; ingredients: string[]; prep: string; benefits: string; tags?: string[] }[];
  sosCardio: { title: string; duration: string; intensity: string; tags?: string[]; desc: string; steps: string[]; youtubeLink?: string }[];
}

export const ContentLibraryModal: React.FC<ContentLibraryModalProps> = ({
  onClose,
  detoxTeas,
  sosRecipes,
  sosCardio,
}) => {
  const [activeTab, setActiveTab] = useState<'teas' | 'recipes' | 'cardio' | 'recovery'>('teas');
  const [secaAbada, setSecaAbada] = useState(false); // Modo Seca Abadá: filtra por tags HIIT/Cardio/Metabólico


  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl flex flex-col max-h-[85vh] relative shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-800 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 p-2">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black text-white uppercase italic">Biblioteca de Conteúdo</h2>
          <p className="text-xs text-slate-400 mt-1">Explore chás, receitas e treinos.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('teas')}
            className={`flex-1 py-4 text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === 'teas' ? 'bg-slate-800 text-white border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <CupSoda className="w-4 h-4" /> Chás
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

          <button
            type="button"
            onClick={() => setActiveTab('recovery')}
            className={`flex-1 py-4 text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === 'recovery' ? 'bg-slate-800 text-white border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <CupSoda className="w-4 h-4" /> Ressaca
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {activeTab === 'teas' && (
            <div className="space-y-4">
              {detoxTeas.map((tea, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-bold text-white text-lg mb-1">{tea.name}</h4>
                  <p className="text-xs text-slate-400 italic mb-2">{tea.desc}</p>
                  <p className="text-sm text-slate-300">Preparo: {tea.recipe}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="space-y-4">
              {sosRecipes.map((recipe, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-bold text-white text-lg mb-1">{recipe.name}</h4>
                  <p className="text-xs text-emerald-400 italic mb-2">Benefícios: {recipe.benefits}</p>
                  <p className="text-sm text-slate-300 mb-2">Ingredientes: {recipe.ingredients.join(', ')}</p>
                  <p className="text-sm text-slate-300">Preparo: {recipe.prep}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="space-y-4">
              {sosRecipes.filter(r => /ressaca|ressaca/i.test(r.name) || /ressaca/i.test(r.benefits || '') || (r.tags || []).includes('Recovery')).map((recipe, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-bold text-white text-lg mb-1">{recipe.name}</h4>
                  <p className="text-xs text-emerald-400 italic mb-2">Benefícios: {recipe.benefits}</p>
                  <p className="text-sm text-slate-300 mb-2">Ingredientes: {recipe.ingredients.join(', ')}</p>
                  <p className="text-sm text-slate-300">Preparo: {recipe.prep}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cardio' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setSecaAbada(!secaAbada)} className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${secaAbada ? 'bg-carnival-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>Modo Seca Abadá</button>
                {secaAbada && <span className="text-[10px] text-slate-400">Filtrando: HIIT • Cardio • Metabólico</span>}
              </div>
              {(secaAbada ? sosCardio.filter(c => (c.tags || []).some(t => ['HIIT','Cardio','Metabólico'].includes(t))) : sosCardio).map((cardio, idx) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
