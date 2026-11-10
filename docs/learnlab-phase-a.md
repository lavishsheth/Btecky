# LearnLab Phase A — HTML lesson workspace

Phase A adds an in-browser workspace to the HTML course without replacing the server-rendered lesson text.

## Runtime choices
- CodeMirror 6 is dynamically imported when the learner opens the editor.
- The HTML/CSS/JavaScript preview runs in an iframe with `sandbox="allow-scripts"` and no `allow-same-origin`.
- The preview reports console messages and runtime errors to the parent using a run identifier and a source-window check.
- JSZip is dynamically imported only when the learner downloads their project.
- No remote editor CDN or external runtime service is used in Phase A.

## Workspace persistence
The profile project is stored under `btecky.learn.workspace.profile-website.v1`.
The record contains a version, project ID, current files, lesson snapshots and active lesson. Browser storage access is wrapped in try/catch. When storage is blocked, the editor and preview remain available for the current page session and the UI displays a persistence warning.

## Current scope
- The workspace is mounted on HTML course lesson pages only.
- HTML, CSS and JavaScript file tabs are available; task validation is based on the current HTML lesson.
- Lesson completion stores a snapshot under the lesson identifier.
- A later HTML lesson can resume from the prior lesson's saved snapshot.
- React/Sandpack, CSS and JavaScript course carry-over, publishing guidance and analytics are explicitly out of scope for Phase A.

## Manual acceptance checklist
1. Open `/learn/html/html-document-structure/`; lesson copy is present in the initial HTML and does not depend on editor hydration.
2. Open the editor and change the h1; the preview updates after the short debounce.
3. Confirm task checks update after the preview refresh and can be completed.
4. Complete the lesson and open the next HTML lesson; the previous snapshot is loaded.
5. Reset the lesson and restore the official starter.
6. Fail checks twice and confirm the solution reveal becomes available.
7. Download the ZIP and confirm it contains `index.html`, `styles.css` and `script.js`.
8. Block localStorage and confirm the editor and preview still work with a visible warning.
9. At a 375px viewport, use Learn / Code / Preview tabs and the symbol toolbar without horizontal page overflow.
10. Use keyboard-only navigation; Tab and Escape must allow leaving the editor.
11. Test the Stop / restart preview action against a script that loops; replacing the iframe should recover the page.

## Security and deployment
The preview iframe intentionally has no same-origin permission. Parent/iframe messages are accepted only from the current iframe window and current run ID. Verify production response headers and CSP in the Vercel deployment before adding any third-party runtime. Phase A itself does not load Sandpack or any external script host.
