---
name: FRAGANTI Vercel config
description: How PORT and BASE_PATH must be handled in vite.config.ts for both Replit dev and Vercel production builds
---

In the FRAGANTI vite.config.ts, both PORT and BASE_PATH must be optional with safe defaults:
- `const rawPort = process.env.PORT ?? '5173';` — never throw if PORT is absent
- `const basePath = process.env.BASE_PATH ?? './';` — never throw if BASE_PATH is absent

**Why:** Vercel's build pipeline runs `vite build` without setting PORT or BASE_PATH. If the config throws on missing variables, the build fails with "variable required" errors even though those variables are only needed at dev/runtime.

**How to apply:** Any new react-vite artifact that needs Vercel deployment must use the `?? defaultValue` pattern for env vars in vite.config.ts, not conditional throws.

vercel.json at workspace root:
```json
{
  "framework": "vite",
  "outputDirectory": "artifacts/fraganti/dist/public",
  "buildCommand": "pnpm --filter @workspace/fraganti run build",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

vercel.json at artifacts/fraganti/:
```json
{
  "framework": "vite",
  "outputDirectory": "dist/public",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
