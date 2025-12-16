import React, { useMemo, useState } from 'react';
import { X, BarChart } from 'lucide-react';
import { Button } from './Button';
import { DailyProgress } from '../types';

interface Props {
  onClose: () => void;
  history: DailyProgress[];
  waterGoal?: number;
}

export const ProgressHistoryModal: React.FC<Props> = ({ onClose, history, waterGoal = 3000 }) => {
  const [view, setView] = useState<'list' | 'chart'>('list');

  const lastDays = useMemo(() => {
    return [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 30);
  }, [history]);

  const maxWater = useMemo(() => Math.max(...(lastDays.map(d => d.water) || [waterGoal]), waterGoal), [lastDays, waterGoal]);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><BarChart className="w-5 h-5"/> Histórico de Progresso</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setView(view === 'list' ? 'chart' : 'list')} className="text-sm text-slate-300 px-3 py-1 rounded hover:bg-slate-800">{view === 'list' ? 'Ver gráfico' : 'Ver lista'}</button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2"><X className="w-5 h-5"/></button>
          </div>
        </div>

        {view === 'list' && (
          <div className="max-h-[60vh] overflow-y-auto border border-slate-800 rounded-lg p-2">
            {lastDays.length === 0 ? (
              <p className="text-sm text-slate-400 p-4 text-center">Nenhum registro ainda.</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {lastDays.map((day) => (
                  <div key={day.date} className="p-3 flex items-center justify-between">
                    <div className="text-sm text-slate-200 font-bold">{new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-blue-300">💧 {Math.round(day.water/1000)}L</div>
                      <div className={`text-sm ${day.fasting ? 'text-emerald-400' : 'text-slate-600'}`}>{day.fasting ? '⏳ Jejum' : '⛔ Jejum'}</div>
                      <div className={`text-sm ${day.workout ? 'text-orange-400' : 'text-slate-600'}`}>{day.workout ? '🔥 Treino' : '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'chart' && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="w-full h-48 flex items-end gap-2">
              {lastDays.length === 0 && <p className="text-sm text-slate-400">Nenhum dado para mostrar.</p>}
              {lastDays.map((d) => {
                const height = Math.max(2, Math.round((d.water / maxWater) * 100));
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-slate-800 rounded-t-md" style={{ height: `${height}%` }} />
                    <div className="text-[10px] text-slate-400 mt-2">{new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-slate-400">Barra representa ingestão de água relativa à meta ({Math.round(waterGoal/1000)}L).</div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressHistoryModal;
