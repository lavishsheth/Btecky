# B Tecky LearnLab — Phase 1 Architecture & Product Specification

**Status:** Proposed implementation baseline  
**Working branch:** btecky_learnlab  
**Production impact:** None. This specification is branch-only and does not authorize a production deployment.

## 1. Product vision

B Tecky LearnLab is a structured, practical technical education product within B Tecky. It should help a learner move from first principles to independent implementation through a coherent sequence of lessons, examples, practice, projects and revision.

The goal is not to reproduce another site's visual design or publish a large volume of shallow pages. LearnLab should combine:
- The clarity and progressive structure of a strong documentation site.
- The guided curriculum and practice of a learning platform.
- The breadth and discoverability of a technical tutorial library.
- A distinctive B Tecky visual identity and editorial standard.

**Product promise:** Learn concepts clearly, practise deliberately, build real things, and understand what to learn next.

## 2. Product principles and non-negotiables

1. **Learning outcomes before page count.** Every course and lesson must have a clear purpose and measurable learner outcome.
2. **Concept → example → practice → application.** A lesson should not stop at explanation.
3. **Beginner-friendly without being inaccurate.** Define terminology, explain prerequisites and avoid unexplained jumps.
4. **Progressive depth.** Beginner, intermediate and advanced labels must reflect actual prerequisites and complexity.
5. **Evidence and accuracy.** Prefer official documentation and primary sources for language, framework and platform behaviour. Record source links and review dates for version-sensitive lessons.
6. **Human editorial review.** AI may assist drafting, but must not autonomously publish technical claims or bulk-generated lessons.
7. **Accessible by design.** Keyboard support, semantic structure, contrast, reduced motion and screen-reader-friendly feedback are release requirements.
8. **Fast and resilient.** Reading content must work without client-side JavaScript. Interactivity enhances the lesson rather than blocking it.
9. **Safe execution.** Learner code must never execute on the B Tecky application server or gain access to application secrets, cookies or internal services.
10. **Preserve B Tecky.** Existing routes, blog publishing, Arcade tools, contact workflows, APIs, analytics and AdSense must remain functional.

## 3. Audience and learning journeys

### Primary audiences
- Complete beginners exploring programming and technology.
- Students preparing for coursework, projects and interviews.
- Developers learning a new language, framework or platform.
- Working engineers refreshing fundamentals or exploring advanced topics.
- Self-directed learners who need a clear next step.

### Core journeys
1. **Explore:** Browse a subject, compare technologies, understand prerequisites and choose a path.
2. **Start:** Enter a course, see outcomes, estimated effort, prerequisites and curriculum.
3. **Learn:** Read a focused lesson with examples, diagrams, code and key takeaways.
4. **Practise:** Attempt questions and exercises; receive explanations, not just a score.
5. **Build:** Apply concepts through guided projects with requirements and acceptance criteria.
6. **Review:** Revisit saved lessons, weak topics and completed practice.
7. **Progress:** See local learning progress and a useful next recommendation.

## 4. Information architecture

Use stable, human-readable URL structure:

- /learn/ — LearnLab landing page and discovery.
- /learn/paths/ — curated learning paths.
- /learn/paths/[path]/ — path overview and ordered curriculum.
- /learn/[category]/ — subject/category landing page.
- /learn/[technology]/ — technology course overview.
- /learn/[technology]/[lesson]/ — canonical lesson route.
- /learn/projects/ — project directory.
- /learn/projects/[project]/ — project brief and milestones.
- /learn/practice/ — practice centre.
- /learn/interview-prep/ — interview preparation directory.
- /learn/search/ — accessible search results and filters.

Avoid duplicate URLs for the same lesson through multiple path aliases. If a lesson belongs to multiple paths, its canonical URL remains under its technology course; path pages link to it.

### Initial subject taxonomy
1. Programming fundamentals
2. Web development
3. Backend and APIs
4. Databases and data engineering
5. Computer science foundations
6. Cloud and DevOps
7. AI and machine learning
8. Cybersecurity
9. Developer tools and workflows

