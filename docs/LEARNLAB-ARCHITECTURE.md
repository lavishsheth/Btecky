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
