import React, { useState } from 'react';
import JobCard from '../job-card/job-card';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  status: 'saved' | 'applied' | 'rejected' | 'interview';
}

const JobSearch: React.FC = () => {
  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      salary: '$150K - $180K',
      description:
        'We are looking for an experienced React developer to join our growing team. You will work on cutting-edge web applications and collaborate with talented engineers.',
      status: 'applied',
    },
    {
      id: '2',
      title: 'Full Stack JavaScript Developer',
      company: 'StartUp Inc',
      location: 'Remote',
      salary: '$120K - $150K',
      description:
        'Join our fast-growing startup and build the next generation of web applications. Experience with Node.js and React preferred.',
      status: 'saved',
    },
    {
      id: '3',
      title: 'Frontend Engineer',
      company: 'Design Studios',
      location: 'New York, NY',
      salary: '$130K - $160K',
      description:
        'Create beautiful and responsive user interfaces for our design platform. Strong CSS and JavaScript skills required.',
      status: 'interview',
    },
    {
      id: '4',
      title: 'TypeScript Developer',
      company: 'Cloud Systems',
      location: 'Austin, TX',
      salary: '$140K - $170K',
      description:
        'Build scalable cloud applications with TypeScript. Experience with AWS and microservices architecture is a plus.',
      status: 'saved',
    },
  ]);

  const carouselItems = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    subtitle: `${job.company} | ${job.location}`,
    description: job.description,
    badge: job.salary,
  }));

  return (
    <div className="job-search-page">
      <div className="job-search-content">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Job Search Dashboard
          </h1>
          <p className="text-gray-600">Track your job applications and opportunities</p>
        </div>

        {/* Job Carousel */}
        <div className="panel-card job-carousel-panel">
          <JobCard
            items={carouselItems}
            title="Featured Job Opportunities"
            autoSlide={true}
            autoSlideInterval={6000}
          />
        </div>

        <div className="panel-card">
          <div className="job-list-header">
            <h2>Recent Roles</h2>
            <span>{jobs.length} openings</span>
          </div>
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-list-item">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company} • {job.location}</p>
                </div>
                <div className="job-list-meta">
                  <span className="job-tag">{job.salary}</span>
                  <span className="job-status">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
