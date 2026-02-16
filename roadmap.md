# Website Change Review & Next Task Plan

## Current state review (as of this branch)

The website is currently a polished static portfolio with:

- **Shared navigation partials** injected at runtime (`partials/nav.html` + `js/nav.js`).
- **Consistent metadata** and social previews on core pages (`index.html`, `projects.html`, `quizzes.html`).
- **Clear audience positioning** around ML, data ethics, and interactive learning.
- **Strong demo inventory** under `demos/` with corresponding JavaScript modules under `js/demos/`.

### Observed strengths

1. **Content voice is coherent** across homepage, projects, and quizzes.
2. **Visual system is consistent** (hero, cards, timeline, pills, sections) and reusable.
3. **Navigation architecture is scalable** for simple static hosting.
4. **Interactive-first differentiation is clear** via demo-rich project pages.

### Observed gaps

1. No dedicated **writing/research log** section for recurring updates.
2. Limited **proof-oriented case studies** (problem → method → impact).
3. No explicit **learning pathways** across demos/quizzes.
4. No documented **analytics loop** for measuring engagement and CTA effectiveness.
5. Naming consistency issue in demos (e.g., `Natural_History.html` vs kebab-case naming elsewhere).

---

## New prioritized tasks

## P0 — Foundation (next 1–2 weeks)

- [ ] Create `writing/` section with an index and first 2–3 short entries.
- [ ] Add `learning-paths.html` that sequences existing demos + quizzes into beginner/intermediate tracks.
- [ ] Add an "Analytics" section to `README.md` with a minimal event taxonomy.
- [ ] Normalize demo naming conventions and add redirects/updated links where needed.

**Definition of done:** users can follow guided paths, and future updates can be shipped in a repeatable format.

## P1 — Credibility & conversion (weeks 3–6)

- [ ] Upgrade top `projects.html` cards into mini case studies with:
  - context/problem
  - method
  - outcomes
  - tools
  - artifact links
- [ ] Add "Evidence" snippets (talks, institutions, workshops, publications) where available.
- [ ] Add a "Featured writing" block to `index.html` populated from latest entries.
- [ ] Add internal "Related content" blocks on homepage, projects, and quizzes.

**Definition of done:** visitors can quickly understand impact and discover deeper pages.

## P2 — Scale content operations (weeks 7–12)

- [ ] Introduce topic tags (`ethics`, `simulation`, `statistics`, `explainability`) across projects/writing.
- [ ] Add a lightweight monthly publishing cadence (1 essay + 1 demo note).
- [ ] Add maintenance checklists for metadata, navigation updates, and link health.
- [ ] Create reusable page template snippets for writing entries and case studies.

**Definition of done:** site growth becomes process-driven rather than ad hoc.

---

## Task sequencing and ownership suggestion

1. **Information architecture pass** (Writing + Learning paths + nav updates).
2. **Content upgrades** (case studies and featured pieces).
3. **Measurement layer** (analytics events + monthly KPI review).
4. **Operational hardening** (templates/checklists/consistency).

---

## Success metrics for the next quarter

- Increase average pages per session.
- Increase project-to-contact CTA click-through rate.
- Increase return visitor ratio through recurring writing updates.
- Increase demo engagement depth (entries into demo pages + onward clicks).

---

## Immediate implementation checklist (next commit candidates)

- [ ] Add `writing/index.html` and first entry page.
- [ ] Add `learning-paths.html` and link from nav.
- [ ] Add "Featured writing" section to `index.html`.
- [ ] Add case-study card variant styles in `css/style.css`.
- [ ] Update `README.md` with analytics and publishing workflow.
