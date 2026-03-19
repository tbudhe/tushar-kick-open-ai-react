import React, { useState } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import '../../styles/cards.css';

interface ExperienceItem {
  company: string;
  location?: string;
  role: string;
  duration: string;
  projectName?: string;
  description: string;
  projectContext?: string;
  techSections?: {
    title: string;
    bullets: string[];
  }[];
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
  const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleExp = (idx: number) => {
    setExpandedIdx((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const splitToBullets = (value: string): string[] =>
    value
      .split(/[;\n]/)
      .map((s) => s.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);

  const toTwentyWords = (value: string): string => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= 20) return words.join(' ');
    return `${words.slice(0, 20).join(' ')}...`;
  };

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
          <ul className="experience-list">
            {experience.map((exp, idx) => {
              const projectDetails = splitToBullets(exp.projectContext || '');
              const detailsSections = exp.techSections?.filter((section) => section.bullets?.length) || [];
              const hasSectionedDetails = detailsSections.length > 0;
              const fallbackSections = projectDetails.length > 0 ? [{ title: 'Project Details', bullets: projectDetails }] : [];
              const visibleSections = hasSectionedDetails ? detailsSections : fallbackSections;
              const totalDetailsCount = visibleSections.reduce((total, section) => total + section.bullets.length, 0);
              const hasProjectDetails = totalDetailsCount > 0;
              const isExpanded = expandedIdx.has(idx);

              return (
                <li key={idx} className="exp-entry">
                  <div className="exp-header">
                    <div className="exp-header-left">
                      <span className="exp-company">{exp.company}</span>
                      {exp.location && <span className="exp-location">{exp.location}</span>}
                    </div>
                    <div className="exp-header-right">
                      <span className="exp-role">{exp.role}</span>
                      <span className="exp-duration">{exp.duration}</span>
                    </div>
                  </div>
                  {exp.projectName && (
                    <p className="exp-project-name">
                      <span className="exp-project-tag">Project</span> {exp.projectName}
                    </p>
                  )}
                  {exp.description?.trim() && (
                    <p className="exp-description--highlight">{toTwentyWords(exp.description)}</p>
                  )}
                  {hasProjectDetails && (
                    <button
                      type="button"
                      className="exp-expand-btn"
                      onClick={() => toggleExp(idx)}
                      aria-expanded={isExpanded}
                    >
                      <span className="exp-expand-icon">{isExpanded ? '▾' : '▸'}</span>
                      {isExpanded ? 'Hide Details' : `Show ${totalDetailsCount} Details`}
                    </button>
                  )}
                  {hasProjectDetails && isExpanded && (
                    <div className="exp-details-panel">
                      {visibleSections.map((section, sectionIdx) => (
                        <div key={`${idx}-${section.title}-${sectionIdx}`} className="exp-tech-section">
                          {(() => {
                            const sectionKey = `${idx}-${sectionIdx}`;
                            const isSectionExpanded = !collapsedSections.has(sectionKey);
                            return (
                              <>
                                <button
                                  type="button"
                                  className="exp-tech-section-toggle"
                                  onClick={() => toggleSection(sectionKey)}
                                  aria-expanded={isSectionExpanded}
                                >
                                  <span className="exp-tech-section-chevron">{isSectionExpanded ? '▾' : '▸'}</span>
                                  <span className="exp-tech-section-title">{section.title}</span>
                                  <span className="exp-tech-section-count">{section.bullets.length}</span>
                                </button>
                                {isSectionExpanded && (
                                  <ul className="exp-bullets">
                                    {section.bullets.map((bullet, bIdx) => (
                                      <li key={`${section.title}-${bIdx}`} className="exp-bullet-item">{bullet}</li>
                                    ))}
                                  </ul>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
