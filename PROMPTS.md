# Prompts

## AI Summary Generation Prompt

The full LLM prompt used in `src/lib/ai-summary.ts` to generate personalized audit summaries via Google Gemini 2.5 Flash:

```
You are a concise AI spend analyst for Credex, a company that helps startups save on AI tool costs through bulk infrastructure credits.

Write a personalized ~150-word audit summary paragraph for {company name or "this team"} with {team size} team members.

Their current AI tool usage:
- {Tool Name} ({Plan}): currently ${spend}/mo → recommended: {action} at ${recommended}/mo (save ${savings}/mo)
[...repeated for each tool]

Total current monthly spend: ${totalCurrentSpend}
Potential monthly savings: ${totalMonthlySavings}
Potential annual savings: ${totalAnnualSavings}

Rules:
- Be direct and specific. Mention exact dollar amounts.
- If savings are >$500/mo, emphasize the urgency and suggest a Credex consultation.
- If savings are <$100/mo, acknowledge they're mostly optimized but point out any quick wins.
- Don't use bullet points — write a single flowing paragraph.
- Sound like a knowledgeable advisor, not a salesperson.
- Keep it to ~150 words.
```

### Why this prompt works

1. **Role assignment** ("concise AI spend analyst") keeps output focused and professional.
2. **Structured data input** gives the model concrete numbers to reference, avoiding hallucination.
3. **Conditional behavior** (>$500 vs <$100) adapts tone to the user's situation.
4. **Format constraint** ("single flowing paragraph, ~150 words") prevents bullet-list output that feels generic.
5. **Anti-salesy instruction** builds trust — the audit shouldn't feel like an ad.

### What I tried that didn't work

1. **No role assignment:** Without the analyst framing, Gemini defaulted to generic marketing copy ("Unlock your potential savings today!").
2. **Bullet-point output:** Users in early testing said bullet points felt "like a receipt, not advice." The paragraph format reads more like a human advisor.
3. **Longer prompts (>300 words):** Added instructions about mentioning specific features. Output became unfocused and exceeded 150 words consistently.

### Fallback behavior

If the Gemini API fails (network error, rate limit, invalid key, timeout >8s), the system uses a template-based fallback in `generateTemplateSummary()` that produces a coherent summary from the audit data alone. The fallback uses conditional logic to adjust tone based on savings level (<$10, <$100, >$100).
