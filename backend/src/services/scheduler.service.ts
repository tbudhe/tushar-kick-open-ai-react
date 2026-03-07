import cron from 'node-cron';
import { fetchJobs, persistJobs } from './job-search.service';

interface SchedulerState {
  enabled: boolean;
  schedule: string;
  query: string;
  lastRunAt: string | null;
  lastJobCount: number | null;
  lastPersisted: number | null;
}

const state: SchedulerState = {
  enabled: false,
  schedule: '',
  query: '',
  lastRunAt: null,
  lastJobCount: null,
  lastPersisted: null,
};

async function runJobSearch() {
  console.log(`[SCHEDULER] Running scheduled job search for query: "${state.query}"`);
  try {
    const jobs = await fetchJobs({ query: state.query, limit: 50 });
    const result = await persistJobs(jobs, state.query);
    state.lastRunAt = new Date().toISOString();
    state.lastJobCount = jobs.length;
    state.lastPersisted = result.persisted;
    console.log(`[SCHEDULER] Run complete. Found ${jobs.length} jobs, persisted ${result.persisted}.`);
  } catch (error) {
    console.error('[SCHEDULER] Run failed:', error);
    state.lastRunAt = new Date().toISOString();
    state.lastJobCount = 0;
    state.lastPersisted = 0;
  }
}

export function initScheduler() {
  const enabled = (process.env.ENABLE_SCHEDULER || '').toLowerCase() === 'true';
  if (!enabled) {
    console.log('[SCHEDULER] Disabled. Set ENABLE_SCHEDULER=true to enable daily job search.');
    return;
  }

  const schedule = (process.env.CRON_SCHEDULE || '0 8 * * *').trim();
  const query = (process.env.CRON_JOB_QUERY || 'software engineer').trim();

  if (!cron.validate(schedule)) {
    console.error(`[SCHEDULER] Invalid CRON_SCHEDULE: "${schedule}". Scheduler not started.`);
    return;
  }

  state.enabled = true;
  state.schedule = schedule;
  state.query = query;

  cron.schedule(schedule, () => {
    void runJobSearch();
  });

  console.log(`[SCHEDULER] Started. Schedule: "${schedule}", Query: "${query}"`);
}

export function getSchedulerStatus() {
  return {
    enabled: state.enabled,
    schedule: state.schedule || null,
    query: state.query || null,
    lastRunAt: state.lastRunAt,
    lastJobCount: state.lastJobCount,
    lastPersisted: state.lastPersisted,
  };
}
