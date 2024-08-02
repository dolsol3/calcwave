// ./components/sidebar/sidebar.tsx

import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h2 className="text-xl font-bold mb-4">광고</h2>
      <div className="ad-placeholder">
        {/* 임시 광고 또는 광고 요청 문구 */}
        <p>광고 공간입니다. 여기에 광고가 표시됩니다.</p>
      </div>
      {/* 추가 광고 또는 기타 콘텐츠 */}
    </aside>
  );
};

export default Sidebar;
