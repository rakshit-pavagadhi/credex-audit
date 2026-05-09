# Metrics

## North Star Metric: **Qualified Audit Completions**
A "qualified audit completion" is defined as a user who inputs ≥2 AI tools and receives a report showing ≥$50/mo in potential savings. This metric matters because it captures real engagement (not just page views), signals genuine overspending (not tire-kickers), and directly correlates with Credex conversion potential. A user who sees meaningful savings is 5–8x more likely to book a consultation than one who sees <$50.

## 3 Input Metrics That Drive the North Star

1. **Form Start Rate** — % of landing page visitors who interact with the tool selector. This measures whether the hero copy and value proposition are compelling enough to drive action. Target: >40% of page visitors. A low form start rate means the headline isn't resonating or the page feels untrustworthy.

2. **Tool Add Rate** — Average number of tools added per audit session. More tools = more accurate audit = higher savings found = higher conversion to Credex. Target: ≥2.5 tools per session. If users only add one tool, we're not capturing their full stack and the savings look too small to act on.

3. **Email Capture Rate** — % of completed audits where the user submits their email. This is the transition from anonymous visitor to qualified lead. Target: >15% of completed audits. This is gated behind the results — users only see the prompt after their savings are displayed, so high-savings audits should convert better.

## Instrumentation Plan
Each metric is tracked via event logging on the API routes (audit creation timestamp, entry count, savings amount, email submission). No client-side analytics SDK needed for the MVP — server-side logs capture all three metrics with the audit payload. For scaling, I'd add PostHog or Mixpanel with funnel tracking from `page_view → form_start → tool_added → audit_complete → email_captured → consultation_booked`.

What scores well: DAU is a poor metric for a tool people use once a quarter. "Qualified audit completions" captures intent and quality in one number.
What scores poorly: "page views" or "time on page" — vanity metrics that don't correlate with revenue.
