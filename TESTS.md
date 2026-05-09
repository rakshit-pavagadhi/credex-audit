# Automated Tests

We use Vitest for automated testing because of its native TypeScript support and speed.

## Minimum Required Tests

The assignment requires a minimum of 5 tests covering the audit engine specifically. We have implemented 18 tests.

### `tests/audit-engine.test.ts`
Tests the core logic and recommendations of the audit engine.

- **`should return a valid report with results for each entry`**: Verifies that a valid basic audit produces results.
- **`should identify Credex savings for paid plans`**: Verifies that any paid plan properly registers a Credex savings recommendation.
- **`should handle multiple tool entries`**: Checks that the audit engine scales to multiple inputs and aggregates savings correctly.
- **`should suggest downgrade for heavy plan on light use`**: Tests Dimension 1 (Right plan for usage). If a user is on an "Ultra" plan but only does light writing, it should recommend a downgrade.
- **`should suggest individual plans when team plan has few seats`**: Tests another Dimension 1 case. If 2 users are on a $40/seat Teams plan, it should recommend switching to 2 individual $20/mo Pro plans.
- **`should handle free plan users gracefully`**: Ensures users on free plans get a "keep" recommendation with $0 savings.
- **`should calculate correct totals`**: Verifies the math for current spend, recommended spend, monthly savings, and annual savings.
- **`should include company name and team size when provided`**: Verifies metadata passthrough.
- **`should handle API tools (no downgrade possible)`**: Tests API edge cases where tier downgrades don't apply.
- **`should cross-recommend cheaper tools`**: Tests Dimension 3 (Cheaper alternative).

### `tests/pricing-data.test.ts`
Tests to ensure the integrity of the pricing data (which is critical for the audit engine to function correctly).

- **`should have all 8 required tools`**: Verifies presence of Cursor, Copilot, Claude, ChatGPT, OpenAI API, Anthropic API, Gemini, Windsurf.
- **`should have valid pricing URLs for all tools`**: Ensures every number traces back to a source URL.
- **`should have non-negative prices for all plans`**: Sanity check for data integrity.
- **`should have at least one plan per tool`**: Verifies completeness.
- **`should have unique plan IDs within each tool`**: Prevents UI bugs in the selector.
- **`should return correct plan with getPlan`**: Tests the helper function.
- **`should have lastVerified dates for all tools`**: Ensures we meet the assignment requirement of verifiable dates.
- **`should have valid categories for all tools`**: Verifies the grouping logic for the UI.

## How to run the tests

To run all tests locally:

```bash
npm run test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

Tests are also automatically run on every push and pull request to the `main` branch via the `.github/workflows/ci.yml` workflow.
