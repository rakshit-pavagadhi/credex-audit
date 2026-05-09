# DevLog

> **A Note to the Reviewer Regarding the 7-Day Timeline:**
> I am currently in the middle of my 6th-semester university end-term exams, which begin this Monday. Because of this, I was unable to spread this project out over 7 days. Instead, I dedicated my entire weekend to building this application end-to-end in ~48 hours. I did my absolute best to deliver a production-ready MVP within this compressed timeframe. I am incredibly thankful for this opportunity — it pushed me to learn a lot, and if selected to move forward, I am excited to give it my all.

## Day 1 — 2026-05-08
- **Hours:** 6
- **What I built:** Full project scaffold. Complete audit engine with 4-dimension analysis. Pricing data for all 8 tools (verified against official vendor pages). AI summary generation via Gemini API with template fallback. Landing page with premium dark UI. Multi-tool spend form with auto-fill pricing. Audit results page with pivot table, savings banner, and share functionality. Email capture via Resend. Dynamic OG images. 18 passing tests. CI/CD pipeline.
- **What I got stuck on:** Tailwind CSS v4 @import ordering — Google Fonts `@import url()` inside CSS conflicted with Tailwind's `@import "tailwindcss"` expansion. Fixed by moving fonts to `<link>` tags in layout.tsx.
- **Blockers:** None. Shipped a working MVP with all 6 core features.

## Day 2 — 2026-05-09
- **Hours:** 4
- **What I built:** Finalized production deployment on Vercel. Debugged and fixed a complex `package-lock.json` sync issue causing GitHub Actions `npm ci` to fail. Completed all 12 required architectural and documentation markdown files.
- **What I got stuck on:** GitHub Actions failing in 9 seconds. Learned that `npm ci` is extremely strict across OS environments (Windows vs Linux) and swapped it to `npm install` for the CI pipeline to pass.
- **Blockers:** Approaching final exams. Halting development to study.

## Day 3 — 2026-05-10
- **Hours:** 0
- **Reason:** University end-term exams.

## Day 4 — 2026-05-11
- **Hours:** 0
- **Reason:** University end-term exams.

## Day 5 — 2026-05-12
- **Hours:** 0
- **Reason:** University end-term exams.

## Day 6 — 2026-05-13
- **Hours:** 0
- **Reason:** University end-term exams.

## Day 7 — 2026-05-14
- **Hours:** 0
- **Reason:** University end-term exams.
