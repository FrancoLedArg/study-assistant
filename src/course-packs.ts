import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type CoursePack = {
  id: string;
  display_name: string;
};

export function discoverCoursePacks(workspaceRoot: string): CoursePack[] {
  const packsRoot = path.join(workspaceRoot, "course-packs");
  let entries: string[];
  try {
    entries = readdirSync(packsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    if (isNotFound(error)) {
      return [];
    }
    throw error;
  }

  const packs: CoursePack[] = [];
  for (const id of entries.sort()) {
    const pack = readPack(path.join(packsRoot, id), id);
    if (pack) {
      packs.push(pack);
    }
  }
  return packs;
}

export function resolveActiveCoursePack(args: {
  storedId: string | null;
  packs: CoursePack[];
}): { id: string | null; shouldPersist: boolean } {
  const valid = new Set(args.packs.map((pack) => pack.id));
  if (args.storedId && valid.has(args.storedId)) {
    return { id: args.storedId, shouldPersist: false };
  }
  if (args.packs.length === 1) {
    const sole = args.packs[0];
    if (!sole) {
      return { id: null, shouldPersist: false };
    }
    return { id: sole.id, shouldPersist: true };
  }
  return { id: null, shouldPersist: false };
}

function readPack(packDir: string, id: string): CoursePack | undefined {
  let raw: string;
  try {
    raw = readFileSync(path.join(packDir, "pack.yaml"), "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      return undefined;
    }
    throw error;
  }
  const parsed: unknown = parseYaml(raw);
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return undefined;
  }
  const displayName = (parsed as Record<string, unknown>).display_name;
  if (typeof displayName !== "string" || displayName.length === 0) {
    return undefined;
  }
  if (!isDirectory(path.join(packDir, "sources"))) {
    return undefined;
  }
  return { id, display_name: displayName };
}

function isDirectory(dirPath: string): boolean {
  try {
    return statSync(dirPath).isDirectory();
  } catch (error) {
    if (isNotFound(error)) {
      return false;
    }
    throw error;
  }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "ENOENT"
  );
}
