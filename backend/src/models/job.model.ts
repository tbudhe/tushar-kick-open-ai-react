import mongoose from 'mongoose';

export interface JobDocument extends mongoose.Document {
  externalId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  url: string;
  source: string;
  employmentType: string;
  publishedAt: string | null;
  searchQuery: string;
}

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    company: { type: String, default: 'Unknown Company' },
    location: { type: String, default: 'Remote' },
    salary: { type: String, default: 'Not disclosed' },
    description: { type: String, default: '' },
    url: { type: String, default: '' },
    source: { type: String, default: 'remotive' },
    employmentType: { type: String, default: 'Not specified' },
    publishedAt: { type: String, default: null },
    searchQuery: { type: String, default: '' },
  },
  {
    collection: 'jobs',
    timestamps: true,
  },
);

jobSchema.index({ updatedAt: -1 });
jobSchema.index({ employmentType: 1, updatedAt: -1 });
jobSchema.index({ location: 1, updatedAt: -1 });

export const JobModel = mongoose.models.Job || mongoose.model<JobDocument>('Job', jobSchema);
