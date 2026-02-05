import "./chunk-4VNS5WPM.js";

// node_modules/@replit/vite-plugin-dev-banner/dist/index.mjs
import fs from "fs/promises";
import { fileURLToPath } from "url";
var BANNER_SCRIPT_ID = "/@replit/vite-plugin-dev-banner/banner-script.js";
function devBanner() {
  let bannerScript;
  return {
    name: "@replit/vite-plugin-dev-banner",
    enforce: "pre",
    async buildStart() {
      const currentFileUrl = fileURLToPath(
        new URL("./banner-script.js", import.meta.url)
      );
      try {
        bannerScript = await fs.readFile(currentFileUrl, "utf-8");
      } catch (error) {
        console.error(
          "[replit-dev-banner] Failed to load banner script:",
          error
        );
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === BANNER_SCRIPT_ID) {
          if (!bannerScript) {
            res.statusCode = 404;
            res.end();
            return;
          }
          res.setHeader("Content-Type", "application/javascript");
          res.end(bannerScript);
          return;
        }
        next();
      });
    },
    transformIndexHtml(html, context) {
      var _a;
      if (((_a = context.server) == null ? void 0 : _a.config.command) !== "serve") {
        return html;
      }
      return [
        {
          tag: "script",
          attrs: {
            type: "text/javascript",
            src: BANNER_SCRIPT_ID,
            id: "replit-dev-banner"
          },
          injectTo: "head"
        }
      ];
    }
  };
}
var version = "0.1.0";
export {
  devBanner,
  version
};
