import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts: the blog. Add a Markdown file to src/content/posts/ to publish one.
// kind: 'reflection' for in-depth writing, 'journal' for quick "here's something cool" notes.
// tags: any words you like. 'video-games' posts also appear on the Video games page,
// and 'tabletop' posts on the Tabletop page.
const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['reflection', 'journal']).default('reflection'),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false), // lead with this reflection on the blog
    link: z.string().url().optional(),
    linkLabel: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Adventures: my own role-playing scenarios, published or in progress.
// comingSoon: true lists an adventure under 'Worlds in progress' without a page of its own.
const adventures = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/adventures' }),
  schema: z.object({
    title: z.string(),
    system: z.string(),
    status: z.enum(['Available', 'In playtest', 'In progress']),
    summary: z.string(),
    hook: z.array(z.string()).optional(),
    level: z.string().optional(),
    setting: z.string().optional(),
    players: z.string().optional(),
    cover: z.object({ src: z.string(), alt: z.string(), credit: z.string() }).optional(),
    map: z.object({ src: z.string(), alt: z.string(), caption: z.string() }).optional(),
    guide: z.object({
      href: z.string(),
      title: z.string(),
      pages: z.number(),
      size: z.string(),
      contents: z.array(z.string()),
    }).optional(),
    buyUrl: z.string().url().optional(),
    // Where it's sold, e.g. "DriveThruRPG". With buyUrl: "Buy it on DriveThruRPG"; without: "Coming soon to DriveThruRPG".
    store: z.string().optional(),
    comingSoon: z.boolean().default(false),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, adventures };
