import React from 'react';
import { DetailItem } from '../ml-card/ml-card';
import TechnicalResourceHub from '../technical-resource-hub/technical-resource-hub';
import ContentDrawer from '../content-drawer/ContentDrawer';
import { TechnicalNavItem } from '../../constants/technical-navigation';

interface Principle {
  name: string;
  details: DetailItem[];
}

// DetailItem type kept for data shape compatibility — content rendered via ContentDrawer
type _DetailItemAlias = DetailItem; // suppress unused-import warning without deleting import

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
