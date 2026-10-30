export type PaperWidth = "58mm" | "75mm" | "80mm";

export interface PrinterSettings {
  paperWidth: PaperWidth;
  fontSize: "compact" | "normal" | "large";
  smartFormatting: boolean;
  allLettersBold: boolean;
  bottomFeedMm: number; // in millimeters, default 60mm (6cm)
}

export const PAPER_WIDTH_PIXELS: Record<PaperWidth, number> = {
  "58mm": 219,
  "75mm": 283,
  "80mm": 302,
};

export const DEFAULT_SETTINGS: PrinterSettings = {
  paperWidth: "75mm",
  fontSize: "normal",
  smartFormatting: true,
  allLettersBold: true,
  bottomFeedMm: 60, // 6cm default paper feed tail after footer
};

export const SAMPLE_RECEIPT_TEXT = `========================================
       FUEL DISPATCH RECEIPT
========================================
Receipt No : FR-0023
Date       : 22-Jun-2025 14:30
Status     : APPROVED
----------------------------------------
Vehicle No : CAB-1234
Fuel Type  : Diesel
Consumer   : Transport
Requester  : John Doe
Approved By: Jane Smith
----------------------------------------
       Quantity Dispatched
           150.0 L
----------------------------------------
Note: Urgent dispatch
----------------------------------------

      Storekeeper Signature

========================================
     Fuel Management System
========================================`;
