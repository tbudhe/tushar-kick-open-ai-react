import React from 'react';
import '../../styles/cards.css';

interface PrincipleItem {
  name: string;
  details: string;
  gifPath?: string;
}

interface SystemCardProps {
  title: string;
  description: string;
  principles: PrincipleItem[];
}

const SystemCard: React.FC<SystemCardProps> = ({ 
  title, 
  description, 
  principles 
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-header-title">{title}</h2>
        </div>
      </div>

      <div className="card-body">
        <p className="card-body-text">{description}</p>
      </div>

      <div className="card-section">
        <h3 className="card-section-title">Core Principles</h3>
        <ul className="card-list">
          {principles.map((principle, idx) => (
            <li key={idx} className="card-list-item">
              <div className="card-list-item-title">
                {principle.name}
              </div>
              <p className="card-list-item-text">
                {principle.details}
              </p>
              {principle.gifPath && (
                <img
                  src={principle.gifPath}
                  alt={`${principle.name} illustration`}
                  className="card-image"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SystemCard;
