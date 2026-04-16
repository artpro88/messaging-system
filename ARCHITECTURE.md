# Architecture Guide

Technical design and extension points.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                    │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │ Auth Pages   │  │  Inbox UI      │  │  Real-time       │ │
│  │ (Login/Reg)  │  │  - Conversation│  │  Updates         │ │
│  │              │  │    List        │  │  (WebSocket)     │ │
│  │              │  │  - Thread View │  │                  │ │
│  │              │  │  - Reply Box   │  │                  │ │
│  └──────────────┘  └────────────────┘  └──────────────────┘ │
└────────────┬──────────────────────────────────────────────────┘
             │ HTTP + WebSocket
┌────────────▼──────────────────────────────────────────────────┐
│               Backend (Express.js + Socket.io)                │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ Auth Routes  │  │ Conversation   │  │ Webhook Routes   │  │
│  │ (JWT)        │  │ Routes         │  │ (Email, SMS,     │  │
│  │              │  │                │  │  WhatsApp, Chat) │  │
│  └──────────────┘  └────────────────┘  └──────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Services Layer                              │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Conversation Service     │ Email Service            │ │ │
│  │  │ - getOrCreateCustomer    │ - sendEmail              │ │ │
│  │  │ - getOrCreateConversation│ - parseIncomingEmail    │ │ │
│  │  │ - addMessage             │                          │ │ │
│  │  │ - listConversations      │ SMS Service              │ │ │
│  │  │ - updateStatus           │ - sendSMS                │ │ │
│  │  │                          │ - sendWhatsApp           │ │ │
│  │  │                          │ - parseIncomingSMS       │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Database Layer (PostgreSQL)                 │ │
│  │  - users          - messages                            │ │
│  │  - customers      - channel_configs                     │ │
│  │  - conversations  - webhooks                            │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────┬──────────────────────────────────────────────────┘
             │
┌────────────▼──────────────────────────────────────────────────┐
│              External Services (APIs)                         │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ SendGrid     │  │ Twilio (SMS)   │  │ Twilio WhatsApp  │  │
│  │ - Email API  │  │ - SMS API      │  │ - WhatsApp API   │  │
│  └──────────────┘  └────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Incoming Message (Email Example)

```
Email arrives → Webhook (/webhooks/email)
  ↓
Parse email (sender, subject, content)
  ↓
getOrCreateCustomer (find by email)
  ↓
getOrCreateConversation (find/create for customer)
  ↓
addMessage (store in database)
  ↓
Socket.io broadcast (notify agents)
  ↓
Frontend receives update → UI refreshes
```

### Outgoing Reply

```
Agent clicks "Send" → ReplyBox component
  ↓
POST /api/conversations/:id/reply/{channel}
  ↓
Route validates customer contact info
  ↓
Call channel service (Email/SMS/WhatsApp)
  ↓
External API sends message
  ↓
addMessage (store in database)
  ↓
Socket.io broadcast (update other agents)
  ↓
Frontend refreshes conversation thread
```

## Authentication Flow

```
User Registration/Login → Generate JWT Token
  ↓
Client stores token (localStorage)
  ↓
All subsequent requests include token in Authorization header
  ↓
authenticateToken middleware verifies
  ↓
Request proceeds with req.user populated
```

## WebSocket Flow

```
Client connects → Socket.io auth with token
  ↓
Server validates token
  ↓
Client joins conversation room (join-conversation event)
  ↓
When message arrives → broadcast to conversation room
  ↓
Connected agents receive message-received event
  ↓
Frontend fetches updated conversation
```

## Database Schema

### Users
- id, email, password_hash, name, role, status, timestamps

### Customers
- id, email, phone_number, name, whatsapp_number, avatar_url, metadata, timestamps

### Conversations
- id, customer_id, assigned_agent_id, subject, status, priority, last_message_at, timestamps

### Messages
- id, conversation_id, sender_id, content, channel, direction, status, external_id, metadata, created_at

### Channel_Configs
- id, name, type, config (JSONB), enabled, timestamps

### Webhooks
- id, event_type, payload, status, retries, created_at

## Scaling Considerations

### Database
- Current: Single PostgreSQL instance
- Scale: Add read replicas, caching layer (Redis)
- Indexes on: conversation_id, customer_id, created_at

### Backend
- Current: Single Node.js process
- Scale: Use clustering, load balancing, message queues
- Consider: BullMQ for async tasks (email sending)

### Real-time
- Current: Socket.io with in-memory adapter
- Scale: Use Redis adapter for multi-server setup
- Use Socket.io namespaces for organization

### File Storage
- Current: None implemented
- Extend: S3 for message attachments
- Add to messages table: file_id, file_url

## Extension Points

### Adding New Channels
1. Create new service in `backend/src/services/{channel}Service.js`
2. Implement send and parse functions
3. Add webhook route in `routes/webhooks.js`
4. Add UI in `ReplyBox.js` component
5. Update channel icons in `MessageBubble.js`

### Adding Features
- **Typing Indicators**: Already set up, enable in ReplyBox
- **Attachments**: Add file_url to messages, S3 integration
- **Agent Presence**: Track online status via Socket.io
- **Conversation Assignment**: Add assigned_agent_id logic
- **Message Search**: Add full-text search to database
- **Analytics**: Add dashboard with message counts, response times

