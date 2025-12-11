import React, { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number; // em milissegundos, padrão 5000ms
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type];

  const borderColor = {
    success: 'border-emerald-700',
    error: 'border-red-700',
    info: 'border-blue-700',
    warning: 'border-yellow-700',
  }[type];

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 max-w-sm w-full p-4 rounded-lg shadow-lg flex items-center justify-between z-[100] animate-in fade-in slide-in-from-top-full duration-300 ${bgColor} border ${borderColor} text-white`}
    >
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
