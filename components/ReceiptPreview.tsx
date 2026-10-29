"use client";

import React, { useMemo } from "react";
import { PrinterSettings, PAPER_WIDTH_PIXELS } from "@/types/receipt";

interface ReceiptPreviewProps {
  text: string;
  settings: PrinterSettings;
}

export default function ReceiptPreview({ text, settings }: ReceiptPreviewProps) {
  const { topLogo, topLogo2, topLogoMode = "both-side-by-side", bottomLogo, paperWidth, fontSize, smartFormatting } = settings;
  const previewPixelWidth = PAPER_WIDTH_PIXELS[paperWidth] || 283;

  // Font size scale class
  const baseFontSizeClass =
    fontSize === "compact"
      ? "text-[11px]"
      : fontSize === "large"
      ? "text-[13px]"
      : "text-[12px]";

  // Process text lines if smart formatting is enabled
  const renderedLines = useMemo(() => {
    if (!text.trim()) {
      return null;
    }

    const lines = text.split("\n");

    if (!smartFormatting) {
      return (
        <pre className={`font-mono ${baseFontSizeClass} leading-[1.4] text-black whitespace-pre-wrap break-words m-0`}>
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
            className="font-mono text-[12px] leading-[1.2] text-black tracking-tighter overflow-hidden select-none"
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
            className="font-mono font-bold text-[15px] leading-tight text-center text-black py-0.5 tracking-wide uppercase"
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
            className="font-mono font-bold text-[13px] leading-tight text-center text-black pt-1"
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
            className="font-mono font-semibold text-[13px] leading-tight text-center text-black py-0.5"
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
            className="font-mono text-[12px] text-center text-black pt-2 pb-1"
          >
            {trimmed}
          </div>
        );
      }

      // Default line: preserve monospace alignment
      return (
        <div
          key={index}
          className={`font-mono ${baseFontSizeClass} leading-[1.4] text-black whitespace-pre-wrap break-words`}
        >
          {line}
        </div>
      );
    });
  }, [text, smartFormatting, baseFontSizeClass]);

  // Render top logos based on settings
  const renderTopLogos = () => {
    const hasLogo1 = Boolean(topLogo);
    const hasLogo2 = Boolean(topLogo2);

    if (!hasLogo1 && !hasLogo2) return null;

    if (topLogoMode === "both-side-by-side" && hasLogo1 && hasLogo2) {
      return (
        <div className="receipt-top-logos flex items-center justify-between gap-2 pt-1 pb-2 px-1">
          {/* Logo 1: Lakdhanavi */}
          <div className="flex-1 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={topLogo!}
              alt="Lakdhanavi Logo"
              className="receipt-logo max-h-[34px] max-w-[125px] object-contain print:max-h-[8mm]"
            />
          </div>

          {/* Divider Dot / Vertical Separator */}
          <div className="h-6 w-px bg-slate-300 print:bg-black/40 opacity-70" />

          {/* Logo 2: Rividhanavi */}
          <div className="flex-1 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={topLogo2!}
              alt="Rividhanavi Logo"
              className="receipt-logo max-h-[34px] max-w-[125px] object-contain print:max-h-[8mm]"
            />
          </div>
        </div>
      );
    }

    if (topLogoMode === "both-stacked" && hasLogo1 && hasLogo2) {
      return (
        <div className="receipt-top-logos flex flex-col items-center justify-center gap-1.5 pt-1 pb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={topLogo!}
            alt="Logo 1"
            className="receipt-logo max-h-[32px] max-w-[140px] object-contain print:max-h-[7mm]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={topLogo2!}
            alt="Logo 2"
            className="receipt-logo max-h-[30px] max-w-[130px] object-contain print:max-h-[7mm]"
          />
        </div>
      );
    }

    if (topLogoMode === "rividhanavi-only" && hasLogo2) {
      return (
        <div className="receipt-top-logos flex items-center justify-center pt-1 pb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={topLogo2 || undefined}
            alt="Rividhanavi Logo"
            className="receipt-logo max-h-[40px] max-w-[140px] object-contain print:max-h-[9mm]"
          />
        </div>
      );
    }

    // Default: Single top logo (Lakdhanavi or custom)
    const singleLogo = hasLogo1 ? topLogo : topLogo2;
    if (!singleLogo) return null;

    return (
      <div className="receipt-top-logos flex items-center justify-center pt-1 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={singleLogo}
          alt="Company Logo"
          className="receipt-logo max-h-[40px] max-w-[150px] object-contain print:max-h-[9mm]"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full p-4 sm:p-6 bg-slate-200/70 rounded-2xl border border-slate-300 shadow-inner overflow-auto">
      {/* Paper width pill */}
      <div className="mb-3 px-3 py-1 bg-white/90 backdrop-blur-sm border border-slate-300 rounded-full text-[11px] font-mono text-slate-600 shadow-sm flex items-center gap-2 select-none print:hidden">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>
          Thermal Paper: <strong className="text-slate-800">{paperWidth}</strong> ({previewPixelWidth}px)
        </span>
      </div>

      {/* Realistic Paper Container */}
      <div
        className="receipt-preview relative bg-white text-black shadow-lg rounded-xs transition-all duration-200 ease-in-out border border-slate-300/60 print:border-none print:shadow-none print:rounded-none"
        style={{
          width: `${previewPixelWidth}px`,
          minHeight: "360px",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "12px",
          paddingBottom: "16px",
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

        {/* Top Logos (Small icons at the top of print) */}
        {renderTopLogos()}

        {/* Receipt Content */}
        {renderedLines ? (
          <div className="receipt-content-body font-mono select-text">
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

        {/* Bottom Logo (Footer Logo) */}
        {bottomLogo && (
          <div className="receipt-logo-container flex items-center justify-center pt-3 pb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bottomLogo || undefined}
              alt="Footer Logo"
              className="receipt-logo max-h-[30px] max-w-[100px] object-contain mx-auto print:max-h-[8mm]"
            />
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
