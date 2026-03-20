export interface Podcast {
  id: string;
  topic: string;
  summary: string;
  tags: string[];
  guest: { name: string; linkedIn: string };
  video: { youtubeFullUrl: string; youtubeShortsUrl?: string; instagramUrl?: string };
  transcriptText: string;
  audioUrl: string;
  updatedDate: string;
}
