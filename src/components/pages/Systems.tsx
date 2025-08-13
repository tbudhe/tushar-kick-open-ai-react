import React from 'react';
import SystemCard from '../SystemCard/SystemCard';

const Systems: React.FC = () => {
  const principles = [
    {
      name: 'Performance Matrices',
      details: `
        Performance matrices are essential for evaluating the efficiency of a system. 
        - Latency: The time taken for a system to respond to a request. Lower latency improves user experience.
        - Throughput: The number of requests a system can process per unit of time. High throughput ensures the system can handle large volumes of traffic.
        - Scalability: The ability of a system to handle increased load without degrading performance. Scalability ensures the system can grow with demand.
        These metrics help identify bottlenecks and optimize system performance.
      `,
    },
    {
      name: 'System Reliability',
      details: `
        System reliability ensures that a system remains operational and performs as expected under various conditions.
        - Fault Tolerance: Build systems to recover gracefully from failures.
        - Availability: Ensure the system is operational and accessible when needed.
        - Monitoring: Implement tools to track system health and performance metrics.
        Reliability is critical for maintaining user trust and minimizing downtime.
      `,
    },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <SystemCard
        title="System Design Principles"
        description="Explore the principles and best practices for designing scalable and reliable systems."
        principles={principles}
      />
    </div>
  );
};

export default Systems;