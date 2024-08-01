// app/layout.tsx

import React from 'react';
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import NavbarApp from "../components/navbar/App";
import { Providers } from "./providers";
import GoogleTagManagerComponent from './gtm';
import AdsenseComponent from './adsense';

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "AI Wave Calculator, CalcWave",
  description: "If you need all kinds of calculators, here! AI-assisted universal calculator",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    'naver-site-verification': '2e3f77b3a472326232fcaaed94a2945bc55f12eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <head>
        <GoogleTagManagerComponent />
        <AdsenseComponent />
      </head>
      <body className={`${notoSansKr.className} bg-blue-50`}>
        <Providers>
          <NavbarApp />
          {children}
        </Providers>
      </body>
    </html>
  );
}