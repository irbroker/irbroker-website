import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { routes } from "./client/src/data/content";
import {
  injectEditorialPage,
  injectNotFoundPage,
  isHtmlRouteRequest,
  normalizeRoutePath,
} from "./scripts/editorialSsg";

function vitePluginEditorialSsg(): Plugin {
  const knownPaths = new Set(routes.map((route) => route.path));
  const templatePath = path.resolve(import.meta.dirname, "client", "index.html");

  return {
    name: "irbroker-editorial-ssg",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();

        const requestUrl = req.url ?? "/";
        const pathname = normalizeRoutePath(new URL(requestUrl, "http://localhost").pathname);
        if (!isHtmlRouteRequest(pathname)) return next();

        try {
          const template = fs.readFileSync(templatePath, "utf-8");
          const transformedTemplate = await server.transformIndexHtml(requestUrl, template);
          const isKnownPath = knownPaths.has(pathname);
          let renderedHtml: string;
          if (isKnownPath) {
            const ssg = (await server.ssrLoadModule("/src/ssg.tsx")) as {
              renderPage: (path: string) => {
                body: string;
                title: string;
                description: string;
                image: string;
                ogType?: 'website' | 'article';
              };
            };
            const page = ssg.renderPage(requestUrl);
            renderedHtml = injectEditorialPage(transformedTemplate, page.body, {
              title: page.title,
              description: page.description,
              image: page.image,
              ogType: page.ogType,
            });
          } else {
            renderedHtml = injectNotFoundPage(transformedTemplate);
          }

          res.statusCode = isKnownPath ? 200 : 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          if (req.method === "HEAD") {
            res.end();
          } else {
            res.end(renderedHtml);
          }
        } catch (error) {
          next(error instanceof Error ? error : new Error(String(error)));
        }
      });
    },
  };
}

const plugins = [
  vitePluginEditorialSsg(),
  react(),
  tailwindcss(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
