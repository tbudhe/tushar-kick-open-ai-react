#!/usr/bin/env python3
"""Fix technical-navigation.ts to use JSON import instead of inline data."""

content = """\
import { appRoutes } from './routes';
import rawNavData from './technical-navigation-data.json';

export type TechnicalCategory = 'core-tech' | 'playbooks' | 'architecture';
export type ComplexityLevel = 'Foundational' | 'Intermediate' | 'Advanced';

export interface TechnicalNavItem {
  id: string;
  title: string;
  category: TechnicalCategory;
  isTechnical: true;
  path: string;
  summary: string;
  tags: string[];
  complexity: ComplexityLevel;
  readTimeMin: number;
  updatedLabel: string;
}

interface TechnicalCategoryMeta {
  title: string;
  subtitle: string;
}

export const technicalCategoryMeta: Record<TechnicalCategory, TechnicalCategoryMeta> = {
  'core-tech': {
    title: 'Core Tech',
    subtitle: 'Foundational algorithm and optimization concepts mapped to practical engineering trade-offs.',
  },
  playbooks: {
    title: 'Playbooks',
    subtitle: 'End-to-end ML case studies (Visual Search, Street View Blurring, GCP AI path) with business objectives, system components, success metrics, and interview-ready architecture breakdowns.',
  },
  architecture: {
    title: 'Architecture',
    subtitle: 'Production system patterns grouped by layer: Foundation, Design & APIs, Backend & Storage, and DevOps.',
  },
};

function buildPath(category: TechnicalCategory, id: string): string {
  if (category === 'core-tech') return `${appRoutes.aiStudio}#${id}`;
  if (category === 'playbooks') return `${appRoutes.mlPlaybooks}#${id}`;
  return appRoutes.systemDesign;
}

export const technicalNavigationConfig: TechnicalNavItem[] = rawNavData.map((item) => ({
  ...item,
  category: item.category as TechnicalCategory,
  complexity: item.complexity as ComplexityLevel,
  isTechnical: true as const,
  path: buildPath(item.category as TechnicalCategory, item.id),
}));

export const getTechnicalNavItemsByCategory = (
  category: TechnicalCategory
): TechnicalNavItem[] => technicalNavigationConfig.filter((item) => item.category === category);

export const matchesTechnicalSearch = (item: TechnicalNavItem, query: string): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return (
    item.title.toLowerCase().includes(normalized) ||
    item.summary.toLowerCase().includes(normalized) ||
    item.tags.some((tag) => tag.toLowerCase().includes(normalized))
  );
};
"""

target = "/Users/tusharbudhe/Documents/git-repos/tushar-kick-open-ai-react/frontend/src/constants/technical-navigation.ts"
with open(target, "w") as f:
    f.write(content)
print(f"Written {len(content.splitlines())} lines to technical-navigation.ts")
