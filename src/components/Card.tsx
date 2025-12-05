import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick, active }) => (
  <div 
    onClick={onClick}
    className={`
      bg-slate-900/80 backdrop-blur-md border rounded-xl p-5 shadow-xl relative overflow-hidden
      ${active ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-800'}
      ${onClick ? 'cursor-pointer active:scale-[0.98] transition-all hover:border-slate-600' : ''} 
      ${className}
    `}
  >
    {children}
  </div>
);