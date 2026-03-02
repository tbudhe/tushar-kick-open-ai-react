import mongoose from 'mongoose';

export interface RagVectorDocument extends mongoose.Document {
  vectorId: string;
  text: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  source: string;
}

const ragVectorSchema = new mongoose.Schema(
  {
    vectorId: { type: String, required: true, unique: true, index: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    source: { type: String, default: 'mongo' },
  },
  {
    collection: 'rag_vectors',
    timestamps: true,
  },
);

export const RagVectorModel = mongoose.models.RagVector
  || mongoose.model<RagVectorDocument>('RagVector', ragVectorSchema);
