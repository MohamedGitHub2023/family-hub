"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-md h-[90dvh]",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`relative w-full ${sizeMap[size]} mx-auto bg-white rounded-t-3xl animate-slide-up overflow-hidden flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialogue"}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Fermer"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <div className="flex justify-end px-4 pt-4">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Fermer"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        )}

        {/* Drag indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>
  );
}
