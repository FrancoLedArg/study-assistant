import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const CONFIG_DIR = ".study-os";
const CONFIG_FILE = "config.yaml";
const DEFAULT_STORE_FILE = "student-model.sqlite";
const ENV_STORE = "STUDY_OS_STUDENT_MODEL_STORE";
const CONFIG_STORE_KEY = "student_model_store";

export type StorePathOptions = {
  env?: NodeJS.Dict<string>;
  homeDir?: string;
};

function defaultStudentModelStorePath(homeDir: string): string {
  return path.join(homeDir, CONFIG_DIR, DEFAULT_STORE_FILE);
}

function expandUserPath(filePath: string, homeDir: string): string {
  if (filePath === "~") {
    return homeDir;
  }
  if (filePath.startsWith("~/")) {
    return path.join(homeDir, filePath.slice(2));
  }
  return filePath;
}

function readStorePathFromConfig(homeDir: string): string | undefined {
  const configPath = path.join(homeDir, CONFIG_DIR, CONFIG_FILE);
  let raw: string;
  try {
    raw = readFileSync(configPath, "utf8");
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
  const value = (parsed as Record<string, unknown>)[CONFIG_STORE_KEY];
  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }
  return expandUserPath(value, homeDir);
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "ENOENT"
  );
}

export function resolveStudentModelStorePath(
  options: StorePathOptions = {},
): string {
  const env = options.env ?? process.env;
  const homeDir = options.homeDir ?? homedir();
  const fromEnv = env[ENV_STORE];
  if (fromEnv && fromEnv.length > 0) {
    return expandUserPath(fromEnv, homeDir);
  }
  return readStorePathFromConfig(homeDir) ?? defaultStudentModelStorePath(homeDir);
}
