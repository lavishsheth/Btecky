# LearnLab Phase 1 maintenance guide

## Where learning data lives

- `src/data/learn/registry.ts` is the canonical registry for topics, learning paths, course metadata, availability, lesson IDs, durations and path membership.
- `src/data/learn/courses.ts` and the CSS, JavaScript and React course modules retain the lesson bodies, exercises, quizzes and references. The registry overlays canonical metadata when pages consume `learnRegistry.courseContent`.
- `categories.ts` and `paths.ts` are compatibility adapters. Add or update topics and paths in `registry.ts`, not in those adapter files.

## Add a course

1. Add the lesson content module and include it in `courses.ts`.
2. Add its metadata to `courseDefinitions` in `registry.ts`.
3. Use a stable course ID and URL slug. A course may be referenced by more than one path.
4. Add the course ID to the appropriate path stages. An available stage must reference a real course; a coming-soon stage must not expose a course ID.
5. Run the validation and build commands below before publishing.

## Roadmap topics and paths

Use `availability: 'coming-soon'` for topics and path stages that are not ready. Roadmap topics are displayed without category links or generated category pages. A path with no published courses receives a `noindex, nofollow` robots directive. Change availability to `available` only when the course material is ready to be useful.

## Learner progress

- Current key: `btecky.learnlab.progress.v2`.
- The progress service in `src/data/learn/progress.ts` migrates the previous `btecky.learnlab.progress.v1` format when it is first read.
- Lesson IDs use `<course-id>:<lesson-slug>`. Keep IDs and slugs stable so existing progress remains associated with the right lesson.
- Progress is stored in the learner's browser. Course pages provide JSON export, import and reset controls.
- If browser storage is unavailable, the service keeps progress in memory for the current page session and reports that it could not persist it.
- The Web Development project workspace continues to use its separate project-file storage key. Do not merge project files into the lesson-progress object.

## Validation

Run:

```sh
npm run check
npm run typecheck
npm run build
```

Review these routes in the preview:

- `/learn/`
- `/learn/paths/`
- `/learn/paths/web-development/`
- `/learn/courses/`
- `/learn/practice/`
- `/learn/html/`, `/learn/css/`, `/learn/javascript/`, `/learn/react/`
- `/learn/paths/web-development/project/`

Confirm that any lesson can be opened directly, marking lessons complete updates the course and path progress, the v1 key migrates to v2, progress export/import/reset works, and the project workspace still loads and saves independently.
