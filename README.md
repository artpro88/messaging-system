# 📧 Messaging System

A full-stack omnichannel customer messaging platform similar to Intercom/Rocket.Chat. Unified inbox for managing customer conversations across Email, SMS, WhatsApp, and Live Chat channels with real-time updates.

## ✨ Features

- **🎯 Unified Inbox** - Manage all customer conversations from one place
- **📱 Multi-Channel** - Email, SMS, WhatsApp, Live Chat support
- **⚡ Real-time Updates** - WebSocket integration for instant notifications
- **🔐 Secure Authentication** - JWT-based with role-based access control
- **💬 Rich Conversations** - Full message threads with channel indicators
- **🎨 Modern UI** - Clean, responsive agent dashboard
- **☁️ Cloud-Ready** - Free-tier deployment with Vercel, Render, Neon

## 🏗️ Tech Stack

### Backend
- **Express.js** - Lightweight HTTP server
- **Socket.io** - Real-time WebSocket communication
- **PostgreSQL** - Relational database
- **JWT** - Authentication and authorization

### Frontend
- **Next.js 14** - Modern React framework
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client
- **CSS Modules** - Component styling

### External Services
- **SendGrid** - Email delivery (100 emails/day free)
- **Twilio** - SMS & WhatsApp ($15 free trial)
- **Neon/Supabase** - PostgreSQL hosting (free tier)
- **Render** - Backend hosting (free tier)
- **Vercel** - Frontend hosting (free tier)

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get running locally in 10 minutes
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and extension points
- **[backend/README.md](./backend/README.md)** - Backend-specific setup
- **[frontend/README.md](./frontend/README.md)** - Frontend-specific setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Neon account)
- npm/yarn

### Local Development (5 minutes)

```bash
# 1. Clone and install
npm install --prefix backend
npm install --prefix frontend

# 2. Setup database
createdb messaging_system
psql messaging_system < backend/src/db/schema.sql

# 3. Configure environment
cp backend/.env.example backend/.env
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
EOF

# Edit backend/.env with:
# DATABASE_URL=postgresql://localhost/messaging_system
# JWT_SECRET=your-secret
# FRONTEND_URL=http://localhost:3001

# 4. Start servers (in separate terminals)
cd backend && npm run dev      # http://localhost:3000
cd frontend && npm run dev     # http://localhost:3001

# 5. Register & Login
# Visit http://localhost:3001 and create an account
```

### Test with Webhook

```bash
curl -X POST http://localhost:3000/webhooks/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": "customer@example.com",
    "subject": "Test Message",
    "text": "Hello from test",
    "html": "<p>Hello from test</p>"
  }'
```

## 🐳 Docker Setup

```bash
# Start all services
docker-compose up

# Services running on:
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
# Database: postgres://postgres:postgres@localhost:5432/messaging_system
```

## ☁️ Production Deployment

Deploy to free-tier cloud services in minutes:

1. **Database** - Create Neon PostgreSQL instance
2. **Backend** - Deploy to Render Web Service
3. **Frontend** - Deploy to Vercel
4. **Email** - Configure SendGrid API
5. **SMS** - Configure Twilio credentials

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions.

## 📊 Project Structure

```
Messaging System/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express server + Socket.io
│   │   ├── db.js                 # Database connection
│   │   ├── db/schema.sql         # Database schema
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.js           # Authentication
│   │   │   ├── conversations.js  # Conversation management
│   │   │   └── webhooks.js       # Incoming webhooks
│   │   ├── services/             # Business logic
│   │   │   ├── conversationService.js
│   │   │   ├── emailService.js
│   │   │   └── smsService.js
│   │   └── utils/
│   │       └── auth.js           # JWT & password utilities
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── app/
│   │   ├── login/                # Login/Register page
│   │   ├── inbox/                # Main dashboard
│   │   ├── layout.js             # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/               # Reusable components
│   │   ├── Header.js
│   │   ├── ConversationList.js
│   │   ├── ConversationThread.js
│   │   ├── MessageBubble.js
│   │   └── ReplyBox.js
│   ├── .env.local                # Environment variables
│   ├── next.config.js
│   ├── package.json
│   └── README.md
├── docker-compose.yml            # Docker setup
├── API_DOCUMENTATION.md          # API reference
├── ARCHITECTURE.md               # System design
├── DEPLOYMENT.md                 # Production deployment
├── QUICK_START.md                # Quick start guide
└── README.md                     # This file
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new agent account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user info

### Conversations
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:id` - Get single conversation with messages
- `POST /api/conversations/:id/reply/email` - Send email reply
- `POST /api/conversations/:id/reply/sms` - Send SMS reply
- `POST /api/conversations/:id/reply/whatsapp` - Send WhatsApp
- `PATCH /api/conversations/:id/status` - Update conversation status

### Webhooks (No Auth Required)
- `POST /webhooks/email` - Receive incoming email
- `POST /webhooks/sms` - Receive SMS from Twilio
- `POST /webhooks/whatsapp` - Receive WhatsApp from Twilio
- `POST /webhooks/live-chat` - Receive live chat message

## 🔌 WebSocket Events

### Client → Server
- `join-conversation` - Join conversation room
- `leave-conversation` - Leave conversation room
- `typing` - Send typing indicator
- `stop-typing` - Stop typing

### Server → Client
- `message-received` - New message in conversation
- `agent-typing` - Agent is typing
- `agent-stopped-typing` - Typing stopped

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=random-secret-key
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
SENDGRID_API_KEY=optional
TWILIO_ACCOUNT_SID=optional
TWILIO_AUTH_TOKEN=optional
TWILIO_PHONE_NUMBER=optional
TWILIO_WHATSAPP_NUMBER=optional
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Authentication](https://jwt.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is provided as-is for educational and development purposes.

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Database Connection Failed
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Frontend Can't Reach Backend
- Confirm backend running on correct port
- Check NEXT_PUBLIC_API_URL in .env.local
- Review browser console for CORS errors

### WebSocket Connection Failed
- Verify backend is running
- Check WS_URL matches backend URL
- Ensure firewall allows WebSocket connections

## ✅ Checklist for Getting Started

- [ ] Clone repository
- [ ] Install dependencies (backend + frontend)
- [ ] Create database and run schema.sql
- [ ] Configure environment variables
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Register test account
- [ ] Test webhook integration
- [ ] Deploy to production (optional)

---

**Ready to get started?** See [QUICK_START.md](./QUICK_START.md) for step-by-step instructions!