### Recommended first-wave technologies

Build a deliberately scoped first release:
- HTML
- CSS
- JavaScript
- Python
- Java
- SQL
- Git and GitHub
- React

Add MySQL, TypeScript, Node.js, Spring Boot, Docker, Kubernetes, cloud platforms and AI/data science after the core lesson engine and editorial workflow prove themselves.

## 5. Curriculum model

Use three complementary levels:

- **Beginner:** Assumes little or no prior knowledge; introduces vocabulary, mental models and guided examples.
- **Intermediate:** Assumes the learner can use fundamentals independently; focuses on composition, debugging, trade-offs and practical patterns.
- **Advanced:** Assumes strong fundamentals; addresses architecture, performance, security, internals and nuanced trade-offs.

A technology course should contain:
1. Course overview and outcomes.
2. Prerequisites and setup.
3. Ordered modules.
4. Lessons with clear learning objectives.
5. Practice checkpoints.
6. A module-level assessment or review.
7. A capstone or practical project.
8. Further reading and official references.

Do not force every technology into the same number of modules or lessons. The curriculum should reflect the subject, not an arbitrary content quota.

## 6. Lesson quality standard

Every standard lesson should use the sections that fit its learning objective:
1. What the learner will be able to do.
2. Prerequisites and setup.
3. A plain-language explanation and mental model.
4. Important terminology.
5. A worked example, with expected output where relevant.
6. A practical use case.
7. Common mistakes and debugging guidance.
8. Practice questions or a small exercise.
9. Key takeaways.
10. Further reading and source references.

Advanced lessons should add trade-offs, limitations, failure modes, security/performance implications and production considerations where relevant.

Not every lesson needs every section, but no lesson should be padded to meet a word count. A short, complete concept lesson is better than a repetitive long article.

### Editorial acceptance checklist
A lesson is ready only when:
- The stated outcome is achieved by the content.
- Explanations are technically correct and internally consistent.
- Code examples are syntactically valid and their outputs are checked.
- Version-specific statements identify the relevant version or review date.
- External references resolve to relevant primary sources where possible.
- Prerequisites and next steps are clear.
- The content is original, useful and not a lightly rewritten documentation page.
- A human reviewer has checked the final material.

## 7. Technical architecture

### Foundation

Retain the existing Astro 5 static-first architecture, TypeScript and current shared B Tecky layout. Do not migrate the site to a new framework solely for LearnLab.

Use Astro content collections for structured, validated course and lesson content. Start with Markdown content and schema-validated frontmatter. Add MDX only if a concrete lesson requirement justifies the dependency and its build/runtime implications.

Use React islands only for genuinely interactive features such as quizzes, progress controls or playground interfaces. Keep article and lesson reading content server-rendered/static.

### Proposed source layout

    src/
      components/
        learn/
          LearnHeader.astro
          LearnBreadcrumbs.astro
          CategoryCard.astro
          TechnologyCard.astro
          CourseSidebar.astro
          LessonNavigation.astro
          LessonToc.astro
          LessonCallout.astro
          CodeExample.astro
          QuizIsland.tsx
          ProgressControl.tsx
          PlaygroundIsland.tsx
      content/
        learn/
          html/
          css/
          javascript/
          python/
          java/
          sql/
          git/
          react/
      data/
        learn/
          categories.ts
          paths.ts
          technologies.ts
      lib/
        learn/
          curriculum.ts
          progress.ts
          search-index.ts
          schemas.ts
      pages/
        learn/
          index.astro
          paths/
          projects/
          practice/
          [category]/
          [technology]/
            index.astro
            [lesson].astro

This is a target structure, not a requirement to create every component in the first implementation commit. Keep data models and route ownership clear; avoid a single giant page component.

### Content schema

Validate, at minimum:
- Stable unique IDs and URL slugs.
- Title, summary and description.
- Technology and category references.
- Difficulty and prerequisites.
- Learning objectives.
- Estimated reading/practice time where useful.
- Module and lesson ordering.
- Publication status and review metadata.
- Content body.
- References and source review date.
- Optional code examples, exercises and quiz references.

