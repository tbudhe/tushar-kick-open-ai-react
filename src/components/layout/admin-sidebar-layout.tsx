import React, { useState } from 'react';
import '../../css/admin-sidebar-layout.css';

export interface MenuItem {
  label: string;
  id: string;
  subcategories?: {
    label: string;
    id: string;
    details: string[];
  }[];
  details?: string[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface AdminSidebarLayoutProps {
  sections: MenuSection[];
  appName?: string;
}

const AdminSidebarLayout: React.FC<AdminSidebarLayoutProps> = ({
  sections,
  appName = 'Admin Dashboard',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set([sections[0]?.items[0]?.id])
  );
  const [selectedId, setSelectedId] = useState<string>(
    sections[0]?.items[0]?.id || ''
  );

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const selectItem = (id: string) => {
    setSelectedId(id);
  };

  // Find selected item and its content
  let selectedContent: any = null;
  for (const section of sections) {
    for (const item of section.items) {
      if (item.id === selectedId) {
        selectedContent = item;
        break;
      }
    }
  }

  return (
    <div className="admin-sidebar-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="app-logo">
            <span className="logo-icon">A</span>
          </div>
          <h2>{appName}</h2>
          <button className="menu-toggle">≡</button>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="nav-section">
              <h3 className="section-title">{section.title}</h3>
              <ul className="nav-items">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <div className="nav-item-wrapper">
                      <button
                        className={`nav-item ${
                          selectedId === item.id ? 'active' : ''
                        }`}
                        onClick={() => {
                          if (item.subcategories) {
                            toggleExpand(item.id);
                          }
                          selectItem(item.id);
                        }}
                      >
                        <span className="item-label">{item.label}</span>
                        {item.subcategories && (
                          <span
                            className={`expand-icon ${
                              expandedItems.has(item.id) ? 'expanded' : ''
                            }`}
                          >
                            ›
                          </span>
                        )}
                      </button>
                    </div>

                    {item.subcategories && expandedItems.has(item.id) && (
                      <ul className="subcategories">
                        {item.subcategories.map((subcat) => (
                          <li key={subcat.id}>
                            <button
                              className={`subcategory-item ${
                                selectedId === subcat.id ? 'active' : ''
                              }`}
                              onClick={() => selectItem(subcat.id)}
                            >
                              {subcat.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        {selectedContent && (
          <div className="content-wrapper">
            <div className="content-header">
              <h1>{selectedContent.label}</h1>
              <p className="breadcrumb">
                {appName} {selectedContent.label &&
                  ` / ${selectedContent.label}`}
              </p>
            </div>

            <div className="content-body">
              {selectedContent.details && (
                <div className="details-section">
                  <ul className="details-list">
                    {selectedContent.details.map((detail, idx) => (
                      <li key={idx} className="detail-item">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedContent.subcategories &&
                selectedContent.subcategories.map((subcat) => (
                  <div key={subcat.id} className="details-section">
                    <h3>{subcat.label}</h3>
                    <ul className="details-list">
                      {subcat.details.map((detail, idx) => (
                        <li key={idx} className="detail-item">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSidebarLayout;
