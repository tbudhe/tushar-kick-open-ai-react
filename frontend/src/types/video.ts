export interface Video {
  _id: string;
  videoId: string;
  title: string;
  channelId: string;
  channelName: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  embedUrl: string;
  tags: string[];
  category: string;
  source: 'youtube_api' | 'manual';
}
