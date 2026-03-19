import React from 'react';
import { TechnicalNavItem } from '../../constants/technical-navigation';
import { contentRegistry, ContentLine } from '../../constants/content-registry';

interface ContentDrawerProps {
  item: TechnicalNavItem | null;
  onClose: () => void;
}

const ComplexityColor: Record<string, string> = {
  Foundational: 'resource-level-foundational',
  Intermediate: 'resource-level-intermediate',
  Advanced: 'resource-level-advanced',
};

function renderLine(line: ContentLine, index: number) {
  if (typeof line === 'string') {
    // Bold the label before the first colon for readability
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      return (
        <li key={index}>
          <strong>{line.slice(0, colonIdx + 1)}</strong>
          {line.slice(colonIdx + 1)}
        </li>
      );
    }
    return <li key={index}>{line}</li>;
  }
  return (
    <li key={index}>
      {line.text}
      <a
        href={line.link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="content-drawer-link"
      >
        {line.link.text}
      </a>
    </li>
  );
}

const ContentDrawer: React.FC<ContentDrawerProps> = ({ item, onClose }) => {
  const isOpen = item !== null;
  const content = item ? (contentRegistry[item.id] ?? null) : null;

  // Escape key closes the drawer
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Scroll-lock the body while drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="content-drawer-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-over panel */}
      <aside
        className={`content-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={item?.title ?? 'Detail panel'}
        aria-hidden={!isOpen}
      >
        {item && (
          <>
            <div className="content-drawer-header">
              <div className="content-drawer-header-info">
                <h2 className="content-drawer-title">{item.title}</h2>
                <p className="content-drawer-summary">{item.summary}</p>
                <div className="content-drawer-meta">
                  <span className={`resource-level ${ComplexityColor[item.complexity] ?? ''}`}>
                    {item.complexity}
                  </span>
                  {item.tags.map((tag) => (
                    <span key={tag} className="resource-badge">
                      {tag}
                    </span>
                  ))}
                  <span className="content-drawer-read-time">{item.readTimeMin} min read</span>
                </div>
              </div>
              <button
                type="button"
                className="content-drawer-close"
                onClick={onClose}
                aria-label="Close detail panel"
              >
                ✕
              </button>
            </div>

            <div className="content-drawer-body">
              {content ? (
                <ul className="content-drawer-list">
                  {content.lines.map((line, index) => renderLine(line, index))}
                </ul>
              ) : (
                <p className="content-drawer-empty">
                  Detailed content not yet available for this topic.
                </p>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default ContentDrawer;
