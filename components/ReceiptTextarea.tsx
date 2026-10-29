"use client";

import React, { useRef } from "react";
import { ClipboardPaste, Trash2, FileText, Sparkles } from "lucide-react";
import { SAMPLE_RECEIPT_TEXT } from "@/types/receipt";

interface ReceiptTextareaProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export default function ReceiptTextarea({
  value,
  onChange,
  onClear,
}: ReceiptTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch {
      // Fallback: focus textarea for manual Ctrl+V
      textareaRef.current?.focus();
    }
  };

  const handleLoadSample = () => {
    onChange(SAMPLE_RECEIPT_TEXT);
  };

  const lineCount = value ? value.split("\n").length : 0;
  const charCount = value.length;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header toolbar */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <h2 className="font-semibold text-slate-800 text-sm">
            Paste Receipt Text
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            (Ctrl + V)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition active:scale-95"
            title="Paste text from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-indigo-600" />
            <span>Paste</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition active:scale-95"
            title="Load sample Power Apps fuel dispatch receipt"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sample Text</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!value}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            title="Clear text area"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[300px] lg:min-h-[460px] p-2 bg-slate-50/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste plain text copied from Power Apps receipt here (Ctrl+V)...&#10;&#10;Example:&#10;========================================&#10;       FUEL DISPATCH RECEIPT&#10;========================================&#10;Receipt No : FR-0023&#10;..."
          className="w-full h-full min-h-[300px] lg:min-h-[460px] p-4 text-xs font-mono bg-white border border-slate-200 rounded-xl resize-none text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-inner leading-relaxed transition"
          spellCheck={false}
          rows={12}
        />
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Ready for 75mm thermal print
        </span>
      </div>
    </div>
  );
}

