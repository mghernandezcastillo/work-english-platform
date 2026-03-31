# Antigravity Execution Strategy — English for Work

---

## How Antigravity builds this project

Antigravity is the AI coding assistant that will build and deploy this entire project. It follows a phased, ordered process with human checkpoints.

---

## Execution principles

1. **Follow the PRD** — `00-master-prd.md` is the single source of truth
2. **Follow the phase order** — see `.agents/workflows/execution-phases.md`
3. **Stop at checkpoints** — see `checklists/approval-checkpoints.md`
4. **Don't skip** — every phase depends on the previous one
5. **Document assumptions** — if something is unclear, document the assumption and proceed
6. **Test on mobile** — every UI change must be verified on a 360px viewport
7. **Use the config** — read brand values from `config/brand.json`, not hardcoded
8. **Content as data** — lessons, phrases, simulations stored as JSON, not hardcoded in components

---

## Execution phases (summary)

| Phase | Name | Key deliverables |
|---|---|---|
| 1 | **Setup** | Supabase project, database schema, auth, app skeleton |
| 2 | **Design** | UX direction, design system CSS, component library |
| 3 | **Core app** | Learning engine, lesson viewer, exercises, simulations |
| 4 | **Admin** | Admin panel, beta access, testimonials |
| 5 | **Content** | All 36 lessons, 12 simulations, 220-280 phrases |
| 6 | **Audio** | ~300 audio clips generated, uploaded, linked |
| 7 | **Integration** | Hotmart webhook, email automation, Pixel |
| 8 | **Landing** | 2 landing pages (LP1 + LP3) with dynamic testimonials |
| 9 | **Ads** | 8-12 ad creatives for launch |
| 10 | **Beta** | Beta testing, testimonial collection, bug fixes |
| 11 | **Polish** | QA, performance, mobile testing, final fixes |
| 12 | **Launch** | Deploy, activate ads, monitor |

See `.agents/workflows/execution-phases.md` for detailed instructions.

---

## Antigravity capabilities used

| Capability | How it's used |
|---|---|
| **Code generation** | Build React components, CSS, JavaScript |
| **Image generation** | Create UI mockups, ad creatives, OG images |
| **Web browsing** | Research competitors, test deployed pages |
| **File management** | Create/edit all project files |
| **Supabase MCP** | Create project, apply migrations, deploy edge functions |
| **Command execution** | Run npm, build, deploy |
| **Search** | Research best practices, documentation |

---

## What Antigravity CANNOT do (human required)

| Task | Why | Who does it |
|---|---|---|
| Create Hotmart account | Requires personal ID, bank info | Operator |
| Create Facebook Business Manager | Requires personal identity verification | Operator |
| Purchase domain | Requires payment | Operator |
| Create ElevenLabs account | Requires payment method | Operator |
| Approve ad creatives | Facebook policy review | Operator |
| Set ad budgets | Business decision | Operator |
| Review beta tester feedback | Qualitative judgment | Operator |
| Final launch decision | Business decision | Operator |

---

## How to invoke Antigravity for this project

When starting a new session, Antigravity should be told:

```
Read the START-HERE.md and docs/strategy/00-master-prd.md in the work-english-platform workspace.
Then read .agents/workflows/execution-phases.md to know what to do next.
Check planning/master-task-list.md to see what's already done.
Continue from where we left off.
```

This ensures continuity across sessions.
