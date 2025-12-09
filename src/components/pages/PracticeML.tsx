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
    {
      name: 'L1 vs L2 Regression',
      details: [
        'L1 Regression (Lasso): Penalty = λ × Σ|βᵢ| - Uses sum of absolute values',
        'L2 Regression (Ridge): Penalty = λ × Σβᵢ² - Uses sum of squared values',
        'Feature Selection: L1 drives coefficients to exactly zero (automatic feature selection)',
        'Coefficient Shrinkage: L2 shrinks coefficients towards zero but rarely makes them exactly zero',
        'Solution Type: L1 creates sparse solutions, L2 creates dense solutions',
        'Multicollinearity: L1 picks one from correlated features, L2 handles all correlated features well',
        'Interpretability: L1 provides high interpretability (fewer features), L2 moderate (all features)',
        'Computational: L1 is non-differentiable at 0, L2 is smooth and differentiable',
        'Use L1 when: You need automatic feature selection, interpretable models, or sparse solutions',
        'Use L2 when: You have multicollinear features, want stability, or need to keep all relevant features',
        'Elastic Net: Combines both L1 and L2 penalties for benefits of both techniques',
      ],
    },
    {
      name: 'Overfitting vs Underfitting',
      details: [
        'Overfitting: Model learns training data too well, including noise and random fluctuations',
        'Overfitting Signs: High training accuracy + Low validation/test accuracy (high variance, low bias)',
        'Overfitting Causes: Model too complex, too many parameters, insufficient data, over-training',
        'Overfitting Solutions: More data, regularization (L1/L2, dropout), early stopping, simpler model',
        'Underfitting: Model too simple to capture underlying patterns in the data',
        'Underfitting Signs: Low training accuracy + Low validation/test accuracy (high bias, low variance)',
        'Underfitting Causes: Model too simple, insufficient training, excessive regularization, poor features',
        'Underfitting Solutions: More complex model, more features, reduce regularization, longer training',
        'Sweet Spot: Balance between capturing patterns and generalizing to new data',
        'Detection: Use validation curves, learning curves, and cross-validation to identify the issue',
        'Bias-Variance Tradeoff: Overfitting = high variance, Underfitting = high bias',
      ],
    },
    {
      name: 'Gradient Descent vs SGD vs ALS',
      details: [
        'Gradient Descent (Batch): Uses entire dataset per update - θ = θ - α∇J(θ)',
        'GD Pros: Smooth convergence, guaranteed global minimum (convex functions), stable updates',
        'GD Cons: High memory usage, slow per iteration, not suitable for large datasets',
        'Stochastic Gradient Descent (SGD): Uses one random sample per update',
        'SGD Pros: Low memory, fast per iteration, online learning capable, escapes local minima',
        'SGD Cons: Noisy convergence path, oscillates around minimum, may need learning rate scheduling',
        'Mini-batch SGD: Compromise between GD and SGD using small batches (32-512 samples)',
        'Alternating Least Squares (ALS): Alternates optimization between parameter sets',
        'ALS Use Case: Matrix factorization, collaborative filtering, recommender systems',
        'ALS Method: Fix user factors → optimize item factors → fix items → optimize users',
        'ALS Advantages: Highly parallelizable, guaranteed objective decrease, handles sparse data well',
        'When to use: GD (small datasets), SGD (large datasets/online), ALS (matrix factorization)',
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
