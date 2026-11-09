import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(projectRoot, "dist", "public");
const templatePath = path.join(publicDirectory, "index.html");
const { renderPage, paths, PREVIEW_SITE_ORIGIN } = await import("../dist/ssr/ssg.js");

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
  let next = replaceTitle(html, page.title);
  next = replaceOrAppendMeta(next, "name", "description", page.description);
  next = replaceOrAppendMeta(next, "property", "og:title", page.title);
  next = replaceOrAppendMeta(next, "property", "og:description", page.description);
  next = replaceOrAppendMeta(next, "property", "og:image", page.image);
  next = replaceOrAppendMeta(next, "property", "og:type", page.ogType ?? "website");
  next = replaceOrAppendMeta(next, "property", "og:site_name", "irbroker");
  next = replaceOrAppendMeta(next, "name", "twitter:card", "summary_large_image");
  next = replaceOrAppendMeta(next, "name", "twitter:title", page.title);
  next = replaceOrAppendMeta(next, "name", "twitter:description", page.description);
  next = replaceOrAppendMeta(next, "name", "twitter:image", page.image);
  if (origin) {
    const canonicalUrl = new URL(routePath, `${origin}/`).toString();
    next = replaceOrAppendMeta(next, "property", "og:url", canonicalUrl);
    next = replaceOrAppendCanonical(next, canonicalUrl);
  }
  return next;
}

function injectBody(html, body) {
  const root = /<div\b[^>]*\bid=["']root["'][^>]*>[\s\S]*?<\/div>/i;
  const replacement = `<div id="root">${body}</div>`;
  if (root.test(html)) return html.replace(root, replacement);
  return html.replace(/<body\b[^>]*>/i, (match) => `${match}\n    ${replacement}`);
}

function publicSiteUrl() {
  const value = process.env.PUBLIC_SITE_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
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
  const sitemapOrigin = origin ?? PREVIEW_SITE_ORIGIN;
  const notice = origin
    ? ""
    : "<!-- PUBLIC_SITE_URL não configurada; estas URLs explícitas de Preview não devem ser indexadas. -->\n";
  const entries = paths
    .map((routePath) => {
      const url = new URL(routePath, `${sitemapOrigin}/`).toString();
      return `  <url><loc>${xmlEscape(url)}</loc></url>`;
    })
    .join("\n");
  return `${header}\n${notice}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function buildRobots(origin) {
  if (!origin) {
    return "User-agent: *\nDisallow: /\n\n# A origem pública ainda não foi configurada.\n";
  }
  return `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
}

const template = await fs.readFile(templatePath, "utf8");
const origin = publicSiteUrl();
for (const routePath of paths) {
  const page = renderPage(routePath);
  const html = injectMetadata(injectBody(template, page.body), page, origin, routePath);
  const relativeDirectory = routePath === "/" ? "" : routePath.replace(/^\/+|\/+$/g, "");
  const outputDirectory = path.join(publicDirectory, relativeDirectory);
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(path.join(outputDirectory, "index.html"), html, "utf8");
}

const sitemap = buildSitemap(origin);
await fs.writeFile(path.join(publicDirectory, "sitemap.xml"), sitemap, "utf8");
await fs.writeFile(path.join(projectRoot, "client", "public", "sitemap.xml"), sitemap, "utf8");
await fs.writeFile(path.join(publicDirectory, "robots.txt"), buildRobots(origin), "utf8");

console.log(`SSG gerado para ${paths.length} rotas em ${publicDirectory}.`);
