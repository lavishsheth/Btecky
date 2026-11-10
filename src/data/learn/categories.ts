import { learningCategories } from './registry';
export type LearningCategory = (typeof learningCategories)[number];
export { learningCategories };
