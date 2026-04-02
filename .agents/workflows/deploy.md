---
description: How to deploy the application — always run after every code change
---

# Deploy Workflow

// turbo-all

Deploy is automatic via Git. Every push to `main` triggers a production deployment.

## Steps

1. Stage all changes:
```
git add -A
```

2. Commit with a descriptive message:
```
git commit -m "feat/fix/chore: description of change"
```

3. Push to trigger deploy:
```
git push
```

## Rules

- **Always deploy after every code change** — no exceptions, do not ask the user.
- Use PowerShell-compatible syntax: use `;` instead of `&&` to chain commands.
- After push, inform the user that deployment is in progress.
