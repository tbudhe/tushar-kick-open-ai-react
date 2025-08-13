import React, { useState } from 'react';
import '../../css/Systems.css';

const Systems: React.FC = () => {
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);

  const principles = [
    {
      name: 'Performance Matrices',
      details: [
        'Latency: The time taken for a system to respond to a request. Lower latency improves user experience.',
        'Throughput: The number of requests a system can process per unit of time. High throughput ensures the system can handle large volumes of traffic.',
        'Scalability: The ability of a system to handle increased load without degrading performance. Scalability ensures the system can grow with demand.',
      ],
    },
    {
      name: 'System Reliability',
      details: [
        'Fault Tolerance: Build systems to recover gracefully from failures.',
        'Availability: Ensure the system is operational and accessible when needed.',
        'Monitoring: Implement tools to track system health and performance metrics.',
      ],
    },
  ];

  const togglePrinciple = (name: string) => {
    setExpandedPrinciple((prev) => (prev === name ? null : name));
  };

  return (
    <div className="systems-container">
      {principles.map((principle, idx) => (
        <div
          key={idx}
          className="system-card"
          onClick={() => togglePrinciple(principle.name)}
        >
          <div className="system-card-header">
            <h4>{principle.name}</h4>
            <span className="toggle-arrow">
              {expandedPrinciple === principle.name ? '▲' : '▼'}
            </span>
          </div>
          {expandedPrinciple === principle.name && (
            <div className="system-card-details">
              <ul>
                {principle.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Systems;