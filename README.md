# rythdg.github.io

Ryth Dasgupta's personal website — a [Jekyll](https://jekyllrb.com/) site that
GitHub Actions builds and deploys on every push to `main`.

**You never edit HTML.** Everything is Markdown files and one settings file.

```bash
./bin/newpost "What Model Identifiability Actually Means"   # new blog post
./bin/newproject "Neural Decoding of Reach Intent"          # new research entry
# edit the file it prints, then:
git add -A && git commit -m "Add post on identifiability" && git push
# live at https://rythdg.github.io/ in ~1 minute
```

This README is written for two audiences: a human making a change, and an AI
coding agent asked to make one. If you're an agent: read the whole file first —
it documents conventions you can't infer from any single file (the `?from=`
trick, the project↔post slug link, why projects have no pages).

---

## What do you want to change?

| I want to… | Go to | Edit |
|---|---|---|
| Write a new blog post | [§1](#1-write-a-new-blog-post) | `_posts/` |
| Edit or delete an existing post | [§2](#2-edit-or-delete-a-post) | `_posts/` |
| Add a figure, references, or code to a post | [§3](#3-inside-a-post-figures-references-code) | the post file |
| Add a research project | [§4](#4-add-a-research-project) | `_projects/` |
| Reorder / edit / delete research projects | [§5](#5-reorder-edit-or-delete-projects) | `_projects/` |
| Link a research project to a blog post | [§6](#6-link-a-project-to-a-blog-post) | the project file |
| Change Home or About text | [§7](#7-home-and-about) | `index.md`, `about.md` |
| Change contact details or swap the CV | [§8](#8-contact-details-and-cv) | `contact.html`, `files/` |
| Change the Research/Blog intro sentence | [§9](#9-the-researchblog-intro-sentences) | `research.html`, `blog.html` |
| Change the nav bar, site title, or footer | [§10](#10-nav-bar-site-title-footer) | `_config.yml` |
| Add a whole new page (e.g. Teaching) | [§11](#11-add-a-new-page) | new `.md` + `_config.yml` |
| Add or replace images | [§12](#12-images) | `assets/img/` |
| Change fonts, colours, spacing, layout | [§13](#13-visual-design) | `css/style.css` |
| Preview before publishing | [§14](#14-preview-locally) | — |
| Publish | [§15](#15-publish) | — |

**The one concept to understand first:** blog posts and research projects are
**two separate things.**

| | Lives in | Appears on | Has its own page? |
|---|---|---|---|
| **Blog post** | `_posts/` | Blog | Yes, at `/posts/<slug>/` |
| **Research project** | `_projects/` | Research | No — it's a card only |

A post does not need a project. A project does not need a post. A project can
*optionally* point at one post ([§6](#6-link-a-project-to-a-blog-post)) — that's
the only link between them.

---

## 1. Write a new blog post

```bash
./bin/newpost "What Model Identifiability Actually Means"
```

That creates `_posts/2026-09-22-what-model-identifiability-actually-means.md`
(today's date + a slug from the title) with the front matter filled in, and
prints the path. Open it and write.

The file looks like this — everything above the second `---` is metadata, and
everything below it is your post:

```markdown
---
title: "What Model Identifiability Actually Means"
date: 2026-09-22
description: "One or two sentences — the teaser shown on the Blog card."
tags: [modelling, biology]
thumbnail: /assets/img/identifiability.png
---

I kept seeing the term "identifiability"...

## The basic idea

Plain Markdown from here on.
```

| Field | Required? | What it does |
|---|---|---|
| `title` | **yes** | The post's `<h1>`, the Blog card heading, and the browser tab title |
| `date` | **yes** | Sort order on the Blog page (newest first). Must match the filename's date |
| `description` | **yes** | The teaser on the Blog card. 1–3 sentences. Inline HTML allowed |
| `tags` | no | Free-form. Stored but **not displayed anywhere yet** |
| `thumbnail` | no | Card image. Leave it out and the card is text-only, which is fine and normal |
| `references` | no | A bibliography — see [§3](#3-inside-a-post-figures-references-code) |

There is **no `links:` field on a post.** Publication and repo links belong to a
*project* ([§4](#4-add-a-research-project)), not a post.

Writing the post is the whole job — you do **not** need to touch `_projects/`,
`blog.html`, or anything else. The Blog card appears automatically.

## 2. Edit or delete a post

- **Edit:** open the file in `_posts/` and change it. That's it.
- **Delete:** delete the file. The card and the page both disappear.
- **Rename / retitle:** changing `title` alone is safe. Changing the *filename*
  changes the post's URL, which breaks any external link to it — and if a
  project references it by slug, **update that project's `post:` field too**
  ([§6](#6-link-a-project-to-a-blog-post)).

### Drafts — keeping a post unpublished

Add `published: false` to its front matter. The post stays in the repo but is
left out of the built site entirely — no page, no card:

```yaml
published: false
```

Delete that line when you're ready to publish. A **future `date:`** also keeps a
post unpublished until that date passes (both verified). A third option is a
`_drafts/` folder, which Jekyll ignores unless you run `jekyll serve --drafts`.

## 3. Inside a post: figures, references, code

### A figure with a caption

Use the include — don't hand-write `<img>`, or it won't be styled:

```liquid
{% include figure.html src="/assets/img/my-plot.png" alt="Decoder accuracy over time" caption="Figure 1. Accuracy rises then plateaus." %}
```

`caption` is optional. Number figures yourself in the caption text; there's no
auto-numbering. Put the image file in `assets/img/` ([§12](#12-images)).

### References / bibliography

Add a `references:` list to the post's front matter — **not** into the body:

```yaml
references:
  - text: "Smith, J. & Doe, A. (2024). A Paper Title. Journal of Things, 12(3), 45-67."
    url: "https://doi.org/10.xxxx/xxxxx"
  - text: "A source with no link, e.g. a physical book."
```

A numbered "References" heading and list are appended to the bottom of the post
automatically. `url` is optional per entry. Omit `references:` entirely and no
heading appears — you don't need to hide anything by hand.

### Code, tables, maths

Standard Markdown fenced code blocks, tables, and lists all work
(kramdown + GFM, with Rouge syntax highlighting). There is **no maths renderer
installed** — if you want LaTeX, ask and it can be added.

## 4. Add a research project

```bash
./bin/newproject "Neural Decoding of Reach Intent"
```

That creates `_projects/neural-decoding-of-reach-intent.md`. Projects are
**front matter only** — they render as cards on the Research page and have **no
page of their own**, so leave the body empty.

```yaml
---
title: "Neural Decoding of Reach Intent"
order: 5
description: "One or two sentences — the teaser shown on the Research card."
thumbnail: /assets/img/reach-decoding.png
post: what-model-identifiability-actually-means   # optional, see §6
links:                                            # all keys optional
  publication: "https://doi.org/10.xxxx/xxxxx"
  github: "https://github.com/rythdg/reach-decoder"
  project: "https://example.org/demo"
---
```

| Field | Required? | What it does |
|---|---|---|
| `title` | **yes** | Card heading |
| `order` | **yes** | Position on the page, ascending — `1` is first. `newproject` assigns the next number |
| `description` | **yes** | The card teaser |
| `thumbnail` | no | Card image; text-only card without it |
| `post` | no | Slug of a post in `_posts/`, adds a "Blog Post" link ([§6](#6-link-a-project-to-a-blog-post)) |
| `links` | no | The card's right-hand link column |

**`links` only renders the keys you actually provide.** Recognized keys are
`publication`, `github`, and `project` — so a project with no paper yet just
omits `publication` and shows fewer links. Nothing needs to be disabled.

If you want a project to have a real write-up page, that's a blog post
([§1](#1-write-a-new-blog-post)) that you then link to it ([§6](#6-link-a-project-to-a-blog-post)).

## 5. Reorder, edit, or delete projects

- **Reorder:** change the `order:` numbers. Lower comes first. They don't need
  to be contiguous — `10, 20, 30` is a good habit, since you can then insert
  something at `15` without renumbering everything.
- **Edit:** open the file in `_projects/` and change it.
- **Delete:** delete the file. Note this does **not** delete any blog post it
  linked to; the post stays on the Blog page. That's usually what you want.

The Research page is deliberately ordered by `order` and not by date, because a
research list is curated — your best work first, not your newest. (The Blog page
*is* chronological.)

## 6. Link a project to a blog post

Set the project's `post:` field to the **slug** of a file in `_posts/` — the
filename with the date prefix and `.md` extension removed:

```
_posts/2026-09-22-what-model-identifiability-actually-means.md
                  └────────────── the slug ──────────────┘
```

```yaml
# in _projects/some-project.md
post: what-model-identifiability-actually-means
```

That adds a **"Blog Post"** link to the project's card. The link carries
`?from=research` so the post's back link returns to Research
([§16](#16-how-the-back-link-works)).

This is the only connection between the two collections, and every combination
is valid:

| Situation | Result |
|---|---|
| Project with no `post:` | Card shows its other links. Use this for work not written up yet |
| Post no project references | Appears on Blog only. **This is the normal case for most posts** |
| `post:` slug that doesn't exist | Link is silently omitted, **build still succeeds**. A typo loses the link but never breaks the page — so if a Blog Post link doesn't show up, check the slug |

To relate several posts to one project, point `post:` at the main one and
cross-reference the rest in the post bodies. The card's link column is kept
deliberately short.

## 7. Home and About

`index.md` and `about.md` — plain Markdown, just edit the text. Blank lines
separate paragraphs; `##` makes a section heading.

The `title:` in the front matter is the page's `<h1>`. Home's is currently
`Home`; change it to anything (e.g. `Ryth Dasgupta`) and only the heading
changes — the nav label is set separately ([§10](#10-nav-bar-site-title-footer)).

Don't add inline styles or `text-align`; the stylesheet already justifies body
paragraphs and left-aligns headings.

## 8. Contact details and CV

In `contact.html`, each channel is one list item:

```html
<li><span class="contact-label">GitHub</span> <a href="https://github.com/rythdg">github.com/rythdg</a></li>
```

Copy a line and change the label and link to add a channel (LinkedIn, ORCID,
Google Scholar…). The email address itself comes from `email:` in `_config.yml`.

**To update your CV:** replace `files/Ryth-Dasgupta-CV.pdf` with the new PDF,
keeping the same filename. If you rename it, update the link in `contact.html`.
Note this file is publicly downloadable by anyone.

## 9. The Research/Blog intro sentences

The one paragraph above the cards on each listing page is hand-written, at the
top of `research.html` and `blog.html`. Edit the `<p>` and leave the Liquid loop
below it alone — that's what generates the cards.

## 10. Nav bar, site title, footer

All in `_config.yml`:

```yaml
title: Ryth Dasgupta        # browser tab title (and the "| Ryth Dasgupta" suffix)
author: Ryth Dasgupta       # the name in the footer
email: dasgupta.ryth@gmail.com   # used by contact.html

nav:                        # the nav bar — order here is order on screen
  - name: Home
    url: /
  - name: About
    url: /about/
```

- **Nav bar:** add, remove, reorder, or relabel entries under `nav:`. It's one
  list, used by every page — there's no per-page copy to keep in sync.
- **Footer:** the year is generated at build time, so it never goes stale. The
  name comes from `author:`. To change the wording itself, edit the `<footer>`
  in `_layouts/default.html`.
- **Browser tab titles:** Home shows `title:`; every other page shows
  `<page title> | <site title>`. Set in `_layouts/default.html`.

> **Restart the dev server after editing `_config.yml`.** Jekyll does not
> pick up config changes on live reload — this catches everyone out.

## 11. Add a new page

Say you want a Teaching page at `/teaching/`. Two steps:

1. Create `teaching.md`:

   ```markdown
   ---
   layout: page
   title: Teaching
   permalink: /teaching/
   ---

   Your content here.
   ```

2. Add it to `nav:` in `_config.yml` where you want it to appear:

   ```yaml
     - name: Teaching
       url: /teaching/
   ```

`layout: page` gives you the shared nav, footer, styling, and an `<h1>` from
`title`. Restart the dev server to see it.

## 12. Images

Put image files in `assets/img/` and reference them **root-relative**, starting
with a `/`:

```yaml
thumbnail: /assets/img/my-photo.jpg
```

- Any format (`.jpg`, `.png`, `.svg`) and any size works.
- **Card thumbnails** are cropped by CSS to a 90×90 square on desktop and a
  full-width 160px-tall strip on mobile, so roughly square images look best.
- **In-post figures** are capped at the text column width and scale down
  responsively — see [§3](#3-inside-a-post-figures-references-code).
- `thumb-1.svg` … `thumb-4.svg` are the grey numbered placeholders. Delete them
  once real images replace them.

## 13. Visual design

Everything visual lives in `css/style.css` — one file, no preprocessor, no
framework, no build step beyond Jekyll.

Current design language, so you know what you're changing: PT Sans (loaded via
`@import` at the top of the file), white background, black text, headings
left-aligned, body paragraphs justified, nav centered, content column capped at
`680px` and centered, with responsive breakpoints at `600px` and `480px`.

Useful landmarks in the file: `header nav` (the nav bar), `main` (the content
column width), `.research-block` / `.blog-block` (cards), `.post-figure`
(figures), `.references-list`, `footer`.

If you change a card's markup, keep the class names — the includes in
`_includes/` and these CSS rules are a matched pair.

## 14. Preview locally

There **is** a build step now, so unlike the old version of this site you can't
just double-click an HTML file.

```bash
bundle install            # first time only
bundle exec jekyll serve
```

Open <http://127.0.0.1:4000/>. It rebuilds as you save — **except** for
`_config.yml`, which needs a restart ([§10](#10-nav-bar-site-title-footer)).

Requires Ruby 3.x: `brew install ruby`, then make sure it's on your `PATH`
(`export PATH="/opt/homebrew/opt/ruby/bin:$PATH"`). macOS's built-in Ruby 2.6 is
too old for Jekyll 4.

## 15. Publish

Push to `main`. That's the whole deploy process — there is no staging site, so
**pushing is publishing.**

```bash
git add -A
git commit -m "Add post on model identifiability"
git push
```

`.github/workflows/pages.yml` builds the site and deploys it; it's live in a
minute or two. Check progress under the repo's **Actions** tab — if a build
fails, the site keeps serving the previous version.

Two things to know:

- **Repo visibility:** Pages serves from a *public* repo on a free GitHub plan.
  If this repo were made private, the site would stop being published unless the
  account is on a paid plan.
- **Pages source** (already configured, don't change it): Settings → Pages →
  Build and deployment → Source must stay on **GitHub Actions**. Switching it
  back to "Deploy from a branch" would bypass the workflow.

## 16. How the back link works

Worth knowing before you touch a post layout. A post can be reached from either
listing, so its back link follows where you came from instead of being
hardcoded:

- The card includes append `?from=research` or `?from=blog` to the post URL.
- `assets/js/post-back.js` reads that parameter and rewrites the `#post-back`
  anchor, using the `data-research-url` / `data-blog-url` attributes that
  `_layouts/post.html` puts on it.
- The hardcoded `href` in the layout is the fallback when JS is off.

This lives entirely in the layout, so every new post gets it for free — there's
nothing to add per post.

## 17. Where everything lives

```
_config.yml           Site title, author, email, nav, collections  (§10)
Gemfile               Jekyll dependency

_posts/               BLOG POSTS — one Markdown file each           (§1)
_projects/            RESEARCH ENTRIES — front matter only          (§4)

index.md              Home                                         (§7)
about.md              About                                        (§7)
research.html         Research listing — intro + card loop          (§9)
blog.html             Blog listing — intro + card loop              (§9)
contact.html          Contact details                              (§8)

_layouts/
  default.html        Page shell: <head>, nav, <main>, footer
  page.html           Normal page — <h1> from `title`, then content
  post.html           Post — back link, <h1>, content, References
_includes/
  nav.html            Nav bar, generated from `nav:` in _config.yml
  post-card.html      One Blog card
  research-card.html  One Research card
  figure.html         An in-post figure                            (§3)

css/style.css         All styling                                  (§13)
assets/img/           Images                                       (§12)
assets/js/post-back.js  Context-aware back link                    (§16)
files/                CV PDF                                       (§8)

bin/newpost           Scaffold a blog post                         (§1)
bin/newproject        Scaffold a research entry                     (§4)
.github/workflows/pages.yml   Build + deploy on push to main       (§15)
_site/                Generated output — gitignored, never edit
```

Shared chrome (nav, footer, `<head>`) exists **only** in
`_layouts/default.html`. Unlike the old version of this site, there is no
duplicated markup to keep in sync across pages.

## 18. Optional: a GUI instead of files

Everything above assumes editing files. If you'd rather have a drag-and-drop
admin UI — particularly for uploading images without touching Git — Decap CMS
(free, open-source) fits this exact structure and is built for Jekyll's
front-matter model. It hasn't been set up; ask if you want it.
