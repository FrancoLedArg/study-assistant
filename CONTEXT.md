# Study OS

Domain language for a course-faithful tutoring harness. Glossary only — no implementation detail.

## Language

**Study OS**:
The product: an agent harness that turns an LLM client into a course-faithful tutor with durable student memory. The LLM is replaceable; the harness, student model, and course materials are the product.
_Avoid_: chatbot, learning OS (as a build plan), GPT tutor

**Agent harness**:
The system an LLM client plugs into (MCP + tools/skills). It is the v1 product surface. First users are the operator and MCP-capable peers only.
_Avoid_: Learning API (as the center), web app (as v1)

**Tutor loop**:
One study engagement: load course context and student model → teach → optional workspace artifacts → emit validated proposals (and evidence) before exit.
_Avoid_: chat session (as synonym for memory)

**Course-faithful**:
Teaching that prefers cátedra materials, terminology, and framing over generic internet pedagogy.

**Cátedra source**:
Material from the course/professor (PDFs, notes, slides, exams, assignments). Takes priority when available for the topic.
_Avoid_: “course PDF” as the only form

**External source**:
Non-cátedra material reached only through explicit tools (with allowlists), never silent model recall, and always distinguished from cátedra.
_Avoid_: “the model just knows”

**Course pack**:
The unit of course content for a subject: cátedra sources, pack metadata, optional course teaching config, and optional mastery/KC definitions. Lives under `course-packs/<pack-id>/` in the workspace (id = folder name; human label = display name). Not learner state — that stays in the student-model store. Subject logic is not hard-coded in the core.
_Avoid_: plugin repo, five-repo course system, pack-as-student-DB

**Student model**:
Umbrella for everything durable about a learner: mastery/gaps and the teaching profile. Lives in the learner’s **student-model store** (local, user-owned) — not an operator-hosted remote. Not a chat log.
_Avoid_: memory (unqualified), weights (as neural nets)

**Student-model store**:
The durable local home of one learner’s student model and related residue (session summaries, evidence briefs). Lives outside any single course-pack workspace; the harness is configured to point at it. One store per learner.
_Avoid_: remote student DB, shared multi-tenant profile server, model files trapped inside one project folder

**Teaching profile**:
Finite set of scored, course-agnostic parameters inside the student model that the agent loads to adapt *how* it teaches (presentation, scaffolding, light background). Shared 0.0–1.0 scale; untouched dimensions default to 0.5. Updated only via validated proposals. Informal shorthand: “weights” — not fine-tunes. Not mastery, session goals, affect, or learning-style inventories.
_Avoid_: per-student fine-tune, LoRA, neural weights, VARK, learning style

**Validated proposal**:
A structured student-model update the agent emits; a validator accepts, rejects, or decays it before persistence.
_Avoid_: free profile write, “the model remembers”

**Evidence brief**:
A short structured audit of conversation moments that justify one **validated proposal** (teaching-profile or mastery) — sibling of the **session summary**, not embedded in it and not a transcript. Exactly one brief per emitted proposal; each brief holds up to a few typed moments (kind + short note + optional learner-only quote). Absent when no proposal is emitted.
_Avoid_: full chat log as the model, free-form essay justification, tutor quotes as evidence

**Session summary**:
Structured residue of a tutor loop: what was attempted, outcome, artifacts touched — alongside model deltas and evidence briefs. Session goals live here (or at loop start), not in the teaching profile. Stored in the learner’s student-model store.
_Avoid_: transcript dump

**Workspace artifact**:
Files the harness writes into the student’s local workspace as part of teaching (exercises, examples, etc.). First-class beside chat.

**Bootstrap config**:
Tiny per-student initial values collected up front (language, active course pack, optional short questions to seed the teaching profile). Adaptation continues via validated proposals — bootstrap is not a one-time global system setting.
_Avoid_: long intake questionnaire
