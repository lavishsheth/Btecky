export type LearningCategory = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'published' | 'planned';
  sortOrder: number;
};

export const learningCategories: LearningCategory[] = [
  { id: 'web-development', title: 'Web development', slug: 'web-development', description: 'Build websites and web applications, from page structure to interactive experiences.', status: 'published', sortOrder: 1 },
  { id: 'programming', title: 'Programming', slug: 'programming', description: 'Learn programming concepts, languages, logical thinking and problem solving.', status: 'planned', sortOrder: 2 },
  { id: 'backend-apis', title: 'Backend & APIs', slug: 'backend-apis', description: 'Understand servers, application logic, APIs and the systems behind digital products.', status: 'planned', sortOrder: 3 },
  { id: 'databases', title: 'Databases', slug: 'databases', description: 'Learn how applications model, store, query and manage information.', status: 'planned', sortOrder: 4 },
  { id: 'computer-science', title: 'Computer science', slug: 'computer-science', description: 'Explore the foundations of computing, algorithms and data structures.', status: 'planned', sortOrder: 5 },
  { id: 'cloud-devops', title: 'Cloud & DevOps', slug: 'cloud-devops', description: 'Explore developer workflows, deployment, infrastructure and reliable delivery.', status: 'planned', sortOrder: 6 },
  { id: 'ai-machine-learning', title: 'AI & machine learning', slug: 'ai-machine-learning', description: 'Discover data-driven systems, machine learning concepts and applied AI.', status: 'planned', sortOrder: 7 },
  { id: 'cybersecurity', title: 'Cybersecurity', slug: 'cybersecurity', description: 'Understand security principles, common risks and safer software practices.', status: 'planned', sortOrder: 8 },
  { id: 'developer-tools', title: 'Developer tools', slug: 'developer-tools', description: 'Get comfortable with the tools and workflows used to build software.', status: 'planned', sortOrder: 9 },
];
