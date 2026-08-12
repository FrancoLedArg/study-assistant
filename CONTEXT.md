# Study OS

Domain language for a course-faithful tutoring harness. Glossary only — no implementation detail.

## Language

**Study OS**:
The product: an agent harness that turns an LLM client into a course-faithful tutor with durable student memory. The LLM is replaceable; the harness, student model, and course materials are the product.
_Avoid_: chatbot, learning OS (as a build plan), GPT tutor

**Agent harness**:
The system an LLM client plugs into (MCP + tools/skills). It is the v1 product surface. First users are the operator and MCP-capable peers only. **Tools** do I/O (load context, cátedra search/read, allowlisted web search, workspace artifacts, subject-runtime probe/run, submit validated proposal + evidence brief, session summary read/write). **Skills** choreograph the tutor loop and teaching rules — they are not I/O. v1 locks a closed capability set for one complete tutor loop on one course pack; exact tool names and full skill prose are implementation detail.
_Avoid_: Learning API (as the center), web app (as v1), unbounded tool matrix, teach-as-a-tool

**Tutor loop**:
One study engagement: load course context and student model → teach → optional workspace artifacts → emit validated proposals (and evidence) before exit. Choreographed by harness skills; durable writes to the student model go only through validated proposals.
_Avoid_: chat session (as synonym for memory)

**Course-faithful**:
Teaching that prefers cátedra materials, terminology, and framing over generic internet pedagogy.

**Cátedra source**:
Material from the course/professor (PDFs, notes, slides, exams, assignments). Takes priority when available for the topic.
_Avoid_: “course PDF” as the only form

**External source**:
Non-cátedra material reached only through an explicit **web search** tool after a **cátedra miss** (or explicit learner request), filtered by an **allowlist** of domains/URL prefixes (harness-global defaults plus optional per-pack allow/deny overlays). Always labeled as external (type + URL/title); never silent model recall; never written into pack `sources/` as if it were cátedra. v1 has no Fetch-URL / page-scrape tool.
_Avoid_: “the model just knows”, whole-web access, autonomous HTML fetch (v1)

**Cátedra miss**:
Precondition for external web search: the tutor loop has searched the active pack’s `sources/` and found no adequate hit for the need — or the learner explicitly asks to go outside cátedra. Not a durable store record; a loop gate before external tools may run.
_Avoid_: silent miss, skip-cátedra-by-default

**Course pack**:
The unit of course content for a subject: cátedra sources, pack metadata, optional course teaching config, and optional mastery/KC definitions. Lives under `course-packs/<pack-id>/` in the workspace (id = folder name; human label = display name). Not learner state — that stays in the student-model store. Subject logic is not hard-coded in the core.
_Avoid_: plugin repo, five-repo course system, pack-as-student-DB

**Student model**:
Umbrella for everything durable about a learner: per–course-pack mastery scores and the teaching profile. Lives in the learner’s **student-model store** (local, user-owned) — not an operator-hosted remote. Not a chat log.
_Avoid_: memory (unqualified), weights (as neural nets)

**Knowledge component**:
A pack-authored unit of course competence: stable id, human label, and short description of what “mastered” means. Definitions live in the course pack’s `mastery.yaml`; the learner’s score for that unit (if any) lives in the student-model store, keyed by pack id then knowledge-component id. Flat list only — no prerequisite graph in the model. Diagnostic “bracket below” probing is tutor-loop judgment plus cátedra, not stored edges.
_Avoid_: free topic tag, module (as synonym for a KC), knowledge-graph node, syllabus unit (as the only grain)

**Mastery score**:
A 0.0–1.0 value for one knowledge component in one course pack. Absent until first evidence — never auto-defaulted to 0.5 or 0.0. Updated only via validated proposals, which may raise or lower and may target only ids listed in that pack’s `mastery.yaml`. The first write on an absent KC may set an absolute 0–1 value; later updates use the normal per-proposal step cap. No locked numeric “mastered” threshold in the schema.
_Avoid_: BKT parameter set, discrete mastery level enum (as the v1 store), global KC id across packs

**Gap**:
Informal name for low or missing mastery on a knowledge component (plus live diagnosis in the tutor loop). Not a separate durable record beside mastery scores. Durable misconception / wrong-knowledge lists are out of v1.
_Avoid_: gap entity, bug library, misconception store (v1)

