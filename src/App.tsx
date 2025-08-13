import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerticalMenu from './components/menu/VerticalMenu';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Messages from './components/pages/Messages';
import Settings from './components/pages/Systems';
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
            <Route path="/messages" element={<Messages />} />
            <Route path="/Systems" element={<Settings />} />
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

