# website
Professional Website

## Analytics

This site uses a **privacy-conscious, first-party event pipeline**:

- Client code sends only minimal event metadata (event name, page path, timestamp, and bounded event properties).
- No cookies, no localStorage/sessionStorage identifiers, and no personal text payloads are captured.
- Event delivery is disabled by default unless a `<meta name="analytics-endpoint" content="...">` is configured.
- Data is sent with `navigator.sendBeacon` (or `fetch` fallback) to your own endpoint for aggregate analysis.

### Event taxonomy

| Event name | Trigger | Intended KPI |
| --- | --- | --- |
| `page_view` | Any page load | Top entry pages and traffic mix by landing path |
| `demo_page_open` | Load of `/demos/*.html` pages | Demo open volume by demo ID |
| `cta_projects_click` | Click on **See projects** on home page | CTA click-through rate from homepage hero |
| `cta_conversation_click` | Click on **Start a conversation** or **Email me** CTA | Conversation/email CTA click-through rate |
| `demo_interaction_start` | First meaningful action in a major demo | Share of demo opens that reach first interaction |
| `demo_interaction` | Ongoing interaction events (e.g., encrypt/decrypt in Caesar demo) | Interaction frequency and feature usage |
| `demo_interaction_reset` | Restart-like action (e.g., re-roll/check cycle in Stat Intuition) | Repeat-attempt behavior and persistence |
| `demo_interaction_complete` | Completion milestone reached in a demo | Demo engagement depth and completion rate |

### Monthly analytics review

Review these monthly to guide iteration priorities:

1. **Top entry pages** (`page_view` by landing path).
2. **CTA click-through rate** (`cta_projects_click` and `cta_conversation_click` divided by relevant page views).
3. **Demo engagement depth** (`demo_page_open` → `demo_interaction_start` → `demo_interaction_complete` funnel, plus resets/interactions).
