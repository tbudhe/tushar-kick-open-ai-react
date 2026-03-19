/**
 * Content Registry — maps every TechnicalNavItem ID to its detailed content lines.
 * This preserves all granular technical content originally authored inline on the
 * ai.tsx, practice-ml.tsx, and system.tsx pages and makes it renderable from the
 * ContentDrawer slide-over panel.
 */

export type ContentLine = string | { text: string; link: { url: string; text: string } };

export interface DrawerContent {
  lines: ContentLine[];
}

export const contentRegistry: Record<string, DrawerContent> = {
  // ─── Core Tech ──────────────────────────────────────────────────────────
  'l1-vs-l2-regression': {
    lines: [
      'L1 Regression (Lasso): Penalty = λ × Σ|βᵢ| — Uses sum of absolute values',
      'L2 Regression (Ridge): Penalty = λ × Σβᵢ² — Uses sum of squared values',
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
  'overfitting-vs-underfitting': {
    lines: [
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
  'gradient-descent-vs-sgd-vs-als': {
    lines: [
      'Gradient Descent (Batch): Uses entire dataset per update — θ = θ - α∇J(θ)',
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
  'supervised-vs-unsupervised-vs-rl': {
    lines: [
      'Supervised Learning: Trains on labeled input-output pairs — learns a mapping f: X → Y',
      'Supervised Goal: Minimize prediction error against known ground-truth labels',
      'Supervised Examples: Linear regression, logistic regression, SVM, neural networks, decision trees',
      'Supervised Use Cases: Spam detection, image classification, price prediction, fraud detection',
      'Unsupervised Learning: Discovers hidden patterns in unlabeled data — no ground truth required',
      'Unsupervised Goal: Find structure, clusters, or compressed representations in raw data',
      'Unsupervised Examples: K-Means, DBSCAN, PCA, t-SNE, autoencoders, GMM',
      'Unsupervised Use Cases: Customer segmentation, anomaly detection, dimensionality reduction, topic modeling',
      'Reinforcement Learning: Agent learns by interacting with an environment and receiving reward signals',
      'RL Goal: Maximize cumulative discounted reward — R = Σ γᵗrₜ',
      'RL Key Elements: State (S), Action (A), Reward (R), Policy (π), Value function (V)',
      'RL Examples: Q-Learning, SARSA, DQN, PPO, Actor-Critic, DDPG',
      'RL Use Cases: Game playing (AlphaGo), robotics, autonomous driving, recommendation systems',
      'Key Difference — Feedback: Supervised=explicit labels, Unsupervised=none, RL=delayed scalar reward',
      'Key Difference — Data: Supervised=labeled dataset, Unsupervised=raw dataset, RL=environment interaction',
      'Key Difference — Objective: Supervised=fit labels, Unsupervised=find structure, RL=maximize reward',
      'When to use Supervised: You have labeled training data and a well-defined prediction target',
      'When to use Unsupervised: No labels available; exploratory analysis or feature learning needed',
      'When to use RL: Sequential decision-making where feedback arrives over time and actions matter',
    ],
  },

  // ─── Playbooks ──────────────────────────────────────────────────────────
  'business-objectives': {
    lines: [
      'Revenue Growth: Increase conversion rates by 15-25% through visual product discovery',
      'User Experience: Reduce search friction and improve product findability',
      'Inventory Optimization: Surface long-tail products through visual similarity',
      'Competitive Advantage: Differentiate through advanced search capabilities',
      'Data Collection: Gather visual preferences for personalization',
    ],
  },
  'key-interview-questions': {
    lines: [
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
  'system-components': {
    lines: [
      'Image Processing: CNN-based feature extraction (ResNet, EfficientNet)',
      'Vector Database: High-dimensional similarity search (Pinecone, Weaviate)',
      'API Gateway: Request routing and rate limiting',
      'Caching Layer: Redis for frequent queries and embeddings',
      'ML Serving: Model inference infrastructure (TensorFlow Serving)',
      'Data Pipeline: Real-time image processing and indexing',
    ],
  },
  'success-metrics': {
    lines: [
      'Business: Conversion rate, revenue per search, user engagement',
      'Technical: Response time (<100ms), system availability (99.9%)',
      'ML: Precision@K, recall, click-through rate, user satisfaction',
    ],
  },
  'visual-search-ml': {
    lines: [
      {
        text: 'System Design: ',
        link: {
          url: 'https://bytebytego.com/courses/machine-learning-system-design-interview/visual-search-system',
          text: 'ByteByteGo — Visual Search Architecture',
        },
      },
      {
        text: 'Visual Diagrams: ',
        link: {
          url: 'https://excalidraw.com/#room=bca6c4b2c12608201786,qfbidnaJ9mH1FHgRiawMIw',
          text: 'System Architecture Drawing',
        },
      },
    ],
  },
  'google-street-blurring-ml': {
    lines: [
      {
        text: 'System Design: ',
        link: {
          url: 'https://bytebytego.com/courses/machine-learning-system-design-interview/google-street-view-blurring-system',
          text: 'ByteByteGo — Google Street View Blurring System',
        },
      },
      {
        text: 'Visual Diagrams: ',
        link: {
          url: 'https://excalidraw.com/#json=Pm44fjK19V0tO__DPwl68,DGH7lrd7c_CKl6cG8l2KcQ',
          text: 'System Architecture Drawing',
        },
      },
    ],
  },

  // ─── Architecture — Foundation ───────────────────────────────────────────
  'arch-perf-matrices': {
    lines: [
      'Load time: The time it takes for a page to load completely.',
      'Time to first byte (TTFB): The time it takes for the server to send the first byte of data.',
      'Request control: Managing and prioritizing requests to optimize performance.',
      'DOM content: The time it takes for the DOM to be fully constructed.',
      'Page size: The total size of the page, including all assets.',
      'Round trip time (RTT): The time it takes for a request to travel from the client to the server and back.',
      'Render block resources: Resources that prevent the page from rendering until they are loaded.',
    ],
  },
  'arch-system-reliability': {
    lines: [
      'CAP theorem: A distributed system can only guarantee two of these properties at the same time. CA(SQL) / CP(NoSql) / AP(Scylla DB)',
      'Eventual consistency: A model where updates will propagate and become consistent over time. (Kafka/RabbitMQ)',
      'Load Balancing: Distributing workloads across multiple resources.',
      'Consistent Hashing: A technique to distribute requests across servers while minimizing disruption.',
      'Rate limiter: Controls the rate of requests sent to a server.',
      'Monitoring: logs, health and performance metrics — async logging, Prometheus & Grafana',
    ],
  },
  'arch-key-attributes': {
    lines: [
      'Latency: How fast is your response to your request?',
      'Throughput: The number of requests a system can process per unit of time.',
      'Scalability: The ability of a system to handle increased load without degrading performance.',
    ],
  },

  // ─── Architecture — Design & APIs ────────────────────────────────────────
  'arch-api-performance': {
    lines: [
      'Statelessness: Each API request should contain all the information needed to process it.',
      'Stateful: Assign request sessions and use Apache sticky sessions.',
      'Caching: Storing frequently accessed data closer to the client.',
      'Pagination: Dividing large datasets into smaller, manageable chunks.',
      'Compression: Reducing the size of data transmitted over the network.',
      'Connection Pools: Efficiently managing connections to minimize overhead.',
      'Asynchronous processing: Handling requests asynchronously to improve responsiveness.',
    ],
  },
  'arch-design-patterns': {
    lines: [
      'MVC: Separates application logic, UI, and user input.',
      'MVP: Focuses on separating presentation layer from business logic.',
      'MCP: Emphasizes modularity and communication protocols.',
      '3-Tier: Divides applications into Presentation, Logic, and Data layers.',
      'MVVC: Enhances separation with data binding.',
      'Singleton: Ensures a class has only one instance.',
      'Factory: Lets subclasses decide the type of objects to create.',
      'Observer: Establishes one-to-many dependency.',
      'Decorator: Dynamically adds responsibilities.',
      'Strategy: Defines interchangeable algorithms.',
    ],
  },
  'arch-monolith-vs-micro': {
    lines: [
      'Monolithic: All components interconnected and running as single service.',
      'Modular Monolithic: Separation of concerns using feature toggles.',
      'Microservices: Small, independent services communicating via APIs.',
    ],
  },
  'arch-frontend-perf': {
    lines: [
      'Minification: Reducing CSS and JS file sizes.',
      'Bundling: Combining multiple files into fewer network requests.',
      'Lazy loading: Loading resources on demand to reduce initial payload.',
      'Image optimization: Maximize quality without increasing file size.',
      'CDN usage: Global content distribution for faster delivery near users.',
      'Critical rendering path optimization: Reduce render-blocking resources.',
    ],
  },
  'arch-graphql-vs-rest': {
    lines: [
      'GraphQL: Request only the exact data you need in a single query.',
      'REST: Standard HTTP methods — simple, widely supported, excellent caching.',
      'GraphQL Advantages: Efficient data fetching, flexible queries, typed schema.',
      'REST Advantages: Simplicity, better native HTTP caching, broad tooling support.',
    ],
  },
  'arch-protocols': {
    lines: [
      'HTTP: The foundation of web communication — request/response over TCP.',
      'HTTPS: HTTP + TLS — encrypted transport layer, required for production.',
      'FTP: File Transfer Protocol — dedicated binary/text file transfer.',
      'SMTP: Simple Mail Transfer Protocol — outbound email delivery standard.',
      'gRPC: High-performance RPC framework using HTTP/2 and Protobuf serialization.',
    ],
  },

  // ─── Architecture — Backend & Storage ────────────────────────────────────
  'arch-db-performance': {
    lines: [
      'Indexing: Creating indexes on database tables to speed up query lookups.',
      'Query optimization: Analyzing and rewriting slow-running queries.',
      'Connection pooling: Reusing database connections to minimize overhead.',
      'Caching: Storing frequently accessed data in memory (Redis, Memcached).',
      'Sharding: Distributing data across multiple database instances.',
      'Replication: Creating read replicas for availability and read scalability.',
    ],
  },
  'arch-db-types': {
    lines: [
      'Relational Databases: Structured storage with SQL — strong ACID guarantees.',
      'NoSQL Databases: Non-relational with flexible schemas — document, key-value, column.',
      'In-memory Databases: Store data in RAM for sub-millisecond access (Redis).',
      'Graph Databases: Use graph structures for relationship-heavy workloads (Neo4j).',
      'Time-series Databases: Optimized for time-stamped data (InfluxDB, TimescaleDB).',
      'Horizontal Sharding: Distribute rows across partitions by a shard key.',
      'Vertical Sharding: Split columns across separate tables or databases.',
    ],
  },
  'arch-kafka-vs-redis': {
    lines: [
      'Kafka: Distributed event streaming platform — durable, ordered, high-throughput.',
      'Redis: In-memory data structure store — low-latency cache and pub/sub.',
      'Use Kafka for: Async event pipelines, audit logs, real-time stream processing.',
      'Use Redis for: Session caching, leaderboards, rate limiting, ephemeral queues.',
    ],
  },

  // ─── Architecture — DevOps ────────────────────────────────────────────────
  'arch-devops': {
    lines: [
      'Continuous Integration (CI): Automating code integration, linting, and test runs on every push.',
      'Continuous Deployment (CD): Automating deployment to staging/production after CI passes.',
      'Infrastructure as Code (IaC): Managing infrastructure through version-controlled config (Terraform, Pulumi).',
      'Monitoring and Logging: System tracking via metrics (Prometheus), logs (Loki), and traces (Jaeger).',
      'Containerization: Container-based deployment using Docker for reproducible environments.',
      'Orchestration: Deployment lifecycle automation via Kubernetes or managed equivalents.',
      'Region-based traffic management: Route users to the closest region for lower latency.',
      'Sticky sessions: Use load balancer session affinity for stateful services.',
    ],
  },
  'arch-networking': {
    lines: [
      'Load Balancing: Distributing traffic across server instances (L4 / L7 balancers).',
      'Firewalls: Network security rules to filter inbound and outbound traffic.',
      'VPNs: Secure encrypted tunnels for private network access.',
      'DNS: Domain name translation — A/CNAME records, TTL tuning for failover.',
      'CDN: Global content distribution layer for static assets and API acceleration.',
      'Network Monitoring: Traffic analysis, packet inspection, and anomaly detection.',
    ],
  },
  'arch-communication': {
    lines: [
      'Synchronous: Sender sends a request and waits for the server to respond before continuing.',
      'Asynchronous: Sender continues processing after dispatching — response handled via callback or queue.',
    ],
  },
};
