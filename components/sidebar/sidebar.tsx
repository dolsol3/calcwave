// ./components/sidebar/sidebar.tsx

import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <div className="ad-placeholder">
        <p>Blog that tells you how to use it</p>
      </div>
    </aside>
  );
};

export default Sidebar;
