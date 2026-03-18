import mongoose from 'mongoose';

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface TechSection {
  title: string;
  bullets: string[];
}

export interface ExperienceEntry {
  company: string;
  location?: string;
  role: string;
  duration: string;
  projectName?: string;
  description: string;
  projectContext?: string;
  techSections?: TechSection[];
}

export interface SocialLinks {
  linkedIn: string;
  github: string;
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  socialLinks: SocialLinks;
  resumeText: string;
}

export interface ProfileDocument extends mongoose.Document {
  profileId: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  socialLinks: SocialLinks;
  resumeText: string;
}

const profileSchema = new mongoose.Schema(
  {
    profileId: { type: String, required: true, unique: true, default: 'default' },
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    summary: { type: String, default: '' },
    skillGroups: [
      {
        title: { type: String, default: '' },
        items: [{ type: String }],
      },
    ],
    experience: [
      {
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' },
        projectContext: { type: String, default: '' },
      },
    ],
    socialLinks: {
      linkedIn: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    resumeText: { type: String, default: '' },
  },
  {
    collection: 'profiles',
    timestamps: true,
  },
);

export const ProfileModel =
  mongoose.models.Profile ||
  mongoose.model<ProfileDocument>('Profile', profileSchema);
