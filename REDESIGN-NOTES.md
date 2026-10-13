# B Tecky homepage refresh

This source update is a visual/content refresh for the current static site. It is designed to be committed to the existing private GitHub repository connected to Vercel.

## Included
- Product-first hero and featured product cards.
- Honest early-stage venture positioning; removed automation-work positioning from the homepage and About page copy.
- Moved the service/what-we-do explanation below the founder story.
- Removed oversized duplicate Arcade tool panels from the homepage; the tools remain accessible from their dedicated pages and product cards.
- Founder portrait and updated founder story on the homepage.
- Locally hosted editorial SVG cover art for blog cards, with no external image service dependency.
- Stronger product and partner card styling, plus an animated values ribbon. It does not invent customer testimonials.
- Simplified homepage footer to avoid repeating the social link cluster.
- Relationship labels on the home partner showcase are more careful and do not describe every ecosystem organization as a formal collaboration.

## Not represented as complete
- Shared, persistent blog view counts across visitors/devices are not implemented. That requires a backend endpoint plus a persistent database or counter service; browser-only counts would not behave like YouTube and would be misleading.
- YouTube comments are not scraped or fabricated. Genuine comments can be added after selecting and permission-checking suitable public comments and confirming an API/backend approach.
- The existing YouTube API / Netlify Function migration to Vercel still needs to be completed and tested separately.
- AdSense account approval, publisher verification and ad serving cannot be guaranteed by static site changes alone.

## Deploy
1. Back up the current project folder.
2. Replace the local source files with this ZIP's contents (keep the directory structure).
3. Test locally if possible.
4. Commit and push to the existing private GitHub repository's `main` branch. Vercel should create a new deployment automatically.
5. Verify the deployment before promoting it to the production domain.
