import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;
        const iconColor = isSuccess ? 'var(--success)' : isError ? 'var(--danger)' : 'var(--purple-400)';

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} color={iconColor} style={{ flexShrink: 0, marginTop: 1 }} />
            <div className="toast-message">{toast.message}</div>
            <button className="toast-dismiss" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
