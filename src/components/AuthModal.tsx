import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ArrowRight, Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { loginUser, registerSimple, resetPassword } from '../firebase'; 

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, initialTab }) => {
  // Determina se a aba de cadastro deve aparecer (rota secreta ou parâmetro)
  const isBrowser = typeof window !== 'undefined';
  // Permite cadastro apenas quando a rota exata /cadastro-vip for acessada
  const allowedByUrl = isBrowser && window.location.pathname === '/cadastro-vip';
  const canShowRegister = initialTab === 'register' || allowedByUrl;

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>(initialTab === 'register' || allowedByUrl ? 'register' : 'login');

  // Caso o componente seja montado enquanto já estivermos na rota secreta, garante que a aba ativa seja 'register'
  useEffect(() => {
    if (allowedByUrl) setActiveTab('register');
  }, [allowedByUrl]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const cleanEmail = email.trim();
      const cleanPass = password.trim();

      if (activeTab === 'login') {
        if (!cleanEmail || !cleanPass) throw new Error("Preencha todos os campos.");
        
        const result = await loginUser(cleanEmail, cleanPass);
        if (result.error) throw new Error(result.error);
        
        onSuccess();

      } else if (activeTab === 'register') {
        if (cleanPass.length < 6) throw new Error("A senha deve ter no mínimo 6 caracteres.");

        const result = await registerSimple(cleanEmail, cleanPass);
        if (result.error) throw new Error(result.error);
        
        onSuccess();
        
      } else if (activeTab === 'reset') {
        if (!cleanEmail) throw new Error("Digite seu e-mail para recuperar.");
        
        const result = await resetPassword(cleanEmail); 
        if (result?.error) throw new Error(result.error);
        
        setSuccessMsg("Link de recuperação enviado para o e-mail!");
        setTimeout(() => setActiveTab('login'), 3000);
      }

    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Erro desconhecido. Tente novamente.";
      setError(msg.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md will-change-transform" style={{ WebkitBackfaceVisibility: 'hidden' }}>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-0 relative shadow-2xl overflow-y-auto max-h-[90vh]" style={{ WebkitBackfaceVisibility: 'hidden', WebkitPerspective: '1000' }}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 p-2">
          <X className="w-5 h-5" />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {/* Se estamos na rota secreta, só mostramos a aba de cadastro para evitar confusão */}
          {!allowedByUrl && (
            <button 
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-4 text-sm font-bold uppercase transition-colors ${activeTab === 'login' ? 'bg-slate-800 text-white border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Entrar
            </button>
          )}

          {canShowRegister && (
            <button 
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-4 text-sm font-bold uppercase transition-colors ${activeTab === 'register' ? 'bg-slate-800 text-white border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Cadastrar
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-white uppercase italic">
              {activeTab === 'login' && "Acessar Base"}
              {activeTab === 'register' && "Criar Conta"}
              {activeTab === 'reset' && "Recuperar Senha"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'login' && "Bem-vindo de volta."}
              {activeTab === 'register' && "Crie sua conta com e-mail e senha."}
              {activeTab === 'reset' && "Enviaremos um link para seu e-mail."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {activeTab !== 'reset' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder={activeTab === 'register' ? "Crie sua senha (mín 6)" : "Sua senha"}
                  />
                </div>
                {activeTab === 'login' && (
                  <div className="text-right">
                    <button type="button" onClick={() => setActiveTab('reset')} className="text-[10px] text-slate-500 hover:text-orange-500 transition-colors">
                      Esqueci minha senha
                    </button>
                  </div>
                )}
              </div>
            )}


            {error && (
              <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-xs animate-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg flex items-center gap-2 text-emerald-400 text-xs animate-in slide-in-from-top-1">
                <HelpCircle className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            <Button fullWidth type="submit" disabled={loading} className="mt-4 shadow-lg">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {activeTab === 'register' ? "CRIANDO CONTA..." : "PROCESSANDO..."}
                </>
              ) : (
                <>
                  {activeTab === 'login' && "ENTRAR"}
                  {activeTab === 'register' && "CRIAR CONTA"}
                  {activeTab === 'reset' && "ENVIAR LINK"}
                  {activeTab !== 'reset' && <ArrowRight className="w-4 h-4 ml-2" />}
                </>
              )}
            </Button>
            
            {activeTab === 'reset' && (
               <button type="button" onClick={() => setActiveTab('login')} className="w-full text-xs text-slate-500 py-2 hover:text-white transition-colors">
                 Voltar ao Login
               </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};