import { ProfileData, SkillGroup, ExperienceEntry } from '../models/profile.model';

const SEED_PROFILE: Omit<ProfileData, 'resumeText'> = {
  name: 'Tushar Budhe',
  title: 'Staff Software Engineer',
  location: 'Nutley, NJ',
  email: 'tbudhe@yunextgenai.com',
  phone: '+X (XXX) XXX-XXXX',
  summary:
    'Over 16 years of experience managing full project life cycles, covering architecture, analysis, design, development, testing, and implementation. Currently landed as a Staff Software Engineer with a proven track record in productivity and efficiency. Expertise in algorithm optimization, cloud computing, and scalability. Experienced in leading cross-functional teams to deliver projects on time, while meeting quality standards.',
  skillGroups: [
    {
      title: 'Full-stack & web development',
      items: [
        'JavaScript', 'TypeScript', 'Node.js', 'Java', 'Kotlin', 'Python',
        'HTML5', 'CSS', 'Bootstrap', 'AngularJS', 'REST APIs', 'SOAP APIs',
        'GraphQL', 'Web API', 'XML', 'XSLT', 'jQuery', 'MongoDB', 'Redis',
      ],
    },
    {
      title: 'Microsoft/.NET & MEAN/MERN',
      items: ['Microsoft stack', '.NET', 'C#', 'ASP.NET', 'MVC', 'WCF', 'SQL Server', 'Python', 'MEAN', 'MERN'],
    },
    {
      title: 'Cloud platforms',
      items: ['AWS', 'Azure', 'Salesforce', 'Google Cloud Platform'],
    },
    {
      title: 'Database core',
      items: [
        'Relational: replication, read replicas, failover',
        'NoSQL: replica sets, sharding, partitioning',
        'Indexing and query tuning',
        'Consistency and durability tradeoffs',
      ],
    },
    {
      title: 'AI/ML architecture and MLOps',
      items: [
        'AI strategy', 'Deep learning engineering', 'MLOps pipeline optimization',
        'AI consulting', 'Predictive analytics', 'Statistical modeling',
      ],
    },
    {
      title: 'Protocols and real-time communication',
      items: ['TCP', 'HTTP/HTTPS', 'SMTP', 'gRPC', 'WebSocket', 'Socket.IO', 'WCF over TCP'],
    },
    {
      title: 'Leadership and communication',
      items: ['Analytical thinking', 'Problem solving', 'Team leadership', 'Communication'],
    },
    {
      title: 'DevOps Tools',
      items: [
        'Docker', 'Kubernetes', 'Torbit', 'Looper', 'Jenkins', 'Traffic Manager',
        'Load Balancer', 'CDN', 'DNS configuration', 'VNet and subnet security',
        'IP whitelisting', 'Blue-Green Deployment', 'CI/CD Setup', 'Canary Deployment',
        'Sticky sessions (Apache)', 'Docker session management',
      ],
    },
  ],
  experience: [
    {
      company: 'Walmart Global Tech',
      location: 'Hoboken, NJ',
      role: 'Staff Software Engineer',
      duration: 'Oct 2021 – Present',
      projectName: 'Walmart — Backend Systems & Cloud Infrastructure',
      description: "Led Walmart Scan & Go self-checkout platform with scalable APIs, catalog intelligence, and distributed backend systems.",
      techSections: [
        {
          title: 'Backend Systems & Full-Stack Development',
          bullets: [
            'Architected and delivered Node.js/npm backend services and React/npm frontends for fuel checkout platform serving 4,000+ gas stations nationwide, handling 10M+ transactions monthly',
            'Built NVDI DGX fuel pump simulator console enabling secure stress testing of payment flows without production hardware exposure',
            'Designed Digital Wallet (Walmart Pay) backend with distributed transaction processing, idempotent APIs, and real-time balance reconciliation',
            'Implemented Item Return Chat System with WebSocket connections, stateless web tier, Redis session management, and Kafka-based event streaming for order status updates',
          ],
        },
        {
          title: 'Distributed Systems & Scalability',
          bullets: [
            'Engineered rate limiter service using token bucket algorithm with Redis backing, protecting checkout APIs from traffic spikes (10K+ req/sec)',
            'Built consistent hashing for distributed caching, reducing cache misses by 40% during node failures',
            'Designed distributed unique ID generator (Snowflake pattern) supporting 100K+ IDs/sec across multi-region deployments',
            'Migrated WebSocket messaging to GCP Pub/Sub for async communication, reducing 500-errors by 85%',
          ],
        },
        {
          title: 'Infrastructure & Performance Optimization',
          bullets: [
            'Implemented vertical/horizontal scaling via Kubernetes HPA based on p95 latency metrics',
            'Deployed Azure Load Balancer and Traffic Manager for multi-region distribution with automatic failover (99.99% SLA)',
            'Optimized database with read replicas, connection pooling, query optimization reducing p99 latency from 800ms to 120ms',
            'Configured Redis caching and Azure CDN improving page load times by 60%',
            'Tuned Node.js event loop with worker threads for CPU-intensive tasks, reducing blocking operations by 70%',
            'Implemented query profiling and indexing, improving query execution time by 85% on high-traffic endpoints',
            'Optimized APIs through payload compression (gzip/brotli), response caching, pagination reducing bandwidth by 50%',
            'Conducted memory leak detection and GC tuning, reducing heap memory usage from 2GB to 600MB',
          ],
        },
        {
          title: 'DevOps & Automation',
          bullets: [
            'Automated infrastructure provisioning using ARM templates and Terraform, reducing deployment time from 4 hours to 15 minutes',
            'Built CI/CD pipelines using n8n + Slack workflows for automated testing, deployment, and rollback across 50+ microservices',
            'Implemented Blue/Green and Canary deployments achieving zero-downtime releases with automated rollback on SLO violations',
            'Integrated Prometheus and Grafana for real-time monitoring, p95 logs alerting, and SLA compliance (99.9% availability)',
          ],
        },
        {
          title: 'System Design Projects',
          bullets: [
            'Forward & Reverse Proxy: Nginx-based reverse proxy with rate limiting, SSL termination, and load balancing',
            'Web Crawler POC: Chrome extension for competitive monitoring using distributed task queues and deduplication',
            'Notification System: Multi-channel platform (email, SMS, push) with Kafka event sourcing and retry mechanisms',
          ],
        },
        {
          title: 'Authentication & Security',
          bullets: [
            'Built Kotlin authentication packages (OAuth2/OIDC/SAML) enabling 200+ developers to integrate secure identity flows as npm modules',
            'Implemented service-registry authentication for microservices with mTLS enforcement and automated certificate rotation',
            'Delivered AI/ML-driven recommendation and catalog systems using TensorFlow, PyTorch, and Scikit-learn with focus on model interpretability and bias detection',
            'Integrated Claude API for AI-powered customer service automation, implementing prompt engineering best practices and safety guardrails',
          ],
        },
        {
          title: 'Leadership & Mentorship',
          bullets: [
            'Mentored 8 engineers on backend architecture, system design patterns, cloud security, and responsible AI integration practices',
            'Led technical design reviews for high-traffic systems with threat modeling, performance analysis, and AI safety considerations',
            'Active contributor to internal tech blogs on distributed systems, performance optimization, and AI infrastructure best practices',
          ],
        },
      ],
      projectContext:
        'Architected Node.js/React fuel checkout platform serving 4,000+ gas stations and 10M+ monthly transactions;' +
        'Built NVDI DGX fuel pump simulator for secure payment flow stress testing without production hardware;' +
        'Designed Digital Wallet (Walmart Pay) backend with distributed transaction processing, idempotent APIs, and real-time balance reconciliation;' +
        'Implemented Item Return Chat System with WebSocket, stateless web tier, Redis session management, and Kafka event streaming;' +
        'Engineered rate limiter with token bucket algorithm and Redis, protecting checkout APIs from 10K+ req/sec spikes;' +
        'Built consistent hashing for distributed caching, reducing cache misses by 40% during node failures;' +
        'Designed Snowflake ID generator supporting 100K+ IDs/sec across multi-region deployments;' +
        'Migrated WebSocket to GCP Pub/Sub for async fuel messaging, reducing 500-errors by 85%;' +
        'Implemented Kubernetes HPA scaling based on p95 latency with Azure Load Balancer and Traffic Manager (99.99% SLA);' +
        'Optimized database with read replicas and connection pooling, reducing p99 latency from 800ms to 120ms;' +
        'Reduced Node.js heap memory from 2GB to 600MB via stream optimization, worker threads, and GC tuning;' +
        'Created SOAP API for secure TCP payment gateway integration improving POS fraud detection by 30%;' +
        'Automated infrastructure with ARM templates and Terraform, cutting deployment time from 4 hours to 15 minutes;' +
        'Built CI/CD pipelines using n8n + Slack for automated testing and deployment across 50+ microservices;' +
        'Implemented Blue/Green and Canary deployments with automated rollback on SLO violations;' +
        'Built Kotlin OAuth2/OIDC/SAML packages enabling 200+ developers to integrate secure identity as npm modules;' +
        'Developed AI/ML recommendation and catalog systems using TensorFlow, PyTorch, Scikit-learn, Pandas, and NumPy;' +
        'Integrated Claude API for AI-powered customer service automation with prompt engineering and safety guardrails;' +
        'Mentored 8 engineers on backend architecture, system design, cloud security, and responsible AI practices',
    },
    {
      company: 'Fidelity Investments',
      location: 'Hoboken, NJ',
      role: 'Senior Software Developer',
      duration: 'Jan 2016 – Oct 2021',
      projectName: 'Digital X-Change, Investments, Crypto Market — Backend Systems & Cloud',
      description: 'Built stock trading, crypto, and investment microservices with sub-50ms latency and AI fraud detection.',
      techSections: [
        {
          title: 'Backend Development & Architecture',
          bullets: [
            'Designed Node.js microservices for stock trading, investment portfolios, and cryptocurrency platforms processing $2B+ daily volume',
            'Built Fidelity Stock Exchange real-time trading system with WebSocket streaming, order matching engine, and settlements',
            'Implemented AI-enhanced security layer for fraud detection using TensorFlow, reducing false positives by 45%',
            'Optimized high-frequency trading APIs achieving sub-50ms latency through async I/O and event-driven architecture',
            'Reduced memory footprint by 60% through strategic use of Node.js streams for large dataset processing',
          ],
        },
        {
          title: 'Authentication & API Development',
          bullets: [
            'Integrated SSO for LDAP/AD using OAuth2, SAML, and OpenID Connect across 15+ internal applications',
            'Developed secure REST and SOAP APIs for portfolio management, supporting 500K+ active users',
            'Built streaming APIs with Socket.io for real-time stock price updates, trade notifications, and audit event logging',
          ],
        },
        {
          title: 'DevOps & Deployment',
          bullets: [
            'Engineered CI/CD pipelines using Jenkins, Docker, and AWS ECS achieving 40+ deployments per week',
            'Created Docker npm packages for shared backend services, standardizing deployment across teams',
            'Configured AWS ELB and Auto Scaling Groups for high availability (99.95% uptime SLA)',
            'Optimized query performance and materialized views, improving portfolio calculations by 75%',
          ],
        },
        {
          title: 'Blockchain & DeFi',
          bullets: [
            'Developed Solidity smart contracts for DeFi-based crypto transactions on Ethereum testnet',
            'Built backend services for blockchain transaction verification and wallet integration',
          ],
        },
      ],
      projectContext:
        'Designed Node.js microservices for stock trading, investment portfolios, and crypto platforms processing $2B+ daily volume;' +
        'Built Fidelity Stock Exchange real-time trading system with WebSocket streaming, order matching engine, and settlements;' +
        'Implemented AI-enhanced fraud detection using TensorFlow, reducing false positives by 45%;' +
        'Optimized high-frequency trading APIs to sub-50ms latency through async I/O and event-driven architecture;' +
        'Reduced memory footprint by 60% using Node.js streams for large dataset processing;' +
        'Integrated SSO for LDAP/AD via OAuth2, SAML, and OpenID Connect across 15+ internal applications;' +
        'Developed secure REST and SOAP APIs for portfolio management serving 500K+ active users;' +
        'Built Socket.io streaming APIs for real-time stock prices, trade notifications, and audit event logging;' +
        'Engineered CI/CD pipelines using Jenkins, Docker, and AWS ECS achieving 40+ deployments per week;' +
        'Configured AWS ELB and Auto Scaling Groups for high availability (99.95% uptime SLA);' +
        'Optimized query performance and materialized views, improving portfolio calculations by 75%;' +
        'Developed Solidity smart contracts for DeFi crypto transactions on Ethereum testnet;' +
        'Built backend services for blockchain transaction verification and crypto wallet integration',
    },
    {
      company: 'EY (Ernst & Young)',
      location: 'Mumbai, IND & Secaucus, NJ',
      role: 'Senior Software Developer',
      duration: 'Aug 2009 – Jan 2016',
      projectName: 'OGS (One Global System), GMS (Global Management System), SSO — Enterprise Backend',
      description: 'Built global audit and tax systems across 40 countries with SSO, SQL optimization, and secure access controls.',
      techSections: [
        {
          title: 'Backend Development',
          bullets: [
            'Architected C#/ASP.NET backend systems for global audit and tax-filing platforms used across 40+ countries',
            'Built SSO onboarding portal with SAML/OAuth2 integration for 10,000+ auditors worldwide',
            'Developed secure admin portals with role-based access control and audit logging',
          ],
        },
        {
          title: 'Data Processing & Automation',
          bullets: [
            'Engineered Excel-driven workflow automation generating SQL-powered XML/XHTML documents for regulatory filing',
            'Built WCF file migration services over TCP for binary data transfers, improving backup performance by 75%',
            'Optimized SQL Server stored procedures reducing report generation time from 45 minutes to 8 minutes',
            'Implemented SQL query optimization with indexing strategies, reducing CPU utilization by 55%',
            'Tuned ASP.NET application pool settings and output caching, improving capacity from 500 to 2,000 concurrent users',
          ],
        },
        {
          title: 'Reporting & Integration',
          bullets: [
            'Developed SSRS reporting engine with dynamic ASP.NET integrations for real-time audit dashboards',
            'Implemented SQL security policies, row-level security, and encrypted stored procedures for PII protection',
          ],
        },
      ],
      projectContext:
        'Architected C#/ASP.NET backend for global audit and tax-filing platforms used across 40+ countries in 7 languages;' +
        'Built SSO onboarding portal with SAML/OAuth2 authentication for 10,000+ auditors worldwide;' +
        'Designed Global Management System (GMS) as an admin portal for EY engagement partners;' +
        'Implemented Standard Business Rules (SBR) using C# Windows Application for tax filing and audit CSV uploads;' +
        'Enhanced One Global System (OGS) performance with async-await and multi-threading in ASP.NET;' +
        'Engineered SQL database with stored procedures, views, constraints, and SSRS report integration;' +
        'Migrated binary data from database to file systems using WCF service over TCP, improving backup speed by 75%;' +
        'Optimized SQL Server stored procedures reducing report generation time from 45 minutes to 8 minutes;' +
        'Implemented SQL query optimization and indexing, reducing CPU utilization by 55%;' +
        'Tuned ASP.NET application pool settings improving concurrent user capacity from 500 to 2,000;' +
        'Developed SSRS reporting engine with dynamic ASP.NET integrations for real-time audit dashboards;' +
        'Implemented row-level security and encrypted stored procedures for PII data protection;' +
        'Generated XHTML from XML/XSLT for regulatory document rendering, boosting web page performance',
    },
  ],
  socialLinks: {
    linkedIn: 'https://www.linkedin.com/in/tbudhe',
    github: 'https://github.com/tbudhe',
  },
};

