# NO SIGNAL — Admin Security Fix v1

This patch replaces the browser-only admin password with server-side Cloudflare Pages authentication backed by D1 sessions. It also moves admin product/order/settings actions behind authenticated API endpoints.

## Deploy
1. Copy these files/folders into the root of your existing `no-signal-store` repo, replacing files with the same paths. Do not delete your existing `functions/api/ceeprinto.js` or `functions/api/health.js`.
2. Commit and push to `main`.
3. Set the production secret `ADMIN_PASSWORD` for the Pages project.
4. Apply the included D1 migration remotely.
5. Redeploy Pages.

Cloudflare commands:

`npx wrangler pages secret put ADMIN_PASSWORD --project-name no-signal`

`npx wrangler d1 migrations apply no-signal-db --remote`

Use a new strong admin password when prompted. Do not put it in `app.js`, `store.js`, GitHub, or `wrangler.toml`.

The frontend can no longer grant itself admin access: the server requires a valid HttpOnly session cookie for admin endpoints.
