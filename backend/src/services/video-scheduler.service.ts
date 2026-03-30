import cron from 'node-cron';
import { syncVideosFromYouTube } from './video.service';

interface VideoSchedulerState {
  enabled: boolean;
  schedule: string;
  lastRunAt: string | null;
  lastSynced: number | null;
  lastSource: string | null;
}

const state: VideoSchedulerState = {
  enabled: false,
  schedule: '',
  lastRunAt: null,
  lastSynced: null,
  lastSource: null,
};

async function runVideoSync() {
  console.log('[VIDEO_SCHEDULER] Running scheduled video sync.');
  try {
    const result = await syncVideosFromYouTube();
    state.lastRunAt = new Date().toISOString();
    state.lastSynced = result.synced;
    state.lastSource = result.source;
    console.log(`[VIDEO_SCHEDULER] Sync complete. Synced ${result.synced} videos from ${result.source}.`);
  } catch (error) {
    console.error('[VIDEO_SCHEDULER] Sync failed:', error);
    state.lastRunAt = new Date().toISOString();
    state.lastSynced = 0;
  }
}

export function initVideoScheduler() {
  const enabled = (process.env.ENABLE_VIDEO_SCHEDULER || '').toLowerCase() === 'true';
  if (!enabled) {
    console.log('[VIDEO_SCHEDULER] Disabled. Set ENABLE_VIDEO_SCHEDULER=true to enable daily sync.');
    return;
  }

  const schedule = (process.env.VIDEO_CRON_SCHEDULE || '0 6 * * *').trim();

  if (!cron.validate(schedule)) {
    console.error(`[VIDEO_SCHEDULER] Invalid VIDEO_CRON_SCHEDULE: "${schedule}". Scheduler not started.`);
    return;
  }

  state.enabled = true;
  state.schedule = schedule;

  cron.schedule(schedule, () => {
    void runVideoSync();
  });

  console.log(`[VIDEO_SCHEDULER] Started. Schedule: "${schedule}"`);
}

export function getVideoSchedulerStatus() {
  return {
    enabled: state.enabled,
    schedule: state.schedule || null,
    lastRunAt: state.lastRunAt,
    lastSynced: state.lastSynced,
    lastSource: state.lastSource,
  };
}
