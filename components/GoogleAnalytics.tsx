// ./components/GoogleAnalytics.tsx

"use client"; // 클라이언트 컴포넌트로 지정

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const GoogleAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_MEASUREMENT_ID, {
          page_path: url,
        });
      }
    };

    handleRouteChange(pathname); // 초기 로드 시에도 호출
  }, [pathname]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
