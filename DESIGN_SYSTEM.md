# Shortly design system

Reading this as: a developer-focused SaaS with a light-first, minimal navy and indigo visual language. Landing-page design dials: variance 5, motion 4, density 3. Use the `design-taste-frontend` skill for the landing surface only; product tables and analytics follow this document.

## Tokens
| Token | Value |
| --- | --- |
| Background | #F7F8FC |
| Surface | #FFFFFF |
| Text | #15213B |
| Secondary text | #526078 |
| Border | #DDE3EE |
| Accent | #4338CA |
| Font | Self-hosted Geist Sans, system sans fallback |
| Codes | Geist Mono, monospace fallback |
| Spacing | 4px base, 16–24px component padding |
| Radius | 8px controls, 12px panels |
| Content width | Approximately 1200px |

Verify actual text, control, and focus contrast during implementation. Use tabular numerals for statistics. Light theme ships first; dark mode is optional and must pass the same checks before exposure. Avoid section-level theme flips, oversized rounded cards, gradients, invented customer endorsements, and fake performance claims.

## Screens
- Landing: single-line desktop navigation, left-aligned headline, functional shortening form, authentic product preview, shorten/share/measure explanation, analytics section, concise footer. Signed-out creation leads to sign-in while retaining the draft.
- Authentication: registration, sign-in, recovery, session loading and errors. Use managed flows; never imply privacy based only on a frontend route guard.
- Dashboard: desktop navigation rail, account/sign-out controls, own URL and click totals, shorten action, searchable paginated link table. Mobile uses a header and stacked rows.
- Result: persistent short URL, selectable destination, copy feedback and analytics link. A toast alone is insufficient.
- Analytics: short link and destination, lifetime total, 30 UTC days chart, top ten referrers, latest twenty events. Provide an accessible data alternative to the chart.
- Error/empty: signed out, no links, no search matches, zero clicks, invalid URL, missing/foreign-owned code, backend unavailable, expired session, rate limit and clipboard rejection.

## Component rules
Buttons have primary, secondary, pending and disabled states; inputs have visible labels and associated errors. Shared primitives include navigation, panels, toast/live region, pagination, link rows, loading skeletons, and status messages. Use simple native controls before adding dropdowns or modals. If a modal becomes necessary, trap focus, support Escape, and restore focus. Keep API calls in services, outside components.

Long URLs wrap without widening the viewport; mobile layouts work below 640px, tablet 640–1024px, desktop above 1024px. Verify 375, 768, 1024 and 1440px widths and zoom. Touch targets should be at least 44px; focus is visible; semantic links/buttons and keyboard order remain clear.

## Motion
Use the plan's Framer Motion choice for 160–240ms opacity/transform transitions, short staggered entrances, success/copy feedback, chart reveal and navigation state changes. Animated counters expose final real values accessibly. Do not delay interaction, hijack scrolling, or add perpetual floating decoration. Reduced motion shows final states immediately.

## Asset and visual gate
At Phase 5, inspect Higgsfield image/video capabilities for supporting website media. Label illustrative analytics explicitly; real connected statistics always come from the API. Use the HyperFrames entry skill if actually making video or motion graphic assets. Do not switch the application to a hosted website builder that changes the agreed stack.

Before UI approval, inspect actual browser screenshots, mobile layout, keyboard interaction, reduced motion, contrast, loading/error states, URL wrapping, and chart accuracy. A successful TypeScript build alone does not satisfy this gate.
