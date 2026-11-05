# Blog article experience and editorial standard

The public Astro article route is `src/pages/blog/[slug].astro`. It uses the existing catalogue at `blog/posts.json`; published slugs remain unchanged.

## Reader experience included in the article template

- Breadcrumbs link readers back to the home page and Journal.
- A reading-time estimate, publication date and author byline appear near the title.
- A reading progress indicator follows the article body.
- A section roadmap is generated from the article's actual H2 headings. It is a navigation aid, not a substitute for a topic-specific technical diagram.
- The table of contents links directly to H2 sections.
- Code blocks have a copy control.
- A short active-learning checklist encourages readers to explain the concept, recreate an example and test a limitation.
- The author card uses the author and biography in `blog/posts.json` settings and links to the About page.
- Related articles are selected from shared tags; older/newer navigation follows the published catalogue.
- Article JSON-LD supplies the headline, description, publication date when available, author and publisher.

## Authoring original visuals

Use a diagram when it explains something that prose alone makes difficult to follow: a request lifecycle, system architecture, decision tree, data flow, security boundary or comparison.

Preferred formats:
- An original SVG stored under `public/assets/images/blog-diagrams/` for crisp, responsive diagrams.
- A locally created PNG/WebP when a diagram needs raster rendering.
- A Markdown image in the article body with descriptive alt text and a caption.

Every visual must be specific to the article, accurately labelled, readable on mobile and created or licensed for B Tecky. Do not use decorative stock imagery as a substitute for an explanatory diagram. The generated section roadmap is only an overview of the article's structure.

Example Markdown:

```md
![Request lifecycle from browser to application server and database](/assets/images/blog-diagrams/request-lifecycle.svg)

*Figure 1. A request moves through validation, application logic and persistence before a response is returned.*
```

## Internal linking

- Add links at the point where a reader would naturally need the next explanation.
- Prefer links to a specific B Tecky article, tool, official source or learning path over generic "click here" wording.
- Use related-article cards as supplementary discovery, not as a replacement for contextual links.
- Keep related article tags accurate. The template only recommends published posts with at least one shared tag.
- Do not add links solely to increase page depth or create artificial link loops.

## Author and editorial transparency

- Keep the author name and biography in `blog/posts.json` settings accurate and current.
- Use the About page for the founder/team profile and the editorial identity of B Tecky.
- Do not claim expert review, testing, first-hand experience or credentials unless those activities actually occurred.
- For technical content, link primary documentation and test examples before publication.
- For event or offer posts, identify the organizer, eligibility, dates, terms and last-verified date; update or clearly mark expired information.

## Interactive learning

- Code examples support a copy action so readers can try them in their own development environment.
- The active-learning checklist is a lightweight reflection exercise, not a graded quiz and not a claim that the reader has mastered the topic.
- When adding a richer interactive example, make it directly relevant to the article, explain its inputs and outputs, include limitations, and ensure it works with keyboard and touch input.
- Never execute untrusted article-provided code on the visitor's device.

## Verification before publishing

1. Run `npm run check` and `npm run build`.
2. Open the article preview on desktop and mobile.
3. Test breadcrumbs, table-of-contents anchors, related links and previous/next links.
4. Copy at least one code block and test the active-learning checklist.
5. Check that the author profile, publication date, canonical URL, metadata and JSON-LD match the visible article.
6. Verify every external factual reference and every time-sensitive detail.

These improvements are intended to make the Journal more useful and navigable. They do not guarantee AdSense approval; site-wide policy compliance, originality, accuracy, usability and review remain necessary.
