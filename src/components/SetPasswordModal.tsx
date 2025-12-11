import React, { useState } from 'react';
import { Lock, Save, Loader2, ShieldAlert, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { updateUserPassword } from '../firebase';

export const SetPasswordModal: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    
    const result = await updateUserPassword(password);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in zoom-in duration-300">
        <div className="bg-slate-900 border border-emerald-500/50 w-full max-w-sm rounded-2xl p-8 text-center relative shadow-[0_0_50px_rgba(16,185,129,0.2)]">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-900/30 border-2 border-emerald-500 mb-6 animate-bounce">
             <CheckCircle2 className="w-10 h-10 text-emerald-500" />
           </div>
           <h2 className="text-2xl font-black text-white uppercase italic mb-2">Senha Definida!</h2>
           <p className="text-slate-400 text-sm">Acesso liberado. Preparando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in zoom-in duration-300">
      <div className="bg-slate-900 border border-orange-500/50 w-full max-w-sm rounded-2xl p-6 relative shadow-[0_0_50px_rgba(255,95,31,0.2)]">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border-2 border-orange-500 mb-4 shadow-lg shadow-orange-500/20">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic">
            Senha de Comando
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Defina sua senha pessoal e intransferível para acessar o app daqui pra frente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nova Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-white focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirmar Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-white focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Repita a senha"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-xs animate-in slide-in-from-top-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Button fullWidth type="submit" disabled={loading} className="mt-4 shadow-xl">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <Save className="w-4 h-4" /> GRAVAR ACESSO
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};