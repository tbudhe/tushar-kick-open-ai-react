import { isDatabaseConnected } from '../config/database';
import { RagVectorModel } from '../models/rag-vector.model';

export interface RagUpsertInput {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
  embeddingProvider?: EmbeddingProvider;
}

export interface RagRetrievedItem {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
  score: number;
}

export interface RagRetrieveInput {
  query: string;
  topK?: number;
  embeddingProvider?: EmbeddingProvider;
}

export type EmbeddingProvider = 'openai' | 'gemini' | 'fallback';
type VectorBackend = 'pinecone' | 'mongo' | 'memory';

const MEMORY_STORE = new Map<string, { text: string; metadata: Record<string, unknown>; embedding: number[] }>();

function getEmbeddingProvider(preferred?: EmbeddingProvider): EmbeddingProvider {
  if (preferred) {
    return preferred;
  }

  const configured = (process.env.RAG_EMBEDDING_PROVIDER || '').trim().toLowerCase();
  if (configured === 'openai' || configured === 'gemini' || configured === 'fallback') {
    return configured;
  }

  if ((process.env.OPENAI_API_KEY || '').trim()) {
    return 'openai';
  }
  if ((process.env.GEMINI_API_KEY || '').trim()) {
    return 'gemini';
  }
  return 'fallback';
}

function getVectorBackend(): VectorBackend {
  const configured = (process.env.RAG_VECTOR_BACKEND || '').trim().toLowerCase();
  if (configured === 'pinecone' || configured === 'mongo' || configured === 'memory') {
    return configured;
  }

  if ((process.env.PINECONE_API_KEY || '').trim() && (process.env.PINECONE_INDEX_HOST || '').trim()) {
    return 'pinecone';
  }

  if (isDatabaseConnected()) {
    return 'mongo';
  }

  return 'memory';
}

function vectorNorm(values: number[]) {
  const sum = values.reduce((acc, value) => acc + value * value, 0);
  return Math.sqrt(sum);
}

function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || !b.length || a.length !== b.length) {
    return 0;
  }

  const dot = a.reduce((acc, value, index) => acc + value * b[index], 0);
  const denominator = vectorNorm(a) * vectorNorm(b);
  if (!denominator) {
    return 0;
  }

  return dot / denominator;
}

function fallbackEmbedding(text: string, dimensions = 128) {
  const values = new Array<number>(dimensions).fill(0);
  const normalized = text.toLowerCase();

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    const slot = code % dimensions;
    values[slot] += (code % 31) / 31;
  }

  const norm = vectorNorm(values);
  if (!norm) {
    return values;
  }

  return values.map((value) => value / norm);
}

async function openAiEmbedding(text: string): Promise<number[] | null> {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
        input: text.slice(0, 8000),
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };

    const embedding = payload.data?.[0]?.embedding;
    return Array.isArray(embedding) ? embedding : null;
  } catch {
    return null;
  }
}

async function geminiEmbedding(text: string): Promise<number[] | null> {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          parts: [{ text: text.slice(0, 8000) }],
        },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      embedding?: { values?: number[] };
    };

    const embedding = payload.embedding?.values;
    return Array.isArray(embedding) ? embedding : null;
  } catch {
    return null;
  }
}

export async function generateEmbedding(
  text: string,
  preferredProvider?: EmbeddingProvider,
): Promise<{ provider: EmbeddingProvider; embedding: number[] }> {
  const provider = getEmbeddingProvider(preferredProvider);

  if (provider === 'openai') {
    const embedding = await openAiEmbedding(text);
    if (embedding) {
      return { provider: 'openai', embedding };
    }
  }

  if (provider === 'gemini') {
    const embedding = await geminiEmbedding(text);
    if (embedding) {
      return { provider: 'gemini', embedding };
    }
  }

  if (provider !== 'openai') {
    const openAi = await openAiEmbedding(text);
    if (openAi) {
      return { provider: 'openai', embedding: openAi };
    }
  }

  if (provider !== 'gemini') {
    const gemini = await geminiEmbedding(text);
    if (gemini) {
      return { provider: 'gemini', embedding: gemini };
    }
  }

  return {
    provider: 'fallback',
    embedding: fallbackEmbedding(text),
  };
}

