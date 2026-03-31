import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Video } from '../../types/video';

interface VideoHubProps {
  videos: Video[];
  onSelect: (video: Video) => void;
  selectedId: string | null;
}

const VideoHub: React.FC<VideoHubProps> = ({ videos, onSelect, selectedId }) => {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [videos, query]);

  return (
    <section className="technical-resource-hub" id="videos-hub">
      <div className="technical-resource-hub-header">
        <h1>Business Videos</h1>
        <p>
          Strategy, leadership, and AI conversations from{' '}
          <a
            href="https://www.youtube.com/@YUBoardroom"
            target="_blank"
            rel="noopener noreferrer"
            className="video-hub-channel-link"
          >
            @YUBoardroom
          </a>
          .
        </p>
      </div>

      <div className="technical-resource-toolbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos or tags"
          aria-label="Search business videos"
        />
      </div>

      <div className="technical-resource-table-wrap">
        <table className="technical-resource-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Host</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((video) => (
              <tr
                key={video.videoId}
                className={`technical-resource-row clickable${selectedId === video.videoId ? ' podcast-row-active' : ''}`}
                onClick={() => onSelect(video)}
              >
                <td>
                  <button
                    type="button"
                    className="technical-resource-link"
                    onClick={(e) => { e.stopPropagation(); onSelect(video); }}
                  >
                    {video.title}
                  </button>
                </td>
                <td>
                  <span className="podcast-guest-name">{video.hostName ?? '—'}</span>
                  {video.hostLinkedIn && (
                    <a
                      href={video.hostLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="podcast-guest-linkedin"
                      aria-label={`${video.hostName} on LinkedIn`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LinkedInIcon style={{ width: 14, height: 14 }} />
                    </a>
                  )}
                </td>
                <td>
                  <span className="resource-badge">{video.category}</span>
                </td>
                <td>
                  <div className="resource-badges">
                    {video.tags.map((tag) => (
                      <span key={tag} className="resource-badge">{tag}</span>
                    ))}
                  </div>
                </td>
                <td>{video.publishedAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="technical-resource-empty">No videos match this search.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VideoHub;
