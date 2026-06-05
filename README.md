# NRITOUSA.com

A premium, SEO-focused content platform for NRIs and new immigrants in the USA — guides on finance, taxes, credit, housing, cars, investing, 401(k)/Roth IRA, India–US money transfers, buying property, community, and immigrant stories.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Production build                  |
| `npm run start` | Serve the production build        |
| `npm run lint`  | Lint with Next's ESLint config    |

## Project structure

```
src/
├── app/                      # App Router pages & routing
│   ├── layout.tsx            # Root layout (Navbar + Footer + global SEO)
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Tailwind + base styles
│   ├── not-found.tsx         # 404
│   ├── robots.ts             # robots.txt (generated)
│   ├── sitemap.ts            # sitemap.xml (generated)
│   ├── about/page.tsx
│   ├── topics/
│   │   ├── page.tsx          # All topics
│   │   └── [slug]/page.tsx   # Topic detail
│   └── articles/
│       └── [slug]/page.tsx   # Article detail (+ JSON-LD)
├── components/               # Reusable UI
│   ├── Navbar.tsx            # Responsive navbar (client)
│   ├── MobileMenu.tsx        # Mobile slide-down menu
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ArticleCard.tsx
│   ├── ArticleBody.tsx       # Light-markdown renderer
│   ├── TopicCard.tsx
│   ├── SectionHeading.tsx
│   ├── Container.tsx
│   └── Newsletter.tsx
├── lib/                      # Data + helpers
│   ├── topics.ts             # Topic definitions
│   ├── articles.ts           # Article content + queries
│   ├── site.ts               # Site-wide config (name, URLs, social)
│   └── format.ts             # Date / initials helpers
└── types/                    # Shared TypeScript types
    └── index.ts
```

## Content model

Topics and articles live in `src/lib/topics.ts` and `src/lib/articles.ts`. Articles use a tiny markdown subset (`## headings`, `- lists`, paragraphs) rendered by `ArticleBody`.

### Adding an article

Append an object to the `articles` array in `src/lib/articles.ts` with a unique `slug` and a `topic` that matches a topic slug. It automatically appears on the homepage, its topic page, related sections, and the sitemap.

### Scaling up

When content outgrows TypeScript files, swap `lib/articles.ts` for an MDX loader or a headless CMS — the components and pages read through the helper functions (`getArticle`, `getArticlesByTopic`, etc.), so the UI won't need to change.

## SEO features

- Per-page `metadata` (titles, descriptions, canonical URLs, Open Graph, Twitter cards)
- Clean, semantic URLs (`/topics/taxes`, `/articles/...`)
- `Article` JSON-LD structured data on every article
- Auto-generated `sitemap.xml` and `robots.txt`
- Statically generated topic & article pages (`generateStaticParams`)

> Update your production domain in `src/lib/site.ts`.

## Disclaimer

Content is educational and not financial, tax, or legal advice.
