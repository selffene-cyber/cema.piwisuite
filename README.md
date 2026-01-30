# CEMA Application

A React/TypeScript application for the CEMA (Centro de Estudios y Mejoramiento Ambiental) evaluation system.

## Features

- Dashboard with statistics
- Student evaluation management
- File storage with Cloudflare R2
- PDF report generation
- Responsive design

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Cloudflare Workers (D1, R2)
- **Storage**: Cloudflare R2 Object Storage
- **Database**: Cloudflare D1
- **Authentication**: JWT-based auth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

### Cloudflare Setup

1. **Login to Cloudflare**:
   ```bash
   npm run wrangler:login
   ```

2. **Create D1 Database**:
   ```bash
   npm run db:create
   ```
   Copy the database_id to `wrangler.toml`

3. **Push Database Schema**:
   ```bash
   # Local development
   npm run db:push

   # Remote (production)
   npm run db:push:remote
   ```

4. **Create R2 Bucket**:
   - Go to Cloudflare Dashboard > R2
   - Create bucket named `cema-files`
   - Generate API token with read/write permissions
   - Add credentials to `.env`

5. **Deploy Worker**:
   ```bash
   # Development
   npm run wrangler:dev

   # Production
   npm run deploy
   ```

### GitHub Repository

The application is connected to GitHub repository:
https://github.com/selffene-cyber/cema.piwisuite

## Deployment

### Deploy to Cloudflare Pages (Frontend)

The React frontend is deployed to Cloudflare Pages with a Pages Function that proxies `/api/*` requests to the Worker.

```bash
# Build the frontend
npm run build

# Prepare deployment folder (copy dist and functions together)
powershell -Command "Remove-Item -Recurse -Force deployment; New-Item -ItemType Directory -Force -Path deployment; Copy-Item -Path dist\* -Destination deployment -Recurse; Copy-Item -Path functions -Destination deployment -Recurse"

# Deploy to Cloudflare Pages
npx wrangler pages deploy deployment --project-name=cema-frontend
```

**Note:** The first time you deploy, create the Pages project first:
```bash
npx wrangler pages project create cema-frontend --production-branch=main
```

### Set Custom Domain (cema.piwisuite.cl)

Custom domains for Cloudflare Pages must be set up through the Cloudflare Dashboard:

1. Go to **Cloudflare Dashboard** > **Workers & Pages** > **cema-frontend**
2. Click on **Custom domains** > **Set up a custom domain**
3. Enter `cema.piwisuite.cl`
4. Select the domain `piwisuite.cl`
5. Click **Continue** to verify DNS configuration

Once set up:
- Frontend: `https://cema.piwisuite.cl/` (serves React app)
- API: `https://cema.piwisuite.cl/api/*` (proxies to Worker)

### Deploy to Cloudflare Workers (API)

```bash
# Deploy to production
npm run deploy:prod
```

### Set Environment Variables

```bash
# Set secrets for production
wrangler secret put CLOUDFLARE_API_TOKEN
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/evaluations` - List evaluations
- `POST /api/evaluations` - Create evaluation
- `GET /api/evaluations/:id` - Get evaluation details
- `DELETE /api/evaluations/:id` - Delete evaluation
- `GET /api/files` - List files
- `POST /api/files` - Upload file
- `DELETE /api/files/:key` - Delete file
- `GET /api/stats` - Dashboard statistics

## Project Structure

```
asistente-cema/
├── src/
│   └── worker.ts          # Cloudflare Worker API
├── utils/
│   ├── db.ts              # Database utilities
│   └── storage.ts         # R2 storage utilities
├── schema.sql             # D1 database schema
├── wrangler.toml          # Cloudflare configuration
├── App.tsx                # Main React component
├── components/            # React components
├── screens/               # Application screens
└── types.ts               # TypeScript definitions
```

## License

MIT
