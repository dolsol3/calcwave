// ./components/sidebar/sidebar.tsx

import React from 'react';
import BuyMeACoffeeButton from './BuyMeACoffeeButton';
import BuyMeACoffeeWidget from './BuyMeACoffeeWidget';
import Link from 'next/link';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className={`sidebar ${className || ''}`}>
      <h2 className="text-xl font-bold mb-4">Guide</h2>
      <div className="sidebar-guide">
        <Link href="https://guide.calcwave.com/2024/08/blog-post.html" legacyBehavior>
          <a className="no-underline text-inherit cursor-pointer">
            <p className='mb-2'>
              Blog that tells you how to use it
            </p>
          </a>
        </Link>
        <Link href="https://www.youtube.com/watch?v=SD4rU2Od0hA" legacyBehavior>
          <a className="no-underline text-inherit cursor-pointer">
            <p className='mb-2'>
              Youtube that tells you how to use it
            </p>
          </a>
        </Link>
      </div>
      {/* <h2 className="text-xl font-bold mb-4 mt-8">Donation</h2>
      <div className="sidebar-ad">
        <p>How about a small cup of coffee for a hungry AI calculator? I want to get some enthusiastic support to develop a better service. Please give me a boost!</p>
        <BuyMeACoffeeWidget />
        <BuyMeACoffeeButton />
      </div> */}
    </aside>
  );
};

export default Sidebar;
