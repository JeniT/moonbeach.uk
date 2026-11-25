// Wording used in more than one place. Change it here and every page that shows it follows.

/** Under "About me", and in the sidebar of every post. */
export const tagline = 'Design director, games master, London.';

/** The blog's description, on the blog page and at the end of every post. */
export const blogLede = 'What thirty years of making video games has taught me, notes from the tabletop, and things worth a look.';

/** The doors on the home page, reused at the end of posts. */
export const doors = {
  'video-games': { href: '/video-games/', title: 'Video Games', text: 'Thirty years designing and directing games, from Duke Nukem 64 to Life is Strange.', action: 'See the work' },
  tabletop: { href: '/tabletop/', title: 'Tabletop', text: 'Long campaigns run online: D&D, World of Darkness, and narrative indie games.', action: 'Join a table' },
  blog: { href: '/blog/', title: 'Blog', text: blogLede, action: 'All posts' },
} as const;
