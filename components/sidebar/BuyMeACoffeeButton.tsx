// ./components/BuyMeACoffeeButton.tsx

import React from 'react';

const BuyMeACoffeeButton: React.FC = () => {
  return (
    <a href="https://www.buymeacoffee.com/waveJin" target="_blank" rel="noopener noreferrer">
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me a Coffee"
        style={{ height: '60px', width: '217px' }}
      />
    </a>
  );
};

export default BuyMeACoffeeButton;
