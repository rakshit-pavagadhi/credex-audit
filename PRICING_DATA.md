# Pricing Data

Every number in the audit engine must trace back to an official pricing page URL. Format:

```
src: <vendor> — <URL> — verified <date>
```

## Cursor (Anysphere)

src: Cursor — https://cursor.com/pricing — verified 2026-05-08

| Plan | Monthly Price | Per Seat? | Notes |
|------|-------------|-----------|-------|
| Hobby (Free) | $0 | No | Limited Agent requests, limited completions |
| Pro | $20/mo | No | Unlimited completions, $20 credit pool |
| Pro+ | $60/mo | No | 3x usage credits |
| Ultra | $200/mo | No | 20x usage credits, priority features |
| Teams | $40/user/mo | Yes | Centralized billing, admin, RBAC, SSO |
| Enterprise | Custom | Yes | Custom limits, compliance features |

## GitHub Copilot (GitHub / Microsoft)

src: GitHub — https://github.com/features/copilot#pricing — verified 2026-05-08

| Plan | Monthly Price | Per Seat? | Notes |
|------|-------------|-----------|-------|
| Free | $0 | No | Limited completions and chat |
| Pro | $10/mo | No | $10 monthly AI credits |
| Pro+ | $39/mo | No | $39 monthly AI credits |
| Business | $19/user/mo | Yes | Org management, policy controls |
| Enterprise | $39/user/mo | Yes | Requires GH Enterprise Cloud ($21/user/mo extra) |

## Claude (Anthropic)

src: Anthropic — https://claude.ai/pricing — verified 2026-05-08

| Plan | Monthly Price | Per Seat? | Notes |
|------|-------------|-----------|-------|
| Free | $0 | No | Basic access, daily limits |
| Pro | $20/mo | No | 5x Free, Claude Code, Projects, Memory |
| Max 5x | $100/mo | No | 5x Pro usage |
| Max 20x | $200/mo | No | 20x Pro usage |
| Team Standard | $25/user/mo | Yes | 1.25x Pro, admin controls (min 5 users) |
| Team Premium | $125/user/mo | Yes | 6.25x Pro usage |
| Enterprise | ~$20/user/mo | Yes | API-rate usage billing, SSO, SCIM |

## ChatGPT (OpenAI)

src: OpenAI — https://openai.com/chatgpt/pricing — verified 2026-05-08

| Plan | Monthly Price | Per Seat? | Notes |
|------|-------------|-----------|-------|
| Free | $0 | No | Basic model access |
| Go | $8/mo | No | Higher limits, faster models |
| Plus | $20/mo | No | GPT-5.5 access, Deep Research, image gen |
| Pro ($100) | $100/mo | No | 5x Plus limits |
| Pro ($200) | $200/mo | No | 20x Plus limits, 1M token context |
| Business | $30/user/mo | Yes | Shared workspaces, admin controls (min 2 users) |
| Enterprise | Custom | Yes | Negotiated pricing, SSO, compliance |

## Gemini (Google)

src: Google — https://one.google.com/about/ai-premium — verified 2026-05-08

| Plan | Monthly Price | Per Seat? | Notes |
|------|-------------|-----------|-------|
| Free | $0 | No | Flash models, 15 GB storage |
| AI Plus | $8/mo | No | 128K context, 200 GB storage |
| AI Pro | $20/mo | No | Flagship models, Deep Research, Workspace, 2 TB |
| AI Ultra | $250/mo | No | Highest limits, Deep Think, 30 TB |

## Windsurf (Codeium)

src: Codeium/Windsurf — https://windsurf.com/pricing — verified 2026-05-08

| Plan | Monthly Price | Per Seat? | Notes |
|------|-------------|-----------|-------|
| Free | $0 | No | Light quota, unlimited tab completion |
| Pro | $20/user/mo | No | Standard quota, full model access |
| Max | $200/user/mo | No | Heavy usage quota |
| Teams | $40/user/mo | Yes | Centralized billing, admin dashboard |
| Enterprise | Custom | Yes | SSO, SCIM, RBAC |

## OpenAI API

src: OpenAI — https://openai.com/api/pricing/ — verified 2026-05-08

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|----------------------|
| GPT-4.1 | $2.00 | $8.00 |
| GPT-4o | $2.50 | $10.00 |
| GPT-4.1 Nano | $0.10 | $0.40 |
| Batch API | 50% discount on all models |

## Anthropic API

src: Anthropic — https://www.anthropic.com/pricing — verified 2026-05-08

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|----------------------|
| Claude Opus 4.6 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $1.00 | $5.00 |
| Batch API | 50% discount on all models |
| Prompt Caching | 90% discount on cached input |
