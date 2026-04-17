# Deploy Backend with WebSocket Support to Fly.io

## Problem
Vercel serverless doesn't support persistent WebSocket connections needed for real-time updates.

## Solution
Deploy the backend to **Fly.io** where WebSocket connections are fully supported.

## Prerequisites
1. Fly.io account (free tier available): https://fly.io/app/sign-up
2. Fly CLI installed: `brew install flyctl` (macOS) or see https://fly.io/docs/getting-started/installing-flyctl/
3. PostgreSQL database (can use Fly.io's managed Postgres)

## Step 1: Set Up Fly.io Database

```bash
# Create a Postgres cluster on Fly.io
flyctl postgres create --name messaging-db

# Get the connection string (will be provided after creation)
# Copy the DATABASE_URL from the output
```

## Step 2: Configure Environment Variables

```bash
# From the Messaging System/backend directory
cd backend

# Set production environment variables
flyctl secrets set \
  DATABASE_URL="postgresql://..." \
  JWT_SECRET="your-production-secret" \
  SENDGRID_API_KEY="your-key" \
  TWILIO_ACCOUNT_SID="your-sid" \
  TWILIO_AUTH_TOKEN="your-token" \
  TWILIO_PHONE_NUMBER="your-number" \
  TWILIO_WHATSAPP_NUMBER="your-number" \
  WEBHOOK_SECRET="your-webhook-secret" \
  FRONTEND_URL="https://messaging-system-frontend.vercel.app"
```

## Step 3: Deploy to Fly.io

```bash
# From backend directory
cd backend

# Create the app
flyctl launch --name messaging-system-backend

# Or deploy if already created
flyctl deploy

# Get your backend URL
flyctl info

# Your backend will be at: https://messaging-system-backend.fly.dev
```

## Step 4: Update Frontend to Use Fly.io Backend

Update `frontend/.env.production` or Vercel environment variables:

```
NEXT_PUBLIC_API_URL=https://messaging-system-backend.fly.dev
NEXT_PUBLIC_WS_URL=https://messaging-system-backend.fly.dev
```

**In Vercel Dashboard**:
1. Go to Settings → Environment Variables
2. Set both URLs to your Fly.io backend URL
3. Redeploy frontend

## Step 5: Update Widget Embed Script

The widget script in `frontend/public/livechat-widget.js` detects the environment:
- On `vercel.app`: Uses Fly.io backend URL
- On `localhost`: Uses `localhost:3000`

The detection is automatic, but verify in the code around line 160-165.

## Step 6: Test the Integration

1. Open https://messaging-system-frontend.vercel.app/demo
2. Send a message
3. Open https://messaging-system-frontend.vercel.app/inbox
4. **New conversations should appear immediately** (no refresh!)
5. Send a reply
6. **Reply appears immediately in the widget**

## Fly.io Dashboard

Monitor your deployment:
```bash
# View logs
flyctl logs

# Check app status
flyctl status

# Scale if needed
flyctl scale vm shared-cpu-1x --memory 256
```

## Troubleshooting

### Connection Refused
- Check if backend is running: `flyctl status`
- Check logs: `flyctl logs`
- Verify DATABASE_URL is correct

### WebSocket Not Connecting
- Check CORS settings in `backend/src/index.js`
- Verify frontend URL in CORS allowed origins
- Check browser console for Socket.io connection errors

### Database Connection Issues
- Verify DATABASE_URL includes correct password
- Check if database is accessible from Fly.io
- May need to set up IP allowlist if using external DB

## Alternative: Use Railway.app

Similar to Fly.io but simpler:
1. Connect GitHub repo to Railway
2. Select backend directory
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy automatically

See: https://railway.app

## Cost Estimation

- **Fly.io**: Free tier includes shared-cpu VM + 3GB Postgres
- **Railway**: Pay-as-you-go (typically $5-10/month for light usage)
- **Vercel Frontend**: Continues to be free tier

## After Deployment

Once backend is on Fly.io:
✅ New conversations appear in real-time
✅ Agent replies visible immediately in widget
✅ Full bidirectional communication working
✅ Ready for production use

