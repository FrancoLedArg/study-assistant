import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const TEACHING_PROFILE_DIMS = [
  "explanation_depth",
  "example_density",
  "analogy_use",
  "language_mix",
  "scaffold_level",
  "answer_reveal_patience",
  "prior_related_experience",
] as const;

export type TeachingProfileDim = (typeof TEACHING_PROFILE_DIMS)[number];

export type TeachingProfile = Record<TeachingProfileDim, number>;

export type RuntimeRegistration = {
  family: string;
  engine: string;
  command: string;
};

export type SessionSummary = {
  id: string;
  started_at: string;
  ended_at: string;
  active_course_pack_id: string;
  goals: string[];
  outcome: string | null;
  artifact_paths: string[];
  proposal_ids: string[];
  brief_ids: string[];
  notes: string | null;
};

export type LoadContextResult = {
  bootstrap: {
    language: string | null;
    active_course_pack_id: string | null;
  };
  teaching_profile: TeachingProfile;
  mastery: Record<string, number>;
  session_summaries: SessionSummary[];
  runtime_registrations: RuntimeRegistration[];
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS learner_prefs (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  language TEXT,
  active_course_pack_id TEXT
);

CREATE TABLE IF NOT EXISTS teaching_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  explanation_depth REAL NOT NULL DEFAULT 0.5,
  example_density REAL NOT NULL DEFAULT 0.5,
  analogy_use REAL NOT NULL DEFAULT 0.5,
  language_mix REAL NOT NULL DEFAULT 0.5,
  scaffold_level REAL NOT NULL DEFAULT 0.5,
  answer_reveal_patience REAL NOT NULL DEFAULT 0.5,
  prior_related_experience REAL NOT NULL DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS mastery (
  pack_id TEXT NOT NULL,
  kc_id TEXT NOT NULL,
  score REAL NOT NULL,
  PRIMARY KEY (pack_id, kc_id)
);

CREATE TABLE IF NOT EXISTS session_summaries (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  active_course_pack_id TEXT NOT NULL,
  goals TEXT NOT NULL DEFAULT '[]',
  outcome TEXT,
  artifact_paths TEXT NOT NULL DEFAULT '[]',
  proposal_ids TEXT NOT NULL DEFAULT '[]',
  brief_ids TEXT NOT NULL DEFAULT '[]',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  status TEXT NOT NULL,
  target_kind TEXT,
  target_id TEXT,
  delta REAL,
  absolute_value REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence_briefs (
  id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL,
  session_id TEXT,
  moments TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS runtime_registrations (
  family TEXT PRIMARY KEY,
  engine TEXT NOT NULL,
  command TEXT NOT NULL
);
`;

const DEFAULT_PROFILE: TeachingProfile = {
  explanation_depth: 0.5,
  example_density: 0.5,
  analogy_use: 0.5,
  language_mix: 0.5,
  scaffold_level: 0.5,
  answer_reveal_patience: 0.5,
  prior_related_experience: 0.5,
};

export type StudentModelStore = {
  getActivePackId: () => string | null;
  loadContext: (activePackId: string | null) => LoadContextResult;
  persistActivePack: (packId: string) => void;
  close: () => void;
};

export function openStudentModelStore(storePath: string): StudentModelStore {
  mkdirSync(path.dirname(storePath), { recursive: true });
  const db = new DatabaseSync(storePath);
  db.exec(SCHEMA);
  db.prepare(
    `INSERT OR IGNORE INTO learner_prefs (id, language, active_course_pack_id)
     VALUES (1, NULL, NULL)`,
  ).run();
  db.prepare(
    `INSERT OR IGNORE INTO teaching_profile (
       id, explanation_depth, example_density, analogy_use, language_mix,
       scaffold_level, answer_reveal_patience, prior_related_experience
     ) VALUES (1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)`,
  ).run();

  return {
    getActivePackId() {
      const row = db
        .prepare(`SELECT active_course_pack_id FROM learner_prefs WHERE id = 1`)
        .get() as { active_course_pack_id: string | null } | undefined;
      return row?.active_course_pack_id ?? null;
    },
    loadContext(activePackId) {
      return loadContext(db, activePackId);
    },
    persistActivePack(packId) {
      db.prepare(
        `UPDATE learner_prefs SET active_course_pack_id = ? WHERE id = 1`,
      ).run(packId);
    },
    close() {
      db.close();
    },
  };
}

function loadContext(
  db: DatabaseSync,
  activePackId: string | null,
): LoadContextResult {
  const prefs = db
    .prepare(
      `SELECT language, active_course_pack_id FROM learner_prefs WHERE id = 1`,
    )
    .get() as
    | { language: string | null; active_course_pack_id: string | null }
    | undefined;
  const profileRow = db
    .prepare(
      `SELECT explanation_depth, example_density, analogy_use, language_mix,
              scaffold_level, answer_reveal_patience, prior_related_experience
       FROM teaching_profile WHERE id = 1`,
    )
    .get() as TeachingProfile | undefined;

  const mastery: Record<string, number> = {};
  if (activePackId) {
    const rows = db
      .prepare(`SELECT kc_id, score FROM mastery WHERE pack_id = ?`)
      .all(activePackId) as Array<{ kc_id: string; score: number }>;
    for (const row of rows) {
      mastery[row.kc_id] = row.score;
    }
  }

  const registrationRows = db
    .prepare(`SELECT family, engine, command FROM runtime_registrations`)
    .all() as RuntimeRegistration[];

  const summaryRows = activePackId
    ? (db
        .prepare(
          `SELECT id, started_at, ended_at, active_course_pack_id, goals, outcome,
                  artifact_paths, proposal_ids, brief_ids, notes
           FROM session_summaries
           WHERE active_course_pack_id = ?
           ORDER BY ended_at DESC
           LIMIT 5`,
        )
        .all(activePackId) as Array<{
        id: string;
        started_at: string;
        ended_at: string;
        active_course_pack_id: string;
        goals: string;
        outcome: string | null;
        artifact_paths: string;
        proposal_ids: string;
        brief_ids: string;
        notes: string | null;
      }>)
    : [];

  return {
    bootstrap: {
      language: prefs?.language ?? null,
      active_course_pack_id: activePackId,
    },
    teaching_profile: profileRow ?? DEFAULT_PROFILE,
    mastery,
    session_summaries: summaryRows.map((row) => ({
      id: row.id,
      started_at: row.started_at,
      ended_at: row.ended_at,
      active_course_pack_id: row.active_course_pack_id,
      goals: parseStringArray(row.goals),
      outcome: row.outcome,
      artifact_paths: parseStringArray(row.artifact_paths),
      proposal_ids: parseStringArray(row.proposal_ids),
      brief_ids: parseStringArray(row.brief_ids),
      notes: row.notes,
    })),
    runtime_registrations: registrationRows,
  };
}

function parseStringArray(raw: string): string[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter((item) => typeof item === "string");
}
