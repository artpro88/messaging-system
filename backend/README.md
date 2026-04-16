# Messaging System Backend

Node.js + Express backend for omnichannel messaging platform.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Create PostgreSQL database:
```bash
createdb messaging_system
```

Run schema:
```bash
psql messaging_system < src/db/schema.sql
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update with your credentials:
- `DATABASE_URL`: PostgreSQL connection string
- `SENDGRID_API_KEY`: SendGrid API key
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: Twilio credentials
- `JWT_SECRET`: Change to random secret

### 4. Run Server
Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Conversations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get conversation details
- `POST /api/conversations/:id/reply/email` - Send email reply
- `POST /api/conversations/:id/reply/sms` - Send SMS reply
- `POST /api/conversations/:id/reply/whatsapp` - Send WhatsApp message
- `PATCH /api/conversations/:id/status` - Update status

### Webhooks
- `POST /webhooks/email` - Incoming email
- `POST /webhooks/sms` - Incoming SMS
- `POST /webhooks/whatsapp` - Incoming WhatsApp
- `POST /webhooks/live-chat` - Incoming live chat

## Database Schema

- **users**: Agent/Admin accounts
- **customers**: End users (unified across channels)
- **conversations**: Threads (one per customer)
- **messages**: Individual messages
- **channel_configs**: Channel credentials

## WebSocket Events

- `join-conversation` - Join conversation room
- `leave-conversation` - Leave conversation room
- `new-message` - New message notification
- `typing` - Agent typing indicator
- `stop-typing` - Agent stopped typing

## Deployment on Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables in Render dashboard
4. Deploy!

See [DEPLOYMENT.md](../DEPLOYMENT.md) for full instructions.

