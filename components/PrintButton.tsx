"use client";

import React, { useEffect } from "react";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  onPrint?: () => void;
  disabled?: boolean;
}

export default function PrintButton({ onPrint, disabled = false }: PrintButtonProps) {
  const handlePrint = () => {
    if (disabled) return;
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // Keyboard shortcut Ctrl+P / Cmd+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled]);

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-[0.98] ${
        disabled
          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5"
      }`}
      title="Print thermal receipt (Ctrl+P)"
    >
      <Printer className="w-4 h-4 shrink-0" />
      <span>Print Receipt</span>
      <span className="hidden sm:inline-block text-[11px] font-mono opacity-70 bg-black/20 px-1.5 py-0.5 rounded">
        Ctrl+P
      </span>
    </button>
  );
}

