# Messaging System Frontend

Next.js 14 frontend for omnichannel messaging platform.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.render.com
NEXT_PUBLIC_WS_URL=https://your-backend.render.com
```

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3001

### 4. Build for Production
```bash
npm run build
npm start
```

## Project Structure

- `app/` - Next.js app router pages
- `app/login` - Login/Register page
- `app/inbox` - Main dashboard
- `components/` - Reusable components
  - `Header.js` - Top navigation
  - `ConversationList.js` - Sidebar with conversation list
  - `ConversationThread.js` - Message thread display
  - `MessageBubble.js` - Individual message component
  - `ReplyBox.js` - Reply input form

## Features

- ✅ Login/Register
- ✅ View conversations
- ✅ Real-time message updates via WebSocket
- ✅ Send replies via Email, SMS, WhatsApp
- ✅ Search conversations
- ✅ Channel badges and status indicators

## Deployment on Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_WS_URL`
4. Deploy!

See [DEPLOYMENT.md](../DEPLOYMENT.md) for full instructions.

