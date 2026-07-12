import type { Metadata } from "next";
import { Prompt, Outfit } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreviewAccessProvider } from "@/components/providers/PreviewAccessProvider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-number",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

import { prisma } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  let setting = null;
  try {
    setting = await prisma.systemSetting.findUnique({ where: { id: "1" } });
  } catch(e) {}
  
  return {
    title: setting?.seoTitle || "SERIX888 — สตรีมหนังพรีเมียม",
    description: setting?.seoDescription || "ค้นหา เช่า และรับชมหนัง ซีรีส์พรีเมียม พร้อมคอนเทนต์พิเศษของคนไทย",
    keywords: ["หนัง", "ซีรีส์", "สตรีมมิง", "เช่า", "พรีเมียม", "ภาพยนตร์"],
    ...(setting?.logoUrl ? { icons: { icon: setting.logoUrl } } : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cv-deep text-cv-text">
        <NextTopLoader color="#EAB308" showSpinner={false} />
        <TooltipProvider>
          <PreviewAccessProvider>{children}</PreviewAccessProvider>
        </TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
