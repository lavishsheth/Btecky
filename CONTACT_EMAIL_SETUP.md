# Contact form email setup

The Contact page is served as a static Astro page. Its form posts to the Vercel serverless function at `/api/contact`; it does not use Netlify Forms.

## Required Vercel environment variables

Configure these for the B Tecky Vercel project (Production, Preview, and Development as appropriate):

- `RESEND_API_KEY`: API key from the Resend account.
- `RESEND_FROM_EMAIL`: A sender identity verified in Resend, for example `B Tecky <contact@btecky.tech>` after the domain `btecky.tech` has been verified with Resend.

The recipient is intentionally fixed in `api/contact.js` as `lavishsheth122@gmail.com`. The submitter's validated email is set as Reply-To, so replies go back to the person who contacted you.

## One-time setup

1. Create or sign in to a Resend account.
2. Verify the sending domain and complete the DNS records Resend requests. Do not use a made-up sender address.
3. Create an API key with permission to send email.
4. In Vercel, open the B Tecky project → Settings → Environment Variables.
5. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
6. Redeploy after the variables are saved.

Until these secrets are configured, the form deliberately shows a clear fallback message and the direct email link remains available. Never put the Resend API key in frontend code or commit it to Git.

## Test after deployment

1. Open `https://btecky.tech/contact`.
2. Submit a test message using an email address you can access.
3. Confirm it arrives at `lavishsheth122@gmail.com`.
4. Reply to the message and confirm Reply-To targets the submitter.
5. Check the Vercel Function logs if delivery fails.
