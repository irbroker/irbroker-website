import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(projectRoot, "dist", "public");
const templatePath = path.join(publicDirectory, "index.html");
const { renderPage, paths, SITE_ORIGIN } = await import("../dist/ssr/ssg.js");
const LASTMOD = "2026-11-09";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replaceOrAppendMeta(html, attribute, key, content) {
  const escapedContent = escapeHtml(content);
  const tag = `<meta ${attribute}="${key}" content="${escapedContent}" />`;
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}\\s*=\\s*["']${key}["'])[^>]*>`,
    "i",
  );
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

function replaceOrAppendCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  const pattern = /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/i;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

function replaceTitle(html, title) {
  const tag = `<title>${escapeHtml(title)}</title>`;
  const pattern = /<title\b[^>]*>[\s\S]*?<\/title>/i;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

function injectMetadata(html, page, origin, routePath) {
  const image = new URL(page.image, `${origin}/`).toString();
  // Idempotente: se dist/public/index.html já foi processado (SSG rodado de novo), remove o que é por rota.
  let next = html
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "")
    .replace(/\s*<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/gi, "")
    .replace(/\s*<meta\b(?=[^>]*\b(?:property="og:url"|name="robots"))[^>]*>/gi, "");
  next = replaceTitle(next, page.title);
  next = replaceOrAppendMeta(next, "name", "description", page.description);
  if (page.noindex) next = replaceOrAppendMeta(next, "name", "robots", "noindex");
  next = replaceOrAppendMeta(next, "property", "og:locale", "pt_BR");
  next = replaceOrAppendMeta(next, "property", "og:site_name", "irbroker");
  next = replaceOrAppendMeta(next, "property", "og:type", page.ogType ?? "website");
  next = replaceOrAppendMeta(next, "property", "og:title", page.title);
  next = replaceOrAppendMeta(next, "property", "og:description", page.description);
  next = replaceOrAppendMeta(next, "property", "og:image", image);
  next = replaceOrAppendMeta(next, "property", "og:image:width", "1200");
  next = replaceOrAppendMeta(next, "property", "og:image:height", "630");
  next = replaceOrAppendMeta(next, "property", "og:image:alt", page.imageAlt);
  next = replaceOrAppendMeta(next, "name", "twitter:card", "summary_large_image");
  next = replaceOrAppendMeta(next, "name", "twitter:title", page.title);
  next = replaceOrAppendMeta(next, "name", "twitter:description", page.description);
  next = replaceOrAppendMeta(next, "name", "twitter:image", image);
  next = replaceOrAppendMeta(next, "name", "twitter:image:alt", page.imageAlt);
  if (!page.noindex) {
    // Home = origem sem barra final; demais rotas = origem + caminho.
    const canonicalUrl = routePath === "/" ? origin : new URL(routePath, `${origin}/`).toString();
    next = replaceOrAppendMeta(next, "property", "og:url", canonicalUrl);
    next = replaceOrAppendCanonical(next, canonicalUrl);
  }
  if (page.jsonLd) {
    const json = JSON.stringify(page.jsonLd).replace(/</g, "\\u003c");
    next = next.replace(/<\/head>/i, () => `    <script type="application/ld+json">${json}</script>\n  </head>`);
  }
  return next;
}

function injectBody(html, body) {
  const root = /<div\b[^>]*\bid=["']root["'][^>]*>[\s\S]*?<\/div>/i;
  const replacement = `<div id="root">${body}</div>`;
  if (root.test(html)) return html.replace(root, replacement);
  return html.replace(/<body\b[^>]*>/i, (match) => `${match}\n    ${replacement}`);
}

// O script `build` passa --default-origin (domínio de shared/site-origin.ts), o que funciona no Windows sem cross-env.
// Sem PUBLIC_SITE_URL e sem essa flag o SSG falha, para nunca gerar robots com Disallow nem página sem canonical.
function publicSiteUrl() {
  const value =
    process.env.PUBLIC_SITE_URL?.trim() ||
    (process.argv.includes("--default-origin") ? SITE_ORIGIN : "");
  if (!value) {
    throw new Error(
      "PUBLIC_SITE_URL não definida. Rode `corepack pnpm build` (usa o domínio de shared/site-origin.ts) " +
        "ou defina PUBLIC_SITE_URL=https://www.irbroker.com.br antes de scripts/ssg.mjs.",
    );
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`PUBLIC_SITE_URL inválida: "${value}".`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`PUBLIC_SITE_URL precisa ser http(s): "${value}".`);
  }
  return url.origin;
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemap(origin) {
  const header = '<?xml version="1.0" encoding="UTF-8"?>';
  const entries = paths
    .filter((routePath) => !routePath.includes("?"))
    .map((routePath) => {
      const url = routePath === "/" ? origin : new URL(routePath, `${origin}/`).toString();
      return `  <url><loc>${xmlEscape(url)}</loc><lastmod>${LASTMOD}</lastmod></url>`;
    })
    .join("\n");
  return `${header}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function buildRobots(origin) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
}

const origin = publicSiteUrl();
const template = await fs.readFile(templatePath, "utf8");
for (const routePath of paths) {
  const page = renderPage(routePath, origin);
  const html = injectMetadata(injectBody(template, page.body), page, origin, routePath);
  const relativeDirectory = routePath === "/" ? "" : routePath.replace(/^\/+|\/+$/g, "");
  const outputDirectory = path.join(publicDirectory, relativeDirectory);
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(path.join(outputDirectory, "index.html"), html, "utf8");
}

// 404.html: rota desconhecida, com noindex e sem canonical (a hospedagem deve servi-lo com status 404).
const notFound = renderPage("/404", origin);
await fs.writeFile(
  path.join(publicDirectory, "404.html"),
  injectMetadata(injectBody(template, notFound.body), notFound, origin, "/404"),
  "utf8",
);

const sitemap = buildSitemap(origin);
await fs.writeFile(path.join(publicDirectory, "sitemap.xml"), sitemap, "utf8");
await fs.writeFile(path.join(projectRoot, "client", "public", "sitemap.xml"), sitemap, "utf8");
const robots = buildRobots(origin);
await fs.writeFile(path.join(publicDirectory, "robots.txt"), robots, "utf8");
await fs.writeFile(path.join(projectRoot, "client", "public", "robots.txt"), robots, "utf8");

console.log(`SSG gerado para ${paths.length} rotas + 404.html em ${publicDirectory} (origem ${origin}).`);
