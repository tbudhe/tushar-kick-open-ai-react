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

const TechnicalProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

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
            <h2>Project Experience</h2>
            <div className="technical-experience-list">
              {profile.experience.map((entry, index) => (
                <article key={`${entry.company}-${entry.role}-${index}`} className="technical-experience-card">
                  <header>
                    <h3>{entry.company}</h3>
                    <p>{entry.role}</p>
                    <span>{entry.duration}</span>
                  </header>
                  <p>{entry.description}</p>
                  {entry.projectContext && <p>{entry.projectContext}</p>}
                </article>
              ))}
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
