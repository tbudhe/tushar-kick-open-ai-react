import React from 'react';
import VerticalSidebarLayout, { SidebarItem } from '../layout/vertical-sidebar-layout';

const Systems: React.FC = () => {
  const systemItems: SidebarItem[] = [
    {
      name: 'Performance Matrices',
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
      name: 'System Reliability',
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
      name: 'Key System Attributes',
      details: [
        'Latency: How fast is your response to your request?',
        'Throughput: The number of requests a system can process per unit of time.',
        'Scalability: The ability of a system to handle increased load without degrading performance.',
      ],
    },
    {
      name: 'API Performance',
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
      name: 'Database Performance',
      details: [
        'Indexing: Creating indexes on database tables to improve query performance.',
        'Query optimization: Analyzing and optimizing slow-running queries.',
        'Connection pooling: Reusing database connections to reduce overhead.',
        'Caching: Storing frequently accessed data in memory to reduce database load.',
        'Sharding: Distributing data across multiple database instances.',
        'Replication: Creating copies of the database to improve availability.',
      ],
    },
    {
      name: 'Front-end Performance',
      details: [
        'Minification: Reducing the size of CSS and JavaScript files.',
        'Bundling: Combining multiple files into a single file.',
        'Lazy loading: Loading resources only when they are needed.',
        'Image optimization: Reducing the size of images without sacrificing quality.',
        'CDN usage: Distributing content across multiple servers.',
        'Critical rendering path: Optimizing the sequence of rendering events.',
      ],
    },
    {
      name: 'Security',
      details: [
        'Authentication: Verifying the identity of users or systems.',
        'Authorization: Granting or denying access to resources based on permissions.',
        'Encryption: Protecting data by transforming it into an unreadable format.',
        'Input validation: Ensuring that user input is safe and meets expected formats.',
        'Rate limiting: Controlling the number of requests a user can make.',
        'Logging and monitoring: Keeping track of system activity to detect incidents.',
      ],
    },
    {
      name: 'DevOps and Deployment',
      details: [
        'Continuous Integration: Automating the integration of code changes.',
        'Continuous Deployment: Automating the deployment of code changes.',
        'Infrastructure as Code: Managing infrastructure through code and automation.',
        'Monitoring and Logging: Continuously monitoring applications and infrastructure.',
        'Containerization: Packaging applications and dependencies into containers.',
        'Orchestration: Automating deployment, scaling, and management.',
      ],
    },
    {
      name: 'Networking',
      details: [
        'Load Balancing: Distributing network traffic across multiple servers.',
        'Firewalls: Implementing security measures to control network traffic.',
        'VPNs: Creating secure connections between remote users and networks.',
        'DNS: Translating domain names into IP addresses.',
        'CDN: Distributing content across servers globally.',
        'Network Monitoring: Continuously monitoring network traffic.',
      ],
    },
    {
      name: 'Sharding Vs Partitioning',
      details: [
        'Sharding: Distributing data across multiple database instances.',
        'Partitioning: Dividing a database into smaller, more manageable pieces.',
      ],
    },
    {
      name: 'Horizontal vs Vertical Sharding',
      details: [
        'Horizontal Sharding: Distributing data across instances by rows.',
        'Vertical Sharding: Distributing data across instances by columns.',
      ],
    },
    {
      name: 'Database Types',
      details: [
        'Relational Databases: Structured databases that use SQL.',
        'NoSQL Databases: Non-relational databases with flexible schemas.',
        'In-memory Databases: Databases that store data in memory.',
        'Graph Databases: Databases using graph structures.',
        'Time-series Databases: Optimized for time-stamped data.',
      ],
    },
    {
      name: 'GraphQL vs Rest API',
      details: [
        'GraphQL: A query language allowing clients to request only needed data.',
        'REST API: An architectural style using standard HTTP methods.',
        'GraphQL Advantages: More efficient data fetching, less over-fetching.',
        'REST Advantages: Simplicity, better caching, more mature ecosystem.',
        'GraphQL Disadvantages: Complexity, potential performance issues with nested queries.',
        'REST Disadvantages: Over-fetching, rigid structure, versioning difficulties.',
      ],
    },
    {
      name: 'CDN vs Caching',
      details: [
        'CDN: A network of servers distributed globally.',
        'Caching: Storing copies of files in temporary storage.',
        'CDNs: Designed for distributing content globally.',
        'Caching: Focused on improving access speed for frequently requested data.',
        'CDN Use Cases: Serving static assets like images and videos.',
        'Caching Use Cases: Dynamic content and API responses.',
      ],
    },
    {
      name: 'Kafka vs Redis',
      details: [
        'Kafka: A distributed event streaming platform.',
        'Redis: An in-memory data structure store.',
        'Kafka: Designed for high-throughput event streaming.',
        'Redis: Optimized for low-latency data access.',
        'Kafka Use Cases: Real-time analytics and event sourcing.',
        'Redis Use Cases: Caching and session management.',
      ],
    },
    {
      name: 'Monolithic vs Microservices',
      details: [
        'Monolithic: All components interconnected and running as single service.',
        'Modular Monolithic: Separation of concerns using feature toggles.',
        'Microservices: Small, independent services communicating via APIs.',
      ],
    },
    {
      name: 'Synchronous vs Asynchronous',
      details: [
        'Synchronous: Sender waits for a response from the receiver.',
        'Asynchronous: Sender does not wait and can continue processing.',
      ],
    },
    {
      name: 'Python vs NodeJS',
      details: [
        'Python: High-level, interpreted language known for readability.',
        'Node.js: JavaScript runtime built on V8 engine.',
        'Python: Used for data science and machine learning.',
        'Node.js: Preferred for building real-time web applications.',
        'Python: Ideal for scripting and automation.',
        'Node.js: Excels in handling concurrent requests.',
      ],
    },
    {
      name: 'Partitions vs Indexing',
      details: [
        'Partitions: Dividing a dataset into smaller pieces.',
        'Indexing: Creating data structures to improve retrieval speed.',
        'Partitioning: About data organization.',
        'Indexing: About data access speed.',
        'Partitioning strategies: Range-based, List-based, Hash-based',
        'Indexing strategies: Cluster & Non Cluster Index',
      ],
    },
    {
      name: 'Types Of Protocols',
      details: [
        'http: Hypertext Transfer Protocol - Foundation of web communication.',
        'https: Hypertext Transfer Protocol Secure - HTTP with security features.',
        'ftp: File Transfer Protocol - Standard for transferring files.',
        'smtp: Simple Mail Transfer Protocol - For sending emails.',
        'grpc: A high-performance, open-source universal RPC framework.',
      ],
    },
    {
      name: 'High-level Design Patterns',
      details: [
        'MVC: Separates application logic, UI, and user input.',
        'MVP: Focuses on separating presentation layer from business logic.',
        'MCP: Emphasizes modularity and communication protocols.',
        '3-Tier: Divides applications into Presentation, Logic, and Data layers.',
        'MVVC: Enhances separation with data binding between View and ViewModel.',
      ],
    },
    {
      name: 'Coding Design Patterns',
      details: [
        'Singleton: Ensures a class has only one instance.',
        'Factory: Lets subclasses decide the type of objects to create.',
        'Observer: Establishes one-to-many dependency between objects.',
        'Decorator: Dynamically adds responsibilities to an object.',
        'Strategy: Defines a family of interchangeable algorithms.',
        'Command: Encapsulates a request as an object.',
        'Adapter: Converts one interface to another.',
        'Template Method: Defines algorithm skeleton in a method.',
      ],
    },
  ];

  return <VerticalSidebarLayout title="System Design" items={systemItems} />;
};

export default Systems;
