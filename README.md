# B Tecky — business-first website

A static website for B Tecky, positioned around digital products, software development, automation and technology services. It preserves the blog, Arcade tools, playlists, contact and legal pages while simplifying the navigation.

## Deploy
- Static pages can be deployed on Vercel or Netlify.
- `netlify/functions/` and `netlify.toml` are Netlify-specific. The YouTube playlist API function requires `YOUTUBE_API_KEY` configured in Netlify.
- The static website does not require API keys for its basic pages.
- Do not commit API keys or other secrets to this repository.

## People and brand details
Founder & CEO / Development Lead: Lavish Sheth.
Software Engineer: Rohan Pawar (former Development Lead at B Tecky).

Brand relationships are described conservatively; inclusion of a logo does not imply endorsement or a formal commercial partnership.


## Blog library refresh

- Blog index: `/blog` (search + category filters)
- Private writer: `/write-lavii-9f21k2/`
- Publishing setup: see `BLOG-PUBLISHING-SETUP.md`
- Article content: `blog/posts.json` and static `blog/<slug>.html` files
- The writer uses a Vercel API route and a server-side GitHub token; it no longer relies on Netlify Functions for blog publishing.
