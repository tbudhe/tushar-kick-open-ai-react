import path from 'path';
import fs from 'fs';
import { isDatabaseConnected } from '../config/database';
import { VideoModel } from '../models/video.model';

export interface VideoFilters {
  tags?: string;
  category?: string;
  limit?: number;
}

export interface VideoResult {
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
  source: string;
}

interface SeedVideo {
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

function loadSeedData(): SeedVideo[] {
  const seedPaths = [
    path.join(process.cwd(), 'frontend', 'src', 'constants', 'videos-seed.json'),
    path.join(__dirname, '../../../../frontend/src/constants/videos-seed.json'),
    path.join(__dirname, '../../../frontend/src/constants/videos-seed.json'),
  ];

  for (const seedPath of seedPaths) {
    if (fs.existsSync(seedPath)) {
      try {
        const raw = fs.readFileSync(seedPath, 'utf-8');
        return JSON.parse(raw) as SeedVideo[];
      } catch {
        // continue to next candidate
      }
    }
  }

  console.warn('[VIDEO] Seed file not found in any candidate path.');
  return [];
}

function toSafeLimit(limit: number | undefined): number {
  if (!limit || Number.isNaN(limit)) return 20;
  return Math.min(limit, 100);
}

export async function getAllVideos(filters: VideoFilters = {}): Promise<VideoResult[]> {
  const limit = toSafeLimit(filters.limit);

  if (!isDatabaseConnected()) {
    console.warn('[VIDEO] DB not connected — returning seed data.');
    const seed = loadSeedData();
    return seed.slice(0, limit) as unknown as VideoResult[];
  }

  const query: Record<string, unknown> = {};

  if (filters.tags) {
    const tagList = filters.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (tagList.length > 0) {
      query.tags = { $in: tagList };
    }
  }

  if (filters.category && filters.category.trim()) {
    query.category = filters.category.trim();
  }

  const videos = await VideoModel.find(query)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return videos as unknown as VideoResult[];
}

export async function upsertVideo(data: SeedVideo): Promise<void> {
  await VideoModel.findOneAndUpdate(
    { videoId: data.videoId },
    { $set: data },
    { upsert: true, new: true },
  );
}

export async function seedVideos(): Promise<{ upserted: number }> {
  const seed = loadSeedData();
  if (seed.length === 0) {
    return { upserted: 0 };
  }

  let upserted = 0;
  for (const video of seed) {
    await upsertVideo(video);
    upserted++;
  }

  console.log(`[VIDEO] Seeded ${upserted} videos from seed file.`);
  return { upserted };
}

interface YouTubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    channelId?: string;
    channelTitle?: string;
    thumbnails?: { high?: { url?: string }; default?: { url?: string } };
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
}

export async function syncVideosFromYouTube(): Promise<{ synced: number; source: 'youtube_api' | 'seed' }> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCYUBoardroom';

  if (!apiKey) {
    console.log('[VIDEO] YOUTUBE_API_KEY not set — falling back to seed sync.');
    const result = await seedVideos();
    return { synced: result.upserted, source: 'seed' };
  }

  if (!isDatabaseConnected()) {
    console.warn('[VIDEO] DB not connected — skipping YouTube sync.');
    return { synced: 0, source: 'youtube_api' };
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('channelId', channelId);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('order', 'date');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '25');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`YouTube API responded with status ${response.status}`);
  }

  const data = (await response.json()) as YouTubeSearchResponse;
  const items = data.items ?? [];

  let synced = 0;
  for (const item of items) {
    const videoId = item.id?.videoId;
    if (!videoId) continue;

    const snippet = item.snippet ?? {};
    const thumbnail =
      snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url ?? '';

    await upsertVideo({
      videoId,
      title: snippet.title ?? 'Untitled',
      channelId: snippet.channelId ?? channelId,
      channelName: snippet.channelTitle ?? 'YU Boardroom',
      description: snippet.description ?? '',
      publishedAt: snippet.publishedAt ?? '',
      thumbnailUrl: thumbnail,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      tags: [],
      category: 'Business',
      source: 'youtube_api',
    });
    synced++;
  }

  console.log(`[VIDEO] Synced ${synced} videos from YouTube API.`);
  return { synced, source: 'youtube_api' };
}
