import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
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
      {collapsed ? '☰' : '✕'}
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
        <NavLink className="nav-link" to="/messages">
          {collapsed ? <span title="Messages"><MailIcon /></span> : 'Messages'}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/systems">
          {collapsed ? <span title="System"><AllInclusiveIcon /></span> : 'System Design'}
        </NavLink>
      </li>
    </ul>
  </div>
);

export default VerticalMenu;