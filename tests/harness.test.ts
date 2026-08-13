import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { afterEach, describe, expect, it } from "vitest";
import { createHarness, type Harness } from "../src/harness.ts";

type Fixture = {
  root: string;
  homeDir: string;
  workspaceRoot: string;
  harness?: Harness;
};

const fixtures: Fixture[] = [];

afterEach(() => {
  for (const fixture of fixtures.splice(0)) {
    fixture.harness?.close();
  }
});

async function makeFixture(): Promise<Fixture> {
  const root = await mkdtemp(path.join(tmpdir(), "study-os-"));
  const homeDir = path.join(root, "home");
  const workspaceRoot = path.join(root, "workspace");
  await mkdir(homeDir, { recursive: true });
  await mkdir(path.join(workspaceRoot, "course-packs"), { recursive: true });
  const fixture = { root, homeDir, workspaceRoot };
  fixtures.push(fixture);
  return fixture;
}

function openHarness(
  fixture: Fixture,
  env: NodeJS.Dict<string> = {},
): Harness {
  const harness = createHarness({
    workspaceRoot: fixture.workspaceRoot,
    homeDir: fixture.homeDir,
    env,
  });
  fixture.harness = harness;
  return harness;
}

async function writePack(
  workspaceRoot: string,
  packId: string,
  displayName: string,
): Promise<void> {
  const packDir = path.join(workspaceRoot, "course-packs", packId);
  await mkdir(path.join(packDir, "sources"), { recursive: true });
  await writeFile(
    path.join(packDir, "pack.yaml"),
    `display_name: ${JSON.stringify(displayName)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(packDir, "sources", "notes.md"),
    `# ${displayName}\n`,
    "utf8",
  );
}

describe("student-model store path", () => {
  it("creates the store file and parent dirs at the env path on first load_context", async () => {
    const fixture = await makeFixture();
    const storePath = path.join(fixture.root, "nested", "store", "learner.sqlite");
    const harness = openHarness(fixture, {
      STUDY_OS_STUDENT_MODEL_STORE: storePath,
    });

    await harness.loadContext();

    expect(existsSync(storePath)).toBe(true);
  });

  it("creates the store at ~/.study-os/student-model.sqlite when env and config are unset", async () => {
    const fixture = await makeFixture();
    const harness = openHarness(fixture);
    const storePath = path.join(
      fixture.homeDir,
      ".study-os",
      "student-model.sqlite",
    );

    await harness.loadContext();

    expect(existsSync(storePath)).toBe(true);
  });

  it("uses student_model_store from ~/.study-os/config.yaml when env is unset", async () => {
    const fixture = await makeFixture();
    const storePath = path.join(fixture.root, "from-config.sqlite");
    await mkdir(path.join(fixture.homeDir, ".study-os"), { recursive: true });
    await writeFile(
      path.join(fixture.homeDir, ".study-os", "config.yaml"),
      `student_model_store: ${JSON.stringify(storePath)}\n`,
      "utf8",
    );
    const harness = openHarness(fixture);

    await harness.loadContext();

    expect(existsSync(storePath)).toBe(true);
    expect(
      existsSync(
        path.join(fixture.homeDir, ".study-os", "student-model.sqlite"),
      ),
    ).toBe(false);
  });

  it("prefers STUDY_OS_STUDENT_MODEL_STORE over config.yaml", async () => {
    const fixture = await makeFixture();
    const configPath = path.join(fixture.root, "from-config.sqlite");
    const envPath = path.join(fixture.root, "from-env.sqlite");
    await mkdir(path.join(fixture.homeDir, ".study-os"), { recursive: true });
    await writeFile(
      path.join(fixture.homeDir, ".study-os", "config.yaml"),
      `student_model_store: ${JSON.stringify(configPath)}\n`,
      "utf8",
    );
    const harness = openHarness(fixture, {
      STUDY_OS_STUDENT_MODEL_STORE: envPath,
    });

    await harness.loadContext();

    expect(existsSync(envPath)).toBe(true);
    expect(existsSync(configPath)).toBe(false);
  });

  it("expands a tilde in STUDY_OS_STUDENT_MODEL_STORE against the home dir", async () => {
    const fixture = await makeFixture();
    const harness = openHarness(fixture, {
      STUDY_OS_STUDENT_MODEL_STORE: "~/learner.sqlite",
    });

    await harness.loadContext();

    expect(existsSync(path.join(fixture.homeDir, "learner.sqlite"))).toBe(true);
  });

  it("expands a tilde in config.yaml student_model_store", async () => {
    const fixture = await makeFixture();
    await mkdir(path.join(fixture.homeDir, ".study-os"), { recursive: true });
    await writeFile(
      path.join(fixture.homeDir, ".study-os", "config.yaml"),
      "student_model_store: ~/from-config.sqlite\n",
      "utf8",
    );
    const harness = openHarness(fixture);

    await harness.loadContext();

    expect(existsSync(path.join(fixture.homeDir, "from-config.sqlite"))).toBe(
      true,
    );
  });
});

describe("load_context", () => {
  it("returns empty-store defaults: profile 0.5, mastery absent, empty summaries and registrations", async () => {
    const fixture = await makeFixture();
    const harness = openHarness(fixture);

    const ctx = await harness.loadContext();

    expect(ctx.teaching_profile).toEqual({
      explanation_depth: 0.5,
      example_density: 0.5,
      analogy_use: 0.5,
      language_mix: 0.5,
      scaffold_level: 0.5,
      answer_reveal_patience: 0.5,
      prior_related_experience: 0.5,
    });
    expect(ctx.mastery).toEqual({});
    expect(ctx.session_summaries).toEqual([]);
    expect(ctx.runtime_registrations).toEqual([]);
    expect(ctx.bootstrap).toEqual({
      language: null,
      active_course_pack_id: null,
    });
  });
});

