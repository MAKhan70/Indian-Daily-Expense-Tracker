# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Approved Product Direction

- Use the selected Calm Bento direction as the visual source of truth: airy top navigation, quiet white surfaces, generous spacing, refined indigo actions, green financial accents, and responsive bento-style content regions.
- Use the full navigation set: Dashboard, Transactions, Ledger, Budget & Ledgers, Monthly Grocery List, Categories, Analytics, and Settings.
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
- Every recorded-expense edit and deletion requires a confirmation popup explaining that the active value changes, the prior value is archived, and dependent totals recalculate; do not use acknowledgement checkboxes.
- Preserve prior values as read-only, timestamped Archived snapshots whenever an expense is edited or deleted.
- The product name is NASAQ Ledger. Ship it as an installable HTTPS PWA with standalone display metadata, 192px/512px/maskable/Apple icons, an offline application shell, and an in-app install entry point.
- Prisma and account-backed synchronization are now authorized. Keep every finance query scoped by authenticated user ID, retain the one-time guarded local import, and never cache `/api` responses in the service worker.
- Keep the frontend and Better Auth API on the same production origin so mobile browsers can use secure first-party session cookies reliably.
- Dashboard greetings must show the authenticated user's name and derive the date and morning/afternoon/evening period explicitly from Asia/Kolkata time.
- Expense entry provides frequency-specific quick amounts: ₹5–₹100 Daily, ₹100–₹1,000 Weekly, ₹1,000–₹10,000 Monthly, and ₹10,000–₹50,000 One-off.
- Settings owns account-synced appearance controls for Light, Dark or Device theme, exactly 20 named colour palettes, and Soft Heritage or Clean & Crisp looks; the choices must apply consistently to both the website and installed PWA.
- Monthly categories include Family Pocket Money and Medicines by named family member, plus Postpaid Mobile Bill and WiFi Bill; One-off includes quarterly, half-yearly and yearly fund management fees.
- Categories are user-managed per frequency: users can enable or disable categories/sub-categories, move them with accessible up/down controls, and add their own. Disabled items disappear from future entry choices but remain attached to historical transactions.
- User-created entries use a small purple square, not a visible Custom suffix. Categories and sub-categories may be renamed or deleted with safeguards. Built-in names may be renamed while their stable IDs preserve ordering and prevent duplicate defaults; historical expense labels must survive deletions.
- Analytics chart visibility (Pie, Bar and Trend) is an account-synced preference, while payment-method drilldown remains available independently of the visible charts.
- Pie, Bar and Trend charts each support account-synced multiple parameter selections. Pie/Bar combine the selected dimensions without duplicating amounts; Trend overlays the selected series.
- Expense entry uses the custom Calm Bento calendar instead of the browser's native date field, with today/yesterday shortcuts, month navigation, clear selected/today states, and a mobile bottom-sheet treatment.
- Monthly Grocery List is a standalone, month-scoped planner and must never create expenses or affect budgets. It supports custom items, quantity/unit, optional unit price with calculated total, grocery segregation including custom groups, included/skipped status, purchased status, copying a previous month, and a separate analytics panel.
- Grocery prices are quoted for an explicit price quantity in the item's selected unit (e.g. ₹63 for 500 g). Total = purchase quantity / price quantity × quoted price, rounded to paise. Legacy rows default to price quantity 1; edits, copies and cloud sync preserve the pricing basis.
- Keep multi-select chart attributes within each Pie, Bar and Trend card using compact expandable controls. Dashboard trend and ring shortcuts open/focus the corresponding visible Analytics chart for the dashboard's month. Ring segment colours use the same Pie grouping/data order; the centre remains budget usage and the unused arc is neutral, never black from an invalid theme variable.
- Dashboard Spent and Trend tiles stay visible on phones. Advance/Credit summary tiles show defined, used and remaining/available amounts.
- Monthly Grocery List sharing is explicitly WhatsApp-oriented and must include only included item names and quantities; prices and skipped items must never be placed in the share payload.
- Keep English as the default language and offer all 22 Eighth Schedule Indian languages as account-synced choices. Translate display text and accessible attributes with the built-in packs and account-synced offline corrections, preserving original stored/editable values and stable option values. Never use an external translation provider: the user explicitly revoked that permission on 8 September 2026. Unknown phrases must remain intact, not be falsely presented as accurately translated. Persist the language choice through sign-out and use RTL direction for Urdu, Kashmiri and Sindhi.
- Dashboard and Budget usage tiles drill into Transactions with the selected month and Budget/Advance/Credit filter. Merchant account usage drills into its exact payment ID. Transactions default to all frequencies, offer day/week/month totals by payment ID and retain the original editable rows; never create duplicate expenses for summaries. Credit Card is a normal budget payment; only Credit Borrow 1–5 is excluded.
- Clicking the logo or its nearby brand area toggles A/B once per click, keeping the selected logo visible; respect reduced motion. Mobile budget percentages must remain on one line.
- Browser support targets current Android Chromium browsers plus iOS/iPadOS Safari 15 and newer. Use progressive enhancement for install prompts, sharing, image decoding and view transitions; mutable PWA shell files must never receive immutable year-long cache headers.
- Grocery layouts must respond to their own available width and retain a phone layout on coarse-pointer landscape devices instead of switching to a desktop-like WebView arrangement.
- Transaction rows show the recorded date immediately below each amount on desktop and mobile.
- AI Analysis must remain privacy-first and transparent: derive insights locally from aggregate ledger totals. Do not send transaction data to an external AI provider without the user's explicit approval and a clearly described data-sharing choice.
- Use fluid, progressive page transitions and responsive interaction polish, while fully respecting `prefers-reduced-motion`.
