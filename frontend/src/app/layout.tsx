import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import AppShell from "@/components/AppShell";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vive México | World Cup 2026",
  description: "Connect with local businesses and experience the authentic Mexico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Providers>
          <AppShell>
            {children}
          </AppShell>
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