async function pineconeUpsert(vector: { id: string; values: number[]; metadata: Record<string, unknown> }) {
  const host = (process.env.PINECONE_INDEX_HOST || '').trim();
  const apiKey = (process.env.PINECONE_API_KEY || '').trim();
  const namespace = (process.env.PINECONE_NAMESPACE || 'default').trim();

  if (!host || !apiKey) {
    return false;
  }

  const response = await fetch(`https://${host}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      namespace,
      vectors: [vector],
    }),
  });

  return response.ok;
}

async function pineconeQuery(embedding: number[], topK: number): Promise<RagRetrievedItem[] | null> {
  const host = (process.env.PINECONE_INDEX_HOST || '').trim();
  const apiKey = (process.env.PINECONE_API_KEY || '').trim();
  const namespace = (process.env.PINECONE_NAMESPACE || 'default').trim();

  if (!host || !apiKey) {
    return null;
  }

  const response = await fetch(`https://${host}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      namespace,
      vector: embedding,
      topK,
      includeMetadata: true,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    matches?: Array<{
      id?: string;
      score?: number;
      metadata?: Record<string, unknown>;
    }>;
  };

  return (payload.matches || []).map((match) => ({
    id: String(match.id || ''),
    text: String(match.metadata?.text || ''),
    metadata: (match.metadata || {}) as Record<string, unknown>,
    score: typeof match.score === 'number' ? match.score : 0,
  }));
}

export async function upsertRagDocument(input: RagUpsertInput) {
  const text = input.text.trim();
  if (!text) {
    throw new Error('Document text is required');
  }

  const { provider, embedding } = await generateEmbedding(text, input.embeddingProvider);
  const backend = getVectorBackend();
  const metadata = {
    ...(input.metadata || {}),
    text,
    embeddingProvider: provider,
  };

  if (backend === 'pinecone') {
    const ok = await pineconeUpsert({ id: input.id, values: embedding, metadata });
    if (ok) {
      return { success: true, backend: 'pinecone' as const, embeddingProvider: provider };
    }
  }

  if (backend === 'mongo' && isDatabaseConnected()) {
    await RagVectorModel.updateOne(
      { vectorId: input.id },
      {
        $set: {
          vectorId: input.id,
          text,
          embedding,
          metadata,
          source: 'mongo',
        },
      },
      { upsert: true },
    );

    return { success: true, backend: 'mongo' as const, embeddingProvider: provider };
  }

  MEMORY_STORE.set(input.id, {
    text,
    metadata,
    embedding,
  });
  return { success: true, backend: 'memory' as const, embeddingProvider: provider };
}

export async function retrieveRagDocuments(input: RagRetrieveInput) {
  const query = input.query.trim();
  if (!query) {
    throw new Error('Query is required');
  }

  const topK = Math.min(Math.max(input.topK || 5, 1), 20);
  const { provider, embedding } = await generateEmbedding(query, input.embeddingProvider);
  const backend = getVectorBackend();

  if (backend === 'pinecone') {
    const pinecone = await pineconeQuery(embedding, topK);
    if (pinecone) {
      return {
        backend: 'pinecone' as const,
        embeddingProvider: provider,
        items: pinecone,
      };
    }
  }

  if (backend === 'mongo' && isDatabaseConnected()) {
    const providerFilter = input.embeddingProvider
      ? { 'metadata.embeddingProvider': input.embeddingProvider }
      : {};

    const candidates = await RagVectorModel.find(providerFilter)
      .limit(200)
      .lean();

    const scored = candidates
      .map((candidate) => ({
        id: candidate.vectorId,
        text: candidate.text,
        metadata: (candidate.metadata || {}) as Record<string, unknown>,
        score: cosineSimilarity(embedding, candidate.embedding || []),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return {
      backend: 'mongo' as const,
      embeddingProvider: provider,
      items: scored,
    };
  }

  const scoredMemory = Array.from(MEMORY_STORE.entries())
    .filter(([, value]) => {
      if (!input.embeddingProvider) {
        return true;
      }

      return value.metadata.embeddingProvider === input.embeddingProvider;
    })
    .map(([id, value]) => ({
      id,
      text: value.text,
      metadata: value.metadata,
      score: cosineSimilarity(embedding, value.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return {
    backend: 'memory' as const,
    embeddingProvider: provider,
    items: scoredMemory,
  };
}

export async function getRagContextForTailoring(resumeText: string, jobText: string) {
  const retrieval = await retrieveRagDocuments({
    query: `${jobText}\n${resumeText.slice(0, 2000)}`,
    topK: 3,
  });

  return retrieval.items
    .filter((item) => item.score > 0)
    .map((item, index) => `Context ${index + 1} (score ${item.score.toFixed(3)}): ${item.text.slice(0, 500)}`)
    .join('\n\n');
}
