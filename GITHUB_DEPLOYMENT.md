# 🚀 GitHub Deployment Guide

Complete step-by-step guide to deploy Messaging System via GitHub to production (Vercel, Render, Neon).

## Prerequisites

- GitHub account (free)
- Vercel account (free tier)
- Render account (free tier)
- Neon PostgreSQL account (free tier)
- SendGrid account (free tier)
- Twilio account (free trial - $15 credit)

## Step 1: Create GitHub Repository

### 1.1 Create a new repository on GitHub

1. Go to https://github.com/new
2. Repository name: `messaging-system` (or your preferred name)
3. Description: "Omnichannel customer messaging platform"
4. **Choose: Public** (required for free tier deployments)
5. Do NOT initialize with README (we have one)
6. Click **Create repository**

### 1.2 Push local code to GitHub

```bash
cd ~/Documents/augment-projects/Test\ Agent/Messaging\ System
git remote add origin https://github.com/YOUR_USERNAME/messaging-system.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 1.3 Verify on GitHub

- Visit https://github.com/YOUR_USERNAME/messaging-system
- Confirm all 38 files are pushed
- Check commit history shows 7 commits

---

## Step 2: Setup Database (Neon PostgreSQL)

### 2.1 Create Neon project

1. Go to https://neon.tech
2. Sign up with GitHub (recommended)
3. Create new project:
   - Name: `messaging-system`
   - Region: Choose closest to you
4. Click **Create project**

### 2.2 Copy connection details

1. In Neon dashboard, click on **Connection string** tab
2. Select **Node.js** as driver
3. Copy the full connection string (looks like):
   ```
   postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/messaging_system?sslmode=require
   ```
4. **Save this** - you'll need it in Step 3

### 2.3 Initialize database schema

**Option A: Via Neon SQL Editor**
1. In Neon dashboard, click **SQL Editor**
2. Open file: `backend/src/db/schema.sql`
3. Copy entire content
4. Paste into Neon SQL Editor
5. Click **Execute**

**Option B: Via psql locally**
```bash
# Set your Neon connection string
export DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/db?sslmode=require"

# Run schema
psql $DATABASE_URL < backend/src/db/schema.sql
```

**Verify success**: Tables created (users, customers, conversations, messages, etc.)

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Web Service

1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your `messaging-system` repository
5. Click **Connect**

### 3.2 Configure deployment

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `messaging-system-backend` |
| **Environment** | Node |
| **Region** | Choose closest to Neon region |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | Free |

### 3.3 Add environment variables

Click **Add Environment Variable** for each:

```
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/db?sslmode=require
JWT_SECRET=your-super-secret-key-min-32-chars-long
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890
```

⚠️ **Important**: 
- `DATABASE_URL` - from Neon (Step 2.2)
- `JWT_SECRET` - generate random: `openssl rand -base64 32`
- `FRONTEND_URL` - will be from Vercel (Step 4)
- `SENDGRID_API_KEY` - optional, get from https://sendgrid.com
- Twilio keys - optional, get from https://twilio.com

### 3.4 Deploy

1. Click **Create Web Service**
2. Wait for build to complete (5-10 minutes)
3. Copy the URL: `https://messaging-system-backend.onrender.com`
4. **Save this** - you'll need it for frontend

### 3.5 Verify deployment

```bash
curl https://messaging-system-backend.onrender.com/health
# Should return 200 OK
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Connect to Vercel

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Click **Import**

### 4.2 Configure deployment

Set these values:

| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Root Directory** | `frontend` |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |

### 4.3 Add environment variables

Click **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://messaging-system-backend.onrender.com
NEXT_PUBLIC_WS_URL=https://messaging-system-backend.onrender.com
```

Use the URL from Step 3.4

### 4.4 Deploy

1. Click **Deploy**
2. Wait for deployment (3-5 minutes)
3. You'll get a URL: `https://messaging-system-123456.vercel.app`
4. **Save this** - update backend FRONTEND_URL in Step 3.3

### 4.5 Update backend environment

After Vercel deployment:
1. Go back to Render dashboard
2. Click on `messaging-system-backend`
3. Click **Settings** → **Environment**
4. Update `FRONTEND_URL=https://your-app.vercel.app`
5. Click **Save**
6. Service auto-redeploys

### 4.6 Verify frontend

1. Visit your Vercel URL
2. You should see the login page
3. Try registering an account
4. Should see inbox

---

## Step 5: Setup SendGrid (Optional - for email)

### 5.1 Create SendGrid account

1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Verify email address

### 5.2 Create API key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `messaging-system`
4. Copy the key
5. Add to Render environment variable

