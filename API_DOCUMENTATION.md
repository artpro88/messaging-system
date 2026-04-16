# API Documentation

## Authentication

All protected endpoints require `Authorization: Bearer {token}` header.

### POST /api/auth/register
Register new agent/admin account.

```json
{
  "email": "agent@example.com",
  "password": "secure_password",
  "name": "Agent Name"
}
```

Response: `{ user: {...}, token: "..." }`

### POST /api/auth/login
Login with credentials.

```json
{
  "email": "agent@example.com",
  "password": "secure_password"
}
```

Response: `{ user: {...}, token: "..." }`

### GET /api/auth/me
Get current authenticated user.

Response: `{ id, email, name, role }`

## Conversations

### GET /api/conversations
List all conversations (paginated).

Query params: `limit=50&offset=0`

Response: Array of conversations with customer info and last message time.

### GET /api/conversations/:id
Get single conversation with full message history.

Response:
```json
{
  "id": 1,
  "customer_id": 1,
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone_number": "+1234567890",
  "status": "open",
  "messages": [
    {
      "id": 1,
      "content": "Hello",
      "channel": "email",
      "direction": "incoming",
      "sender_name": "Agent Name",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### POST /api/conversations/:id/reply/email
Send email reply.

```json
{
  "to": "customer@example.com",
  "subject": "Re: Your inquiry",
  "html": "<p>Response</p>",
  "text": "Response"
}
```

### POST /api/conversations/:id/reply/sms
Send SMS reply.

```json
{
  "to": "+1234567890",
  "message": "SMS text"
}
```

### POST /api/conversations/:id/reply/whatsapp
Send WhatsApp message.

```json
{
  "to": "+1234567890",
  "message": "WhatsApp text"
}
```

### PATCH /api/conversations/:id/status
Update conversation status.

```json
{
  "status": "closed"
}
```

## Webhooks

### POST /webhooks/email
Receive incoming email.

```json
{
  "from": "customer@example.com",
  "subject": "Customer inquiry",
  "text": "Plain text",
  "html": "<p>HTML content</p>"
}
```

### POST /webhooks/sms
Receive incoming SMS (from Twilio).

```json
{
  "From": "+1234567890",
  "To": "+0987654321",
  "Body": "SMS message",
  "MessageSid": "SM..."
}
```

### POST /webhooks/whatsapp
Receive incoming WhatsApp (from Twilio).

```json
{
  "From": "whatsapp:+1234567890",
  "To": "whatsapp:+0987654321",
  "Body": "WhatsApp message",
  "MessageSid": "MM..."
}
```

### POST /webhooks/live-chat
Receive live chat message.

```json
{
  "customerId": 123,
  "message": "Live chat message"
}
```

## WebSocket Events

Connect: `io(WS_URL, { auth: { token } })`

### Client → Server
- `join-conversation` - Join conversation room
- `leave-conversation` - Leave conversation room
- `typing` - Send typing indicator
- `stop-typing` - Stop typing indicator

### Server → Client
- `message-received` - New message in conversation
- `agent-typing` - Agent is typing
- `agent-stopped-typing` - Agent stopped typing

## Error Handling

All errors return JSON with error message:

```json
{
  "error": "Invalid credentials"
}
```

HTTP Status Codes:
- 200 - Success
- 201 - Created
- 400 - Bad request
- 401 - Unauthorized
- 403 - Forbidden
- 500 - Server error

