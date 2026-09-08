import { useEffect, useRef } from "react";
import { languageDetails, textDirection, translateDisplayText } from "./i18n.js";

const TRANSLATED_ATTRIBUTES = ["aria-label", "placeholder", "title", "label", "alt"];
const ORIGINAL_ATTRIBUTES = new WeakMap();
const ORIGINAL_TEXT = new WeakMap();
const LAST_TRANSLATED_TEXT = new WeakMap();

function isProtected(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return !element || Boolean(element.closest("script, style, [data-no-translate]"));
}

export function LocalizedSurface({ language = "en", page = "dashboard", corrections, children }) {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const translateNode = (node) => {
      if (isProtected(node)) return;
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement?.closest('textarea, input')) return;
        if (!ORIGINAL_TEXT.has(node) || (LAST_TRANSLATED_TEXT.has(node) && node.nodeValue !== LAST_TRANSLATED_TEXT.get(node))) ORIGINAL_TEXT.set(node, node.nodeValue);
        const original = ORIGINAL_TEXT.get(node);
        const next = translateDisplayText(language, original, corrections);
        LAST_TRANSLATED_TEXT.set(node, next);
        if (node.nodeValue !== next) node.nodeValue = next;
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      for (const attribute of TRANSLATED_ATTRIBUTES) {
        if (!node.hasAttribute(attribute)) continue;
        const values = ORIGINAL_ATTRIBUTES.get(node) || {};
        const current = node.getAttribute(attribute);
        const previous = values[attribute];
        const original = previous && current === previous.translated ? previous.original : current;
        const translated = translateDisplayText(language, original, corrections);
        values[attribute] = { original, translated };
        ORIGINAL_ATTRIBUTES.set(node, values);
        if (current !== translated) node.setAttribute(attribute, translated);
      }
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) translateNode(walker.currentNode);
      // Descendant attributes are not visited by a text-only TreeWalker.
      for (const element of node.querySelectorAll('[aria-label], [placeholder], [title], [label], [alt]')) {
        if (isProtected(element)) continue;
        const values = ORIGINAL_ATTRIBUTES.get(element) || {};
        for (const attribute of TRANSLATED_ATTRIBUTES) {
          if (!element.hasAttribute(attribute)) continue;
          const current = element.getAttribute(attribute);
          const previous = values[attribute];
          const original = previous && current === previous.translated ? previous.original : current;
          const translated = translateDisplayText(language, original, corrections);
          values[attribute] = { original, translated };
          if (current !== translated) element.setAttribute(attribute, translated);
        }
        ORIGINAL_ATTRIBUTES.set(element, values);
      }
    };
    translateNode(root);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateNode(record.target);
        if (record.type === "attributes") translateNode(record.target);
        for (const node of record.addedNodes) translateNode(node);
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TRANSLATED_ATTRIBUTES });
    document.documentElement.lang = languageDetails(language).locale;
    document.documentElement.dir = textDirection(language);
    document.title = `NASAQ Ledger — ${translateDisplayText(language, page)}`;
    try { localStorage.setItem("pocket-ledger-language", language); } catch { /* storage can be unavailable in private mode */ }
    return () => observer.disconnect();
  }, [language, page, corrections]);
  return <div ref={rootRef} className="localized-surface">{children}</div>;
}