---

## Step 6: Setup Twilio (Optional - for SMS/WhatsApp)

### 6.1 Create Twilio account

1. Go to https://twilio.com
2. Sign up (free trial: $15 credit)
3. Verify phone number

### 6.2 Get credentials

1. In Twilio console:
   - Copy **Account SID**
   - Copy **Auth Token**
   - Get a phone number
2. Add to Render environment variables

---

## Step 7: Test Production System

### 7.1 Test frontend

1. Visit your Vercel URL
2. Register new account
3. Login successfully
4. See inbox (should be empty)

### 7.2 Test webhook

```bash
curl -X POST https://messaging-system-backend.onrender.com/webhooks/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": "customer@example.com",
    "subject": "Test from production",
    "text": "Hello from production!",
    "html": "<p>Hello from production!</p>"
  }'
```

### 7.3 Verify in frontend

1. Refresh your frontend
2. Should see conversation from customer@example.com
3. Conversation appears in list
4. Can click to view thread

### 7.4 Test sending reply

1. Click conversation
2. Type reply
3. Choose channel (Email)
4. Send
5. Message appears in thread

---

## Step 8: Setup GitHub Actions (Optional - Auto-deploy)

### 8.1 Create GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npx vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

Add GitHub secrets:
- `RENDER_SERVICE_ID` - from Render dashboard
- `RENDER_API_KEY` - from Render account settings
- `VERCEL_TOKEN` - from Vercel account settings

Then every `git push` auto-deploys!

---

## Step 9: Custom Domain (Optional)

### Backend custom domain (Render)

1. In Render dashboard: **Settings** → **Custom Domains**
2. Add your domain: `api.yourdomain.com`
3. Point DNS to Render

### Frontend custom domain (Vercel)

1. In Vercel dashboard: **Settings** → **Domains**
2. Add your domain: `yourdomain.com`
3. Point DNS to Vercel

---

## Troubleshooting

### Backend not building

**Error**: "npm install failed"
- Check `backend/package.json` exists
- Verify no syntax errors in code
- Check build logs in Render dashboard

**Solution**:
```bash
# Test locally first
cd backend
npm install
npm start
```

### Frontend not deploying

**Error**: "Build failed"
- Check `frontend/package.json` exists
- Verify environment variables are set
- Check build logs in Vercel dashboard

**Solution**:
```bash
cd frontend
npm install
npm run build
```

### WebSocket not connecting

**Error**: WebSocket connection fails in production
- Verify `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` match
- Ensure CORS is properly configured
- Check network tab in browser

**Solution**:
- Frontend MUST use HTTPS
- Backend MUST use HTTPS
- WebSocket will upgrade from HTTP to WS

### Database connection fails

**Error**: "Cannot connect to database"
- Verify `DATABASE_URL` is correct
- Check IP whitelist in Neon dashboard
- Ensure schema was loaded

**Solution**:
```bash
# Test connection locally
psql $DATABASE_URL -c "SELECT 1"
```

### Email/SMS not working

- Verify API keys are set in environment
- Check service logs (Render/SendGrid/Twilio)
- Use mocked responses locally (no API key needed)

---

## Post-Deployment Checklist

- [ ] GitHub repository created and all code pushed
- [ ] Neon database created and schema loaded
- [ ] Render backend deployed and responding
- [ ] Vercel frontend deployed and accessible
- [ ] Environment variables all set correctly
- [ ] Can register and login to frontend
- [ ] Can send webhook test
- [ ] Conversation appears in frontend
- [ ] Can send reply via email/SMS
- [ ] All 3 services running (backend, frontend, database)
- [ ] Custom domain configured (if applicable)
- [ ] GitHub Actions configured (if applicable)

---

## Production Tips

1. **Monitor logs**: Check Render and Vercel dashboards regularly
2. **Backup database**: Neon handles automatic backups
3. **Monitor costs**: All services have free tiers with limits
4. **Update regularly**: Pull latest changes and redeploy
5. **Monitor performance**: Use Vercel and Render analytics

---

## What's Next?

After successful deployment:

1. **Test thoroughly** - Try all features
2. **Monitor** - Watch logs for errors
3. **Add real credentials** - SendGrid, Twilio
4. **Scale if needed** - Upgrade plans as usage grows
5. **Continuous improvement** - Add features from ARCHITECTURE.md

---

**Your Messaging System is now live in production! 🎉**

For support:
- Backend issues → Check Render logs
- Frontend issues → Check Vercel logs
- Database issues → Check Neon dashboard
- Code changes → Update GitHub, auto-deploy via Actions

