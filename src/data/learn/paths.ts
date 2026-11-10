export type LearningPathStage = {
  title: string;
  description: string;
  status: 'available' | 'planned';
  courseId?: string;
};

export type LearningPath = {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  level: string;
  description: string;
  sortOrder: number;
  stages: LearningPathStage[];
};

export const learningPaths: LearningPath[] = [
  {
    id: 'web-development-foundations',
    slug: 'web-development',
    title: 'Web development foundations',
    categoryId: 'web-development',
    level: 'Beginner',
    description: 'Build one website from the ground up: structure it with HTML, design it with CSS, then add behaviour with JavaScript.',
    sortOrder: 1,
    stages: [
      { title: 'HTML — Build the structure', description: 'Create meaningful page content and the foundation of your website.', status: 'available', courseId: 'html-foundations' },
      { title: 'CSS — Design the website', description: 'Style the same website with layout, colour, typography and responsive design.', status: 'available', courseId: 'css-foundations' },
      { title: 'JavaScript — Add behaviour', description: 'Make the same website interactive with browser-side programming.', status: 'available', courseId: 'javascript-foundations' },
      { title: 'React — Build reusable components', description: 'Evolve the same website into a component-based application while carrying your product forward.', status: 'planned' },
    ],
  },
  {
    id: 'programming-fundamentals',
    slug: 'programming-fundamentals',
    title: 'Programming fundamentals',
    categoryId: 'programming',
    level: 'Beginner',
    description: 'Build confidence with core programming concepts, then use them to solve practical problems.',
    sortOrder: 2,
    stages: [
      { title: 'Programming concepts', description: 'Understand values, variables, decisions, loops and functions.', status: 'planned' },
      { title: 'Python foundations', description: 'Apply programming fundamentals in a beginner-friendly language.', status: 'planned' },
      { title: 'Problem solving', description: 'Break larger challenges into smaller, testable steps.', status: 'planned' },
    ],
  },
  {
    id: 'modern-developer-workflow',
    slug: 'modern-developer-workflow',
    title: 'Modern developer workflow',
    categoryId: 'developer-tools',
    level: 'Beginner → Intermediate',
    description: 'Learn the tools and habits that help developers collaborate, test and ship software reliably.',
    sortOrder: 3,
    stages: [
      { title: 'Command line basics', description: 'Navigate projects and run common development commands.', status: 'planned' },
      { title: 'Git and GitHub', description: 'Track changes and collaborate with confidence.', status: 'planned' },
      { title: 'Testing and debugging', description: 'Find problems systematically and improve software quality.', status: 'planned' },
    ],
  },
];
