import React, { useState, useEffect } from 'react';
import { X, Droplets, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface SetGoalsModalProps {
  onClose: () => void;
  currentWaterGoal: number;
  onSave: (newGoal: number) => Promise<boolean>;
}

export const SetGoalsModal: React.FC<SetGoalsModalProps> = ({
  onClose,
  currentWaterGoal,
  onSave,
}) => {
  const [newGoal, setNewGoal] = useState(currentWaterGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNewGoal(currentWaterGoal);
  }, [currentWaterGoal]);

  const handleSave = async () => {
    setError(null);
    if (newGoal <= 0) {
      setError("A meta de água deve ser um valor positivo.");
      return;
    }
    setLoading(true);
    const success = await onSave(newGoal);
    setLoading(false);
    if (success) {
      onClose();
    } else {
      setError("Erro ao salvar a meta. Tente novamente.");
      console.error("Erro no onSave do modal."); // Certifique-se que esta linha está presente
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 p-2">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <Droplets className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-white uppercase italic">Definir Meta de Água</h2>
          <p className="text-xs text-slate-400 mt-1">Personalize sua meta diária de hidratação.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="waterGoal" className="text-[10px] font-bold text-slate-500 uppercase ml-1">Meta de Água (ml)</label>
            <input
              id="waterGoal"
              type="number"
              min="500"
              step="100"
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              className="w-full bg-slate-950 border border-blue-500/30 rounded-lg py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Ex: 3000"
            />
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-xs animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Button fullWidth onClick={handleSave} disabled={loading} className="mt-4">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "SALVAR META"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
