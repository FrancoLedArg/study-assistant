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
The unit of course content loaded for a subject (materials, metadata, teaching config). Lives locally in the workspace. Subject logic is not hard-coded in the core.
_Avoid_: plugin repo, five-repo course system

**Student model**:
Umbrella for everything durable about a learner: mastery/gaps and the teaching profile. Stored remotely. Not a chat log.
_Avoid_: memory (unqualified), weights (as neural nets)

**Teaching profile**:
Finite set of scored, course-agnostic parameters inside the student model that the agent loads to adapt *how* it teaches (presentation, scaffolding, light background). Shared 0.0–1.0 scale; untouched dimensions default to 0.5. Updated only via validated proposals. Informal shorthand: “weights” — not fine-tunes. Not mastery, session goals, affect, or learning-style inventories.
_Avoid_: per-student fine-tune, LoRA, neural weights, VARK, learning style

**Validated proposal**:
A structured student-model update the agent emits; a validator accepts, rejects, or decays it before persistence.
_Avoid_: free profile write, “the model remembers”

**Evidence brief**:
A short structured residue of conversation moments that justify a teaching-profile (or mastery) change — better audit than raw transcript-as-memory.
_Avoid_: full chat log as the model

**Session summary**:
Structured residue of a tutor loop: what was attempted, outcome, artifacts touched — alongside model deltas and evidence briefs. Session goals live here (or at loop start), not in the teaching profile.
_Avoid_: transcript dump

**Workspace artifact**:
Files the harness writes into the student’s local workspace as part of teaching (exercises, examples, etc.). First-class beside chat.

**Bootstrap config**:
Tiny per-student initial values collected up front (language, active course pack, optional short questions to seed the teaching profile). Adaptation continues via validated proposals — bootstrap is not a one-time global system setting.
_Avoid_: long intake questionnaire
