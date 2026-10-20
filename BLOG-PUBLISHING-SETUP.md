# B Tecky blog library refresh

This package merges the existing B Tecky site with the supplied `blog.zip` posts, adds 50 new evergreen guides, and updates the blog library with search, category filters, video thumbnails, and static article pages. Phone-centric Apple news is excluded from the visible blog index to match the requested editorial direction. Existing imported campaign articles retain their source wording; time-sensitive campaign details should be rechecked against official sources before future updates.

## Blog authoring workspace on Vercel

The writing workspace is `/write-lavii-9f21k2/`. It publishes by committing `blog/posts.json` and the generated article HTML to the private GitHub repository. A successful save triggers the normal Vercel Git deployment.

Before using the publisher, add these **Production** environment variables in Vercel Project → Settings → Environment Variables:

- `BLOG_ADMIN_PASSWORD`: a long unique passphrase.
- `GITHUB_TOKEN`: a fine-grained GitHub personal access token limited to repository `lavishsheth/Btecky`, with **Contents: Read and write** permission. Keep it secret and never put it in browser code or commit it.
- Optional: `GITHUB_OWNER=lavishsheth`, `GITHUB_REPO=Btecky`, `GITHUB_BRANCH=main`.

After adding environment variables, redeploy. If the writer reports that a variable is missing, configure it in Vercel and redeploy. The editor is intentionally not linked from the main navigation, but a hidden URL is not a security boundary; the server-side password and private token are required.

## How video thumbnails work

Paste a YouTube watch/share URL in the editor. The editor extracts the video ID, uses the YouTube thumbnail as the blog card cover, and adds a YouTube link and embed on the article page. The article can still be published without a video.

## Blog content

The 50 additional posts are evergreen practical guides across AI, Python, Java, machine learning, data science, cloud, DevOps, cybersecurity, web development, CS fundamentals, and education/career skills. They are not presented as breaking-news reporting. Review each article for your voice, accuracy, and originality before promoting it.
