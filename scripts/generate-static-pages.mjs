// Runs after `vite build` (see package.json's "build" script). For each of
// the 24 Coleção completa products, writes a real static file —
// dist/doces/<slug>/index.html — with that product's own title, meta
// description, canonical, og:title/description/url/image, and real
// indexable content (name, description, price) already in the HTML. Also
// writes dist/sitemap.xml (Home + the 24 product URLs).
//
// No SSR, no Edge Middleware, no new framework: every generated file is a
// byte-for-byte copy of the already-built dist/index.html (so it carries
// the exact same compiled <script>/<link> tags Vite just produced), with
// only the <head> tags and the #root placeholder content replaced by
// plain string templating. The compiled JS bundle is the same for every
// page — main.jsx's ReactDOM.createRoot(...).render(<App />) replaces
// whatever is inside #root the instant it mounts (this app never calls
// hydrateRoot), so the static content below is purely for whoever/
// whatever reads the HTML before JS runs (crawlers, or a user's browser
// for the first paint) — never duplicated after mount.
//
// Single source of truth: PRODUCTS (src/data/products.js), read through
// the exact same utils/products.js helpers CatalogScreen.jsx and
// ProductDetailSheet.jsx already use (getColecaoCompletaProducts,
// cardPriceLine, productDescription, defaultPhotos) — a static page can
// never show a different price/description than the live app, and never
// invents one for a "Sob consulta 💬" product (that exact string just
// passes through, like everywhere else).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../src/config/site.js";
import { getColecaoCompletaProducts, cardPriceLine, productDescription, defaultPhotos } from "../src/utils/products.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "..", "dist");
const FALLBACK_IMAGE = `${SITE_URL}/images/products/bolo-de-pote-camadas.jpg`;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function replaceOne(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`generate-static-pages: tag esperada não encontrada em dist/index.html (${label}). Build abortado.`);
  }
  return html.replace(regex, replacement);
}

function buildProductHtml(template, p) {
  // Deliberately the .jpg from defaultPhotos(), not its .webp sibling
  // (every product photo has one, see generate-webp.mjs): WebP support for
  // og:image/twitter:image specifically (as opposed to in-browser <img>,
  // where it's universally fine) has a long, well-documented history of
  // being unreliable on Facebook/WhatsApp's crawler (Meta's shared
  // infrastructure) — the exact channel this business actually gets
  // shared through. A broken/missing preview on the one platform that
  // matters most here is a worse outcome than a few hundred KB of extra
  // transfer on a link preview fetch. Revisit only if that compatibility
  // story changes.
  const photo = defaultPhotos(p)?.[0];
  const imageUrl = photo ? `${SITE_URL}${photo}` : FALLBACK_IMAGE;
  const pageUrl = `${SITE_URL}/doces/${p.slug}`;
  const title = `${p.name} | Mon Caramel`;
  const description = productDescription(p);
  const priceLine = cardPriceLine(p) || p.price || "";

  let html = template;
  html = replaceOne(html, /<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`, "title");
  html = replaceOne(
    html,
    /<meta name="description" content=".*?" \/>/s,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    "meta description"
  );
  html = replaceOne(html, /<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${pageUrl}" />`, "canonical");
  html = replaceOne(
    html,
    /<meta property="og:title" content=".*?" \/>/s,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    "og:title"
  );
  html = replaceOne(
    html,
    /<meta property="og:description" content=".*?" \/>/s,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    "og:description"
  );
  html = replaceOne(html, /<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${pageUrl}" />`, "og:url");
  html = replaceOne(
    html,
    /<meta property="og:image" content=".*?" \/>/s,
    `<meta property="og:image" content="${imageUrl}" />`,
    "og:image"
  );
  // Twitter/X Card — same already-computed title/description/imageUrl as
  // the og: tags just above, never a separately hand-written value.
  html = replaceOne(
    html,
    /<meta name="twitter:title" content=".*?" \/>/s,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    "twitter:title"
  );
  html = replaceOne(
    html,
    /<meta name="twitter:description" content=".*?" \/>/s,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    "twitter:description"
  );
  html = replaceOne(
    html,
    /<meta name="twitter:image" content=".*?" \/>/s,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    "twitter:image"
  );

  // Real, indexable content — no width/height on the <img> (several real
  // photos have different native dimensions; this block only ever has to
  // be valid, legible HTML for a non-JS reader, not laid out nicely, since
  // React replaces it the instant it mounts for every real visitor).
  const staticBody = [
    "<main>",
    `<h1>${escapeHtml(p.name)}</h1>`,
    photo ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(p.name)}" />` : "",
    p.sensory ? `<p>${escapeHtml(p.sensory)}</p>` : "",
    priceLine ? `<p>${escapeHtml(priceLine)}</p>` : "",
    "</main>",
  ].join("");
  html = replaceOne(html, /<div id="root"><\/div>/, `<div id="root">${staticBody}</div>`, "#root placeholder");

  return html;
}

function main() {
  const indexPath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("generate-static-pages: dist/index.html não encontrado — rode `vite build` antes deste script.");
    process.exit(1);
  }
  const template = fs.readFileSync(indexPath, "utf8");

  const products = getColecaoCompletaProducts();

  // Validar unicidade dos slugs antes de escrever qualquer arquivo — um
  // slug ausente ou duplicado aborta o build em vez de gerar páginas
  // erradas silenciosamente.
  const seen = new Set();
  for (const p of products) {
    if (!p.slug) throw new Error(`generate-static-pages: produto "${p.id}" (Coleção completa) está sem slug.`);
    if (seen.has(p.slug)) throw new Error(`generate-static-pages: slug duplicado "${p.slug}".`);
    seen.add(p.slug);
  }

  for (const p of products) {
    const html = buildProductHtml(template, p);
    const outDir = path.join(DIST_DIR, "doces", p.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
  }

  const urls = [{ loc: `${SITE_URL}/`, priority: "1.0" }, ...products.map((p) => ({ loc: `${SITE_URL}/doces/${p.slug}`, priority: "0.8" }))];
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf8");

  console.log(`generate-static-pages: ${products.length} páginas de produto + sitemap.xml (${urls.length} URLs) geradas em dist/.`);
}

main();
