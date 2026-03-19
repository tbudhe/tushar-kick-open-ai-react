import React from 'react';
import VerticalMenu from '../menu/VerticalMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div
      className="app-shell"
      style={
        {
          '--sidebar-width': collapsed ? '56px' : '188px',
        } as React.CSSProperties
      }
    >
      <VerticalMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="main-content">
        <div className="main-viewport">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
