import React from 'react';
import TechnicalResourceHub from '../technical-resource-hub/technical-resource-hub';
import ContentDrawer from '../content-drawer/ContentDrawer';
import { TechnicalNavItem } from '../../constants/technical-navigation';

const AI: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState<TechnicalNavItem | null>(null);

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <TechnicalResourceHub category="core-tech" onItemSelect={setSelectedItem} />

      <ContentDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default AI;