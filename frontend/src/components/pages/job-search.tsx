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

interface ParsedResumeData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  summary: string | null;
  skills: string[];
  experience: string[];
  education: string[];
}

interface ParseResumeResponse {
  success: boolean;
  source: 'claude' | 'fallback';
  fileName: string;
  parsedData: ParsedResumeData;
}

const SAMPLE_RESUME = `Alex Johnson
Email: alex.johnson@example.com
Phone: +1 (415) 555-1290

Summary
Full-stack engineer with 6 years of experience building React and Node.js applications. Strong focus on performance, reliability, and product iteration.

Skills
React, TypeScript, Node.js, Express, MongoDB, REST APIs, AWS, Docker

Experience
Senior Software Engineer - CloudNova (2022 - Present)
- Led migration from JavaScript to TypeScript across 4 frontend apps
- Improved page load performance by 35%

Software Engineer - BrightStack (2019 - 2022)
- Built internal analytics dashboards used by 120+ team members

Education
B.S. Computer Science, University of Washington (2019)
`;

const TEXT_BASED_EXTENSIONS = new Set(['txt', 'md', 'json', 'rtf']);

function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

const JobSearch: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedResult, setParsedResult] = useState<ParseResumeResponse | null>(null);

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

  const handleResumeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const extension = getFileExtension(file.name);
    setSelectedFile(file);
    setResumeFileName(file.name);
    setParsedResult(null);
    setParseError('');

    if (!TEXT_BASED_EXTENSIONS.has(extension)) {
      setResumeText('');
      return;
    }

    try {
      const text = await file.text();
      setResumeText(text);
    } catch {
      setParseError('Unable to read the selected file. Please upload a plain text resume.');
    }
  };

  const handleParseResume = async () => {
    if (!selectedFile && !resumeText.trim()) {
      setParseError('Upload a resume file or paste resume text before parsing.');
      return;
    }

    setIsParsing(true);
    setParseError('');
    setParsedResult(null);

    try {
      let response: Response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('resumeFile', selectedFile);
        if (resumeText.trim()) {
          formData.append('resumeText', resumeText);
        }
        if (resumeFileName) {
          formData.append('fileName', resumeFileName);
        }

        response = await fetch('/api/parse-resume', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resumeText,
            fileName: resumeFileName || 'pasted-resume.txt',
          }),
        });
      }

      const data = (await response.json()) as ParseResumeResponse | { error: string };

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to parse resume');
      }

      setParsedResult(data);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Unexpected error parsing resume');
    } finally {
      setIsParsing(false);
    }
  };

  const useSampleResume = () => {
    setSelectedFile(null);
    setResumeText(SAMPLE_RESUME);
    setResumeFileName('sample-resume.txt');
    setParseError('');
    setParsedResult(null);
  };

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
          <div className="resume-parser-header">
            <h2>Resume Parser</h2>
            <p>Upload or paste your resume, then extract structured profile data.</p>
          </div>

          <div className="resume-parser-controls">
            <input
              type="file"
              accept=".txt,.md,.json,.rtf,.pdf,.doc,.docx"
              onChange={handleResumeFileUpload}
            />
            <button type="button" className="resume-action-btn" onClick={useSampleResume}>
              Use Sample Resume
            </button>
            <button
              type="button"
              className="resume-action-btn primary"
              onClick={handleParseResume}
              disabled={isParsing}
            >
              {isParsing ? 'Parsing...' : 'Parse Resume'}
            </button>
          </div>

          <textarea
            className="resume-input"
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste resume text here if you don't want to upload a file"
            rows={10}
          />

          {resumeFileName && (
            <p className="resume-helper-text">
              Loaded: {resumeFileName}. Click "Parse Resume" to send this file to backend for extraction.
              Legacy .doc may require converting to .docx.
            </p>
          )}

          {parseError && <p className="resume-error">{parseError}</p>}

          {parsedResult && (
            <div className="resume-results">
              <div className="resume-results-header">
                <h3>Parsed Resume Data</h3>
                <span>Source: {parsedResult.source}</span>
              </div>
              <ul>
                <li><strong>Name:</strong> {parsedResult.parsedData.fullName || 'N/A'}</li>
                <li><strong>Email:</strong> {parsedResult.parsedData.email || 'N/A'}</li>
                <li><strong>Phone:</strong> {parsedResult.parsedData.phone || 'N/A'}</li>
                <li><strong>Summary:</strong> {parsedResult.parsedData.summary || 'N/A'}</li>
                <li>
                  <strong>Skills:</strong>{' '}
                  {parsedResult.parsedData.skills.length > 0
                    ? parsedResult.parsedData.skills.join(', ')
                    : 'N/A'}
                </li>
              </ul>
            </div>
          )}
        </div>

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
