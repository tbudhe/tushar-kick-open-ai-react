import React from 'react';
import VideoHub from '../video-hub/VideoHub';
import VideoDrawer from '../video-hub/VideoDrawer';
import { Video } from '../../types/video';
import videosSeedData from '../../constants/videos-seed.json';

const videosFallback: Video[] = videosSeedData as unknown as Video[];

const InsightsPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);
  const [videos, setVideos] = React.useState<Video[]>(videosFallback);

  React.useEffect(() => {
    fetch('/api/videos')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ videos: Video[] }>;
      })
      .then((data) => {
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos);
        }
      })
      .catch(() => {
        // Silently keep seed fallback — videosFallback already set as initial state
      });
  }, []);

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <VideoHub
        videos={videos}
        onSelect={setSelectedVideo}
        selectedId={selectedVideo?.videoId ?? null}
      />
      <VideoDrawer
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        allVideos={videos}
      />
    </div>
  );
};

export default InsightsPage;
