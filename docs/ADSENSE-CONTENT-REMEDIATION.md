# AdSense content-quality remediation

This is the editorial workflow for improving B Tecky's usefulness and originality. It is not a promise of AdSense approval.

## What changed in this first batch

Five short evergreen guides were expanded in `blog/posts.json`:

- Spring Boot configuration profiles and externalized settings
- Database transactions and ACID
- Core Web Vitals
- JavaScript Promises and async/await
- JavaScript modules

Each revised guide now includes a concept explanation, practical examples, implementation guidance, common mistakes, a hands-on exercise, and links to primary documentation. The article slugs and URLs are unchanged.

## Audit all published posts

Run:

```bash
npm run audit:blog
```

The audit writes `reports/blog-content-audit.md`. It flags thin bodies, missing or short summaries, repeated titles or summaries, absent visible references, and time-sensitive opportunity posts that need verification. It does not automatically alter, hide, delete, or noindex pages.

The word-count bands are internal triage signals only. Google does not publish a minimum article length. A concise page can be valuable; a long page can still be low-value if it repeats generic material.

## Editorial standard for every article

1. Identify the reader and the exact problem the article solves.
2. Explain the concepts in original language and define unfamiliar terms.
3. Include a realistic worked example, code, commands, comparison, or decision framework when relevant.
4. Explain limitations, edge cases, security considerations, and common mistakes.
5. Verify technical claims against current official documentation; date and verify event details against the organizer's official page.
6. Link to sources that directly support factual claims. Do not invent citations, test results, screenshots, or personal experience.
7. Add a practical exercise or checklist so the reader can apply the material.
8. Remove generic filler, repeated introductions, keyword stuffing, and duplicated sections.
9. Check the rendered page, mobile layout, links, code blocks, and accessibility.
10. Decide whether overlapping pages should be improved individually or consolidated.

## Event and opportunity posts

Treat these as time-sensitive records, not evergreen promotional copy. Include the organizer, official application URL, eligible audience and geography, opening and closing dates with timezone where known, costs, selection criteria, reward conditions, and the date last verified. Clearly separate guaranteed benefits from competitive or conditional rewards. Mark expired opportunities accurately and avoid urgency language after a deadline.

## AdSense review readiness

Before requesting another review:

- Review every published URL surfaced by the audit; do not assume the flagged list is the only issue.
- Fix or consolidate thin and substantially overlapping pages.
- Verify every public page has a useful purpose and working navigation.
- Check important pages on mobile and desktop.
- Confirm About, Contact, Privacy, Terms, and other relevant disclosures are accurate and reachable.
- Check that Google can crawl the pages and that no accidental `noindex`, login wall, or robots block prevents access.
- Revisit the AdSense programme policies and submit for review only after the editorial work is complete.

## Official guidance

- [AdSense content and user experience](https://support.google.com/adsense/answer/10015918)
- [AdSense programme policies](https://support.google.com/adsense/answer/9335564)
- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
