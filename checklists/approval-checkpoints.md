# Approval Checkpoints — English for Work

> Points during construction where the HUMAN OPERATOR must review and approve before continuing.
> Antigravity will stop and ask at each checkpoint.

---

## Checkpoint 1: Technical Setup Complete
**Phase:** 1 — Setup
**When:** After Supabase project created, schema applied, app runs locally
**What to verify:**
- App runs in the browser
- Database tables visible in Supabase
- Login/register works

**Say to Antigravity:** "Approved, continue to Phase 2" or describe issues

---

## Checkpoint 2: Visual Direction Selected
**Phase:** 2 — Design
**When:** After 4 UX directions generated and scored
**What to verify:**
- Review the top 2 recommended visual directions
- Choose which one to use for the entire project
- This decision affects ALL future design work

**Say to Antigravity:** "I choose Direction [A/B/C/D]" or ask for changes

---

## Checkpoint 3: Core App Complete
**Phase:** 3 — Core App
**When:** After learning engine, simulations, and progress tracking are built
**What to verify:**
- Open a sample lesson on your phone
- Try all 7 steps of a lesson
- Play audio
- Complete an exercise
- Check progress is saved

**Say to Antigravity:** "Approved, continue" or "Fix: [description]"

---

## Checkpoint 4: Admin Panel Complete
**Phase:** 4 — Admin
**When:** After admin panel, beta access, and testimonial system are built
**What to verify:**
- Can I log in as admin?
- Can I generate a beta link?
- Can I change a user's access type?
- Can I approve a testimonial?

**Say to Antigravity:** "Approved, continue" or "Fix: [description]"

---

## Checkpoint 5: Content Quality
**Phase:** 5 — Content
**When:** After all 36 lessons and 12 simulations have content
**What to verify:**
- Read through 3-5 full lessons (sample from different routes)
- Are phrases useful and practical?
- Are exercises clear?
- Is the Spanish text natural and well-written?

**Say to Antigravity:** "Approved" or "Fix lesson [X]: [issue]"

---

## Checkpoint 6: Audio Quality
**Phase:** 6 — Audio
**When:** After all ~300 audio clips are generated
**What to verify:**
- Listen to 10 random clips across different speakers
- Is pronunciation natural?
- Is pacing appropriate for learners?
- Do clips play correctly on your phone?

**Say to Antigravity:** "Approved" or "Re-generate: [clip IDs]"

---

## Checkpoint 7: Payment & Email Flow
**Phase:** 7 — Integration
**When:** After Hotmart webhook and email automation are connected
**What to verify:**
- Make a test purchase on Hotmart
- Verify you receive the welcome email
- Verify you can log in and access content
- Process a test refund
- Verify access is revoked

**Say to Antigravity:** "Approved" or describe the issue

---

## Checkpoint 8: Landing Pages
**Phase:** 8 — Landing
**When:** After LP1 and LP3 are built
**What to verify:**
- Open on your phone (the primary target device)
- Does it look premium and trustworthy?
- Is the CTA obvious?
- Does it load fast?
- Do testimonials display?
- Does the Hotmart checkout link work?

**Say to Antigravity:** "Approved" or "Change: [description]"

---

## Checkpoint 9: Ad Creatives
**Phase:** 9 — Ads
**When:** After 8-12 ad creatives are generated
**What to verify:**
- Review all ad images
- Review all ad copy
- Do they match the landing page style?
- Would YOU click on this ad?

**Say to Antigravity:** "Approved" or "Redo: [which ads, what changes]"

---

## Checkpoint 10: Beta Testing Results
**Phase:** 10 — Beta
**When:** After 5-7 days of beta testing
**What to verify:**
- How many testers completed at least one route?
- What feedback did they give?
- Are there critical bugs?
- Are there at least 3 good testimonials?

**Say to Antigravity:** "Ready to launch" or "Need to fix: [list]"

---

## Checkpoint 11: FINAL — Launch Go/No-Go
**Phase:** 11 — Polish / 12 — Launch
**When:** Everything is complete
**What to verify:**
- `checklists/launch-readiness-checklist.md` is 100% ✅
- You're ready to spend money on ads
- You're available to monitor for the first few hours

**Say to Antigravity:** "LAUNCH" or "Hold, because: [reason]"
