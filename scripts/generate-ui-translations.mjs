import { readFile, writeFile } from "node:fs/promises";

const files = ["src/App.jsx", "src/AuthScreen.jsx", "src/LedgerView.jsx"];
const sources = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n").replaceAll("Pocket Ledger", "NASAQ Ledger");
const phrases = new Set();
for (const match of sources.matchAll(/>([^<>{}\n]*[A-Za-z][^<>{}\n]*)</g)) phrases.add(match[1].replace(/\s+/g, " ").trim());
for (const match of sources.matchAll(/(?:aria-label|placeholder|title)="([^"]*[A-Za-z][^"]*)"/g)) phrases.add(match[1].trim());
for (const match of sources.matchAll(/(?:setToast|setMessage|Error|confirm)\("([^"]*[A-Za-z][^"]*)"\)/g)) phrases.add(match[1].trim());
for (const match of sources.matchAll(/"([A-Z][A-Za-z][^"\n]{2,120})"/g)) {
  const value = match[1].trim();
  if (/^(?:[A-Za-z][A-Za-z &/+’,.'?₹…-]+)$/.test(value) && !/^(?:Asia|Pocket Ledger —|Content-Type|GET|POST|PUT|JPG|PNG|WebP)/.test(value)) phrases.add(value);
}
[
  "Daily Expense Tracker", "Add expense", "Log expense", "Save expense", "Cancel", "Delete", "Edit", "Close", "Today", "Yesterday",
  "Previous month", "Next month", "Choose month", "Search", "Amount", "Date", "Category", "Sub-category", "Payment method", "Payment method / mode",
  "Optional", "Monthly budget", "Spent", "Remaining", "used", "Profile", "Your profile", "Add profile picture", "Change profile picture", "Dark mode",
  "Light theme", "Dark theme", "All", "Daily", "Weekly", "Monthly", "One-off", "Transactions", "Settings", "Analytics", "Ledger", "Categories",
  "Cash", "Net Banking", "Debit Card", "Credit Card", "Mobile Wallet", "Other", "Merchant / shop", "Expense name", "Planned", "Recorded", "Archived",
  "Custom", "Enabled", "On", "Off", "Sign in", "Sign out", "Password", "Email address", "Your name", "Create account", "Please wait…",
].forEach((phrase) => phrases.add(phrase));
phrases.delete("");

const languageTargets = { as: "as", bn: "bn", brx: "hi", doi: "doi", gu: "gu", hi: "hi", kn: "kn", ks: "ur", kok: "gom", mai: "mai", ml: "ml", mni: "mni-Mtei", mr: "mr", ne: "ne", or: "or", pa: "pa", sa: "sa", sat: "sat", sd: "sd", ta: "ta", te: "te", ur: "ur" };
const keys = [...phrases].sort((a, b) => a.localeCompare(b));
const translations = {};

await Promise.all(Object.entries(languageTargets).map(async ([code, target]) => {
  translations[code] = {};
  for (let offset = 0; offset < keys.length; offset += 18) {
    const batch = keys.slice(offset, offset + 18);
    const params = new URLSearchParams({ client: "dict-chrome-ex", sl: "en", tl: target });
    batch.forEach((text) => params.append("q", text.replaceAll("NASAQ Ledger", "__NASAQ_LEDGER__")));
    const response = await fetch(`https://clients5.google.com/translate_a/t?${params}`);
    if (!response.ok) throw new Error(`${code} translation failed with ${response.status}`);
    const result = await response.json();
    const values = Array.isArray(result) ? result : [result];
    batch.forEach((key, index) => { translations[code][key] = String(values[index] ?? key).replaceAll("__NASAQ_LEDGER__", "NASAQ Ledger").replaceAll("NASAQ_LEDGER", "NASAQ Ledger"); });
  }
  process.stdout.write(`${code} ${Object.keys(translations[code]).length}\n`);
}));

await writeFile("src/i18n.generated.js", `// Generated static UI translations. User-entered ledger content is intentionally excluded.\nexport const GENERATED_UI_TRANSLATIONS = ${JSON.stringify(translations, null, 2)};\n`, "utf8");
