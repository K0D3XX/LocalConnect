import "./chunk-4VNS5WPM.js";

// server/vite.ts
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// node_modules/@replit/vite-plugin-runtime-error-modal/dist/index.mjs
import { readFileSync } from "fs";
import { originalPositionFor, TraceMap } from "@jridgewell/trace-mapping";
var packageName = "runtime-error-plugin";
function viteRuntimeErrorOverlayPlugin(options) {
  return {
    name: packageName,
    apply(config, env) {
      return env.command === "serve" && !config.ssr;
    },
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: CLIENT_SCRIPT
        }
      ];
    },
    configureServer(server) {
      server.ws.on(MESSAGE_TYPE, (data, client) => {
        const error = Object.assign(new Error(), data);
        if (!error.stack) {
          return;
        }
        if ((options == null ? void 0 : options.filter) && !options.filter(error)) {
          return;
        }
        const { stack, loc } = rewriteStacktrace(
          error.stack,
          server.moduleGraph
        );
        const err = {
          name: error.name,
          message: error.message,
          stack,
          loc,
          plugin: packageName
        };
        if (loc == null ? void 0 : loc.file) {
          err.id = loc == null ? void 0 : loc.file;
          const source = readFileSync(loc.file, "utf-8");
          err.frame = generateCodeFrame(source, {
            line: loc.line,
            column: loc.column - 1
          });
        }
        client.send({
          type: "error",
          err
        });
      });
    }
  };
}
var MESSAGE_TYPE = `${packageName}:error`;
var CLIENT_SCRIPT = `
import { createHotContext } from "/@vite/client";
const hot = createHotContext("/__dummy__${packageName}");

function sendError(error) {
  if (!(error instanceof Error)) {
    error = new Error("(unknown runtime error)");
  }
  const serialized = {
    message: error.message,
    stack: error.stack,
  };
  hot.send("${MESSAGE_TYPE}", serialized);
}

window.addEventListener("error", (evt) => {
  sendError(evt.error);
});

window.addEventListener("unhandledrejection", (evt) => {
  sendError(evt.reason);
});
`;
function cleanStack(stack) {
  return stack.split(/\n/g).filter((l) => /^\s*at/.test(l)).join("\n");
}
function rewriteStacktrace(stack, moduleGraph) {
  let loc = void 0;
  const rewrittenStack = cleanStack(stack).split("\n").map((line) => {
    return line.replace(
      /^ {4}at (?:(\S+?) )?\(?(?:https|http):\/\/[^\/]+(\/[^\s?]+).*:(\d+):(\d+)\)?$/,
      (input, varName, url, line2, column) => {
        var _a;
        if (!url) {
          return input;
        }
        const module = moduleGraph.urlToModuleMap.get(url);
        if (!module) {
          return "";
        }
        const rawSourceMap = (_a = module == null ? void 0 : module.transformResult) == null ? void 0 : _a.map;
        if (rawSourceMap) {
          const traced = new TraceMap(rawSourceMap);
          const pos = originalPositionFor(traced, {
            line: Number(line2),
            // stacktrace's column is 1-indexed, but sourcemap's one is 0-indexed
            column: Number(column) - 1
          });
          if (pos.source && pos.line >= 0 && pos.column >= 0) {
            line2 = pos.line;
            column = pos.column + 1;
          }
        }
        const trimmedVarName = varName == null ? void 0 : varName.trim();
        const sourceFile = module.file;
        const source = `${module.file}:${line2}:${column}`;
        if (sourceFile) {
          loc ??= {
            line: Number(line2),
            column: Number(column),
            file: sourceFile
          };
        }
        if (!trimmedVarName || trimmedVarName === "eval") {
          return `    at ${source}`;
        } else {
          return `    at ${trimmedVarName} ${source}`;
        }
      }
    );
  }).join("\n");
  return {
    stack: rewrittenStack,
    loc
  };
}
var splitRE = /\r?\n/g;
var range = 2;
function posToNumber(source, pos) {
  if (typeof pos === "number") {
    return pos;
  }
  const lines = source.split(splitRE);
  const { line, column } = pos;
  let start = 0;
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    start += lines[i].length + 1;
  }
  return start + column;
}
function generateCodeFrame(source, start = 0, end) {
  start = Math.max(posToNumber(source, start), 0);
  end = Math.min(
    end !== void 0 ? posToNumber(source, end) : start,
    source.length
  );
  const lines = source.split(splitRE);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) {
          continue;
        }
        const line = j + 1;
        res.push(
          `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`
        );
        const lineLength = lines[j].length;
        if (j === i) {
          const pad = Math.max(start - (count - lineLength), 0);
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          );
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
    count++;
  }
  return res.join("\n");
}

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteRuntimeErrorOverlayPlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("./dist-TBEQPB5W.js").then(
        (m) => m.cartographer()
      ),
      await import("./dist-BRS7AJDY.js").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import fs from "fs";
import path2 from "path";

// node_modules/nanoid/index.js
import crypto from "crypto";

// node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// node_modules/nanoid/index.js
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
var fillPool = (bytes) => {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    crypto.randomFillSync(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto.randomFillSync(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
};
var nanoid = (size = 21) => {
  fillPool(size |= 0);
  let id = "";
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
};

// server/vite.ts
var viteLogger = createLogger();
async function setupVite(server, app) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
export {
  setupVite
};
