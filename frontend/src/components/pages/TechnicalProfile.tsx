import React, { useEffect, useState } from 'react';

interface SkillGroup {
  title: string;
  items: string[];
}

interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
  projectContext: string;
}

interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  socialLinks: { linkedIn: string; github: string };
}

const EMPTY_PROFILE: ProfileData = {
  name: '',
  title: '',
  location: '',
  email: '',
  phone: '',
  summary: '',
  skillGroups: [],
  experience: [],
  socialLinks: { linkedIn: '', github: '' },
};

const STATIC_SKILLS: SkillGroup[] = [
  {
    title: 'Full-stack & Web Development',
    items: ['JavaScript', 'TypeScript', 'Node.js', 'Java', 'Kotlin', 'Python', 'HTML5', 'CSS', 'Bootstrap', 'AngularJS', 'REST APIs', 'SOAP APIs', 'GraphQL', 'Web API', 'XML', 'XSLT', 'jQuery', 'MongoDB', 'Redis'],
  },
  {
    title: 'Microsoft / .NET & MEAN / MERN',
    items: ['Microsoft Stack', '.NET', 'C#', 'ASP.NET', 'MVC', 'WCF', 'SQL Server', 'MEAN', 'MERN'],
  },
  {
    title: 'Cloud Platforms',
    items: ['AWS', 'Azure', 'Salesforce', 'Google Cloud Platform'],
  },
  {
    title: 'Database Core',
    items: ['Relational: replication, read replicas, failover', 'NoSQL: replica sets, sharding, partitioning', 'Indexing & query tuning', 'Consistency & durability tradeoffs'],
  },
  {
    title: 'AI / ML Architecture & MLOps',
    items: ['AI Strategy', 'Deep Learning Engineering', 'MLOps Pipeline Optimization', 'AI Consulting', 'Predictive Analytics', 'Statistical Modeling'],
  },
  {
    title: 'Protocols & Real-time Communication',
    items: ['TCP', 'HTTP/HTTPS', 'SMTP', 'gRPC', 'WebSocket', 'Socket.IO', 'WCF over TCP'],
  },
  {
    title: 'Leadership & Communication',
    items: ['Technical Leadership', 'Cross-functional Collaboration', 'Architecture Consulting', 'Mentorship'],
  },
];

const TechnicalProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({
    'Walmart Global Tech': true,
  });

  const toggleCard = (key: string) => {
    setCollapsedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetch('/api/profile')
      .then((response) => response.json())
      .then((data: { profile?: ProfileData }) => {
        if (data.profile) {
          setProfile(data.profile);
        }
      })
      .catch(() => {
        // Keep defaults when profile service is unavailable.
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="technical-profile-page">
      <section className="technical-profile-header">
        <h1>Engineer Profile</h1>
        <p>Technical capability snapshot for architecture interviews and engineering review loops.</p>
      </section>

      {isLoading ? (
        <section className="technical-profile-panel">
          <p>Loading technical profile...</p>
        </section>
      ) : (
        <>
          <section className="technical-profile-panel">
            <div className="technical-profile-bio-row">
              <div className="technical-profile-bio-left">
                <h2>{profile.name || 'Technical Candidate'}</h2>
                <p className="profile-role">{profile.title}</p>
              </div>
              <div className="technical-profile-bio-right">
                {profile.location && <span><strong>Location:</strong> {profile.location}</span>}
                {profile.email && <span><strong>Email:</strong> {profile.email}</span>}
                {profile.phone && <span><strong>Phone:</strong> {profile.phone}</span>}
              </div>
            </div>
            <p className="profile-summary">{profile.summary}</p>
          </section>

          <section className="technical-profile-panel">
            <h2>Skills</h2>
            <div className="profile-skills">
              {STATIC_SKILLS.map((group) => (
                <div key={group.title} className="profile-skill-group">
                  <h3 className="profile-skill-group-title">{group.title}</h3>
                  <div className="profile-skill-tags">
                    {group.items.map((skill) => (
                      <a key={skill} className="profile-skill-tag">{skill}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="technical-profile-panel">
            <h2>Project Experience</h2>
            <div className="technical-experience-list">
              {profile.experience.map((entry, index) => {
                const cardKey = `${entry.company}-${index}`;
                const isCollapsed = collapsedCards[entry.company] ?? false;
                return (
                  <article key={cardKey} className="technical-experience-card">
                    <header className="exp-card-header" onClick={() => toggleCard(entry.company)}>
                      <div className="exp-card-header-meta">
                        <h3>{entry.company}</h3>
                        <p>{entry.role}</p>
                        <span>{entry.duration}</span>
                      </div>
                      <button
                        className="exp-collapse-btn"
                        aria-expanded={!isCollapsed}
                        aria-label={isCollapsed ? 'Show details' : 'Hide details'}
                      >
                        {isCollapsed ? 'Show Details ▸' : 'Hide Details ▾'}
                      </button>
                    </header>
                    {!isCollapsed && (
                      <div className="exp-card-body">
                        <p>{entry.description}</p>
                        {entry.projectContext && <p>{entry.projectContext}</p>}
                      </div>
                    )}
                  </article>
                );
              })}
              {profile.experience.length === 0 && (
                <p>No experience entries available.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default TechnicalProfile;
