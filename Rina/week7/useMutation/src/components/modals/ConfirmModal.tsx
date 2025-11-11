import { useEffect, useRef } from "react";

type ConfirmProps = {
    open: boolean;
    title?: string;
    message: string;
    onConfirm?: () => void;
    onClose: () => void;
    confirmText?: string;
    cancelText?: string;
    single?: boolean;
}

export default function ConfirmModal({
    open, title = "" ,message, onConfirm, onClose,
    confirmText = "예", cancelText = "아니오", single= false,
}: ConfirmProps) {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!open) return;
        const handler = (e : MouseEvent) => {
            if (!dialogRef.current) return;
            if (!dialogRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onClose]);

    if (!open) return null;

    
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div 
                ref={dialogRef}
                className="relative w-[560px] max-w-[calc(100%-2rem)] rounded-2xl bg-[#2f333a] p-6 shadow-xl"
            >
                <button
                    className="absolute right-4 top-3 text-gray-300 hover:text-white cursor-pointer"
                    onClick={onClose}
                    aria-label="close"
                >
                    ✕
                </button>
                {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
                <p className="text-center text-gray-200 mb-6">{message}</p>
                <div className="flex items-center justify-center gap-4">
                    {single ? (
                        <button onClick={onClose} className="px-6 py-2 rounded bg-pink-600 hover:bg-pink-500 text-white">
                            {confirmText}
                        </button>
                    ): (
                        <>
                            <button onClick={onConfirm} className="px-6 py-2 rounded bg-gray-300 text-gray-900 hover:bg-white">{confirmText}</button>
                            <button onClick={onClose} className="px-6 py-2 rounded bg-pink-600 hover:bg-pink-500 text-white">{cancelText}</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}