Use explicit draft, review and published states. Only published material is included in public routes, search, sitemap and structured data.

## 8. Learning progress and user accounts

### First release: privacy-conscious local progress

Start without requiring account creation. Use versioned local storage for:
- Completed lessons.
- Course progress.
- Bookmarks.
- Last visited lesson.
- Quiz attempts and best scores, where appropriate.

Requirements:
- Progress is optional and explained to the learner.
- Provide a clear reset/export approach.
- Handle unavailable or blocked storage gracefully.
- Never store passwords, secrets or sensitive personal information.
- Do not claim progress sync across devices.

### Future release: accounts and synchronisation

Do not bolt authentication onto the first release without a real product requirement. Design progress records so a future authenticated backend can synchronise them, but keep the initial content system independent of user identity.

## 9. Practice and assessment architecture

Use a reusable question model with:
- Single-choice and multiple-choice questions.
- True/false where meaningful.
- Output prediction and code-reading questions.
- Short-answer prompts with model explanations.
- Step-by-step exercises and project tasks.

Every objective-scored question needs:
- Correct answer data.
- A clear explanation of why it is correct.
- Explanations for plausible distractors when useful.
- Topic and difficulty tags.
- A link to the lesson that teaches the concept.

Do not present a static multiple-choice quiz as a coding judge. Coding exercises need a separate execution/evaluation design.

## 10. Playground and code execution safety

### Staged strategy

**Stage 1 — Read and copy:** Syntax-highlighted examples, copy controls and expected output. No execution service required.

**Stage 2 — Browser-contained execution:** Support JavaScript in a sandboxed iframe or dedicated worker with strict isolation. Consider Python through a Web Worker and a WebAssembly runtime loaded on demand. Keep execution isolated from the page's DOM, storage, cookies and application origin.

**Stage 3 — Additional languages:** Only add server-side execution through a specialist isolated code-execution provider or a separately operated sandbox fleet. Evaluate data handling, retention, region, rate limits, resource quotas, abuse controls, pricing and operational reliability before selection.

### Mandatory controls
- Never use eval or new Function in the privileged application context.
- Never execute learner code in Astro/Vercel serverless handlers.
- Never expose environment variables, GitHub tokens or internal API credentials.
- Apply execution timeouts, memory/CPU limits and output-size limits.
- Restrict network access by default.
- Prevent cross-user process, filesystem and memory access.
- Treat code, filenames and output as untrusted content.
- Add abuse monitoring and rate limits for any remote execution service.
- Provide clear language/runtime version information and limitations.

## 11. Search and discovery

Extend the existing B Tecky search without replacing or regressing blog search.

Create a build-time search index for published LearnLab categories, technologies, lessons, projects and practice topics. Search should support:
- Title and keyword matching.
- Category and technology filters.
- Difficulty and learning-path filters.
- Keyboard navigation and accessible result announcements.
- Clear empty states and direct canonical lesson links.

Avoid shipping full lesson bodies to the browser solely for search. Keep the index compact and versioned.

## 12. Design system and responsive experience

Reuse B Tecky's typography tokens, spacing foundations, brand assets and shared header/footer, but give LearnLab a recognisable product identity within the existing brand.

### Main desktop lesson layout
- Global B Tecky header.
- LearnLab section navigation/breadcrumbs.
- Left course curriculum sidebar.
- Central readable lesson column.
- Optional right table of contents on sufficiently wide screens.
- Previous/next lesson navigation.
- Contextual practice and project links.

### Mobile lesson layout
- Compact header and course navigation.
- Curriculum in an accessible drawer or disclosure.
- Single readable content column.
- No horizontal overflow for code or tables.
- Sticky controls only where they do not obscure content.
- Large, touch-friendly controls.

### Quality requirements
- Semantic headings and landmarks.
- Full keyboard operation.
- Visible focus states.
- Contrast compliant with WCAG 2.2 AA target.
- Reduced-motion support.
- Useful alt text and captions.
- Responsive tables and code blocks.
- No interaction available only on hover.

