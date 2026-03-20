import React from 'react';
import { Podcast } from '../../types/podcast';

interface PodcastDrawerProps {
  podcast: Podcast | null;
  onClose: () => void;
}

const YouTubeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8.1-3.2 1.7-4.8 4.9-4.9C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
  </svg>
);

function getYouTubeEmbedId(url: string): string {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

const PodcastDrawer: React.FC<PodcastDrawerProps> = ({ podcast, onClose }) => {
  const isOpen = podcast !== null;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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

  // Reset play state when podcast changes
  React.useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [podcast?.id]);

  const handleAudioToggle = () => {
    if (!audioRef.current || !podcast?.audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const embedId = podcast ? getYouTubeEmbedId(podcast.video.youtubeFullUrl) : '';

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
        aria-label={podcast?.topic ?? 'Podcast detail'}
        aria-hidden={!isOpen}
      >
        {podcast && (
          <>
            {/* Header */}
            <div className="content-drawer-header">
              <div className="content-drawer-header-info">
                <h2 className="content-drawer-title">{podcast.topic}</h2>
                <p className="content-drawer-summary">{podcast.summary}</p>
                <div className="content-drawer-meta">
                  {podcast.tags.map((tag) => (
                    <span key={tag} className="resource-badge">{tag}</span>
                  ))}
                  <span className="content-drawer-read-time">{podcast.updatedDate}</span>
                </div>
              </div>
              <button
                type="button"
                className="content-drawer-close"
                onClick={onClose}
                aria-label="Close podcast panel"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="content-drawer-body">

              {/* Video embed */}
              {embedId && (
                <div className="podcast-video-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${embedId}`}
                    title={podcast.topic}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="podcast-video-iframe"
                  />
                </div>
              )}

              {/* Transcript */}
              <div className="podcast-section">
                <div className="podcast-section-header">
                  <h3 className="podcast-section-title">Transcript</h3>
                  {podcast.audioUrl && (
                    <>
                      <audio ref={audioRef} src={podcast.audioUrl} onEnded={() => setIsPlaying(false)} />
                      <button
                        type="button"
                        className={`podcast-listen-btn${isPlaying ? ' playing' : ''}`}
                        onClick={handleAudioToggle}
                        aria-label={isPlaying ? 'Pause audio' : 'Listen to podcast'}
                      >
                        {isPlaying ? (
                          <>
                            <span className="podcast-listen-bars">
                              <span /><span /><span />
                            </span>
                            Pause
                          </>
                        ) : (
                          <>
                            <span className="podcast-listen-play">▶</span>
                            Listen
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
                <p className="podcast-transcript">{podcast.transcriptText}</p>
              </div>

              {/* Guest details */}
              <div className="podcast-section">
                <h3 className="podcast-section-title">Guest</h3>
                <div className="podcast-guest">
                  <span className="podcast-guest-name">{podcast.guest.name}</span>
                  <a
                    href={podcast.guest.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="podcast-guest-linkedin"
                    aria-label={`${podcast.guest.name} on LinkedIn`}
                  >
                    <LinkedInIcon />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>

              {/* Sites published */}
              {(podcast.video.youtubeFullUrl || podcast.video.youtubeShortsUrl || podcast.video.instagramUrl) && (
                <div className="podcast-section">
                  <h3 className="podcast-section-title">Published On</h3>
                  <div className="podcast-publish-links">
                    {podcast.video.youtubeFullUrl && (
                      <a
                        href={podcast.video.youtubeFullUrl.replace('/embed/', '/watch?v=')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="podcast-publish-link"
                      >
                        <YouTubeIcon />
                        YouTube Full Video
                      </a>
                    )}
                    {podcast.video.youtubeShortsUrl && (
                      <a
                        href={podcast.video.youtubeShortsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="podcast-publish-link"
                      >
                        <YouTubeIcon />
                        YouTube Shorts
                      </a>
                    )}
                    {podcast.video.instagramUrl && (
                      <a
                        href={podcast.video.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="podcast-publish-link"
                      >
                        <InstagramIcon />
                        Instagram Reels
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default PodcastDrawer;
