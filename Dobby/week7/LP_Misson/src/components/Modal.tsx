import { PropsWithChildren, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

const Modal = ({ open, onClose, title, children }: PropsWithChildren<Props>) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-lg bg-zinc-900 border border-zinc-700 shadow-2xl">
          <div className="h-12 px-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="text-sm font-semibold">{title}</div>
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="h-8 w-8 rounded hover:bg-zinc-800"
            >
              ×
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
