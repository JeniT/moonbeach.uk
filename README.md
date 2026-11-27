# moonbeach.uk

Bill Beacham's personal site, built with [Astro](https://astro.build). Every page is plain HTML when published; there is no database or CMS.

## Running it locally

```bash
npm install
npm run dev        # preview at http://localhost:4321
npm run build      # writes the finished site to dist/
```

## Adding things

| To add… | Do this |
|---|---|
| A blog post | Copy `src/content/posts/_example.md`, rename it (e.g. `pacing-a-campaign.md`), edit the details at the top, set `draft: false`, and write underneath in Markdown. Use `kind: reflection` for in-depth writing and `kind: journal` for a quick note (the newest three are shown in full in the Journal band; add `link` and `linkLabel` to point at what it's about). The newest reflection leads the blog; add `featured: true` to lead with a different one. Add `tags: [video-games]` or `tags: [tabletop]` (or both) to show it on the Video games or Tabletop page, on the blog's /blog/tag/video-games/ or /blog/tag/tabletop/ page, and to choose where readers are sent at the end of the post. Any other tag (e.g. `tags: [video-games, game-design]`) gets its own page automatically at `/blog/tag/game-design/`, linked from the post's sidebar. Tags show with hyphens as spaces ("Game design"); to show one differently, add it to `tagLabels` in `src/lib/posts.ts`. The file name becomes the web address, under `/blog/`. |
| A downloadable file (e.g. a player's guide) | Put it in `public/downloads/` and add a `guide` block to the adventure (see `src/content/adventures/the-eldritch-earl.md`). |
| An adventure | Copy `src/content/adventures/_example.md` the same way. It appears on the For the table page. Set `comingSoon: true` to list it under "Worlds in progress" without a page of its own. Add `store: "DriveThruRPG"` to show "Coming soon to DriveThruRPG", then `buyUrl` once it's on sale to turn that into a "Buy it on DriveThruRPG" button. |
| A game to the portfolio | Edit `src/data/career.json`. `"featured": true` puts a title on the home page; `"note"` adds a line under it. A game with a `"detail"` block gets a panel that slides open on the Games page. |
| A picture printed in the site's four inks | `npm run ink -- path/to/picture.jpg` saves it to `public/art/picture.webp`. `--light 0.6` lightens it (default 0.72), `--width 900` sets the size. Best on engravings and line art. |
| A PDF exported from PowerPoint (e.g. a player's guide) | PowerPoint puts "Slide 3: " in front of every bookmark. On Windows, drag the PDF onto `Tidy a PDF.bat`; anywhere else, `npm run tidy-pdf -- "path/to/guide.pdf"`. It fixes the file in place (add a second file name to save a copy instead), then copy it into `public/downloads/`. |
| A screenshot or cover to a game panel | Put the image in `public/games/` and add `"image": { "src": "/games/file.jpg", "alt": "What it shows", "credit": "© Publisher" }` inside that game's `"detail"`. |

Files whose names start with `_` are ignored, so the examples never appear on the site.

## Publishing

The site is published to **https://moonbeach.uk** by GitHub Pages from a public repository. `.github/workflows/deploy.yml` builds it with Astro on every push to `main`. Day to day: commit and push in GitHub Desktop (see START HERE, step 8).

`.gitignore` keeps private and working files out of the public repository: `inspiration/` (CV and letters), `originals/` (pictures before ink printing), `.claude/`, the design brief and design system (`PRODUCT.md`, `DESIGN.md` and the design tool's copies), the design tool's review folders, `node_modules/` and `dist/`. Check it before adding anything private to the folder.

### One-time setup

1. **GitHub:** create the repository `moonbeach.uk` (public) under Bill's account and push this folder to it (GitHub Desktop: File → Add local repository → Publish repository, untick "Keep this code private").
2. **Pages:** in the repository, Settings → Pages → Build and deployment → Source: **GitHub Actions**. The first push then publishes to `https://<account>.github.io/moonbeach.uk/` while the domain is being set up (styles may look broken at that address; the custom domain fixes it).
3. **Custom domain:** Settings → Pages → Custom domain: `moonbeach.uk`, Save. Recommended first: verify the domain under the account's Settings → Pages, which adds one TXT record at Gandi.
4. **Gandi DNS** (Domain → DNS records), replacing any default records for `@` and `www`:
   - `@` A `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `@` AAAA `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www` CNAME `<account>.github.io.`
   Leave any MX (email) records alone.
5. Once GitHub shows the DNS check as passed (minutes to a few hours), tick **Enforce HTTPS**.

## Artwork

The header artwork is Piranesi's *The Drawbridge* (c.1750, public domain), re-printed in the site's four inks (originally by `.impeccable/reference/art/inks.py`; `npm run ink` in `scripts/ink.mjs` does the same without Python). Sources and licence notes are in `.impeccable/reference/art/SOURCES.md`.
