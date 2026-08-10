# ITS / learner-model dimensions (primary sources)

Question answered: which learner-/student-model dimensions do established ITS and learning-science **primary sources** actually use, that should inform Study OS’s later v1 teaching-profile taxonomy?

Method: claims below are traced to owning papers, textbooks, or official assessment specs—not secondary roundups. Prefer fewer well-attested dimensions over a laundry list. This note **does not lock** Study OS’s taxonomy (that is the teaching-profile taxonomy wayfinder ticket).

Study OS framing used while reading: **student model** = mastery/gaps + **teaching profile** (scored parameters the tutor loads, not neural fine-tunes). Sources rarely use that split; they usually put everything under “student/user model.” Below, each dimension is tagged `[mastery]` or `[profile/adaptation]` for later grilling—not as a decision.

---

## 1. Architectural framing: what a student model is for

**VanLehn (2006)** describes tutoring systems as an outer loop (task selection) and an inner loop (per-step feedback/hints). The inner loop updates a **student model**; the outer loop uses it to choose the next task. For a macroadaptive outer loop, the model is a set of **attribute–value pairs** whose attributes are traits such as a **knowledge component**, a **learning style**, etc., plus optionally external facts (test scores, major, GPA) and performance logs (tasks done, time, help requests, errors).

- Kurt VanLehn, “The Behavior of Tutoring Systems,” *International Journal of Artificial Intelligence in Education* 16(3), 2006, pp. 227–265.  
  PDF: https://cs.uky.edu/~sgware/reading/papers/vanlehn2006behavior.pdf  
  DOI: https://doi.org/10.3233/JAI-2006-16302

**Woolf (2009)** treats “Student Knowledge” as a first-class ITS module and organizes examples around modeling **skills**, **procedures**, **affect**, and **complex problem solving**, with representation patterns including **overlay**, **bug libraries**, **bandwidth**, and **open user models**.

- Beverly Park Woolf, *Building Intelligent Interactive Tutors*, Morgan Kaufmann / Elsevier, 2009, esp. Ch. 3 “Student Knowledge.”  
  TOC sample: https://booksite.elsevier.com/samplechapters/9780123735942/Sample_Chapters/01~Front_Matter.pdf  
  ISBN: 978-0-12-373594-2

**Self’s classic ITS tripartition** remains the background ontology: domain (*what*), student model (*who*), tutoring strategy (*how*).

- John Self, “The defining characteristics of intelligent tutoring systems research: ITSs care, precisely,” *International Journal of Artificial Intelligence in Education* 10, 1999, pp. 350–364.  
  PDF: https://telearn.hal.science/hal-00197346/file/self99.pdf  
  (Self also cites Self 1988/1990 on making student modeling tractable by modeling only what the tutor can act on.)

---

## 2. Knowledge / mastery per knowledge component `[mastery]`

**Bayesian Knowledge Tracing (BKT)** is the canonical mastery dimension in Cognitive Tutors: for each production rule (knowledge component), maintain \(P(L_n)\), the probability the rule is in the **learned** state. Learning/performance parameters are:

| Parameter | Meaning |
|-----------|---------|
| \(P(L_0)\) | Prior probability the rule is already learned |
| \(P(T)\) | Probability of transition unlearned → learned on an opportunity |
| \(P(G)\) | Guess: correct action while unlearned |
| \(P(S)\) | Slip: incorrect action while learned |

Mastery-based sequencing continues until each rule is “mastered” under these estimates.

- Albert T. Corbett & John R. Anderson, “Knowledge tracing: Modeling the acquisition of procedural knowledge,” *User Modeling and User-Adapted Interaction* 4, 1994/1995, pp. 253–278.  
  DOI: https://doi.org/10.1007/BF01099821  
- Same parameterization summarized in Corbett & Anderson, “Cognitive Mastery Learning in the ACT Programming Tutor,” (knowledge-tracing parameters figure).  
  PDF (SciSpace copy): related ACT Programming Tutor mastery write-up citing the above.

**Cognitive Tutors / model tracing** represent target competence as a **production set**; the tutor traces the student’s steps against that model and (via knowledge tracing) estimates growth per rule. Incorrect/early strategies and **misconceptions** are also represented as productions in the cognitive model.

