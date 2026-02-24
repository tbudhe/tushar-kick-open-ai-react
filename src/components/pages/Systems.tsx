import React from 'react';
import AdminSidebarLayout, { MenuSection } from '../layout/admin-sidebar-layout';

const Systems: React.FC = () => {
  const menuSections: MenuSection[] = [
    {
      title: 'Foundation',
      items: [
        {
          id: 'performance',
          label: 'Performance Matrices',
          details: [
            'Load time: The time it takes for a page to load completely.',
            'Time to first byte: The time it takes for the server to send the first byte of data.',
            'Request control: Managing and prioritizing requests to optimize performance.',
            'DOM content: The time it takes for the DOM to be fully constructed.',
            'Page size: The total size of the page, including all assets.',
            'Round trip time: The time it takes for a request to travel from the client to the server and back.',
            'Render block resources: Resources that prevent the page from rendering until they are loaded.',
          ],
        },
        {
          id: 'reliability',
          label: 'System Reliability',
          details: [
            'CAP theorem: A distributed system can only guarantee two of these properties at the same time. CA(SQL)/CP(NoSql)/AP(Scylla DB)',
            'Eventual consistency: A model where updates will propagate and become consistent over time.(Kafka/RabbitMQ)',
            'Load Balancing: Distributing workloads across multiple resources.',
            'Consistent Hashing: A technique to distribute requests across servers while minimizing disruption.',
            'Rate limiter: Controls the rate of requests sent to a server.',
            'Monitoring: logs, health and performance metrics. async logging & prometheus & grafana',
          ],
        },
        {
          id: 'attributes',
          label: 'Key System Attributes',
          details: [
            'Latency: How fast is your response to your request?',
            'Throughput: The number of requests a system can process per unit of time.',
            'Scalability: The ability of a system to handle increased load without degrading performance.',
          ],
        },
      ],
    },
    {
      title: 'Architecture',
      items: [
        {
          id: 'api',
          label: 'API Performance',
          details: [
            'Statelessness: Each API request should contain all the information needed to process it.',
            'Stateful: Assign request sessions and use apache sticky session.',
            'Caching: Storing frequently accessed data closer to the client.',
            'Pagination: Dividing large datasets into smaller, manageable chunks.',
            'Compression: Reducing the size of data transmitted over the network.',
            'Connection Pools: Efficiently managing connections to minimize overhead.',
            'Asynchronous processing: Handling requests asynchronously to improve responsiveness.',
          ],
        },
        {
          id: 'patterns',
          label: 'Design Patterns',
          subcategories: [
            {
              id: 'architectural',
              label: 'Architectural Patterns',
              details: [
                'MVC: Separates application logic, UI, and user input.',
                'MVP: Focuses on separating presentation layer from business logic.',
                'MCP: Emphasizes modularity and communication protocols.',
                '3-Tier: Divides applications into Presentation, Logic, and Data layers.',
                'MVVC: Enhances separation with data binding.',
              ],
            },
            {
              id: 'coding',
              label: 'Coding Patterns',
              details: [
                'Singleton: Ensures a class has only one instance.',
                'Factory: Lets subclasses decide the type of objects to create.',
                'Observer: Establishes one-to-many dependency.',
                'Decorator: Dynamically adds responsibilities.',
                'Strategy: Defines interchangeable algorithms.',
              ],
            },
          ],
        },
        {
          id: 'architecture-styles',
          label: 'Monolithic vs Microservices',
          details: [
            'Monolithic: All components interconnected and running as single service.',
            'Modular Monolithic: Separation of concerns using feature toggles.',
            'Microservices: Small, independent services communicating via APIs.',
          ],
        },
      ],
    },
    {
      title: 'Backend & Storage',
      items: [
        {
          id: 'database',
          label: 'Database Performance',
          details: [
            'Indexing: Creating indexes on database tables.',
            'Query optimization: Analyzing slow-running queries.',
            'Connection pooling: Reusing database connections.',
            'Caching: Storing frequently accessed data in memory.',
            'Sharding: Distributing data across instances.',
            'Replication: Creating copies for availability.',
          ],
        },
        {
          id: 'db-types',
          label: 'Database Types',
          subcategories: [
            {
              id: 'relational',
              label: 'Relational & NoSQL',
              details: [
                'Relational Databases: Structured with SQL.',
                'NoSQL Databases: Non-relational with flexible schemas.',
                'In-memory Databases: Store data in RAM.',
                'Graph Databases: Use graph structures.',
                'Time-series Databases: For time-stamped data.',
              ],
            },
            {
              id: 'sharding-types',
              label: 'Sharding Strategies',
              details: [
                'Sharding: Distributing across instances.',
                'Partitioning: Dividing within single instance.',
                'Horizontal Sharding: By rows.',
                'Vertical Sharding: By columns.',
              ],
            },
          ],
        },
        {
          id: 'cache-compare',
          label: 'Kafka vs Redis',
          details: [
            'Kafka: Distributed event streaming platform.',
            'Redis: In-memory data structure store.',
            'Kafka: High-throughput event streaming.',
            'Redis: Low-latency data access.',
          ],
        },
      ],
    },
    {
      title: 'Frontend & APIs',
      items: [
        {
          id: 'frontend',
          label: 'Front-end Performance',
          details: [
            'Minification: Reducing CSS and JS files.',
            'Bundling: Combining multiple files.',
            'Lazy loading: Loading resources on demand.',
            'Image optimization: Quality without size.',
            'CDN usage: Global content distribution.',
            'Critical rendering path optimization.',
          ],
        },
        {
          id: 'api-styles',
          label: 'GraphQL vs REST',
          details: [
            'GraphQL: Request only needed data.',
            'REST: Standard HTTP methods.',
            'GraphQL Advantages: Efficient fetching.',
            'REST Advantages: Simplicity, better caching.',
          ],
        },
        {
          id: 'protocols',
          label: 'Protocols',
          details: [
            'HTTP: Web communication foundation.',
            'HTTPS: HTTP with security.',
            'FTP: File transfer protocol.',
            'SMTP: Email sending protocol.',
            'gRPC: High-performance RPC framework.',
          ],
        },
      ],
    },
    {
      title: 'DevOps & Networking',
      items: [
        {
          id: 'devops',
          label: 'DevOps & Deployment',
          details: [
            'Continuous Integration: Automating code integration.',
            'Continuous Deployment: Automating deployment.',
            'Infrastructure as Code: Code-based infrastructure.',
            'Monitoring and Logging: System tracking.',
            'Containerization: Container-based deployment.',
            'Orchestration: Deployment automation.',
          ],
        },
        {
          id: 'networking',
          label: 'Networking',
          details: [
            'Load Balancing: Traffic distribution.',
            'Firewalls: Network security.',
            'VPNs: Secure connections.',
            'DNS: Domain name translation.',
            'CDN: Global content distribution.',
            'Network Monitoring: Traffic analysis.',
          ],
        },
        {
          id: 'communication',
          label: 'Communication Models',
          details: [
            'Synchronous: Sender waits for response.',
            'Asynchronous: Sender continues processing.',
          ],
        },
      ],
    },
  ];

  return (
    <AdminSidebarLayout sections={menuSections} appName="System Design" />
  );
};

export default Systems;
