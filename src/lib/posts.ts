// Helpers shared by every list of blog posts and by the post page.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Tags that mean something on the site: each gets a label and its own filtered blog page. */
export const crafts = [
  { tag: 'video-games', label: 'Video games', href: '/blog/tag/video-games/' },
  { tag: 'tabletop', label: 'Tabletop', href: '/blog/tag/tabletop/' },
] as const;

/**
 * How a tag is shown. Any tag not listed here is shown with its hyphens as spaces
 * and a capital first letter ("game-design" reads "Game design"). Add a line here
 * to show a tag differently, e.g. 'ttrpg': 'Tabletop RPGs'.
 */
export const tagLabels: Record<string, string> = {
  'video-games': 'Video games',
  tabletop: 'Tabletop',
};

/** A tag as it appears in a web address: lower case, words joined by hyphens. */
export const tagSlug = (tag: string) => tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function tagLabel(tag: string) {
  const slug = tagSlug(tag);
  if (tagLabels[slug]) return tagLabels[slug];
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Every tag's page lives under /blog/tag/. */
export const tagHref = (tag: string) =>
  crafts.find((c) => c.tag === tagSlug(tag))?.href ?? `/blog/tag/${tagSlug(tag)}/`;

/** Published posts, newest first, optionally limited to one tag. */
export async function getPosts(tag?: string): Promise<Post[]> {
  const want = tag && tagSlug(tag);
  return (await getCollection('posts', ({ data }) => !data.draft && (!want || data.tags.some((t) => tagSlug(t) === want))))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Every tag used on a published post, as slugs, most used first. */
export async function allTags(): Promise<string[]> {
  const counts = new Map<string, number>();
  for (const p of await getPosts()) for (const t of p.data.tags) counts.set(tagSlug(t), (counts.get(tagSlug(t)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

/** The reflection to lead with: the newest one marked `featured`, otherwise the newest. */
export function leadOf(reflections: Post[]): Post | undefined {
  return reflections.find((p) => p.data.featured) ?? reflections[0];
}

export const craftsOf = (post: Post) => crafts.filter((c) => post.data.tags.some((t) => tagSlug(t) === c.tag));

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const plain = (md = '') =>
  md
    .replace(/^#+\s.*$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Minutes to read, at about 220 words a minute. */
export const readingTime = (post: Post) =>
  Math.max(1, Math.round(plain(post.body).split(' ').length / 220));

/** The summary, or the post's first sentence when there isn't one. */
export function summaryOf(post: Post): string {
  if (post.data.summary) return post.data.summary;
  const text = plain(post.body);
  const first = text.match(/^.{40,220}?[.!?](?=\s|$)/)?.[0] ?? text.slice(0, 200);
  return first.length < text.length && !/[.!?]$/.test(first) ? `${first}…` : first;
}

/** One line of facts about a post: date, crafts, reading time. */
export function metaLine(post: Post, opts: { crafts?: boolean; time?: boolean } = {}) {
  const parts = [fmtDate(post.data.date)];
  if (opts.crafts !== false) parts.push(...craftsOf(post).map((c) => c.label));
  if (opts.time !== false && post.data.kind === 'reflection') parts.push(`${readingTime(post)} min read`);
  return parts.join(' · ');
}

/** Each post shows its own part of the Piranesi plate. */
const focuses = ['18% 22%', '78% 18%', '40% 72%', '66% 58%', '52% 8%', '12% 88%', '88% 82%', '30% 45%'];
export function plateFocus(post: Post) {
  let h = 0;
  for (const ch of post.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return focuses[h % focuses.length];
}