**Student-model store**:
The durable local home of one learner’s student model and related residue (session summaries, evidence briefs). Lives outside any single course-pack workspace. The harness points at it via `student_model_store` (optional env override; default under `~/.study-os/` so a new workspace does not reset the learner). One store per learner.
_Avoid_: remote student DB, shared multi-tenant profile server, model files trapped inside one project folder

**Teaching profile**:
Finite set of scored, course-agnostic parameters inside the student model that the agent loads to adapt *how* it teaches (presentation, scaffolding, light background). Shared 0.0–1.0 scale; untouched dimensions default to 0.5. Updated only via validated proposals. Informal shorthand: “weights” — not fine-tunes. Not mastery, session goals, affect, or learning-style inventories.
_Avoid_: per-student fine-tune, LoRA, neural weights, VARK, learning style

**Validated proposal**:
A structured student-model update the agent emits; a validator **accepts**, **rejects**, or **decays** it before applying any score change. Decay means shrink an oversized |\Δ| to the max step (then clamp into 0.0–1.0), not time-based score fading. Hard rejects cover illegal targets, missing/malformed evidence briefs, and out-of-range absolute seeds. Rejected proposals are still stored (with their brief) without applying the delta. Same-target accepts in one session are last-wins; accepts are rate-limited per tutor loop.
_Avoid_: free profile write, “the model remembers”, judgmental evidence grading, between-session auto-decay

**Evidence brief**:
A short structured audit of conversation moments that justify one **validated proposal** (teaching-profile or mastery) — sibling of the **session summary**, not embedded in it and not a transcript. Exactly one brief per emitted proposal; each brief holds up to a few typed moments (kind + short note + optional learner-only quote). Absent when no proposal is emitted. For the validator it is a **presence/schema gate only** — moment contents do not decide accept vs reject.
_Avoid_: full chat log as the model, free-form essay justification, tutor quotes as evidence, brief-as-scoring-rubric

**Session summary**:
Structured residue of every **tutor loop**, stored in the **student-model store**. v1 fields: id, started/ended times, active **course pack** id, short session goal(s), short outcome, **workspace artifact** paths touched, ids of **validated proposals** and **evidence briefs** from the loop, optional short notes. **Evidence briefs** and proposal bodies stay as siblings — not embedded. Not a transcript; not a dump of the full **teaching profile** or mastery scores. Written even when no proposal is emitted. The next loop loads the current **student model** plus the latest summary for the active pack (and up to a few recent ones if needed).
_Avoid_: transcript dump, profile/mastery mirror, brief bodies inlined in the summary

**Workspace artifact**:
Files the harness writes into the student’s local workspace as part of teaching (exercises, examples, etc.). First-class beside chat. The guaranteed practice path when no live **subject runtime** is available.

**Subject runtime**:
An installed external program or engine the tutor loop may use for live practice (e.g. a SQL CLI), distinct from **workspace artifacts**. Optional and opportunistic — never required for a loop to complete; the harness does not install or provision it.
_Avoid_: tool matrix, SQL console (as product pillar), required pack dependency

**Technology family**:
A stable id for a class of practice engines the learner may register once (v1: `sql`). Course packs declare a preference for a family; registration is keyed by family, not by pack and not learner-global across all subjects.
_Avoid_: open-ended tool category taxonomy, per-pack-only runtime identity

**Runtime registration**:
The learner’s durable choice of which **subject runtime** to use for one **technology family**, stored in the **student-model store** (not harness config YAML, not the course pack). v1 fields: `family`, `engine` (closed id), `command` (executable name or absolute path). No connection strings, hosts, or passwords in v1. Pack technology preference guides suggestion only; registration wins when they disagree. Missing, unknown engine, or failed **probe** → artifacts (+ suggest install; no harness install flow).
_Avoid_: pack-embedded install path, global multi-subject detect matrix, harness-owned package install, DSN-in-registration

**Probe**:
A harness check that a **runtime registration** is usable: resolve `command` and run a cheap version/help invocation. Not a database server login. May re-run in-session after the learner says the runtime is ready.
_Avoid_: TCP/DSN connectivity test (v1), scanning an open tool matrix

**Bootstrap config**:
Tiny per-student initial values collected up front (language, active course pack, optional short questions to seed the teaching profile). Bootstrap seeding may set absolute teaching-profile values; later profile updates use the normal per-proposal step cap. Adaptation continues via validated proposals — bootstrap is not a one-time global system setting.
_Avoid_: long intake questionnaire
