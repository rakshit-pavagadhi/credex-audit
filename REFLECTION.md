# Reflection

## 1. The hardest bug and how I debugged it (150–400 words)

The most frustrating bug was the CSS import ordering conflict with Tailwind CSS v4. I initially placed a Google Fonts `@import url(...)` rule directly after `@import "tailwindcss"` in globals.css. In Tailwind v4, the `@import "tailwindcss"` directive expands into a set of CSS rules at build time. The CSS spec requires all `@import` rules to precede other rules, so when Tailwind expanded, my Google Fonts import was no longer at the top — causing PostCSS to either silently drop it or throw processing errors.

What made this tricky was that the error messages weren't clear. The page would render with system fonts instead of Inter, and there was no console error — just a quietly failed import. I initially suspected the Google Fonts URL was wrong, then that Tailwind was overriding my font variables. Only after reading the Tailwind v4 migration docs did I realize the issue was structural.

**Fix:** I moved the Google Fonts loading from a CSS `@import` to `<link>` tags in the Next.js layout.tsx head. This is actually better practice anyway — link tags allow the browser to start downloading fonts in parallel with CSS, and they don't depend on CSS processing order.

**What I tried first:** (a) Moving the @import before @import "tailwindcss" — broke Tailwind entirely. (b) Using @layer to wrap the import — not valid CSS. (c) Inline font declarations — worked but was ugly.

## 2. A decision I reversed mid-week (150–400 words)

I initially planned to use Supabase as the primary data store from day one. I had the schema designed and was about to set up the client when I realized this added significant complexity for the MVP: environment setup, schema migrations, connection pooling configuration, and a dependency that could fail independently of the app.

I reversed course and built an in-memory store with the exact same interface (`saveAudit`, `getAudit`, `saveLead`). The trade-off is clear — data doesn't persist across deploys or serverless cold starts. But for a hiring assignment where the goal is to demonstrate engineering judgment, shipping a working product with a clean abstraction boundary matters more than persistence.

The store module is 30 lines of code. Swapping to Supabase requires changing one import and adding connection credentials — zero logic changes. I documented this decision in ARCHITECTURE.md so reviewers understand it was intentional, not lazy.

## 3. What I would build in week 2 (150–400 words)

Three things, in priority order:

1. **Supabase persistence + auth:** Replace the in-memory store with real PostgreSQL via Supabase. Add anonymous auth so users can revisit their audits. This unlocks the ability to track audit-to-consultation conversion over time.

2. **PDF export:** Generate a downloadable PDF of the audit report using @react-pdf/renderer. This is the primary lead magnet — gate the PDF behind email capture, not the results themselves. The shareable URL shows results freely; the PDF adds formatting, branding, and printability.

3. **Usage-based API analysis:** Right now, API-type tools (OpenAI API, Anthropic API) only get Credex savings analysis because they're pay-as-you-go. In week 2, I'd add token usage estimation: ask users for monthly API spend, estimate token volume, and recommend model routing (e.g., "Route 60% of your GPT-4o calls to GPT-4.1 Nano and save $400/mo").

## 4. How I used AI tools (150–400 words)

I used AI tools throughout this project, primarily for:

- **Pricing research:** Searching and verifying current pricing across 8 vendors. AI search was faster than manually visiting 8 pricing pages, but I cross-referenced every number against the official vendor page URL. Two prices from search results were outdated — ChatGPT had added a "Go" tier at $8/mo that wasn't in cached results.

- **Template generation:** The boilerplate for Next.js API routes, TypeScript interfaces, and test scaffolding was AI-generated and then heavily modified. The audit engine logic — the 4-dimension analysis, cross-tool mapping, and Credex discount calculations — was designed by me and implemented with AI assistance.

- **What I didn't trust AI for:** The audit logic itself. "Should a team of 2 on Cursor Teams switch to individual Pro plans?" requires understanding the actual math ($40/seat × 2 = $80 vs $20 × 2 = $40) and whether the team features are worth the premium. I verified every recommendation path with manual calculations.

- **One specific catch:** The AI initially suggested GitHub Copilot Enterprise at $39/seat as cheaper than Cursor Teams at $40/seat. But Copilot Enterprise requires a separate GitHub Enterprise Cloud subscription (~$21/user/mo), making the real cost $60/seat. I caught this because I read the fine print on the pricing page.

## 5. Self-evaluation across 5 dimensions (one sentence each)

- **Discipline (9/10):** Shipped a complete, working MVP with all core features and documentation on day 1, with daily devlog entries maintained throughout.
- **Code quality (8/10):** Maintained TypeScript strict mode, wrote 18 passing tests covering edge cases, and ensured clean separation between audit logic and UI components.
- **Design sense (9/10):** Delivered a premium dark theme with glass-morphism, gradient accents, JetBrains Mono for numbers, and micro-animations rather than settling for a generic template.
- **Problem-solving (9/10):** Engineered the 4-dimension audit engine as the core IP — it's not just "compare prices" but a structured decision framework with calculated confidence levels.
- **Entrepreneurial thinking (8/10):** Ensured the Credex CTA only triggers for high-savings cases (>$500/mo) to respect the user's intelligence and prioritize lead quality over volume.
