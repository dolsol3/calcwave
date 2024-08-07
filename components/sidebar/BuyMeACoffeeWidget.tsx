// ./components/BuyMeACoffeeWidget.tsx

import React from 'react';

const BuyMeACoffeeWidget: React.FC = () => {
  return (
    <iframe
      src="https://www.buymeacoffee.com/widget/page/waveJin"
      width="100%"
      height="520" // 높이를 400px로 조정
      frameBorder="0"
      scrolling="no"
      style={{
        border: 'none',
        overflow: 'hidden',
        backgroundColor: 'var(--color-pale-blue)',
        color: 'var(--color-deep-teal)',
      }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default BuyMeACoffeeWidget;
