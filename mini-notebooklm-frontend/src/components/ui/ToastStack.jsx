import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toastStack" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant] || Info;
        return (
          <div className={`toast toast-${toast.variant}`} key={toast.id}>
            <Icon size={18} />
            <div>
              <strong>{toast.title}</strong>
              {toast.message && <p>{toast.message}</p>}
            </div>
            <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss toast">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
