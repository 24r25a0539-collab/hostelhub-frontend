# HostelHub — Build Plan

The current project is the empty Lovable TanStack Start starter (only `__root.tsx` and a placeholder `index.tsx`). The HostelHub repo never synced. To deliver a working preview today, I'll build HostelHub **in this project** as a fully functional frontend with local persistence (Zustand + localStorage), so every button, form, role gate, and workflow works end-to-end and the preview is stable. Lovable Cloud (database, real auth, file storage, OCR, AI) can be wired in afterward without rewriting the UI.

## Scope of this build

**Architecture**
- `src/store/` — Zustand stores (auth, students, attendance, cooking, expenses, buspass, elections, announcements, complaints, visitors, qr, notifications), persisted to localStorage
- `src/types/` — shared TypeScript models
- `src/services/` — pure functions for business logic (rotation, vote tally, stats, report export)
- `src/hooks/` — `useAuth`, `useRole`, `useNotifications`
- `src/components/` — layout (AppShell, Sidebar, Header, ProfileMenu, NotificationBell), shared UI, module cards/forms/modals
- `src/routes/` — file-based routes per module
- UI components are presentation-only; logic lives in stores/services

**Routes**
- `/auth` — login (role: Student / Maintainer), seeded demo accounts
- `/_authenticated/` layout — role-aware sidebar + header + outlet
- Student: `/dashboard`, `/attendance`, `/cooking`, `/buspass`, `/announcements`, `/complaints`, `/visitors`, `/qr`, `/elections`, `/profile`, `/settings`, `/notifications`
- Maintainer-only: `/students`, `/expenses`, `/reports`, `/ai-insights`, `/qr/manage`, plus approval views on visitors/complaints/swaps
- Maintainer guard: only the elected maintainer for the current month can enter maintainer routes; others see a denial screen

**Modules (all functional against local store)**
1. Auth + role separation + logout (clear session, redirect, history replace)
2. Profile (photo upload via FileReader → dataURL, personal/academic/hostel/account fields)
3. Settings (light/dark/system theme persisted, notification toggles, privacy toggles)
4. Students CRUD (form, edit, delete-with-confirm, search, filter, export CSV, eligibility toggle)
5. Attendance (calendar, per-date marking, select-all, stats, today-cook-only gate, maintainer override)
6. Cooking duties (rotation, Start/Stop, queue, swap requests + approve/reject)
7. Bus pass (wallets, add/deduct transactions, history, export)
8. Expenses (CRUD, categories, bill image upload, OCR stub that auto-fills from filename/manual entry — clearly labeled "OCR preview", duplicate detection)
9. Elections (nominations, one-vote-per-student, results, auto-promote winner to next month's maintainer, history)
10. Announcements (CRUD, priority, dashboard surfacing)
11. Complaints (CRUD, status workflow, comments timeline, attachments)
12. Visitors (request, approve/reject, check-in/out timestamps, history)
13. QR payments (upload/replace/delete, UPI ID, payee, student view/download)
14. Reports (per-module, date filter, CSV + print-to-PDF export)
15. AI Insights (rule-based analyzers over local data: budget, anomalies, health score, monthly statement — labeled "heuristic")
16. Notification center (categorized, mark read, delete, search)
17. Global search (students, complaints, expenses, announcements, visitors)

**Demo data**
Seeded on first load: 1 maintainer + 8 students, sample expenses, announcements, cooking queue, QR placeholder, so every screen has content.

## What is intentionally NOT in this turn
- Real backend (Lovable Cloud) — added later without UI rewrite
- Real OCR (would require Lovable Cloud + AI Gateway) — stub now, swap later
- Real AI insights — heuristic now, swap to Gateway later
- Real file storage — dataURLs in localStorage now

## Technical notes
- TanStack Start file routes; `_authenticated/route.tsx` gates on local auth store
- Theme via `class="dark"` on `<html>`, persisted
- All forms use react-hook-form + zod
- Exports: CSV via Blob; PDF via `window.print()` styled report pages
- shadcn components throughout; no hardcoded colors — semantic tokens in `src/styles.css`

## Deliverable
After the build I'll verify the production build passes and return the preview URL with demo credentials.

---

**This is a very large build (17 modules, ~60+ files).** Confirm and I'll proceed. If you'd rather I enable Lovable Cloud first for real auth/DB/OCR/AI, say so and I'll restructure around that.