## 13. SEO, performance and monetisation

### SEO
- Unique title, description and canonical URL for each public page.
- Breadcrumb navigation and appropriate structured data where eligible.
- Course and lesson relationships represented accurately.
- Sitemap includes only published canonical routes.
- Noindex drafts, private tools and non-content utility pages as appropriate.
- Internal links between prerequisites, lessons, practice and projects.
- Preserve existing blog URLs and metadata.

### Performance
- Static generation for course and lesson pages.
- Keep interactive JavaScript small and load it only when needed.
- Lazy-load heavy playground runtimes.
- Avoid unnecessary client-side routing or large global state libraries.
- Optimise images, fonts and code highlighting.
- Monitor Core Web Vitals on representative desktop and mobile devices.

### Advertising
- Do not let ads interrupt code examples, quiz answers or essential lesson navigation.
- Do not place ads on empty search states, private utilities or thin pages.
- Keep content as the primary purpose of each lesson.
- Apply existing AdSense policies and consent/privacy requirements.
- Never generate lesson pages merely to create more ad inventory.

## 14. Content operations and governance

Create a repeatable authoring workflow:
1. Curriculum proposal and learning outcomes.
2. Source research using primary references.
3. Draft lesson and examples.
4. Technical verification of examples.
5. Editorial and accessibility review.
6. Build and route validation.
7. Publish through a controlled, reviewable Git workflow.
8. Schedule a review for version-sensitive content.

Store review metadata such as reviewedAt, reviewedAgainst and references. Do not imply that a page is current merely because its updatedAt field changed.

The existing Blog Studio must continue publishing to its existing configured target. LearnLab authoring must not silently share or alter that workflow.

## 15. Testing and release gates

### Automated
- Astro type/content validation.
- Build and generated-route checks.
- Unique slug and valid-reference checks.
- No draft pages in public output, search or sitemap.
- Internal link and asset existence checks.
- Quiz schema and answer validation.
- Search-index generation checks.
- Regression tests for existing routes and APIs.

### Browser and manual
- Desktop and mobile layouts.
- Keyboard-only navigation and screen-reader smoke checks.
- Search and filters.
- Progress persistence and reset.
- Quiz feedback and retry behaviour.
- Playground isolation, timeouts and abuse boundaries.
- Existing homepage, blog, contact, Arcade, playlists, badge directory and publishing workflow.

### Release gates
1. Feature branch build passes.
2. Preview deployment passes.
3. LearnLab routes and content pass QA.
4. Existing B Tecky route/functionality regression passes.
5. Accessibility and performance review passes.
6. User explicitly approves merge and production deployment.

## 16. Delivery roadmap

| Phase | Deliverable |
|---|---|
| 0 | Read-only repository audit — completed |
| 1 | Product and technical architecture — this document |
| 2 | LearnLab foundations, navigation entry and landing page |
| 3 | Category and technology course pages |
| 4 | Validated curriculum and lesson engine |
| 5 | First complete technology curriculum and lesson set |
| 6 | Search, breadcrumbs, TOC and lesson navigation |
| 7 | Quiz and practice engine |
| 8 | Local progress, bookmarks and revision |
| 9 | Guided projects and interview preparation |
| 10 | Safe browser playground and execution evaluation |
| 11 | SEO, accessibility, performance and editorial tooling |
| 12 | Full regression testing and preview QA |
| 13 | User review and explicit production approval |

Deliver in small, reviewable commits on the single btecky_learnlab branch. Do not create a branch per phase. Do not merge or deploy to production without explicit approval.

## 17. Decisions to keep open until evidence exists

Do not prematurely select:
- A paid code-execution provider.
- A new authentication or database vendor.
- A subscription or paid course model.
- A heavyweight client-side state framework.
- A large CMS migration.

Make these decisions only when the corresponding feature needs them and after security, cost, privacy and maintenance trade-offs are documented.

## 18. Phase 1 acceptance

Phase 1 is complete when the product vision, audience, URL structure, curriculum model, content schema direction, rendering approach, progress model, practice model, playground threat boundaries, search, design, SEO, governance, testing and rollout gates are documented.

