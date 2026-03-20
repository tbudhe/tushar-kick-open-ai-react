#!/usr/bin/env python3
"""Fix content-registry.ts to use JSON import instead of inline data."""

content = """\
import contentRegistryData from './content-registry.json';

export type ContentLine = string | { text: string; link: { url: string; text: string } };

export interface DrawerContent {
  lines: ContentLine[];
}

export const contentRegistry: Record<string, DrawerContent> = contentRegistryData as Record<string, DrawerContent>;
"""

target = "/Users/tusharbudhe/Documents/git-repos/tushar-kick-open-ai-react/frontend/src/constants/content-registry.ts"
with open(target, "w") as f:
    f.write(content)
print(f"Written {len(content.splitlines())} lines to content-registry.ts")
