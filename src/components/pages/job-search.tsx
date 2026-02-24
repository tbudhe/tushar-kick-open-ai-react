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

interface Stats {
  jobsFound: number;
  applicationsSent: number;
  responses: number;
  interviews: number;
}

const JobSearch: React.FC = () => {
  const [stats] = useState<Stats>({
    jobsFound: 245,
    applicationsSent: 18,
    responses: 5,
    interviews: 2,
  });

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

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'applied':
        return 'primary';
      case 'interview':
        return 'success';
      case 'rejected':
        return 'error';
      case 'saved':
      default:
        return 'warning';
    }
  };

  const carouselItems = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    subtitle: `${job.company} | ${job.location}`,
    description: job.description,
    badge: job.salary,
    badgeColor: getStatusColor(job.status),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Job Search Dashboard
          </h1>
          <p className="text-gray-600">Track your job applications and opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="stat bg-white rounded-lg shadow">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="stat-title">Jobs Found</div>
            <div className="stat-value text-primary">{stats.jobsFound}</div>
            <div className="stat-desc">This month</div>
          </div>

          <div className="stat bg-white rounded-lg shadow">
            <div className="stat-figure text-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div className="stat-title">Applications Sent</div>
            <div className="stat-value text-info">{stats.applicationsSent}</div>
            <div className="stat-desc">This week</div>
          </div>

          <div className="stat bg-white rounded-lg shadow">
            <div className="stat-figure text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="stat-title">Responses</div>
            <div className="stat-value text-success">{stats.responses}</div>
            <div className="stat-desc">Positive replies</div>
          </div>

          <div className="stat bg-white rounded-lg shadow">
            <div className="stat-figure text-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-title">Interviews Scheduled</div>
            <div className="stat-value text-warning">{stats.interviews}</div>
            <div className="stat-desc">Upcoming</div>
          </div>
        </div>

        {/* Job Carousel */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <JobCard
            items={carouselItems}
            title="Featured Job Opportunities"
            autoSlide={true}
            autoSlideInterval={6000}
          />
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">All Jobs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{job.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{job.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                      {job.salary}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`badge badge-${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline btn-primary">
                          View
                        </button>
                        <button className="btn btn-sm btn-outline">Save</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
