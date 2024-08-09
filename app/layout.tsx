// ./app/layout.tsx

import React from 'react';
import type { Metadata } from "next";
import { Noto_Sans_KR, Roboto } from "next/font/google";
import "./globals.css";
import NavbarApp from "../components/navbar/App";
import { Providers } from "./providers";
import GoogleTagManagerComponent from '../components/gtm';
import AdsenseComponent from '../components/adsense';
import Sidebar from '../components/sidebar/sidebar';
import GoogleAnalytics from '../components/GoogleAnalytics';
import BuyMeACoffeeWidget from '@/components/sidebar/BuyMeACoffeeButton';

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
  openGraph: {
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/calc-sky4.appspot.com/o/metaImgae_calcwave.jpg?alt=media&token=72b0ca2c-47a5-4b16-b2f4-d42b2418ee55',
      },
    ],
  },
  twitter: {
    images: [
      'https://firebasestorage.googleapis.com/v0/b/calc-sky4.appspot.com/o/metaImgae_calcwave.jpg?alt=media&token=72b0ca2c-47a5-4b16-b2f4-d42b2418ee55',
    ],
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
        <GoogleAnalytics />
      </head>
      <body className={`${notoSansKr.className} ${roboto.className} bg-blue-50 flex flex-col min-h-screen`}> 
        <Providers>
          <NavbarApp />
          <div className="flex flex-1 w-full">
            <Sidebar className="hidden lg:block w-80 flex-shrink-0" />
            <main className="flex-grow overflow-x-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
          <BuyMeACoffeeWidget />
        </Providers>
      </body>
    </html>  
  );
}
