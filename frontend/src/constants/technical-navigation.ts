import { appRoutes } from './routes';

export type TechnicalCategory = 'core-tech' | 'playbooks' | 'architecture';
export type ComplexityLevel = 'Foundational' | 'Intermediate' | 'Advanced';

export interface TechnicalNavItem {
  id: string;
  title: string;
  category: TechnicalCategory;
  isTechnical: true;
  path: string;
  summary: string;
  tags: string[];
  complexity: ComplexityLevel;
  readTimeMin: number;
  updatedLabel: string;
}

interface TechnicalCategoryMeta {
  title: string;
  subtitle: string;
}

export const technicalCategoryMeta: Record<TechnicalCategory, TechnicalCategoryMeta> = {
  'core-tech': {
    title: 'Core Tech',
    subtitle: 'Foundational algorithm and optimization concepts mapped to practical engineering trade-offs.',
  },
  playbooks: {
    title: 'Playbooks',
    subtitle: 'Interview-ready system design and ML implementation playbooks for business-critical workflows.',
  },
  architecture: {
    title: 'Architecture',
    subtitle: 'Production system patterns grouped by layer: Foundation, Design & APIs, Backend & Storage, and DevOps.',
  },
};

export const technicalNavigationConfig: TechnicalNavItem[] = [
  {
    id: 'l1-vs-l2-regression',
    title: 'L1 vs L2 Regression',
    category: 'core-tech',
    isTechnical: true,
    path: `${appRoutes.aiStudio}#l1-vs-l2-regression`,
    summary: 'Compare sparse feature selection and coefficient shrinkage strategies under real model constraints.',
    tags: ['Regularization', 'Modeling'],
    complexity: 'Intermediate',
    readTimeMin: 6,
    updatedLabel: 'Updated today',
  },
  {
    id: 'overfitting-vs-underfitting',
    title: 'Overfitting vs Underfitting',
    category: 'core-tech',
    isTechnical: true,
    path: `${appRoutes.aiStudio}#overfitting-vs-underfitting`,
    summary: 'Diagnose bias-variance behavior and use validation signals to pick model complexity safely.',
    tags: ['Model Quality', 'Validation'],
    complexity: 'Foundational',
    readTimeMin: 5,
    updatedLabel: 'Updated today',
  },
  {
    id: 'gradient-descent-vs-sgd-vs-als',
    title: 'Gradient Descent vs SGD vs ALS',
    category: 'core-tech',
    isTechnical: true,
    path: `${appRoutes.aiStudio}#gradient-descent-vs-sgd-vs-als`,
    summary: 'Choose the right optimizer path based on data size, convergence profile, and matrix-factorization needs.',
    tags: ['Optimization', 'Recommenders'],
    complexity: 'Advanced',
    readTimeMin: 8,
    updatedLabel: 'Updated today',
  },
  {
    id: 'supervised-vs-unsupervised-vs-rl',
    title: 'Supervised vs Unsupervised vs Reinforcement Learning',
    category: 'core-tech',
    isTechnical: true,
    path: `${appRoutes.aiStudio}#supervised-vs-unsupervised-vs-rl`,
    summary: 'Compare all three ML paradigms by data requirements, feedback mechanism, and real-world use cases.',
    tags: ['ML Paradigms', 'Foundations'],
    complexity: 'Foundational',
    readTimeMin: 6,
    updatedLabel: 'Updated today',
  },
  {
    id: 'business-objectives',
    title: 'Business Objectives',
    category: 'playbooks',
    isTechnical: true,
    path: `${appRoutes.mlPlaybooks}#business-objectives`,
    summary: 'Align visual search design with conversion growth, discovery quality, and catalog utilization goals.',
    tags: ['Business', 'Product'],
    complexity: 'Foundational',
    readTimeMin: 4,
    updatedLabel: 'Updated this week',
  },
  {
    id: 'key-interview-questions',
    title: 'Key Interview Questions',
    category: 'playbooks',
    isTechnical: true,
    path: `${appRoutes.mlPlaybooks}#key-interview-questions`,
    summary: 'Prepare architecture and scalability responses for high-volume production ML system interviews.',
    tags: ['Interview', 'Architecture'],
    complexity: 'Intermediate',
    readTimeMin: 7,
    updatedLabel: 'Updated this week',
  },
  {
    id: 'system-components',
    title: 'System Components',
    category: 'playbooks',
    isTechnical: true,
    path: `${appRoutes.mlPlaybooks}#system-components`,
    summary: 'Break down ingestion, embedding, vector search, and serving layers in a practical production stack.',
    tags: ['Infra', 'ML Pipeline'],
    complexity: 'Intermediate',
    readTimeMin: 6,
    updatedLabel: 'Updated this week',
  },
  {
    id: 'success-metrics',
    title: 'Success Metrics',
    category: 'playbooks',
    isTechnical: true,
    path: `${appRoutes.mlPlaybooks}#success-metrics`,
    summary: 'Track outcome KPIs and latency-quality metrics to evaluate both business and system health.',
    tags: ['KPI', 'Observability'],
    complexity: 'Foundational',
    readTimeMin: 4,
    updatedLabel: 'Updated this week',
  },
  {
    id: 'visual-search-ml',
    title: 'Visual Search - ML',
    category: 'playbooks',
    isTechnical: true,
    path: `${appRoutes.mlPlaybooks}#visual-search-ml`,
    summary: 'Review architecture references and system diagrams for an end-to-end visual similarity platform.',
    tags: ['Computer Vision', 'System Design'],
    complexity: 'Advanced',
    readTimeMin: 9,
    updatedLabel: 'Updated this week',
  },
  {
    id: 'google-street-blurring-ml',
    title: 'Google Street Blurring - ML',
    category: 'playbooks',
    isTechnical: true,
    path: `${appRoutes.mlPlaybooks}#google-street-blurring-ml`,
    summary: 'Explore a privacy-sensitive image processing pipeline with large-scale geospatial ingestion patterns.',
    tags: ['Privacy', 'Distributed Systems'],
    complexity: 'Advanced',
    readTimeMin: 10,
    updatedLabel: 'Updated this week',
  },
  // ─── Architecture — Foundation ─────────────────────────────────────────
  {
    id: 'arch-perf-matrices',
    title: 'Performance Matrices',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Load time, TTFB, DOM readiness, render-blocking resources, and round-trip time baselines for production web systems.',
    tags: ['Foundation', 'Performance'],
    complexity: 'Foundational',
    readTimeMin: 4,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-system-reliability',
    title: 'System Reliability',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'CAP theorem trade-offs, consistent hashing, load balancing, rate limiting, and observability stack selection.',
    tags: ['Foundation', 'Reliability'],
    complexity: 'Intermediate',
    readTimeMin: 6,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-key-attributes',
    title: 'Key System Attributes',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Latency, throughput, and scalability definitions used as primary evaluation axes in production system reviews.',
    tags: ['Foundation', 'Scalability'],
    complexity: 'Foundational',
    readTimeMin: 3,
    updatedLabel: 'Updated today',
  },
  // ─── Architecture — Design & APIs ─────────────────────────────────────
  {
    id: 'arch-api-performance',
    title: 'API Performance',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Stateless vs stateful API design, connection pooling, caching strategies, compression, and async workload handling.',
    tags: ['Design & APIs', 'Performance'],
    complexity: 'Intermediate',
    readTimeMin: 5,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-design-patterns',
    title: 'Design Patterns',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'MVC, MVP, 3-Tier, Singleton, Factory, Observer, Strategy — context on when each resolves coupling and maintainability issues.',
    tags: ['Design & APIs', 'Patterns'],
    complexity: 'Intermediate',
    readTimeMin: 6,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-monolith-vs-micro',
    title: 'Monolithic vs Microservices',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Trade-off analysis for monolithic, modular-monolithic, and microservices deployment topologies.',
    tags: ['Design & APIs', 'Architecture'],
    complexity: 'Intermediate',
    readTimeMin: 4,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-frontend-perf',
    title: 'Front-end Performance',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Minification, bundling, lazy loading, image optimization, and critical rendering path techniques for production SPA delivery.',
    tags: ['Design & APIs', 'Front-end'],
    complexity: 'Foundational',
    readTimeMin: 4,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-graphql-vs-rest',
    title: 'GraphQL vs REST',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Practical trade-offs between GraphQL flexible querying and REST simplicity, caching, and tooling support.',
    tags: ['Design & APIs', 'Protocols'],
    complexity: 'Foundational',
    readTimeMin: 3,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-protocols',
    title: 'Protocols',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'HTTP, HTTPS, FTP, SMTP, and gRPC usage contexts and trade-offs in distributed system communication layers.',
    tags: ['Design & APIs', 'Protocols'],
    complexity: 'Foundational',
    readTimeMin: 3,
    updatedLabel: 'Updated today',
  },
  // ─── Architecture — Backend & Storage ─────────────────────────────────
  {
    id: 'arch-db-performance',
    title: 'Database Performance',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Indexing strategies, query optimization, connection pooling, sharding, and replication for production data layers.',
    tags: ['Backend & Storage', 'Database'],
    complexity: 'Intermediate',
    readTimeMin: 5,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-db-types',
    title: 'Database Types',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Relational, NoSQL, in-memory, graph, and time-series databases compared with sharding and partitioning strategies.',
    tags: ['Backend & Storage', 'Database'],
    complexity: 'Intermediate',
    readTimeMin: 5,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-kafka-vs-redis',
    title: 'Kafka vs Redis',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Event streaming platform vs in-memory store: when to use distributed message queues vs caching layers.',
    tags: ['Backend & Storage', 'Messaging'],
    complexity: 'Intermediate',
    readTimeMin: 4,
    updatedLabel: 'Updated today',
  },
  // ─── Architecture — DevOps ─────────────────────────────────────────────
  {
    id: 'arch-devops',
    title: 'DevOps & Deployment',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'CI/CD, IaC, monitoring, containerization, orchestration, and region-based traffic routing for cloud-native deployments.',
    tags: ['DevOps', 'Deployment'],
    complexity: 'Intermediate',
    readTimeMin: 5,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-networking',
    title: 'Networking',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Load balancing, firewalls, VPNs, DNS, CDN, and network monitoring essentials for distributed systems.',
    tags: ['DevOps', 'Networking'],
    complexity: 'Foundational',
    readTimeMin: 4,
    updatedLabel: 'Updated today',
  },
  {
    id: 'arch-communication',
    title: 'Communication Models',
    category: 'architecture',
    isTechnical: true,
    path: appRoutes.systemDesign,
    summary: 'Synchronous vs asynchronous communication patterns and their impact on system coupling and fault tolerance.',
    tags: ['DevOps', 'Architecture'],
    complexity: 'Foundational',
    readTimeMin: 3,
    updatedLabel: 'Updated today',
  },
];

export const getTechnicalNavItemsByCategory = (
  category: TechnicalCategory
): TechnicalNavItem[] => technicalNavigationConfig.filter((item) => item.category === category);

export const matchesTechnicalSearch = (item: TechnicalNavItem, query: string): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return (
    item.title.toLowerCase().includes(normalized) ||
    item.summary.toLowerCase().includes(normalized) ||
    item.tags.some((tag) => tag.toLowerCase().includes(normalized))
  );
};
