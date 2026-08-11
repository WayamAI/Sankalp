# PlanMaster AI: Wayam AI Rebrand, Login Polish, Orange Theme, Vercel Deploy

Date: 2026-08-11

## Context

`PlanMaster AI` is a Vite + React + shadcn/ui app (originally scaffolded by Lovable) currently
branded as "PlanForge AI" / "Joules to Watts", using the sidebar logo
`src/assets/jouletowatts_logo.png`. It has a demo-only `/login` route (`src/pages/Login.tsx`)
that accepts any input and simply navigates to `/`. The app's git history currently lives inside
a home-directory-wide repo (`~/`) pointed at an unrelated personal remote — this project needs its
own scoped repo pointed at `https://github.com/WayamAI/Planmaster.git`.

The user supplied 4 official Wayam AI logo SVGs:
- `Logo Main (Dark).svg` — for dark backgrounds (sidebar)
- `Logo Main (Light) - Wayam AI.svg` / `Logo Main - Wayam AI (light).svg` — for light backgrounds (login page); the two light files are effectively identical, use one
- `fav icon.svg` — square icon mark for the browser favicon

These use an orange gradient (`#FFA12B → #FA8D23 → #F0731A → #DC440C`), which becomes the basis
for the orange theme.

## Goals

1. Replace all "Joules to Watts" / "PlanForge AI" branding with **PlanMaster AI** (product) /
   **Wayam AI** (company), using the supplied logos.
2. Keep `/login` as demo-only auth (any email/password works, no backend), but add basic
   client-side validation (valid email shape, non-empty password) with inline orange-styled error
   text, and restyle it with the new logo/branding/colors.
3. Re-theme the app's primary/brand color tokens to orange, derived from the logo gradient.
4. Set up a git repo scoped to `PlanMaster AI/` only, remote `origin` →
   `https://github.com/WayamAI/Planmaster.git`, with small incremental commits pushed as work
   progresses.
5. Verify a clean production build, then deploy to Vercel production.

## Non-goals

- No real authentication/backend (explicitly deferred by user).
- No redesign of app pages/layout beyond swapping brand color tokens and logo/text references.
- No changes to the home-directory git repo other than leaving it untouched.

## Design

### 1. Logo assets
Copy the 4 source SVGs into `src/assets/brand/` inside the project (so they're versioned with the
app, not referenced from outside the repo):
- `logo-dark.svg` (from `Logo Main (Dark).svg`)
- `logo-light.svg` (from `Logo Main (Light) - Wayam AI.svg`)
- `favicon.svg` (from `fav icon.svg`)

Usage:
- `src/components/layout/AppSidebar.tsx`: replace `jouletowatts_logo.png` import/usage with
  `logo-dark.svg` (sidebar has a dark background).
- `src/pages/Login.tsx`: add the `logo-light.svg` mark above the heading; heading text becomes
  "PlanMaster AI", subtext "Wayam AI" small/muted beneath or beside the logo.
- `public/favicon.ico`: regenerate from `fav icon.svg` (rasterize to ICO/PNG) and reference it from
  `index.html`, replacing the current default Vite favicon reference.
- Any other literal occurrences of "Joules to Watts" / "PlanForge AI" in `src/` get swept to
  "PlanMaster AI" / "Wayam AI" (page titles, `index.html` `<title>`, sidebar footer text, etc.).

### 2. Login page (`src/pages/Login.tsx`)
- Keep `handleLogin` as demo-only: no backend call.
- Add validation before navigating:
  - Email must match a basic pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  - Password must be non-empty.
  - On failure, set an error string in local state and render it inline in orange
    (`text-destructive` stays for actual errors — use the new primary/orange token only for
    non-error UI accents, not to signal error state, to keep error semantics clear).
- Swap logo/branding text as described above.
- Button/focus-ring colors flow automatically once the primary token is re-themed (step 3) since
  the page already uses `bg-primary`/`ring-primary` classes.

### 3. Orange theme (`src/index.css`)
Locate the CSS custom properties block (HSL triples consumed by `tailwind.config.ts`) and repoint
the brand-relevant tokens to an orange scale derived from the logo gradient:
- `--primary` → `F0731A` equivalent HSL (main brand orange)
- `--ring` → same as primary
- `--sidebar-*` accent tokens → coordinated with the dark logo's gradient stops (`FFA12B`/`DC440C`)
  as appropriate for hover/active states
- Leave `--destructive` (red) and other semantic tokens untouched — only brand/primary tokens move.
- Do this for both light and dark mode blocks if the file defines both.

After the swap, spot-check `CommandCenter.tsx` and `ActiveOrders.tsx` (pages likely to have
hardcoded colors e.g. in charts) to confirm nothing still hardcodes the old brand hex instead of
the CSS variable/Tailwind token.

### 4. Git repository scoping
- `cd` into `PlanMaster AI/` and run `git init` there. This creates a nested `.git` directory,
  which git treats as an independent repo boundary — the parent home-directory repo does not
  descend into it, and all our `git` commands run scoped to `PlanMaster AI/` (via `git -C
  "PlanMaster AI"` or an equivalent `cd`), so nothing here touches the home-dir repo or its remote.
- Add `origin` = `https://github.com/WayamAI/Planmaster.git`.
- Check whether that remote already has commits (`git ls-remote`); if it has unrelated history,
  surface that to the user before force-pushing or merging.
- Commit in small logical chunks as work lands: e.g. "Add Wayam AI brand assets", "Rebrand sidebar
  and login to PlanMaster AI / Wayam AI", "Apply orange theme tokens", "Add login validation",
  push after each or in small batches — not one giant commit at the end.

### 5. Build verification + Vercel deploy
- Run `npm install` (or `bun install`, matching the lockfile present) and `npm run build` locally;
  fix any TypeScript/build errors surfaced by the rebrand changes before deploying.
- Use the `vercel:deploy` skill to deploy to production once the build is verified clean.

## Testing / Verification
- `npm run build` completes with no errors.
- Manual check: login page renders new logo/branding, orange theme, and rejects invalid
  email/empty password with inline message; valid input still navigates to `/`.
- Sidebar renders the dark logo correctly against its background.
- Favicon shows the Wayam AI mark in the browser tab.
- Deployed Vercel URL loads and matches local build.
