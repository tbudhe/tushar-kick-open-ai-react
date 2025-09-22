import React, { useState } from 'react';
import '../../css/Systems.css';

const Systems: React.FC = () => {
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);

  const principles = [
    {
      name: 'Performance Matrices',
      details: [
        'Load time: The time it takes for a page to load completely.',
        'Time to first byte: The time it takes for the server to send the first byte of data.',
        'Request control: Managing and prioritizing requests to optimize performance.',
        'DOM content: The time it takes for the DOM to be fully constructed.',
        'Time to find above and below the fold: Measuring the time it takes to render content above and below the fold.',
        'Page size: The total size of the page, including all assets.',
        'Round trip time: The time it takes for a request to travel from the client to the server and back.',
        'Render block resources: Resources that prevent the page from rendering until they are loaded.',
      ],
    },
    {
      name: 'System Reliability',
      details: [
        'CAP theorem: CAP theorem, a distributed system can only guarantee two of these properties at the same time. CA(SQL)/CP(NoSql)/AP(Scylla DB)',
        'Eventual consistency: A model where updates to a distributed system will propagate and become consistent over time.(Kafka/RabbitMQ)',
        'Load Balancing: Distributing workloads across multiple resources to ensure no single resource is overwhelmed.',
        'Consistent Hashing: A technique used to distribute requests across a cluster of servers while minimizing disruption. Clock wise direction',
        'Rate limiter: Controls the rate of requests sent to a server.',
        'Monitoring: logs, health and performance metrics. async logging & prometheus & grafana',
      ],
    },
    {
      name: 'Key System Attributes',
      details: [
        'Latency: How fast your response to your request?',
        'Throughput:The number of requests a system can process per unit of time. High throughput ensures the system can handle large volumes of traffic.',
        'Scalability: The ability of a system to handle increased load without degrading performance. Scalability ensures the system can grow with demand.',
      ],
    },
    {
      name: 'API Performance',
      details: [
        'Statelessness: Each API request should contain all the information needed to process it, without relying on server-side sessions.',
        'Stateful: Assign request sessions and use apache sticky session.',
        'Caching: Storing frequently accessed data closer to the client to reduce latency and improve response times.',
        'Pagination: Dividing large datasets into smaller, manageable chunks to improve performance and reduce load times.',
        'Compression: Reducing the size of data transmitted over the network to improve transfer speeds.',
        'Connection Pools: Efficiently managing connections to minimize overhead and latency.',
        'Asynchronous processing: Handling requests asynchronously to improve responsiveness and throughput.',
      ],
    },
    {
      name: 'Database Performance',
      details: [
        'Indexing: Creating indexes on database tables to improve query performance.',
        'Query optimization: Analyzing and optimizing slow-running queries for better performance.',
        'Connection pooling: Reusing database connections to reduce overhead and improve response times.',
        'Caching: Storing frequently accessed data in memory to reduce database load.',
        'Sharding: Distributing data across multiple database instances to improve scalability.',
        'Replication: Creating copies of the database to improve availability and fault tolerance.',
      ],
    },
    {
      name: 'Front-end Performance',
      details: [
        'Minification: Reducing the size of CSS and JavaScript files by removing whitespace and comments.',
        'Bundling: Combining multiple files into a single file to reduce the number of HTTP requests.',
        'Lazy loading: Loading resources only when they are needed to improve initial load times.',
        'Image optimization: Reducing the size of images without sacrificing quality.',
        'CDN usage: Distributing content across multiple servers to improve load times for users.',
        'Critical rendering path: Optimizing the sequence of events that lead to the rendering of a page.',
      ],
    },
    {
      name: 'Security',
      details: [
        'Authentication: Verifying the identity of users or systems.',
        'Authorization: Granting or denying access to resources based on permissions.',
        'Encryption: Protecting data by transforming it into an unreadable format.',
        'Input validation: Ensuring that user input is safe and meets expected formats.',
        'Rate limiting: Controlling the number of requests a user can make in a given time period.',
        'Logging and monitoring: Keeping track of system activity to detect and respond to security incidents.',
      ],
    },
    {
      name: 'DevOps and Deployment',
      details: [
        'Continuous Integration: Automating the integration of code changes from multiple contributors.',
        'Continuous Deployment: Automating the deployment of code changes to production environments.',
        'Infrastructure as Code: Managing and provisioning infrastructure through code and automation.',
        'Monitoring and Logging: Continuously monitoring applications and infrastructure for performance and issues.',
        'Containerization: Packaging applications and their dependencies into containers for consistency across environments.',
        'Orchestration: Automating the deployment, scaling, and management of containerized applications.',
      ],
    },
    {
      name: 'Networking',
      details: [
        'Load Balancing: Distributing network traffic across multiple servers to ensure no single server becomes overwhelmed.',
        'Firewalls: Implementing security measures to control incoming and outgoing network traffic.',
        'VPNs: Creating secure connections between remote users and the corporate network.',
        'DNS: Translating human-readable domain names into IP addresses.',
        'CDN: Distributing content across multiple servers to improve access speed for users in different locations.',
        'Network Monitoring: Continuously monitoring network traffic for performance and security issues.',
      ],
    },
    {
      name: 'Sharding Vs Partitioning',
      details: [
        'Sharding: Distributing data across multiple database instances to improve scalability.',
        'Partitioning: Dividing a database into smaller, more manageable pieces, while still being part of the same database instance.',
      ]
    },
    {
      name: ' Horizontal vs Vertical Sharding',
      details: [
        'Horizontal Sharding: Distributing data across multiple database instances by rows.',
        'Vertical Sharding: Distributing data across multiple database instances by columns.',
      ]
    },
    {
      name: 'Database Types',
      details: [
        'Relational Databases: Structured databases that use SQL for querying and maintaining data.',
        'NoSQL Databases: Non-relational databases that store unstructured data and allow for flexible schemas.',
        'In-memory Databases: Databases that store data in memory for faster access and processing.',
        'Graph Databases: Databases that use graph structures to represent and query relationships between data.',
        'Time-series Databases: Databases optimized for storing and querying time-stamped data.',
      ]
    },
    {
      name: 'GraphQL vs Rest API',
      details: [
        'GraphQL: A query language for APIs that allows clients to request only the data they need.',
        'REST API: An architectural style for designing networked applications, using standard HTTP methods.',
        'Advantages of GraphQL over REST: More efficient data fetching, reduced over-fetching and under-fetching of data, and a more flexible query structure.',
        'Advantages of REST over GraphQL: Simplicity, better caching, and a more mature ecosystem.',
        'Disadvantages of GraphQL: Complexity, potential performance issues with deeply nested queries, and a steeper learning curve. Need external libraries for features like Apollo Server.',
        'Disadvantages of REST: Over-fetching and under-fetching of data, rigid structure, and difficulty in versioning APIs.'
      ]
    },
    {
      name: 'CDN vs Caching',
      details: [
        'CDN (Content Delivery Network): A network of servers distributed across various locations to deliver content to users more quickly and efficiently.',
        'Caching: The process of storing copies of files or data in temporary storage locations for faster access.',
        'Key Differences: CDNs are designed for distributing content globally, while caching is focused on improving access speed for frequently requested data.',
        'Use Cases: CDNs are ideal for serving static assets like images and videos, while caching is useful for dynamic content and API responses.'
      ]
    },
    {
      name: 'Kafka vs Redis',
      details: [
        'Kafka: A distributed event streaming platform capable of handling trillions of events a day.',
        'Redis: An in-memory data structure store, used as a database, cache, and message broker. Executes on RAM',
        'Key Differences: Kafka is designed for high-throughput event streaming, while Redis is optimized for low-latency data access.',
        'Use Cases: Kafka is ideal for real-time analytics and event sourcing, while Redis is suited for caching and session management.'
      ]
    },
    {
      name: 'Monolithic vs Microservices Architecture',
      details: [
        'Monolithic Architecture: A traditional model where all components of an application are interconnected and interdependent, running as a single service.',
        'Modular Monolithic: A variation of monolithic architecture that emphasizes separation of concerns within the application, often using techniques like feature toggles and micro frontends.',
        'Microservices Architecture: A modern approach where applications are composed of small, independent services that communicate over well-defined APIs.',
      ]
    },
    {
      name: 'Synchronous vs Asynchronous Communication',
      details: [
        'Synchronous Communication: A communication model where the sender waits for a response from the receiver.',
        'Asynchronous Communication: A communication model where the sender does not wait for a response and can continue processing.'
      ]
    },
    {
      name: 'Python Vs NodeJS',
      details: [
        'Python: A high-level, interpreted programming language known for its readability and versatility.',
        'Node.js: A JavaScript runtime built on Chrome\'s V8 engine, designed for building scalable network applications.',
        'Key Differences: Python is often used for data science and machine learning, while Node.js is preferred for building real-time web applications.',
        'Use Cases: Python is ideal for scripting and automation, while Node.js excels in handling concurrent requests and real-time communication.'
      ]
    },
    {
      name: 'Partitions Vs Indexing',
      details: [
        'Partitions: Dividing a dataset into smaller, more manageable pieces, often used in databases and big data processing.',
        'Indexing: Creating data structures (indexes) to improve the speed of data retrieval operations on a database.',
        'Key Differences: Partitioning is about data organization, while indexing is about data access speed.',
        'Use Cases: Partitioning is useful for managing large datasets, while indexing is essential for optimizing query performance.',
        'Partitioning strategies: Range-based, List-based, Hash-based',
        'Indexing strategies: Cluster & Non Cluster Index'
      ]
    },
    {
      name: "Types Of protocols",
      details: [
        'http: Hypertext Transfer Protocol - Foundation of data communication on the web.',
        'https: Hypertext Transfer Protocol Secure - Extension of HTTP with security features.',
        'ftp: File Transfer Protocol - Standard network protocol for transferring files.',
        'smtp: Simple Mail Transfer Protocol - Protocol for sending emails.',
        'grpc: gRPC - A high-performance, open-source universal RPC framework.'
      ]
    },
    {
      name: 'High-level design patterns',
      details: [
        'MVC: Model-View-Controller, separates application logic, UI, and user input for better organization.',
        'MVP: Model-View-Presenter, focuses on separating the presentation layer from the business logic.',
        'MCP: Model-Context-Protocol, emphasizes modularity and communication protocols LLM.',
        '3-Tier: Divides applications into Presentation, Logic, and Data layers for scalability.',
        'MVVC: Model-View-ViewModel, enhances separation of concerns with data binding between View and ViewModel.'
      ]
    },
    {
      name: 'Coding Design Patterns (Head First)',
      details: [
        'Singleton: Ensures a class has only one instance and provides a global point of access to it.',
        'Factory: Defines an interface for creating objects but lets subclasses alter the type of objects that will be created.',
        'Observer: Establishes a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.',
        'Decorator: Dynamically adds responsibilities to an object without modifying its code.',
        'Strategy: Defines a family of algorithms, encapsulates each one, and makes them interchangeable.',
        'Command: Encapsulates a request as an object, thereby allowing users to parameterize clients with different requests, queue or log requests, and support undoable operations.',
        'Adapter: Converts the interface of a class into another interface clients expect.',
        'Template Method: Defines the skeleton of an algorithm in a method, deferring some steps to subclasses.'
      ]
    }

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