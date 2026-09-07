import assert from "node:assert/strict";
import test from "node:test";
import { groceryShareText, INDIAN_LANGUAGES, navText, SUPPORTED_LANGUAGE_CODES } from "../src/i18n.js";

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

test("WhatsApp grocery copy contains quantities but never price data", () => {
  const text = groceryShareText([
    { name: "Wheat Flour", groupName: "Grains & Flour", quantity: 5, unit: "kg", unitPrice: 45, included: true, purchased: false },
    { name: "Turmeric", groupName: "Spices", quantity: 1, unit: "pack", unitPrice: 80, included: false, purchased: false },
  ], "2026-09", "hi");
  assert.match(text, /Wheat Flour — 5 kg/);
  assert.doesNotMatch(text, /45|₹|price per unit/i);
  assert.doesNotMatch(text, /Turmeric/);
});
