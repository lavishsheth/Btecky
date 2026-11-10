export const LEARNLAB_PROGRESS_KEY = 'btecky.learnlab.progress.v2';
export const LEGACY_LEARNLAB_PROGRESS_KEY = 'btecky.learnlab.progress.v1';

export type CourseProgress = {
  completedLessonIds: string[];
  lastLessonId?: string;
  completedAt: string | null;
};
export type LearnLabProgress = {
  version: 2;
  lastPathId: string | null;
  courses: Record<string, CourseProgress>;
};
export type ProgressCourseMap = Record<string, {
  id: string;
  slug: string;
  lessonIds: string[];
  lessonSlugs: string[];
}>;

let memoryProgress: LearnLabProgress = { version: 2, lastPathId: null, courses: {} };\n\nfunction isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function findCourse(courseMap: ProgressCourseMap, identifier: string) {
  return Object.values(courseMap).find((course) => course.id === identifier || course.slug === identifier);
}
export function createEmptyProgress(): LearnLabProgress {
  return { version: 2, lastPathId: null, courses: {} };
}

function normaliseProgress(value: unknown, courseMap: ProgressCourseMap): LearnLabProgress {
  if (!isRecord(value) || !isRecord(value.courses)) return createEmptyProgress();
  const result = createEmptyProgress();
  result.lastPathId = typeof value.lastPathId === 'string' ? value.lastPathId : null;
  Object.entries(value.courses).forEach(([identifier, rawCourse]) => {
    if (!isRecord(rawCourse)) return;
    const course = findCourse(courseMap, identifier);
    if (!course) return;
    const allowed = new Set(course.lessonIds);
    const completed = Array.isArray(rawCourse.completedLessonIds)
      ? rawCourse.completedLessonIds.filter((id): id is string => typeof id === 'string' && allowed.has(id))
      : [];
    result.courses[course.id] = {
      completedLessonIds: [...new Set(completed)],
      ...(typeof rawCourse.lastLessonId === 'string' && allowed.has(rawCourse.lastLessonId) ? { lastLessonId: rawCourse.lastLessonId } : {}),
      completedAt: typeof rawCourse.completedAt === 'string' ? rawCourse.completedAt : null,
    };
  });
  return result;
}

export function migrateLegacyProgress(value: unknown, courseMap: ProgressCourseMap): LearnLabProgress {
  const migrated = createEmptyProgress();
  if (!isRecord(value)) return migrated;
  Object.entries(value).forEach(([courseSlug, rawCompleted]) => {
    const course = findCourse(courseMap, courseSlug);
    if (!course || !Array.isArray(rawCompleted)) return;
    const slugToId = new Map(course.lessonSlugs.map((slug, index) => [slug, course.lessonIds[index]]));
    const completedLessonIds = rawCompleted
      .filter((slug): slug is string => typeof slug === 'string')
      .map((slug) => slugToId.get(slug))
      .filter((id): id is string => Boolean(id));
    migrated.courses[course.id] = {
      completedLessonIds: [...new Set(completedLessonIds)],
      completedAt: null,
    };
  });
  return migrated;
}

export function readProgress(courseMap: ProgressCourseMap): LearnLabProgress {
  try {
    const current = localStorage.getItem(LEARNLAB_PROGRESS_KEY);
    if (current) { memoryProgress = normaliseProgress(JSON.parse(current), courseMap); return memoryProgress; }
    const legacy = localStorage.getItem(LEGACY_LEARNLAB_PROGRESS_KEY);
    if (!legacy) return memoryProgress;
    const migrated = migrateLegacyProgress(JSON.parse(legacy), courseMap);
    writeProgress(migrated);
    return migrated;
  } catch {
    return createEmptyProgress();
  }
}

export function writeProgress(progress: LearnLabProgress): boolean {
  memoryProgress = progress;
  try {
    localStorage.setItem(LEARNLAB_PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent('learnlab:progress-change', { detail: progress }));
    return true;
  } catch {
    window.dispatchEvent(new CustomEvent('learnlab:progress-change', { detail: progress }));
    return false;
  }
}

export function markLessonComplete(
  progress: LearnLabProgress,
  courseId: string,
  lessonId: string,
  lessonIds: string[],
): LearnLabProgress {
  const completed = new Set(progress.courses[courseId]?.completedLessonIds ?? []);
  completed.add(lessonId);
  const isComplete = lessonIds.every((id) => completed.has(id));
  return {
    ...progress,
    courses: {
      ...progress.courses,
      [courseId]: {
        completedLessonIds: lessonIds.filter((id) => completed.has(id)),
        lastLessonId: lessonId,
        completedAt: isComplete ? new Date().toISOString() : null,
      },
    },
  };
}

export function setLastLesson(progress: LearnLabProgress, courseId: string, lessonId: string): LearnLabProgress {
  const current = progress.courses[courseId] ?? { completedLessonIds: [], completedAt: null };
  return {
    ...progress,
    courses: {
      ...progress.courses,
      [courseId]: { ...current, lastLessonId: lessonId },
    },
  };
}
export function setLastPath(progress: LearnLabProgress, pathId: string): LearnLabProgress {
  return { ...progress, lastPathId: pathId };
}
export function exportProgress(progress: LearnLabProgress): string {
  return JSON.stringify({ ...progress, exportedAt: new Date().toISOString() }, null, 2);
}
export function importProgress(json: string, courseMap: ProgressCourseMap): LearnLabProgress | null {
  try {
    const parsed: unknown = JSON.parse(json);
    if (!isRecord(parsed) || parsed.version !== 2) return null;
    return normaliseProgress(parsed, courseMap);
  } catch {
    return null;
  }
}
export function resetProgress(): boolean {
  memoryProgress = createEmptyProgress();
  try {
    localStorage.removeItem(LEARNLAB_PROGRESS_KEY);
    localStorage.removeItem(LEGACY_LEARNLAB_PROGRESS_KEY);
    window.dispatchEvent(new CustomEvent('learnlab:progress-change', { detail: memoryProgress }));
    return true;
  } catch {
    window.dispatchEvent(new CustomEvent('learnlab:progress-change', { detail: memoryProgress }));
    return false;
  }
}
export function subscribeToProgress(onChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LEARNLAB_PROGRESS_KEY || event.key === LEGACY_LEARNLAB_PROGRESS_KEY) onChange();
  };
  const handleLocal = () => onChange();
  window.addEventListener('storage', handleStorage);
  window.addEventListener('learnlab:progress-change', handleLocal);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('learnlab:progress-change', handleLocal);
  };
}
