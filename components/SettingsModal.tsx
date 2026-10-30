"use client";

import React, { useState, useEffect } from "react";
import { X, Sliders, Scissors, Bold, Sparkles } from "lucide-react";
import { PrinterSettings, PaperWidth, DEFAULT_SETTINGS } from "@/types/receipt";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrinterSettings;
  onSave: (newSettings: PrinterSettings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  const [currentSettings, setCurrentSettings] = useState<PrinterSettings>(settings);

  // Sync settings when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSettings({
        ...settings,
        allLettersBold: settings.allLettersBold ?? true,
        bottomFeedMm: settings.bottomFeedMm ?? 60,
      });
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  const resetDefaults = () => {
    setCurrentSettings(DEFAULT_SETTINGS);
  };

  const feedCm = (currentSettings.bottomFeedMm ?? 60) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 id="settings-title" className="font-semibold text-lg text-slate-900">
              Receipt & Printer Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-200 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Paper Feed after Footer (Cut Margin) */}
          <div className="space-y-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
            <div className="flex items-center justify-between">
              <label htmlFor="bottom-feed-slider" className="font-semibold text-slate-900 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-indigo-600" />
                Paper Feed after Footer (Cut Margin)
              </label>
              <span className="text-sm font-bold text-indigo-700 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                {feedCm} cm ({currentSettings.bottomFeedMm ?? 60} mm)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Feeds extra blank paper after <em>Fuel Management System</em> so your physical printer&apos;s auto-cutter or tear-bar doesn&apos;t cut into receipt text.
            </p>

            {/* Quick Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
              {[
                { val: 60, label: "6 cm (Default)" },
                { val: 80, label: "8 cm" },
                { val: 100, label: "10 cm" },
                { val: 120, label: "12 cm" },
                { val: 150, label: "15 cm" },
                { val: 40, label: "4 cm" },
                { val: 20, label: "2 cm" },
                { val: 0, label: "0 cm (No Feed)" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() =>
                    setCurrentSettings((prev) => ({ ...prev, bottomFeedMm: opt.val }))
                  }
                  className={`py-2 px-2 text-xs rounded-xl border text-center transition ${
                    (currentSettings.bottomFeedMm ?? 60) === opt.val
                      ? "border-indigo-600 bg-indigo-600 text-white font-bold shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Interactive Slider for Long Selection (0cm to 20cm) */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0 cm (None)</span>
                <span>Slider: 0 - 20 cm</span>
                <span>20 cm (Long)</span>
              </div>
              <input
                id="bottom-feed-slider"
                type="range"
                min="0"
                max="200"
                step="5"
                value={currentSettings.bottomFeedMm ?? 60}
                onChange={(e) =>
                  setCurrentSettings((prev) => ({
                    ...prev,
                    bottomFeedMm: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* All Letters Bold Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <Bold className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-xs">
                  All Letters Bold (High-Contrast Thermal Printing)
                </p>
                <p className="text-[11px] text-slate-500">
                  Burns double-width thermal dots for deep black, legible letters.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={currentSettings.allLettersBold ?? true}
                onChange={(e) =>
                  setCurrentSettings((prev) => ({
                    ...prev,
                    allLettersBold: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Paper Width Dropdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="paper-width-select" className="font-medium text-slate-900">
                Paper Width
              </label>
              <span className="text-xs text-indigo-600 font-mono">
                {currentSettings.paperWidth === "58mm" && "219px (approx 32 cols)"}
                {currentSettings.paperWidth === "75mm" && "283px (Standard POS)"}
                {currentSettings.paperWidth === "80mm" && "302px (approx 48 cols)"}
              </span>
            </div>
            <select
              id="paper-width-select"
              value={currentSettings.paperWidth}
              onChange={(e) =>
                setCurrentSettings((prev) => ({
                  ...prev,
                  paperWidth: e.target.value as PaperWidth,
                }))
              }
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="75mm">75mm - Standard POS (283px at 96 DPI) - Default</option>
              <option value="58mm">58mm - Compact POS (219px at 96 DPI)</option>
              <option value="80mm">80mm - Wide POS (302px at 96 DPI)</option>
            </select>
          </div>

          {/* Receipt Typography / Formatting */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-900">Font Scaling</label>
              <span className="text-xs text-slate-500">Monospace thermal font</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "normal", "large"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setCurrentSettings((prev) => ({ ...prev, fontSize: size }))
                  }
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center capitalize transition ${
                    currentSettings.fontSize === size
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {size === "compact" && "Compact (11px)"}
                  {size === "normal" && "Normal (12px)"}
                  {size === "large" && "Large (13px)"}
                </button>
              ))}
            </div>
          </div>

          {/* Reset to Defaults */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              Reset all to defaults
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md hover:shadow-indigo-500/25"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
