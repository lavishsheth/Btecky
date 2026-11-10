import type { Course } from './courses';

export const javascriptFoundationsCourse: Course = {
  id: "javascript-foundations",
  categoryId: "web-development",
  slug: "javascript",
  title: "JavaScript Foundations",
  category: "Web development",
  level: "Beginner",
  summary: "Bring the HTML and CSS profile website to life with practical browser-side JavaScript.",
  description: "Continue the same personal profile website from HTML Foundations and CSS Foundations. Learn JavaScript fundamentals, connect scripts to the page, respond to user events, validate a contact form, update content safely and build useful interactions. Each lesson adds behaviour to the existing project.",
  prerequisites: ["Complete HTML Foundations and understand semantic page structure.", "Complete CSS Foundations or be comfortable styling the existing profile page.", "Know how to use the shared Web Development project workspace."],
  outcomes: [
    "Explain how JavaScript runs in the browser and connects to HTML.",
    "Use variables, values, conditions, loops, functions, arrays and objects.",
    "Select and update DOM elements safely.",
    "Respond to clicks, input and form submission events.",
    "Validate form data and provide accessible feedback.",
    "Render dynamic content from arrays and objects.",
    "Debug runtime errors with browser developer tools.",
    "Combine HTML, CSS and JavaScript into one working profile website."
  ],
  project: {
    title: "Make the same personal profile website interactive",
    brief: "Continue the profile website already structured with HTML and styled with CSS. Add a mobile navigation toggle, an interactive interests filter, a contact form with client-side validation feedback, and a theme preference control. Keep the existing content and design language; JavaScript adds behaviour rather than replacing HTML or CSS.",
    requirements: [
      "Keep the existing HTML content, semantic landmarks and styles.css file.",
      "Create a separate script.js file and load it with defer.",
      "Use clear variable names, small functions and event listeners.",
      "Add a navigation toggle that updates its accessible expanded state.",
      "Add an interests filter that updates visible content.",
      "Validate the contact form and show useful inline feedback.",
      "Use textContent for plain text updates and avoid injecting untrusted HTML.",
      "Ensure controls work with a keyboard and provide visible feedback.",
      "Keep JavaScript separate from HTML and CSS."
    ]
  },
  lessons: [
    {
      slug: "javascript-and-the-browser",
      title: "JavaScript and the browser",
      summary: "Understand what JavaScript adds to a web page and connect an external script to the project.",
      minutes: 15,
      objectives: ["Describe the different responsibilities of HTML, CSS and JavaScript.", "Explain how the browser loads and executes a script.", "Connect an external JavaScript file with defer.", "Use the console to confirm that a script runs."],
      sections: [
        { title: "Three technologies, one website", body: "HTML describes the meaning and structure of the profile page. CSS controls its presentation, including colour, spacing and responsive layout. JavaScript adds behaviour: opening a navigation menu, filtering interests, checking a form and responding to user actions. These responsibilities work together. JavaScript should not rebuild content that belongs in semantic HTML or replace ordinary styling rules." },
        { title: "Connect an external script", body: "Keep browser behaviour in a separate script.js file. Add a script element to the HTML document and use the defer attribute. The browser can download the file while parsing HTML and execute it after the document has been parsed. This means the script can safely find page elements without placing all code at the bottom of the document.", code: "<script src=\"script.js\" defer></script>" },
        { title: "Use the developer console", body: "The browser console displays messages and runtime errors. A console.log statement is useful while learning because it confirms that a line of code ran and shows the value of an expression. Remove noisy debugging messages when the project is complete. The console is a diagnostic tool, not a replacement for visible feedback in the interface.", code: "console.log(\"Profile website script loaded\");" },
        { title: "Keep project files organised", body: "The shared project should now contain index.html, styles.css and script.js. The HTML links the stylesheet and the script. CSS remains responsible for appearance, while JavaScript handles interactions. Use relative file paths and check spelling and capitalisation if a file does not load." }
      ],
      exercise: { prompt: "Connect script.js to the existing profile website and confirm that the browser runs it.", requirements: ["Create a file named script.js beside index.html.", "Load it with a script element that uses defer.", "Add one console message.", "Open the page and confirm the message appears in developer tools.", "Keep the existing HTML and CSS intact."], solution: "<!-- Add inside the HTML head -->\n<script src=\"script.js\" defer></script>\n\n// script.js\nconsole.log(\"Profile website script loaded\");" },
      quiz: [
        { question: "Which technology is responsible for adding browser-side behaviour?", options: ["HTML", "CSS", "JavaScript", "SVG only"], answer: 2, explanation: "JavaScript responds to events and can update the page while it is running." },
        { question: "What does defer do on an external script?", options: ["Deletes the script after loading", "Runs it after HTML parsing is complete", "Turns JavaScript into CSS", "Prevents the browser from downloading it"], answer: 1, explanation: "defer allows downloading during parsing and execution after the document has been parsed." }
      ],
      references: [{ label: "MDN: JavaScript first steps", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript" }, { label: "MDN: Script element", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script" }]
    },
    {
      slug: "variables-values-and-types",
      title: "Variables, values and data types",
      summary: "Store and inspect information using const, let and JavaScript values.",
      minutes: 18,
      objectives: ["Declare variables with const and let.", "Recognise strings, numbers, booleans, undefined and null.", "Use string concatenation to combine values.", "Convert and inspect values deliberately."],
      sections: [
        { title: "Give values useful names", body: "Use const when a variable binding should not be reassigned. Use let when the binding needs a new value later. Avoid var in new beginner code because its function-scoped behaviour can be surprising. Choose names that describe the information, such as visitorName, selectedTheme or formIsValid.", code: "const siteName = \"My profile\";\nlet selectedTheme = \"light\";\nselectedTheme = \"dark\";" },
        { title: "JavaScript values have types", body: "Strings represent text, numbers represent numeric values, and booleans represent true or false. undefined commonly means a value has not been assigned. null is an intentional empty value. Arrays and objects group related information. The typeof operator can help inspect many values, although arrays and null have historical quirks.", code: "const visitorName = \"Asha\";\nconst interestsCount = 4;\nconst isMember = false;\nconst selectedItem = null;\nconsole.log(typeof visitorName);\nconsole.log(typeof interestsCount);" },
        { title: "Combine values and convert input", body: "The plus operator can join strings, while Number converts a numeric string into a number. Values read from form controls are strings, even when the control looks numeric. Convert and validate input before using it in calculations. Avoid depending on implicit conversion to guess what a value means.", code: "const visitorName = \"Asha\";\nconst greeting = \"Welcome, \" + visitorName + \"!\";\nconst year = Number(\"2026\");\nconsole.log(greeting, year + 1);" }
      ],
      exercise: { prompt: "Create a small set of values describing the profile website and display a personalised message.", requirements: ["Use const for the site title and visitor name.", "Use let for a theme value that can change.", "Store an interests count as a number and a subscription flag as a boolean.", "Create a greeting by combining strings.", "Inspect at least two values with typeof."], solution: "const siteTitle = \"Asha profile\";\nconst visitorName = \"Sam\";\nlet theme = \"light\";\nconst interestsCount = 4;\nconst isSubscribed = false;\nconsole.log(\"Welcome \" + visitorName + \" to \" + siteTitle);\nconsole.log(typeof interestsCount, typeof isSubscribed);" },
      quiz: [
        { question: "Which declaration is best when a binding should not be reassigned?", options: ["var", "const", "let only", "static"], answer: 1, explanation: "const prevents reassignment of the binding and is the default choice when reassignment is unnecessary." },
        { question: "What type does an input element value normally return?", options: ["Number", "Boolean", "String", "Array"], answer: 2, explanation: "The value property of an input returns a string; convert and validate it when a number is needed." }
      ],
      references: [{ label: "MDN: Variables", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables" }, { label: "MDN: JavaScript data types", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures" }]
    },
    {
      slug: "conditions-loops-and-functions",
      title: "Conditions, loops and functions",
      summary: "Make decisions, repeat work and organise behaviour into reusable functions.",
      minutes: 22,
      objectives: ["Write if, else if and else branches.", "Compare values with strict equality.", "Use loops to process collections.", "Write functions with parameters and return values."],
      sections: [
        { title: "Make decisions with conditions", body: "An if statement runs a block when its condition is truthy. Use else if for additional branches and else for the fallback. Strict equality with three equals checks both type and value and avoids surprises associated with loose equality. Keep conditions readable by naming complex checks.", code: "const interestsCount = 4;\nif (interestsCount >= 5) {\n  console.log(\"Many interests to explore\");\n} else if (interestsCount > 0) {\n  console.log(\"Some interests to explore\");\n} else {\n  console.log(\"Add your first interest\");\n}" },
        { title: "Repeat work with loops", body: "A for loop is useful when you need an index or a known progression. A for...of loop is often simpler when you need each value from an array. Use a clear exit condition so a loop cannot continue forever.", code: "const interests = [\"Design\", \"Music\", \"Travel\"];\nfor (const interest of interests) {\n  console.log(interest);\n}" },
        { title: "Package behaviour in functions", body: "A function is a reusable block of code. Parameters receive input and return sends a result back to the caller. Small functions with one clear responsibility are easier to test and reuse. A function should generally return a value rather than changing unrelated parts of the page.", code: "function createGreeting(name) {\n  return \"Hello, \" + name + \"!\";\n}\nconst greeting = createGreeting(\"Asha\");\nconsole.log(greeting);" },
        { title: "Use array methods", body: "Methods such as forEach, map and filter express common collection operations. forEach performs an action for each item. map creates a new array by transforming each item. filter creates a new array containing only items that pass a condition. These methods help keep interface logic concise.", code: "const interests = [\"Design\", \"Music\", \"Travel\"];\nconst featured = interests.filter((item) => item.length > 5);\nconsole.log(featured);" }
      ],
      exercise: { prompt: "Use an array of interests to create a filtered list and a reusable greeting function.", requirements: ["Create an array with at least five interests.", "Use filter to select interests longer than five characters.", "Use for...of to log the filtered values.", "Write a function that accepts a name and returns a greeting.", "Add an if statement for the empty result case."], solution: "const interests = [\"Design\", \"Music\", \"Photography\", \"Travel\", \"Reading\"];\nconst featured = interests.filter((item) => item.length > 5);\nfunction greeting(name) { return \"Welcome, \" + name; }\nif (featured.length === 0) console.log(\"No featured interests yet\");\nelse for (const item of featured) console.log(item);\nconsole.log(greeting(\"Asha\"));" },
      quiz: [
        { question: "Which operator checks equality without converting types?", options: ["==", "===", "=", "!="], answer: 1, explanation: "Strict equality compares value and type without coercion." },
        { question: "What does return do inside a function?", options: ["Reloads the page", "Sends a value back to the caller", "Creates an HTML element", "Declares a CSS class"], answer: 1, explanation: "return ends the function and provides a result to the calling code." }
      ],
      references: [{ label: "MDN: Conditionals", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Conditionals" }, { label: "MDN: Loops and iteration", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration" }, { label: "MDN: Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" }]
    },
    {
      slug: "objects-and-dom-selection",
      title: "Objects and selecting page elements",
      summary: "Represent profile data with objects and connect JavaScript to existing HTML through the DOM.",
      minutes: 22,
      objectives: ["Create objects with related properties.", "Explain the DOM as a browser representation of the document.", "Select elements with querySelector and querySelectorAll.", "Update text and classes safely."],
      sections: [
        { title: "Group related information in objects", body: "An object stores related values as named properties. A profile object can keep a person's name, biography and interests together. Read properties with dot notation when the property name is known. Objects help keep data organised and make repeated content easier to manage.", code: "const profile = {\n  name: \"Asha\",\n  role: \"Designer and learner\",\n  interests: [\"Design\", \"Music\"]\n};\nconsole.log(profile.name);" },
        { title: "The DOM connects JavaScript to HTML", body: "The Document Object Model represents the parsed HTML document as a tree of objects. JavaScript can find elements, read their state and update parts of the page. Start by selecting an existing element rather than rebuilding the whole document. Keep semantic structure in HTML and use JavaScript to update parts that respond to user actions." },
        { title: "Select elements with CSS selectors", body: "document.querySelector returns the first matching element or null when no element matches. querySelectorAll returns a static NodeList of all matches. Use IDs for unique page controls and classes for reusable groups. Check that a selected element exists before using it.", code: "const pageTitle = document.querySelector(\"h1\");\nconst interestCards = document.querySelectorAll(\".interest-card\");\nif (pageTitle) console.log(pageTitle.textContent);" },
        { title: "Update text and classes safely", body: "Use textContent when setting plain text. It treats the value as text rather than parsing it as HTML, which is safer for user-provided content. classList.add, remove and toggle let JavaScript change presentation states while CSS continues to define how those states look.", code: "const status = document.querySelector(\"#profile-status\");\nif (status) status.textContent = \"Profile loaded successfully\";\nconst card = document.querySelector(\".profile-card\");\ncard?.classList.add(\"is-highlighted\");" }
      ],
      exercise: { prompt: "Add a small dynamic status message to the existing profile page without replacing its HTML.", requirements: ["Create a profile object with name and interests.", "Select an existing element by its ID or class.", "Check that the element exists before updating it.", "Set a plain text message with textContent.", "Toggle a CSS class to highlight the profile card."], solution: "const profile = { name: \"Asha\", interests: [\"Design\", \"Music\"] };\nconst status = document.querySelector(\"#profile-status\");\nconst card = document.querySelector(\".profile-card\");\nif (status) status.textContent = profile.name + \" profile loaded\";\ncard?.classList.toggle(\"is-highlighted\");" },
      quiz: [
        { question: "What does querySelector return when nothing matches?", options: ["An empty array", "null", "false", "A new div"], answer: 1, explanation: "querySelector returns null if no element matches the selector." },
        { question: "Which property is preferred for inserting plain user-provided text?", options: ["innerHTML", "outerHTML", "textContent", "document.write"], answer: 2, explanation: "textContent inserts text without parsing it as markup." }
      ],
      references: [{ label: "MDN: Working with objects", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects" }, { label: "MDN: Introduction to the DOM", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" }]
    },
    {
      slug: "events-and-interaction",
      title: "Events and user interaction",
      summary: "Respond to clicks, input and keyboard actions using event listeners.",
      minutes: 22,
      objectives: ["Explain how browser events represent user activity.", "Register event listeners with addEventListener.", "Read input values and event targets.", "Use preventDefault for controlled form behaviour."],
      sections: [
        { title: "Events describe something that happened", body: "A click, key press, input change or form submission can produce an event. JavaScript can listen for those events and run a callback. addEventListener keeps behaviour separate from HTML attributes and allows more than one listener where appropriate. Use the event that matches the user action." },
        { title: "Build an accessible menu toggle", body: "Select a button and register a click listener. Inside the callback, update a state value or toggle a class. A navigation toggle should also update aria-expanded so assistive technology can understand whether the controlled menu is open. The button should remain a real button so it works with a keyboard.", code: "const menuButton = document.querySelector(\"#menu-toggle\");\nconst siteNav = document.querySelector(\"#site-nav\");\nmenuButton?.addEventListener(\"click\", () => {\n  const isOpen = siteNav?.classList.toggle(\"is-open\") ?? false;\n  menuButton.setAttribute(\"aria-expanded\", String(isOpen));\n});" },
        { title: "Respond to input as it changes", body: "The input event fires as a user edits a control. Read the current value and use it to filter content or update a character count. Avoid changing the value while the user is typing unless that behaviour is necessary and carefully tested.", code: "const search = document.querySelector(\"#interest-search\");\nsearch?.addEventListener(\"input\", () => {\n  console.log(search.value);\n});" },
        { title: "Control default browser behaviour", body: "Some events have a default action. A form submit normally navigates or sends a request. preventDefault cancels that default action so JavaScript can handle the interaction. Use it only when your code provides the intended replacement behaviour.", code: "const form = document.querySelector(\"#contact-form\");\nform?.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  console.log(\"Handle the form in JavaScript\");\n});" }
      ],
      exercise: { prompt: "Add an accessible menu toggle and a live interest search to the existing profile page.", requirements: ["Listen for a click on the menu button.", "Toggle a class on the existing navigation element.", "Update aria-expanded to true or false.", "Listen for input in the interest search field.", "Filter interest items based on the entered text."], solution: "const menuButton = document.querySelector(\"#menu-toggle\");\nconst siteNav = document.querySelector(\"#site-nav\");\nmenuButton?.addEventListener(\"click\", () => {\n  const open = siteNav?.classList.toggle(\"is-open\") ?? false;\n  menuButton.setAttribute(\"aria-expanded\", String(open));\n});\nconst search = document.querySelector(\"#interest-search\");\nsearch?.addEventListener(\"input\", () => {\n  const query = search.value.toLowerCase();\n  document.querySelectorAll(\".interest-card\").forEach((card) => {\n    card.hidden = !card.textContent.toLowerCase().includes(query);\n  });\n});" },
      quiz: [
        { question: "Which method registers a browser event listener?", options: ["addEventListener", "querySelectorAll", "createElement", "setAttribute"], answer: 0, explanation: "addEventListener registers a callback for a named event." },
        { question: "Why might a submit handler call preventDefault?", options: ["To remove the form", "To stop default navigation while JavaScript handles the submit", "To disable all inputs permanently", "To change CSS specificity"], answer: 1, explanation: "preventDefault cancels the browser default action so the handler can manage the interaction." }
      ],
      references: [{ label: "MDN: Introduction to events", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events" }, { label: "MDN: addEventListener", url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener" }]
    },
    {
      slug: "forms-validation-and-dynamic-content",
      title: "Forms, validation and dynamic content",
      summary: "Validate the contact form and render profile interests with clear, accessible feedback.",
      minutes: 24,
      objectives: ["Handle a form submit event.", "Read and validate form values.", "Show inline feedback and associate errors with fields.", "Render dynamic content safely from arrays."],
      sections: [
        { title: "Start with semantic HTML validation", body: "HTML form controls already provide useful constraints such as required, type=email and minlength. Use those native features first because they help browsers and assistive technologies understand the form. JavaScript can add custom checks when the project needs rules beyond built-in constraints. A client-side demonstration does not send an email or store information on a server." },
        { title: "Read and validate submitted values", body: "Listen for submit on the form, prevent the default action when handling the example locally, then read values from the controls. Trim surrounding whitespace before checking whether a value is empty. Use the browser validity API where appropriate. Client-side validation is not a security boundary for a real server.", code: "const form = document.querySelector(\"#contact-form\");\nconst email = document.querySelector(\"#email\");\nconst status = document.querySelector(\"#form-status\");\nform?.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const value = email.value.trim();\n  if (!value || !email.validity.valid) {\n    status.textContent = \"Enter a valid email address.\";\n    email.focus();\n    return;\n  }\n  status.textContent = \"Form validated in this browser. No message was sent.\";\n});" },
        { title: "Give feedback people can understand", body: "Place an error message near the field and explain what needs to change. Set aria-invalid when a field fails validation and remove it when corrected. An error summary or status region can announce the result. Do not rely only on a red border; include words that describe the problem." },
        { title: "Render dynamic content safely", body: "An array can represent interests, projects or profile links. Use filter to select matching items, create elements with document.createElement, assign user-visible strings through textContent and append them to a container. Avoid assigning untrusted values to innerHTML because it parses markup and can create cross-site scripting risks.", code: "const interests = [\"Photography\", \"Cycling\", \"Reading\"];\nconst list = document.querySelector(\"#interests-list\");\nfor (const interest of interests) {\n  const item = document.createElement(\"li\");\n  item.textContent = interest;\n  list?.append(item);\n}" }
      ],
      exercise: { prompt: "Add client-side validation and a dynamic interests list to the existing profile page.", requirements: ["Use required and type=email in the HTML form.", "Handle submit with an event listener.", "Trim values and check the email validity state.", "Show an inline error message and set aria-invalid on invalid input.", "Show a success message that says the example was validated locally, not sent.", "Render interests using createElement and textContent."], solution: "const form = document.querySelector(\"#contact-form\");\nconst email = document.querySelector(\"#email\");\nconst status = document.querySelector(\"#form-status\");\nform?.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const valid = email.value.trim() !== \"\" && email.validity.valid;\n  email.setAttribute(\"aria-invalid\", String(!valid));\n  status.textContent = valid ? \"Validated locally; nothing was sent.\" : \"Please enter a valid email address.\";\n  if (!valid) email.focus();\n});" },
      quiz: [
        { question: "Which input type provides built-in email format validation?", options: ["type=text", "type=email", "type=button", "type=hidden"], answer: 1, explanation: "The email input type provides browser validation for an email-shaped value." },
        { question: "What should a client-only demo say after local validation?", options: ["Your email was delivered", "Your message was sent to the team", "The form was validated in this browser; nothing was sent", "Your account was created"], answer: 2, explanation: "A local demo must not claim to send or store information when it has no backend." }
      ],
      references: [{ label: "MDN: Client-side form validation", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation" }, { label: "MDN: Document.createElement", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement" }]
    },
    {
      slug: "debugging-and-final-integration",
      title: "Debugging and complete the interactive website",
      summary: "Find JavaScript errors and integrate the interactions into the same HTML and CSS project.",
      minutes: 22,
      objectives: ["Read common syntax and runtime errors in the browser console.", "Use breakpoints and inspect values with developer tools.", "Test interactions with keyboard and mouse.", "Integrate the complete HTML, CSS and JavaScript project."],
      sections: [
        { title: "Read the error before changing code", body: "A syntax error means the code cannot be parsed. A runtime error occurs while the code executes, often because a value is missing or a method is being called on the wrong type. Read the first relevant error and its file and line number. Fix one root cause at a time instead of changing several unrelated lines." },
        { title: "Use breakpoints and inspect state", body: "A breakpoint pauses execution at a chosen line. You can inspect local variables, step through statements and see which branch ran. This is more reliable than adding many console messages. Remove temporary breakpoints and logs when the debugging task is complete." },
        { title: "Test the interaction, not just the code", body: "Check each control with a mouse and keyboard. Confirm that the menu button updates its expanded state, the interest filter has a useful empty state, and the form explains errors. Test at narrow and wide viewport sizes. Make sure CSS focus styles remain visible and that content still exists in HTML if JavaScript does not run." },
        { title: "Bring the three stages together", body: "The finished profile website has semantic HTML for structure, CSS for its visual design and JavaScript for interaction. Keep these files separate and make sure all paths work in the downloaded project. The local contact form validates data but does not send it. The result is a complete front-end learning project that can be extended in the React stage." }
      ],
      exercise: { prompt: "Complete and test the interactive profile website built throughout the Web Development path.", requirements: ["Keep index.html and styles.css from the previous stages.", "Add script.js and load it with defer.", "Implement the accessible menu toggle.", "Implement the interests filter with an empty state.", "Implement client-side contact form validation with honest feedback.", "Test every interaction using keyboard and mouse.", "Check the browser console and fix errors.", "Download the complete project and confirm all three files are included."], solution: "// Keep the menu, interest filter and form validation in script.js.\n// Use addEventListener for interaction, textContent for plain text,\n// and keep semantic structure in index.html and presentation in styles.css." },
      quiz: [
        { question: "What is a good first step when a JavaScript error appears?", options: ["Delete the whole script", "Read the first relevant error and inspect its file and line", "Change every variable name", "Disable the browser console"], answer: 1, explanation: "The error message and location help identify the first failure in the execution path." },
        { question: "Which statement correctly describes the completed project?", options: ["JavaScript replaces all HTML and CSS", "HTML, CSS and JavaScript each keep a distinct responsibility", "The form sends email automatically", "The browser stores all data on a server"], answer: 1, explanation: "The three technologies work together while retaining separate structural, presentation and behaviour responsibilities." }
      ],
      references: [{ label: "MDN: Troubleshooting JavaScript", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_went_wrong" }, { label: "Chrome DevTools: JavaScript debugging", url: "https://developer.chrome.com/docs/devtools/javascript/" }]
    }
  ]
};
