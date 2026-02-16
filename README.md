# website

Professional website and demo gallery for **sorenemilskaarup.com**.

## File naming conventions

Use consistent, predictable names so links stay stable and easy to scan.

### HTML pages
- Use **kebab-case** for all page filenames (e.g., `claude-games.html`, `stat-intuition.html`).
- Keep top-level pages at the repository root (`index.html`, `projects.html`, etc.).
- Keep demo pages in `demos/` with kebab-case names.

### `demos/` specifics
- Demo HTML files should follow: `demos/<topic-or-demo-name>.html` in kebab-case.
- Demo scripts should live in `js/demos/` and use descriptive names (camelCase is acceptable for JS module filenames already in use).
- When renaming a demo page:
  1. Add/update internal links (`projects.html`, `index.html`, or other refs).
  2. Preserve old inbound URLs with a redirect stub when external references may exist.
  3. Verify navigation still resolves correctly from subdirectories.

## Page metadata checklist

For every public HTML page, include and verify:

- `<title>`
- `<meta name="description" ...>`
- `<link rel="canonical" ...>`
- Open Graph tags:
  - `<meta property="og:title" ...>`
  - `<meta property="og:description" ...>`
  - `<meta property="og:type" ...>`
  - `<meta property="og:url" ...>`
  - `<meta property="og:image" ...>`
- Twitter tags:
  - `<meta name="twitter:card" ...>`
  - `<meta name="twitter:title" ...>`
  - `<meta name="twitter:description" ...>`
  - `<meta name="twitter:image" ...>`

Recommended workflow:
1. Copy metadata structure from a fully configured page like `index.html`.
2. Update title/description/URL values for the specific page.
3. Confirm canonical and OG URL match the final filename and route.

## CSS: utility class vs component class

Use this rule of thumb when editing `css/style.css`:

### Add a utility class when...
- The style is a **single-purpose, reusable tweak** (spacing, text alignment, width, display).
- You expect to reuse it in multiple unrelated components.
- It composes cleanly without depending on a specific DOM structure.

### Add/extend a component class when...
- The style belongs to a **specific UI block** (card, nav, hero, quiz panel).
- It requires multiple coordinated properties.
- It depends on nested elements, state, or context.

### Avoid
- Creating one-off utilities that are only used once.
- Packing global utilities with component-specific assumptions.

## Navigation update checklist

The site uses shared nav injection via `partials/nav.html` + `js/nav.js`.

When changing navigation:

1. **Edit links in `partials/nav.html`**
   - Maintain both `href` and `data-href` attributes on nav anchors.
   - `data-href` is the source used by `js/nav.js` for path rewriting.

2. **Verify each page includes nav placeholder correctly**
   - Root pages should typically use:
     - `data-nav-src="partials/nav.html"`
     - `data-nav-base="."`
   - Pages in `demos/` should typically use:
     - `data-nav-src="../partials/nav.html"`
     - `data-nav-base=".."`

3. **Check active-page highlighting**
   - `js/nav.js` sets `aria-current="page"` based on filename matching.
   - Confirm renamed files still map to the intended nav item.

4. **Smoke test key routes**
   - Root pages and at least one demo page.
   - Ensure nav links resolve to correct absolute/relative targets.

## Rename/redirect policy

If a filename must change for consistency:
- Prefer the new kebab-case filename.
- Keep compatibility for the old path via a lightweight redirect page when there may be inbound links.
- Update internal links to point to the new canonical filename.
