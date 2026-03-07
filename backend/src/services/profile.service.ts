import { isDatabaseConnected } from '../config/database';
import { ProfileModel, ProfileData, SkillGroup, ExperienceEntry } from '../models/profile.model';

const SEED_PROFILE: Omit<ProfileData, 'resumeText'> = {
  name: 'Tushar Budhe',
  title: 'Staff Software Engineer',
  location: 'Nutley, NJ',
  email: 'tbudhe23@gmail.com',
  phone: '+1(551)-XXX-XXX6',
  summary:
    'Over 16 years of experience managing full project life cycles, covering architecture, analysis, design, development, testing, and implementation. Currently landed as a Staff Software Engineer with a proven track record in productivity and efficiency. Expertise in algorithm optimization, cloud computing, and scalability. Experienced in leading cross-functional teams to deliver projects on time, while meeting quality standards.',
  skillGroups: [
    {
      title: 'Full-stack & web development',
      items: [
        'JavaScript', 'TypeScript', 'Node.js', 'Java', 'Kotlin', 'Python',
        'HTML5', 'CSS', 'Bootstrap', 'AngularJS', 'REST APIs', 'SOAP APIs',
        'GraphQL', 'Web API', 'XML', 'XSLT', 'jQuery', 'MongoDB', 'Redis',
      ],
    },
    {
      title: 'Microsoft/.NET & MEAN/MERN',
      items: ['Microsoft stack', '.NET', 'C#', 'ASP.NET', 'MVC', 'WCF', 'SQL Server', 'Python', 'MEAN', 'MERN'],
    },
    {
      title: 'Cloud platforms',
      items: ['AWS', 'Azure', 'Salesforce', 'Google Cloud Platform'],
    },
    {
      title: 'Database core',
      items: [
        'Relational: replication, read replicas, failover',
        'NoSQL: replica sets, sharding, partitioning',
        'Indexing and query tuning',
        'Consistency and durability tradeoffs',
      ],
    },
    {
      title: 'AI/ML architecture and MLOps',
      items: [
        'AI strategy', 'Deep learning engineering', 'MLOps pipeline optimization',
        'AI consulting', 'Predictive analytics', 'Statistical modeling',
      ],
    },
    {
      title: 'Protocols and real-time communication',
      items: ['TCP', 'HTTP/HTTPS', 'SMTP', 'gRPC', 'WebSocket', 'Socket.IO', 'WCF over TCP'],
    },
    {
      title: 'Leadership and communication',
      items: ['Analytical thinking', 'Problem solving', 'Team leadership', 'Communication'],
    },
    {
      title: 'DevOps Tools',
      items: [
        'Docker', 'Kubernetes', 'Torbit', 'Looper', 'Jenkins', 'Traffic Manager',
        'Load Balancer', 'CDN', 'DNS configuration', 'VNet and subnet security',
        'IP whitelisting', 'Blue-Green Deployment', 'CI/CD Setup', 'Canary Deployment',
        'Sticky sessions (Apache)', 'Docker session management',
      ],
    },
  ],
  experience: [
    {
      company: 'Walmart Global Tech',
      role: 'Staff Software Engineer',
      duration: 'Oct 2021 – Present',
      description: 'Led Scan & Go fuel integration and AI-driven catalog management.',
    },
    {
      company: 'Fidelity',
      role: 'Senior Software Developer',
      duration: 'Jan 2016 – Oct 2021',
      description: 'Built microservices and crypto trading platform.',
    },
    {
      company: 'EY (Ernst & Young)',
      role: 'Senior Software Developer',
      duration: 'Aug 2009 – Jan 2016',
      description:
        'Developed core audit applications (OGS, GMS, SSO) for global tax filing, optimized SQL databases, and engineered secure onboarding systems.',
    },
  ],
  socialLinks: {
    linkedIn: 'https://www.linkedin.com/in/tbudhe',
    github: 'https://github.com/tbudhe',
  },
};

export function generateResumeText(profile: Omit<ProfileData, 'resumeText'>): string {
  const lines: string[] = [];

  // Header
  const headerParts = [profile.name];
  if (profile.title) headerParts.push(profile.title);
  if (profile.location) headerParts.push(profile.location);
  if (profile.email) headerParts.push(profile.email);
  if (profile.phone) headerParts.push(profile.phone);
  lines.push(headerParts.join(' | '));
  lines.push('');

  // Summary
  if (profile.summary?.trim()) {
    lines.push('Summary');
    lines.push(profile.summary.trim());
    lines.push('');
  }

  // Skills — flat list from all groups
  const allSkills = profile.skillGroups.flatMap((g: SkillGroup) => g.items).filter(Boolean);
  if (allSkills.length > 0) {
    lines.push('Skills');
    lines.push(allSkills.join(', '));
    lines.push('');
  }

  // Experience — each job gets a header line + description bullets
  if (profile.experience?.length > 0) {
    lines.push('Experience');
    profile.experience.forEach((exp: ExperienceEntry) => {
      const header = [exp.company, exp.role, exp.duration].filter(Boolean).join(' | ');
      lines.push(header);
      if (exp.description?.trim()) {
        // Split description into bullet lines (handle semicolons, newlines, or single block)
        const rawBullets = exp.description
          .split(/[;\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
        rawBullets.forEach((bullet) => lines.push(`- ${bullet}`));
      }
      if (exp.projectContext?.trim()) {
        const ctxBullets = exp.projectContext
          .split(/[;\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
        ctxBullets.forEach((bullet) => lines.push(`  * ${bullet}`));
      }
      lines.push('');
    });
  }

  return lines.join('\n').trim();
}

function mapDoc(doc: any): ProfileData {
  return {
    name: doc.name || '',
    title: doc.title || '',
    location: doc.location || '',
    email: doc.email || '',
    phone: doc.phone || '',
    summary: doc.summary || '',
    skillGroups: doc.skillGroups || [],
    experience: doc.experience || [],
    socialLinks: doc.socialLinks || { linkedIn: '', github: '' },
    resumeText: doc.resumeText || '',
  };
}

export async function getProfile(): Promise<ProfileData> {
  if (!isDatabaseConnected()) {
    const resumeText = generateResumeText(SEED_PROFILE);
    return { ...SEED_PROFILE, resumeText };
  }

  const doc = await ProfileModel.findOne({ profileId: 'default' }).lean();
  if (!doc) {
    // First time: seed and persist
    const resumeText = generateResumeText(SEED_PROFILE);
    const created = await ProfileModel.create({ profileId: 'default', ...SEED_PROFILE, resumeText });
    console.log('[PROFILE] Seeded default profile.');
    return mapDoc(created);
  }

  return mapDoc(doc);
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  // Use the caller-supplied resumeText if provided, otherwise auto-generate from structured fields
  const resumeText = (typeof data.resumeText === 'string' && data.resumeText.trim())
    ? data.resumeText.trim()
    : generateResumeText({ ...SEED_PROFILE, ...data } as Omit<ProfileData, 'resumeText'>);

  if (!isDatabaseConnected()) {
    return { ...SEED_PROFILE, ...data, resumeText } as ProfileData;
  }

  const updated = await ProfileModel.findOneAndUpdate(
    { profileId: 'default' },
    { $set: { ...data, resumeText } },
    { new: true, upsert: true },
  ).lean();

  return mapDoc(updated);
}