- John R. Anderson, Albert T. Corbett, Kenneth R. Koedinger & Ray Pelletier, “Cognitive Tutors: Lessons Learned,” *Journal of the Learning Sciences* 4(2), 1995, pp. 167–207.  
  HTML: http://act-r.psy.cmu.edu/papers/Lessons_Learned.html  
  DTIC PDF: https://apps.dtic.mil/sti/tr/pdf/ADA312246.pdf

**VanLehn** generalizes this to **knowledge components** (principles, concepts, rules, procedures, facts, associations—including *incorrect* ones instructors do not want applied). Fine-grained assessment often means a **probability of mastery per knowledge component**.

- VanLehn (2006), § on knowledge components / assessment (link above).

**Overlay models** (ITS → adaptive educational hypermedia): user’s knowledge as subset / weighted overlay of a domain model, with boolean or graded (qualitative or probabilistic) estimates per fragment.

- Peter Brusilovsky & Eva Millán, “User Models for Adaptive Hypermedia and Adaptive Educational Systems,” in *The Adaptive Web*, LNCS 4321, Springer, 2007, §1.2.1 Knowledge.  
  PDF: https://sites.pitt.edu/~peterb/papers/1_BrusilovskyMillan.pdf

---

## 3. Knowledge states / knowledge spaces `[mastery]`

**Knowledge Space Theory** formalizes a learner’s state as the **subset of problems** they can solve; a **knowledge space** is a family of feasible states (classically closed under union). Assessment aims to identify the state, not a single scalar score.

- Jean-Paul Doignon & Jean-Claude Falmagne, “Spaces for the assessment of knowledge,” *International Journal of Man-Machine Studies* 23(2), 1985, pp. 175–196.  
  DOI: https://doi.org/10.1016/S0020-7373(85)80031-6

**ALEKS / learning spaces** (authors’ own exposition): assessment identifies the student’s **knowledge state**; instruction targets the **outer fringe** (problems just beyond the state). Related monograph: Doignon & Falmagne, *Knowledge Spaces*, 1999 (cited therein).

- Jean-Claude Falmagne, Eric Cosyn, Jean-Paul Doignon & Nicolas Thiéry, “The Assessment of Knowledge, in Theory and in Practice,” in *Formal Concept Analysis*, LNAI 3874, Springer, 2006.  
  Publisher PDF (ALEKS science page): https://www.aleks.com/about_aleks/Science_Behind_ALEKS.pdf  
  Open PDF: https://dipot.ulb.ac.be/dspace/bitstream/2013/54173/3/2006_Falmagne_Cosyn_Doignon_Thiery.pdf

---

## 4. Incorrect knowledge, bugs, constraints `[mastery]`

Beyond “missing” expertise, primary sources model **faulty** knowledge:

- **Bug libraries / buggy models** — explicit catalogs of misconceptions (Woolf Ch. 3 structure; classic ITS theme in Wenger’s synthesis of incorrect knowledge / diagnosis).
- **Constraint-Based Modeling** — domain knowledge as **state constraints**; violations indicate incomplete or incorrect knowledge and drive tutor response, without requiring a runnable expert/student path model.

- Stellan Ohlsson, “Constraint-Based Student Modeling,” in Greer & McCalla (eds.), *Student Modelling: The Key to Individualized Knowledge-Based Instruction*, NATO ASI Series F 125, Springer, 1994, pp. 167–189.  
  DOI: https://doi.org/10.1007/978-3-662-03037-0_7  
- Applied lineage: Antonija Mitrovic et al. on constraint-based tutors (e.g. “Constraint-Based Tutors: a Success Story”), building directly on Ohlsson.  
  PDF: https://www.csse.canterbury.ac.nz/tanja.mitrovic/cbmtut.pdf

**Open Learner Model (OLM) content** commonly exposes **knowledge level**, **difficulties**, and **misconceptions** as inspectable facets (SMILI framework elements).

