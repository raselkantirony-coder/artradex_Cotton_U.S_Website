# AR Tradex LLC — Premium Corporate Website

A responsive multi-page website for U.S. raw cotton trading and Bangladesh textile-market partnerships. Built with HTML5, CSS3, Bootstrap 5, JavaScript, jQuery and a small PHP enquiry endpoint.

## Included
- Premium navy / blue / gold visual system and animated cotton-trade hero
- Responsive navigation, scroll progress, parallax depth, reveal animations and reduced-motion support
- Pages for company, Bangladesh market, U.S. raw cotton, quality, partnership framework, mill requirements, supply chain, apparel/home textiles, sustainability, company profile, contact, enquiry, privacy and terms
- Business enquiry forms that POST to `submit-enquiry.php`
- Enquiries saved to `storage/enquiries.jsonl`; the folder is protected by `.htaccess` on Apache servers
- Optional email notification using PHP `mail()`

## Run locally
1. Install PHP 8+ (XAMPP is suitable on Windows).
2. Copy this folder into your XAMPP `htdocs` directory.
3. Open `http://localhost/artradex-premium/` (or the folder name you use).
4. Submit a test form and confirm a record is written to `storage/enquiries.jsonl`.

## Before client submission / production
1. Confirm the real company email, phone, office address, official logo and social links with the client. This draft deliberately avoids publishing invented phone numbers or unverified contact details.
2. Copy `config.example.php` to `config.php`. Add a real monitored inbox and a sender address on a verified domain. Email notifications require PHP mail to be configured on the server; the form still stores submissions when email is not configured.
3. Ensure `storage/` is outside the public web root where possible. The included `.htaccess` protects it on Apache, but `.htaccess` does not protect files on every server type. Restrict access at server level and set appropriate file permissions before production.
4. Configure HTTPS, backups, spam/rate limiting and the final privacy notice for the actual hosting jurisdiction.
5. Confirm image licensing and replace draft imagery with properly licensed final brand photography before production.

## Easy edits
- Main styling: `css/style.css`
- Interactions and form UX: `js/main.js`
- Images and logo: `assets/`
- Page content: each `.html` file
- Form processing: `submit-enquiry.php`

## Important
This is a website starter project, not a legal or trade-compliance certification. All commercial terms, product specifications, Incoterms and payment conditions should be approved by AR Tradex LLC before publication.
