"use client";

import React, { useMemo } from "react";
import { PrinterSettings, PAPER_WIDTH_PIXELS } from "@/types/receipt";

interface ReceiptPreviewProps {
  text: string;
  settings: PrinterSettings;
}

export default function ReceiptPreview({ text, settings }: ReceiptPreviewProps) {
  const {
    paperWidth,
    fontSize,
    smartFormatting,
    allLettersBold = true,
    bottomFeedMm = 60, // Default 60mm = 6cm
  } = settings;

  const previewPixelWidth = PAPER_WIDTH_PIXELS[paperWidth] || 283;

  // Font size scale class
  const baseFontSizeClass =
    fontSize === "compact"
      ? "text-[11px]"
      : fontSize === "large"
      ? "text-[13px]"
      : "text-[12px]";

  const boldWeightClass = allLettersBold ? "font-bold" : "font-normal";

  // Process text lines if smart formatting is enabled
  const renderedLines = useMemo(() => {
    if (!text.trim()) {
      return null;
    }

    const lines = text.split("\n");

    if (!smartFormatting) {
      return (
        <pre className={`font-mono ${baseFontSizeClass} ${boldWeightClass} leading-[1.4] text-black whitespace-pre-wrap break-words m-0`}>
          {text}
        </pre>
      );
    }

    // Smart formatting
    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        return <div key={index} className="h-3 select-none" aria-hidden="true">&nbsp;</div>;
      }

      // Divider line: strings like ======================================== or ----------------------------------------
      const isDivider = /^(=+|-+|_+|\*+)$/.test(trimmed);
      if (isDivider) {
        return (
          <div
            key={index}
            className="font-mono font-bold text-[12px] leading-[1.2] text-black tracking-tighter overflow-hidden select-none"
          >
            {line}
          </div>
        );
      }

      // Main header line: e.g. "FUEL DISPATCH RECEIPT"
      const isMainHeader =
        trimmed.toUpperCase() === "FUEL DISPATCH RECEIPT" ||
        (trimmed === trimmed.toUpperCase() &&
          trimmed.length > 5 &&
          (lines[index - 1]?.trim().startsWith("=") || lines[index + 1]?.trim().startsWith("=")));

      if (isMainHeader) {
        return (
          <div
            key={index}
            className="font-mono font-black text-[15px] leading-tight text-center text-black py-0.5 tracking-wide uppercase"
          >
            {trimmed}
          </div>
        );
      }

      // Quantity Dispatched label
      const isQuantityLabel =
        trimmed.toLowerCase().includes("quantity dispatched") ||
        trimmed.toLowerCase() === "quantity";

      if (isQuantityLabel) {
        return (
          <div
            key={index}
            className="font-mono font-black text-[13px] leading-tight text-center text-black pt-1"
          >
            {trimmed}
          </div>
        );
      }

      // Large Quantity Value: e.g. "150.0 L" or preceded by "Quantity Dispatched"
      const prevTrimmed = lines[index - 1]?.trim().toLowerCase() || "";
      const isQuantityValue =
        (prevTrimmed.includes("quantity") && /^\d+(\.\d+)?(\s*[a-zA-Z]+)?$/.test(trimmed)) ||
        /^\d+(\.\d+)?\s*(L|LTR|LITERS|KG|UNITS|GAL)$/i.test(trimmed);

      if (isQuantityValue) {
        return (
          <div
            key={index}
            className="font-mono font-black text-[22px] leading-none text-center text-black py-1.5 tracking-tight"
          >
            {trimmed}
          </div>
        );
      }

      // Footer System line: e.g. "Fuel Management System"
      const isFooterTitle =
        trimmed.toLowerCase().includes("fuel management system") ||
        (trimmed === trimmed.toUpperCase() &&
          lines[index - 1]?.trim().startsWith("=") &&
          lines[index + 1]?.trim().startsWith("="));

      if (isFooterTitle) {
        return (
          <div
            key={index}
            className="font-mono font-bold text-[13px] leading-tight text-center text-black py-0.5"
          >
            {trimmed}
          </div>
        );
      }

      // Signature line or centered labels
      const isSignature =
        trimmed.toLowerCase().includes("signature") ||
        trimmed.toLowerCase().includes("approved by");

      if (isSignature && !line.includes(":")) {
        return (
          <div
            key={index}
            className={`font-mono ${boldWeightClass} text-[12px] text-center text-black pt-2 pb-1`}
          >
            {trimmed}
          </div>
        );
      }

      // Default body line: bold monospace alignment
      return (
        <div
          key={index}
          className={`font-mono ${baseFontSizeClass} ${boldWeightClass} leading-[1.4] text-black whitespace-pre-wrap break-words`}
        >
          {line}
        </div>
      );
    });
  }, [text, smartFormatting, baseFontSizeClass, boldWeightClass]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full p-4 sm:p-6 bg-slate-200/70 rounded-2xl border border-slate-300 shadow-inner overflow-auto">
      {/* Paper width & bold pill indicator */}
      <div className="mb-3 flex items-center gap-2 select-none print:hidden flex-wrap justify-center">
        <div className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-slate-300 rounded-full text-[11px] font-mono text-slate-600 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Thermal Paper: <strong className="text-slate-800">{paperWidth}</strong> ({previewPixelWidth}px)
          </span>
        </div>
        <div className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-[11px] font-mono font-bold text-indigo-700">
          Bold Print Mode: ON
        </div>
        <div className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-full text-[11px] font-mono text-slate-700">
          Tail: {bottomFeedMm / 10}cm
        </div>
      </div>

      {/* Realistic Paper Container */}
      <div
        className="receipt-preview relative bg-white text-black shadow-lg rounded-xs transition-all duration-200 ease-in-out border border-slate-300/60 print:border-none print:shadow-none print:rounded-none"
        style={{
          width: `${previewPixelWidth}px`,
          minHeight: "360px",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "14px",
          paddingBottom: "4px",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Subtle thermal paper texture top edge (jagged tear effect for screen preview) */}
        <div
          className="absolute -top-1 left-0 right-0 h-1 overflow-hidden opacity-30 pointer-events-none print:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle at 4px 0, transparent 3px, #cbd5e1 3.5px)",
            backgroundSize: "8px 4px",
            backgroundRepeat: "repeat-x",
          }}
        />

        {/* Receipt Content */}
        {renderedLines ? (
          <div className={`receipt-content-body font-mono ${boldWeightClass} select-text text-black`}>
            {renderedLines}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-slate-400 font-mono text-xs select-none border border-dashed border-slate-200 rounded my-4">
            <span className="text-2xl mb-2">🧾</span>
            <span className="font-semibold text-slate-500">Live Preview Area</span>
            <span className="mt-1 text-[11px] text-slate-400">
              Paste Power Apps text on the left to see your 75mm thermal receipt mockup
            </span>
          </div>
        )}

        {/* Paper Feed Tail after Fuel Management System section (Default 6cm, 8cm, 10cm, etc.) */}
        {bottomFeedMm > 0 && (
          <div
            className="receipt-feed-tail w-full relative flex items-center justify-center select-none"
            style={{ height: `${bottomFeedMm}mm`, minHeight: `${bottomFeedMm}mm` }}
          >
            {/* Subtle dashed guide line for screen preview */}
            <div className="w-full border-b border-dashed border-slate-300/70 print:hidden" />
            <span className="receipt-feed-guide absolute px-2 bg-white text-[10px] text-slate-400 font-mono tracking-tight print:hidden">
              ✂ {bottomFeedMm / 10}cm paper feed (cutter margin)
            </span>
          </div>
        )}

        {/* Subtle bottom receipt paper cut line */}
        <div
          className="absolute -bottom-1 left-0 right-0 h-1 overflow-hidden opacity-30 pointer-events-none print:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle at 4px 4px, transparent 3px, #cbd5e1 3.5px)",
            backgroundSize: "8px 4px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>
    </div>
  );
}
