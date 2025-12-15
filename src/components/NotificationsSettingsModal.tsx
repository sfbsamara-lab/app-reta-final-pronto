import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from './Button';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface Props {
  onClose: () => void;
}

export const NotificationsSettingsModal: React.FC<Props> = ({ onClose }) => {
  const [water, setWater] = useState(true);
  const [workout, setWorkout] = useState(true);
  const [flame, setFlame] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load local settings fallback
    try {
      const raw = localStorage.getItem('notificationSettings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.water !== undefined) setWater(!!parsed.water);
        if (parsed.workout !== undefined) setWorkout(!!parsed.workout);
        if (parsed.flame !== undefined) setFlame(!!parsed.flame);
      }
    } catch (e) {}

    // Load from Firestore if logged in
    const loadRemote = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          if (data.notificationSettings) {
            setWater(data.notificationSettings.water ?? true);
            setWorkout(data.notificationSettings.workout ?? true);
            setFlame(data.notificationSettings.flame ?? true);
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar notificationSettings', e);
      }
    };

    loadRemote();
  }, []);

  const save = async () => {
    setLoading(true);
    const settings = { water, workout, flame };
    // Persist locally
    try { localStorage.setItem('notificationSettings', JSON.stringify(settings)); } catch (e) {}

    // Persist remotely if logged in
    try {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, 'users', user.uid);
        await setDoc(ref, { notificationSettings: settings }, { merge: true });
      }
    } catch (e) {
      console.warn('Erro ao salvar notificationSettings no Firestore', e);
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5"/> Notificações</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2"><X className="w-5 h-5"/></button>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Lembretes de água</div>
              <div className="text-xs text-slate-400">Receba lembretes para beber água nos horários programados.</div>
            </div>
            <input type="checkbox" checked={water} onChange={(e) => setWater(e.target.checked)} className="h-5 w-5" />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Lembretes de treino</div>
              <div className="text-xs text-slate-400">Receba um lembrete quando for hora do treino.</div>
            </div>
            <input type="checkbox" checked={workout} onChange={(e) => setWorkout(e.target.checked)} className="h-5 w-5" />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Lembretes 'Manter a chama'</div>
              <div className="text-xs text-slate-400">Lembrete ao final do dia para não perder o streak.</div>
            </div>
            <input type="checkbox" checked={flame} onChange={(e) => setFlame(e.target.checked)} className="h-5 w-5" />
          </label>

          <div className="flex justify-end mt-4">
            <Button onClick={save} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettingsModal;
