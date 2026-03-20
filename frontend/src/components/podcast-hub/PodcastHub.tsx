import React from 'react';
import { Podcast } from '../../types/podcast';

interface PodcastHubProps {
  podcasts: Podcast[];
  onSelect: (podcast: Podcast) => void;
  selectedId: string | null;
}

const PodcastHub: React.FC<PodcastHubProps> = ({ podcasts, onSelect, selectedId }) => {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return podcasts;
    return podcasts.filter(
      (p) =>
        p.topic.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [podcasts, query]);

  return (
    <section className="technical-resource-hub" id="podcasts-hub">
      <div className="technical-resource-hub-header">
        <h1>Podcasts</h1>
        <p>AI and engineering conversations — with video, transcript, and guest connections.</p>
      </div>

      <div className="technical-resource-toolbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics or tags"
          aria-label="Search podcasts"
        />
      </div>

      <div className="technical-resource-table-wrap">
        <table className="technical-resource-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Summary</th>
              <th>Tags</th>
              <th>Guest</th>
              <th>Published On</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((podcast) => (
              <tr
                key={podcast.id}
                className={`technical-resource-row clickable${selectedId === podcast.id ? ' podcast-row-active' : ''}`}
                onClick={() => onSelect(podcast)}
              >
                <td>
                  <button
                    type="button"
                    className="technical-resource-link"
                    onClick={(e) => { e.stopPropagation(); onSelect(podcast); }}
                  >
                    {podcast.topic}
                  </button>
                </td>
                <td>{podcast.summary}</td>
                <td>
                  <div className="resource-badges">
                    {podcast.tags.map((tag) => (
                      <span key={tag} className="resource-badge">{tag}</span>
                    ))}
                  </div>
                </td>
                <td>{podcast.guest.name}</td>
                <td>
                  <div className="resource-badges">
                    {podcast.video.youtubeFullUrl && (
                      <span className="resource-badge">YouTube</span>
                    )}
                    {podcast.video.youtubeShortsUrl && (
                      <span className="resource-badge">Shorts</span>
                    )}
                    {podcast.video.instagramUrl && (
                      <span className="resource-badge">Instagram</span>
                    )}
                  </div>
                </td>
                <td>{podcast.updatedDate}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="technical-resource-empty">No podcasts match this search.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PodcastHub;
