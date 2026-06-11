# People Power — Client

Plain React static site (Vite build → `dist/`). No server.

## Deploy on Render (Static Site)

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### SPA routing (one-time setup)

React Router needs every path to serve `index.html`. In Render → **Redirects / Rewrites**:

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | Rewrite |

Or deploy with [`render.yaml`](render.yaml) — the rewrite is included.

### Env var

Set **`VITE_API_URL`** to your backend URL (e.g. `https://people-power-server.onrender.com`) before build.

Backend **`CLIENT_URL`** must match this site URL.

## Local dev

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm run dev
```
