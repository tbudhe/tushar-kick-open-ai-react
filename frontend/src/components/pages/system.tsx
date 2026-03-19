import React from 'react';
import TechnicalResourceHub from '../technical-resource-hub/technical-resource-hub';
import ContentDrawer from '../content-drawer/ContentDrawer';
import { TechnicalNavItem } from '../../constants/technical-navigation';

const System: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState<TechnicalNavItem | null>(null);

  return (
    <div className="systems-container architecture-page">
      <section id="architecture-overview" className="architecture-overview-panel">
        <h1>Architecture Review Deck</h1>
        <p>
          Recruiter-friendly high-level map first, followed by deep implementation details in each section.
        </p>
        <div className="architecture-diagram-grid">
          <div className="architecture-diagram-card">
            <h3>Performance Layer</h3>
            <p>Latency, render path, request control, and bottleneck analysis map.</p>
          </div>
          <div className="architecture-diagram-card">
            <h3>API and Service Layer</h3>
            <p>Gateway patterns, stateless service boundaries, caching, and async workload orchestration.</p>
          </div>
          <div className="architecture-diagram-card">
            <h3>Data and Storage Layer</h3>
            <p>Indexing strategy, partitioning, cache hierarchy, and operational reliability controls.</p>
          </div>
        </div>
      </section>

      <TechnicalResourceHub category="architecture" onItemSelect={setSelectedItem} />

      <ContentDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default System;

