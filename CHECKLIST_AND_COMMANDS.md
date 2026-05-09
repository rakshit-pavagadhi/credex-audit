# Reference Guide: Commands & Validation Checklist

This guide provides everything you need to start the application locally and a comprehensive checklist to verify that all assignment constraints and functionalities have been implemented correctly.

---

## 1. Startup Commands

Open your terminal, navigate to the project directory (`C:\Users\HP\.gemini\antigravity\scratch\credex-audit`), and run these commands in order:

### Initial Setup
```bash
# 1. Install all required dependencies
npm install

# 2. Set up your environment variables
# Copy the example file to create a local .env file
cp .env.example .env.local

# 3. (Optional) Open .env.local in your editor and add your API keys:
# - GEMINI_API_KEY (for AI summaries)
# - RESEND_API_KEY (for transactional emails)
# - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (for real backend persistence)
```

### Development & Testing
```bash
# Run the automated test suite (Vitest)
npm run test

# Start the local development server
npm run dev
# The app will be available at http://localhost:3000 (or the port specified in the output, e.g., http://localhost:3088)
```

### Production Build
```bash
# Compile the application for production (useful to check for type/build errors)
npm run build

# Start the production server
npm run start
```

---

## 2. Functionality & Constraint Checklist

Use this checklist to manually verify the application against the assignment requirements.

### Core Audit Engine (4 Dimensions)
- [ ] **Dimension 1: Right-sizing**
  - *Test:* Add a "Cursor Ultra" ($200/mo) plan with the "Writing" use-case.
  - *Expectation:* Recommends downgrading to "Cursor Pro" ($20/mo).
- [ ] **Dimension 2: Same-vendor optimization**
  - *Test:* Add a "Cursor Teams" plan with 2 seats ($80/mo).
  - *Expectation:* Recommends switching to 2 individual "Cursor Pro" seats ($40/mo).
- [ ] **Dimension 3: Cross-tool switching**
  - *Test:* Add a "GitHub Copilot Enterprise" ($39/mo) plan.
  - *Expectation:* Recommends a cheaper equivalent if applicable, or Credex savings.
- [ ] **Dimension 4: Credex Credit Opportunity**
  - *Test:* Add a "ChatGPT Plus" ($20/mo) plan or any API usage.
  - *Expectation:* Audit shows an option to keep the tool but switch billing to Credex for a 20-30% discount.

### User Interface (UI)
- [ ] **Premium Dark Theme:** The UI utilizes `#0a0e1a` (or similar) dark backgrounds, glass-morphism, and modern typography.
- [ ] **Multi-Tool Form:** Users can add multiple AI tools (up to 12) via the `+ Add Another Tool` button.
- [ ] **Auto-fill Pricing:** Selecting a tool and a plan automatically populates the "Monthly Spend" input field.
- [ ] **Animated Savings Banner:** The hero section has an animated counter, and the results page clearly displays large monthly/annual savings numbers.
- [ ] **Expandable Pivot Table:** The audit results table shows current vs. recommended spend, and clicking a row expands it to show the reasoning and confidence level.

### Backend APIs & Integrations
- [ ] **AI Summaries (Gemini):** 
  - *Test with API Key:* The results page displays a ~150-word personalized paragraph.
  - *Test without API Key:* The results page gracefully falls back to a pre-written template based on the spend amount.
- [ ] **Lead Capture (Resend):**
  - *Test:* Enter an email address at the bottom of the results page.
  - *Expectation:* The UI shows a success state, and (if `RESEND_API_KEY` is set) an HTML email is sent.
- [ ] **Shareable URLs:**
  - *Test:* Copy the URL from the results page (e.g., `/audit/[id]`) and open it in an Incognito window.
  - *Expectation:* The exact same audit results load properly.
- [ ] **Dynamic OG Images:**
  - *Test:* Navigate to `/api/og?company=Acme&savings=5000&tools=3` in your browser.
  - *Expectation:* An image generates showing "Acme could save $5000/yr across 3 AI tools".
- [ ] **Spam Protection:** API routes utilize a honeypot field to reject bot submissions.

### Documentation & Deliverables
- [ ] **12 Markdown Files:** Verify the root directory contains: `README.md`, `ARCHITECTURE.md`, `LANDING_COPY.md`, `METRICS.md`, `PRICING_DATA.md`, `PROMPTS.md`, `GTM.md`, `USER_INTERVIEWS.md`, `ECONOMICS.md`, `DEVLOG.md`, `REFLECTION.md`, and `TESTS.md`.
- [ ] **Automated Tests:** Verify that running `npm run test` executes at least 5 tests (we have 18) that pass.
- [ ] **CI/CD:** Check that `.github/workflows/ci.yml` exists and includes steps for linting, testing, and building.
- [ ] **TypeScript/Linting:** Run `npm run lint` and `npx tsc --noEmit` to ensure zero errors.
