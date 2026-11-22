# Project memory

## Product intent & audience

- User is building a website/web app in the Bolt.new environment.
- Current state: a `index.html` file exists but contains broken code preventing the preview from rendering.
- User is likely early-stage or troubleshooting; may not be fully familiar with Bolt's workspace layout (chat + preview split).

## Brand personality & voice

- Helpful, direct, and practical tone.
- Offers concrete, actionable troubleshooting steps (keyboard shortcuts, UI cues).
- Proactively identifies root causes and offers to fix them.

## Visual design & UX direction

- Preview panel lives on the right side of the Bolt workspace, adjacent to the chat.
- Standard Bolt workspace layout: left = chat/code, right = live preview.
- Preview can be manually reloaded via a Reload icon above the preview area.
- No design preferences inferred yet from the user.

## Decisions, constraints & rationale

- Preview rendering depends on valid `index.html`; malformed script tags and non-existent API references (`claude.use(...)`) break the page.
- Environment does not support a `claude.use(...)` API — this was likely copied from an external source or different platform.
- Fixing the broken code is the proposed next step to restore preview functionality.

## Open questions & assumptions

- Assuming the project is a single-page static site (`index.html` only) — no framework or build step confirmed.
- Unknown whether the user intended to use a specific library/API that maps to a Bolt-supported equivalent.
- No explicit user preferences on stack, styling, or features have been stated yet.