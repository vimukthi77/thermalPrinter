import { LAKDHANAVI_LOGO, RIVIDHANAVI_LOGO } from "@/lib/defaultLogos";

export type PaperWidth = "58mm" | "75mm" | "80mm";

export type TopLogoMode =
  | "both-side-by-side"
  | "both-stacked"
  | "lakdhanavi-only"
  | "rividhanavi-only"
  | "custom";

export interface PrinterSettings {
  topLogo: string | null;
  topLogo2: string | null;
  topLogoMode: TopLogoMode;
  bottomLogo: string | null;
  paperWidth: PaperWidth;
  fontSize: "compact" | "normal" | "large";
  smartFormatting: boolean;
}

export const PAPER_WIDTH_PIXELS: Record<PaperWidth, number> = {
  "58mm": 219,
  "75mm": 283,
  "80mm": 302,
};

export const DEFAULT_SETTINGS: PrinterSettings = {
  topLogo: LAKDHANAVI_LOGO,
  topLogo2: RIVIDHANAVI_LOGO,
  topLogoMode: "both-side-by-side",
  bottomLogo: null,
  paperWidth: "75mm",
  fontSize: "normal",
  smartFormatting: true,
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
