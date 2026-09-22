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

## 1. Two independent things: posts and projects

**Blog posts and research projects are separate.** This is the single most
important thing to understand about this repo.

| | Lives in | Shows up on | Has its own page? |
|---|---|---|---|
| **Blog post** | `_posts/` | Blog | Yes, `/posts/<slug>/` |
| **Research project** | `_projects/` | Research | No — it's a card only |

- A blog post does **not** need to be about a research project. Most won't be.
  Write whatever you want; it appears on Blog and nowhere else.
- A research project does **not** need a blog post. A project with no writeup
  yet simply shows fewer links on its card.
- **Optionally**, a project can point at one post (§5.1). That's the only
  connection between the two, and it's one line of front matter.

## 2. The publishing workflow

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

`bin/newpost "Title"` scaffolds a blog post; `bin/newproject "Title"` scaffolds
a research entry. Both fill in the front matter and print the path. Those are
the only two commands you need.

## 3. Repository layout

```
_config.yml           Site settings: title, nav order, permalink, collections
Gemfile               Jekyll dependency

_layouts/
  default.html        The page shell: <head>, nav, <main>, footer
  page.html           A normal page — renders `title` as <h1>, then content
  post.html           A post — back link, <h1>, content, auto References list

_includes/
  nav.html            Nav links, generated from `nav:` in _config.yml
  post-card.html      One card on /blog/     (takes a post)
  research-card.html  One card on /research/ (takes a project)
  figure.html         An inline figure with a caption

_posts/               THE BLOG. One Markdown file per post (§4)
  2026-07-30-project-one.md
  ...

_projects/            RESEARCH ENTRIES. One Markdown file per project (§5).
  project-one.md       Front matter only — these render as cards, not pages.
  ...

index.md              Home
about.md              About
research.html         Research listing — loops over site.projects, sorted by `order`
blog.html             Blog listing — loops over site.posts, newest first
contact.html          Contact info (email, GitHub, CV)

css/style.css         The one stylesheet, used by every page
assets/
  img/                thumb-1.svg ... thumb-4.svg — placeholders, swap for real images
  js/post-back.js     Makes a post's "back" link context-aware (§7)
files/
  Ryth-Dasgupta-CV.pdf   Linked from contact.html

bin/newpost           Scaffolds a blog post in _posts/
bin/newproject        Scaffolds a research entry in _projects/
.github/workflows/pages.yml   Build + deploy on push to main
```

Shared chrome (nav, footer, `<head>`) lives **only** in `_layouts/default.html`.
To add a nav link, add it to `nav:` in `_config.yml` — nothing else.

