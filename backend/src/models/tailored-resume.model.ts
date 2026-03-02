import mongoose from 'mongoose';

export interface TailoredResumeDocument extends mongoose.Document {
  jobExternalId: string;
  jobTitle: string;
  jobCompany: string;
  jobDescription: string;
  originalResume: string;
  tailoredResume: string;
  jobAnalysis: string;
  changeHighlights: string[];
  source: 'claude' | 'fallback';
}

const tailoredResumeSchema = new mongoose.Schema(
  {
    jobExternalId: { type: String, required: true, index: true },
    jobTitle: { type: String, required: true },
    jobCompany: { type: String, default: '' },
    jobDescription: { type: String, default: '' },
    originalResume: { type: String, required: true },
    tailoredResume: { type: String, required: true },
    jobAnalysis: { type: String, required: true },
    changeHighlights: { type: [String], default: [] },
    source: { type: String, enum: ['claude', 'fallback'], default: 'fallback' },
  },
  {
    collection: 'tailored_resumes',
    timestamps: true,
  },
);

export const TailoredResumeModel = mongoose.models.TailoredResume
  || mongoose.model<TailoredResumeDocument>('TailoredResume', tailoredResumeSchema);
