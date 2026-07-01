export const siteConfig = {
  name: 'endlevel',
  handle: 'endlevel',
  tagline: 'a passionate tech enthusiast',
  description:
    'A high school student exploring Linux, DevOps, sysadmin work, software engineering, and low-level programming.',
  siteUrl: import.meta.env.SITE_URL ?? 'https://endlevel.tech',
  defaultOgImage: '/og-card.png',
  defaultOgImageAlt: 'endlevel portfolio preview card with a Catppuccin Mocha TUI layout.',
  email: 'me@endlevel.tech',
  githubName: 'endlevell',
  githubUrl: 'https://github.com/endlevell',
  discord: 'endlevel',
  bio: [
    'I am a high school student with a strong enthusiasm for the technology scene, especially the layers that make computers feel understandable instead of magical.',
    'Most of my time goes into Linux, DevOps, sysadmin work, software engineering, and low-level programming. I like taking systems apart, rebuilding them, and learning where the sharp edges are.',
    'This site is my public workspace for projects, notes, experiments, and the small technical lessons that come from tinkering with things until they finally make sense.',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
