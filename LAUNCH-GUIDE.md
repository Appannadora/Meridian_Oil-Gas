# MERIDIAN OIL & GAS — WEBSITE VERSION 2

A responsive, multi-page, interactive static website using Meridian's supplied SVG logos and user-provided presentation art. This is a **preview / counsel-review build**, not a live published website.

## Pages
- `index.html`: cinematic home, process tabs, featured education, field notes and newsletter
- `about.html`: company, principles and founder
- `operations.html`: Louisiana and California operating-region information, schematic geology
- `approach.html`: five-stage development philosophy
- `education.html`: searchable/filterable original articles and glossary
- `field-notes.html`: date-stamped November 7 Louisiana operational report
- `contact.html`: general business contact form
- `privacy.html`, `legal.html`, `thank-you.html`

## Local preview
Double-click `index.html`, or serve the folder locally with `python -m http.server 8000` and open `http://localhost:8000/`. For a proper preview, a browser with support for CSS and JavaScript is recommended. Subscription/contact forms intentionally cannot store submissions until deployed to a configured host.

## Publish on Netlify with Squarespace domain
1. Log in to Netlify; create a site by uploading the **contents of the folder** `meridian-site-v2` or the ZIP. Deploy the site to the Netlify-generated preview domain first.
2. Inspect the entire site and obtain counsel clearance before connecting the production domain.
3. In Netlify > Forms, verify form detection for `meridian-contact` and `meridian-dispatch`. Run test submissions.
4. In Netlify > Forms > Submission notifications, configure `sales@meridianoilandgas.com` for **contact form notifications**. Confirm the mailbox if Netlify requests verification.
5. Configure the `meridian-dispatch` list and campaign service separately. **Netlify stores form submissions; it is NOT an email newsletter service.** Do not begin newsletter campaigns until permission records, a compliant unsubscribe process, the actual data processor, and the privacy policy have been approved.
6. Keep domain registration at Squarespace if desired. In Squarespace's domain DNS settings, follow Netlify's exact instructions for the apex/root domain and `www`. Do not change MX, SPF, DKIM or DMARC records for `sales@meridianoilandgas.com` when updating website records.
7. Test HTTPS, `www` redirect, the real inbox, both forms, consent recording, mobile and accessibility before announcing launch.

## Optional email marketing setup
Brevo or Mailchimp are appropriate for permission-based educational mailing lists. Prefer a double-opt-in form provided by the email provider, hosted or embedded within the site. A newsletter sign-up is **not** investor eligibility, does not establish a pre-existing substantive relationship, and must never automatically release PPMs or offering materials.

## Important limitations / editorial controls
- No investments, offering documents, returns, ROI, tax deduction pitches, pricing, EB-5 immigration promotions, reserved units, or eligibility quizzes are present in public pages. This is intentional because current programs use 506(b).
- Site business information / article content require final review by counsel. A footer disclaimer does not by itself cure unlawful public securities solicitation.
- Visual hero and operations photos came from Meridian's user-supplied marketing files and may be illustrative, not actual field footage. Verify underlying media rights and replace with original site photography when possible.
- The November 7 report is **as-of that date**, not real-time operational reporting.
- Privacy policy is a **draft** and requires updating to reflect live hosting/marketing stack before collecting submissions.
- Two browser interactions (article filtering, expandable articles), the process tabs, mobile navigation, scroll reveals and progress bar work locally.
- Photo credits/licenses for user-supplied marketing artwork should be confirmed before publication.

## Technical notes
- Standard HTML/CSS/JS, no build step, no framework dependency, no exposed API keys.
- Exact logos are stored in `assets/meridian-logo-light.svg` and `assets/meridian-logo-dark.svg`.
- SVG and converted WebP images are served locally from `/assets`.
- Hard-coded email: `sales@meridianoilandgas.com`.

## Content reference sources (not investor marketing)
- U.S. EIA, Oil and Petroleum Products: https://www.eia.gov/energyexplained/oil-and-petroleum-products/
- U.S. EIA, Natural Gas: https://www.eia.gov/energyexplained/natural-gas/use-of-natural-gas.php
- U.S. EPA, Oil and Gas Extraction Effluent Guidelines: https://www.epa.gov/eg/oil-and-gas-extraction-effluent-guidelines
- SEC General Solicitation: https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/general-solicitation
- SEC Securities Act Interpretations, Q.256.23–256.26: https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/securities-act-rules
