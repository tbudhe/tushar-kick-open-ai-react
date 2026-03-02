import mongoose from 'mongoose';

export type ApplicationStatus = 'pending' | 'applied' | 'rejected' | 'interview';

export interface ApplicationDocument extends mongoose.Document {
  jobExternalId: string;
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobUrl: string;
  status: ApplicationStatus;
  notes: string;
  tailoredResumeId: string | null;
  emailDraft: string;
  appliedAt: string | null;
}

const applicationSchema = new mongoose.Schema(
  {
    jobExternalId: { type: String, required: true, index: true },
    jobTitle: { type: String, required: true },
    jobCompany: { type: String, default: '' },
    jobLocation: { type: String, default: '' },
    jobUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'applied', 'rejected', 'interview'],
      default: 'pending',
      required: true,
      index: true,
    },
    notes: { type: String, default: '' },
    tailoredResumeId: { type: String, default: null },
    emailDraft: { type: String, default: '' },
    appliedAt: { type: String, default: null },
  },
  {
    collection: 'applications',
    timestamps: true,
  },
);

applicationSchema.index({ updatedAt: -1 });
applicationSchema.index({ status: 1, updatedAt: -1 });
applicationSchema.index({ jobExternalId: 1, createdAt: -1 });

export const ApplicationModel = mongoose.models.Application
  || mongoose.model<ApplicationDocument>('Application', applicationSchema);
