# CSS Design System - Modern Card Architecture

## Current State Analysis

Your React components have 2 card types:
1. **SystemCard** - Educational content with principles, good styling (Tailwind-inspired)
2. **ProfileCard** - User profile info, minimal CSS with inline styles (needs enhancement)

## Recommended CSS Architecture

### 1. Modern Card Pattern (Mobile-First)

Instead of separate files, use a unified design system with CSS variables and utility classes.

**Advantages:**
- Consistent spacing, colors, shadows across all cards
- Easy theme switching (dark/light mode)
- Reusable component classes
- Better maintainability

---

## Proposed CSS Structure

### File: `src/styles/variables.css`
```css
/* Color Palette */
:root {
  /* Primary Colors */
  --color-primary: #667eea;
  --color-primary-dark: #5568d3;
  --color-primary-light: #8495f7;

  /* Neutral Colors */
  --color-text-primary: #2d3748;
  --color-text-secondary: #4a5568;
  --color-text-muted: #718096;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f7fafc;
  --color-bg-tertiary: #edf2f7;

  /* Border & Shadow */
  --color-border: #e2e8f0;
  --color-border-dark: #cbd5e0;

  /* Status Colors */
  --color-success: #48bb78;
  --color-warning: #ed8936;
  --color-danger: #f56565;
  --color-info: #4299e1;

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.2);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

### File: `src/styles/cards.css`
```css
/* Base Card Component */
.card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.card-header-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.card-header-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* Card Body */
.card-body {
  margin-bottom: var(--space-md);
}

.card-body-text {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-md) 0;
}

/* Card Section */
.card-section {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

.card-section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-lg) 0;
}

/* List Items */
.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-list-item {
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);
  transition: all var(--transition-fast);
}

.card-list-item:hover {
  background-color: var(--color-bg-tertiary);
  padding-left: calc(var(--space-md) + 4px);
}

.card-list-item-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-sm) 0;
}

.card-list-item-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Card Footer */
.card-footer {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

.card-footer-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.card-footer-link:hover {
  color: var(--color-primary-dark);
  gap: var(--space-md);
}
```

---

## Component Implementations

### SystemCard - New Version
```tsx
// src/components/SystemCard/SystemCard.tsx
import React from 'react';
import '../../../styles/cards.css';

interface PrincipleItem {
  name: string;
  details: string;
  gifPath?: string;
}

interface SystemCardProps {
  title: string;
  description: string;
  principles: PrincipleItem[];
}

const SystemCard: React.FC<SystemCardProps> = ({
  title,
  description,
  principles
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-header-title">{title}</h2>
        </div>
      </div>

      <div className="card-body">
        <p className="card-body-text">{description}</p>
      </div>

      <div className="card-section">
        <h3 className="card-section-title">Core Principles</h3>
        <ul className="card-list">
          {principles.map((principle, idx) => (
            <li key={idx} className="card-list-item">
              <div className="card-list-item-title">
                {principle.name}
              </div>
              <p className="card-list-item-text">
                {principle.details}
              </p>
              {principle.gifPath && (
                <img
                  src={principle.gifPath}
                  alt={`${principle.name} illustration`}
                  style={{
                    marginTop: 'var(--space-md)',
                    maxWidth: '100%',
                    borderRadius: 'var(--radius-md)',
                    display: 'block'
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SystemCard;
```

### ProfileCard - New Version
```tsx
// src/components/ProfileCard/ProfileCard.tsx
import React from 'react';
import '../../../styles/cards.css';

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ProfileCardProps {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  professionalSummary: string;
  skills: string[];
  experience: ExperienceItem[];
  socialLinks: {
    linkedIn: string;
    github: string;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  location,
  email,
  phone,
  professionalSummary,
  skills,
  experience,
  socialLinks,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-header-title">{name}</h2>
          <h3 className="card-header-subtitle">{title}</h3>
        </div>
        <div className="card-footer">
          <a
            href={socialLinks.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="card-footer-link"
            title="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="card-footer-link"
            title="GitHub"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="card-body">
        <div className="card-list-item">
          <div className="card-list-item-title">Location</div>
          <p className="card-list-item-text">{location}</p>
        </div>
        <div className="card-list-item">
          <div className="card-list-item-title">Contact</div>
          <p className="card-list-item-text">{email} | {phone}</p>
        </div>
      </div>

      <div className="card-section">
        <h3 className="card-section-title">Professional Summary</h3>
        <p className="card-body-text">{professionalSummary}</p>
      </div>

      <div className="card-section">
        <h3 className="card-section-title">Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {experience.length > 0 && (
        <div className="card-section">
          <h3 className="card-section-title">Experience</h3>
          <ul className="card-list">
            {experience.map((exp, idx) => (
              <li key={idx} className="card-list-item">
                <div className="card-list-item-title">
                  {exp.role} at {exp.company}
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                  {exp.duration}
                </p>
                <p className="card-list-item-text">{exp.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
```

---

## Design Tokens Reference

| Token | Value | Use Case |
|-------|-------|----------|
| `--color-primary` | #667eea | Primary buttons, highlights, borders |
| `--color-text-primary` | #2d3748 | Main headings, body text |
| `--color-text-secondary` | #4a5568 | Secondary text, descriptions |
| `--color-bg-primary` | #ffffff | Card backgrounds |
| `--color-bg-secondary` | #f7fafc | List item backgrounds |
| `--space-md` | 1rem | Standard padding/margin |
| `--radius-lg` | 12px | Card border radius |
| `--shadow-md` | 0 2px 8px rgba(0,0,0,0.1) | Card elevation |

---

## Benefits of This Approach

1. **Consistency**: All cards use the same spacing, colors, shadows
2. **Maintainability**: Change colors in one place, affects all cards
3. **Scalability**: Easy to add new card types using existing classes
4. **Dark Mode Ready**: Add `@media (prefers-color-scheme: dark)` to variables.css
5. **Responsive**: Mobile-first design with flexible layout
6. **Performance**: CSS variables are more efficient than repeated values
7. **Accessibility**: Better contrast ratios, semantic HTML

---

## Migration Steps

1. Create `src/styles/variables.css` with design tokens
2. Create `src/styles/cards.css` with card components
3. Update `src/components/SystemCard/SystemCard.tsx` (remove old CSS)
4. Update `src/components/ProfileCard/ProfileCard.tsx` (remove old CSS)
5. Delete old CSS files: `SystemCard.css`, `ProfileCard.css`
6. Import new styles in components: `import '../../../styles/cards.css'`

---

## Example Usage in New Cards

Any new card component can now just use:
```tsx
<div className="card">
  <div className="card-header">
    <h2 className="card-header-title">Card Title</h2>
  </div>
  <div className="card-body">
    <p className="card-body-text">Content here</p>
  </div>
</div>
```

No need to create separate CSS files!
