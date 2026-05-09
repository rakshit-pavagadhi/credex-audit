# Architecture

## System Diagram

```mermaid
graph TB
    subgraph Client ["Browser (Next.js Client)"]
        LP["Landing Page"]
        SF["SpendForm Component"]
        AR["AuditResults Component"]
        AP["Audit Page /audit/[id]"]
    end

    subgraph Server ["Next.js Server (Vercel Edge)"]
        API_A["POST /api/audit"]
        API_L["POST /api/lead"]
        API_G["GET /api/audit/[id]"]
        API_OG["GET /api/og"]
    end

    subgraph Engine ["Core Logic"]
        AE["Audit Engine"]
        PD["Pricing Data"]
        AIS["AI Summary"]
    end

    subgraph External ["External Services"]
        GEM["Google Gemini API"]
        RES["Resend Email API"]
    end

    subgraph Storage ["Data Store"]
        MEM["In-Memory Store"]
    end

    LP --> SF
    SF -->|POST audit data| API_A
    API_A --> AE
    AE --> PD
    API_A --> AIS
    AIS -->|Generate summary| GEM
    AIS -->|Fallback| AIS
    API_A -->|Save report| MEM
    API_A -->|Return report| AR

    AR -->|POST email| API_L
    API_L -->|Send email| RES
    API_L -->|Save lead| MEM

    AP -->|GET report| API_G
    API_G -->|Fetch| MEM
    API_G -->|Return| AP

    AP -->|OG image| API_OG
```

## Data Flow

1. **User Input** → SpendForm captures tool entries (tool, plan, spend, seats, use case)
2. **Audit Request** → POST /api/audit validates, runs audit engine, generates AI summary
3. **Audit Engine** → Evaluates each tool on 4 dimensions against pricing data, picks highest-savings recommendation
4. **AI Summary** → Sends audit data to Gemini 2.5 Flash; falls back to template on any failure
5. **Storage** → Report saved to in-memory store with unique nanoid
6. **Results** → Client renders pivot table, savings banner, AI summary, share URL
7. **Lead Capture** → Optional email submission triggers Resend transactional email
8. **Sharing** → Unique URL `/audit/[id]` with dynamic OG image for social previews

## Why I Chose This Stack

- **Next.js 16 (App Router):** Server-side rendering required for OG tags on shared URLs. API routes eliminate the need for a separate backend. TypeScript-first. Vercel deployment is free and instant.
- **Tailwind CSS v4:** Assignment explicitly allows it. Fastest path to a premium, responsive UI without writing hundreds of custom CSS rules. Consistent design tokens.
- **In-memory store vs. Supabase:** For the MVP, in-memory storage is simpler and avoids external dependencies. The interface is designed to be swapped to Supabase/Postgres with zero logic changes — just swap the `store.ts` imports.
- **Google Gemini (free tier):** The assignment requires AI-generated summaries. Gemini 2.5 Flash is free, fast, and produces good output. The fallback template ensures the app works without any API key.
- **Vitest:** Fastest test runner for TypeScript. 18 tests covering audit engine logic and pricing data validation.

## Abuse Protection Choice (What + Why)

- **Rate limit on audit creation (`POST /api/audit`)**: in-memory IP-based window (`20 requests / hour`) to block obvious spam bursts while preserving a frictionless UX for real users.
- **Honeypot field on both form submissions** (`POST /api/audit` and `POST /api/lead`): hidden field rejects common bot form-fillers without adding captcha friction.

### Why this approach

- **Low-friction MVP:** hCaptcha would reduce abuse further, but it also hurts conversion and adds setup complexity for a weekend build.
- **Good-enough baseline:** rate limiting handles volume abuse; honeypot handles unsophisticated bots; together they cover the most likely abuse at this stage.
- **Easy hardening path:** if abuse rises, this can evolve to Redis-backed distributed limits + hCaptcha on `/api/lead` only.
