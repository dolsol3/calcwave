// app/adsense.tsx

"use client";
import Script from 'next/script';

export default function AdsenseComponent() {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9186169376806876"
        crossOrigin="anonymous" 
        strategy="afterInteractive"
      />
    </>
  );
}
