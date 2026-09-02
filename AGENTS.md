# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Approved Product Direction

- Preserve the aubergine, chalk-white, turmeric, and sage Daily Plan visual direction.
- Use the full navigation set: Dashboard, Transactions, Ledger, Budget & Ledgers, Categories, Analytics, and Settings.
- The add-expense flow must offer Cash, UPI, Net Banking, broad common payment methods, Advance 1–5, and Credit 1–5.
- Advance and Credit labels are configurable payment sources and must remain easy to select on mobile.
- Expenses are classified separately as Daily, Weekly, Monthly, or One-off across entry, browsing, categories, and analytics.
- Advance Payment 1–5 track merchant names, prepaid amounts, usage, and remaining balances outside the monthly budget.
- Credit Borrow 1–5 track merchant names, credit limits, usage, and available credit outside the monthly budget.
- Every non-Advance/non-Credit transaction consumes the user-editable monthly budget.
- Analytics must support payment-method drilldown with totals, counts, shares, and underlying transactions.
- The Log Expense drawer must fit the viewport without horizontal scrolling; its frequency control reflows instead of requiring sideways navigation.
- Ledger is a navigable month/year calendar. Selecting a date reveals its records and lets users add a past/current expense or a future planned expense.
- Future planned expenses remain outside completed-spend totals until converted to an actual entry and support in-app month-before, week-before, both, or no reminder.
- Ledger-originated edits require three explicit acknowledgements: the active value is replaced, the prior value is archived, and dependent totals recalculate.
- Preserve prior values as read-only, timestamped Archived snapshots whenever an expense is edited or deleted.
- Ship Pocket Ledger as an installable HTTPS PWA with standalone display metadata, 192px/512px/maskable/Apple icons, an offline application shell, and an in-app install entry point.
- Prisma and account-backed synchronization are now authorized. Keep every finance query scoped by authenticated user ID, retain the one-time guarded local import, and never cache `/api` responses in the service worker.
- Keep the frontend and Better Auth API on the same production origin so mobile browsers can use secure first-party session cookies reliably.
- Dashboard greetings must show the authenticated user's name and derive the date and morning/afternoon/evening period explicitly from Asia/Kolkata time.
- Expense entry provides frequency-specific quick amounts: ₹5–₹100 Daily, ₹100–₹1,000 Weekly, ₹1,000–₹10,000 Monthly, and ₹10,000–₹50,000 One-off.
- Settings owns account-synced appearance controls for Light, Dark or Device theme, multiple colour palettes, and Soft Heritage or Clean & Crisp looks; the choices must apply consistently to both the website and installed PWA.
- Monthly categories include Family Pocket Money and Medicines by named family member, plus Postpaid Mobile Bill and WiFi Bill; One-off includes quarterly, half-yearly and yearly fund management fees.
- Categories are user-managed per frequency: users can enable or disable categories/sub-categories, move them with accessible up/down controls, and add their own. Disabled items disappear from future entry choices but remain attached to historical transactions.
- Analytics chart visibility (Pie, Bar and Trend) is an account-synced preference, while payment-method drilldown remains available independently of the visible charts.
- AI Analysis must remain privacy-first and transparent: derive insights locally from aggregate ledger totals. Do not send transaction data to an external AI provider without the user's explicit approval and a clearly described data-sharing choice.
- Use fluid, progressive page transitions and responsive interaction polish, while fully respecting `prefers-reduced-motion`.