**Design language** (already in `css/style.css`, don't fight it): PT Sans font,
pure white background, black text, headings left-aligned, body paragraphs
justified, nav centered, content column capped at `680px` and centered,
responsive via `max-width: 600px` / `max-width: 480px` breakpoints.

## 4. Writing a blog post

Run `./bin/newpost "Your Title"`, then edit the file it creates. This is all
you do for a normal post — nothing needs touching in `_projects/`.

### 4.1 Front matter

```yaml
---
title: "What Model Identifiability Actually Means"
date: 2026-07-30
description: "One or two sentences — the teaser shown on the Blog card."
thumbnail: /assets/img/thumb-1.svg
tags: [biology, modelling]
references:
  - text: "Author, A. (2024). Title. Journal, 12(3), 45-67."
    url: "https://doi.org/..."
  - text: "A reference with no link at all."
---
```

Field by field:

- **`title`** — required. The post's `<h1>` and the card's `<h2>`.
- **`date`** — required (the filename date must match). Posts are listed
  newest first on the Blog page.
- **`description`** — required. The card teaser, 1–3 sentences. Inline HTML
  is allowed here if you need emphasis.
- **`thumbnail`** — required. Root-relative path, e.g. `/assets/img/foo.jpg`.
  Any size — CSS crops it to a 90×90 box on desktop, a full-width 160px strip
  on mobile. Put new images in `assets/img/`.
- **`tags`** — optional, free-form. Stored but not displayed anywhere yet.
- **`references`** — optional list of `{ text, url? }`. Rendered as a numbered
  bibliography under a "References" heading at the bottom of the post page,
  and omitted entirely when absent. `url` is optional per entry. Not shown on
  cards.

Note there is no `links:` field on a post — publication/repo links belong to a
*project* (§5), not to a post.

### 4.2 The body

Plain Markdown. `##` gives you a section heading, blank-line-separated
paragraphs get justified automatically. Don't add inline styles.

For a figure with a caption, use the include (not raw `<img>`):

```liquid
{% include figure.html src="/assets/img/my-figure.png" alt="Describe it for accessibility" caption="Figure 1. What this shows." %}
```

`caption` is optional. Number figures yourself in the caption text — there's no
auto-numbering.

## 5. Adding a research project

Run `./bin/newproject "Your Project Title"`, then edit the file it creates in
`_projects/`. Projects are **front matter only** — they render as cards on the
Research page and have no page of their own, so the body stays empty.

```yaml
---
title: "Neural Decoding of Reach Intent"
order: 5
description: "One or two sentences — the teaser shown on the Research card."
thumbnail: /assets/img/reach-decoding.png
post: what-model-identifiability-actually-means   # optional, see §5.1
links:                                            # all optional
  publication: "https://doi.org/..."
  github: "https://github.com/rythdg/..."
  project: "https://example.org/demo"
---
```

- **`title`**, **`description`**, **`thumbnail`** — required, same meaning as
  on a post.
- **`order`** — required. Ascending, so `1` appears first. The Research page is
  curated, not chronological; `bin/newproject` sets this to the next number,
  and you can renumber freely to reorder.
- **`post`** — optional. See §5.1.
- **`links`** — optional. The card's right-hand column. Recognized keys:
  `publication`, `github`, `project`. **Only keys you actually provide
  render** — a project with no paper yet just shows fewer links.

### 5.1 Linking a project to a blog post

Set `post:` to the **slug** of a file in `_posts/` — the filename with the date
and `.md` stripped:

```
_posts/2026-09-22-what-model-identifiability-actually-means.md
                  └────────────── the slug ──────────────┘
```

```yaml
post: what-model-identifiability-actually-means
```

That adds a "Blog Post" link to the project's card, pointing at the post with
`?from=research` so the post's back link returns to Research (§7).

This is the **only** connection between the two collections, and it's entirely
optional:

- **Project with no `post:`** → card renders with just its other links. Use
  this for work you haven't written up yet.
- **Post that no project references** → appears on Blog only. This is the
  normal case for most posts.
- **`post:` naming a slug that doesn't exist** → the link is silently omitted
  and the build still succeeds, so a typo degrades gracefully rather than
  breaking the page. Worth double-checking the slug if a link doesn't appear.

To link several posts to one project, give the project the most important one
and mention the others in the post bodies; the card column is deliberately kept
short.

## 6. Editing the other pages

- **Home / About** (`index.md`, `about.md`) — plain Markdown, just edit them.
- **Contact** (`contact.html`) — a `<ul class="contact-list">` of
  `<span class="contact-label">Label</span> <a href="...">value</a>` pairs.
  Copy an `<li>` to add a channel. To update the CV, replace
  `files/Ryth-Dasgupta-CV.pdf` keeping the same filename.
- **Research / Blog** (`research.html`, `blog.html`) — only the intro
  paragraph is hand-written; the cards come from `_projects/` and `_posts/`
  respectively. You shouldn't need to touch these.

## 7. The back-link mechanism (`?from=`)

The "← Back to ..." link at the top of a post isn't hardcoded — a post can be
reached from either listing, so the link follows where you came from.

- The card includes append `?from=research` or `?from=blog` to the post URL.
- `assets/js/post-back.js` reads that param and rewrites the `#post-back`
  anchor, using the `data-research-url` / `data-blog-url` attributes that
  `_layouts/post.html` renders onto it.
- The hardcoded `href` in the layout is the no-JS fallback.

This all lives in the layout, so new posts get it for free.

## 8. Previewing locally

Unlike the old plain-HTML version of this site, there **is** a build step now,
so you can't just open a file in the browser. Run the dev server:

```bash
bundle install          # first time only
bundle exec jekyll serve
```

Then open <http://127.0.0.1:4000/>. It rebuilds on save.

Needs Ruby 3.x (`brew install ruby`); macOS's system Ruby 2.6 is too old for
Jekyll 4.

## 9. Publishing

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

## 10. Future / optional: a GUI for non-technical edits

Everything above assumes editing files directly. If a drag-and-drop editing
experience is ever wanted — especially for uploading images without touching
Git — Decap CMS (free, open-source) drops onto this exact structure and is
designed for Jekyll's `_posts` + front matter model. Ask for it if/when it's
wanted; it hasn't been set up yet.
