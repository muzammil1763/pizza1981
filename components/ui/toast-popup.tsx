'use client';

import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error:   <AlertCircle size={18} className="text-red-500 shrink-0" />,
  info:    <Info size={18} className="text-[#f5a623] shrink-0" />,
};

const styles = {
  success: 'bg-white border-l-4 border-green-500',
  error:   'bg-white border-l-4 border-red-500',
  info:    'bg-white border-l-4 border-[#f5a623]',
};

export function Toast({ message, type = 'info', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className="fixed top-20 right-4 z-[9999] animate-in slide-in-from-right-4 fade-in duration-300">
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl max-w-sm ${styles[type]}`}>
        {icons[type]}
        <p className="text-gray-800 text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition ml-1">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Hook for easy use ── */
import { useState, useCallback } from 'react';

interface ToastState { message: string; type: ToastType; id: number }

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="animate-in slide-in-from-right-4 fade-in duration-300">
          <div className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl max-w-sm ${styles[t.type]}`}>
            {icons[t.type]}
            <p className="text-gray-800 text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 transition ml-1">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return { show, ToastContainer };
}
