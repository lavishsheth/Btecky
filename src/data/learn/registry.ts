import { courses } from './courses';

export type LearnAvailability = 'available' | 'coming-soon';
export type LearnTopic = {
  id: string; slug: string; title: string; description: string;
  availability: LearnAvailability; sortOrder: number;
};
export type LearnPathStage = {
  id: string; title: string; description: string;
  availability: LearnAvailability; courseId?: string;
};
export type LearnPath = {
  id: string; slug: string; title: string; topicId: string; level: string;
  description: string; sortOrder: number; stages: LearnPathStage[]; projectHref?: string;
};
export type LearnCourse = {
  id: string; slug: string; title: string; topicId: string; level: string;
  summary: string; description: string; availability: LearnAvailability;
  durationMinutes: number; lessonIds: string[]; prerequisites: string[]; pathIds: string[];
};

/** Canonical subject taxonomy. Roadmap subjects stay visible without generating thin pages. */
const topics: LearnTopic[] = [
  { id: 'web-development', slug: 'web-development', title: 'Web development', description: 'Build websites and web applications, from page structure to interactive experiences.', availability: 'available', sortOrder: 1 },
  { id: 'programming', slug: 'programming', title: 'Programming', description: 'Learn programming concepts, languages, logical thinking and problem solving.', availability: 'coming-soon', sortOrder: 2 },
  { id: 'backend-apis', slug: 'backend-apis', title: 'Backend & APIs', description: 'Understand servers, application logic, APIs and the systems behind digital products.', availability: 'coming-soon', sortOrder: 3 },
  { id: 'databases', slug: 'databases', title: 'Databases', description: 'Learn how applications model, store, query and manage information.', availability: 'coming-soon', sortOrder: 4 },
  { id: 'computer-science', slug: 'computer-science', title: 'Computer science', description: 'Explore the foundations of computing, algorithms and data structures.', availability: 'coming-soon', sortOrder: 5 },
  { id: 'cloud-devops', slug: 'cloud-devops', title: 'Cloud & DevOps', description: 'Explore developer workflows, deployment, infrastructure and reliable delivery.', availability: 'coming-soon', sortOrder: 6 },
  { id: 'ai-machine-learning', slug: 'ai-machine-learning', title: 'AI & machine learning', description: 'Discover data-driven systems, machine learning concepts and applied AI.', availability: 'coming-soon', sortOrder: 7 },
  { id: 'cybersecurity', slug: 'cybersecurity', title: 'Cybersecurity', description: 'Understand security principles, common risks and safer software practices.', availability: 'coming-soon', sortOrder: 8 },
  { id: 'developer-tools', slug: 'developer-tools', title: 'Developer tools', description: 'Get comfortable with the tools and workflows used to build software.', availability: 'coming-soon', sortOrder: 9 },
];

