import React from 'react';
import './ProfileCard.css';

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
    <div className="profile-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{name}</h2>
          <h4>{title}</h4>
        </div>
        <div style={{ textAlign: 'right' }}>
          <a href={socialLinks.linkedIn} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style={{ width: '24px', verticalAlign: 'middle' }} />
          </a>
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style={{ width: '24px', verticalAlign: 'middle' }} />
          </a>
        </div>
      </div>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
      <p><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></p>

      <div className="professional-summary" style={{ marginTop: '20px' }}>
        <h5>Professional Summary:</h5>
        <p>{professionalSummary}</p>
      </div>

      <div className="skills">
        <h5>Skills:</h5>
        <ul>
          {skills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="experience">
        <h5>Experience:</h5>
        <ul>
          {experience.map((job, idx) => (
            <li key={idx}>
              <strong>{job.company}</strong> — {job.role} ({job.duration})
              <br />
              <em>{job.description}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;
