# 🖨️ Thermal Receipt Printer Web App

A production-ready, client-side Next.js 14+ (App Router, TypeScript, Tailwind CSS) tool designed specifically for formatting and printing **Power Apps fuel dispatch receipts** onto physical **75mm thermal receipt printers** (with optional support for 58mm and 80mm rolls).

---

## ✨ Features

- **Single-Page Simplicity**: Clean, distraction-free interface with no complex routing or slow backend dependencies.
- **50/50 Desktop Split / Stacked Mobile**: Side-by-side editing and real-time preview on desktop; smoothly stacks on tablets and phones.
- **Realistic 75mm Thermal Preview**:
  - Exact 283px width (at 96 DPI for 75mm paper).
  - Also toggles to 58mm (219px) and 80mm (302px).
  - Monochrome monospace rendering (`Courier New` / Consolas).
  - Scaled typography: 12px body, 15px titles, 22px bold quantity highlight.
  - Authentic thermal receipt look with subtle paper drop shadow.
- **All Letters Bold Mode**:
  - High-contrast thermal print mode where all characters are rendered in bold monospace (`font-bold` / `font-black`) to ensure physical printer heads burn dark, legible letters without fading.
- **Customizable Paper Feed Tail (Default 6cm)**:
  - Adds extra blank paper feed after the footer so the printer's auto-cutter or tear-bar does not cut into receipt text.
  - Quick presets for 6cm (Default), 8cm, 10cm, 12cm, 15cm, 4cm, 2cm, or 0cm, plus a range slider for custom lengths up to 20cm.
- **Download Functionality**:
  - **Download Receipt Image (.PNG)**: Captures high-resolution (2x scale) pixel-perfect monochrome thermal ticket image ready for WhatsApp sharing, auditing, or archiving.
  - **Download Text (.TXT)**: Exports raw text file formatted with receipt metadata.
- **Critical Thermal Print CSS**:
  - Strict `@media print` rules hide UI chrome, headers, and inputs.
  - Absolute positioning and exact `@page { size: 75mm auto; margin: 0; }` configuration.
  - Automatic pure monochrome output (`color: black !important; background: white !important`).
  - Logos properly scaled for print (`max-height: 10mm`).
- **Keyboard Shortcuts**: `Ctrl + P` / `Cmd + P` opens print dialog immediately.
- **PWA & Offline Ready**: Standalone installable PWA with web app manifest and icons. Runs 100% client-side with zero external network requirements after initial load.
- **Static Export**: Configured with `output: 'export'` for instant hosting on Vercel, Netlify, GitHub Pages, or local intranet servers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+ installed
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Static Export
```bash
npm run build
```
This builds and exports the entire application into the `out/` directory, ready to deploy to any static host or web server.

---

## 🖨️ Recommended Thermal Printer Settings

When the browser print dialog opens:
1. **Destination:** Select your thermal receipt printer (e.g., `POS-80`, `XP-80C`, `POS-58`, `Epson TM-T20`).
2. **Paper Size:** Select **75mm Roll** (or 80mm roll).
3. **Margins:** Set to **None** (or *Minimum*).
4. **Headers and Footers:** **Uncheck** this option (prevents page numbers and URLs from appearing on the ticket).

---

## 📁 Project Structure

```
thermal-printer/
├── app/
│   ├── globals.css         # Tailwind base & critical @media print rules
│   ├── layout.tsx          # Root HTML layout, metadata & viewport
│   └── page.tsx            # Main single-page application & state management
├── components/
│   ├── DownloadButton.tsx  # Download receipt as high-res PNG or TXT
│   ├── PrintButton.tsx     # Print trigger button with Ctrl+P shortcut
│   ├── ReceiptPreview.tsx  # 75mm thermal receipt mockup renderer
│   ├── ReceiptTextarea.tsx # Large paste textarea with sample loader
│   └── SettingsModal.tsx   # Dual logo drag-and-drop & paper settings
├── hooks/
│   └── useLocalStorage.ts  # SSR-safe reactive localStorage hook
├── public/
│   ├── icon.svg            # Thermal printer vector app icon
│   └── manifest.json       # PWA web manifest
├── types/
│   └── receipt.ts          # Shared TypeScript interfaces & defaults
├── next.config.mjs         # Static export configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and build scripts
```

