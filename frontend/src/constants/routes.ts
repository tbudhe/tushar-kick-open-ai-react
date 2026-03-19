export const appRoutes = {
  home: '/solutions',
  contact: '/contact',
  userHub: '/contact',
  aiStudio: '/ai-engine',
  systemDesign: '/architecture',
  mlPlaybooks: '/playbooks',
  technicalProfile: '/engineer-profile',
  // Career Automation — routes exist but are disabled in App.tsx
  jobSearch: '/job-search',
  applications: '/applications',
} as const;

export const legacyRedirectRoutes = {
  root: '/',
  userHub: '/user-hub',
  profile: '/profile',
  contactLegacy: '/contact-us',
  aiStudio: '/ai',
  systemDesign: '/system',
  mlPlaybooks: '/practice-ml',
} as const;

export const menuLabels = {
  home: 'Solutions',
  contact: 'Contact',
  userHub: 'Contact',
  aiStudio: 'AI Engine',
  aiCoreTech: 'Core Tech',
  systemDesign: 'Architecture',
  mlPlaybooks: 'Playbooks',
  technicalProfile: 'Engineer Profile',
  careerHubInactive: 'Career Automation (Soon)',
} as const;

export const navTargets = {
  aiCoreTech: `${appRoutes.aiStudio}#core-tech-index`,
  playbooksIndex: `${appRoutes.mlPlaybooks}#playbooks-index`,
  architectureIndex: `${appRoutes.systemDesign}#architecture`,
  contactBusiness: `${appRoutes.contact}?context=business`,
  contactTechnical: `${appRoutes.contact}?context=technical`,
} as const;

export type SidebarMenuContext = 'business' | 'technical';
export type SidebarMenuItemId =
  | 'solutions'
  | 'ai-engine'
  | 'contact'
  | 'engineer-profile'
  | 'architecture'
  | 'core-tech'
  | 'playbooks';

export interface SidebarMenuItem {
  id: SidebarMenuItemId;
  label: string;
  to: string;
}

export const sidebarNavigationConfig: Record<SidebarMenuContext, SidebarMenuItem[]> = {
  business: [
    { id: 'solutions', label: menuLabels.home, to: appRoutes.home },
    { id: 'ai-engine', label: menuLabels.aiStudio, to: appRoutes.aiStudio },
    { id: 'contact', label: menuLabels.contact, to: navTargets.contactBusiness },
  ],
  technical: [
    { id: 'engineer-profile', label: menuLabels.technicalProfile, to: appRoutes.technicalProfile },
    { id: 'architecture', label: menuLabels.systemDesign, to: appRoutes.systemDesign },
    { id: 'core-tech', label: menuLabels.aiCoreTech, to: navTargets.aiCoreTech },
    { id: 'playbooks', label: menuLabels.mlPlaybooks, to: navTargets.playbooksIndex },
    { id: 'contact', label: menuLabels.contact, to: navTargets.contactTechnical },
  ],
};
