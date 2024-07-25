// app/layout.tsx
import React from 'react'; 
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import NavbarApp from "../components/navbar/App";
import { Providers } from "./providers";
import { NextUIProvider } from '@nextui-org/react';


const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Calculator, CalcWave",
  description: "If you need all kinds of calculators, here! AI-assisted universal calculator",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <body className={notoSansKr.className}>
        <NextUIProvider>
          <NavbarApp />
          <div className="grid justify-center"> 
            <Providers>
              {children}
            </Providers>
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
