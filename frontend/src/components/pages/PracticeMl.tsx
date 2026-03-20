import React from 'react';
import TechnicalResourceHub from '../technical-resource-hub/TechnicalResourceHub';
import ContentDrawer from '../content-drawer/ContentDrawer';
import { TechnicalNavItem } from '../../constants/technical-navigation';

const PracticeML: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState<TechnicalNavItem | null>(null);

  return (
    <div className="systems-container">
      <TechnicalResourceHub category="playbooks" onItemSelect={setSelectedItem} />
      <ContentDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default PracticeML;
