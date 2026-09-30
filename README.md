# Jack Zhou: Portfolio

A static personal site built with React, TypeScript, and Vite. There's no backend: every
word on the page comes from `src/content.ts`, and the build output is plain HTML, CSS, and JS.

## Project layout

```
src/
  content.ts             ← all site copy lives here
  components/            one small component per section
  sim/
    purePursuit.ts       the pure pursuit demo (no DOM, unit tested)
    purePursuit.test.ts  vitest suite
    render.ts            canvas drawing for the demo
  hooks/useTheme.ts      light/dark toggle
  styles/global.css      colors, typography, layout
public/                  resume PDF, favicon, images/
```

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

### Checks

```bash
npm test            # pure pursuit tests
npm run build       # type-checks, then builds to dist/
```

## Editing content

- **Text:** everything is in `src/content.ts`. Inline links are written as
  `[label](https://…)`.
- **Photos:** put files in `public/images/` and set `src: "/images/<file>"` on
  `profile.photo` or a project's `photo`. Without a `src`, an empty labelled frame shows.
- **Resume:** replace `public/Jack_Zhou_Resume.pdf`.
- **Pure pursuit demo:** path shape, speed, and lookahead are in `src/sim/purePursuit.ts`.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repo.
3. Vercel detects Vite automatically (build command `npm run build`, output `dist`).
   Click **Deploy**.

Every push to `main` redeploys, and pull requests get their own preview URLs. The
"last updated" date in the footer is set at build time, so it updates on every deploy.

Because the output is static, it also works as-is on Netlify, Cloudflare Pages, or GitHub
Pages.
