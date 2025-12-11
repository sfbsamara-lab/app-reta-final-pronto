import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { Card } from './Card';

interface LockedFeatureProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

export const LockedFeature: React.FC<LockedFeatureProps> = ({ title, subtitle, onClick }) => (
  <div onClick={onClick} className="relative group cursor-pointer transition-all hover:-translate-y-1">
    {/* Overlay */}
    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center border border-slate-800/50 rounded-xl group-hover:bg-slate-950/60 transition-colors">
      <div className="bg-slate-900 p-3 rounded-full border border-yellow-500/30 mb-2 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.2)]">
        <Lock className="w-5 h-5 text-yellow-500" />
      </div>
      <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Premium Only</span>
    </div>
    
    {/* Background Content (Blurred) */}
    <Card className="opacity-30 pointer-events-none grayscale">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-slate-800 text-slate-400">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-200">{title}</h4>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </Card>
  </div>
);