This specification is the implementation baseline. Later changes should be deliberate and recorded rather than introducing inconsistent patterns across courses.


---

## 19. Agreed rebuild decisions — 7 November 2026

This section records the decisions confirmed for the incremental LearnLab rebuild. Where this section differs from earlier proposals in this document, **this section takes precedence for the first release**.

### 19.1 Discovery: learning paths and course catalogue

LearnLab has two equally important discovery routes, backed by one canonical course catalogue:

- **Learning paths** are curated sequences for learners who want guidance. A path references courses by stable course ID/slug and defines their order and relationship.
- **Course catalogue** is the independent browse experience. Learners can discover any published course by subject, technology, level or keyword without joining a path first.
- **Categories** organise courses for browsing. A category does not own or duplicate course content.
- A course may appear in multiple paths and in its category catalogue, but its content and canonical URL exist only once.

The homepage should expose both routes clearly. A path page should link to canonical course pages rather than creating duplicate lesson URLs.

### 19.2 Lesson progression: sequential completion unlock

The agreed first-release rule is **complete the current lesson to unlock the next lesson**.

- The first lesson in a course is available immediately.
- Completing lesson N unlocks lesson N+1.
- A quiz is a learning aid with feedback and explanations; passing it is not a prerequisite for unlocking the next lesson.
- Lesson completion is an explicit learner action after working through the lesson. Merely opening a page or answering a quiz does not mark it complete.
- Progress is stored locally in the browser for the first release. It is not account-synchronised and must not be described as synced across devices.
- Since the first release is static and local-first, this is a learning progression experience, not access control for confidential material. A direct URL must show a clear prerequisite/locked state when the prior lesson is incomplete; it must not silently mark earlier lessons complete.
- The learner can revisit completed lessons. Revisit access must not be removed by sequential unlocking.

### 19.3 Projects: lesson practice plus an integrated path capstone

Both project scales are required:

1. **Lesson practice:** small, focused exercises attached to individual lessons. These help learners apply one concept immediately and are not all required to be full coding workspaces.
2. **Integrated path capstone:** one substantial project that combines the skills from the complete path. It has milestones that correspond to the path's courses, but remains one project with shared artefacts.

For the Web Development path, the capstone is one website:
- HTML creates and owns the semantic document structure.
- CSS styles that same HTML project; it must not replace it with an unrelated demo page.
- JavaScript adds behaviour to the same website; it must not start a separate portfolio project.

A learner may also complete course-specific practice projects, but those do not replace the integrated path capstone. The first release should explain browser-local file persistence and its device/browser boundary. Do not imply cloud sync or account sync.

### 19.4 Canonical information model

Use one source of truth and explicit relationships:

- **Category:** stable ID/slug, title, description and ordering metadata.
- **Course:** stable ID/slug, category reference, title, summary, level, prerequisites, outcomes, publication state and ordered modules/lessons.
- **Learning path:** stable ID/slug, title, audience/level, description and ordered course references.
- **Lesson:** stable ID/slug, course reference, order, objectives, content sections, examples, practice tasks, optional quiz and references.
- **Practice task:** lesson reference, task type, prompt, requirements, hints and evaluation approach.
- **Path capstone:** path reference, brief, shared project identity, milestone-to-course mapping and completion criteria.
- **Progress record:** version, course/lesson completion IDs, last visited item and optional practice/capstone state. Do not store secrets or sensitive personal data.

Relationships are references, not copied content. A course remains independently discoverable even if it is not yet included in a learning path. A path may reference planned courses, but those steps must be visibly marked as planned until the referenced course is published.

### 19.5 Implementation direction for this rebuild

The existing site is Astro 5, TypeScript and static output. The current LearnLab content is a typed TypeScript course array, and the current build has no Zod or content-collection dependency.

