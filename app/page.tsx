"use client";

import React, { useState } from "react";
import { Settings, Info, CheckCircle2 } from "lucide-react";
import ReceiptTextarea from "@/components/ReceiptTextarea";
import ReceiptPreview from "@/components/ReceiptPreview";
import PrintButton from "@/components/PrintButton";
import DownloadButton from "@/components/DownloadButton";
import SettingsModal from "@/components/SettingsModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DEFAULT_SETTINGS, PrinterSettings, SAMPLE_RECEIPT_TEXT } from "@/types/receipt";

export default function Home() {
  const [settings, setSettings, isSettingsLoaded] = useLocalStorage<PrinterSettings>(
    "thermal_printer_settings_v4",
    DEFAULT_SETTINGS
  );

  const [receiptText, setReceiptText] = useLocalStorage<string>(
    "thermal_printer_text_cache_v1",
    SAMPLE_RECEIPT_TEXT
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [printSuccessNotice, setPrintSuccessNotice] = useState(false);

  const handleClear = () => {
    setReceiptText("");
  };

  const handlePrint = () => {
    window.print();
    setPrintSuccessNotice(true);
    setTimeout(() => setPrintSuccessNotice(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic print stylesheet for selected paper width */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: ${settings.paperWidth} auto;
              margin: 0;
            }
            .receipt-preview {
              width: ${settings.paperWidth} !important;
              max-width: ${settings.paperWidth} !important;
            }
          }
        `,
      }} />

      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <span className="text-xl">🖨️</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight flex items-center gap-2">
                Thermal Receipt Printer
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                  {settings.paperWidth} POS
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Power Apps Fuel Dispatch Receipt Formatter & Thermal Printing Tool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Settings Gear Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition shadow-sm active:scale-95"
              title="Open Settings (Paper Width, Cut Margin, Bold Mode, Font Size)"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 print:p-0 print:m-0 print:max-w-none">
        {/* Quick action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Preview the 75mm thermal ticket in bold monospace text, then click <strong>Print Receipt</strong> or <strong>Download</strong>.
            </span>
          </div>

          {/* Action buttons: Print & Download */}
          <div className="flex items-center gap-3 flex-wrap">
            <DownloadButton receiptText={receiptText} disabled={!receiptText.trim()} />
            <PrintButton onPrint={handlePrint} disabled={!receiptText.trim()} />
          </div>
        </div>

        {/* Print Success / Tip Toast */}
        {printSuccessNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between gap-2 shadow-sm animate-fadeIn print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Print dialog opened. Ensure printer margins are set to <strong>None</strong> and paper size to <strong>{settings.paperWidth}</strong>.
              </span>
            </div>
            <button
              onClick={() => setPrintSuccessNotice(false)}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 50/50 Split on Desktop (stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch flex-1">
          {/* Left Column: Textarea & Controls */}
          <section
            aria-label="Receipt Input"
            className="flex flex-col h-full print:hidden"
          >
            <ReceiptTextarea
              value={receiptText}
              onChange={setReceiptText}
              onClear={handleClear}
            />

            {/* Printing & Download Tips Card */}
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span>💡</span> Helpful Printing & Download Tips:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li>
                  <strong>Download Receipt:</strong> Save high-res PNG image for WhatsApp or email dispatch confirmation.
                </li>
                <li>
                  <strong>Thermal Printer:</strong> Select <em>POS-80</em>, <em>XP-80C</em>, or <em>POS-58</em>.
                </li>
                <li>
                  <strong>Paper Size:</strong> Choose <strong>{settings.paperWidth}</strong> roll.
                </li>
                <li>
                  <strong>Margins & Options:</strong> Set Margins to <strong>None</strong> and uncheck <em>Headers and Footers</em>.
                </li>
              </ul>
            </div>
          </section>

          {/* Right Column: Live 75mm Preview */}
          <section
            aria-label="Live Receipt Preview"
            className="flex flex-col h-full min-h-[500px]"
          >
            <div className="flex items-center justify-between pb-2 print:hidden">
              <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <span>Live Preview ({settings.paperWidth})</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Monochrome thermal output
              </span>
            </div>

            <ReceiptPreview text={receiptText} settings={settings} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-4 px-6 text-center text-xs text-slate-500 print:hidden">
        <p>
          Thermal Receipt Printer Tool • Configured for 75mm thermal rolls • 100% Client-Side & Offline Ready
        </p>
      </footer>

      {/* Settings Modal */}
      {isSettingsLoaded && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={(newSettings) => setSettings(newSettings)}
        />
      )}
    </div>
  );
}
