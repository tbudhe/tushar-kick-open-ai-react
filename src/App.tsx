import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerticalMenu from './components/menu/vertical-menu';
import Home from './components/pages/home';
import Profile from './components/pages/profile';
import Settings from './components/pages/systems';
import AI from './components/pages/ai';
import PracticeML from './components/pages/practice-ml';
import JobSearch from './components/pages/job-search';
import CarouselShowcase from './components/pages/carousel-showcase';
import './css/App.css';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Router>
      <div className="d-flex">
        <VerticalMenu collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          className="main-content"
          style={{
            marginLeft: collapsed ? 60 : 220,
            transition: 'margin-left 0.2s',
            minHeight: '100vh',
            width: '100%',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/systems" element={<Settings />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/practice-ml" element={<PracticeML />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/carousel" element={<CarouselShowcase />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

/* Remove or comment out this block in App.css 
.flex-grow-1 {
  margin-left: 220px;
  transition: margin-left 0.2s;
}

.vertical-menu.collapsed ~ .flex-grow-1 {
  margin-left: 60px;
}
*/

