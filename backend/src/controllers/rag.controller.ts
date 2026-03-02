import { Request, Response } from 'express';
import { isDatabaseConnected } from '../config/database';
import { sendError, sendSuccess } from '../helpers/response';
import { RagBenchmarkRunModel } from '../models/rag-benchmark-run.model';
import { retrieveRagDocuments, upsertRagDocument } from '../services/rag.service';

function parseEmbeddingProvider(value: unknown) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'openai' || normalized === 'gemini' || normalized === 'fallback') {
    return normalized;
  }

  return undefined;
}

export async function ragUpsertController(req: Request, res: Response) {
  try {
    const id = typeof req.body?.id === 'string' ? req.body.id.trim() : '';
    const text = typeof req.body?.text === 'string' ? req.body.text : '';
    const metadata = typeof req.body?.metadata === 'object' && req.body?.metadata
      ? req.body.metadata as Record<string, unknown>
      : {};
    const embeddingProvider = parseEmbeddingProvider(req.body?.embeddingProvider);

    if (!id) {
      return sendError(res, 'Document id is required', 400);
    }
    if (!text.trim()) {
      return sendError(res, 'Document text is required', 400);
    }

    const result = await upsertRagDocument({ id, text, metadata, embeddingProvider });
    return sendSuccess(res, {
      id,
      ...result,
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to upsert vector document', 500);
  }
}

export async function ragRetrieveController(req: Request, res: Response) {
  try {
    const query = typeof req.body?.query === 'string' ? req.body.query : '';
    const topKRaw = req.body?.topK;
    const topK = typeof topKRaw === 'number' ? topKRaw : parseInt(String(topKRaw || '5'), 10);
    const embeddingProvider = parseEmbeddingProvider(req.body?.embeddingProvider);

    if (!query.trim()) {
      return sendError(res, 'Query is required', 400);
    }

    const result = await retrieveRagDocuments({
      query,
      topK: Number.isNaN(topK) ? 5 : topK,
      embeddingProvider,
    });
    return sendSuccess(res, {
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to retrieve vectors', 500);
  }
}

export async function ragSaveBenchmarkRunController(req: Request, res: Response) {
  try {
    const runId = typeof req.body?.runId === 'string' ? req.body.runId.trim() : '';
    const query = typeof req.body?.query === 'string' ? req.body.query : '';
    const topK = typeof req.body?.topK === 'number' ? req.body.topK : parseInt(String(req.body?.topK || '0'), 10);
    const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];

    if (!runId) {
      return sendError(res, 'runId is required', 400);
    }

    if (!query.trim()) {
      return sendError(res, 'query is required', 400);
    }

    if (!isDatabaseConnected()) {
      return sendSuccess(res, {
        success: true,
        saved: false,
        reason: 'database-not-connected',
      });
    }

    await RagBenchmarkRunModel.updateOne(
      { runId },
      {
        $set: {
          runId,
          query,
          topK: Number.isNaN(topK) ? 0 : topK,
          rows,
        },
      },
      { upsert: true },
    );

    return sendSuccess(res, {
      success: true,
      saved: true,
      runId,
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to save benchmark run', 500);
  }
}

export async function ragListBenchmarkRunsController(req: Request, res: Response) {
  try {
    const limitRaw = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const limit = Number.isNaN(limitRaw) ? 10 : Math.min(Math.max(limitRaw, 1), 50);

    if (!isDatabaseConnected()) {
      return sendSuccess(res, {
        success: true,
        items: [],
      });
    }

    const items = await RagBenchmarkRunModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return sendSuccess(res, {
      success: true,
      items: items.map((item) => ({
        runId: item.runId,
        query: item.query,
        topK: item.topK,
        rows: item.rows,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to load benchmark runs', 500);
  }
}
