# Quick Start: Deploy Backend to Fly.io

This is the ONLY way to get real-time WebSocket functionality working in production.

## What You Need
1. Fly.io account (free): https://fly.io/app/sign-up
2. Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
3. Your database credentials (or create a new PostgreSQL on Fly.io)

## Installation (2 minutes)

### 1. Install Fly CLI

**macOS:**
```bash
brew install flyctl
```

**Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows:** https://fly.io/docs/getting-started/installing-flyctl/

### 2. Login to Fly.io

```bash
flyctl auth login
# Opens browser, login with your Fly.io account
```

### 3. Create PostgreSQL Database (if needed)

```bash
# Create a managed PostgreSQL database
flyctl postgres create --name messaging-db

# Wait for completion (~5 minutes)
# Copy the connection string (DATABASE_URL) - you'll need it
```

Alternatively, use your existing PostgreSQL database.

## Deployment (5 minutes)

### 4. Deploy Backend

```bash
cd Messaging\ System/backend

# Launch the app (only first time)
flyctl launch --name messaging-system-backend

# When prompted:
# - Choose region closest to you
# - Say NO to database setup (you'll do it manually)
# - Say YES to deploy now
```

### 5. Configure Database Secret

```bash
flyctl secrets set DATABASE_URL="your-database-url-here"

# Example:
# flyctl secrets set DATABASE_URL="postgresql://user:password@host:5432/messaging_system"
```

### 6. Redeploy with Database

```bash
flyctl deploy
```

### 7. Get Your Backend URL

```bash
flyctl info
```

You'll see something like:
```
App: messaging-system-backend
Hostname: messaging-system-backend.fly.dev
```

**Note the hostname** - this is your WebSocket server URL!

## Update Frontend (1 minute)

### 8. Update Widget Script

The widget script has already been updated to use `https://messaging-system-backend.fly.dev`

Just need to commit and redeploy frontend:

```bash
git add frontend/public/livechat-widget.js
git commit -m "Update widget to use Fly.io backend URL for WebSocket support"
git push origin main
```

Vercel will automatically redeploy.

### 9. Update Inbox WebSocket Connection

The inbox automatically picks up the frontend's environment variables.

In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Make sure you have (or add):
   ```
   NEXT_PUBLIC_WS_URL=https://messaging-system-backend.fly.dev
   NEXT_PUBLIC_API_URL=https://messaging-system-backend.fly.dev
   ```
4. Redeploy

## Test It (2 minutes)

1. Open https://messaging-system-frontend.vercel.app/demo
2. Fill form and send message "Hello"
3. Open https://messaging-system-frontend.vercel.app/inbox (in another tab)
4. **✅ Conversation appears immediately** (no refresh!)
5. Click the conversation
6. Type "Hi there" and click Send
7. **✅ Message appears in widget immediately**

If it doesn't work:
- Check browser console (F12) for WebSocket connection errors
- Run `flyctl logs` to see backend logs
- Make sure CORS is allowing your frontend domain

## Troubleshooting

### "Connection refused"
```bash
# Check if backend is running
flyctl status

# View logs to see error
flyctl logs

# Redeploy if needed
flyctl deploy
```

### "WebSocket connection failed"
- Check your `NEXT_PUBLIC_WS_URL` environment variable
- Make sure it points to `https://messaging-system-backend.fly.dev`
- Check browser console for exact error
- May need to wait a few minutes for Vercel to redeploy

### "Database connection error"
- Verify DATABASE_URL is correct
- Check if database is accessible from Fly.io
- Try running migrations:
  ```bash
  flyctl ssh console
  # Inside console
  node src/db/initDb.js
  exit
  ```

## Monitoring

View logs in real-time:
```bash
flyctl logs -f
```

Check app health:
```bash
flyctl status
```

## That's It! 🎉

Your messaging system now has:
✅ Real-time new conversation notifications
✅ Instant message delivery to widget
✅ Bidirectional communication
✅ Production-grade WebSocket support

Total cost: **FREE** on Fly.io free tier!

