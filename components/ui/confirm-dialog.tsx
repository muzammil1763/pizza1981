'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type DialogType = 'confirm' | 'alert' | 'info';

interface DialogOptions {
  title?: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

let showDialogFn: ((options: DialogOptions) => void) | null = null;

export function showConfirm(message: string, onConfirm?: () => void, onCancel?: () => void) {
  if (showDialogFn) {
    showDialogFn({
      message,
      type: 'confirm',
      confirmText: 'OK',
      cancelText: 'Cancel',
      onConfirm,
      onCancel,
    });
  }
}

export function showAlert(message: string, onConfirm?: () => void) {
  if (showDialogFn) {
    showDialogFn({
      message,
      type: 'alert',
      confirmText: 'OK',
      onConfirm,
    });
  }
}

export function showInfo(message: string, title?: string, onConfirm?: () => void) {
  if (showDialogFn) {
    showDialogFn({
      title,
      message,
      type: 'info',
      confirmText: 'Got it',
      onConfirm,
    });
  }
}

export function ConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    message: '',
    type: 'confirm',
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  useEffect(() => {
    showDialogFn = (opts: DialogOptions) => {
      setOptions(opts);
      setIsOpen(true);
    };

    return () => {
      showDialogFn = null;
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    options.onConfirm?.();
  };

  const handleCancel = () => {
    setIsOpen(false);
    options.onCancel?.();
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch (options.type) {
      case 'alert':
        return <AlertCircle size={48} className="text-red-500" />;
      case 'info':
        return <Info size={48} className="text-blue-500" />;
      default:
        return <AlertCircle size={48} className="text-[#f5a623]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-xl font-bold text-[#1e3a5f]">
              {options.title || (options.type === 'alert' ? 'Alert' : options.type === 'info' ? 'Information' : 'Confirm')}
            </h3>
          </div>
          {options.type !== 'alert' && (
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{options.message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          {options.type === 'confirm' && (
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 rounded-full border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold"
            >
              {options.cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className={`flex-1 rounded-full font-semibold ${
              options.type === 'alert'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-[#f5a623] hover:bg-[#e09510]'
            } text-white`}
          >
            {options.confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