export function generateResumeText(profile: Omit<ProfileData, 'resumeText'>): string {
  const lines: string[] = [];

  // Header
  const headerParts = [profile.name];
  if (profile.title) headerParts.push(profile.title);
  if (profile.location) headerParts.push(profile.location);
  if (profile.email) headerParts.push(profile.email);
  if (profile.phone) headerParts.push(profile.phone);
  lines.push(headerParts.join(' | '));
  lines.push('');

  // Summary
  if (profile.summary?.trim()) {
    lines.push('Summary');
    lines.push(profile.summary.trim());
    lines.push('');
  }

  // Skills — flat list from all groups
  const allSkills = profile.skillGroups.flatMap((g: SkillGroup) => g.items).filter(Boolean);
  if (allSkills.length > 0) {
    lines.push('Skills');
    lines.push(allSkills.join(', '));
    lines.push('');
  }

  // Experience — each job gets a header line + description bullets
  if (profile.experience?.length > 0) {
    lines.push('Experience');
    profile.experience.forEach((exp: ExperienceEntry) => {
      const header = [exp.company, exp.role, exp.duration].filter(Boolean).join(' | ');
      lines.push(header);
      if (exp.description?.trim()) {
        // Split description into bullet lines (handle semicolons, newlines, or single block)
        const rawBullets = exp.description
          .split(/[;\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
        rawBullets.forEach((bullet) => lines.push(`- ${bullet}`));
      }
      if (exp.projectContext?.trim()) {
        const ctxBullets = exp.projectContext
          .split(/[;\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
        ctxBullets.forEach((bullet) => lines.push(`  * ${bullet}`));
      }
      lines.push('');
    });
  }

  return lines.join('\n').trim();
}

export async function getProfile(): Promise<ProfileData> {
  const resumeText = generateResumeText(SEED_PROFILE);
  return { ...SEED_PROFILE, resumeText };
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  void data;
  const resumeText = generateResumeText(SEED_PROFILE);
  return { ...SEED_PROFILE, resumeText };
}
