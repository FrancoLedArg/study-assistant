import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export type CatedraHit = {
  path: string;
  snippet: string;
};

export type SearchCatedraResult =
  | { ok: true; hits: CatedraHit[] }
  | { ok: false; error: "no_active_course_pack" };

export type ReadCatedraFileResult =
  | { ok: true; path: string; content: string }
  | { ok: false; error: "outside_sources"; path: string }
  | { ok: false; error: "not_found"; path: string };

export type ReadCatedraResult =
  | ReadCatedraFileResult
  | { ok: false; error: "no_active_course_pack" };

const SNIPPET_RADIUS = 80;

export function sourcesRoot(workspaceRoot: string, packId: string): string {
  return path.join(workspaceRoot, "course-packs", packId, "sources");
}

export function searchCatedraSources(
  sourcesDir: string,
  query: string,
): CatedraHit[] {
  const needle = query.toLowerCase();
  if (needle.length === 0) {
    return [];
  }
  const hits: CatedraHit[] = [];
  for (const relPath of listSourceFiles(sourcesDir)) {
    const posixPath = toPosix(relPath);
    const content = readUtf8(path.join(sourcesDir, relPath));
    if (content === undefined) {
      continue;
    }
    const inPath = posixPath.toLowerCase().includes(needle);
    const indexInContent = content.toLowerCase().indexOf(needle);
    if (!inPath && indexInContent === -1) {
      continue;
    }
    hits.push({
      path: posixPath,
      snippet: snippetAround(
        content,
        indexInContent === -1 ? 0 : indexInContent,
        needle.length,
      ),
    });
  }
  return hits;
}

export function readCatedraSource(
  sourcesDir: string,
  requestedPath: string,
): ReadCatedraFileResult {
  const resolved = resolveInsideSources(sourcesDir, requestedPath);
  if (resolved === null) {
    return { ok: false, error: "outside_sources", path: requestedPath };
  }
  const content = readUtf8(resolved);
  if (content === undefined) {
    return { ok: false, error: "not_found", path: requestedPath };
  }
  return { ok: true, path: toPosix(requestedPath), content };
}

function listSourceFiles(sourcesDir: string): string[] {
  const root = path.resolve(sourcesDir);
  const files: string[] = [];

  function walk(dir: string) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      if (isNotFound(error)) {
        return;
      }
      throw error;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(root, full);
      if (rel.startsWith("..") || path.isAbsolute(rel)) {
        continue;
      }
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        files.push(rel);
      }
    }
  }

  walk(root);
  files.sort();
  return files;
}

function resolveInsideSources(
  sourcesDir: string,
  requestedPath: string,
): string | null {
  if (path.isAbsolute(requestedPath)) {
    return null;
  }
  const root = path.resolve(sourcesDir);
  const resolved = path.resolve(root, requestedPath);
  const rel = path.relative(root, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return null;
  }
  return resolved;
}

function snippetAround(
  content: string,
  index: number,
  needleLength: number,
): string {
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(content.length, index + needleLength + SNIPPET_RADIUS);
  return content.slice(start, end).trim();
}

function readUtf8(filePath: string): string | undefined {
  try {
    if (!statSync(filePath).isFile()) {
      return undefined;
    }
    return readFileSync(filePath, "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      return undefined;
    }
    throw error;
  }
}

function toPosix(relPath: string): string {
  return relPath.split(path.sep).join("/");
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "ENOENT"
  );
}
