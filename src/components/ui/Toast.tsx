/**
 * GRAVEN - Toast Component
 * Toast notifications with portal and auto-dismiss
 */

import { useState, createContext, useContext, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string | undefined;
  duration: number | undefined;
  action: {
    label: string;
    onClick: () => void;
  } | undefined;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastProvider({ children, maxToasts = 5, position = 'top-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newToast: Toast = { ...toast, id, message: toast.message ?? undefined, duration: toast.duration ?? undefined, action: toast.action ?? undefined };

    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts);
      return updated;
    });

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration ?? 5000);
    }

    return id;
  };

  const removeToast = (id: string): void => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const containerStyles = twMerge(
    'fixed z-[var(--z-tooltip)] flex flex-col gap-2 pointer-events-none',
    positionStyles[position]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <div className={containerStyles} pointer-events="auto" aria-live="polite" aria-atomic="true">
          {toasts.map(toast => <ToastItem key={toast.id} toast={toast} onClose={removeToast} />)}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <AlertCircle size={20} className="text-red-400" />,
    warning: <AlertTriangle size={20} className="text-yellow-400" />,
    info: <Info size={20} className="text-blue-400" />,
  };

  const borderColors = {
    success: 'border-green-500/50',
    error: 'border-red-500/50',
    warning: 'border-yellow-500/50',
    info: 'border-blue-500/50',
  };

  return (
    <div
      className={twMerge(
        'liquid-glass rounded-xl p-4 min-w-[300px] max-w-md shadow-xl',
        'animate-slide-down',
        'flex items-start gap-3 pointer-events-auto',
        borderColors[toast.type]
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-white/70">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onClose(toast.id);
            }}
            className="mt-2 text-sm font-medium text-[var(--color-accent)] hover:text-white transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function useToastHelpers() {
  const { addToast, removeToast } = useToast();

  return {
    success: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'success', title, message: message ?? undefined, duration: 5000, action: undefined, ...options }),
    error: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'error', title, message: message ?? undefined, duration: 5000, action: undefined, ...options }),
    warning: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'warning', title, message: message ?? undefined, duration: 5000, action: undefined, ...options }),
    info: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'info', title, message: message ?? undefined, duration: 5000, action: undefined, ...options }),
    dismiss: removeToast,
  };
}