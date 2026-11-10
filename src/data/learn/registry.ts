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
  durationMinutes: number; lessonIds: string[]; prerequisites: string[]; pathIds: string[]; projectId?: string; stage?: 1 | 2 | 3 | 4;
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
  { id: 'google-cloud-arcade', slug: 'google-cloud-arcade', title: 'Google Cloud & Arcade', description: 'Build cloud skills through Google Cloud learning resources and Arcade challenges.', availability: 'coming-soon', sortOrder: 10 },
  { id: 'dsa-placement', slug: 'dsa-placement', title: 'DSA & placement preparation', description: 'Practise data structures, algorithms and problem-solving patterns for technical interviews.', availability: 'coming-soon', sortOrder: 11 },
  { id: 'data-ai-basics', slug: 'data-ai-basics', title: 'Data & AI basics', description: 'Explore data literacy, AI fundamentals and practical machine learning concepts.', availability: 'coming-soon', sortOrder: 12 },
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

const courseDefinitions = [
  {
    id: 'html-foundations', slug: 'html', title: 'HTML Foundations', topicId: 'web-development', level: 'Beginner',
    projectId: 'profile-website', stage: 1,
    summary: 'Learn to structure clear, accessible web pages with semantic HTML.',
    description: 'A practical introduction to HTML: how browsers interpret documents, how to organise content, how links and images work, and how to build meaningful page structure and forms.',
    prerequisites: ['No programming experience required.', 'A modern browser and a code editor such as VS Code.'],
  },
  {
    id: 'css-foundations', slug: 'css', title: 'CSS Foundations', topicId: 'web-development', level: 'Beginner',
    summary: 'Turn the HTML website you already built into a clear, responsive and accessible design.',
    description: 'Learn CSS by styling the same personal profile website you created in HTML Foundations. Start with selectors and the cascade, then build visual hierarchy, spacing, layouts and responsive behaviour. Every lesson changes the same project rather than starting an unrelated exercise.',
    prerequisites: ['Complete the HTML Foundations course or understand basic HTML document structure.', 'Have your HTML profile page available in the shared Web Development project workspace.', 'No previous CSS experience is required.'],
  },
  {
    id: 'javascript-foundations', slug: 'javascript', title: 'JavaScript Foundations', topicId: 'web-development', level: 'Beginner',
    summary: 'Bring the HTML and CSS profile website to life with practical browser-side JavaScript.',
    description: 'Continue the same personal profile website from HTML Foundations and CSS Foundations. Learn JavaScript fundamentals, connect scripts to the page, respond to user events, validate a contact form, update content safely and build useful interactions. Each lesson adds behaviour to the existing project.',
    prerequisites: ['Complete HTML Foundations and understand semantic page structure.', 'Complete CSS Foundations or be comfortable styling the existing profile page.', 'Know how to use the shared Web Development project workspace.'],
  },
  {
    id: 'react-foundations', slug: 'react', title: 'React Foundations', topicId: 'web-development', level: 'Beginner → Intermediate',
    summary: 'Evolve your HTML, CSS and JavaScript profile website into a component-based React application.',
    description: 'Continue the same personal profile website built through the Web Development path. Learn components, JSX, props, state, events, forms, lists and effects. Reuse the content, design and behaviour you already created instead of starting an unrelated project.',
    prerequisites: ['Complete HTML, CSS and JavaScript Foundations.', 'Understand functions, arrays, objects, DOM events and browser debugging.', 'Have the profile website available in the shared Web Development project workspace.'],
  },
] as const;

const courseMetadata: LearnCourse[] = courseDefinitions.map((definition) => {
  const content = courses.find((course) => course.id === definition.id);
  if (!content) throw new Error('Registry course "' + definition.id + '" has no lesson content module');
  return {
    ...definition,
    prerequisites: [...definition.prerequisites],
    availability: 'available',
    durationMinutes: content.lessons.reduce((total, lesson) => total + lesson.minutes, 0),
    lessonIds: content.lessons.map((lesson) => definition.id + ':' + lesson.slug),
    pathIds: paths.filter((path) => path.stages.some((stage) => stage.courseId === definition.id)).map((path) => path.id),
    ...( 'projectId' in definition ? { projectId: definition.projectId, stage: definition.stage } : {}),
  };
});
const topicTitleById = new Map(topics.map((topic) => [topic.id, topic.title]));
const courseContent = courseMetadata.map((metadata) => {
  const content = courses.find((course) => course.id === metadata.id)!;
  return {
    ...content,
    id: metadata.id,
    slug: metadata.slug,
    title: metadata.title,
    categoryId: metadata.topicId,
    category: topicTitleById.get(metadata.topicId) ?? metadata.topicId,
    level: metadata.level,
    summary: metadata.summary,
    description: metadata.description,
    prerequisites: [...metadata.prerequisites],
  };
});

/** Legacy-compatible adapters below let existing templates migrate incrementally. */
export const learningCategories = topics.map((topic) => ({
  id: topic.id, slug: topic.slug, title: topic.title, description: topic.description,
  status: topic.availability === 'available' ? 'published' as const : 'planned' as const,
  sortOrder: topic.sortOrder,
}));
export const learningPaths = paths.map((path) => ({
  id: path.id, slug: path.slug, title: path.title, categoryId: path.topicId,
  level: path.level, description: path.description, sortOrder: path.sortOrder,
  ...(path.projectHref ? { projectHref: path.projectHref } : {}),
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
  courseContent,
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
  checkUnique(learnRegistry.courses.flatMap((course) => course.lessonIds), 'lesson id');
  const registryCourseIds = new Set(learnRegistry.courses.map((course) => course.id));
  courses.forEach((course) => { if (!registryCourseIds.has(course.id)) errors.push('Course content "' + course.id + '" is missing registry metadata'); });
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
