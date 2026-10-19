# GTM in Motion — Enterprise Launch & Next.js Migration Architecture

This repository contains both:
1. **The Production-Ready Static Site** with custom CSS, interactive workflow animations, and an enterprise lead-capture system (located in the root directory).
2. **The Turnkey Next.js + Tailwind CSS Migration Blueprint** (located in `/nextjs-blueprint`), ready to deploy whenever the agency needs dynamic routes, a CMS, or client authentication.

---

## 1. Quick Start: Launching the Static Site Immediately

### Local Development Preview
Run the included zero-dependency Node server:
```bash
npm start
# or: node server.js
```
The site will run at **`http://localhost:3000`**.

### Verifying Static Assets & Form Ingestion
The local server automatically serves static assets with correct MIME types and mounts the `/api/enquiry` lead capture endpoint.
Test the endpoint with:
```bash
npm test
```
All enquiries submitted locally are logged to the console and saved to **`leads.json`**.

---

## 2. Real Lead-Capture Form Architecture

The form has been upgraded from a basic `mailto:` demo into an enterprise-grade lead capture engine:

| Feature | Implementation | Purpose |
| :--- | :--- | :--- |
| **Silent Honeypot** | `input[name="_gotcha"]` | Discards automated spambots with zero friction for humans. |
| **Attribution Capture** | UTM URL parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) + `referrer` | Stored in `sessionStorage` and attached to lead payloads to track ROI on LinkedIn / search campaigns. |
| **Work Email Heuristic** | Real-time domain listener | Softly prompts enterprise prospects to use business email domains without hard-blocking valid submissions. |
| **Asynchronous Submission** | Fetch POST to `/api/enquiry` (or Formspree/Web3Forms/Basin) | Seamless in-page submission without page reloads. |
| **Resilient Zero-Loss Fallback** | Automatic `mailto:` recovery link | If any network drop or serverless timeout occurs, a pre-populated email modal is offered with all user input intact. |
| **Immediate Team Alerts** | Environment variables `SLACK_WEBHOOK_URL` & `CRM_WEBHOOK_URL` | Posts formatted cards into Slack channels and triggers CRM workflows (HubSpot / Salesforce / Zapier). |

### Optional Static-Only Form Services
If hosting on basic storage (such as AWS S3 or GitHub Pages) without serverless functions, open `script.js` and set:
```javascript
const FORM_CONFIG = {
  endpoint: '/api/enquiry',
  // Simply paste your endpoint from Formspree, Basin, or Web3Forms:
  staticProviderEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  teamEmail: 'hello@gtminmotion.com'
};
```

---

## 3. Production Deployment Options

### Option A: Vercel (Recommended)
1. Push this folder to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. The included `vercel.json` and `api/enquiry.js` are auto-detected.
4. Add environment variables in Vercel Dashboard:
   - `SLACK_WEBHOOK_URL`: (Optional) Your Slack incoming webhook.
   - `CRM_WEBHOOK_URL`: (Optional) Your Zapier/HubSpot webhook.
5. Point DNS for `gtminmotion.com` (A / CNAME records) to Vercel.

### Option B: Netlify
1. Connect repository to [Netlify](https://netlify.com).
2. The included `netlify.toml` handles redirects and the `api/enquiry.js` function.
3. Configure custom domain with free Let's Encrypt SSL.

### Option C: Cloudflare Pages
1. Deploy as static site.
2. Route form directly to a Cloudflare Worker or third-party form handler.

---

## 4. Enterprise Inbound Playbook: Getting First Enquiries Flowing

To generate high-value enterprise pipeline from day one:

1. **Sub-15 Minute Response SLA**:
   Enterprise buyers inquiring about AI automation or GTM systems have high purchase intent. Set up the `SLACK_WEBHOOK_URL` so your team receives instant mobile notifications.
2. **Tailored Discovery Follow-up**:
   Reference the user's selected priority (`AI agents & automation`, `GTM strategy & architecture`, etc.) in the first response email:
   > *"Hi [Name], saw your note regarding [Priority] at [Company]. We recently architected a similar signal-to-execution pipeline for a B2B SaaS company facing [Challenge]. Let's jump on a 20-minute architecture review this Thursday."*
3. **LinkedIn Account-Based Inbound Strategy**:
   Share high-signal teardowns of broken enterprise RevOps workflows on LinkedIn, linking to `https://gtminmotion.com/?utm_source=linkedin&utm_medium=post&utm_campaign=gtm_teardown`.

---

## 5. Next.js & Tailwind CSS Migration Blueprint

### When to Migrate
Migrate from the static version to Next.js + Tailwind when you need:
- **Dynamic Content**: `/case-studies/[slug]` or `/insights/[slug]` managed by a headless CMS (Sanity, Contentful, or MDX).
- **Interactive Calculators**: Dynamic GTM Pipeline ROI calculator or RevOps maturity assessment tools.
- **Client Portal**: Authenticated dashboards where clients review GTM blueprints and live agent logs.
- **A/B Testing**: Edge-rendered variant experiments.

### Migration Structure (Included in `/nextjs-blueprint`)
The pre-built Next.js blueprint matches the exact custom CSS design tokens:

```
nextjs-blueprint/
├── app/
│   ├── api/enquiry/route.ts      # App Router POST handler
│   ├── layout.tsx                # Manrope + DM Sans font optimization
│   ├── page.tsx                  # Tailwind-styled landing page
│   └── globals.css               # Core CSS variables and animations
├── components/
│   └── LeadForm.tsx              # React client component with honeypot & UTMs
├── tailwind.config.ts            # Custom design tokens (#10191B, #D5EE83, etc.)
└── package.json                  # Next.js 15 + Tailwind dependencies
```

### Steps to Run the Next.js Blueprint:
1. Navigate to `nextjs-blueprint`:
   ```bash
   cd nextjs-blueprint
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Copy `favicon.svg` into `nextjs-blueprint/public/`.

