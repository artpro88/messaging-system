# Testing the Three Live Chat Fixes

## Setup
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:3001`
- Database: PostgreSQL with messaging_system

## Test 1: Channel Auto-Selection (LIVE CHAT instead of EMAIL)

### What was fixed:
- `getConversation()` now returns `channel` from FIRST message (customer's contact channel)
- `listConversations()` now returns `channel` from FIRST message
- `ReplyBox.js` now updates channel via useEffect when conversation changes

### How to test:
1. Open browser console (F12)
2. Go to http://localhost:3001/demo
3. Fill form: email, name, message and click "Send Message"
4. Go to http://localhost:3001/inbox (login if needed)
5. **Expected**: New conversation appears in list with channel = "live_chat"
6. **Expected**: When you click the conversation, ReplyBox shows "💭 Live Chat" selected (not "📧 Email")
7. **Check console**: Look for "New conversation received:" log

### To verify in database:
```sql
SELECT c.id, 
       (SELECT channel FROM messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1) as first_message_channel
FROM conversations c LIMIT 5;
```

---

## Test 2: New Conversations Auto-Appear (No Refresh Needed)

### What was fixed:
- `POST /api/livechat/conversations` now broadcasts `new-conversation` event
- `inbox/page.js` listens for `new-conversation` WebSocket event
- Inbox automatically adds new conversations to the list in real-time

### How to test:
1. Open http://localhost:3001/inbox in browser 1 (keep it open)
2. Open http://localhost:3001/demo in browser 2
3. Fill the form and send a message
4. **Expected**: New conversation appears in browser 1's inbox IMMEDIATELY (no refresh needed)
5. **Check console browser 1**: Look for "New conversation received:" log
6. **Check backend logs**: Look for "Broadcasting new conversation X to inbox"

---

## Test 3: Replies Appear in Widget (Real-Time)

### What was fixed:
- `POST /conversations/:id/reply/live_chat` now broadcasts message to widget
- Widget listens for `new-message` event on `livechat:${conversationId}` room
- Message format: `{ id, content, direction: 'incoming', createdAt, status }`

### How to test:
1. Open http://localhost:3001/demo (browser 1 - customer side)
2. Send a message via the widget
3. Go to http://localhost:3001/inbox (browser 2 - agent side) 
4. Select the conversation that appeared
5. Type a reply and click "Send" (ensure "💭 Live Chat" is selected)
6. **Expected**: Reply appears in widget in browser 1 IMMEDIATELY
7. **Check console widget**: Look for "Received new message:" log
8. **Check backend logs**: Look for "Broadcasting outgoing message" log

---

## Console Logs to Watch For:

### Frontend (Inbox):
```
New conversation received: {id: X, name: "...", email: "..."}
```

### Frontend (Widget):
```
Chat initialized! conversationId: X
livechat-connect emitted for conversation: X
Received new message: {content: "...", direction: "incoming"}
```

### Backend:
```
Broadcasting new conversation X to inbox
Broadcasting outgoing message to conversation:X
Customer X connected to livechat:X
```

---

## If Tests Fail:

1. **New conversations not appearing**: Check WebSocket connection status
   - In inbox, check if socket.io connects
   - Backend should log: "User connected: [socket.id]"
   
2. **Replies not in widget**: Verify the broadcast room name
   - Widget joins: `livechat:${conversationId}`
   - Backend broadcasts to: `livechat:${conversationId}`
   - These MUST match exactly

3. **Wrong channel shows**: Check database directly
   - Verify first message has channel='live_chat'
   - Verify agent's reply messages don't have channel set (NULL)

