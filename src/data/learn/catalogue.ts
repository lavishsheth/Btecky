import { learningCategories } from './categories';
import { learningPaths } from './paths';
import { courses } from './courses';

export const catalogueCourses = courses;

export function validateLearnLabCatalogue(): string[] {
  const errors: string[] = [];
  const unique = (values: string[], label: string) => {
    const seen = new Set<string>();
    for (const value of values) {
      if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}`);
      seen.add(value);
    }
  };

  unique(learningCategories.map((item) => item.id), 'category id');
  unique(learningCategories.map((item) => item.slug), 'category slug');
  unique(catalogueCourses.map((item) => item.id), 'course id');
  unique(catalogueCourses.map((item) => item.slug), 'course slug');
  unique(learningPaths.map((item) => item.id), 'learning path id');
  unique(learningPaths.map((item) => item.slug), 'learning path slug');

  const categoryIds = new Set(learningCategories.map((item) => item.id));
  const courseIds = new Set(catalogueCourses.map((item) => item.id));

  for (const course of catalogueCourses) {
    if (!categoryIds.has(course.categoryId)) errors.push(`Course "${course.id}" references missing category "${course.categoryId}"`);
    if (!course.lessons.length) errors.push(`Course "${course.id}" must contain at least one lesson`);
    unique(course.lessons.map((lesson) => lesson.slug), `lesson slug in course ${course.id}`);
  }

  for (const path of learningPaths) {
    if (!categoryIds.has(path.categoryId)) errors.push(`Learning path "${path.id}" references missing category "${path.categoryId}"`);
    if (!path.stages.length) errors.push(`Learning path "${path.id}" must contain at least one stage`);
    const stageCourseIds = path.stages.flatMap((stage) => stage.courseId ? [stage.courseId] : []);
    unique(stageCourseIds, `course reference in path ${path.id}`);
    path.stages.forEach((stage, index) => {
      if (stage.status === 'available' && !stage.courseId) errors.push(`Available stage "${stage.title}" in path "${path.id}" must reference a course`);
      if (stage.courseId && !courseIds.has(stage.courseId)) errors.push(`Stage "${stage.title}" in path "${path.id}" references missing course "${stage.courseId}"`);
      if (stage.status === 'planned' && stage.courseId) errors.push(`Planned stage "${stage.title}" in path "${path.id}" must not expose a published course reference`);
      if (!stage.title.trim()) errors.push(`Stage ${index + 1} in path "${path.id}" is missing a title`);
    });
  }

  return errors;
}

export function assertValidLearnLabCatalogue(): void {
  const errors = validateLearnLabCatalogue();
  if (errors.length) throw new Error(`LearnLab catalogue validation failed:\\n- ${errors.join('\\n- ')}`);
}
