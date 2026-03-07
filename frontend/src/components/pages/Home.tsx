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
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(EMPTY_PROFILE);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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

  const startEditing = () => {
    setDraft({ ...profile, experience: profile.experience.map((e) => ({ ...e })), skillGroups: profile.skillGroups.map((g) => ({ ...g, items: [...g.items] })) });
    setSaveStatus('idle');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveStatus('idle');
  };

  const saveProfile = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = (await res.json()) as { profile?: ProfileData };
      if (data?.profile) {
        setProfile(data.profile);
      }
      setSaveStatus('saved');
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus('idle');
      }, 1200);
    } catch {
      setSaveStatus('error');
    }
  };

  // --- Draft field helpers ---
  const setField = (key: keyof ProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const setExpField = (idx: number, key: keyof ExperienceEntry, value: string) => {
    setDraft((prev) => {
      const experience = prev.experience.map((e, i) => i === idx ? { ...e, [key]: value } : e);
      return { ...prev, experience };
    });
  };

  const addExperience = () => {
    setDraft((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', duration: '', description: '', projectContext: '' }],
    }));
  };

  const removeExperience = (idx: number) => {
    setDraft((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  const setSkillGroupItems = (groupIdx: number, value: string) => {
    setDraft((prev) => {
      const skillGroups = prev.skillGroups.map((g, i) =>
        i === groupIdx ? { ...g, items: value.split(',').map((s) => s.trim()).filter(Boolean) } : g,
      );
      return { ...prev, skillGroups };
    });
  };

  const regenerateResumeText = () => {
    const lines: string[] = [];
    const d = draft;
    const headerParts = [d.name, d.title, d.location, d.email, d.phone].filter(Boolean);
    lines.push(headerParts.join(' | '));
    lines.push('');
    if (d.summary?.trim()) {
      lines.push('Summary');
      lines.push(d.summary.trim());
      lines.push('');
    }
    const allSkills = d.skillGroups.flatMap((g) => g.items).filter(Boolean);
    if (allSkills.length > 0) {
      lines.push('Skills');
      lines.push(allSkills.join(', '));
      lines.push('');
    }
    if (d.experience?.length > 0) {
      lines.push('Experience');
      d.experience.forEach((exp) => {
        const header = [exp.company, exp.role, exp.duration].filter(Boolean).join(' | ');
        lines.push(header);
        exp.description.split(/[;\n]/).map((s) => s.trim()).filter(Boolean).forEach((b) => lines.push(`- ${b}`));
        lines.push('');
      });
    }
    setDraft((prev) => ({ ...prev, resumeText: lines.join('\n').trim() }));
  };

  if (isLoading) {
    return (
      <div className="ProfilePage" style={{ textAlign: 'left', padding: '12px' }}>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading profile...</p>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="ProfilePage" style={{ textAlign: 'left', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button
            type="button"
            className="resume-action-btn"
            onClick={startEditing}
          >
            Edit Profile
          </button>
        </div>
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
  }

  return (
    <div className="ProfilePage" style={{ textAlign: 'left', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Edit Profile</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="resume-action-btn" onClick={cancelEditing} disabled={saveStatus === 'saving'}>
            Cancel
          </button>
          <button type="button" className="resume-action-btn primary" onClick={saveProfile} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Save Profile'}
          </button>
        </div>
      </div>

      {saveStatus === 'error' && (
        <p className="resume-error" style={{ marginBottom: '12px' }}>Failed to save. Please try again.</p>
      )}

      <div className="panel-card job-carousel-panel" style={{ marginBottom: '16px' }}>
        <h3 className="resume-parser-header" style={{ marginBottom: '12px' }}>Basic Info</h3>
        <div className="job-search-grid">
          {(['name', 'title', 'location', 'email', 'phone'] as const).map((field) => (
            <div key={field} className="job-search-field">
              <label style={{ textTransform: 'capitalize' }}>{field}</label>
              <input
                type="text"
                value={draft[field]}
                onChange={(e) => setField(field, e.target.value)}
                className="job-search-input"
              />
            </div>
          ))}
        </div>
        <div className="job-search-field" style={{ marginTop: '12px' }}>
          <label>Professional Summary</label>
          <textarea
            value={draft.summary}
            onChange={(e) => setField('summary', e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }}
          />
        </div>
        <div className="job-search-grid" style={{ marginTop: '12px' }}>
          <div className="job-search-field">
            <label>LinkedIn URL</label>
            <input
              type="text"
              value={draft.socialLinks.linkedIn}
              onChange={(e) => setDraft((p) => ({ ...p, socialLinks: { ...p.socialLinks, linkedIn: e.target.value } }))}
              className="job-search-input"
            />
          </div>
          <div className="job-search-field">
            <label>GitHub URL</label>
            <input
              type="text"
              value={draft.socialLinks.github}
              onChange={(e) => setDraft((p) => ({ ...p, socialLinks: { ...p.socialLinks, github: e.target.value } }))}
              className="job-search-input"
            />
          </div>
        </div>
      </div>

      <div className="panel-card job-carousel-panel" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Experience</h3>
          <button type="button" className="resume-action-btn" onClick={addExperience}>+ Add Position</button>
        </div>
        {draft.experience.map((exp, idx) => (
          <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '10px', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
              <button type="button" className="resume-action-btn" style={{ fontSize: '0.75rem', padding: '2px 10px' }} onClick={() => removeExperience(idx)}>
                Remove
              </button>
            </div>
            <div className="job-search-grid">
              <div className="job-search-field">
                <label>Company</label>
                <input type="text" value={exp.company} onChange={(e) => setExpField(idx, 'company', e.target.value)} className="job-search-input" />
              </div>
              <div className="job-search-field">
                <label>Role / Title</label>
                <input type="text" value={exp.role} onChange={(e) => setExpField(idx, 'role', e.target.value)} className="job-search-input" />
              </div>
              <div className="job-search-field">
                <label>Duration (e.g. Jan 2021 – Present)</label>
                <input type="text" value={exp.duration} onChange={(e) => setExpField(idx, 'duration', e.target.value)} className="job-search-input" />
              </div>
            </div>
            <div className="job-search-field" style={{ marginTop: '8px' }}>
              <label>Description / Highlights</label>
              <textarea
                value={exp.description}
                onChange={(e) => setExpField(idx, 'description', e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>
            <div className="job-search-field" style={{ marginTop: '8px' }}>
              <label>Project Context</label>
              <textarea
                value={exp.projectContext}
                onChange={(e) => setExpField(idx, 'projectContext', e.target.value)}
                rows={3}
                placeholder="Key projects, technologies used, outcomes... (used in tailored resume)"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="panel-card job-carousel-panel">
        <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Skills</h3>
        {draft.skillGroups.map((group, gIdx) => (
          <div key={gIdx} className="job-search-field" style={{ marginBottom: '10px' }}>
            <label>{group.title}</label>
            <input
              type="text"
              value={group.items.join(', ')}
              onChange={(e) => setSkillGroupItems(gIdx, e.target.value)}
              className="job-search-input"
              placeholder="Comma-separated skills"
            />
          </div>
        ))}
      </div>

      <div className="panel-card job-carousel-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div>
            <h3 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Resume Text (used for tailoring)</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
              Paste your full resume here to use your exact wording — company names, bullet points, all sections.
              Leave blank to auto-generate from the structured fields above.
            </p>
          </div>
          <button type="button" className="resume-action-btn" style={{ flexShrink: 0, marginLeft: '12px' }} onClick={regenerateResumeText}>
            Regenerate from Profile
          </button>
        </div>
        <textarea
          value={draft.resumeText}
          onChange={(e) => setDraft((prev) => ({ ...prev, resumeText: e.target.value }))}
          rows={18}
          placeholder="Paste your full resume text here..."
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.82rem', fontFamily: 'monospace', resize: 'vertical', marginTop: '10px' }}
        />
      </div>
    </div>
  );
};

export default Home;
