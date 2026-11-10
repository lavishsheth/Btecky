export const PROFILE_PROJECT_ID = 'profile-website';
export const PROFILE_WORKSPACE_KEY = 'btecky.learn.workspace.profile-website.v1';

export type ProjectFiles = { 'index.html': string; 'styles.css': string; 'script.js': string };
export type ProjectWorkspace = {
  version: 1;
  projectId: typeof PROFILE_PROJECT_ID;
  files: ProjectFiles;
  snapshots: Record<string, ProjectFiles>;
  activeLesson: string;
};
export const HTML_LESSON_ONE = 'html:html-document-structure';
export const HTML_OFFICIAL_STARTER: ProjectFiles = {
  'index.html': '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My first website</title>\n</head>\n<body>\n  <main>\n    <h1>Hello, web!</h1>\n    <p>I am building my first website with HTML.</p>\n  </main>\n</body>\n</html>',
  'styles.css': 'body { font-family: system-ui, sans-serif; padding: 2rem; color: #17213b; }\n',
  'script.js': '// Your JavaScript will be added in a later course.\n',
};
export const HTML_OFFICIAL_CHECKPOINT: ProjectFiles = { ...HTML_OFFICIAL_STARTER };
function cloneFiles(files: ProjectFiles): ProjectFiles { return { ...files }; }
export function createWorkspace(): ProjectWorkspace {
  return { version: 1, projectId: PROFILE_PROJECT_ID, files: cloneFiles(HTML_OFFICIAL_STARTER), snapshots: {}, activeLesson: HTML_LESSON_ONE };
}
export function readWorkspace(): { workspace: ProjectWorkspace; persisted: boolean } {
  try {
    const raw = localStorage.getItem(PROFILE_WORKSPACE_KEY);
    if (!raw) return { workspace: createWorkspace(), persisted: true };
    const value = JSON.parse(raw) as Partial<ProjectWorkspace>;
    if (value.version !== 1 || value.projectId !== PROFILE_PROJECT_ID || !value.files || typeof value.files['index.html'] !== 'string') {
      return { workspace: createWorkspace(), persisted: true };
    }
    return { workspace: { ...createWorkspace(), ...value, files: { ...HTML_OFFICIAL_STARTER, ...value.files }, snapshots: value.snapshots ?? {} } as ProjectWorkspace, persisted: true };
  } catch {
    return { workspace: createWorkspace(), persisted: false };
  }
}
export function saveWorkspace(workspace: ProjectWorkspace): boolean {
  try { localStorage.setItem(PROFILE_WORKSPACE_KEY, JSON.stringify(workspace)); return true; }
  catch { return false; }
}
export function snapshotLesson(workspace: ProjectWorkspace, lessonId: string): ProjectWorkspace {
  return { ...workspace, snapshots: { ...workspace.snapshots, [lessonId]: cloneFiles(workspace.files) }, activeLesson: lessonId };
}
export function filesEqual(a: ProjectFiles, b: ProjectFiles): boolean {
  return a['index.html'] === b['index.html'] && a['styles.css'] === b['styles.css'] && a['script.js'] === b['script.js'];
}
