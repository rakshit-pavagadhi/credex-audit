# User Interviews

## Interview 1: Ravi S., CTO at a 12-person B2B SaaS startup (Series A)

**Tools:** Cursor Teams (12 seats), ChatGPT Business (8 seats), Anthropic API
**Monthly AI spend:** ~$1,100

> "I didn't even realize we were spending over a thousand a month until our accountant flagged it in our quarterly review. It's death by a thousand cuts — $40/seat here, $30/seat there. The thing is, maybe 4 of those 12 Cursor seats are actually power users. The rest open it once a week for autocomplete."

> "Honestly, I'd love a tool that just tells me 'hey, 8 of your devs should be on the free tier.' I know intellectually that's probably true, but I don't have time to audit everyone's usage. And I definitely don't want to be the CTO who takes tools away."

> "The Credex angle is interesting. If you could just... handle it — tell me the right config and save me $300/month — I'd pay for that."

**What surprised me:** He knew he was overspending but had no framework to quantify it. The psychological barrier wasn't cost — it was the perception of "taking tools away" from the team. Framing recommendations as "right-sizing" rather than "downgrading" matters.

**What changed my design:** Added a "confidence" indicator (high/medium/low) to each recommendation. Ravi said he'd only act on "high confidence" suggestions — he needs defensible reasons to justify changes to his team.

---

## Interview 2: Priya M., Solo Founder at a pre-seed AI wrapper startup

**Tools:** Claude Pro, ChatGPT Plus, Cursor Pro, Gemini AI Pro
**Monthly AI spend:** ~$80

> "Yeah, I'm probably paying for overlap. I have Claude for writing, ChatGPT for coding assistance, Cursor for the IDE, and Gemini because I use Google Workspace and it's bundled. Do I need all four? Probably not. But each one is only $20, so it never feels urgent enough to cancel."

> "What would get me to act is seeing the annual number. $80/month sounds fine. $960/year makes me wince. And that's just me — if I hire two people next month, that triples."

> "I Googled 'am I overpaying for AI tools' last week. I literally searched for this. There was nothing useful — just comparison blog posts from 2024 with wrong prices."

**What surprised me:** She searched for exactly this tool and couldn't find it. The SEO opportunity is enormous — "AI tool cost comparison" and "am I overpaying for AI tools" have no good results.

**What changed my design:** Made annual savings prominently displayed (not just monthly). The psychological impact of "$960/year" is much stronger than "$80/month."

---

## Interview 3: Daniel K., Engineering Lead at a 30-person fintech (Series B)

**Tools:** GitHub Copilot Enterprise (25 seats), Claude Team Premium (10 seats), OpenAI API
**Monthly AI spend:** ~$2,800

> "We locked into Copilot Enterprise because our VP of Engineering at the time wanted the codebase indexing feature. He left 6 months ago. I've been meaning to evaluate whether we actually need Enterprise vs Business, but it's never the top priority."

> "The API spend is the scary one. We went from $200/month to $800/month in three months and nobody noticed until I saw the invoice. We're calling Opus for tasks that Haiku could handle. But nobody's going to refactor the prompts unless there's a clear dollar figure attached."

> "If your tool could tell me 'switch these 15 seats from Enterprise to Business and save $300/month,' I'd do it today. I just need the confidence that Business actually covers what we need."

**What surprised me:** At $2,800/mo, he'd never run a formal audit. Enterprise inertia is real — plans get locked in during one decision-maker's tenure and never revisited. The audit tool serves as an external forcing function.

**What changed my design:** Added explicit handling for team-plan-to-individual-plan downgrades (the "you have 2 seats on Teams, switch to individual Pro" logic). Also emphasized the API model routing recommendation — "switch from Opus to Haiku for classification tasks" — as a distinct savings category.