describe("active course pack", () => {
  it("auto-selects and persists the sole valid pack when stored id is missing", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    const harness = openHarness(fixture);

    const ctx = await harness.loadContext();
    expect(ctx.bootstrap.active_course_pack_id).toBe("databases");

    harness.close();
    const again = openHarness(fixture);
    const persisted = await again.loadContext();
    expect(persisted.bootstrap.active_course_pack_id).toBe("databases");
  });

  it("returns no mastery scores until first evidence even with an active pack", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    const harness = openHarness(fixture);

    const ctx = await harness.loadContext();

    expect(ctx.bootstrap.active_course_pack_id).toBe("databases");
    expect(ctx.mastery).toEqual({});
  });

  it("does not invent an active pack id when many packs exist without a valid selection", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    await writePack(fixture.workspaceRoot, "algebra", "Algebra");
    const harness = openHarness(fixture);

    const ctx = await harness.loadContext();

    expect(ctx.bootstrap.active_course_pack_id).toBeNull();
  });

  it("lists packs from course-packs/*/pack.yaml without inventing an active id", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    await writePack(fixture.workspaceRoot, "algebra", "Algebra");
    const harness = openHarness(fixture);

    const listed = await harness.listCoursePacks();

    expect(listed.packs).toEqual([
      { id: "algebra", display_name: "Algebra" },
      { id: "databases", display_name: "Databases" },
    ]);
    expect(listed.active_course_pack_id).toBeNull();
  });

  it("set_active_course_pack persists a valid pack id", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    await writePack(fixture.workspaceRoot, "algebra", "Algebra");
    const harness = openHarness(fixture);

    const result = await harness.setActiveCoursePack("algebra");

    expect(result).toEqual({
      ok: true,
      active_course_pack_id: "algebra",
    });
    const ctx = await harness.loadContext();
    expect(ctx.bootstrap.active_course_pack_id).toBe("algebra");
  });

  it("set_active_course_pack refuses an unknown pack id", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    const harness = openHarness(fixture);

    const result = await harness.setActiveCoursePack("not-a-pack");

    expect(result).toEqual({
      ok: false,
      error: "unknown_pack",
      pack_id: "not-a-pack",
    });
    const ctx = await harness.loadContext();
    expect(ctx.bootstrap.active_course_pack_id).toBe("databases");
  });

  it("auto-selects the remaining sole pack when the stored id is no longer valid", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    await writePack(fixture.workspaceRoot, "algebra", "Algebra");
    const harness = openHarness(fixture);
    await harness.setActiveCoursePack("algebra");
    await rm(path.join(fixture.workspaceRoot, "course-packs", "algebra"), {
      recursive: true,
    });

    const ctx = await harness.loadContext();

    expect(ctx.bootstrap.active_course_pack_id).toBe("databases");
  });

  it("does not invent an id when the stored pack is gone and several packs remain", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    await writePack(fixture.workspaceRoot, "algebra", "Algebra");
    await writePack(fixture.workspaceRoot, "calculus", "Calculus");
    const harness = openHarness(fixture);
    await harness.setActiveCoursePack("algebra");
    await rm(path.join(fixture.workspaceRoot, "course-packs", "algebra"), {
      recursive: true,
    });

    const ctx = await harness.loadContext();

    expect(ctx.bootstrap.active_course_pack_id).toBeNull();
  });

  it("ignores course-pack folders that have no pack.yaml", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    await mkdir(path.join(fixture.workspaceRoot, "course-packs", "scratch"), {
      recursive: true,
    });
    const harness = openHarness(fixture);

    const listed = await harness.listCoursePacks();

    expect(listed.packs).toEqual([
      { id: "databases", display_name: "Databases" },
    ]);
    expect(listed.active_course_pack_id).toBe("databases");
  });

  it("ignores a pack.yaml folder that has no sources directory", async () => {
    const fixture = await makeFixture();
    await writePack(fixture.workspaceRoot, "databases", "Databases");
    const incomplete = path.join(
      fixture.workspaceRoot,
      "course-packs",
      "incomplete",
    );
    await mkdir(incomplete, { recursive: true });
    await writeFile(
      path.join(incomplete, "pack.yaml"),
      'display_name: "Incomplete"\n',
      "utf8",
    );
    const harness = openHarness(fixture);

    const listed = await harness.listCoursePacks();

    expect(listed.packs).toEqual([
      { id: "databases", display_name: "Databases" },
    ]);
  });
});

describe("shipped Databases course pack", () => {
  it("has pack.yaml display_name and cátedra sources", async () => {
    const packDir = path.join(
      import.meta.dirname,
      "..",
      "course-packs",
      "databases",
    );
    const raw = await readFile(path.join(packDir, "pack.yaml"), "utf8");
    const parsed: unknown = parseYaml(raw);
    expect(parsed).toMatchObject({ display_name: expect.any(String) });
    const displayName = (parsed as { display_name: string }).display_name;
    expect(displayName.length).toBeGreaterThan(0);
    const sources = await readdir(path.join(packDir, "sources"));
    expect(sources.length).toBeGreaterThan(0);
  });
});
