import React from 'react';
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
  skills: string[];
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
  skills,
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
        <div className="card-footer">
          <a
            href={socialLinks.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="card-footer-link"
            title="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="card-footer-link"
            title="GitHub"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="card-body">
        <div className="card-list-item">
          <div className="card-list-item-title">Location</div>
          <p className="card-list-item-text">{location}</p>
        </div>
        <div className="card-list-item">
          <div className="card-list-item-title">Contact</div>
          <p className="card-list-item-text">
            <a href={`mailto:${email}`} style={{ color: 'var(--color-primary)' }}>
              {email}
            </a>
            {' | '}
            <a href={`tel:${phone}`} style={{ color: 'var(--color-primary)' }}>
              {phone}
            </a>
          </p>
        </div>
      </div>

      <div className="card-section">
        <h3 className="card-section-title">Professional Summary</h3>
        <p className="card-body-text">{professionalSummary}</p>
      </div>

      <div className="card-section">
        <h3 className="card-section-title">Skills</h3>
        <div className="skills-container">
          {skills.map((skill, idx) => (
            <span key={idx} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
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
