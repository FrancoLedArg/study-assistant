import {
  readCatedraSource,
  searchCatedraSources,
  sourcesRoot,
  type ReadCatedraResult,
  type SearchCatedraResult,
} from "./catedra.ts";
import {
  discoverCoursePacks,
  resolveActiveCoursePack,
  type CoursePack,
} from "./course-packs.ts";
import { resolveStudentModelStorePath } from "./store-path.ts";
import {
  openStudentModelStore,
  type LoadContextResult,
  type StudentModelStore,
} from "./student-model-store.ts";

export type {
  CoursePack,
  LoadContextResult,
  ReadCatedraResult,
  SearchCatedraResult,
};

export type HarnessOptions = {
  workspaceRoot: string;
  env?: NodeJS.Dict<string>;
  homeDir?: string;
};

export type ListCoursePacksResult = {
  packs: CoursePack[];
  active_course_pack_id: string | null;
};

export type SetActiveCoursePackResult =
  | { ok: true; active_course_pack_id: string }
  | { ok: false; error: "unknown_pack"; pack_id: string };

export type Harness = {
  loadContext: () => Promise<LoadContextResult>;
  listCoursePacks: () => Promise<ListCoursePacksResult>;
  setActiveCoursePack: (packId: string) => Promise<SetActiveCoursePackResult>;
  searchCatedra: (query: string) => Promise<SearchCatedraResult>;
  readCatedra: (sourcePath: string) => Promise<ReadCatedraResult>;
  close: () => void;
};

export function createHarness(options: HarnessOptions): Harness {
  let store: StudentModelStore | undefined;

  function getStore(): StudentModelStore {
    if (!store) {
      const storePath = resolveStudentModelStorePath({
        env: options.env,
        homeDir: options.homeDir,
      });
      store = openStudentModelStore(storePath);
    }
    return store;
  }

  function resolveActive(studentStore: StudentModelStore) {
    const packs = discoverCoursePacks(options.workspaceRoot);
    const resolved = resolveActiveCoursePack({
      storedId: studentStore.getActivePackId(),
      packs,
    });
    if (resolved.shouldPersist && resolved.id) {
      studentStore.persistActivePack(resolved.id);
    }
    return { packs, activeId: resolved.id };
  }

  function activeSourcesDir(): string | null {
    const studentStore = getStore();
    const { activeId } = resolveActive(studentStore);
    if (activeId === null) {
      return null;
    }
    return sourcesRoot(options.workspaceRoot, activeId);
  }

  return {
    async loadContext() {
      const studentStore = getStore();
      const { activeId } = resolveActive(studentStore);
      return studentStore.loadContext(activeId);
    },
    async listCoursePacks() {
      const studentStore = getStore();
      const { packs, activeId } = resolveActive(studentStore);
      return { packs, active_course_pack_id: activeId };
    },
    async setActiveCoursePack(packId) {
      const studentStore = getStore();
      const packs = discoverCoursePacks(options.workspaceRoot);
      if (!packs.some((pack) => pack.id === packId)) {
        return { ok: false, error: "unknown_pack", pack_id: packId };
      }
      studentStore.persistActivePack(packId);
      return { ok: true, active_course_pack_id: packId };
    },
    async searchCatedra(query) {
      const sourcesDir = activeSourcesDir();
      if (sourcesDir === null) {
        return { ok: false, error: "no_active_course_pack" };
      }
      return { ok: true, hits: searchCatedraSources(sourcesDir, query) };
    },
    async readCatedra(sourcePath) {
      const sourcesDir = activeSourcesDir();
      if (sourcesDir === null) {
        return { ok: false, error: "no_active_course_pack" };
      }
      return readCatedraSource(sourcesDir, sourcePath);
    },
    close() {
      store?.close();
      store = undefined;
    },
  };
}
