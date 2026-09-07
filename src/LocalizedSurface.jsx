import { useEffect, useRef } from "react";
import { languageDetails, textDirection, translateDisplayText } from "./i18n.js";

const TRANSLATED_ATTRIBUTES = ["aria-label", "placeholder", "title"];
const ORIGINAL_TEXT = new WeakMap();
const LAST_TRANSLATED_TEXT = new WeakMap();

function isProtected(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return !element || Boolean(element.closest("script, style, [data-no-translate], input[type='text'], textarea"));
}

export function LocalizedSurface({ language = "en", page = "dashboard", children }) {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const translateNode = (node) => {
      if (isProtected(node)) return;
      if (node.nodeType === Node.TEXT_NODE) {
        if (!ORIGINAL_TEXT.has(node) || (LAST_TRANSLATED_TEXT.has(node) && node.nodeValue !== LAST_TRANSLATED_TEXT.get(node))) ORIGINAL_TEXT.set(node, node.nodeValue);
        const original = ORIGINAL_TEXT.get(node);
        const next = translateDisplayText(language, original);
        LAST_TRANSLATED_TEXT.set(node, next);
        if (node.nodeValue !== next) node.nodeValue = next;
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      for (const attribute of TRANSLATED_ATTRIBUTES) {
        if (!node.hasAttribute(attribute)) continue;
        const key = `data-i18n-original-${attribute.replace("aria-", "aria-")}`;
        const original = node.getAttribute(key) || node.getAttribute(attribute);
        node.setAttribute(key, original);
        node.setAttribute(attribute, translateDisplayText(language, original));
      }
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) translateNode(walker.currentNode);
    };
    translateNode(root);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateNode(record.target);
        for (const node of record.addedNodes) translateNode(node);
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    document.documentElement.lang = languageDetails(language).locale;
    document.documentElement.dir = textDirection(language);
    document.title = `NASAQ Ledger — ${translateDisplayText(language, page)}`;
    try { localStorage.setItem("pocket-ledger-language", language); } catch { /* storage can be unavailable in private mode */ }
    return () => observer.disconnect();
  }, [language, page]);
  return <div ref={rootRef} className="localized-surface">{children}</div>;
}
