import type { Course } from './courses';

export const cssFoundationsCourse: Course = {
  id: 'css-foundations',
  categoryId: 'web-development',
  slug: 'css',
  title: 'CSS Foundations',
  category: 'Web development',
  level: 'Beginner',
  summary: 'Turn the HTML website you already built into a clear, responsive and accessible design.',
  description: 'Learn CSS by styling the same personal profile website you created in HTML Foundations. Start with selectors and the cascade, then build visual hierarchy, spacing, layouts and responsive behaviour. Every lesson changes the same project rather than starting an unrelated exercise.',
  prerequisites: [
    'Complete the HTML Foundations course or understand basic HTML document structure.',
    'Have your HTML profile page available in the shared Web Development project workspace.',
    'No previous CSS experience is required.'
  ],
  outcomes: [
    'Explain how CSS rules, selectors, declarations and the cascade work.',
    'Select HTML elements using type, class, ID, attribute and combinator selectors.',
    'Use inheritance, specificity and source order to reason about conflicting rules.',
    'Apply colour, typography, relative units, spacing and the CSS box model.',
    'Create page layouts with Flexbox and CSS Grid.',
    'Build responsive layouts with fluid sizing and media queries.',
    'Use visible focus states, readable contrast and reduced-motion preferences.',
    'Debug styling issues with browser developer tools.'
  ],
  project: {
    title: 'Design the same personal profile website',
    brief: 'Continue the personal profile page built in HTML Foundations. Do not replace its content with a new project. Add a consistent visual system, a responsive header, readable content sections, a useful interests layout and a mobile-friendly contact form.',
    requirements: [
      'Keep the existing HTML content and semantic landmarks.',
      'Create a separate styles.css file and link it from index.html.',
      'Define reusable colour, spacing and typography values with CSS custom properties.',
      'Style headings, paragraphs, links, buttons, images and form controls consistently.',
      'Use the box model intentionally and avoid unexplained fixed widths.',
      'Use Flexbox or Grid for at least one meaningful page layout.',
      'Add a responsive layout for narrow screens.',
      'Keep keyboard focus visible and text readable at different viewport sizes.'
    ]
  },
  lessons: [
    {
      slug: 'how-css-works',
      title: 'How CSS works with HTML',
      summary: 'Understand style rules, declarations, selectors and how a browser applies a stylesheet to your existing page.',
      minutes: 14,
      objectives: [
        'Explain the separate responsibilities of HTML and CSS.',
        'Recognise CSS rules, selectors, properties and values.',
        'Attach an external stylesheet to an HTML document.',
        'Use browser developer tools to inspect applied styles.'
      ],
      sections: [
        {
          title: 'HTML describes meaning; CSS describes presentation',
          body: 'Your HTML profile page already describes its content: a page heading, an introduction, sections, links, an image and a contact form. CSS changes how those elements are presented without changing what they mean. Keeping structure and presentation separate makes the page easier to maintain. A heading should remain a heading even when its colour, size or spacing changes.'
        },
        {
          title: 'A CSS rule has a selector and declarations',
          body: 'A selector identifies which elements a rule targets. The declaration block contains one or more property-value pairs. A property names the aspect to change, such as color or margin; its value specifies the chosen result. Each declaration ends with a semicolon. A stylesheet can contain many rules, and a single element can match several selectors.',
          code: 'p {\n  color: #344054;\n  line-height: 1.7;\n}\n\nh1 {\n  color: #173b8f;\n  font-size: 2.5rem;\n}'
        },
        {
          title: 'Connect an external stylesheet',
          body: 'The link element belongs in the document head. Its rel attribute identifies the relationship as a stylesheet and href points to the CSS file. Keep the file path accurate: if index.html and styles.css are in the same folder, the simple relative path styles.css is enough. External stylesheets are reusable and keep CSS out of the HTML content.',
          code: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My profile</title>\n  <link rel="stylesheet" href="styles.css">\n</head>'
        },
        {
          title: 'Inspect styles instead of guessing',
          body: 'Open your page in a browser and use developer tools to inspect an element. The Styles panel shows matching rules and crossed-out declarations; the computed panel shows the final values after the cascade. You can temporarily change values in developer tools to experiment. Those changes are not saved to your file, so copy successful changes into styles.css.',
          note: 'In your shared project workspace, open styles.css, add a rule for body, run the website and observe the same HTML page update. Do not create a second page for this course.'
        }
      ],
      exercise: {
        prompt: 'Connect a stylesheet to your existing profile page and apply a first set of readable base styles.',
        requirements: [
          'Add a link element for styles.css inside head.',
          'Set a readable font family on body.',
          'Set a text colour and a light page background.',
          'Add a line-height that makes paragraphs comfortable to read.',
          'Keep all existing HTML content unchanged.'
        ],
        solution: '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My profile</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n\n/* styles.css */\nbody {\n  font-family: system-ui, sans-serif;\n  color: #17213b;\n  background: #f7f8fc;\n  line-height: 1.6;\n}'
      },
      quiz: [
        { question: 'Where should an external stylesheet link normally be placed?', options: ['Inside the page footer', 'Inside the document head', 'Inside every paragraph', 'After the closing html tag'], answer: 1, explanation: 'The link element belongs in head so the browser can discover the stylesheet as it processes the document.' },
        { question: 'In the rule p { color: navy; }, what is color?', options: ['A selector', 'A property', 'A value', 'An HTML attribute'], answer: 1, explanation: 'The selector is p, the property is color and the value is navy.' }
      ],
      references: [
        { label: 'MDN: CSS first steps', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Getting_started' },
        { label: 'MDN: How CSS works', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/What_is_CSS' }
      ]
    },
    {
      slug: 'css-selectors',
      title: 'Selectors: target the right elements',
      summary: 'Style groups of elements precisely with type, class, ID, attribute and relationship selectors.',
      minutes: 16,
      objectives: [
        'Use type selectors for broad element styling.',
        'Use classes for reusable component styles.',
        'Understand ID selector uniqueness and specificity.',
        'Use simple combinators to target elements by relationship.'
      ],
      sections: [
        {
          title: 'Type selectors set sensible defaults',
          body: 'A type selector matches every element of that type. A p rule affects all paragraphs, while h1 affects all level-one headings. Type selectors are useful for broad defaults such as font family, line height and base link styling. Avoid making every element highly specific at the start; broad defaults are easier to override intentionally.'
        },
        {
          title: 'Classes are reusable styling hooks',
          body: 'Add a class attribute to HTML when an element belongs to a reusable visual group. A class selector begins with a dot. The same class can be used on multiple elements, and an element can have several classes separated by spaces. Prefer meaningful names such as profile-card or section-title over names that describe a temporary colour or position.',
          code: '<section class="profile-card">\n  <h2 class="section-title">About me</h2>\n  <p class="intro">I enjoy learning how the web works.</p>\n</section>\n\n.profile-card {\n  padding: 1.5rem;\n  border-radius: 1rem;\n}\n\n.section-title {\n  margin-top: 0;\n}'
        },
        {
          title: 'IDs and attributes',
          body: 'An ID selector begins with # and targets the element with that ID. IDs should be unique within a document and are often useful for fragment links and scripting; classes are usually the better choice for reusable styling. Attribute selectors can target elements based on an attribute or its value, such as input[type="email"].'
        },
        {
          title: 'Combinators express relationships',
          body: 'A descendant selector uses a space to target matching elements anywhere inside another element. A child combinator uses > to target only direct children. A selector such as nav a targets links within navigation, while .profile-card > h2 targets a heading that is a direct child of the card. Keep selectors understandable and avoid long chains that make future changes difficult.',
          code: 'nav a {\n  text-decoration: none;\n}\n\n.profile-card > h2 {\n  margin-top: 0;\n}\n\ninput[type="email"] {\n  width: 100%;\n}'
        }
      ],
      exercise: {
        prompt: 'Add reusable classes to the existing profile page and style its sections and contact form.',
        requirements: [
          'Give the main content wrapper a class named page-shell.',
          'Give each major content section the class content-card.',
          'Style all content-card elements with a border and internal spacing.',
          'Style links inside nav without removing their visible focus indicator.',
          'Use an attribute selector to give email inputs a consistent width.'
        ],
        solution: '.page-shell {\n  width: min(100% - 2rem, 70rem);\n  margin-inline: auto;\n}\n\n.content-card {\n  padding: 1.5rem;\n  border: 1px solid #dce3ef;\n  border-radius: 1rem;\n}\n\nnav a {\n  text-decoration: none;\n}\n\ninput[type="email"] {\n  width: 100%;\n}'
      },
      quiz: [
        { question: 'Which selector is reusable across multiple elements?', options: ['#profile', '.profile-card', 'html', 'Only an inline style'], answer: 1, explanation: 'A class selector can match any number of elements and is a good reusable styling hook.' },
        { question: 'What does .card > h2 select?', options: ['Every h2 on the page', 'Any h2 anywhere in the document', 'Only h2 elements that are direct children of an element with class card', 'Only an element with id card'], answer: 2, explanation: 'The child combinator > matches direct children only.' }
      ],
      references: [
        { label: 'MDN: CSS selectors', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors' },
        { label: 'MDN: Selectors and combinators', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors' }
      ]
    },
    {
      slug: 'cascade-specificity-inheritance',
      title: 'The cascade, specificity and inheritance',
      summary: 'Understand why one CSS declaration wins when multiple rules target the same element.',
      minutes: 17,
      objectives: [
        'Explain the cascade as the process for resolving competing declarations.',
        'Compare selector specificity at a basic level.',
        'Recognise inherited properties.',
        'Debug conflicts without relying on excessive !important declarations.'
      ],
      sections: [
        {
          title: 'The cascade resolves competing declarations',
          body: 'Several CSS rules can match the same element and even set the same property. The browser resolves those declarations through the cascade, which considers origin and importance, cascade layers, specificity, scoping proximity where relevant, and source order. For everyday author styles, understanding specificity and source order explains many common conflicts. The declaration that appears last does not automatically win if another declaration has higher priority.'
        },
        {
          title: 'Specificity is a comparison, not a score to game',
          body: 'For common selectors, IDs contribute more specificity than classes, attributes and pseudo-classes; those contribute more than type selectors and pseudo-elements. A class selector generally overrides a type selector when both declarations compete at the same cascade priority. Avoid adding IDs or deeply nested selectors simply to force a rule to win. A small, consistent class system is easier to maintain.',
          code: 'p { color: #475467; }\n.intro { color: #175cd3; }\n#notice { color: #b42318; }'
        },
        {
          title: 'Inheritance passes selected values to descendants',
          body: 'Some properties, such as color and font-family, normally inherit from a parent to its children. Others, such as margin, padding and border, do not. Inheritance helps you set a consistent base style on body and override it only where necessary. The inherit keyword can explicitly request the parent value, while initial and unset have different reset behaviour.'
        },
        {
          title: 'Fix the source of a conflict',
          body: 'When a style is unexpected, inspect the element and find the winning declaration in developer tools. Look for crossed-out rules, specificity and source order. Prefer removing a stale rule or making the intended selector clearer. !important changes cascade priority and can make later maintenance difficult; reserve it for narrowly justified cases rather than using it as a routine override.',
          note: 'Try setting the body font family once, then remove repeated font-family declarations from individual sections. Observe which elements inherit the value.'
        }
      ],
      exercise: {
        prompt: 'Simplify conflicting styles on your profile page using inheritance and clear class selectors.',
        requirements: [
          'Set the base font family and text colour on body.',
          'Use a class to style the introduction paragraph differently.',
          'Remove duplicate declarations that repeat inherited values.',
          'Do not use !important to force the result.'
        ],
        solution: 'body {\n  font-family: system-ui, sans-serif;\n  color: #263247;\n}\n\n.intro {\n  color: #175cd3;\n  font-size: 1.125rem;\n}'
      },
      quiz: [
        { question: 'At the same cascade priority, which selector normally has greater specificity?', options: ['p', '.intro', 'Both are always equal', 'A universal selector'], answer: 1, explanation: 'A class selector has greater specificity than a type selector.' },
        { question: 'Which property normally inherits from body to child text elements?', options: ['margin', 'border', 'font-family', 'padding'], answer: 2, explanation: 'font-family is normally inherited, while margin, border and padding are not.' }
      ],
      references: [
        { label: 'MDN: Introduction to the CSS cascade', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade' },
        { label: 'MDN: Specificity', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity' },
        { label: 'MDN: Inheritance', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance' }
      ]
    },
    {
      slug: 'colour-typography-and-units',
      title: 'Colour, typography and CSS units',
      summary: 'Build a consistent visual language with colour, readable type and flexible measurements.',
      minutes: 18,
      objectives: [
        'Use common CSS colour formats and custom properties.',
        'Choose readable font stacks and line lengths.',
        'Distinguish absolute and relative CSS units.',
        'Use rem, em, percentages and viewport-aware sizing appropriately.'
      ],
      sections: [
        {
          title: 'Create a small colour system',
          body: 'CSS accepts named colours, hexadecimal values, rgb() and hsl(). Choose a small palette with a page background, surface colour, primary text, muted text and an accent colour. Check text and control contrast rather than choosing colours by appearance alone. CSS custom properties let you define design tokens once and reuse them throughout the page.',
          code: ':root {\n  --page-bg: #f6f8fc;\n  --surface: #ffffff;\n  --text: #17213b;\n  --muted: #596579;\n  --accent: #315efb;\n}\n\nbody {\n  color: var(--text);\n  background: var(--page-bg);\n}\na { color: var(--accent); }'
        },
        {
          title: 'Typography is part of usability',
          body: 'A font stack provides a preferred font and sensible fallbacks. Use a comfortable base size, line height and paragraph measure. Very long lines are difficult to track, while very short lines create excessive wrapping. Use font-weight to establish hierarchy and avoid relying on colour alone to distinguish important content. System font stacks are a good starting point when you do not need a custom typeface.'
        },
        {
          title: 'Choose units for the relationship you need',
          body: 'Pixels are fixed CSS reference units and are useful for fine details such as borders. rem is relative to the root font size and is useful for scalable spacing and type. em is relative to the computed font size of the element (or parent in some contexts), which can compound in nested components. Percentages depend on the relevant containing value. Viewport units relate to the viewport and can help create fluid sizing, but should be used carefully on mobile.'
        },
        {
          title: 'Use fluid values with sensible limits',
          body: 'The clamp() function lets a value grow between a minimum and maximum as another value changes. It is useful for responsive headings and spacing. Pair fluid values with readable limits rather than letting text become enormous on wide screens or too small on narrow screens.',
          code: '.page-title {\n  font-size: clamp(2rem, 5vw, 4rem);\n}\n\n.page-shell {\n  width: min(100% - 2rem, 70rem);\n  margin-inline: auto;\n}\n\n.content-card {\n  padding: clamp(1rem, 3vw, 2rem);\n}'
        }
      ],
      exercise: {
        prompt: 'Create reusable design tokens and apply them to the same profile page.',
        requirements: [
          'Define at least five CSS custom properties in :root.',
          'Use the tokens for body text, page background, surfaces and links.',
          'Use rem for the main spacing scale.',
          'Use clamp() for the page heading size.',
          'Limit the main content width and centre it.'
        ],
        solution: ':root {\n  --page-bg: #f6f8fc;\n  --surface: #fff;\n  --text: #17213b;\n  --muted: #596579;\n  --accent: #315efb;\n  --space: 1.5rem;\n}\nbody { color: var(--text); background: var(--page-bg); }\n.page-shell { width: min(100% - 2rem, 70rem); margin-inline: auto; }\n.page-title { font-size: clamp(2rem, 5vw, 4rem); }\n.content-card { padding: var(--space); background: var(--surface); }'
      },
      quiz: [
        { question: 'Which unit is relative to the root element font size?', options: ['px', 'rem', 'vh', 'cm'], answer: 1, explanation: 'rem is based on the computed font size of the root element.' },
        { question: 'What does clamp(2rem, 5vw, 4rem) provide?', options: ['A value that can never change', 'A value that grows between a minimum and maximum', 'A fixed 5 pixel border', 'A colour gradient'], answer: 1, explanation: 'clamp() constrains a preferred fluid value between a minimum and maximum.' }
      ],
      references: [
        { label: 'MDN: CSS values and units', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units' },
        { label: 'MDN: CSS custom properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties' },
        { label: 'W3C WAI: Understanding contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' }
      ]
    },
    {
      slug: 'box-model-and-spacing',
      title: 'The box model and spacing',
      summary: 'Understand content, padding, borders and margins so elements size and align predictably.',
      minutes: 16,
      objectives: [
        'Explain the four parts of the CSS box model.',
        'Use box-sizing to make sizing easier to reason about.',
        'Control spacing with padding, margin and gap.',
        'Avoid accidental overflow from fixed dimensions.'
      ],
      sections: [
        {
          title: 'Every element is laid out as a box',
          body: 'The CSS box model describes an element as content surrounded by padding, border and margin. Content is the text, image or child content. Padding creates space inside the border. Border surrounds the padding and content. Margin creates space outside the border and separates the element from neighbours. Backgrounds generally paint through the content and padding areas, subject to background clipping.'
        },
        {
          title: 'Use border-box sizing deliberately',
          body: 'With content-box, the declared width applies to the content box and padding and borders are added outside it. With border-box, the declared width includes content, padding and border. Many projects use a universal border-box rule because it makes component dimensions easier to predict. It does not remove margins from the calculation.',
          code: '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n.content-card {\n  width: 100%;\n  padding: 1.5rem;\n  border: 1px solid #dce3ef;\n}'
        },
        {
          title: 'Choose the right spacing tool',
          body: 'Padding creates internal breathing room. Margin separates an element from its surroundings. The gap property creates spacing between items in Flexbox and Grid layouts without adding margin to each child. Prefer a consistent spacing scale so the page feels deliberate. Logical properties such as padding-inline and margin-block adapt better to different writing directions than hard-coded left and right properties.'
        },
        {
          title: 'Let content determine height',
          body: 'Fixed heights can clip text when a user zooms, changes font size or has longer content. Prefer natural content height, min-height when a minimum is needed, and max-width to keep long lines comfortable. Use overflow intentionally and test the page with larger text and narrow viewports.',
          note: "Inspect a content card in developer tools and toggle padding, border and margin. Watch how the element's outer dimensions change."
        }
      ],
      exercise: {
        prompt: 'Create consistent content cards for the profile page using the box model.',
        requirements: [
          'Apply border-box sizing to all elements and pseudo-elements.',
          'Give cards internal padding and a visible border.',
          'Use a consistent gap between cards.',
          'Use max-width for the content wrapper instead of a fixed page width.',
          'Avoid fixed heights on text containers.'
        ],
        solution: '*, *::before, *::after { box-sizing: border-box; }\n.page-shell { width: min(100% - 2rem, 70rem); margin-inline: auto; }\n.content-list { display: grid; gap: 1.25rem; }\n.content-card { padding: 1.5rem; border: 1px solid #dce3ef; border-radius: 1rem; }'
      },
      quiz: [
        { question: 'Which box-model area creates space between content and its border?', options: ['Margin', 'Padding', 'Outline', 'Gap only'], answer: 1, explanation: 'Padding is the internal space between the content and the border.' },
        { question: 'What does box-sizing: border-box do to a declared width?', options: ['Includes padding and border in that width', 'Includes margin in that width', 'Removes the content', 'Forces a fixed height'], answer: 0, explanation: 'With border-box, the declared width includes the content, padding and border.' }
      ],
      references: [
        { label: 'MDN: The box model', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model' },
        { label: 'MDN: CSS box-sizing', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing' }
      ]
    },
    {
      slug: 'flexbox-layout',
      title: 'Flexbox: align page components',
      summary: 'Arrange navigation, profile details and groups of controls along a flexible axis.',
      minutes: 18,
      objectives: [
        'Explain the main axis and cross axis in Flexbox.',
        'Use display flex, justify-content and align-items.',
        'Control wrapping, gaps and flexible item sizing.',
        'Choose Flexbox for one-dimensional component layouts.'
      ],
      sections: [
        {
          title: 'Flexbox solves one-dimensional layout problems',
          body: 'Flexbox lays out items along one main axis at a time: a row or a column. The cross axis is perpendicular to the main axis. The direction is controlled by flex-direction. Flexbox is useful for a navigation bar, a row of profile actions, or aligning an avatar and a block of text. It is not necessary to use it for every element on the page.'
        },
        {
          title: 'Align and distribute items',
          body: 'justify-content distributes items along the main axis. align-items aligns items along the cross axis. The gap property creates consistent space between flex items. When flex-direction changes from row to column, the axes change too, so the meaning of justify-content and align-items follows the new direction.',
          code: '.site-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\n.site-nav {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}'
        },
        {
          title: 'Allow items to wrap',
          body: 'A row that fits on a wide screen may not fit on a narrow screen. flex-wrap: wrap lets items move onto another line instead of forcing overflow. Flex items can grow or shrink, and flex-basis provides an initial main-size suggestion. Use min-width: 0 when a flex child needs permission to shrink below its min-content size, especially when it contains long text.'
        },
        {
          title: 'Choose Flexbox for the right relationship',
          body: 'Flexbox is strongest when the layout is primarily a row or column and the items need to distribute or align within that axis. If you need precise rows and columns together, CSS Grid may be a better fit. Real layouts often combine both: Grid for the overall page and Flexbox for navigation or a card header.',
          note: 'In the shared project, style the profile header so the site name and navigation sit on one row on wider screens and wrap cleanly on narrow screens.'
        }
      ],
      exercise: {
        prompt: 'Build a flexible header and profile action row for the existing page.',
        requirements: [
          'Set the header to display flex.',
          'Align its children vertically and distribute them with space-between.',
          'Use gap instead of adding margins to every navigation link.',
          'Allow navigation items to wrap when space is limited.'
        ],
        solution: '.site-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }\n.site-nav { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }'
      },
      quiz: [
        { question: 'Which property distributes flex items along the main axis?', options: ['align-items', 'justify-content', 'font-weight', 'border-radius'], answer: 1, explanation: 'justify-content aligns and distributes items along the main axis.' },
        { question: 'What does flex-wrap: wrap allow?', options: ['Items to move onto another line', 'Text to become bold', 'The parent to become a grid', 'The page to zoom'], answer: 0, explanation: 'Wrapping allows flex items to flow onto additional lines when needed.' }
      ],
      references: [
        { label: 'MDN: Basic concepts of Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox' },
        { label: 'MDN: Aligning items in a flex container', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container' }
      ]
    },
    {
      slug: 'css-grid-layout',
      title: 'CSS Grid: build two-dimensional layouts',
      summary: 'Create responsive columns and content grids for the interests and project sections.',
      minutes: 18,
      objectives: [
        'Explain Grid containers, tracks and grid items.',
        'Define columns with fr units and repeat().',
        'Use minmax() and auto-fit for adaptable card grids.',
        'Combine Grid with Flexbox for component-level alignment.'
      ],
      sections: [
        {
          title: 'Grid handles rows and columns together',
          body: "CSS Grid is a two-dimensional layout system. Set display: grid on a container and its direct children become grid items. Grid tracks are rows or columns. You can define explicit tracks, allow implicit tracks to be created, and control spacing with row-gap, column-gap or gap. Grid is useful for a profile page's interests, project cards or a structured content area."
        },
        {
          title: 'Flexible tracks with fr',
          body: 'The fr unit represents a share of the available space in the grid container after fixed sizing and gaps are accounted for. repeat() avoids repeating the same track definition. A two-column layout can use repeat(2, minmax(0, 1fr)); minmax() sets a lower and upper sizing function so tracks can shrink without overflowing.',
          code: '.interest-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 1rem;\n}\n\n.interest-card {\n  padding: 1rem;\n  border: 1px solid #dce3ef;\n  border-radius: 1rem;\n}'
        },
        {
          title: 'Let the browser fit as many cards as possible',
          body: 'For a flexible card collection, repeat(auto-fit, minmax(min(100%, 15rem), 1fr)) lets the browser create as many columns as fit while preserving a minimum card width. auto-fit collapses empty tracks after placement, allowing existing tracks to expand. This pattern can make a grid responsive without writing a media query for every breakpoint.'
        },
        {
          title: 'Place larger regions when needed',
          body: 'Grid items can span multiple columns or rows with grid-column and grid-row. Named grid areas can make a larger page layout easier to understand. Use explicit placement only when it improves the design; a simple auto-placement grid is often more robust when content length changes.',
          code: '.interest-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}'
        }
      ],
      exercise: {
        prompt: 'Turn the interests section of the same profile page into a responsive card grid.',
        requirements: [
          'Use display grid on the interests container.',
          'Use repeat() and minmax() for adaptable columns.',
          'Set a consistent gap between cards.',
          'Ensure a card can shrink to the available width on a narrow screen.'
        ],
        solution: '.interest-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}\n.interest-card { min-width: 0; padding: 1.25rem; }'
      },
      quiz: [
        { question: 'Which layout system is designed for rows and columns together?', options: ['Float', 'CSS Grid', 'Text-align', 'Position absolute'], answer: 1, explanation: 'CSS Grid is a two-dimensional layout system for rows and columns.' },
        { question: 'What does the fr unit represent in Grid?', options: ['A fixed number of pixels', 'A fraction of available space', 'The root font size', 'A viewport height'], answer: 1, explanation: 'fr distributes a share of available space in the grid container.' }
      ],
      references: [
        { label: 'MDN: Basic concepts of Grid layout', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout' },
        { label: 'MDN: Auto-placement in Grid', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout' }
      ]
    },
    {
      slug: 'responsive-design-and-media-queries',
      title: 'Responsive design and media queries',
      summary: 'Make the same profile website comfortable to use on phones, tablets and larger screens.',
      minutes: 20,
      objectives: [
        'Explain fluid layouts and responsive design.',
        'Use media queries when a layout needs a breakpoint.',
        'Prefer content-driven breakpoints over device names.',
        'Test layouts at narrow widths and with zoomed text.'
      ],
      sections: [
        {
          title: 'Responsive design is a set of techniques',
          body: 'Responsive design is not a separate mobile website. It combines fluid layouts, flexible images, relative sizing and media queries so one document adapts to different viewport sizes and user settings. Start with content that can naturally flow, then add constraints where they improve readability. Avoid assuming that a particular device always has a particular width.'
        },
        {
          title: 'Start with a flexible foundation',
          body: 'Use max-width to limit long lines while allowing the page to shrink. Use width: 100% on media within their containing block and height: auto to preserve aspect ratio. Grid and Flexbox can wrap or reflow. The viewport meta element in the HTML head tells mobile browsers to use the device width as the layout viewport.',
          code: 'img,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n.page-shell {\n  width: min(100% - 2rem, 70rem);\n  margin-inline: auto;\n}'
        },
        {
          title: 'Use media queries for real layout changes',
          body: 'A media query applies styles when its condition matches, for example when the viewport is at least 48rem wide. Choose a breakpoint when the content begins to feel cramped or when a layout can usefully change. A mobile-first stylesheet starts with the narrow layout and adds enhancements at wider sizes. This usually keeps the base styles simpler.',
          code: '.profile-layout {\n  display: grid;\n  gap: 1.5rem;\n}\n\n@media (min-width: 48rem) {\n  .profile-layout {\n    grid-template-columns: 2fr 1fr;\n    align-items: start;\n  }\n}'
        },
        {
          title: 'Test beyond one device preset',
          body: 'Resize the browser gradually and look for awkward wrapping, horizontal scrolling, clipped controls and overly long lines. Test at 200% zoom and with larger text. A page that fits one phone preset can still fail at an intermediate width. Let content determine breakpoints and do not hide important information merely because the viewport is narrow.',
          note: 'Test your profile project at approximately 360px, 768px and 1280px wide. These are useful test widths, not mandatory device breakpoints.'
        }
      ],
      exercise: {
        prompt: 'Make the existing profile website adapt from a single-column mobile layout to a wider desktop layout.',
        requirements: [
          'Use a fluid page wrapper with a maximum width.',
          'Make images scale within their containers.',
          'Keep the base layout usable on narrow screens.',
          'Add a media query that creates a two-column layout when the content has room.',
          'Check for horizontal overflow at narrow widths.'
        ],
        solution: 'img { max-width: 100%; height: auto; }\n.page-shell { width: min(100% - 2rem, 70rem); margin-inline: auto; }\n.profile-layout { display: grid; gap: 1.5rem; }\n@media (min-width: 48rem) {\n  .profile-layout { grid-template-columns: 2fr 1fr; }\n}'
      },
      quiz: [
        { question: 'What is a good reason to add a media query breakpoint?', options: ['A popular phone model was released', 'The current content layout becomes cramped and needs to change', 'Every page must have exactly three breakpoints', 'To replace semantic HTML'], answer: 1, explanation: 'Breakpoints should be chosen when the content and layout need a meaningful change.' },
        { question: 'What does max-width: 100% help prevent on an image?', options: ['The image becoming too small', 'The image overflowing its containing block', 'The image loading', 'The image having alternative text'], answer: 1, explanation: 'It prevents the image from becoming wider than its containing block.' }
      ],
      references: [
        { label: 'MDN: Responsive design', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design' },
        { label: 'MDN: Using media queries', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries' }
      ]
    },
    {
      slug: 'accessible-styling-and-debugging',
      title: 'Accessible styling and CSS debugging',
      summary: 'Finish the design with visible focus, readable contrast, reduced motion and a reliable debugging workflow.',
      minutes: 18,
      objectives: [
        'Keep keyboard focus visible for interactive elements.',
        'Check text and control contrast.',
        'Respect reduced-motion preferences.',
        'Use developer tools to diagnose layout and cascade issues.'
      ],
      sections: [
        {
          title: 'Visual design must support different ways of using a page',
          body: 'A visually polished interface still needs to work with a keyboard, zoom and assistive technology. Do not remove the browser focus outline without providing a clear replacement. Ensure interactive controls have visible hover and focus states, and do not communicate meaning through colour alone. Text should remain readable against its background.'
        },
        {
          title: 'Respect focus and contrast',
          body: 'Use :focus-visible to provide a clear focus indicator when keyboard interaction needs it. Check normal text against WCAG contrast guidance and ensure controls and meaningful graphical objects have sufficient contrast where required. Placeholder text is not a substitute for a label, and low-contrast muted text can be difficult to read.',
          code: 'a:focus-visible,\nbutton:focus-visible,\ninput:focus-visible,\ntextarea:focus-visible {\n  outline: 3px solid #f59e0b;\n  outline-offset: 3px;\n}\n\nbody {\n  color: #17213b;\n  background: #ffffff;\n}'
        },
        {
          title: 'Respect reduced motion preferences',
          body: 'Animations and transitions can help explain state changes, but unnecessary motion can distract or cause discomfort. Use the prefers-reduced-motion media feature to reduce or remove non-essential motion for people who request it. Do not make essential information available only through an animation.',
          code: '@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}'
        },
        {
          title: 'Debug with a repeatable method',
          body: 'When a layout breaks, inspect the element and identify its containing block, computed dimensions and matching rules. Check whether a parent has unexpected display, width, overflow or positioning. Temporarily disable declarations to isolate the cause, then make the smallest clear change in the stylesheet. Test the result at more than one viewport width and with keyboard navigation.',
          note: "Use the browser's accessibility and contrast tools as helpers, not as a replacement for testing the page with a keyboard and real content."
        }
      ],
      exercise: {
        prompt: 'Complete a final accessibility and debugging pass on the profile website.',
        requirements: [
          'Add visible focus-visible styles to links, buttons and form controls.',
          'Check foreground and background contrast for body text and muted text.',
          'Add a reduced-motion media query for non-essential transitions.',
          'Test keyboard navigation from the top of the page to the contact form.',
          'Check the layout at narrow and wide viewport sizes.'
        ],
        solution: 'a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {\n  outline: 3px solid #f59e0b;\n  outline-offset: 3px;\n}\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}'
      },
      quiz: [
        { question: 'Why should you avoid removing focus outlines without a replacement?', options: ['It changes the HTML title', 'Keyboard users may lose the visible location of focus', 'It makes CSS invalid', 'It prevents images loading'], answer: 1, explanation: 'A visible focus indicator helps keyboard users understand which interactive element is active.' },
        { question: 'Which media feature can detect a user preference for reduced motion?', options: ['max-width', 'prefers-reduced-motion', 'orientation', 'hover'], answer: 1, explanation: 'prefers-reduced-motion allows styles to respond to a user setting that requests less motion.' }
      ],
      references: [
        { label: 'W3C WAI: Understanding focus visible', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html' },
        { label: 'W3C WAI: Understanding contrast minimum', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' },
        { label: 'MDN: prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' }
      ]
    }
  ]
};
