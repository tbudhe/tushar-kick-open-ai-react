import React, { useState } from 'react';

export interface LinkDetail {
  text: string;
  link: {
    url: string;
    text: string;
  };
}

export type DetailItem = string | LinkDetail;

export interface MLCardProps {
  title: string;
  details: DetailItem[];
}

const MLCard: React.FC<MLCardProps> = ({ title, details }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="system-card" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="system-card-header">
        <h4>{title}</h4>
        <span className="toggle-arrow">{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div className="system-card-details">
          <ul>
            {details.map((detail, index) => (
              <li key={index}>
                {typeof detail === 'string' ? (
                  detail
                ) : (
                  <>
                    {detail.text}
                    <a
                      href={detail.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#667eea',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = 'underline')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = 'none')
                      }
                    >
                      {detail.link.text}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MLCard;
