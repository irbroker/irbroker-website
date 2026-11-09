import React from "react";
import { renderToString } from "react-dom/server";
import { PREVIEW_SITE_ORIGIN } from "../../shared/site-origin";
import App from "./App";
import { media } from "./data/media";
import { pageMeta, routes, type PageMeta } from "./data/content";

export { PREVIEW_SITE_ORIGIN };

export type RenderedPage = {
  body: string;
  title: string;
  description: string;
  image: string;
  ogType?: "article" | "website";
};

export const paths = routes.map((route) => route.path);

type AppProps = { path?: string };
const AppWithPath = App as unknown as React.ComponentType<AppProps>;

function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

function mediaSource(meta: PageMeta): string {
  return media[meta.imageKey].ogSrc;
}

export function renderPage(path: string): RenderedPage {
  const normalizedPath = normalizePath(path);
  const meta = pageMeta(normalizedPath);
  const body = renderToString(
    React.createElement(AppWithPath, { path }),
  );

  return {
    body,
    title: meta.title,
    description: meta.description,
    image: mediaSource(meta),
    ogType: meta.ogType,
  };
}
