"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, Image as ImageIcon, FileText, ChevronDown, Check, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface DownloadButtonProps {
  receiptText: string;
  disabled?: boolean;
}

export default function DownloadButton({ receiptText, disabled = false }: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to get receipt filename
  const getReceiptFilename = (ext: string) => {
    const match = receiptText.match(/Receipt\s*(?:No|#)?\s*[:=]\s*([A-Za-z0-9_-]+)/i);
    const receiptId = match ? match[1].trim() : "receipt";
    return `${receiptId}-${new Date().toISOString().slice(0, 10)}.${ext}`;
  };

  // Download Receipt as PNG Image
  const handleDownloadPng = async () => {
    if (disabled || isDownloading) return;
    setIsDownloading(true);
    setIsOpen(false);

    try {
      const receiptEl = document.querySelector(".receipt-preview") as HTMLElement;
      if (!receiptEl) {
        throw new Error("Receipt preview element not found");
      }

      // Render high resolution PNG (pixelRatio: 2 for crisp thermal preview)
      const dataUrl = await toPng(receiptEl, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const fileName = getReceiptFilename("png");
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess("PNG Downloaded!");
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error) {
      console.error("Failed to generate receipt image:", error);
      alert("Failed to generate image. Please try again or check browser permissions.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Download Receipt as plain text (.txt)
  const handleDownloadTxt = () => {
    if (disabled) return;
    setIsOpen(false);

    try {
      const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = getReceiptFilename("txt");
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess("TXT Downloaded!");
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error) {
      console.error("Failed to download text:", error);
    }
  };

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      {/* Primary Action Button */}
      <button
        type="button"
        onClick={handleDownloadPng}
        disabled={disabled || isDownloading}
        className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-l-xl font-semibold text-sm transition-all shadow-md active:scale-[0.98] ${
          disabled
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-emerald-600/30"
        }`}
        title="Download Receipt as PNG Image"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Generating...</span>
          </>
        ) : downloadSuccess ? (
          <>
            <Check className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{downloadSuccess}</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 shrink-0" />
            <span>Download Receipt</span>
          </>
        )}
      </button>

      {/* Dropdown Toggle */}
      <button
        type="button"
        onClick={() => !disabled && !isDownloading && setIsOpen(!isOpen)}
        disabled={disabled || isDownloading}
        className={`px-2.5 py-3 rounded-r-xl border-l border-emerald-500/40 text-white font-semibold text-sm transition-all shadow-md ${
          disabled
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-slate-300"
            : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
        }`}
        title="Download options"
        aria-label="Download options"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn text-slate-800 text-xs">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Download Format
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition text-slate-700 font-medium"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span>Image (.PNG)</span>
              <span className="text-[10px] text-slate-400 font-normal">
                High-resolution 75mm thermal ticket
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition text-slate-700 font-medium"
          >
            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="flex flex-col">
              <span>Text File (.TXT)</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Plain text format
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

