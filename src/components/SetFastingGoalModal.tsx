import React, { useState, useEffect } from 'react';
import { X, Utensils, Loader2, AlertCircle } from 'lucide-react'; // Alterado de Droplets para Utensils
import { Button } from './Button';

interface SetFastingGoalModalProps {
  onClose: () => void;
  currentFastingGoal: number; // Alterado de currentWaterGoal
  onSave: (newGoal: number) => Promise<boolean>;
}

export const SetFastingGoalModal: React.FC<SetFastingGoalModalProps> = ({
  onClose,
  currentFastingGoal,
  onSave,
}) => {
  const [newGoal, setNewGoal] = useState(currentFastingGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNewGoal(currentFastingGoal);
  }, [currentFastingGoal]);

  const handleSave = async () => {
    setError(null);
    if (newGoal <= 0) {
      setError("A meta de jejum deve ser um valor positivo em horas.");
      return;
    }
    setLoading(true);
    const success = await onSave(newGoal);
    setLoading(false);
    if (success) {
      onClose();
    } else {
      setError("Erro ao salvar a meta de jejum. Tente novamente.");
      console.error("Erro no onSave do modal de jejum.");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 p-2">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <Utensils className="w-12 h-12 text-emerald-500 mx-auto mb-3" /> {/* Ícone e cor alterados */}
          <h2 className="text-xl font-black text-white uppercase italic">Definir Meta de Jejum</h2> {/* Título alterado */}
          <p className="text-xs text-slate-400 mt-1">Personalize sua meta diária de jejum em horas.</p> {/* Descrição alterada */}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="fastingGoal" className="text-[10px] font-bold text-slate-500 uppercase ml-1">Meta de Jejum (horas)</label> {/* Label alterado */}
            <input
              id="fastingGoal"
              type="number"
              min="1" // Jejum mínimo de 1 hora
              step="1" // Passos de 1 em 1 hora
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              className="w-full bg-slate-950 border border-emerald-500/30 rounded-lg py-3 px-4 text-white focus:border-emerald-500 focus:outline-none transition-colors" // Cor da borda alterada
              placeholder="Ex: 16" // Placeholder alterado
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