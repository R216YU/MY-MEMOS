import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shadcn/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MY-MEMOS",
  description: "学習記録メモ",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  const fonts = `${geistSans.variable} ${geistMono.variable}`;
  const styles = `h-full antialiased`;

  return (
    <html lang="ja" className={`${fonts} ${styles}`}>
      <body>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
};

export default RootLayout;
