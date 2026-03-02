import mongoose from 'mongoose';

export interface RagBenchmarkRunDocument extends mongoose.Document {
  runId: string;
  query: string;
  topK: number;
  rows: Array<{
    provider: 'openai' | 'gemini' | 'fallback';
    backend: string;
    upsertOk: boolean;
    retrievedCount: number;
    topScore: number;
    upsertMs: number;
    retrieveMs: number;
    tokenEstimate: number;
    estCostUsd: number;
    error?: string;
  }>;
}

const ragBenchmarkRunSchema = new mongoose.Schema(
  {
    runId: { type: String, required: true, unique: true, index: true },
    query: { type: String, required: true },
    topK: { type: Number, required: true },
    rows: {
      type: [
        {
          provider: { type: String, required: true },
          backend: { type: String, required: true },
          upsertOk: { type: Boolean, required: true },
          retrievedCount: { type: Number, required: true },
          topScore: { type: Number, required: true },
          upsertMs: { type: Number, required: true },
          retrieveMs: { type: Number, required: true },
          tokenEstimate: { type: Number, required: true },
          estCostUsd: { type: Number, required: true },
          error: { type: String, default: '' },
        },
      ],
      default: [],
    },
  },
  {
    collection: 'rag_benchmark_runs',
    timestamps: true,
  },
);

export const RagBenchmarkRunModel = mongoose.models.RagBenchmarkRun
  || mongoose.model<RagBenchmarkRunDocument>('RagBenchmarkRun', ragBenchmarkRunSchema);
