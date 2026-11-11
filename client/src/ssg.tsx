import React from "react";
import { renderToString } from "react-dom/server";
import { SITE_ORIGIN } from "../../shared/site-origin";
import App from "./App";
import { media } from "./data/media";
import { pageMeta, routes } from "./data/content";
export { redirects } from "./data/content";
import { structuredData } from "./components/StructuredData";

export { SITE_ORIGIN };

export type RenderedPage = {
  body: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ogType?: "article" | "website";
  noindex?: boolean;
  jsonLd?: object;
};

export const paths = routes.map((route) => route.path);

type AppProps = { path?: string };
const AppWithPath = App as unknown as React.ComponentType<AppProps>;

function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

export function renderPage(path: string, origin?: string): RenderedPage {
  const normalizedPath = normalizePath(path);
  const meta = pageMeta(normalizedPath);
  const body = renderToString(
    React.createElement(AppWithPath, { path }),
  );

  const image = media[meta.imageKey];
  return {
    body,
    title: meta.title,
    description: meta.description,
    image: image.ogSrc,
    // O alt de media.ts pode ficar vazio (imagem decorativa no site); no compartilhamento usa o título.
    imageAlt: image.alt || meta.title,
    ogType: meta.ogType,
    noindex: meta.noindex,
    jsonLd: origin && !meta.noindex ? structuredData(normalizedPath, origin, image.ogSrc) : undefined,
  };
}
