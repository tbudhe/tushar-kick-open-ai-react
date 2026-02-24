import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import '../../styles/cards.css';

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ProfileCardProps {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  professionalSummary: string;
  skillGroups: {
    title: string;
    items: string[];
  }[];
  experience: ExperienceItem[];
  socialLinks: {
    linkedIn: string;
    github: string;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  location,
  email,
  phone,
  professionalSummary,
  skillGroups,
  experience,
  socialLinks,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-header-title">{name}</h2>
          <h3 className="card-header-subtitle">{title}</h3>
        </div>
        <div className="profile-header-meta">
          <div className="profile-meta-item">
            <span className="profile-meta-label">Location</span>
            <span className="profile-meta-value">{location}</span>
          </div>
          <div className="profile-meta-item">
            <span className="profile-meta-label">Contact</span>
            <span className="profile-meta-value">
              <a href={`mailto:${email}`}>{email}</a>
              {' | '}
              <a href={`tel:${phone}`}>{phone}</a>
            </span>
          </div>
          <div className="profile-social-links">
            <a
              href={socialLinks.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-social-link"
              title="LinkedIn"
            >
              <LinkedInIcon fontSize="small" />
            </a>
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-social-link"
              title="GitHub"
            >
              <GitHubIcon fontSize="small" />
            </a>
          </div>
        </div>
      </div>

      <div className="card-section compact-section">
        <h3 className="card-section-title">Professional Summary</h3>
        <p className="card-body-text">{professionalSummary}</p>
      </div>

      <div className="card-section">
        <h3 className="card-section-title">Skills</h3>
        {skillGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="skills-group">
            <p className="skills-title">{group.title}</p>
            <div className="skills-container">
              {group.items.map((skill, idx) => (
                <span key={`${groupIndex}-${idx}`} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {experience.length > 0 && (
        <div className="card-section">
          <h3 className="card-section-title">Experience</h3>
          <ul className="card-list">
            {experience.map((exp, idx) => (
              <li key={idx} className="card-list-item">
                <div className="card-list-item-title">
                  {exp.role} at {exp.company}
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                  {exp.duration}
                </p>
                <p className="card-list-item-text">{exp.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
