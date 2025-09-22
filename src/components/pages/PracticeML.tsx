import React, { useState } from 'react';
import '../../css/Systems.css';

interface LinkDetail {
  text: string;
  link: {
    url: string;
    text: string;
  };
}

type DetailItem = string | LinkDetail;

interface Principle {
  name: string;
  details: DetailItem[];
}

const PracticeML: React.FC = () => {
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);

  const principles: Principle[] = [
    {
      name: 'Business Objectives',
      details: [
        'Revenue Growth: Increase conversion rates by 15-25% through visual product discovery',
        'User Experience: Reduce search friction and improve product findability',
        'Inventory Optimization: Surface long-tail products through visual similarity',
        'Competitive Advantage: Differentiate through advanced search capabilities',
        'Data Collection: Gather visual preferences for personalization',
      ],
    },
    {
      name: 'Key Interview Questions',
      details: [
        'Architecture: "How would you design a visual search system for 100M products?"',
        'Scalability: "How do you handle real-time visual search with low latency?"',
        'ML Pipeline: "Explain the end-to-end ML pipeline for visual feature extraction"',
        'Similarity Matching: "How do you measure and rank visual similarity?"',
        'Infrastructure: "How would you store and index billions of image embeddings?"',
        'Performance: "How do you optimize search response time under 100ms?"',
        'Quality: "How do you measure and improve search result relevance?"',
        'A/B Testing: "How would you evaluate the business impact of visual search?"',
      ],
    },
    {
      name: 'System Components',
      details: [
        'Image Processing: CNN-based feature extraction (ResNet, EfficientNet)',
        'Vector Database: High-dimensional similarity search (Pinecone, Weaviate)',
        'API Gateway: Request routing and rate limiting',
        'Caching Layer: Redis for frequent queries and embeddings',
        'ML Serving: Model inference infrastructure (TensorFlow Serving)',
        'Data Pipeline: Real-time image processing and indexing',
      ],
    },
    {
      name: 'Success Metrics',
      details: [
        'Business: Conversion rate, revenue per search, user engagement',
        'Technical: Response time (<100ms), system availability (99.9%)',
        'ML: Precision@K, recall, click-through rate, user satisfaction',
      ],
    },
    {
      name: 'Visual Search - ML',
      details: [
        {
          text: 'System Design: ',
          link: {
            url: 'https://bytebytego.com/courses/machine-learning-system-design-interview/visual-search-system',
            text: 'ByteByteGo - Visual Search Architecture'
          }
        },
        {
          text: 'Visual Diagrams: ',
          link: {
            url: 'https://excalidraw.com/#room=bca6c4b2c12608201786,qfbidnaJ9mH1FHgRiawMIw',
            text: 'System Architecture Drawing'
          }
        }
      ],
    },
    {
      name: 'Google Street Blurring - ML',
      details: [
        {
          text: 'System Design: ',
          link: {
            url: 'https://bytebytego.com/courses/machine-learning-system-design-interview/google-street-view-blurring-system',
            text: 'ByteByteGo - Google Street View Blurring System'
          }
        },
        {
          text: 'Visual Diagrams',
          link: {
            url: 'https://excalidraw.com/#json=Pm44fjK19V0tO__DPwl68,DGH7lrd7c_CKl6cG8l2KcQ',
            text: 'System Architecture Drawing'
          }
        }
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
                          style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
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
      ))}
    </div>
  );
};

export default PracticeML;
