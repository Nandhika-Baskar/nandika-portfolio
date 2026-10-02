// Static preview: server-render HomePage, hydrate it on the client, compile Tailwind.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const out = path.join(root, "dist/preview");
const NODE_PATHS = (process.env.PREVIEW_NODE_PATHS || "/opt/npm-tools/node_modules").split(":");
const req = createRequire(NODE_PATHS[0] + "/");
const esbuild = req("esbuild");
const tailwind = req("tailwindcss");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const common = {
  bundle: true,
  absWorkingDir: root,
  nodePaths: NODE_PATHS,
  jsx: "automatic",
  logLevel: "warning",
  logOverride: { "unsupported-directive": "silent" },
  define: {
    "process.env.NEXT_PUBLIC_ASSET_BASE": JSON.stringify("."),
    "process.env.NEXT_PUBLIC_SITE_URL": "undefined",
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
};

// 1. Client bundle
await esbuild.build({ ...common, entryPoints: ["tools/preview/entry-client.tsx"], outfile: path.join(out, "app.js"), format: "esm", minify: true, target: "es2020" });

// 2. Server render to HTML
const ssrFile = path.join(root, "dist/.ssr.cjs");
await esbuild.build({ ...common, entryPoints: ["tools/preview/entry-server.tsx"], outfile: ssrFile, format: "cjs", platform: "node" });
const { render } = createRequire(import.meta.url)(ssrFile);
const html = render();
fs.rmSync(ssrFile);

// 3. Tailwind: scan sources for candidate class names, then compile globals.css
const files = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f.name)) files.push(p);
  }
};
["app", "components", "data", "lib"].forEach((d) => walk(path.join(root, d)));
const candidates = new Set();
for (const f of files) for (const tok of fs.readFileSync(f, "utf8").split(/[\s"'`{};]+/)) if (tok) candidates.add(tok);
const twBase = path.dirname(req.resolve("tailwindcss/package.json"));
const compiler = await tailwind.compile(fs.readFileSync(path.join(root, "app/globals.css"), "utf8"), {
  base: path.join(root, "app"),
  loadStylesheet: async (id, base) => {
    const p = id === "tailwindcss" ? path.join(twBase, "index.css") : path.resolve(base, id);
    return { content: fs.readFileSync(p, "utf8"), base: path.dirname(p), path: p };
  },
});
const css = compiler.build([...candidates]).replaceAll('url("/fonts/', 'url("fonts/');
fs.writeFileSync(path.join(out, "app.css"), css);

// 4. Public files and the HTML shell
fs.cpSync(path.join(root, "public"), out, { recursive: true });
const title = "Nandhika: full-stack developer, Chennai";
const description = "Portfolio of Nandhika, a full-stack developer in Chennai building web products end to end: interfaces, APIs, databases and integrations.";
fs.writeFileSync(
  path.join(out, "index.html"),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#121211" />
<meta name="color-scheme" content="dark" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="og.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="icon.svg" />
<link rel="preload" href="fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="app.css" />
</head>
<body>
<div id="root">${html}</div>
<script type="module" src="app.js"></script>
</body>
</html>
`,
);
// 5. Body-only variant for hosts that supply their own document skeleton
fs.writeFileSync(
  path.join(out, "artifact.html"),
  `<title>Nandhika</title>
<meta name="description" content="${description}" />
<link rel="icon" href="icon.svg" />
<link rel="preload" href="fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="app.css" />
<style>
  :root { color-scheme: dark; background: #121211; }
  body { margin: 0; background: #121211; color: #ece7dd; font-family: "Geist", ui-sans-serif, system-ui, sans-serif; font-size: 1.0625rem; line-height: 1.6; }
</style>
<div id="root">${html}</div>
<script type="module" src="app.js"></script>
`,
);
console.log(`preview: ${out} (${(fs.statSync(path.join(out, "app.js")).size / 1024).toFixed(0)} KB js, ${(css.length / 1024).toFixed(0)} KB css)`);
