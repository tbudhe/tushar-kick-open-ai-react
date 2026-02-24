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
  activeId?: string;
  showSidebar?: boolean;
}

const AdminSidebarLayout: React.FC<AdminSidebarLayoutProps> = ({
  sections,
  appName = 'Admin Dashboard',
  activeId,
  showSidebar = true,
}) => {
  const getFirstSelectableId = () => {
    for (const section of sections) {
      for (const item of section.items) {
        if (item.subcategories?.length) {
          return item.subcategories[0].id;
        }
        if (item.details?.length) {
          return item.id;
        }
      }
    }
    return '';
  };

  const firstItemId = sections[0]?.items[0]?.id;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(firstItemId ? [firstItemId] : [])
  );
  const [selectedId, setSelectedId] = useState<string>(getFirstSelectableId());

  const findParentId = (id: string) => {
    for (const section of sections) {
      for (const item of section.items) {
        if (item.id === id) return item.id;
        if (item.subcategories?.some((subcat) => subcat.id === id)) {
          return item.id;
        }
      }
    }
    return null;
  };

  React.useEffect(() => {
    if (!activeId) return;
    const parentId = findParentId(activeId);
    if (parentId) {
      setExpandedItems((prev) => new Set(prev).add(parentId));
    }
    setSelectedId(activeId);
  }, [activeId]);

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

  // Find selected item or subcategory content
  let selectedContent: {
    label: string;
    details: string[];
    parentLabel?: string;
    sectionTitle?: string;
  } | null = null;

  for (const section of sections) {
    for (const item of section.items) {
      if (item.id === selectedId && item.details) {
        selectedContent = {
          label: item.label,
          details: item.details,
          parentLabel: item.label,
          sectionTitle: section.title,
        };
        break;
      }

      if (item.subcategories) {
        const match = item.subcategories.find((subcat) => subcat.id === selectedId);
        if (match) {
          selectedContent = {
            label: match.label,
            details: match.details,
            parentLabel: item.label,
            sectionTitle: section.title,
          };
          break;
        }
      }
    }
    if (selectedContent) break;
  }

  return (
    <div className={`admin-sidebar-layout${showSidebar ? '' : ' sidebar-hidden'}`}>
      {showSidebar && (
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
                          if (item.subcategories?.length) {
                            const wasExpanded = expandedItems.has(item.id);
                            toggleExpand(item.id);
                            if (!wasExpanded) {
                              selectItem(item.subcategories[0].id);
                            }
                            return;
                          }
                          if (item.details?.length) {
                            selectItem(item.id);
                          }
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
      )}

      <main className="admin-content">
        {selectedContent && (
          <div className="content-wrapper">
            <div className="content-header">
              <h1>{selectedContent.label}</h1>
              <p className="breadcrumb">
                {appName}
                {selectedContent.sectionTitle &&
                  ` / ${selectedContent.sectionTitle}`}
                {selectedContent.parentLabel &&
                  ` / ${selectedContent.parentLabel}`}
                {selectedContent.label &&
                  ` / ${selectedContent.label}`}
              </p>
            </div>

            <div className="content-body">
              <div className="details-section">
                <ul className="details-list">
                  {selectedContent.details.map((detail, idx) => (
                    <li key={idx} className="detail-item">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSidebarLayout;