- Susan Bull & Judy Kay, “SMILI☺: a Framework for Interfaces to Learning Data in Open Learner Models, Learning Analytics and Related Fields,” *IJAIED*, 2016 (revisiting Bull & Kay 2007).  
  DOI: https://doi.org/10.1007/s40593-015-0090-8  
- Original framework: Bull & Kay, “Student Models that Invite the Learner In: The SMILI☺ Open Learner Modelling Framework,” *IJAIED* 17(2), 2007.  
  DOI: https://doi.org/10.3233/JAI-2007-17(2)02

---

## 5. Cognitive–affective states `[profile/adaptation]` (often session-scoped)

Established affect taxonomies used in ITS field studies / detectors:

**Baker, D’Mello, Rodrigo & Graesser (2010)** compare six cognitive–affective states across learning environments:

1. boredom  
2. frustration  
3. confusion  
4. engaged concentration  
5. delight  
6. surprise  

Finding relevant to tutoring policy: **boredom** is highly persistent and linked to poorer learning / gaming; **confusion** and **engaged concentration** are most common; delight/surprise are rare—so detection effort should prioritize boredom and confusion.

- Ryan S. J. d. Baker, Sidney K. D’Mello, Ma. Mercedes T. Rodrigo & Arthur C. Graesser, “Better to Be Frustrated than Bored…,” *International Journal of Human-Computer Studies* 68(4), 2010, pp. 223–241.  
  Author PDF: https://learninganalytics.upenn.edu/ryanbaker/BDRG-IJHCS-Final.pdf  
  DOI: https://doi.org/10.1016/j.ijhcs.2009.12.003

**AutoTutor line (Craig et al., 2004)** observed: frustration, boredom, flow, confusion, eureka, neutral—with learning correlations for boredom (−), flow (+), confusion (+; cognitive disequilibrium).

- Scotty D. Craig, Arthur C. Graesser, Jeremiah Sullins & Barry Gholson, “Affect and learning: An exploratory look into the role of affect in learning with AutoTutor,” *Journal of Educational Media* 29(3), 2004, pp. 241–250.  
  DOI: https://doi.org/10.1080/1358165042000283101

Woolf Ch. 3.4.3 treats **modeling affect** (hardware- and software-based emotion recognition; Affective Learning Companions / Wayang Outpost) as a first-class student-modeling example.

These are primarily **momentary states** in the sources; durable “affective profile” is not what the cited detectors claim to store.

---

## 6. Help-seeking / metacognitive behavior `[profile/adaptation]`

The **Help Tutor** models desirable vs maladaptive help use with ~80 production rules over Cognitive Tutor interactions. Broad maladaptive categories include:

- **Help Abuse**  
- **Help Avoidance**  
- **Try-step Abuse**  
(plus finer subcategories)

The model is contextual: appropriate help depends on estimated skill on the current step (zone of proximal development framing).

- Vincent Aleven, Bruce McLaren, Ido Roll & Kenneth Koedinger, “Toward Meta-cognitive Tutoring: A Model of Help Seeking with a Cognitive Tutor,” *IJAIED* 16(2), 2006, pp. 101–128.  
- Ido Roll, Vincent Aleven, Bruce McLaren & Kenneth Koedinger, Help Tutor ITS 2006 paper.  
  PDF: http://www.cs.cmu.edu/~bmclaren/pubs/RollEtAl-HelpTutor-ITS2006.pdf  
- Synthesis with taxonomy restated: Aleven et al., “Help Helps, But Only So Much…,” *IJAIED* 26, 2016.  
  DOI: https://doi.org/10.1007/s40593-015-0089-1

---

## 7. Goals, background, preferences, interests, traits `[profile/adaptation]`

**Brusilovsky & Millán (2007)** — primary survey chapter for adaptive educational / hypermedia **user features** actually modeled:

| Feature | Role in sources |
|---------|-----------------|
| **Knowledge** | Dominant AES feature; overlay / scalar / structural |
| **Interests** | Overlay / keyword / concept profiles (grew with Web IR) |
| **Goals / tasks** | Immediate purpose; highly changeable within/across sessions; includes **learning goals** |
| **Background** | Prior experience *outside* core domain (profession, related-area experience, language ability); often **stereotype**, stable, hard to infer from interaction alone |
| **Individual traits** | Personality, **cognitive styles**, **learning styles**, cognitive factors (e.g. working memory); stable; usually from psychological instruments |
| **Context** (incl. **affective state**) | Separate from durable individual features; includes platform, location, affect |

