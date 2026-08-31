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
  assert.equal(manifest.start_url, "./?source=pwa");
  assert.equal(manifest.prefer_related_applications, false);
  assert.ok(manifest.name);
  assert.ok(manifest.short_name);
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
});

test("ships correctly sized PWA and Apple icons", async () => {
  assert.deepEqual(await pngSize("public/icons/icon-192.png"), { width: 192, height: 192 });
  assert.deepEqual(await pngSize("public/icons/icon-512.png"), { width: 512, height: 512 });
  assert.deepEqual(await pngSize("public/icons/maskable-512.png"), { width: 512, height: 512 });
  assert.deepEqual(await pngSize("public/icons/apple-touch-icon.png"), { width: 180, height: 180 });
});

test("links the manifest and registers an offline application shell", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  const main = await readFile(new URL("src/main.jsx", root), "utf8");
  const serviceWorker = await readFile(new URL("public/sw.js", root), "utf8");
  assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(html, /apple-touch-icon/);
  assert.match(main, /serviceWorker\.register\(new URL\("sw\.js", document\.baseURI\)\)/);
  assert.match(serviceWorker, /request\.mode === "navigate"/);
  assert.match(serviceWorker, /caches\.match\(scopedPath\("index\.html"\)\)/);
});
