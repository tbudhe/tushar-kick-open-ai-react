import mongoose from 'mongoose';

export interface VideoDocument extends mongoose.Document {
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
  hostName?: string;
  hostLinkedIn?: string;
}

const videoSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    channelId: { type: String, default: 'UCYUBoardroom' },
    channelName: { type: String, default: 'YU Boardroom' },
    description: { type: String, default: '' },
    publishedAt: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    embedUrl: { type: String, default: '' },
    tags: { type: [String], default: [] },
    category: { type: String, default: 'Business' },
    source: { type: String, enum: ['youtube_api', 'manual'], default: 'manual' },
    hostName: { type: String, default: '' },
    hostLinkedIn: { type: String, default: '' },
  },
  {
    collection: 'videos',
    timestamps: true,
  },
);

videoSchema.index({ tags: 1 });
videoSchema.index({ category: 1 });
videoSchema.index({ publishedAt: -1 });
videoSchema.index({ channelId: 1, publishedAt: -1 });

export const VideoModel = mongoose.models.Video || mongoose.model<VideoDocument>('Video', videoSchema);
