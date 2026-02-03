# Git Workflow for CEMA Application

## Overview

This document describes the Git workflow and deployment process for the CEMA application. The application uses a **unified Worker architecture** that serves both the API and static frontend files via the Cloudflare Workers `ASSETS` binding.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Worker                             │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐   │
│  │   ASSETS        │  │         API Routes                  │   │
│  │   Binding       │  │  • /api/auth/*                      │   │
│  │  (Static Files) │  │  • /api/evaluations/*               │   │
│  │                 │  │  • /api/files/*                     │   │
│  │  • index.html   │  │  • /api/stats/*                     │   │
│  │  • /assets/*    │  └─────────────────────────────────────┘   │
│  │  • /sw.js       │                                            │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Branching Strategy

| Branch | Purpose | Environment |
|--------|---------|-------------|
| `main` | Production code | Production (auto-deploys via Pages) |
| `desarrollo` | Development branch | Development/Testing |

## Development Workflow

### 1. Start Working on New Features

Always work on the `desarrollo` branch:

```bash
# Switch to desarrollo branch
git checkout desarrollo

# Pull latest changes
git pull origin desarrollo

# Create feature branch (optional)
git checkout -b feature/my-new-feature
```

### 2. Make Changes

1. Edit files in your preferred editor
2. Test changes locally with `npm run dev`
3. Commit changes to your branch:

```bash
# Stage changes
git add -A

# Commit with descriptive message
git commit -m "Add: Description of changes"

# Push to GitHub
git push origin desarrollo
```

### 3. Deploy to Production

**Option A: Using deployment scripts (recommended)**

```bash
# Deploy Worker manually (from deployment/ directory)
cd deployment
npx wrangler deploy

# Or use the batch files
deploy.bat    # Full deployment workflow
deploy-prod.bat  # Production deployment only
```

**Option B: Manual deployment**

```bash
# 1. Merge desarrollo into main
git checkout main
git merge desarrollo

# 2. Push to GitHub (triggers Pages auto-deploy)
git push origin main

# 3. Deploy Worker
npx wrangler deploy

# 4. Sync desarrollo branch
git checkout desarrollo
git merge main
git push origin desarrollo
```

## Deployment Script (`deploy.bat`)

The deployment script performs the following steps:

1. **Git Configuration** - Sets up Git for consistent line endings
2. **Branch Check** - Ensures you're on the `desarrollo` branch
3. **Pull Changes** - Gets latest changes from GitHub
4. **Commit** - Prompts for commit message and commits all changes
5. **Build** - Runs `npm run build` to build the frontend
6. **Deploy** - Runs deployment scripts for Worker
7. **Merge** - Merges `desarrollo` into `main`
8. **Push** - Pushes both branches to GitHub

## Cloudflare Deployment

### Cloudflare Worker (Unified)

The Worker serves both API and static files:

- **Command**: `npx wrangler deploy` (from deployment/ directory)
- **Configuration**: [`wrangler.toml`](wrangler.toml)
- **Entry point**: [`src/worker.ts`](src/worker.ts)
- **Static files**: Served via `ASSETS` binding from `deployment/` directory

**wrangler.toml configuration:**
```toml
name = "cema-piwisuite"
main = "src/worker.ts"
compatibility_date = "2025-02-03"

[[assets]]
binding = "ASSETS"
directory = "deployment"
first_party_hook = true

[[d1_databases]]
binding = "DB"
database_name = "cema_database"
database_id = "..."

[[r2_buckets]]
binding = "FILES"
bucket_name = "cema-files"
```

### Custom Domain

The custom domain `cema.piwisuite.cl` is configured to point to the Worker:

1. Cloudflare Dashboard → Workers & Pages → cema-piwisuite
2. Settings → Custom Domains
3. Add `cema.piwisuite.cl`

### URLs

| Service | URL | Purpose |
|---------|-----|---------|
| App | https://cema.piwisuite.cl | Full application |
| Worker | https://cema-piwisuite.jeans-selfene.workers.dev | API + Static files |

## Initial Setup

### Prerequisites

- Node.js 18+ installed
- Cloudflare Wrangler CLI installed (`npm install -g wrangler`)
- Git configured with GitHub credentials

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/selffene-cyber/cema.piwisuite.git
cd cema.piwisuite
```

2. Create desarrollo branch if it doesn't exist:
```bash
git checkout main
git checkout -b desarrollo
git push -u origin desarrollo
```

3. Install dependencies:
```bash
npm install
```

4. Configure Cloudflare:
```bash
npx wrangler login
```

5. Deploy the Worker:
```bash
cd deployment
npx wrangler deploy
```

## Directory Structure

```
asistente-cema/
├── src/                    # Worker source code
│   └── worker.ts         # Cloudflare Worker entry point
├── functions/            # Cloudflare Pages Functions (legacy)
│   └── api/
├── screens/              # React components
├── utils/                # Utility functions
├── deployment/           # PWA service worker & static assets
│   ├── index.html        # Main HTML entry point
│   ├── sw.js             # Service Worker
│   └── assets/          # Built JS/CSS assets
├── dist/                 # Build output (legacy, not used)
├── wrangler.toml         # Cloudflare Worker configuration
├── package.json          # Dependencies & scripts
└── deploy.bat           # Deployment script (Windows)
```

## Quick Reference

| Action | Command |
|--------|---------|
| Start development | `npm run dev` |
| Build for production | `npm run build` |
| Deploy Worker | `cd deployment && npx wrangler deploy` |
| Deploy to production | `./deploy.bat` |
| Run Worker locally | `npm run wrangler:dev` |
| Open D1 Studio | `npm run db:studio` |

## Troubleshooting

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Deployment fails
- Verify Cloudflare login: `npx wrangler whoami`
- Check `wrangler.toml` configuration
- Ensure D1 database exists and is configured

### Git conflicts
- Pull latest changes before committing: `git pull origin desarrollo`
- Resolve conflicts manually, then commit: `git add -A && git commit -m "Resolve: merge conflicts"`

### Worker not serving static files
- Ensure `ASSETS` binding is defined in `wrangler.toml`
- Verify static files exist in `deployment/` directory
- Check worker logs: `npx wrangler logs`

### Custom domain not working
- Verify domain is configured in Cloudflare Dashboard
- Check DNS settings for the domain
- Ensure Worker is assigned to the domain

## Best Practices

1. **Commit Often**: Make small, frequent commits with clear messages
2. **Test Locally**: Always test changes before deploying
3. **Review Changes**: Check `git diff` before committing
4. **Sync Regularly**: Pull changes from `desarrollo` frequently
5. **Backup**: Push to GitHub regularly to avoid data loss

## Support

For issues with:
- **Git/GitHub**: Check [GitHub Documentation](https://docs.github.com)
- **Cloudflare Workers**: Check [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- **Wrangler**: Run `npx wrangler --help`
