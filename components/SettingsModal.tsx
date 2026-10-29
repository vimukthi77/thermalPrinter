"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Upload, Trash2, Sliders, Image as ImageIcon, Sparkles, LayoutGrid } from "lucide-react";
import { PrinterSettings, PaperWidth, TopLogoMode } from "@/types/receipt";
import { LAKDHANAVI_LOGO, RIVIDHANAVI_LOGO } from "@/lib/defaultLogos";

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
  const [topLogo1DragActive, setTopLogo1DragActive] = useState(false);
  const [topLogo2DragActive, setTopLogo2DragActive] = useState(false);
  const [bottomLogoDragActive, setBottomLogoDragActive] = useState(false);

  const top1InputRef = useRef<HTMLInputElement>(null);
  const top2InputRef = useRef<HTMLInputElement>(null);
  const bottomInputRef = useRef<HTMLInputElement>(null);

  // Sync settings when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleImageFile = (file: File, logoField: "topLogo" | "topLogo2" | "bottomLogo") => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, SVG, or WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setCurrentSettings((prev) => ({
        ...prev,
        [logoField]: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    logoField: "topLogo" | "topLogo2" | "bottomLogo"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (logoField === "topLogo") setTopLogo1DragActive(false);
    if (logoField === "topLogo2") setTopLogo2DragActive(false);
    if (logoField === "bottomLogo") setBottomLogoDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0], logoField);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  // Reset to the official Lakdhanavi & Rividhanavi Logos
  const resetToCompanyLogos = () => {
    setCurrentSettings((prev) => ({
      ...prev,
      topLogo: LAKDHANAVI_LOGO,
      topLogo2: RIVIDHANAVI_LOGO,
      topLogoMode: "both-side-by-side",
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
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
          {/* Company preset quick action */}
          <div className="flex items-center justify-between p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
            <div>
              <span className="text-xs font-semibold text-indigo-900 block">
                Official Company Logos
              </span>
              <span className="text-[11px] text-indigo-700">
                Lakdhanavi Limited & Rividhanavi (Private) Limited
              </span>
            </div>
            <button
              type="button"
              onClick={resetToCompanyLogos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              Reset to Defaults
            </button>
          </div>

          {/* Top Logo Arrangement Mode */}
          <div className="space-y-2">
            <label className="font-medium text-slate-900 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              Top Logos Arrangement
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "both-side-by-side", label: "Both Side-by-Side", desc: "Small icons in top line" },
                { id: "both-stacked", label: "Both Stacked", desc: "Top & below" },
                { id: "lakdhanavi-only", label: "Lakdhanavi Only", desc: "Single header" },
                { id: "rividhanavi-only", label: "Rividhanavi Only", desc: "Single header" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setCurrentSettings((prev) => ({
                      ...prev,
                      topLogoMode: opt.id as TopLogoMode,
                    }))
                  }
                  className={`p-2.5 rounded-xl border text-left transition ${
                    currentSettings.topLogoMode === opt.id
                      ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-1 ring-indigo-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Logo 1: Lakdhanavi (Left / Top) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-900">
                Top Logo 1 (Lakdhanavi Limited)
              </label>
              <span className="text-xs text-slate-500">Max: 125x34px</span>
            </div>

            {currentSettings.topLogo ? (
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1 overflow-hidden shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentSettings.topLogo || undefined}
                      alt="Logo 1 Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-600">Lakdhanavi Logo Loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => top1InputRef.current?.click()}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSettings((prev) => ({ ...prev, topLogo: null }))
                    }
                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragEnter={() => setTopLogo1DragActive(true)}
                onDragLeave={() => setTopLogo1DragActive(false)}
                onDrop={(e) => handleDrop(e, "topLogo")}
                onClick={() => top1InputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${
                  topLogo1DragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <p className="text-xs font-medium text-slate-700">Upload Logo 1</p>
                </div>
              </div>
            )}
            <input
              ref={top1InputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageFile(e.target.files[0], "topLogo");
                }
              }}
            />
          </div>

          {/* Logo 2: Rividhanavi (Right / Secondary Top) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-900">
                Top Logo 2 (Rividhanavi (Private) Limited)
              </label>
              <span className="text-xs text-slate-500">Max: 125x34px</span>
            </div>

            {currentSettings.topLogo2 ? (
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1 overflow-hidden shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentSettings.topLogo2 || undefined}
                      alt="Logo 2 Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-600">Rividhanavi Logo Loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => top2InputRef.current?.click()}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSettings((prev) => ({ ...prev, topLogo2: null }))
                    }
                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragEnter={() => setTopLogo2DragActive(true)}
                onDragLeave={() => setTopLogo2DragActive(false)}
                onDrop={(e) => handleDrop(e, "topLogo2")}
                onClick={() => top2InputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${
                  topLogo2DragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <p className="text-xs font-medium text-slate-700">Upload Logo 2</p>
                </div>
              </div>
            )}
            <input
              ref={top2InputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageFile(e.target.files[0], "topLogo2");
                }
              }}
            />
          </div>

          {/* Optional Footer Logo (Bottom) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-900">
                Optional Footer Logo (Bottom)
              </label>
              <span className="text-xs text-slate-500">Max: 100x30px</span>
            </div>

            {currentSettings.bottomLogo ? (
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1 overflow-hidden shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentSettings.bottomLogo || undefined}
                      alt="Footer Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-600">Footer Logo loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => bottomInputRef.current?.click()}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSettings((prev) => ({ ...prev, bottomLogo: null }))
                    }
                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Footer Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragEnter={() => setBottomLogoDragActive(true)}
                onDragLeave={() => setBottomLogoDragActive(false)}
                onDrop={(e) => handleDrop(e, "bottomLogo")}
                onClick={() => bottomInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${
                  bottomLogoDragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <p className="text-xs font-medium text-slate-700">
                    Click to upload optional footer logo
                  </p>
                </div>
              </div>
            )}
            <input
              ref={bottomInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageFile(e.target.files[0], "bottomLogo");
                }
              }}
            />
          </div>

          {/* Paper Width Dropdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="paper-width-select" className="font-medium text-slate-900">
                Paper Width
              </label>
              <span className="text-xs text-indigo-600 font-mono">
                {currentSettings.paperWidth === "58mm" && "219px"}
                {currentSettings.paperWidth === "75mm" && "283px (Standard)"}
                {currentSettings.paperWidth === "80mm" && "302px"}
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
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
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
