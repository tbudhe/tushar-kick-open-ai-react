import React from 'react';
import './SystemCard.css';

interface PrincipleItem {
  name: string;
  details: string;
  gifPath?: string; // Optional prop for the GIF path
}

interface SystemCardProps {
  title: string;
  description: string;
  principles: PrincipleItem[];
}

const SystemCard: React.FC<SystemCardProps> = ({ title, description, principles }) => {
  return (
    <div className="system-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="principles">
        <h5>Principles:</h5>
        <ul>
          {principles.map((principle, idx) => (
            <li key={idx} style={{ marginBottom: '20px' }}>
              <strong>{principle.name}:</strong> {principle.details}
              {principle.gifPath && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img
                    src={principle.gifPath}
                    alt={`${principle.name} Explanation`}
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SystemCard;
