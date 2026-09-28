# NO SIGNAL — Production Foundation v1.0

This package keeps the existing NO SIGNAL visual design and adds the production foundation needed to move from a browser-only prototype to a real store.

## Included
- Existing NO SIGNAL storefront and animations
- Existing logo assets
- SEO metadata
- robots.txt + sitemap starter
- Cloudflare Pages configuration
- Cloudflare D1 database schema
- API routes for health, products and orders
- Server-side CeePrinto adapter placeholder
- Environment-variable template

## Important
The CeePrinto adapter deliberately does NOT invent API endpoints or payload fields. CeePrinto currently advertises a REST API/headless option for custom storefronts, but the exact authenticated API contract must be obtained for the seller account before live order submission. See: https://ceeprinto.com/integration-guide/

## Deployment sequence
1. Create a GitHub repository and upload this folder.
2. Create a Cloudflare Pages project connected to that GitHub repository.
3. Create a Cloudflare D1 database named `no-signal-db` and put its ID in `wrangler.toml`.
4. Apply `schema.sql` to the D1 database.
5. Add `SITE_URL` and other secrets in Cloudflare. Never commit `.env` or API tokens.
6. Test `/api/health` and `/api/products`.
7. Connect your custom domain in Cloudflare Pages.
8. Replace the placeholder domain in `robots.txt` and `sitemap.xml` with the real domain.
9. Add the domain to Google Search Console and submit `/sitemap.xml`.
10. Obtain the CeePrinto REST API credentials/contract for your seller account, then map the exact order payload in `functions/api/ceeprinto.js`.
11. Add the chosen online payment provider only after its merchant account and server-side API details are available.
12. Run a complete test order before accepting real customer orders.

## Current limitation
The original storefront still contains browser-local cart/admin/demo order behavior. The new API and database foundation is ready, but the frontend should not be treated as a live production checkout until the authentication, database-backed product/admin UI, payment flow and CeePrinto order submission are fully wired and tested.
