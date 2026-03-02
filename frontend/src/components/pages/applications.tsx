import React, { useEffect, useMemo, useState } from 'react';

type ApplicationStatus = 'pending' | 'applied' | 'rejected' | 'interview';

interface ApplicationRecord {
  id: string;
  jobExternalId: string;
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobUrl: string;
  status: ApplicationStatus;
  notes: string;
  tailoredResumeId: string | null;
  emailDraft: string;
  appliedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ApplicationsListResponse {
  success: boolean;
  databaseConnected: boolean;
  count: number;
  items: ApplicationRecord[];
}

interface UpdateApplicationResponse {
  success: boolean;
  databaseConnected: boolean;
  application: ApplicationRecord;
}

const ApplicationsPage: React.FC = () => {
  const [items, setItems] = useState<ApplicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadApplications = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/applications');
      const data = (await response.json()) as ApplicationsListResponse | { error: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to load applications');
      }

      setItems(data.items);
      setMessage(`Loaded ${data.count} applications`);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unexpected load error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const statusCounts = useMemo(() => {
    return {
      pending: items.filter((item) => item.status === 'pending').length,
      applied: items.filter((item) => item.status === 'applied').length,
      rejected: items.filter((item) => item.status === 'rejected').length,
      interview: items.filter((item) => item.status === 'interview').length,
    };
  }, [items]);

  const handleStatusUpdate = async (id: string, status: ApplicationStatus) => {
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as UpdateApplicationResponse | { error: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to update status');
      }

      setItems((previous) => previous.map((item) => (item.id === id ? data.application : item)));
      setMessage(`Updated status to ${status}`);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unexpected update error');
    }
  };

  return (
    <div className="job-search-page">
      <div className="job-search-content">
        <div className="panel-card job-carousel-panel">
          <div className="resume-parser-header">
            <h2>Application Dashboard</h2>
            <p>Track pending, applied, interview, and rejected applications.</p>
          </div>

          <div className="application-stats-grid">
            <div className="application-stat-card">
              <h4>Pending</h4>
              <p>{statusCounts.pending}</p>
            </div>
            <div className="application-stat-card">
              <h4>Applied</h4>
              <p>{statusCounts.applied}</p>
            </div>
            <div className="application-stat-card">
              <h4>Interview</h4>
              <p>{statusCounts.interview}</p>
            </div>
            <div className="application-stat-card">
              <h4>Rejected</h4>
              <p>{statusCounts.rejected}</p>
            </div>
          </div>

          <div className="job-search-actions">
            <button type="button" className="resume-action-btn" onClick={loadApplications} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {message && <p className="resume-helper-text">{message}</p>}
          {error && <p className="resume-error">{error}</p>}
        </div>

        <div className="panel-card">
          <div className="job-list-header">
            <h2>Application History</h2>
            <span>{items.length} records</span>
          </div>

          <div className="application-list">
            {items.length === 0 && !isLoading && (
              <p className="resume-helper-text">No applications yet. Apply from Job Search page first.</p>
            )}

            {items.map((item) => (
              <div key={item.id} className="application-item">
                <div className="application-main">
                  <h3>{item.jobTitle}</h3>
                  <p>{item.jobCompany} • {item.jobLocation || 'N/A'}</p>
                  {item.appliedAt && <p>Applied at: {new Date(item.appliedAt).toLocaleString()}</p>}
                </div>

                <div className="application-meta">
                  <span className={`application-status status-${item.status}`}>{item.status}</span>
                  <select
                    value={item.status}
                    onChange={(event) => {
                      void handleStatusUpdate(item.id, event.target.value as ApplicationStatus);
                    }}
                  >
                    <option value="pending">pending</option>
                    <option value="applied">applied</option>
                    <option value="interview">interview</option>
                    <option value="rejected">rejected</option>
                  </select>
                  {item.jobUrl && (
                    <a href={item.jobUrl} target="_blank" rel="noreferrer" className="content-panel-link">
                      Job Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
