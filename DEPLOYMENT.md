# Deployment Guide

Deploy the Messaging System to free tier services.

## Prerequisites

- GitHub account
- Vercel account (free tier)
- Render account (free tier)
- Neon or Supabase account (free tier)
- SendGrid account (free tier)
- Twilio account (free trial)

## Step 1: Database Setup (Neon)

1. Go to https://neon.tech
2. Sign up and create new project
3. Copy connection string: `postgresql://...`
4. Save for backend setup

## Step 2: Backend Deployment (Render)

1. Push backend code to GitHub
2. Go to https://render.com
3. Create new "Web Service"
4. Connect GitHub repository
5. Configure:
   - Name: `messaging-system-backend`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables:
   - `DATABASE_URL` (from Neon)
   - `SENDGRID_API_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `TWILIO_WHATSAPP_NUMBER`
   - `JWT_SECRET` (generate random: `openssl rand -base64 32`)
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - `NODE_ENV=production`
   - `PORT=3000`
7. Deploy!

## Step 3: Frontend Deployment (Vercel)

1. Push frontend code to GitHub
2. Go to https://vercel.com
3. Import GitHub project
4. Configure:
   - Framework: `Next.js`
   - Root directory: `frontend`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend.render.com`
   - `NEXT_PUBLIC_WS_URL=https://your-backend.render.com`
6. Deploy!

## Step 4: Setup SendGrid

1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Get API key
4. Set verified sender email

## Step 5: Setup Twilio

1. Go to https://twilio.com
2. Sign up (free trial: $15 credit)
3. Get phone number
4. Get Account SID and Auth Token

## Step 6: Initialize Database

1. Install psql: `brew install postgresql`
2. Run in backend directory:
   ```bash
   psql postgresql://user:pass@host:5432/db < src/db/schema.sql
   ```
3. Or manually execute `schema.sql` via Neon dashboard

## Step 7: Test

1. Visit frontend URL
2. Register new account
3. Login
4. Test sending message via webhook:
   ```bash
   curl -X POST https://your-backend.render.com/webhooks/email \
     -H "Content-Type: application/json" \
     -d '{
       "from": "customer@example.com",
       "subject": "Test",
       "text": "Hello",
       "html": "<p>Hello</p>"
     }'
   ```

## Troubleshooting

### Database Connection Failed
- Check DATABASE_URL is correct
- Verify IP whitelist in Neon dashboard
- Ensure schema.sql was executed

### WebSocket Connection Failed
- Check FRONTEND_URL matches frontend domain
- Ensure CORS is enabled
- Check WebSocket not blocked by firewall

### Emails Not Sending
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid activity logs

### SMS Not Sending
- Verify Twilio credentials
- Check phone number format
- Confirm trial account has credits

## Production Checklist

- [ ] Environment variables set
- [ ] Database initialized
- [ ] SendGrid configured
- [ ] Twilio configured
- [ ] JWT_SECRET changed
- [ ] FRONTEND_URL set correctly
- [ ] HTTPS enforced
- [ ] Monitoring enabled

