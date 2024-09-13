import { RainbowProvider } from "@/components/rainbowkit-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { siteMetadata } from "@/config/site";
import { cn } from "@/lib/utils";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import LocalFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
//import { Provider } from '@/contexts/provider';
//import { ReduxContext } from '@/contexts/ReduxContext';

const fontSans = LocalFont({
  src: [
    {
      path: "../fonts/sans.otf",
      weight: "400",
    },
    {
      path: "../fonts/sans-bold.otf",
      weight: "600",
    },
  ],
  variable: "--font-sans",
  preload: true,
});

const fontHeading = LocalFont({
  src: "../fonts/heading.otf",
  variable: "--font-heading",
  preload: true,
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
        suppressHydrationWarning
        suppressContentEditableWarning
      >
        <ThemeProvider>
          <RainbowProvider>{children}</RainbowProvider>
          <Toaster richColors theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
