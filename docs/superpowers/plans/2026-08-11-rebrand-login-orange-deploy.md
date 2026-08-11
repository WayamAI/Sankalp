# PlanMaster AI: Wayam AI Rebrand, Login Polish, Orange Theme, Vercel Deploy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand PlanMaster AI from "PlanForge AI / Joules to Watts" to "PlanMaster AI / Wayam AI" using the supplied Wayam AI logos, apply an orange brand theme, add basic client-side validation to the demo login, and ship it to Vercel production from a git repo correctly scoped to this project.

**Architecture:** Presentational/config changes only — no backend, no new runtime dependencies. Brand colors flow through the existing CSS-custom-property + Tailwind-token system already in place (`src/index.css` → `tailwind.config.ts`), so re-theming means changing values in one file. The one piece of real logic (login validation) is extracted into a small pure function so it's unit-testable, per TDD.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, react-router-dom, Vitest + Testing Library (already configured), Vercel CLI/skill for deploy.

## Global Constraints

- Demo login stays backend-less: any syntactically valid email + any non-empty password succeeds. (Spec: Goals #2, Non-goals)
- Only brand/primary CSS tokens (`--primary`, `--ring`, `--sidebar-primary`, `--sidebar-ring`) are re-themed to orange; `--destructive`, `--status-*`, `--priority-*`, `--chart-*` stay untouched. (Spec: Design §3)
- All git operations run scoped to `PlanMaster AI/` only, `origin` = `https://github.com/WayamAI/Planmaster.git`; never touch the home-directory repo. (Spec: Design §4)
- Commit in small logical chunks per task, pushing as work lands — not one giant commit at the end. (Spec: Goals #4)
- No page/layout redesign beyond logo, brand text, and color-token swaps. (Spec: Non-goals)
- `npm run build` must pass with zero errors before deploying. (Spec: Design §5)

---

## File Structure

New files:
- `src/assets/brand/logo-dark.svg` — Wayam AI logo for dark backgrounds (sidebar)
- `src/assets/brand/logo-light.svg` — Wayam AI logo for light backgrounds (login page)
- `public/favicon.svg` — Wayam AI favicon mark
- `src/lib/loginValidation.ts` — pure `validateLoginInput(email, password)` function
- `src/lib/loginValidation.test.ts` — unit tests for the above

Modified files:
- `index.html` — title, meta tags, favicon links → PlanMaster AI / Wayam AI
- `src/components/layout/AppSidebar.tsx` — logo import + alt text + heading text
- `src/pages/Login.tsx` — logo, heading/subtext, default email, validation wiring, error display
- `src/components/shared/ConversationalPlanner.tsx` — "PlanForge AI Planner" label
- `src/components/RemediationPanel.tsx` — "J2W" copy references
- `src/data/remediationOptions.ts` — "J2W" / "Joules to Watts" copy references
- `src/index.css` — `--primary`, `--ring`, `--sidebar-primary`, `--sidebar-ring` → orange HSL values

Removed:
- `src/assets/jouletowatts_logo.png` (replaced by the new brand SVGs)

---

## Task 1: Brand assets + favicon/meta

**Files:**
- Create: `src/assets/brand/logo-dark.svg`
- Create: `src/assets/brand/logo-light.svg`
- Create: `public/favicon.svg`
- Modify: `index.html`

**Interfaces:**
- Produces: `src/assets/brand/logo-dark.svg` and `src/assets/brand/logo-light.svg` as importable asset paths for Task 2 and Task 3 (`import logoDark from '@/assets/brand/logo-dark.svg'`, same pattern as the existing `jouletowatts_logo.png` import).

- [ ] **Step 1: Copy the source SVGs into the project**

```bash
cd "/Users/arkabera/Desktop/Wayam AI/PlanMaster AI"
cp "/Users/arkabera/Desktop/Wayam AI/AIDLC Wayam All assets/Logo Main (Dark).svg" src/assets/brand/logo-dark.svg
cp "/Users/arkabera/Desktop/Wayam AI/AIDLC Wayam All assets/Logo Main (Light) - Wayam AI.svg" src/assets/brand/logo-light.svg
cp "/Users/arkabera/Desktop/Wayam AI/AIDLC Wayam All assets/fav icon.svg" public/favicon.svg
```

(`src/assets/brand/` doesn't exist yet — `cp` with a nonexistent destination directory will fail, so create it first: `mkdir -p src/assets/brand`.)

- [ ] **Step 2: Verify the files copied correctly**

Run: `ls -la src/assets/brand/ public/favicon.svg`
Expected: both `logo-dark.svg` and `logo-light.svg` listed under `src/assets/brand/`, and `public/favicon.svg` exists, all with non-zero size.

- [ ] **Step 3: Update `index.html` metadata and favicon links**

Replace the `<head>` content (lines 6-36) with:

```html
    <title>PlanMaster AI</title>
    <meta name="description" content="PlanMaster AI — Intelligent Order Simulation & Replanning">
    <meta name="author" content="Wayam AI" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <meta property="og:type" content="website" />
    <meta property="og:image" content="/favicon.svg">
    <meta property="og:title" content="PlanMaster AI">
    <meta property="og:description" content="PlanMaster AI — Intelligent Order Simulation & Replanning">

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@WayamAI" />
    <meta name="twitter:image" content="/favicon.svg">
    <meta name="twitter:title" content="PlanMaster AI">
    <meta name="twitter:description" content="PlanMaster AI — Intelligent Order Simulation & Replanning">
```

- [ ] **Step 4: Remove the old default Vite favicon reference if present, confirm build finds the new one**

Run: `grep -n "favicon" index.html`
Expected: only the one `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` line — no leftover references to `/src/assets/jouletowatts_logo.png` or a `vite.svg` default.

- [ ] **Step 5: Commit**

```bash
git add src/assets/brand public/favicon.svg index.html
git commit -m "Add Wayam AI brand assets and update page metadata/favicon"
git push
```

---

## Task 2: Rebrand the sidebar

**Files:**
- Modify: `src/components/layout/AppSidebar.tsx:1-2` (import), `:174-176` (logo/heading block)

**Interfaces:**
- Consumes: `src/assets/brand/logo-dark.svg` from Task 1.

- [ ] **Step 1: Swap the logo import**

In `src/components/layout/AppSidebar.tsx`, replace line 2:

```tsx
import logoImg from '@/assets/jouletowatts_logo.png';
```

with:

```tsx
import logoImg from '@/assets/brand/logo-dark.svg';
```

- [ ] **Step 2: Update the logo/heading markup**

Replace lines 174-176:

```tsx
            <img src={logoImg} alt="Joules to Watts" className="w-36 object-contain object-left" />
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">PlanForge AI</h1>
            <p className="text-[9px] text-sidebar-muted tracking-widest uppercase">Intelligent Replanning</p>
```

with:

```tsx
            <img src={logoImg} alt="Wayam AI" className="w-9 h-9 object-contain object-left" />
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">PlanMaster AI</h1>
            <p className="text-[9px] text-sidebar-muted tracking-widest uppercase">Wayam AI</p>
```

(The new mark is a square icon logo, not a wordmark like the old PNG, so it's sized as a small square icon (`w-9 h-9`) rather than a wide banner (`w-36`).)

- [ ] **Step 3: Remove the now-unused old logo asset**

```bash
git rm src/assets/jouletowatts_logo.png
```

- [ ] **Step 4: Verify no remaining references to the old asset**

Run: `grep -rn "jouletowatts_logo" src public index.html`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppSidebar.tsx
git commit -m "Rebrand sidebar to PlanMaster AI / Wayam AI"
git push
```

---

## Task 3: Login validation logic (TDD) + login page rebrand

**Files:**
- Create: `src/lib/loginValidation.ts`
- Test: `src/lib/loginValidation.test.ts`
- Modify: `src/pages/Login.tsx`

**Interfaces:**
- Produces: `validateLoginInput(email: string, password: string): { valid: true } | { valid: false; error: string }` — consumed by `src/pages/Login.tsx`'s `handleLogin`.
- Consumes: `src/assets/brand/logo-light.svg` from Task 1.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/loginValidation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateLoginInput } from "./loginValidation";

describe("validateLoginInput", () => {
  it("accepts a well-formed email and non-empty password", () => {
    expect(validateLoginInput("r.krishnamurthy@planmaster.ai", "anything")).toEqual({ valid: true });
  });

  it("accepts any syntactically valid email domain, not just gmail", () => {
    expect(validateLoginInput("someone@example.com", "pw")).toEqual({ valid: true });
  });

  it("rejects an email with no @", () => {
    expect(validateLoginInput("not-an-email", "pw")).toEqual({
      valid: false,
      error: "Enter a valid email address.",
    });
  });

  it("rejects an email with no domain", () => {
    expect(validateLoginInput("user@", "pw")).toEqual({
      valid: false,
      error: "Enter a valid email address.",
    });
  });

  it("rejects an empty password", () => {
    expect(validateLoginInput("user@example.com", "")).toEqual({
      valid: false,
      error: "Enter a password.",
    });
  });

  it("rejects a whitespace-only password", () => {
    expect(validateLoginInput("user@example.com", "   ")).toEqual({
      valid: false,
      error: "Enter a password.",
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/loginValidation.test.ts`
Expected: FAIL — `Cannot find module './loginValidation'` (the module doesn't exist yet).

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/loginValidation.ts`:

```ts
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginValidationResult = { valid: true } | { valid: false; error: string };

export function validateLoginInput(email: string, password: string): LoginValidationResult {
  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, error: "Enter a valid email address." };
  }
  if (password.trim().length === 0) {
    return { valid: false, error: "Enter a password." };
  }
  return { valid: true };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/loginValidation.test.ts`
Expected: PASS, all 6 tests green.

- [ ] **Step 5: Commit the validation logic**

```bash
git add src/lib/loginValidation.ts src/lib/loginValidation.test.ts
git commit -m "Add loginValidation with unit tests"
git push
```

- [ ] **Step 6: Rebrand and wire up `src/pages/Login.tsx`**

Replace the full file with:

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Shield, User } from 'lucide-react';
import { validateLoginInput } from '@/lib/loginValidation';
import logoImg from '@/assets/brand/logo-light.svg';

const roles = [
  { id: 'planner', label: 'Production Planner', desc: 'Full access to order management, simulation, replanning', icon: <Factory className="w-5 h-5" /> },
  { id: 'supply', label: 'Supply Chain Manager', desc: 'Supplier views, material availability, disruption tracking', icon: <User className="w-5 h-5" /> },
  { id: 'director', label: 'Operations Director', desc: 'Dashboards, multi-factory views, financial impact', icon: <Shield className="w-5 h-5" /> },
  { id: 'executive', label: 'Executive', desc: 'Full access with summary dashboard', icon: <Shield className="w-5 h-5" /> },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('planner');
  const [email, setEmail] = useState('r.krishnamurthy@planmaster.ai');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateLoginInput(email, password);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoImg} alt="Wayam AI" className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-sidebar-accent-foreground tracking-tight">PlanMaster AI</h1>
          <p className="text-xs text-sidebar-muted tracking-widest uppercase mt-1">Intelligent Order Simulation & Replanning</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-lg border p-6 shadow-xl space-y-5">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 text-sm border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive -mt-2">{error}</p>
          )}

          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(role => (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded border text-left transition-colors ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className={`mb-1 ${selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'}`}>{role.icon}</div>
                  <p className="text-xs font-medium text-foreground">{role.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>

          <p className="text-center text-[10px] text-muted-foreground">
            Connected to Oracle ERP • MES Pune & Vadodara • Salesforce CRM
          </p>
        </form>
      </div>
    </div>
  );
}
```

Note: `selectedRole` is set but not otherwise consumed by `handleLogin` — this matches the existing (pre-change) behavior exactly; role selection is a UI-only affordance and no behavior beyond that is in scope.

- [ ] **Step 7: Manually verify the login page behavior**

Run: `npm run dev`, open `/login` in a browser.
Expected:
- Wayam AI logo renders above "PlanMaster AI" heading.
- Typing `not-an-email` + any password and submitting shows "Enter a valid email address." in red, does not navigate.
- Clearing the password and submitting with a valid email shows "Enter a password.", does not navigate.
- Entering any syntactically valid email (gmail.com or otherwise) + any non-empty password navigates to `/`.

- [ ] **Step 8: Commit**

```bash
git add src/pages/Login.tsx
git commit -m "Rebrand login page and wire up client-side validation"
git push
```

---

## Task 4: Sweep remaining old-brand text references

**Files:**
- Modify: `src/components/shared/ConversationalPlanner.tsx:126`
- Modify: `src/components/RemediationPanel.tsx:152,188`
- Modify: `src/data/remediationOptions.ts:234,294,321`

**Interfaces:** None — pure text replacement, no new interfaces produced or consumed.

- [ ] **Step 1: Replace remaining brand strings**

In `src/components/shared/ConversationalPlanner.tsx:126`, replace:
```tsx
              <p className="font-semibold text-sm">PlanForge AI Planner</p>
```
with:
```tsx
              <p className="font-semibold text-sm">PlanMaster AI Planner</p>
```

In `src/components/RemediationPanel.tsx:152`, replace:
```tsx
            Running on live J2W data
```
with:
```tsx
            Running on live Wayam AI data
```

In `src/components/RemediationPanel.tsx:188`, replace:
```tsx
          Claude modelled 3 options against live J2W production data. Select one to see the full action plan.
```
with:
```tsx
          Claude modelled 3 options against live Wayam AI production data. Select one to see the full action plan.
```

In `src/data/remediationOptions.ts:234`, replace:
```ts
          { title: 'Conduct supplier site audit (shortlisted candidate)', detail: 'Quality team site visit to top candidate. Assessment against J2W vendor qualification standard.', urgency: 'this_month', dueDate: 'May 10' },
```
with:
```ts
          { title: 'Conduct supplier site audit (shortlisted candidate)', detail: 'Quality team site visit to top candidate. Assessment against Wayam AI vendor qualification standard.', urgency: 'this_month', dueDate: 'May 10' },
```

In `src/data/remediationOptions.ts:294`, replace:
```ts
          { title: 'Refresh DGFT registration for Joules to Watts', detail: 'Confirm DGFT registration validity. If renewal is due within 6 months, initiate renewal immediately.', urgency: 'this_week', dueDate: 'Apr 19' },
```
with:
```ts
          { title: 'Refresh DGFT registration for Wayam AI', detail: 'Confirm DGFT registration validity. If renewal is due within 6 months, initiate renewal immediately.', urgency: 'this_week', dueDate: 'Apr 19' },
```

In `src/data/remediationOptions.ts:321`, replace:
```ts
          { title: 'Identify PGCIL and BHEL tenders open for domestic redirect', detail: 'BD team to check PGCIL and BHEL tender portals for transformer procurement that matches J2W pipeline specs.', urgency: 'this_week', dueDate: 'Apr 21' },
```
with:
```ts
          { title: 'Identify PGCIL and BHEL tenders open for domestic redirect', detail: 'BD team to check PGCIL and BHEL tender portals for transformer procurement that matches Wayam AI pipeline specs.', urgency: 'this_week', dueDate: 'Apr 21' },
```

- [ ] **Step 2: Verify no old-brand strings remain**

Run: `grep -rniE "planforge|joule|j2w" src public index.html`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/ConversationalPlanner.tsx src/components/RemediationPanel.tsx src/data/remediationOptions.ts
git commit -m "Sweep remaining PlanForge/J2W copy references to PlanMaster AI/Wayam AI"
git push
```

---

## Task 5: Orange theme

**Files:**
- Modify: `src/index.css:18,35,55,60`

**Interfaces:** None — pure CSS custom property value changes; consumed transitively by every component already using `bg-primary`, `ring-primary`, `text-sidebar-primary`, etc. via `tailwind.config.ts` (no changes needed there).

- [ ] **Step 1: Update the brand color tokens**

In `src/index.css`, replace line 18:
```css
    --primary: 213 70% 42%;
```
with:
```css
    --primary: 25 88% 52%;
```

Replace line 35:
```css
    --ring: 213 70% 42%;
```
with:
```css
    --ring: 25 88% 52%;
```

Replace line 55:
```css
    --sidebar-primary: 213 70% 55%;
```
with:
```css
    --sidebar-primary: 33 100% 58%;
```

Replace line 60:
```css
    --sidebar-ring: 213 70% 55%;
```
with:
```css
    --sidebar-ring: 33 100% 58%;
```

Leave every other token (`--destructive`, `--status-*`, `--priority-*`, `--chart-*`, `--secondary`, `--accent`, etc.) unchanged.

- [ ] **Step 2: Visually verify the theme change**

Run: `npm run dev`, open `/` and `/orders`.
Expected: primary buttons, active sidebar nav item highlight, and focus rings render in orange (not blue); destructive/status/priority colors (red critical badges, green on-track, etc.) are unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "Apply orange brand theme to primary/ring tokens"
git push
```

---

## Task 6: Build verification and Vercel production deploy

**Files:** None modified — verification and deployment only.

**Interfaces:** None.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass, including the 6 new `loginValidation` tests and the pre-existing `example.test.ts`.

- [ ] **Step 2: Run a clean production build**

Run: `npm run build`
Expected: build completes with exit code 0, no TypeScript errors, `dist/` produced.

- [ ] **Step 3: Smoke-test the production build locally**

Run: `npm run preview` (in background or a separate terminal), open the printed local URL.
Expected: app loads, `/login` shows the new branding/theme, navigating through works, no console errors related to missing assets (check the favicon and logo both resolve, no 404s in network tab).

- [ ] **Step 4: Commit anything outstanding, confirm clean tree**

Run: `git status --short`
Expected: empty (everything from Tasks 1-5 already committed and pushed).

- [ ] **Step 5: Deploy to Vercel production**

Use the `vercel:deploy` skill, passing `prod`/`production`, run from `PlanMaster AI/`.
Expected: deployment succeeds; note the production URL returned.

- [ ] **Step 6: Verify the deployed site**

Open the production URL returned by the deploy step.
Expected: matches the local `npm run preview` smoke test — new branding, orange theme, working login validation, no console errors.
