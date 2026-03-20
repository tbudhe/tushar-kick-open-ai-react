import contentRegistryData from './content-registry.json';

export type ContentLine = string | { text: string; link: { url: string; text: string } };

export interface DrawerContent {
  lines: ContentLine[];
}

export const contentRegistry: Record<string, DrawerContent> = contentRegistryData as Record<string, DrawerContent>;