const paths: LearnPath[] = [
  {
    id: 'web-development-foundations', slug: 'web-development', title: 'Web development foundations',
    topicId: 'web-development', level: 'Beginner',
    description: 'Build one website from the ground up: structure it with HTML, design it with CSS, then add behaviour with JavaScript.',
    sortOrder: 1, projectHref: '/learn/paths/web-development/project/',
    stages: [
      { id: 'web-development-html', title: 'HTML — Build the structure', description: 'Create meaningful page content and the foundation of your website.', availability: 'available', courseId: 'html-foundations' },
      { id: 'web-development-css', title: 'CSS — Design the website', description: 'Style the same website with layout, colour, typography and responsive design.', availability: 'available', courseId: 'css-foundations' },
      { id: 'web-development-javascript', title: 'JavaScript — Add behaviour', description: 'Make the same website interactive with browser-side programming.', availability: 'available', courseId: 'javascript-foundations' },
      { id: 'web-development-react', title: 'React — Build reusable components', description: 'Evolve the same website into a component-based application while carrying your product forward.', availability: 'available', courseId: 'react-foundations' },
    ],
  },
  {
    id: 'programming-fundamentals', slug: 'programming-fundamentals', title: 'Programming fundamentals',
    topicId: 'programming', level: 'Beginner',
    description: 'Build confidence with core programming concepts, then use them to solve practical problems.',
    sortOrder: 2,
    stages: [
      { id: 'programming-concepts', title: 'Programming concepts', description: 'Understand values, variables, decisions, loops and functions.', availability: 'coming-soon' },
      { id: 'python-foundations', title: 'Python foundations', description: 'Apply programming fundamentals in a beginner-friendly language.', availability: 'coming-soon' },
      { id: 'problem-solving', title: 'Problem solving', description: 'Break larger challenges into smaller, testable steps.', availability: 'coming-soon' },
    ],
  },
  {
    id: 'modern-developer-workflow', slug: 'modern-developer-workflow', title: 'Modern developer workflow',
    topicId: 'developer-tools', level: 'Beginner → Intermediate',
    description: 'Learn the tools and habits that help developers collaborate, test and ship software reliably.',
    sortOrder: 3,
    stages: [
      { id: 'command-line-basics', title: 'Command line basics', description: 'Navigate projects and run common development commands.', availability: 'coming-soon' },
      { id: 'git-and-github', title: 'Git and GitHub', description: 'Track changes and collaborate with confidence.', availability: 'coming-soon' },
      { id: 'testing-debugging', title: 'Testing and debugging', description: 'Find problems systematically and improve software quality.', availability: 'coming-soon' },
    ],
  },
];

const courseMetadata: LearnCourse[] = courses.map((course) => ({
  id: course.id, slug: course.slug, title: course.title, topicId: course.categoryId,
  level: course.level, summary: course.summary, description: course.description,
  availability: 'available',
  durationMinutes: course.lessons.reduce((total, lesson) => total + lesson.minutes, 0),
  lessonIds: course.lessons.map((lesson) => course.id + ':' + lesson.slug),
  prerequisites: course.prerequisites,
  pathIds: paths.filter((path) => path.stages.some((stage) => stage.courseId === course.id)).map((path) => path.id),
}));

/** Legacy-compatible adapters below let existing templates migrate incrementally. */
export const learningCategories = topics.map((topic) => ({
  id: topic.id, slug: topic.slug, title: topic.title, description: topic.description,
  status: topic.availability === 'available' ? 'published' as const : 'planned' as const,
  sortOrder: topic.sortOrder,
}));
export const learningPaths = paths.map((path) => ({
  id: path.id, slug: path.slug, title: path.title, categoryId: path.topicId,
  level: path.level, description: path.description, sortOrder: path.sortOrder,
  stages: path.stages.map((stage) => ({
    title: stage.title, description: stage.description,
    status: stage.availability === 'available' ? 'available' as const : 'planned' as const,
    ...(stage.courseId ? { courseId: stage.courseId } : {}),
  })),
}));

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
    values.forEach((value) => { if (seen.has(value)) errors.push('Duplicate ' + label + ': ' + value); seen.add(value); });
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
      if (stage.availability === 'available' && (!stage.courseId || !courseIds.has(stage.courseId))) errors.push('Available stage "' + stage.id + '" must reference an existing course');
      if (stage.availability === 'coming-soon' && stage.courseId) errors.push('Coming-soon stage "' + stage.id + '" must not expose a course reference');
    });
  });
  learnRegistry.courses.forEach((course) => {
    if (!topicIds.has(course.topicId)) errors.push('Course "' + course.id + '" references missing topic "' + course.topicId + '"');
    course.pathIds.forEach((pathId) => { if (!learnRegistry.paths.some((path) => path.id === pathId)) errors.push('Course "' + course.id + '" references missing path "' + pathId + '"'); });
  });
  return errors;
}
export function assertValidLearnRegistry(): void {
  const errors = validateLearnRegistry();
  if (errors.length) throw new Error('LearnLab registry validation failed:\\n- ' + errors.join('\\n- '));
}
