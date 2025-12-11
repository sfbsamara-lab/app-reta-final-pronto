import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'danger' | 'outline-danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/40 border border-orange-500/20",
  secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-lg",
  gold: "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black shadow-lg shadow-yellow-500/20 border border-yellow-400/50",
  danger: "bg-red-900/80 text-red-100 border border-red-500 hover:bg-red-800 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse-fast",
  "outline-danger": "bg-transparent border border-red-500 text-red-500 hover:bg-red-950"
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "", 
  fullWidth = false,
  type = "button",
  disabled,
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-lg font-black transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";
  const interactiveStyles = !disabled ? "active:scale-95 cursor-pointer" : "";

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${interactiveStyles} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};