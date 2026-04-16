# Live Chat Widget Guide

## Overview

Your messaging system now includes a customer-facing live chat widget that can be embedded on any website. Customers can use it to start real-time conversations with your support agents.

## Quick Start

### 1. Embed the Widget on Your Website

Add this single line to any HTML page, just before the closing `</body>` tag:

```html
<script src="https://messaging-system-frontend.vercel.app/livechat-widget.js"></script>
```

That's it! The widget will appear as a purple chat bubble in the bottom-right corner.

### 2. Test the Demo

Visit the demo page to see the widget in action:
- **URL**: https://messaging-system-frontend.vercel.app/demo

### 3. Respond to Customer Messages

1. Login to your admin dashboard: https://messaging-system-frontend.vercel.app/login
2. Go to the Inbox
3. You'll see "Live Chat" conversations from customers
4. Click to open and respond in real-time

## Widget Features

✅ **Real-Time Messaging** - WebSocket-powered instant messaging  
✅ **Customer Identification** - Automatically captures name & email  
✅ **Message History** - Full conversation history preserved  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Beautiful UI** - Modern gradient design with smooth animations  
✅ **Auto-Deploy** - No server setup required  

## How It Works

### Customer Side
1. Customer clicks the chat bubble
2. Widget loads and connects to your backend
3. Customer enters name and email (optional)
4. Messages are sent via HTTP POST to `/api/livechat/messages`
5. Real-time updates via WebSocket

### Agent Side
1. Agent sees customer message in the Inbox
2. Customer appears as a new conversation with "live_chat" channel
3. Agent can respond directly in the admin dashboard
4. Messages are sent back to customer via WebSocket

## Architecture

```
Customer Website
    ↓
[Embed Script: livechat-widget.js]
    ↓
API Calls & WebSocket
    ↓
Backend (Express + Socket.io)
    ↓
PostgreSQL Database
    ↓
Admin Dashboard
    ↓
[Agents can respond]
```

## Technical Details

### API Endpoints

- `POST /api/livechat/conversations` - Start/get a conversation
- `POST /api/livechat/messages` - Send a customer message
- `GET /api/livechat/conversations/:id/messages` - Get message history
- `POST /api/livechat/conversations/:id/close` - Close a conversation

### WebSocket Events

- `livechat-connect` - Customer connects to chat
- `livechat-disconnect` - Customer closes chat
- `new-message` - Broadcast new message to conversation room

### Database

Live chat conversations are stored in your existing database:
- **Channel**: `live_chat`
- **Table**: `conversations` and `messages`
- **Data**: Full message history, customer info, timestamps

## Customization

### Pre-fill Customer Info

Before embedding the script, set localStorage:

```html
<script>
  localStorage.setItem('livechat_email', 'customer@example.com');
  localStorage.setItem('livechat_name', 'John Doe');
</script>
<script src="https://messaging-system-frontend.vercel.app/livechat-widget.js"></script>
```

### Custom Styling

The widget uses inline styles. To customize colors, edit:
- File: `frontend/public/livechat-widget.js`
- Look for: gradient colors `#667eea` and `#764ba2`

## Troubleshooting

### Widget not showing?
- Check browser console for errors
- Verify script is loaded from correct URL
- Check CORS settings on backend

### Messages not sending?
- Verify backend is running
- Check network requests in DevTools
- Ensure `FRONTEND_URL` environment variable is set

### Real-time not working?
- Check WebSocket connection in DevTools
- Verify Socket.io is loaded
- Check backend logs

## Next Steps

1. ✅ Embed on your website
2. ✅ Test with the demo page
3. ✅ Set up agent responses
4. ✅ Customize branding/colors
5. ✅ Monitor conversations in admin dashboard

## Support

For issues or feature requests, check the main README.md or contact support.

