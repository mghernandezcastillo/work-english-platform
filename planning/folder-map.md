# Folder Map — English for Work

> This file shows the complete folder structure of the project operating system.
> Every file listed here has a purpose. Do not delete files you don't understand.

```
work-english-platform/
│
├── master_prd.md                          ← Original PRD (keep as reference)
├── START-HERE.md                          ← READ THIS FIRST — beginner entry point
├── FILES-EXPLAINED.md                     ← What every file does (plain language)
├── .env.example                           ← Template for environment variables
│
├── docs/
│   ├── strategy/                          ← Strategic planning documents
│   │   ├── 00-master-prd.md               ← Master PRD (source of truth)
│   │   ├── 01-business-model.md           ← Revenue model, pricing, unit economics
│   │   ├── 02-product-architecture.md     ← App structure, pages, components, data flow
│   │   ├── 03-content-architecture.md     ← Routes, modules, lessons, content structure
│   │   ├── 04-pedagogical-framework.md    ← 7-step lesson design, exercise types
│   │   ├── 05-ux-ui-strategy.md           ← Design process, visual direction, principles
│   │   ├── 06-cro-landing-strategy.md     ← Landing pages, conversion optimization
│   │   ├── 07-branding-variable-system.md ← Variable naming, logos, colors, config
│   │   ├── 08-facebook-ads-strategy.md    ← Campaign structure, creatives, budgets
│   │   ├── 09-audio-strategy.md           ← Voice specs, production plan, file naming
│   │   ├── 10-supabase-strategy.md        ← Auth, database, storage, edge functions
│   │   ├── 11-hotmart-flow.md             ← Payment flow, webhooks, unlock logic
│   │   ├── 12-resend-flow.md              ← Email automation, templates, triggers
│   │   ├── 13-cloudflare-deployment.md    ← Hosting, DNS, deployment strategy
│   │   └── 14-antigravity-execution-strategy.md ← How Antigravity builds the project
│   │
│   └── guides/                            ← Beginner-safe setup guides
│       ├── STEP-BY-STEP-FULL-GUIDE.md     ← Complete guide from zero to launch
│       ├── NOVICE-TROUBLESHOOTING.md      ← Common problems and fixes
│       ├── FACEBOOK-ADS-STEP-BY-STEP.md   ← How to set up and run Facebook Ads
│       ├── HOTMART-SETUP-FOR-BEGINNERS.md ← How to create product in Hotmart
│       ├── SUPABASE-SETUP-FOR-BEGINNERS.md← How to set up Supabase
│       ├── RESEND-SETUP-FOR-BEGINNERS.md  ← How to set up email sending
│       ├── CLOUDFLARE-SETUP-FOR-BEGINNERS.md ← How to deploy and manage DNS
│       ├── ANTIGRAVITY-SETUP-FOR-BEGINNERS.md ← How to use Antigravity for this project
│       └── STITCH-SETUP-FOR-BEGINNERS.md  ← How to use Stitch browser tool
│
├── .agents/
│   └── workflows/                         ← Antigravity automation workflows
│       ├── execution-phases.md            ← Master execution order
│       ├── ux-generation.md               ← Auto-generate and score UX directions
│       ├── branding-generation.md         ← Auto-generate branding variants
│       ├── landing-generation.md          ← Auto-build landing pages
│       ├── ads-generation.md              ← Auto-create ad creatives
│       └── launch.md                      ← Launch day workflow
│
├── config/                                ← Runtime configuration files
│   ├── brand.json                         ← Commercial name, colors, logo, tagline
│   └── campaign.json                      ← Ad campaigns, angles, budgets
│
├── manifests/                             ← Content tracking and production manifests
│   ├── content-manifest.md                ← All lessons, phrases, exercises — status tracker
│   ├── landing-manifest.md                ← All 6 landing pages — copy, status, URLs
│   ├── ad-manifest.md                     ← All 18-24 ads — copy, format, status
│   └── audio-manifest.md                  ← All audio clips — script, status, file path
│
├── database/                              ← Database planning and schema
│   ├── schema.sql                         ← Full Supabase database schema
│   ├── rls-planning.md                    ← Row Level Security policies
│   └── seed-data-planning.md              ← Initial data (routes, modules, lessons)
│
├── checklists/                            ← Operational checklists
│   ├── credential-checklist.md            ← All accounts and API keys needed
│   ├── launch-checklist.md                ← Pre-launch verification
│   ├── launch-readiness-checklist.md      ← Final go/no-go
│   ├── publishing-checklist.md            ← Post-launch publishing tasks
│   └── approval-checkpoints.md            ← Points where human must approve
│
└── planning/                              ← Project planning artifacts
    ├── folder-map.md                      ← THIS FILE — workspace structure
    ├── setup-dependency-map.md            ← What depends on what
    ├── master-task-list.md                ← Every task from start to launch
    └── implementation-plan.md             ← Technical implementation blueprint
```

## Future folders (created during implementation)

These folders will be created by Antigravity during the build phase:

```
work-english-platform/
├── src/                                   ← Application source code
│   ├── app/                               ← Pages and routing
│   ├── components/                        ← Reusable UI components
│   ├── lib/                               ← Utilities, Supabase client, helpers
│   ├── data/                              ← Content JSON files (lessons, phrases)
│   └── styles/                            ← CSS design system
├── public/                                ← Static assets
│   ├── audio/                             ← Audio MP3 files
│   └── images/                            ← Images and icons
└── supabase/
    └── functions/                         ← Edge Functions (webhooks, emails)
```
