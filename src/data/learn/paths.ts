import { learningPaths } from './registry';
export type LearningPathStage = (typeof learningPaths)[number]['stages'][number];
export type LearningPath = (typeof learningPaths)[number];
export { learningPaths };
