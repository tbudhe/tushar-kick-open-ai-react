import React, { useState } from 'react';
import '../../css/vertical-sidebar-layout.css';

export interface SidebarItem {
  name: string;
  details: string[];
}

interface VerticalSidebarLayoutProps {
  title: string;
  items: SidebarItem[];
  defaultSelectedIndex?: number;
}

const VerticalSidebarLayout: React.FC<VerticalSidebarLayoutProps> = ({
  title,
  items,
  defaultSelectedIndex = 0,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(
    items[defaultSelectedIndex]?.name || null
  );

  const currentItem = items.find((item) => item.name === selectedItem);

  return (
    <div className="vertical-sidebar-layout">
      <div className="vertical-sidebar">
        <div className="sidebar-header">
          <h3>{title}</h3>
        </div>
        <nav className="sidebar-nav">
          {items.map((item, idx) => (
            <button
              key={idx}
              className={`sidebar-item ${
                selectedItem === item.name ? 'active' : ''
              }`}
              onClick={() => setSelectedItem(item.name)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-content">
        {currentItem && (
          <div className="content-card">
            <div className="content-header">
              <h2>{currentItem.name}</h2>
            </div>
            <div className="content-details">
              <ul>
                {currentItem.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalSidebarLayout;