Preferences are listed among classic adaptive-hypermedia user features (goals, preferences, knowledge) in Brusilovsky’s earlier state-of-the-art paper.

- Brusilovsky & Millán (2007), §1.2 — PDF above.  
- Peter Brusilovsky, “Adaptive Hypermedia,” *User Modeling and User-Adapted Interaction* 11, 2001, pp. 87–110.  
  PDF: http://www.umuai.org/downloads/ten_year_anniversary/brusilovsky-umuai-2001.pdf  
  DOI: https://doi.org/10.1023/A:1011143116306

**Caveat from the same primary literature:** Brusilovsky documents that **learning-style adaptation** became a very popular research thread; that is evidence that systems *model* such traits, not that Study OS should adopt VARK-style inventories. VanLehn likewise lists “learning styles and preferences” as examples of stable traits *some* tutors store—again descriptive, not a validation of style inventories.

---

## 8. Extended student-model scope (beyond domain score) `[mixed]`

**Bull, Brna & Pain (1995)** argue for explicitly representing more than domain performance:

1. **Performance in the domain**  
2. **Acquisition order** of target knowledge  
3. **Analogy** (relevant background mappings)  
4. **Learning strategies**  
5. **Awareness and reflection** (via a **transparent / negotiable** model rather than a fifth stored scalar)

- Susan Bull, Paul Brna & Helen Pain, “Extending the Scope of the Student Model,” *User Modeling and User-Adapted Interaction* 5(1), 1995, pp. 45–65.  
  DOI: https://doi.org/10.1007/BF01101801  
  Author abstract: https://www.dai.ed.ac.uk/papers/documents/rp761.html

This is also an early root of **open / negotiable** learner models (inspect, discuss, sometimes edit)—relevant to Study OS’s validated-proposal + evidence-brief update path, even though OLM UIs are out of scope for v1 shape.

---

## 9. Performance / evidence telemetry (supporting dimensions, not “personality”)

Primary sources repeatedly treat raw interaction evidence as part of or feed into the student model:

- tasks completed, duration, help-request counts, error counts (VanLehn 2006)  
- correctness / opportunity sequences driving BKT updates (Corbett & Anderson)  
- constraint satisfactions/violations (Ohlsson)  
- self / peer / instructor assessments as evidence sources alongside automated data (Bull & Kay SMILI lineage)

These are **evidence channels**, not teaching-profile axes by themselves—but Study OS’s proposal/evidence-brief design will need them.

---

## Candidates worth considering for Study OS v1

Dimensions only—no taxonomy lock. Grouped for the mastery vs teaching-profile split Study OS already uses.

### Mastery / gaps (course-tied; ticket 06 etc.)

1. **Per–knowledge-component mastery probability** (BKT-style \(P(L)\), or simpler overlay weight) — Corbett & Anderson; VanLehn KC framing; Brusilovsky overlay.  
2. **Incorrect knowledge / misconceptions / constraint violations** (separate from “unknown”) — Ohlsson CBM; Cognitive Tutor buggy productions; OLM “misconceptions” facet.  
3. **Knowledge-state / fringe** (what is solvable now; what is teachable next) — Doignon & Falmagne; Falmagne et al. / ALEKS outer fringe.  
4. **Difficulties** (OLM facet distinct from raw mastery) — Bull & Kay SMILI content elements.

### Teaching profile / adaptation parameters (course-agnostic candidates for ticket 02)

