import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thermal Receipt Printer Tool | 75mm POS Preview & Print",
  description: "Web application to paste Power Apps fuel dispatch receipts, view realistic 75mm thermal preview with logos, and print directly to thermal receipt printers.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased min-h-screen bg-slate-100/80 text-slate-900 flex flex-col">
        {children}
      </body>
    </html>
  );
}

