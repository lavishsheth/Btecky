import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createWorkspace, HTML_LESSON_ONE, HTML_OFFICIAL_CHECKPOINT, HTML_OFFICIAL_STARTER, readWorkspace, saveWorkspace, snapshotLesson, type ProjectFiles, type ProjectWorkspace } from '../../data/learn/workspace';

type FileName = keyof ProjectFiles;
type CheckResult = { passed: boolean; message: string };
const symbols = ['<', '>', '/', '=', '"', '{', '}', '(', ')', ';'];

function makePreviewDocument(files: ProjectFiles, runId: string) {
  const escapedCss = files['styles.css'].replace(/<\/style/gi, '<\\/style');
  const safeScript = files['script.js'].replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${escapedCss}</style></head><body>${files['index.html']}<script>
  (() => {
    const runId = ${JSON.stringify(runId)};
    const send = (type, payload) => parent.postMessage({ channel: 'btecky-learn-preview', runId, type, payload }, '*');
    ['log','warn','error','info'].forEach(level => {
      const original = console[level].bind(console);
      console[level] = (...args) => { original(...args); send('console', { level, message: args.map(value => { try { return typeof value === 'string' ? value : JSON.stringify(value); } catch { return String(value); } }).join(' ') }); };
    });
    addEventListener('error', event => send('error', { message: event.message || 'A script error occurred.', line: event.lineno || 0 }));
    addEventListener('unhandledrejection', event => send('error', { message: String(event.reason || 'An asynchronous error occurred.') }));
    addEventListener('DOMContentLoaded', () => send('ready', { heading: Boolean(document.querySelector('h1')?.textContent?.trim()), paragraph: Boolean(document.querySelector('main p')?.textContent?.trim()), title: Boolean(document.querySelector('title')?.textContent?.trim()), headingText: document.querySelector('h1')?.textContent?.trim() || '' }));
  })();
  </script><script>${safeScript}</script></body></html>`;
}

function runChecks(doc: Document, lessonIndex: number): CheckResult[] {
  const heading = doc.querySelector('h1');
  if (lessonIndex === 0) return [
    { passed: Boolean(heading && heading.textContent?.trim() && heading.textContent.trim() !== 'Hello, web!'), message: 'Change the h1 heading so it says something about your website.' },
    { passed: Boolean(doc.querySelector('main p')?.textContent?.trim()), message: 'Add a paragraph inside main to introduce your website.' },
    { passed: Boolean(doc.querySelector('title')?.textContent?.trim()), message: 'Give your page a descriptive title in the document head.' },
  ];
  if (lessonIndex === 1) return [{ passed: Boolean(heading), message: 'Add one main h1 heading.' }, { passed: Boolean(doc.querySelector('h2')), message: 'Add section headings using h2.' }, { passed: Boolean(doc.querySelector('ul li') && doc.querySelector('ol li')), message: 'Include both an unordered and an ordered list.' }];
  if (lessonIndex === 2) return [{ passed: Boolean(doc.querySelector('a[href]')), message: 'Add a link with an href attribute.' }, { passed: Boolean(doc.querySelector('img[alt]')), message: 'Add an image with an alt attribute.' }];
  if (lessonIndex === 3) return [{ passed: Boolean(doc.querySelector('header') && doc.querySelector('nav') && doc.querySelector('main') && doc.querySelector('footer')), message: 'Use header, nav, main and footer landmarks.' }];
  return [{ passed: Boolean(doc.querySelector('form')), message: 'Add a contact form.' }, { passed: Boolean(doc.querySelector('label[for]')), message: 'Associate a label with a form field.' }, { passed: Boolean(doc.querySelector('input[type=email]') && doc.querySelector('button[type=submit]')), message: 'Add an email input and submit button.' }];
}

export default function LessonWorkspace({ lessonId, lessonIndex }: { lessonId: string; lessonIndex: number }) {
  const [workspace, setWorkspace] = useState<ProjectWorkspace>(() => createWorkspace());
  const [activeFile, setActiveFile] = useState<FileName>('index.html');
  const [mobileTab, setMobileTab] = useState<'learn'|'code'|'preview'>('code');
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(true);
    const [runId, setRunId] = useState('initial');
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [failures, setFailures] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [notice, setNotice] = useState('');
  const editorHost = useRef<HTMLDivElement>(null);
  const editorView = useRef<any>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>();
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;

  useEffect(() => {
    const result = readWorkspace();
    const previousId = lessonIndex > 0 ? 'html:' + ['html-document-structure','headings-paragraphs-lists','links-images','semantic-html','html-forms'][lessonIndex - 1] : '';
    const startingFiles = previousId && result.workspace.snapshots[previousId] ? result.workspace.snapshots[previousId] : result.workspace.files;
    const initial = { ...result.workspace, files: { ...startingFiles }, activeLesson: lessonId };
    setWorkspace(initial);
    workspaceRef.current = initial;
    setStorageAvailable(result.persisted);
  }, [lessonId, lessonIndex]);

  const persist = useCallback((next: ProjectWorkspace) => {
    setWorkspace(next); workspaceRef.current = next;
    const ok = saveWorkspace(next); setStorageAvailable(ok); setSaved(ok);
    if (!ok) setNotice('Progress won’t be saved in this browser. Your editor and preview still work until you leave this page.');
  }, []);

  const loadEditor = useCallback(async () => {
    if (loaded || !editorHost.current) { setLoaded(true); return; }
    const [{ EditorView, basicSetup }, { html }, { css }, { javascript }] = await Promise.all([
      import('codemirror'), import('@codemirror/lang-html'), import('@codemirror/lang-css'), import('@codemirror/lang-javascript')
    ]);
    if (!editorHost.current || editorView.current) { setLoaded(true); return; }
    editorView.current = new EditorView({
      doc: workspaceRef.current.files[activeFile],
      extensions: [basicSetup, activeFile === 'index.html' ? html() : activeFile === 'styles.css' ? css() : javascript(), EditorView.updateListener.of((update: any) => {
        if (!update.docChanged) return;
        const next = { ...workspaceRef.current, files: { ...workspaceRef.current.files, [activeFile]: update.state.doc.toString() } };
        setWorkspace(next); workspaceRef.current = next; setSaved(false);
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => { const ok = saveWorkspace(next); setStorageAvailable(ok); setSaved(ok); if (!ok) setNotice('Progress won’t be saved in this browser.'); refreshPreview(next.files); setChecks(runChecks(new DOMParser().parseFromString(next.files['index.html'], 'text/html'), lessonIndex)); }, 300);
      })],
      parent: editorHost.current,
    });
    setLoaded(true);
  }, [activeFile, loaded]);

  const refreshPreview = useCallback((files: ProjectFiles) => {
    const nextRun = String(Date.now()) + '-' + Math.random().toString(36).slice(2);
    setRunId(nextRun); setConsoleLines([]);
    if (iframe.current) iframe.current.srcdoc = makePreviewDocument(files, nextRun);
  }, []);

  useEffect(() => { if (loaded) loadEditor(); }, [loaded, loadEditor]);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.current?.contentWindow) return;
      const data = event.data;
      if (!data || data.channel !== 'btecky-learn-preview' || data.runId !== runId) return;
      if (data.type === 'console') setConsoleLines(lines => [...lines.slice(-49), '[' + data.payload.level + '] ' + data.payload.message]);
      if (data.type === 'error') setConsoleLines(lines => [...lines.slice(-49), 'Error: ' + data.payload.message + (data.payload.line ? ' (line ' + data.payload.line + ')' : '')]);
      if (data.type === 'ready') setChecks(runChecks(new DOMParser().parseFromString(workspaceRef.current.files['index.html'], 'text/html'), lessonIndex));
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [runId]);

  useEffect(() => {
    if (loaded && editorView.current && activeFile === 'index.html') {
      const current = editorView.current.state.doc.toString();
      if (current !== workspace.files[activeFile]) editorView.current.dispatch({ changes: { from: 0, to: current.length, insert: workspace.files[activeFile] } });
    }
  }, [activeFile, loaded, workspace.files]);

  useEffect(() => () => { clearTimeout(debounce.current); editorView.current?.destroy(); }, []);

  const changeFile = async (file: FileName) => {
    if (editorView.current) {
      const current = editorView.current.state.doc.toString();
      const next = { ...workspaceRef.current, files: { ...workspaceRef.current.files, [activeFile]: current } };
      persist(next);
      editorView.current.destroy(); editorView.current = null;
    }
    setActiveFile(file);
    setLoaded(false);
    if (file === 'index.html') setTimeout(() => loadEditor(), 0);
    else { setNotice('You can prepare your CSS and JavaScript files here. This HTML-first lesson checks the HTML tasks.'); setTimeout(() => loadEditor(), 0); }
  };

  const checkTasks = () => {
    const htmlText = workspaceRef.current.files['index.html'];
    const parsed = new DOMParser().parseFromString(htmlText, 'text/html');
    const result = runChecks(parsed, lessonIndex);
    setChecks(result);
    if (result.every(item => item.passed)) {
      const next = snapshotLesson(workspaceRef.current, lessonId);
      persist(next);
      setNotice('All lesson tasks passed. Your HTML checkpoint is saved for the next lesson.');
      document.querySelector<HTMLButtonElement>('[data-complete-lesson]')?.click();
      return;
    }
    setFailures(count => count + 1);
    setNotice('A couple of things still need attention. Try the hints, or keep experimenting.');
  };

  const resetLesson = () => { const next = { ...workspaceRef.current, files: { ...HTML_OFFICIAL_STARTER } }; persist(next); refreshPreview(next.files); if (editorView.current) editorView.current.dispatch({ changes: { from: 0, to: editorView.current.state.doc.length, insert: next.files['index.html'] } }); setChecks([]); setNotice('Lesson starter restored.'); };
  const restoreCheckpoint = () => { const next = { ...workspaceRef.current, files: { ...HTML_OFFICIAL_CHECKPOINT } }; persist(next); refreshPreview(next.files); if (editorView.current) editorView.current.dispatch({ changes: { from: 0, to: editorView.current.state.doc.length, insert: next.files['index.html'] } }); setNotice('Official HTML checkpoint restored.'); };
  const revealSolution = () => { if (failures < 2) return; setShowSolution(true); setDiffOpen(true); };
  const downloadZip = async () => {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip(); Object.entries(workspaceRef.current.files).forEach(([name, value]) => zip.file(name, value));
    const blob = await zip.generateAsync({ type: 'blob' }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'btecky-profile-website.zip'; link.click(); URL.revokeObjectURL(url);
  };

    return <section className="lesson-ide" aria-label="Interactive HTML lesson workspace">
    <div className="ide-mobile-tabs" role="tablist" aria-label="Lesson workspace views">
      {(['learn','code','preview'] as const).map(tab => <button key={tab} role="tab" aria-selected={mobileTab===tab} onClick={() => setMobileTab(tab)}>{tab==='learn'?'Learn':tab==='code'?'Code':'Preview'}</button>)}
    </div>
    <div className="ide-grid">
      <div className={'ide-instructions '+(mobileTab==='learn'?'mobile-active':'')}>
        <p className="ide-eyebrow">YOUR FIRST BUILD</p><h2>Make this page yours</h2>
        <p>Change the heading in <code>index.html</code>, then watch your own words appear in the preview.</p>
        <ol><li>Find the <code>&lt;h1&gt;</code> element.</li><li>Replace “Hello, web!” with your name or a page title.</li><li>Update the paragraph to introduce your website.</li></ol>
        <p className="ide-tip">Your preview updates automatically after you stop typing.</p>
        <button type="button" className="ide-primary" onClick={() => { setMobileTab('code'); loadEditor(); }}>Open the code editor</button>
        {checks.length>0&&<ul className="ide-checks">{checks.map((item,i)=><li key={i}>{item.passed?'✓':'○'} {item.passed?'Task passed':item.message}</li>)}</ul>}
        <button type="button" className="ide-primary" onClick={checkTasks}>Check my work</button><button type="button" className="ide-secondary" onClick={() => { const next = snapshotLesson(workspaceRef.current, lessonId); persist(next); document.querySelector<HTMLButtonElement>('[data-complete-lesson]')?.click(); setNotice('Lesson marked complete. You can keep experimenting with your project.'); }}>Mark complete anyway</button>
      </div>
      <div className={'ide-editor '+(mobileTab==='code'?'mobile-active':'')}>
        <div className="ide-heading"><b>Code editor</b><span>{saved?'All changes saved':'Saving…'}</span></div>
        <div className="ide-file-tabs" role="tablist" aria-label="Project files">{(['index.html','styles.css','script.js'] as FileName[]).map(file=><button key={file} role="tab" aria-selected={activeFile===file} onClick={()=>changeFile(file)}>{file}</button>)}</div>
        <div className="ide-symbols" aria-label="Code symbols">{symbols.map(symbol=><button key={symbol} type="button" onClick={()=>{loadEditor();editorView.current?.focus();editorView.current?.dispatch(editorView.current.state.changeByRange((range:any)=>({changes:{from:range.from,to:range.to,insert:symbol},range:{anchor:range.from+symbol.length}})));}}>{symbol}</button>)}</div>
        <div className="ide-codemirror" ref={editorHost} onClick={loadEditor}>{!loaded && <button type="button" className="ide-load" onClick={loadEditor}>Load editor</button>}</div>
        <div className="ide-actions"><button type="button" onClick={resetLesson}>Reset this lesson</button><button type="button" onClick={restoreCheckpoint}>Restore official checkpoint</button><button type="button" onClick={downloadZip}>Download .zip</button></div>
        {failures>=2&&<button type="button" onClick={revealSolution}>Show solution</button>}
        {showSolution&&<div className="ide-solution"><b>Official solution</b><pre>{HTML_OFFICIAL_CHECKPOINT['index.html']}</pre><button type="button" onClick={()=>setDiffOpen(v=>!v)}>Toggle diff view</button>{diffOpen&&<pre>{'YOUR VERSION\n'+workspace.files['index.html']+'\n\nOFFICIAL CHECKPOINT\n'+HTML_OFFICIAL_CHECKPOINT['index.html']}</pre>}</div>}
      </div>
      <div className={'ide-preview '+(mobileTab==='preview'?'mobile-active':'')}>
        <div className="ide-heading"><b>Live preview</b><button type="button" onClick={()=>refreshPreview(workspaceRef.current.files)}>Stop / restart preview</button></div>
        <iframe ref={iframe} title="Your live HTML website preview" sandbox="allow-scripts" srcDoc={makePreviewDocument(workspace.files,'initial')} />
        <div className="ide-console"><b>Console</b>{consoleLines.length?consoleLines.map((line,i)=><p key={i}>{line}</p>):<p>No messages yet.</p>}</div>
      </div>
    </div>
    {!storageAvailable&&<p className="ide-storage-warning" role="status">Progress won’t be saved. Your editor and preview are still available in this session.</p>}
    {notice&&<p className="ide-notice" role="status">{notice}</p>}
  </section>;
}
