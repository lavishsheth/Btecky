import { learningCategories } from './categories';
import { learningPaths } from './paths';
import { courses } from './courses';

export type LearnAvailability = 'available' | 'coming-soon';
export type LearnTopic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  availability: LearnAvailability;
  sortOrder: number;
};
export type LearnPathStage = {
  id: string;
  title: string;
  description: string;
  availability: LearnAvailability;
  courseId?: string;
};
export type LearnPath = {
  id: string;
  slug: string;
  title: string;
  topicId: string;
  level: string;
  description: string;
  sortOrder: number;
  stages: LearnPathStage[];
  projectHref?: string;
};
export type LearnCourse = {
  id: string;
  slug: string;
  title: string;
  topicId: string;
  level: string;
  summary: string;
  description: string;
  availability: LearnAvailability;
  durationMinutes: number;
  lessonIds: string[];
  prerequisites: string[];
  pathIds: string[];
};

const topics: LearnTopic[] = learningCategories.map((category) => ({
  id: category.id,
  slug: category.slug,
  title: category.title,
  description: category.description,
  availability: category.status === 'published' ? 'available' : 'coming-soon',
  sortOrder: category.sortOrder,
}));

const paths: LearnPath[] = learningPaths.map((path) => ({
  id: path.id,
  slug: path.slug,
  title: path.title,
  topicId: path.categoryId,
  level: path.level,
  description: path.description,
  sortOrder: path.sortOrder,
  stages: path.stages.map((stage, index) => ({
    id: path.id + '-stage-' + (index + 1),
    title: stage.title,
    description: stage.description,
    availability: stage.status === 'available' ? 'available' : 'coming-soon',
    ...(stage.courseId ? { courseId: stage.courseId } : {}),
  })),
  ...(path.slug === 'web-development' ? { projectHref: '/learn/paths/web-development/project/' } : {}),
}));

const courseMetadata: LearnCourse[] = courses.map((course) => ({
  id: course.id,
  slug: course.slug,
  title: course.title,
  topicId: course.categoryId,
  level: course.level,
  summary: course.summary,
  description: course.description,
  availability: 'available',
  durationMinutes: course.lessons.reduce((total, lesson) => total + lesson.minutes, 0),
  lessonIds: course.lessons.map((lesson) => course.id + ':' + lesson.slug),
  prerequisites: course.prerequisites,
  pathIds: paths.filter((path) => path.stages.some((stage) => stage.courseId === course.id)).map((path) => path.id),
}));

/**
 * Transitional registry facade: the original lesson-body modules remain intact,
 * while all discovery and progression metadata is exposed through one typed API.
 * The legacy source arrays are intentionally kept compatible during migration.
 */
export const learnRegistry = {
  topics: [...topics].sort((a, b) => a.sortOrder - b.sortOrder),
  paths: [...paths].sort((a, b) => a.sortOrder - b.sortOrder),
  courses: courseMetadata,
  courseContent: courses,
};

export const learnCourseById = new Map(learnRegistry.courses.map((course) => [course.id, course]));
export const learnCourseBySlug = new Map(learnRegistry.courses.map((course) => [course.slug, course]));
export const learnPathBySlug = new Map(learnRegistry.paths.map((path) => [path.slug, path]));

export function validateLearnRegistry(): string[] {
  const errors: string[] = [];
  const checkUnique = (values: string[], label: string) => {
    const seen = new Set<string>();
    values.forEach((value) => {
      if (seen.has(value)) errors.push('Duplicate ' + label + ': ' + value);
      seen.add(value);
    });
  };

  checkUnique(learnRegistry.topics.map((topic) => topic.id), 'topic id');
  checkUnique(learnRegistry.topics.map((topic) => topic.slug), 'topic slug');
  checkUnique(learnRegistry.paths.map((path) => path.id), 'path id');
  checkUnique(learnRegistry.paths.map((path) => path.slug), 'path slug');
  checkUnique(learnRegistry.courses.map((course) => course.id), 'course id');
  checkUnique(learnRegistry.courses.map((course) => course.slug), 'course slug');

  const topicIds = new Set(learnRegistry.topics.map((topic) => topic.id));
  const courseIds = new Set(learnRegistry.courses.map((course) => course.id));
  learnRegistry.paths.forEach((path) => {
    if (!topicIds.has(path.topicId)) errors.push('Path "' + path.id + '" references missing topic "' + path.topicId + '"');
    path.stages.forEach((stage) => {
      if (stage.availability === 'available' && (!stage.courseId || !courseIds.has(stage.courseId))) {
        errors.push('Available stage "' + stage.id + '" must reference an existing course');
      }
      if (stage.availability === 'coming-soon' && stage.courseId) {
        errors.push('Coming-soon stage "' + stage.id + '" must not expose a course reference');
      }
    });
  });
  learnRegistry.courses.forEach((course) => {
    if (!topicIds.has(course.topicId)) errors.push('Course "' + course.id + '" references missing topic "' + course.topicId + '"');
    course.pathIds.forEach((pathId) => {
      if (!learnRegistry.paths.some((path) => path.id === pathId)) errors.push('Course "' + course.id + '" references missing path "' + pathId + '"');
    });
  });
  return errors;
}

export function assertValidLearnRegistry(): void {
  const errors = validateLearnRegistry();
  if (errors.length) throw new Error('LearnLab registry validation failed:\\n- ' + errors.join('\\n- '));
}
