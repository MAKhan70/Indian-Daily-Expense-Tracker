import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function pngSize(relativePath) {
  const bytes = await readFile(new URL(relativePath, root));
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test("provides an installable standalone web app manifest", async () => {
  const manifest = JSON.parse(await readFile(new URL("public/manifest.webmanifest", root), "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.deepEqual(manifest.display_override, ["standalone", "minimal-ui", "browser"]);
  assert.equal(manifest.start_url, "./?source=pwa");
  assert.equal(manifest.prefer_related_applications, false);
  assert.equal(manifest.name, "NASAQ Ledger — Daily Expense Tracker");
  assert.equal(manifest.short_name, "NASAQ Ledger");
  assert.ok(manifest.short_name);
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
  assert.ok(manifest.icons.every((icon) => icon.src.includes("nasaq-")));
});

test("ships correctly sized PWA and Apple icons", async () => {
  assert.deepEqual(await pngSize("public/icons/nasaq-icon-192-v1.png"), { width: 192, height: 192 });
  assert.deepEqual(await pngSize("public/icons/nasaq-icon-512-v1.png"), { width: 512, height: 512 });
  assert.deepEqual(await pngSize("public/icons/nasaq-maskable-512-v1.png"), { width: 512, height: 512 });
  assert.deepEqual(await pngSize("public/icons/nasaq-apple-touch-icon-v1.png"), { width: 180, height: 180 });
});

test("links the manifest and registers an offline application shell", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const main = await readFile(new URL("src/main.jsx", root), "utf8");
  const serviceWorker = await readFile(new URL("public/sw.js", root), "utf8");
  assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(html, /apple-touch-icon/);
  assert.match(html, /mobile-web-app-capable/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(main, /serviceWorker\.register\(new URL\("sw\.js", document\.baseURI\), \{ updateViaCache: "none" \}\)/);
  assert.match(html, /nasaq-apple-touch-icon-v1\.png/);
  assert.match(serviceWorker, /nasaq-ledger-shell-v15/);
  assert.match(serviceWorker, /nasaq-icon-512-v1\.png/);
  assert.match(serviceWorker, /manifest\.webmanifest/);
  assert.match(serviceWorker, /cache: "no-store"/);
  assert.match(serviceWorker, /request\.mode === "navigate"/);
  assert.match(serviceWorker, /caches\.match\(scopedPath\("index\.html"\)\)/);
  assert.match(serviceWorker, /url\.pathname\.startsWith\(scopedPath\("api\/"\)\)\) return/);
});
