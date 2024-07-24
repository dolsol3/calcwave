// app/layout.tsx
import React from 'react'; // React를 명시적으로 import합니다.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarApp from "../components/navbar/App";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI계산기",
  description: "계산이 필요하다면 여기서! AI 계산까지 한 방에",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <body className={inter.className}>
        <NavbarApp />
        <div className="grid justify-center">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