For the first rebuild steps:
- Keep the existing Astro static-first architecture and shared BaseLayout.
- Establish typed category, course and path data modules with stable IDs and references.
- Add build-time validation for duplicate slugs, missing category/course references, invalid ordering and path references to unpublished courses.
- Keep canonical lesson content in one place; do not duplicate lesson data into path definitions or homepage arrays.
- Do not introduce a new framework, database, authentication provider or code-execution service in this step.
- Defer any migration to Astro Content Collections until the authoring workflow and validation requirements have been proven against the first complete curricula. This supersedes the earlier Section 7 proposal to migrate immediately.

### 19.6 Repository audit baseline

The read-only audit of the current `main` branch found:

| Area | Current repository state | Rebuild implication |
|---|---|---|
| Runtime/build | Astro 5, TypeScript, static output | Retain the existing stack |
| Course data | `src/data/learn/courses.ts` contains one HTML course | Make the course catalogue the canonical source |
| Categories | Category labels are hardcoded in the LearnLab homepage | Move category metadata to shared data |
| Learning paths | Path cards are hardcoded separately in the homepage and `src/pages/learn/paths/index.astro` | Move path definitions to shared data |
| Course pages | Generated from the course array at `/learn/[technology]/` | Keep course pages canonical |
| Lesson pages | Generated from each course's lesson array | Preserve canonical lesson URLs |
| Progress | A browser-local completion toggle exists | Replace it with explicit sequential progression |
| Quizzes | Answers and feedback are client-side; quiz results do not gate lessons | Keep quiz feedback separate from completion |
| Practice | `/learn/practice/` links to lesson exercises and quizzes | Reuse lesson practice data |
| Projects | Existing project route creates a workspace per lesson and starts each technology with a separate template | Redesign later around lesson exercises and one path-level capstone |
| Output checks | `scripts/verify-site-output.mjs` asserts the current HTML course routes | Extend only when new published courses/routes are introduced |

At audit time, the current `main` branch contains the HTML course. CSS and JavaScript are referenced as future steps in the learning-path presentation but are not present as published courses in the canonical course data. The path and category lists are duplicated between pages.

PR #36 (homepage redesign) and PR #37 (CSS/JavaScript workspace phase) were both open and unmerged during this audit. The rebuild must not depend on either branch or silently merge their unfinished implementation. The rebuild branch starts from `main`.

### 19.7 Incremental delivery boundaries

The rebuild is intentionally divided into small, testable steps:

| Step | Scope | Explicitly out of scope |
|---|---|---|
| 1. Architecture baseline | This decision record, repository audit and acceptance criteria | UI redesign, course expansion, workspace changes |
| 2. Canonical learning data | Shared types, category data, course metadata, path definitions and relationship validation | Homepage redesign |
| 3. Discovery experience | Homepage, category browsing, path listing and path overview backed by canonical data | Lesson engine changes |
| 4. Course experience | Course overview, prerequisites, outcomes and curriculum navigation | New interactive workspace |
| 5. Lesson and progression | Lesson content rendering, completion state and sequential unlock behaviour | Path capstone execution |
| 6. Practice system | Reusable lesson exercises and quiz feedback | Remote code judging |
| 7. Integrated capstone | Path-level project brief, milestones and shared project files | Account/cloud synchronisation |
| 8. Release quality | Regression, accessibility, SEO, responsive QA and preview verification | Automatic production merge |

Each step must have a reviewable diff and its own acceptance checks. Do not start the next step until the current step's checks pass and the user approves moving forward. Do not merge or deploy to production without explicit approval.

### 19.8 Step 1 acceptance criteria

Step 1 is complete when:

- The two discovery routes (learning paths and independent course catalogue) are documented.
- Lesson N+1 unlocks only after lesson N is explicitly completed; quiz passing is not a gate.
- Lesson practice and the integrated path capstone are defined as separate but connected project layers.
- Canonical entities and their relationships are documented without duplicated course/lesson content.
- Existing repository gaps and the unmerged PR boundary are recorded.
- No application UI, course content or workspace behaviour has been changed as part of Step 1.

The next implementation step is Step 2: create the canonical typed learning data and relationship validation. It must be reviewed and tested before any homepage or lesson UI work begins.
