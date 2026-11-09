import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain; charset=utf-8",
};
const CLEAN = new Map([
  ["/", "index.html"],
  ["/index", "index.html"],
  ["/work", "work.html"],
  ["/resources", "resources.html"],
  ["/tools", "resources.html"],
  ["/about", "about.html"],
  ["/contact", "contact.html"],
  ["/services", "services.html"],
]);
function resolveFile(pathname) {
  let p;
  try {
    p = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  if (CLEAN.has(p)) return path.join(ROOT, CLEAN.get(p));
  if (/^\/service\/[^/]+$/.test(p)) return path.join(ROOT, "service.html");
  if (/^\/(?:case-study|project)\/[^/]+$/.test(p))
    return path.join(ROOT, "case-study.html");
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) return null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  return null;
}
export function createPreviewServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let file = resolveFile(url.pathname);
    let status = 200;
    if (!file) {
      // Unknown asset paths should remain real 404s; unknown app paths render the SPA 404.
      if (url.pathname.startsWith("/assets/")) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      file = path.join(ROOT, "404.html");
      status = 404;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(status, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    fs.createReadStream(file).pipe(res);
  });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  createPreviewServer().listen(PORT, HOST, () =>
    console.log(`Preview listening on http://${HOST}:${PORT}`),
  );
}
