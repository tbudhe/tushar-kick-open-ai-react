import React, { useEffect, useState } from 'react';
import ProfileCard from '../profile-card/profile-card';

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
  resumeText: string;
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
  resumeText: '',
};

const Home: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data: { profile?: ProfileData }) => {
        if (data?.profile) {
          setProfile(data.profile);
        }
      })
      .catch(() => {/* silently ignore */})
      .finally(() => setIsLoading(false));
  }, []);


  if (isLoading) {
    return (
      <div className="ProfilePage" style={{ textAlign: 'left', padding: '12px' }}>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="ProfilePage" style={{ textAlign: 'left', padding: '12px' }}>
      <ProfileCard
        name={profile.name}
        title={profile.title}
        location={profile.location}
        email={profile.email}
        phone={profile.phone}
        professionalSummary={profile.summary}
        skillGroups={profile.skillGroups}
        experience={profile.experience}
        socialLinks={profile.socialLinks}
      />
    </div>
  );
};

export default Home;
