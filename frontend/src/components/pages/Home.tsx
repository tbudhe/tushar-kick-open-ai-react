import React from 'react';
import { Link } from 'react-router-dom';
import './home-marketing.css';
import { appRoutes, menuLabels } from '../../constants/routes';

const Home: React.FC = () => {
  return (
    <div className="home-marketing">
      <section className="home-hero">
        <header className="home-brand-row">
          <div className="home-brand-mark" aria-hidden="true">YU</div>
          <div>
            <p className="home-domain">yunextgenai.com</p>
            <p className="home-brand-subtitle">AI Workflows for Revenue Teams</p>
          </div>
        </header>

        <div className="home-hero-content">
          <div>
            <p className="home-chip">B2B SaaS Platform</p>
            <h1>
              Turn slow, manual outreach into a
              <span>repeatable AI-powered revenue engine.</span>
            </h1>
            <p className="home-hero-copy">
              YU Ex Gen AI helps enterprise teams automate qualification, messaging, and follow-up loops with governed AI prompts.
              Ship better outreach, reduce response time, and scale without adding operational overhead.
            </p>
            <div className="home-hero-actions">
              <Link to={appRoutes.contact} className="home-btn home-btn-primary">Open {menuLabels.contact}</Link>
              <Link to={appRoutes.aiStudio} className="home-btn home-btn-secondary">Explore {menuLabels.aiStudio}</Link>
            </div>
          </div>

          <aside className="home-metric-card" aria-label="Platform impact metrics">
            <h2>Operational Impact</h2>
            <ul>
              <li><strong>63%</strong><span>faster first-touch response</span></li>
              <li><strong>41%</strong><span>higher qualified lead conversion</span></li>
              <li><strong>99.95%</strong><span>workflow reliability target</span></li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="home-feature-grid" aria-label="Core platform benefits">
        <article className="home-feature-card">
          <h3>Scalable Orchestration</h3>
          <p>
            Run structured AI workflows for lead qualification, tailored messaging, and follow-up sequencing across teams.
          </p>
        </article>
        <article className="home-feature-card">
          <h3>Enterprise Efficiency</h3>
          <p>
            Centralize repetitive communication tasks and route exceptions to humans, cutting cycle time without sacrificing quality.
          </p>
        </article>
        <article className="home-feature-card">
          <h3>AI + Data Integration</h3>
          <p>
            Connect AI prompts with domain context and pipeline signals to produce consistent, on-brand, decision-ready output.
          </p>
        </article>
      </section>

      <section className="home-proof-strip" aria-label="Positioning statement">
        <p>
          Built for founders, sales operations, and growth teams who need measurable AI outcomes, not demo-only copilots.
        </p>
      </section>
    </div>
  );
};

export default Home;
