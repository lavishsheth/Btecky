import type { Course } from './courses';

export const reactFoundationsCourse: Course = {
  id: 'react-foundations',
  categoryId: 'web-development',
  slug: 'react',
  title: 'React Foundations',
  category: 'Web development',
  level: 'Beginner → Intermediate',
  summary: 'Evolve your HTML, CSS and JavaScript profile website into a component-based React application.',
  description: 'Continue the same personal profile website built through the Web Development path. Learn components, JSX, props, state, events, forms, lists and effects. Reuse the content, design and behaviour you already created instead of starting an unrelated project.',
  prerequisites: ['Complete HTML, CSS and JavaScript Foundations.', 'Understand functions, arrays, objects, DOM events and browser debugging.', 'Have the profile website available in the shared Web Development project workspace.'],
  outcomes: ['Explain component-based architecture.', 'Create React components and compose a page.', 'Write JSX and render conditional content.', 'Pass data and callbacks through props.', 'Manage UI with useState and event handlers.', 'Render collections with stable keys.', 'Build controlled forms and accessible feedback.', 'Use effects for external synchronisation and clean them up.', 'Organise and debug a small React application.', 'Carry the existing profile website into a reusable React application.'],
  project: {
    title: 'Evolve the same profile website into a React application',
    brief: 'Continue the profile website from the previous HTML, CSS and JavaScript stages. Preserve its content, visual identity and user-facing features while rebuilding the interface as reusable React components. This is the next version of the same website, not a different demo.',
    requirements: ['Preserve the profile content, layout, colours and responsive design.', 'Create reusable Header, Navigation, ProfileIntro, InterestsSection, ContactForm and Footer components.', 'Pass profile content and callbacks through props.', 'Use state for navigation, interest filtering and form feedback.', 'Render interest items from data with stable keys.', 'Build an accessible controlled contact form.', 'Use effects only for genuine external synchronisation and clean them up.', 'Keep components focused instead of creating one giant component.', 'Test empty, invalid and successful UI states.', 'Document local run/build commands and client/server boundaries.']
  },
  lessons: [
    {
      slug: 'why-react-and-components',
      title: 'Why React and component thinking',
      summary: 'Understand the shift from manually updating page elements to composing an interface from reusable components.',
      minutes: 18,
      objectives: ['Explain what React helps developers organise.', 'Identify repeated interface sections that should become components.', 'Describe one-way data flow through a component tree.', 'Plan the React version of the existing profile website.'],
      sections: [
        { title: 'From page scripts to interface components', body: 'In the JavaScript stage, you selected elements and changed them in response to events. That approach is useful for small interactions, but a larger interface can become difficult to keep consistent when many pieces of code update the same page. React lets you describe the interface as a function of data and state. When that data changes, React updates the relevant rendered output.' },
        { title: 'A component is a reusable interface unit', body: 'A component can represent a small control, a card or an entire page section. The profile website already has natural boundaries: a site header, navigation, profile introduction, interests list, contact form and footer. Each component should have a clear responsibility. Components compose together to create the complete page.' },
        { title: 'Think in a component tree', body: 'The page can have an App component that composes Header, ProfileIntro, InterestsSection, ContactForm and Footer. A parent passes information to a child through props. A child can notify a parent through a callback passed as a prop. This predictable direction makes it easier to understand where data comes from and which component owns a change.' },
        { title: 'Plan the migration without losing the project', body: 'Do not throw away the work from HTML, CSS and JavaScript. Reuse the profile content, design decisions and interaction requirements. Move repeated markup into components, then replace manual DOM updates with React state. Keep the same project goal and compare the React version with the earlier stages.' }
      ],
      exercise: { prompt: 'Plan the component tree for the existing profile website before writing React code.', requirements: ['Identify at least five reusable page components.', 'Choose which component owns profile data.', 'Identify which components need interactive state.', 'Describe which values should be passed as props.', 'Keep the same profile website content and design.'], solution: 'App\n├── Header\n│   └── Navigation\n├── ProfileIntro\n├── InterestsSection\n│   └── InterestCard (repeated)\n├── ContactForm\n└── Footer\n\nApp can own shared profile data. InterestsSection owns its filter selection. ContactForm owns its field and feedback state.' },
      quiz: [
        { question: 'What is the main purpose of a React component?', options: ['Store CSS files only', 'Describe a reusable part of the interface', 'Replace the browser', 'Create a database'], answer: 1, explanation: 'Components package interface structure and behaviour into reusable units.' },
        { question: 'How does a parent normally provide data to a child component?', options: ['Through props', 'By changing the child DOM directly', 'Through a CSS selector', 'By reloading the page'], answer: 0, explanation: 'Props are the normal way for a parent to pass values and callbacks to a child.' }
      ],
      references: [{ label: 'React: Describing the UI', url: 'https://react.dev/learn/describing-the-ui' }, { label: 'React: Thinking in React', url: 'https://react.dev/learn/thinking-in-react' }]
    },
    {
      slug: 'jsx-and-components',
      title: 'JSX and your first components',
      summary: 'Create React components, write JSX and compose the existing profile page from smaller parts.',
      minutes: 22,
      objectives: ['Write a function component.', 'Understand JSX expressions.', 'Use fragments and className correctly.', 'Compose a page from imported components.'],
      sections: [
        { title: 'A component is a JavaScript function', body: 'A function component returns the description of the UI React should render. Component names begin with a capital letter so JSX can distinguish them from built-in HTML tags. Keep a component small enough that its name describes its purpose. A component can be moved into its own file and imported where it is used.' },
        { title: 'JSX describes the rendered structure', body: 'JSX looks similar to HTML but is JavaScript syntax with its own rules. Use className for CSS classes, close elements correctly and wrap sibling elements in a parent or fragment. Curly braces let you include JavaScript expressions such as variables and calculations. JSX is compiled by project tooling before the browser runs it.', code: 'function ProfileIntro() {\n  const name = "Asha";\n  return (\n    <section className="profile-intro">\n      <h1>{name}</h1>\n      <p>Designer and learner</p>\n    </section>\n  );\n}' },
        { title: 'Compose the page from components', body: 'An App component can render the header, profile introduction, interests section, contact form and footer. Component composition keeps the page structure easy to scan. Avoid copying the same large block of JSX into multiple places; extract repeated patterns into a component that accepts changing values as props.', code: 'function App() {\n  return (\n    <>\n      <Header />\n      <ProfileIntro />\n      <InterestsSection />\n      <ContactForm />\n      <Footer />\n    </>\n  );\n}' },
        { title: 'Keep the existing CSS working', body: 'The profile website already has a visual system. Reuse its CSS classes while moving markup into JSX, changing class to className where needed. Keep responsive rules and focus states. Make small, testable migrations so a layout regression is easy to locate.' }
      ],
      exercise: { prompt: 'Create the first React version of the profile page using composed components.', requirements: ['Create an App component.', 'Create separate Header, ProfileIntro and Footer components.', 'Use JSX and className for existing styles.', 'Render all three components from App.', 'Preserve the original page content and visual structure.'], solution: 'function Header() { return <header className="site-header">My profile</header>; }\nfunction ProfileIntro() { return <main><h1>Asha</h1><p>Designer and learner</p></main>; }\nfunction Footer() { return <footer>Made with care</footer>; }\nfunction App() { return <><Header /><ProfileIntro /><Footer /></>; }' },
      quiz: [
        { question: 'How should a custom React component name normally begin?', options: ['A lowercase letter', 'A capital letter', 'A number', 'An underscore only'], answer: 1, explanation: 'Capitalisation distinguishes custom components from built-in HTML elements in JSX.' },
        { question: 'Which JSX attribute is used for CSS classes?', options: ['class', 'className', 'cssClass', 'styleName'], answer: 1, explanation: 'React JSX uses className for the HTML class attribute.' }
      ],
      references: [{ label: 'React: Your first component', url: 'https://react.dev/learn/your-first-component' }, { label: 'React: Writing markup with JSX', url: 'https://react.dev/learn/writing-markup-with-jsx' }]
    },
    {
      slug: 'props-and-component-data',
      title: 'Props and reusable profile components',
      summary: 'Pass profile data and callbacks into components so the same component can display different content.',
      minutes: 20,
      objectives: ['Pass strings, arrays and objects as props.', 'Destructure props in a component.', 'Pass callback functions from parent to child.', 'Keep props read-only and avoid duplicated data.'],
      sections: [
        { title: 'Props configure a component', body: 'Props are values supplied by the component that renders another component. They let a reusable component display different content without duplicating its structure. A profile card might receive a name, role, biography and image description. Treat props as read-only inputs; if a value needs to change, update the state owned by the appropriate component.' },
        { title: 'Pass structured data', body: 'An array of objects can represent profile interests. Pass the array to an InterestsSection component and let it decide how to display the collection. Destructure the props your component needs so the code is easy to read. Use meaningful property names and avoid passing a large collection of unrelated values.', code: 'const profile = { name: "Asha", role: "Designer", bio: "I enjoy making useful things." };\nfunction ProfileIntro({ person }) {\n  return <section><h1>{person.name}</h1><p>{person.role}</p><p>{person.bio}</p></section>;\n}\n<ProfileIntro person={profile} />' },
        { title: 'Pass callbacks for child interactions', body: 'A child component can call a function it receives from its parent. For example, an InterestCard can call onSelect with its own ID when a visitor chooses it. The parent decides what that selection means and updates the state it owns. This keeps data flow predictable and avoids a child reaching into unrelated components.' },
        { title: 'Choose component boundaries carefully', body: 'Do not create a component for every HTML element. Extract a component when it has a meaningful role, repeated structure or independent behaviour. A component API should be small and clear. If a component needs many unrelated boolean props, reconsider whether it is doing too many jobs.' }
      ],
      exercise: { prompt: 'Refactor the profile introduction and interests into reusable components driven by props.', requirements: ['Create one profile object and an array of interest objects.', 'Pass the profile object to ProfileIntro.', 'Pass the interests array to InterestsSection.', 'Create an InterestCard component that receives one interest.', 'Pass an onSelect callback from parent to child.'], solution: 'const interests = [{ id: "design", title: "Design" }, { id: "music", title: "Music" }];\nfunction InterestCard({ interest, onSelect }) { return <button onClick={() => onSelect(interest.id)}>{interest.title}</button>; }\nfunction InterestsSection({ items, onSelect }) { return <section>{items.map((item) => <InterestCard key={item.id} interest={item} onSelect={onSelect} />)}</section>; }' },
      quiz: [
        { question: 'Should a component directly mutate a prop it receives?', options: ['Yes, always', 'No, props are read-only inputs', 'Only when it is an array', 'Only after a click'], answer: 1, explanation: 'A component should treat props as read-only and request changes through callbacks or state owned by the right component.' },
        { question: 'How can a child notify its parent about a selection?', options: ['Call a callback prop', 'Change the parent HTML string', 'Reload the document', 'Edit the parent source file'], answer: 0, explanation: 'A callback passed as a prop lets the child notify the parent while keeping data flow explicit.' }
      ],
      references: [{ label: 'React: Passing props to a component', url: 'https://react.dev/learn/passing-props-to-a-component' }, { label: 'React: Sharing data between components', url: 'https://react.dev/learn/sharing-state-between-components' }]
    },
    {
      slug: 'state-and-event-handling',
      title: 'State and event handling',
      summary: 'Replace manual DOM updates with React state for the menu and interest filter.',
      minutes: 24,
      objectives: ['Use useState to remember a component value.', 'Update state through its setter.', 'Handle clicks and input events in JSX.', 'Keep rendered UI derived from state.'],
      sections: [
        { title: 'State is data that changes over time', body: 'A component may need to remember whether a menu is open, which interest category is selected or whether a panel is expanded. useState gives a component a state value and a setter function. Calling the setter requests a render with the new value. Do not assign directly to a state variable or mutate an object and expect React to notice.' },
        { title: 'Use state for the navigation toggle', body: 'The menu button can store an isOpen boolean. Its click handler toggles that value, and the rendered navigation class and aria-expanded attribute are derived from it. The same state drives both visual appearance and accessibility information, preventing them from drifting apart.', code: 'const [isOpen, setIsOpen] = useState(false);\n<button aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>Menu</button>\n<nav className={isOpen ? "is-open" : ""}>...</nav>' },
        { title: 'Make the interest filter state-driven', body: 'Store the selected category in state. Derive the visible interests by filtering the original data for the current category. Do not keep a second state array that duplicates the filtered result unless there is a specific reason. Derived values should normally be calculated from source data and current state during rendering.', code: 'const [category, setCategory] = useState("all");\nconst visible = interests.filter((item) => category === "all" || item.category === category);' },
        { title: 'Avoid stale state assumptions', body: 'When a new state value depends on the previous value, use the functional setter form. React may batch updates, so do not assume a state variable changes immediately after calling its setter. Event handlers request the update; the next render receives the new state value.' }
      ],
      exercise: { prompt: 'Replace the profile website menu and interest filter DOM scripts with React state.', requirements: ['Use useState for the menu open state.', 'Keep aria-expanded in sync with menu state.', 'Use useState for the selected interest category.', 'Derive visible interests from the source array.', 'Remove old direct DOM class toggling for these features.'], solution: 'const [isOpen, setIsOpen] = useState(false);\nconst [category, setCategory] = useState("all");\nconst visibleInterests = interests.filter((item) => category === "all" || item.category === category);\nreturn <><button aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>Menu</button><nav className={isOpen ? "is-open" : ""}>...</nav>{visibleInterests.map((item) => <p key={item.id}>{item.title}</p>)}</>;' },
      quiz: [
        { question: 'What does calling a useState setter do?', options: ['Directly edits the source file', 'Requests a render with updated state', 'Reloads the browser tab', 'Changes a CSS file'], answer: 1, explanation: 'The setter schedules a state update and React renders the component with the new value.' },
        { question: 'Where should a filtered list usually come from?', options: ['A duplicated state array', 'The source data and selected filter state', 'A hard-coded HTML string', 'The browser URL only'], answer: 1, explanation: 'A filtered list is usually derived from source data and the current filter state.' }
      ],
      references: [{ label: 'React: State: A component’s memory', url: 'https://react.dev/learn/state-a-components-memory' }, { label: 'React: Responding to events', url: 'https://react.dev/learn/responding-to-events' }]
    },
    {
      slug: 'lists-forms-and-controlled-inputs',
      title: 'Lists, forms and controlled inputs',
      summary: 'Render interests with stable keys and build a contact form managed by React.',
      minutes: 24,
      objectives: ['Render arrays with map and stable keys.', 'Explain why keys identify items consistently.', 'Build controlled text inputs and textareas.', 'Validate form state and display accessible feedback.'],
      sections: [
        { title: 'Render collections with stable keys', body: 'Use map to turn an array into a list of components or elements. Give each sibling a key that identifies the item consistently, usually a stable ID from the data. Avoid array indexes as keys when items can be inserted, removed or reordered because React may associate state with the wrong item.' },
        { title: 'A controlled input reflects React state', body: 'A controlled input receives its value from state and updates that state in its onChange handler. This makes React state the source of truth for the field. The same pattern works for a textarea and select. Keep the initial value a string so an input does not switch between controlled and uncontrolled modes.', code: 'const [name, setName] = useState("");\n<label htmlFor="name">Your name</label>\n<input id="name" value={name} onChange={(event) => setName(event.target.value)} />' },
        { title: 'Validate and explain form results', body: 'Handle the form submit event and prevent the browser default only when the example handles the form locally. Check required values and use the browser validity API for an email field. Show errors next to relevant controls and connect descriptions with aria-describedby. A front-end-only example can demonstrate validation but cannot deliver a message without a server or configured form service.' },
        { title: 'Keep the form accessible', body: 'Every field needs a visible label. Do not use placeholder text as the only label. Associate helper and error text with the input, expose invalid state when appropriate and make feedback understandable without colour alone. Preserve keyboard focus and do not clear a user’s input unexpectedly after a validation error.' }
      ],
      exercise: { prompt: 'Convert the interests collection and contact form into React-rendered, controlled UI.', requirements: ['Render interests using map and stable item IDs as keys.', 'Create controlled name and email fields.', 'Use onChange handlers to update state.', 'Validate the form on submit and show inline feedback.', 'State clearly that the local demo does not send or store messages.'], solution: 'const [name, setName] = useState("");\nconst [email, setEmail] = useState("");\nconst [status, setStatus] = useState("");\nfunction handleSubmit(event) { event.preventDefault(); if (!name.trim() || !email.includes("@")) { setStatus("Check your name and email."); return; } setStatus("Validated in this browser. Nothing was sent."); }\nreturn <form onSubmit={handleSubmit}><label htmlFor="name">Name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} /><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /><button>Check form</button><p role="status">{status}</p></form>;' },
      quiz: [
        { question: 'Why are stable keys important when rendering lists?', options: ['They style list items', 'They help React identify items between renders', 'They encrypt the data', 'They replace component props'], answer: 1, explanation: 'Keys help React match list items when the collection changes.' },
        { question: 'What makes an input controlled in React?', options: ['It has a placeholder', 'Its value comes from state and onChange updates that state', 'It is disabled', 'It uses an HTML name only'], answer: 1, explanation: 'A controlled input receives its current value from React state and reports changes through an event handler.' }
      ],
      references: [{ label: 'React: Rendering lists', url: 'https://react.dev/learn/rendering-lists' }, { label: 'React: Reacting to input with state', url: 'https://react.dev/learn/reacting-to-input-with-state' }]
    },
    {
      slug: 'effects-and-browser-synchronisation',
      title: 'Effects and browser synchronisation',
      summary: 'Understand when effects are needed and synchronise the React page with browser features safely.',
      minutes: 22,
      objectives: ['Explain what an effect synchronises.', 'Use useEffect with appropriate dependencies.', 'Clean up subscriptions and event listeners.', 'Avoid effects for values calculated during rendering.'],
      sections: [
        { title: 'Effects synchronise with external systems', body: 'Most component logic should run during rendering or in response to an event. An effect is for synchronising a component with something outside React, such as a browser API, a subscription, a timer or a third-party widget. Do not use an effect merely to copy one state value into another or calculate a filtered list that can be derived during rendering.' },
        { title: 'Synchronise the document title', body: 'The browser document title is outside the React component tree. An effect can update it when the profile name changes. Include the values the effect reads in its dependency list so React can re-run the effect when those values change. Keep the effect focused on the external synchronisation task.', code: 'useEffect(() => {\n  document.title = profile.name + " | Profile";\n}, [profile.name]);' },
        { title: 'Clean up external subscriptions', body: 'If an effect adds an event listener, starts a timer or subscribes to a service, return a cleanup function that removes or cancels it. Cleanup runs before the effect re-runs and when the component unmounts. This prevents duplicate listeners and work that continues after the UI no longer needs it.', code: 'useEffect(() => {\n  const handleResize = () => setCompact(window.innerWidth < 700);\n  window.addEventListener("resize", handleResize);\n  return () => window.removeEventListener("resize", handleResize);\n}, []);' },
        { title: 'Do not use effects for derived data', body: 'If visible interests can be calculated by filtering an array with the selected category, calculate that value during rendering. Storing it in another state variable and synchronising it with an effect adds an extra render and creates more ways for values to get out of sync. Keep effects for genuine external synchronisation.' }
      ],
      exercise: { prompt: 'Add one justified browser synchronisation effect and explain why other UI values do not need effects.', requirements: ['Use an effect to update document.title from the profile name.', 'Include the profile name in the dependency list.', 'If you add a browser event listener, clean it up.', 'Calculate filtered interests directly from state and data.', 'Avoid copying derived values into separate state.'], solution: 'useEffect(() => { document.title = profile.name + " | Profile"; }, [profile.name]);\n\n// Derive filtered interests during render:\nconst visible = interests.filter((item) => category === "all" || item.category === category);' },
      quiz: [
        { question: 'When is useEffect most appropriate?', options: ['For every variable declaration', 'To synchronise with an external system', 'To calculate every filtered array', 'To replace event handlers'], answer: 1, explanation: 'Effects are intended for synchronisation with systems outside React.' },
        { question: 'What should an effect do when it adds an event listener?', options: ['Leave it permanently', 'Return cleanup that removes the listener', 'Add the listener on every render without cleanup', 'Disable the browser event'], answer: 1, explanation: 'Cleanup prevents listeners from accumulating and removes the subscription when it is no longer needed.' }
      ],
      references: [{ label: 'React: Synchronizing with Effects', url: 'https://react.dev/learn/synchronizing-with-effects' }, { label: 'React: You might not need an Effect', url: 'https://react.dev/learn/you-might-not-need-an-effect' }]
    },
    {
      slug: 'react-project-integration-and-debugging',
      title: 'Integrate, debug and ship the React profile website',
      summary: 'Bring the components together, test important states and complete the React version of your shared project.',
      minutes: 25,
      objectives: ['Organise components into a maintainable project structure.', 'Debug common component, props and state issues.', 'Test keyboard interaction and important UI states.', 'Explain how React builds on HTML, CSS and JavaScript.'],
      sections: [
        { title: 'Organise files by responsibility', body: 'Keep the application entry point, page composition and reusable components easy to find. A small project might use components for Header, ProfileIntro, InterestsSection, InterestCard, ContactForm and Footer, with profile data stored separately. Avoid introducing extra libraries or abstractions before the project needs them.' },
        { title: 'Debug common React mistakes', body: 'Common issues include forgetting to export or import a component, using lowercase names for custom components, missing list keys, mutating state directly and reading a value before it exists. Read the console and build output carefully. Fix the first meaningful error and retest the affected interaction before making unrelated changes.' },
        { title: 'Test the interface as a learner and visitor', body: 'Check the mobile menu with keyboard and pointer, switch interest filters, inspect the empty state and submit both invalid and valid form values. Confirm focus is visible and feedback is announced. Test narrow and wide layouts. Make sure the page content remains understandable and the design still matches the earlier project stages.' },
        { title: 'Understand what the React stage changed', body: 'The same website now uses React components to organise the interface, props to pass information, state to represent interactions and effects only where browser synchronisation is required. HTML semantics and accessibility still matter. CSS remains responsible for visual presentation. JavaScript is still the language powering the application. React changes how the interface is composed and updated; it does not replace the web platform.' }
      ],
      exercise: { prompt: 'Finish and review the React version of the profile website as the capstone of the Web Development path.', requirements: ['Compose the page from reusable components.', 'Pass profile and interest data through props.', 'Use state for navigation, filters and form feedback.', 'Render collections with stable keys.', 'Use controlled form fields and accessible feedback.', 'Use effects only for external synchronisation and clean them up.', 'Test keyboard, pointer, invalid, empty and successful states.', 'Confirm the React version preserves the original website identity and content.'], solution: 'Final review checklist:\n- App composes Header, ProfileIntro, InterestsSection, ContactForm and Footer.\n- Data is passed through props; interactive values are state.\n- Lists use stable IDs as keys.\n- Inputs are controlled and labelled.\n- Form feedback is honest about local-only behaviour.\n- Effects clean up subscriptions and are not used for derived values.\n- Keyboard focus and responsive styling are preserved.' },
      quiz: [
        { question: 'Which technology still controls the visual presentation in the React project?', options: ['CSS', 'React props', 'The browser console', 'JSON'], answer: 0, explanation: 'CSS remains responsible for the website appearance, including layout, colour, typography and responsive rules.' },
        { question: 'What is the best approach when a React build reports an error?', options: ['Change many files at once', 'Read the first relevant error and fix its root cause', 'Ignore it if the page partly renders', 'Delete the component tree'], answer: 1, explanation: 'The first relevant error often identifies the root cause; fix it and retest before changing unrelated code.' }
      ],
      references: [{ label: 'React: Importing and exporting components', url: 'https://react.dev/learn/importing-and-exporting-components' }, { label: 'React: State structure', url: 'https://react.dev/learn/choosing-the-state-structure' }, { label: 'React documentation', url: 'https://react.dev/learn' }]
    }
  ]
};
