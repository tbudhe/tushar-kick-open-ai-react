import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerticalMenu from './components/menu/vertical-menu';
import Home from './components/pages/Home';
import Profile from './components/pages/profile';
import SystemPage from './components/pages/system';
import AI from './components/pages/ai';
import PracticeML from './components/pages/practice-ml';
import JobSearch from './components/pages/job-search';
import './css/App.css';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Router>
      <div
        className="app-shell"
        style={
          {
            '--sidebar-width': collapsed ? '60px' : '220px',
          } as React.CSSProperties
        }
      >
        <VerticalMenu collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/system" element={<SystemPage />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/practice-ml" element={<PracticeML />} />
            <Route path="/job-search" element={<JobSearch />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

