import React from 'react';
import PodcastHub from '../podcast-hub/PodcastHub';
import PodcastDrawer from '../podcast-hub/PodcastDrawer';
import { Podcast } from '../../types/podcast';
import podcastsData from '../../constants/podcasts-data.json';

const podcasts: Podcast[] = podcastsData as Podcast[];

const InsightsPage: React.FC = () => {
  const [selectedPodcast, setSelectedPodcast] = React.useState<Podcast | null>(null);

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <PodcastHub
        podcasts={podcasts}
        onSelect={setSelectedPodcast}
        selectedId={selectedPodcast?.id ?? null}
      />
      <PodcastDrawer
        podcast={selectedPodcast}
        onClose={() => setSelectedPodcast(null)}
      />
    </div>
  );
};

export default InsightsPage;