5. **Learning / session goals** (what the learner wants to achieve now) — Brusilovsky goals/tasks.  
6. **Background** (prior related experience outside the current cátedra core) — Brusilovsky background / stereotypes.  
7. **Preferences** (presentation / interaction preferences the tutor should honor) — Brusilovsky adaptive-hypermedia user features.  
8. **Interests** (topic interest overlay, if multi-topic tutoring needs it) — Brusilovsky interests.  
9. **Help-seeking / scaffolding stance** (tendencies toward help abuse, avoidance, or appropriate instrumental help) — Aleven et al. Help Tutor categories.  
10. **Learning strategies** (explicit strategy preferences/habits) — Bull, Brna & Pain.  
11. **Affect-response policy hooks** (not durable mood scores): which states the tutor should watch and how aggressively to intervene—grounded in Baker et al.’s boredom/confusion priority and AutoTutor affect–learning links. Session **state** itself is ephemeral; the *policy weight* could be a profile parameter.

### Explicitly *not* elevated here without further grilling

- Classic **learning-style inventory** dimensions: appear in Brusilovsky/VanLehn as things systems have stored, but these primary sources do not establish them as effective adaptation levers for a university course-faithful tutor. Ticket 02 should decide inclusion, not this note.  
- Full **cognitive-style** batteries (field dependence, holist/serialist, etc.) — same status.  
- Fine sensor affect models as durable profile fields — sources treat affect as contextual/state.

---

## Bibliography (compact)

1. Aleven, V., McLaren, B., Roll, I., & Koedinger, K. (2006). Toward meta-cognitive tutoring… *IJAIED* 16(2).  
2. Aleven et al. (2016). Help Helps, But Only So Much… *IJAIED*. https://doi.org/10.1007/s40593-015-0089-1  
3. Anderson, J. R., Corbett, A. T., Koedinger, K. R., & Pelletier, R. (1995). Cognitive Tutors: Lessons Learned. *JLS* 4(2). http://act-r.psy.cmu.edu/papers/Lessons_Learned.html  
4. Baker, R. S. J. d., D’Mello, S. K., Rodrigo, M. M. T., & Graesser, A. C. (2010). Better to Be Frustrated than Bored… *IJHCS*. https://learninganalytics.upenn.edu/ryanbaker/BDRG-IJHCS-Final.pdf  
5. Brusilovsky, P. (2001). Adaptive Hypermedia. *UMUAI* 11. http://www.umuai.org/downloads/ten_year_anniversary/brusilovsky-umuai-2001.pdf  
6. Brusilovsky, P., & Millán, E. (2007). User Models for Adaptive Hypermedia… *The Adaptive Web*. https://sites.pitt.edu/~peterb/papers/1_BrusilovskyMillan.pdf  
7. Bull, S., Brna, P., & Pain, H. (1995). Extending the Scope of the Student Model. *UMUAI* 5(1). https://doi.org/10.1007/BF01101801  
8. Bull, S., & Kay, J. (2007/2016). SMILI☺ OLM framework. *IJAIED*. https://doi.org/10.1007/s40593-015-0090-8  
9. Corbett, A. T., & Anderson, J. R. (1995). Knowledge tracing… *UMUAI* 4. https://doi.org/10.1007/BF01099821  
10. Craig, S. D., Graesser, A. C., Sullins, J., & Gholson, B. (2004). Affect and learning… AutoTutor. https://doi.org/10.1080/1358165042000283101  
11. Doignon, J.-P., & Falmagne, J.-C. (1985). Spaces for the assessment of knowledge. *IJMMS* 23(2). https://doi.org/10.1016/S0020-7373(85)80031-6  
12. Falmagne, J.-C., Cosyn, E., Doignon, J.-P., & Thiéry, N. (2006). The Assessment of Knowledge… https://www.aleks.com/about_aleks/Science_Behind_ALEKS.pdf  
13. Ohlsson, S. (1994). Constraint-Based Student Modeling. In Greer & McCalla. https://doi.org/10.1007/978-3-662-03037-0_7  
14. Self, J. (1999). ITSs care, precisely. *IJAIED* 10. https://telearn.hal.science/hal-00197346/file/self99.pdf  
15. VanLehn, K. (2006). The Behavior of Tutoring Systems. *IJAIED* 16(3). https://cs.uky.edu/~sgware/reading/papers/vanlehn2006behavior.pdf  
16. Woolf, B. P. (2009). *Building Intelligent Interactive Tutors*. Elsevier. ISBN 978-0-12-373594-2  
