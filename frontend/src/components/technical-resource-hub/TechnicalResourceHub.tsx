import React from 'react';
import {
  TechnicalCategory,
  TechnicalNavItem,
  getTechnicalNavItemsByCategory,
  matchesTechnicalSearch,
  technicalCategoryMeta,
} from '../../constants/technical-navigation';

interface TechnicalResourceHubProps {
  category: TechnicalCategory;
  onItemSelect?: (item: TechnicalNavItem) => void;
}

const complexityOptions: Array<TechnicalNavItem['complexity'] | 'All'> = [
  'All',
  'Foundational',
  'Intermediate',
  'Advanced',
];

const TechnicalResourceHub: React.FC<TechnicalResourceHubProps> = ({ category, onItemSelect }) => {
  const [query, setQuery] = React.useState('');
  const [complexity, setComplexity] = React.useState<TechnicalNavItem['complexity'] | 'All'>('All');

  const items = React.useMemo(() => getTechnicalNavItemsByCategory(category), [category]);

  const filteredItems = React.useMemo(
    () =>
      items.filter((item) => {
        if (complexity !== 'All' && item.complexity !== complexity) {
          return false;
        }

        return matchesTechnicalSearch(item, query);
      }),
    [items, complexity, query]
  );

  const categoryInfo = technicalCategoryMeta[category];

  return (
    <section className="technical-resource-hub" id={`${category}-hub`}>
      <div className="technical-resource-hub-header">
        <h1>{categoryInfo.title}</h1>
        <p>{categoryInfo.subtitle}</p>
      </div>

      <div className="technical-resource-toolbar">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search topics, tags, or key terms"
          aria-label="Search technical resources"
        />
        <select
          value={complexity}
          onChange={(event) =>
            setComplexity(event.target.value as TechnicalNavItem['complexity'] | 'All')
          }
          aria-label="Filter by complexity"
        >
          {complexityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="technical-resource-table-wrap">
        <table className="technical-resource-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Summary</th>
              <th>Signals</th>
              <th>Complexity</th>
              <th>Read</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={onItemSelect ? 'technical-resource-row clickable' : 'technical-resource-row'}
                onClick={() => onItemSelect?.(item)}
              >
                <td>
                  <button
                    type="button"
                    className="technical-resource-link"
                    onClick={(e) => { e.stopPropagation(); onItemSelect?.(item); }}
                  >
                    {item.title}
                  </button>
                </td>
                <td>{item.summary}</td>
                <td>
                  <div className="resource-badges">
                    {item.tags.map((tag) => (
                      <span key={tag} className="resource-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="resource-level">{item.complexity}</span>
                </td>
                <td>{item.readTimeMin} min</td>
                <td>{item.updatedLabel}</td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="technical-resource-empty">No resources match this filter yet.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TechnicalResourceHub;
