import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { createAccessCode } from '../firebase';

interface AdminGeneratorProps {
  onClose: () => void;
}

export const AdminGenerator: React.FC<AdminGeneratorProps> = ({ onClose }) => {
  const [type, setType] = useState<'plan' | 'addon'>('plan');
  const [value, setValue] = useState('basic');
  const [customSuffix, setCustomSuffix] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTypeChange = (selectedValue: string) => {
    setValue(selectedValue);
    // Lógica explícita para definir o tipo baseada no valor selecionado
    if (selectedValue === 'christmas') {
      setType('addon');
    } else {
      setType('plan');
    }
  };

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const prefix = value.toUpperCase();
      
      // Sanitização brutal: remove espaços e caracteres especiais, força uppercase
      let cleanSuffix = customSuffix.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      
      // Se o sufixo ficou vazio após limpar (ou não foi digitado), gera aleatório
      if (!cleanSuffix) {
        cleanSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      }

      const finalCode = `${prefix}-${cleanSuffix}`;

      // 1 é o número de usos padrão. Poderíamos parametrizar isso futuramente.
      await createAccessCode(finalCode, type, value, 1);
      
      setGeneratedCode(finalCode);
    } catch (err) {
      console.error("Erro ao gerar código:", err);
      setError("Falha ao criar código. Verifique permissões ou conexão.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setGeneratedCode(null);
    setCustomSuffix('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl p-6 relative shadow-2xl shadow-black/50">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5"/>
        </button>
        
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white uppercase">Gerador Admin</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {!generatedCode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-bold">Tipo de Benefício</label>
              <select 
                value={value}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="basic">Plano Básico (Soldado)</option>
                <option value="general">Plano General (Premium)</option>
                <option value="christmas">Kit Natal (Add-on)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-bold">Sufixo Personalizado (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ex: VIP, PROMO (Sem espaços)"
                value={customSuffix}
                onChange={(e) => setCustomSuffix(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white uppercase focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
              />
              <p className="text-[10px] text-slate-500">Deixe em branco para gerar aleatório.</p>
            </div>

            <Button fullWidth onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4"/> : "GERAR CÓDIGO"}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
            <p className="text-slate-400 text-sm">Código gerado e salvo no banco:</p>
            <div 
              onClick={copyToClipboard}
              className="bg-emerald-900/20 border border-emerald-500/50 p-4 rounded-xl text-2xl font-mono font-bold text-emerald-400 cursor-pointer flex items-center justify-center gap-3 hover:bg-emerald-900/30 transition-colors group"
            >
              {generatedCode}
              {copied ? <Check className="w-5 h-5"/> : <Copy className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity"/>}
            </div>
            <p className="text-[10px] text-slate-500">Clique no código para copiar.</p>
            
            <Button variant="secondary" className="border border-slate-700" onClick={resetForm}>
              CRIAR NOVO
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};