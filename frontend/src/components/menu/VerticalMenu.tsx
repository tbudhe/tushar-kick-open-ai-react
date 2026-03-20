import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HubIcon from '@mui/icons-material/Hub';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import {
  appRoutes,
  sidebarNavigationConfig,
  SidebarMenuItem,
  SidebarMenuItemId,
} from '../../constants/routes';

interface VerticalMenuProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

type MenuContext = 'business' | 'technical';

interface SystemHealthMetrics {
  ttfbMs: number;
  p95Ms: number;
  availabilityPct: number;
}

interface SystemHealthResponse {
  success?: boolean;
  data?: {
    metrics?: SystemHealthMetrics;
  };
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ collapsed, setCollapsed }) => {
  const [menuContext, setMenuContext] = useState<MenuContext>('business');
  const location = useLocation();
  const [metrics, setMetrics] = useState<SystemHealthMetrics>({
    ttfbMs: 92,
    p95Ms: 180,
    availabilityPct: 99.95,
  });

  React.useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        const response = await fetch('/api/system-health');
        if (!response.ok) return;

        const payload: SystemHealthResponse = await response.json();
        const next = payload.data?.metrics;
        if (!next || !isMounted) return;

        setMetrics(next);
      } catch {
        // Fall back to defaults when endpoint is unavailable.
      }
    };

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const iconMap: Record<SidebarMenuItemId, React.ReactNode> = {
    solutions: <HomeIcon fontSize="small" />,
    'ai-engine': <PrecisionManufacturingIcon fontSize="small" />,
    contact: <ContactSupportIcon fontSize="small" />,
    'engineer-profile': <EngineeringIcon fontSize="small" />,
    architecture: <AccountTreeIcon fontSize="small" />,
    'core-tech': <HubIcon fontSize="small" />,
    playbooks: <MenuBookIcon fontSize="small" />,
    insights: <PodcastsIcon fontSize="small" />,
  };

  const activeItems = sidebarNavigationConfig[menuContext];

  const isItemActive = (item: SidebarMenuItem) => {
    const pathOnly = item.to.split(/[?#]/)[0];
    return location.pathname === pathOnly;
  };

  return (
    <div className={`vertical-menu${collapsed ? ' collapsed' : ''}`}>
      <button
        className="collapse-btn"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
      >
        {collapsed ? '≡' : '×'}
      </button>

      {!collapsed && <h4 className="menu-title">YU Ex Gen AI</h4>}

      {!collapsed && (
        <div className="menu-context-toggle" role="tablist" aria-label="Menu context selector">
          <button
            type="button"
            role="tab"
            aria-selected={menuContext === 'business'}
            className={`menu-context-btn ${menuContext === 'business' ? 'active' : ''}`}
            onClick={() => setMenuContext('business')}
          >
            Business
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={menuContext === 'technical'}
            className={`menu-context-btn ${menuContext === 'technical' ? 'active' : ''}`}
            onClick={() => setMenuContext('technical')}
          >
            Technical
          </button>
        </div>
      )}

      <ul className="nav nav-pills flex-column menu-items-list">
        {activeItems.map((item) => (
          <li key={item.to}>
            <NavLink
              className={`nav-link ${isItemActive(item) ? 'active' : ''}`}
              to={item.to}
              end={item.to.split(/[?#]/)[0] === appRoutes.home}
            >
              {collapsed
                ? <span title={item.label}>{iconMap[item.id]}</span>
                : <><span>{iconMap[item.id]}</span>{item.label}</>}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-health" aria-label="System health metrics">
        {!collapsed && <p className="sidebar-health-title">System Health</p>}
        <div className="sidebar-health-list">
          <span className="sidebar-health-pill">TTFB {metrics.ttfbMs}ms</span>
          <span className="sidebar-health-pill">P95 {metrics.p95Ms}ms</span>
          <span className="sidebar-health-pill">{metrics.availabilityPct.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalMenu;