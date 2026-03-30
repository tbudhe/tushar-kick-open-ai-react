import React from 'react';
import { Video } from '../../types/video';

interface VideoDrawerProps {
  video: Video | null;
  onClose: () => void;
}

const YouTubeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
  </svg>
);

const VideoDrawer: React.FC<VideoDrawerProps> = ({ video, onClose }) => {
  const isOpen = video !== null;

  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="content-drawer-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`content-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={video?.title ?? 'Video detail'}
        aria-hidden={!isOpen}
      >
        {video && (
          <>
            {/* Header */}
            <div className="content-drawer-header">
              <div className="content-drawer-header-info">
                <h2 className="content-drawer-title">{video.title}</h2>
                <p className="content-drawer-summary">{video.channelName}</p>
                <div className="content-drawer-meta">
                  {video.tags.map((tag) => (
                    <span key={tag} className="resource-badge">{tag}</span>
                  ))}
                  <span className="resource-badge">{video.category}</span>
                  <span className="content-drawer-read-time">{video.publishedAt}</span>
                </div>
              </div>
              <button
                type="button"
                className="content-drawer-close"
                onClick={onClose}
                aria-label="Close video panel"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="content-drawer-body">

              {/* YouTube embed — only render if a valid embedUrl is present */}
              {video.embedUrl ? (
                <div className="podcast-video-wrap">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="podcast-video-iframe"
                  />
                </div>
              ) : (
                <div className="video-drawer-coming-soon">
                  <YouTubeIcon />
                  <p>Video coming soon</p>
                  <a
                    href="https://www.youtube.com/@YUBoardroom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="podcast-publish-link"
                  >
                    Visit @YUBoardroom on YouTube
                  </a>
                </div>
              )}

              {/* Description */}
              {video.description && (
                <div className="podcast-section">
                  <h3 className="podcast-section-title">About this video</h3>
                  <p className="podcast-transcript">{video.description}</p>
                </div>
              )}

              {/* Links */}
              <div className="podcast-section">
                <h3 className="podcast-section-title">Watch on YouTube</h3>
                <div className="podcast-publish-links">
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="podcast-publish-link"
                    aria-label="Watch on YouTube"
                  >
                    <YouTubeIcon />
                    Watch on YouTube
                  </a>
                  <a
                    href={`https://www.youtube.com/@YUBoardroom`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="podcast-publish-link"
                    aria-label="Visit YU Boardroom channel"
                  >
                    <YouTubeIcon />
                    Visit Channel
                  </a>
                </div>
              </div>

            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default VideoDrawer;
