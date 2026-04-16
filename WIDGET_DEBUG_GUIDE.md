# Live Chat Widget Debug Guide

## Quick Start

1. **Start both servers** (if not already running):
   ```bash
   # Backend (Terminal 1)
   cd backend && npm start
   
   # Frontend (Terminal 2)
   cd frontend && npm run dev
   ```

2. **Open test page**:
   - Go to http://localhost:8000/test-widget.html
   - OR directly test the widget at http://localhost:3001

## Testing Steps

### Step 1: Verify Servers are Running
```bash
curl http://localhost:3000/health
# Should see: {"status":"ok"}

curl http://localhost:3001
# Should see: Next.js homepage
```

### Step 2: Open Browser Console
1. Open http://localhost:8000/test-widget.html
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Refresh the page

### Step 3: Test Widget Loading
1. Click "Load Widget Script" button
2. Look for the purple chat bubble (💬) in bottom-right corner
3. Check console for logs:
   - Look for: "Widget script loaded successfully!"
   - Look for any RED ERROR messages

### Step 4: Test Message Sending
1. Click the purple chat bubble to open the widget
2. Check console for:
   - "Toggle button clicked"
   - "Widget opened, initializing chat..."
   - "Chat initialized! conversationId: X"

3. Type a message in the input field
4. Click "Send" button or press Enter
5. Check console for:
   - "Send button clicked" or "Enter key pressed"
   - "Sending message to API: {...}"
   - "Response received: 200 OK"
   - "Message sent successfully: {...}"

6. The message should appear in the widget

## Common Issues and Solutions

### Issue: No chat bubble appears
- **Check**: Console shows "Widget script loaded successfully!"?
- **Solution**: 
  - Verify frontend is running on port 3001: `curl http://localhost:3001`
  - Check if widget script is served: `curl http://localhost:3001/livechat-widget.js`

### Issue: Click chat bubble but nothing happens
- **Check**: "Toggle button clicked" appears in console?
- **Solutions**:
  - Clear browser cache (Ctrl+Shift+R)
  - Check for JavaScript errors (RED messages in console)
  - Check if conversation API responds: Click "Create Conversation" test button

### Issue: Message doesn't send
- **Check**: "Sending message to API" message appears in console?
- **Check**: Response status in console (should be "200")
- **Solutions**:
  - Verify backend is running: `curl http://localhost:3000/health`
  - Check if conversationId is set: Look for "Chat initialized! conversationId: X"
  - Check backend logs for database errors
  - Run manual API test: Click "Create Conversation" then "Send Message" on test page

### Issue: API call fails
- **Check**: Response status in console (look for error codes like 404, 500)
- **Check**: Backend console output for database errors
- **Solutions**:
  - Restart backend: `cd backend && npm start`
  - Check database connection: Database must exist (`messaging_system`)
  - Check `.env` file has correct DATABASE_URL

## Manual API Testing

Use the test page buttons:

1. **Create Conversation**: Tests conversation creation endpoint
2. **Send Message**: Sends a message to existing conversation
3. **Load Widget**: Loads the actual widget script

Each button shows response in black terminal output.

## Logging Output Examples

### Successful Conversation Creation:
```
[timestamp] Chat initialized! conversationId: 5 customerId: 10
```

### Successful Message Send:
```
[timestamp] Sending message to API: {conversationId: "5", content: "Hello", ...}
[timestamp] Response received: 200 OK
[timestamp] Message sent successfully: {id: 42, createdAt: "2026-04-16T..."}
```

### API Error:
```
[timestamp] Server error: 500 Internal Server Error
[timestamp] Check backend console for database errors
```

## Need More Help?

1. **Check backend logs**: Look for "Executed query" messages and any errors
2. **Enable CORS debugging**: Check Network tab in DevTools
3. **Test API directly**: Use curl commands in terminal
4. **Check database**: Verify data is being saved

---

**Widget URL**: http://localhost:3001/livechat-widget.js  
**API Base**: http://localhost:3000/api/livechat  
**Test Page**: http://localhost:8000/test-widget.html

