export type EditorialMeta = {
  title: string;
  description: string;
  image: string;
  ogType?: "article" | "website";
};

const ROOT_RE = /<div\b[^>]*\bid=["']root["'][^>]*>[\s\S]*?<\/div>/i;
const TITLE_RE = /<title\b[^>]*>[\s\S]*?<\/title>/i;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replaceOrAppendMeta(
  html: string,
  attribute: "name" | "property",
  key: string,
  content: string,
): string {
  const escapedContent = escapeHtml(content);
  const tag = `<meta ${attribute}="${key}" content="${escapedContent}" />`;
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}\\s*=\\s*["']${key}["'])[^>]*>`,
    "i",
  );

  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

export function replaceRoot(html: string, body: string): string {
  const root = `<div id="root">${body}</div>`;
  if (ROOT_RE.test(html)) return html.replace(ROOT_RE, root);
  return html.replace(/<body\b[^>]*>/i, (match) => `${match}\n    ${root}`);
}

export function replaceTitle(html: string, title: string): string {
  const tag = `<title>${escapeHtml(title)}</title>`;
  if (TITLE_RE.test(html)) return html.replace(TITLE_RE, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

export function injectEditorialMetadata(html: string, meta: EditorialMeta): string {
  let next = replaceTitle(html, meta.title);
  next = replaceOrAppendMeta(next, "name", "description", meta.description);
  next = replaceOrAppendMeta(next, "property", "og:title", meta.title);
  next = replaceOrAppendMeta(next, "property", "og:description", meta.description);
  next = replaceOrAppendMeta(next, "property", "og:image", meta.image);
  next = replaceOrAppendMeta(next, "property", "og:type", meta.ogType ?? "website");
  next = replaceOrAppendMeta(next, "property", "og:site_name", "irbroker");
  next = replaceOrAppendMeta(next, "name", "twitter:card", "summary_large_image");
  next = replaceOrAppendMeta(next, "name", "twitter:title", meta.title);
  next = replaceOrAppendMeta(next, "name", "twitter:description", meta.description);
  next = replaceOrAppendMeta(next, "name", "twitter:image", meta.image);
  return next;
}

export function injectEditorialPage(
  html: string,
  body: string,
  meta: EditorialMeta,
): string {
  return injectEditorialMetadata(replaceRoot(html, body), meta);
}

export function injectNotFoundPage(html: string): string {
  const body =
    '<main><h1>irbroker</h1><p><a href="/">irbroker</a></p></main>';
  const withPage = replaceTitle(replaceRoot(html, body), "irbroker");
  return replaceOrAppendMeta(withPage, "name", "robots", "noindex");
}

export function normalizeRoutePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

export function isHtmlRouteRequest(path: string): boolean {
  const normalized = normalizeRoutePath(path);
  if (
    normalized === "/manus-routes.json" ||
    normalized === "/robots.txt" ||
    normalized === "/sitemap.xml" ||
    normalized === "/favicon.ico"
  ) {
    return false;
  }

  const excludedPrefixes = [
    "/api",
    "/__manus__",
    "/__system__",
    "/manus-oauth",
    "/manus-storage",
    "/src",
    "/assets",
  ];
  if (
    normalized.startsWith("/@") ||
    excludedPrefixes.some(
      (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
    )
  ) {
    return false;
  }

  return !normalized.split("/").some((segment) => segment.includes("."));
}
