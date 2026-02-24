import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AllOutIcon from '@mui/icons-material/AllOut';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import ScienceIcon from '@mui/icons-material/Science';
import WorkIcon from '@mui/icons-material/Work';

interface VerticalMenuProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ collapsed, setCollapsed }) => (
  <div className={`vertical-menu${collapsed ? ' collapsed' : ''}`}>
    <button
      className="collapse-btn"
      onClick={() => setCollapsed((prev) => !prev)}
      aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
    >
      {collapsed ? '≡' : '×'}
    </button>
    {!collapsed && <h4 className="menu-title">Menu</h4>}
    <ul className="nav nav-pills flex-column">
      <li>
        <NavLink className="nav-link" to="/" end>
          {collapsed ? <span title="Home"><HomeIcon /></span> : 'Home'}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/profile">
          {collapsed ? <span title="Profile"><PersonIcon /></span> : 'Profile'}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/job-search">
          {collapsed ? <span title="Job Search"><WorkIcon /></span> : 'Job Search'}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/carousel">
          {collapsed ? <span title="Carousel"><AllOutIcon /></span> : 'Carousel'}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/ai">
          {collapsed ? <span title="AI"><AllOutIcon /></span> : 'AI'}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/systems">
          {collapsed ? <span title="Systems"><AllInclusiveIcon /></span> : 'Systems'}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/practice-ml">
          {collapsed ? <span title="Practice ML"><ScienceIcon /></span> : 'Practice ML'}
        </NavLink>
      </li>
    </ul>
  </div>
);

export default VerticalMenu;