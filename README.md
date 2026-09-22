# rythdg.github.io

Ryth Dasgupta's personal website. A [Jekyll](https://jekyllrb.com/) site built and
deployed to GitHub Pages by GitHub Actions on every push to `main`.

**Publishing a post is: write Markdown → commit → push.** You never touch HTML.

This README is written for two audiences at once: a human who wants to add a
blog post, and an AI coding agent asked to do the same thing on the human's
behalf. If you're an agent: read this whole file before editing anything — it
documents conventions that aren't obvious from any single file in isolation
(the `?from=` query param trick, how front matter drives the cards, etc).

---

## 1. The publishing workflow

```
./bin/newpost "What Model Identifiability Actually Means"
        ↓
_posts/2026-09-22-what-model-identifiability-actually-means.md
        ↓
write Markdown, fill in the front matter
        ↓
git commit && git push
        ↓
GitHub Actions builds the site
        ↓
https://rythdg.github.io/
```

`bin/newpost` creates the file with the date, slug, and front matter already
populated, and prints the path. That's the only command you need.

One `.md` file in `_posts/` produces three things automatically:

1. A full post page at `/posts/<slug>/`
2. A card on the **Blog** page (whole card links to the post)
3. A card on the **Research** page (with its links column)

## 2. Repository layout

```
_config.yml           Site settings: title, nav order, permalink style
Gemfile               Jekyll dependency

_layouts/
  default.html        The page shell: <head>, nav, <main>, footer
  page.html           A normal page — renders `title` as <h1>, then content
  post.html           A post — back link, <h1>, content, auto References list

_includes/
  nav.html            Nav links, generated from `nav:` in _config.yml
  project-card.html   One Research/Blog card (both variants live here)
  figure.html         An inline figure with a caption

_posts/               THE BLOG. One Markdown file per post (§3)
  2026-07-30-project-one.md
  ...

index.md              Home
about.md              About
research.html         Research listing — loops over site.posts
blog.html             Blog listing — loops over site.posts
contact.html          Contact info (email, GitHub, CV)

css/style.css         The one stylesheet, used by every page
assets/
  img/                thumb-1.svg ... thumb-4.svg — placeholders, swap for real images
  js/post-back.js     Makes a post's "back" link context-aware (§5)
files/
  Ryth-Dasgupta-CV.pdf   Linked from contact.html

bin/newpost           Creates a new post file (§1)
.github/workflows/pages.yml   Build + deploy on push to main
```

Shared chrome (nav, footer, `<head>`) lives **only** in `_layouts/default.html`.
To add a nav link, add it to `nav:` in `_config.yml` — nothing else.

**Design language** (already in `css/style.css`, don't fight it): PT Sans font,
pure white background, black text, headings left-aligned, body paragraphs
justified, nav centered, content column capped at `680px` and centered,
responsive via `max-width: 600px` / `max-width: 480px` breakpoints.

## 3. Writing a post

Run `./bin/newpost "Your Title"`, then edit the file it creates.

### 3.1 Front matter

```yaml
---
title: "Research Project One"
date: 2026-07-30
description: "One or two sentences — the teaser shown on the Research and Blog cards."
thumbnail: /assets/img/thumb-1.svg
tags: [biology, modelling]
links:
  publication: "https://doi.org/..."
  github: "https://github.com/rythdg/..."
references:
  - text: "Author, A. (2024). Title. Journal, 12(3), 45-67."
    url: "https://doi.org/..."
  - text: "A reference with no link at all."
---
```

Field by field:

- **`title`** — required. The post's `<h1>` and the card's `<h2>`.
- **`date`** — required (the filename date must match). Posts are listed
  newest first on both Research and Blog.
- **`description`** — required. The card teaser, 1–3 sentences. Inline HTML
  is allowed here if you need emphasis.
- **`thumbnail`** — required. Root-relative path, e.g. `/assets/img/foo.jpg`.
  Any size — CSS crops it to a 90×90 box on desktop, a full-width 160px strip
  on mobile. Put new images in `assets/img/`.
- **`tags`** — optional, free-form. Stored but not displayed anywhere yet.
- **`links`** — optional. Shown **only** on the Research card's right-hand
  column. Recognized keys: `publication`, `github`, `project`. **Only keys you
  actually provide render** — that's how a project with no paper yet simply
  shows fewer links. A "Blog Post" link to the post itself is always added
  first, automatically.
- **`references`** — optional list of `{ text, url? }`. Rendered as a numbered
  bibliography under a "References" heading at the bottom of the post page,
  and omitted entirely when absent. `url` is optional per entry. Not shown on
  cards.

### 3.2 The body

Plain Markdown. `##` gives you a section heading, blank-line-separated
paragraphs get justified automatically. Don't add inline styles.

For a figure with a caption, use the include (not raw `<img>`):

```liquid
{% include figure.html src="/assets/img/my-figure.png" alt="Describe it for accessibility" caption="Figure 1. What this shows." %}
```

`caption` is optional. Number figures yourself in the caption text — there's no
auto-numbering.

## 4. Editing the other pages

- **Home / About** (`index.md`, `about.md`) — plain Markdown, just edit them.
- **Contact** (`contact.html`) — a `<ul class="contact-list">` of
  `<span class="contact-label">Label</span> <a href="...">value</a>` pairs.
  Copy an `<li>` to add a channel. To update the CV, replace
  `files/Ryth-Dasgupta-CV.pdf` keeping the same filename.
- **Research / Blog** (`research.html`, `blog.html`) — only the intro
  paragraph is hand-written; the cards come from `_posts/`. You shouldn't need
  to touch these.

## 5. The back-link mechanism (`?from=`)

The "← Back to ..." link at the top of a post isn't hardcoded — a post can be
reached from either listing, so the link follows where you came from.

- The card includes append `?from=research` or `?from=blog` to the post URL.
- `assets/js/post-back.js` reads that param and rewrites the `#post-back`
  anchor, using the `data-research-url` / `data-blog-url` attributes that
  `_layouts/post.html` renders onto it.
- The hardcoded `href` in the layout is the no-JS fallback.

This all lives in the layout, so new posts get it for free.

## 6. Previewing locally

Unlike the old plain-HTML version of this site, there **is** a build step now,
so you can't just open a file in the browser. Run the dev server:

```bash
bundle install          # first time only
bundle exec jekyll serve
```

Then open <http://127.0.0.1:4000/>. It rebuilds on save.

Needs Ruby 3.x (`brew install ruby`); macOS's system Ruby 2.6 is too old for
Jekyll 4.

## 7. Publishing

Push to `main`. `.github/workflows/pages.yml` builds the site and deploys it;
the change is live in a minute or two. There is no staging environment.

```bash
git add -A
git commit -m "Add post on model identifiability"
git push
```

> **One-time setup:** in the repo's **Settings → Pages**, *Build and
> deployment → Source* must be set to **GitHub Actions** (not "Deploy from a
> branch"). Without that, GitHub ignores the workflow and keeps serving the old
> branch contents.

## 8. Future / optional: a GUI for non-technical edits

Everything above assumes editing files directly. If a drag-and-drop editing
experience is ever wanted — especially for uploading images without touching
Git — Decap CMS (free, open-source) drops onto this exact structure and is
designed for Jekyll's `_posts` + front matter model. Ask for it if/when it's
wanted; it hasn't been set up yet.
