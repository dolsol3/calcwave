// ./app/layout.tsx

import React from 'react';
import type { Metadata } from "next";
import { Noto_Sans_KR, Roboto } from "next/font/google";
import "./globals.css";
import NavbarApp from "../components/navbar/App";
import { Providers } from "./providers";
import GoogleTagManagerComponent from './gtm';
import AdsenseComponent from './adsense';
import Sidebar from '../components/sidebar/sidebar'; // 사이드바 컴포넌트 추가

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ['400', '700'] });
const roboto = Roboto({ subsets: ["latin"], weight: ['400', '700'] });

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
      <body className={`${notoSansKr.className} ${roboto.className} bg-blue-50 flex flex-col min-h-screen`}> 
        <Providers>
          <NavbarApp />
          <div className="flex w-full flex-1 justify-center px-4 gap-4">
            <Sidebar />
            <main className="flex-1 max-w-7xl flex flex-col items-center bg-[#F0F8FF] overflow-y-auto">
              <div className="w-full py-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}