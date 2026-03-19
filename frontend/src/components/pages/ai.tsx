import React from 'react';
import AICard from '../ai-card/ai-card';
import TechnicalResourceHub from '../technical-resource-hub/technical-resource-hub';
import ContentDrawer from '../content-drawer/ContentDrawer';
import { TechnicalNavItem } from '../../constants/technical-navigation';

const AI: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState<TechnicalNavItem | null>(null);

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <TechnicalResourceHub category="core-tech" onItemSelect={setSelectedItem} />

      <ContentDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />

      <AICard />
    </div>
  );
};

export default AI;