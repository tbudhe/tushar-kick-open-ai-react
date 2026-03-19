import React from 'react';
import TechnicalResourceHub from '../technical-resource-hub/TechnicalResourceHub';
import ContentDrawer from '../content-drawer/ContentDrawer';
import { TechnicalNavItem } from '../../constants/technical-navigation';

const System: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState<TechnicalNavItem | null>(null);

  return (
    <div className="systems-container architecture-page">
      <TechnicalResourceHub category="architecture" onItemSelect={setSelectedItem} />

      <ContentDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default System;

