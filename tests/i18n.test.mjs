import assert from "node:assert/strict";
import test from "node:test";
import { groceryShareText, INDIAN_LANGUAGES, navText, SUPPORTED_LANGUAGE_CODES, textDirection, translateDisplayText, uiText } from "../src/i18n.js";
import { GENERATED_UI_TRANSLATIONS } from "../src/i18n.generated.js";

test("ships English plus all 22 scheduled Indian language packs", () => {
  assert.equal(INDIAN_LANGUAGES.length, 23);
  assert.equal(new Set(SUPPORTED_LANGUAGE_CODES).size, 23);
  assert.equal(INDIAN_LANGUAGES[0].code, "en");
  for (const language of INDIAN_LANGUAGES) {
    assert.ok(language.nativeName);
    assert.ok(language.regions);
    assert.notEqual(navText(language.code, "groceries"), "groceries");
  }
});

test("every shipped language localises common application controls", () => {
  for (const language of INDIAN_LANGUAGES.slice(1)) {
    assert.ok(Object.keys(GENERATED_UI_TRANSLATIONS[language.code]).length >= 1000, `${language.code} complete UI and domain catalog`);
    assert.notEqual(uiText(language.code, "Add expense"), "Add expense", language.code);
    assert.notEqual(uiText(language.code, "Payment method / mode"), "Payment method / mode", language.code);
    assert.notEqual(uiText(language.code, "Sign out"), "Sign out", language.code);
  }
  assert.equal(translateDisplayText("hi", "Today · August 2026"), "आज · अगस्त 2026");
  assert.notEqual(uiText("ur", "Vegetables & Fruits"), "Vegetables & Fruits");
  assert.notEqual(uiText("hi", "General Grocery"), "General Grocery");
  assert.notEqual(uiText("bn", "Cash"), "Cash");
  assert.equal(uiText("ur", "Pocket Ledger"), "NASAQ Ledger");
  assert.match(uiText("hi", "Install Pocket Ledger"), /NASAQ Ledger/);
  assert.notEqual(translateDisplayText("ur", "Monday, 7 September 2026"), "Monday, 7 September 2026");
});

test("Urdu, Kashmiri and Sindhi use right-to-left document direction", () => {
  assert.equal(textDirection("ur"), "rtl");
  assert.equal(textDirection("ks"), "rtl");
  assert.equal(textDirection("sd"), "rtl");
  assert.equal(textDirection("hi"), "ltr");
});

test("WhatsApp grocery copy contains quantities but never price data", () => {
  const text = groceryShareText([
    { name: "Wheat Flour", groupName: "Grains & Flour", quantity: 5, unit: "kg", unitPrice: 45, included: true, purchased: false },
    { name: "Turmeric", groupName: "Spices", quantity: 1, unit: "pack", unitPrice: 80, included: false, purchased: false },
  ], "2026-09", "hi");
  assert.match(text, /Wheat Flour — 5 kg/);
  assert.doesNotMatch(text, /45|₹|price per unit/i);
  assert.doesNotMatch(text, /Turmeric/);
});
