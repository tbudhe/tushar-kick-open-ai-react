import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AllOutIcon from '@mui/icons-material/AllOut';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import WorkIcon from '@mui/icons-material/Work';

interface VerticalMenuProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ collapsed, setCollapsed }) => {
  const [systemOpen, setSystemOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiConceptsOpen, setAiConceptsOpen] = useState(false);
  const [mlPracticeOpen, setMlPracticeOpen] = useState(false);
  const [foundationOpen, setFoundationOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [backendOpen, setBackendOpen] = useState(false);
  const [frontendOpen, setFrontendOpen] = useState(false);
  const [devopsOpen, setDevopsOpen] = useState(false);

  return (
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
        <NavLink className="nav-link" to="/job-search">
          {collapsed ? <span title="Job Search"><WorkIcon /></span> : 'Job Search'}
        </NavLink>
      </li>
      <li>
        <NavLink
          className="nav-link with-caret"
          to="/ai"
          onClick={() => setAiOpen((prev) => !prev)}
        >
          {collapsed ? <span title="AI"><AllOutIcon /></span> : 'AI'}
          {!collapsed && (
            <span className={`submenu-caret ${aiOpen ? 'open' : ''}`}>▾</span>
          )}
        </NavLink>
        {!collapsed && aiOpen && (
          <ul className="nav-submenu">
            <li>
              <NavLink
                className="nav-sublink with-caret"
                to="/ai"
                onClick={() => setAiConceptsOpen((prev) => !prev)}
              >
                AI Concepts
                <span className={`submenu-caret ${aiConceptsOpen ? 'open' : ''}`}>
                  ▾
                </span>
              </NavLink>
            </li>
            {aiConceptsOpen && (
              <li className="submenu-items">
                <NavLink className="nav-sublink subitem" to="/ai#supervised-learning">
                  Supervised Learning
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#unsupervised-learning">
                  Unsupervised Learning
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#reinforcement-learning">
                  Reinforcement Learning
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#agentic-vs-generative-ai">
                  Agentic AI vs Generative AI
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#entropy-vs-gini">
                  Entropy vs Gini Index
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#linear-regression">
                  Linear Regression Deep Dive
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#logistic-regression">
                  Logistic Regression Deep Dive
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#softmax-function">
                  Softmax Function Deep Dive
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#svm-deep-dive">
                  Support Vector Machine (SVM) Deep Dive
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/ai#gradient-descent">
                  Gradient Descent Deep Dive
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                className="nav-sublink with-caret"
                to="/practice-ml"
                onClick={() => setMlPracticeOpen((prev) => !prev)}
              >
                ML Practice
                <span className={`submenu-caret ${mlPracticeOpen ? 'open' : ''}`}>
                  ▾
                </span>
              </NavLink>
            </li>
            {mlPracticeOpen && (
              <li className="submenu-items">
                <NavLink className="nav-sublink subitem" to="/practice-ml#business-objectives">
                  Business Objectives
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#key-interview-questions">
                  Key Interview Questions
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#system-components">
                  System Components
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#success-metrics">
                  Success Metrics
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#visual-search-ml">
                  Visual Search - ML
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#google-street-blurring-ml">
                  Google Street Blurring - ML
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#l1-vs-l2-regression">
                  L1 vs L2 Regression
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#overfitting-vs-underfitting">
                  Overfitting vs Underfitting
                </NavLink>
                <NavLink className="nav-sublink subitem" to="/practice-ml#gradient-descent-vs-sgd-vs-als">
                  Gradient Descent vs SGD vs ALS
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </li>
      <li>
        <NavLink
          className="nav-link with-caret"
          to="/system"
          onClick={() => setSystemOpen((prev) => !prev)}
        >
          {collapsed ? <span title="System"><AllInclusiveIcon /></span> : 'System'}
          {!collapsed && (
            <span className={`submenu-caret ${systemOpen ? 'open' : ''}`}>▾</span>
          )}
        </NavLink>
        {!collapsed && systemOpen && (
          <ul className="nav-submenu">
            <li>
              <button
                type="button"
                className="submenu-toggle"
                onClick={() => setFoundationOpen((prev) => !prev)}
              >
                <span>Foundation</span>
                <span className={`submenu-caret ${foundationOpen ? 'open' : ''}`}>
                  ▾
                </span>
              </button>
            </li>
            {foundationOpen && (
              <li className="submenu-items">
                <NavLink className="nav-sublink" to="/system#performance">
                  Performance Matrices
                </NavLink>
                <NavLink className="nav-sublink" to="/system#reliability">
                  System Reliability
                </NavLink>
                <NavLink className="nav-sublink" to="/system#attributes">
                  Key System Attributes
                </NavLink>
              </li>
            )}

            <li>
              <button
                type="button"
                className="submenu-toggle"
                onClick={() => setArchitectureOpen((prev) => !prev)}
              >
                <span>Architecture</span>
                <span className={`submenu-caret ${architectureOpen ? 'open' : ''}`}>
                  ▾
                </span>
              </button>
            </li>
            {architectureOpen && (
              <li className="submenu-items">
                <NavLink className="nav-sublink" to="/system#api">
                  API Performance
                </NavLink>
                <NavLink className="nav-sublink" to="/system#patterns">
                  Design Patterns
                </NavLink>
                <NavLink className="nav-sublink" to="/system#architecture-styles">
                  Monolithic vs Microservices
                </NavLink>
              </li>
            )}

            <li>
              <button
                type="button"
                className="submenu-toggle"
                onClick={() => setBackendOpen((prev) => !prev)}
              >
                <span>Backend & Storage</span>
                <span className={`submenu-caret ${backendOpen ? 'open' : ''}`}>
                  ▾
                </span>
              </button>
            </li>
            {backendOpen && (
              <li className="submenu-items">
                <NavLink className="nav-sublink" to="/system#database">
                  Database Performance
                </NavLink>
                <NavLink className="nav-sublink" to="/system#db-types">
                  Database Types
                </NavLink>
                <NavLink className="nav-sublink" to="/system#cache-compare">
                  Kafka vs Redis
                </NavLink>
              </li>
            )}

            <li>
              <button
                type="button"
                className="submenu-toggle"
                onClick={() => setFrontendOpen((prev) => !prev)}
              >
                <span>Frontend & APIs</span>
                <span className={`submenu-caret ${frontendOpen ? 'open' : ''}`}>
                  ▾
                </span>
              </button>
            </li>
            {frontendOpen && (
              <li className="submenu-items">
                <NavLink className="nav-sublink" to="/system#frontend">
                  Front-end Performance
                </NavLink>
                <NavLink className="nav-sublink" to="/system#api-styles">
                  GraphQL vs REST
                </NavLink>
                <NavLink className="nav-sublink" to="/system#protocols">
                  Protocols
                </NavLink>
              </li>
            )}

            <li>
              <button
                type="button"
                className="submenu-toggle"
                onClick={() => setDevopsOpen((prev) => !prev)}
              >
                <span>DevOps & Networking</span>
                <span className={`submenu-caret ${devopsOpen ? 'open' : ''}`}>
                  ▾
                </span>
              </button>
            </li>
            {devopsOpen && (
              <li className="submenu-items">
                <NavLink className="nav-sublink" to="/system#devops">
                  DevOps & Deployment
                </NavLink>
                <NavLink className="nav-sublink" to="/system#networking">
                  Networking
                </NavLink>
                <NavLink className="nav-sublink" to="/system#communication">
                  Communication Models
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </li>
    </ul>
    </div>
  );
};

export default VerticalMenu;