import { useEffect } from "react";
import { useToastStore } from "../../zustand/useToastStore";

const Toast = () => {
  const { message, type, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, message, hideToast]);

  if (!isVisible) return null;

  const typeStyles = {
    error: "bg-red-900 border-red-700 text-red-50",
    info: "bg-blue-900 border-blue-700 text-blue-50",
    success: "bg-green-900 border-green-700 text-green-50",
    progress: "bg-slate-900 border-indigo-700 text-indigo-50",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 border rounded-md shadow-xl font-mono text-sm ${typeStyles[type]}`}
      >
        {type === "progress" ? (
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span className="text-lg font-bold">
            {type === "error" ? "!" : type === "success" ? "✓" : "i"}
          </span>
        )}

        <p className="font-medium tracking-tight">{message}</p>

        <button
          onClick={hideToast}
          className="ml-4 opacity-60 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
