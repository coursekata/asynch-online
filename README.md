# CourseKata Asynchronous Online Course

Materials for running a CourseKata course as an asynchronous online course: 16
lecture notebooks with their accompanying video recordings, laid out on a
five-week intensive calendar. Each lecture is mapped to the sections it covers
in **both** the ABC/ABCD books and the accelerated **XCD** book, so the set works
with either book configuration.

This repo also builds a small static site so instructors can browse the
notebook + video pairs in one place.

> **Interim home.** This site is a stopgap while the full
> [ck-teaching](https://github.com/coursekata/ck-teaching) teaching-resources site
> is being built. It is deliberately structured so the content ports there with
> minimal effort — see [Porting to ck-teaching](#porting-to-ck-teaching).

## How it's organized

- **[`notebooks/`](./notebooks)** — the 16 lecture notebooks (R kernel), the
  source of truth. Browsable directly on GitHub. The site serves this folder
  as-is; the files are not duplicated into `public/`.
- **[`content/resources/`](./content/resources)** — one markdown file per
  lecture, holding all the metadata (book coverage, schedule, dataset, tags,
  Vimeo id, notebook link). This is the part that ports.
- **[`content/instructors/`](./content/instructors)** — the short "meet the
  instructor" intro videos shown at the top of the index. A separate collection
  from the lectures: these are people, not teaching materials.
- **`app/`** — the site itself: a week-grouped index and a per-lecture page with
  the video, the notebook download, and an inline notebook preview.
- **`public/previews/`** — generated nbconvert renders of each notebook.
  Git-ignored and rebuilt on every deploy.
- **`5 week intensive summer, asynch online.docx`** — the original planning doc
  the schedule and book mapping were derived from.

## Adding the videos

Videos are hosted on Vimeo and referenced by id. Each lecture's markdown file
ships with a commented-out block:

```yaml
# video:
#   provider: vimeo
#   id: '123456789'
#   hash: ''          # only if the unlisted-link privacy setting requires one
#   duration: '12:04'
```

Uncomment it and fill in the id. Until then the page shows a "Video coming soon"
placeholder, so the site is publishable before every recording is uploaded.

The `scripts/set-videos.mjs` helper does this for you, and looks each id up
through Vimeo's oEmbed endpoint so it can fill in the runtime and fail loudly on
an id that does not resolve:

```bash
node scripts/set-videos.mjs 1=https://vimeo.com/1211571372 2=https://vimeo.com/1211571577
node scripts/set-videos.mjs --file videos.txt   # one "<lecture> <url>" per line
```

It accepts a bare id, a normal link, an unlisted link with a hash
(`vimeo.com/<id>/<hash>`), or a full embed URL. Pass `--no-fetch` to skip the
lookup.

## Local development

```bash
pnpm install
pnpm dev
```

To regenerate the notebook previews (needs `pip install nbconvert`):

```bash
pnpm previews
```

`pnpm generate` runs the previews and then builds the static site into
`.output/public`.

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). Enable it once
under **Settings → Pages → Source: GitHub Actions**.

## Porting to ck-teaching

The content files were written against ck-teaching's existing
`teachingResources` schema, so most of the port is a copy:

1. Copy `content/resources/*.md` into `ck-teaching/content/resources/`.
2. Copy `notebooks/*.ipynb` into `ck-teaching/public/resources/` and update the
   `files[].src` prefix from `/notebooks/` to `/resources/`.
3. Add the four optional fields to `ck-teaching/content.config.ts` — `video`,
   `sequence`, `coverage`, `schedule` (all optional, so existing resources keep
   validating). They are copy-pasteable from
   [`content.config.ts`](./content.config.ts), which is otherwise identical to
   ck-teaching's.
4. Bring over `app/components/VideoEmbed.vue` and `NotebookPreview.vue`, and
   drop them into ck-teaching's `app/pages/resources/[slug].vue`.

The `instructors` collection is deliberately **not** part of that port — those
videos belong to this course, not to ck-teaching's resource catalog.

Everything else — book codes, chapter values, `type`/`subtype`/`function`
enums, the `files[]` shape, the design tokens in `app/assets/css/main.css` — is
already identical to ck-teaching.
