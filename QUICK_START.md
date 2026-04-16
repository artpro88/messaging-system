# Quick Start Guide

Get the Messaging System up and running in 10 minutes locally.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or use Neon online)
- npm or yarn

## Local Setup (5 minutes)

### 1. Clone and Install
```bash
cd Messaging\ System
npm install --prefix backend
npm install --prefix frontend
```

### 2. Setup Database
If using local PostgreSQL:
```bash
createdb messaging_system
psql messaging_system < backend/src/db/schema.sql
```

If using Neon: Copy your connection string to `backend/.env`

### 3. Configure Backend
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
DATABASE_URL=postgresql://localhost/messaging_system
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

For email/SMS (optional for local testing):
- Leave SendGrid blank (will mock)
- Leave Twilio blank (will mock)

### 4. Configure Frontend
```bash
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
EOF
```

### 5. Start Services
In separate terminals:

Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

Frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3001
```

## First Steps

1. **Open** http://localhost:3001
2. **Register** - Create test agent account
3. **Login** - With your credentials
4. **Test webhook** - In another terminal:

```bash
curl -X POST http://localhost:3000/webhooks/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@example.com",
    "subject": "Test Message",
    "text": "Hello from test",
    "html": "<p>Hello from test</p>"
  }'
```

5. **View** - Conversation appears in your inbox!

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for cloud deployment:
- **Frontend**: Vercel (free)
- **Backend**: Render (free)
- **Database**: Neon (free)
- **Email**: SendGrid (free)
- **SMS**: Twilio (paid)

## Project Structure

```
Messaging System/
├── backend/                    # Express.js + Socket.io
│   ├── src/
│   │   ├── index.js           # Main server
│   │   ├── db.js              # Database
│   │   ├── db/schema.sql      # Database schema
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Channel services
│   │   └── utils/             # Auth utilities
│   ├── .env.example
│   └── package.json
├── frontend/                   # Next.js 14
│   ├── app/
│   │   ├── login/             # Auth page
│   │   └── inbox/             # Main dashboard
│   ├── components/            # Reusable components
│   ├── .env.local
│   └── package.json
├── API_DOCUMENTATION.md        # API reference
├── DEPLOYMENT.md               # Production setup
├── QUICK_START.md              # This file
└── README.md
```

## Features

✅ Multi-channel unified inbox (Email, SMS, WhatsApp, Live Chat)
✅ Agent authentication with roles
✅ Real-time updates via WebSocket
✅ Conversation threads
✅ Send replies via any channel
✅ Search conversations
✅ Channel indicators and status badges

## Troubleshooting

### "Port 3000 already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### Database connection error
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Try `psql $DATABASE_URL` to test connection

### Frontend can't reach backend
- Ensure backend is running on 3000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

### WebSocket connection fails
- Verify backend is running
- Check WS_URL is correct
- Reload frontend page

## Next Steps

1. **Add real SendGrid credentials** for email
2. **Add Twilio credentials** for SMS/WhatsApp
3. **Deploy to production** - See DEPLOYMENT.md
4. **Customize UI** - Edit components/ files
5. **Extend features** - Add agent status, typing indicators, etc.

## Support

- Backend: See [backend/README.md](./backend/README.md)
- Frontend: See [frontend/README.md](./frontend/README.md)
- API: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Deployment: See [DEPLOYMENT.md](./DEPLOYMENT.md)

Happy messaging! 🚀

