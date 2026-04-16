# ✅ Verification Checklist

Use this checklist to verify your Messaging System is working correctly.

## 🔧 Local Setup Verification

- [ ] Node.js 18+ installed: `node --version`
- [ ] PostgreSQL 14+ installed/running: `psql --version`
- [ ] npm installed: `npm --version`
- [ ] Git installed: `git --version`
- [ ] Repository cloned: `ls .git`

## 📦 Dependencies Verification

- [ ] Backend dependencies installed: `ls backend/node_modules`
- [ ] Frontend dependencies installed: `ls frontend/node_modules`
- [ ] No installation errors in output
- [ ] package-lock.json exists (consistent dependencies)

## 🗄️ Database Verification

- [ ] Database created: `psql -l | grep messaging_system`
- [ ] Schema loaded: `psql messaging_system -c "\dt"`
- [ ] Tables present:
  - [ ] users table: `psql messaging_system -c "\d users"`
  - [ ] customers table: `psql messaging_system -c "\d customers"`
  - [ ] conversations table: `psql messaging_system -c "\d conversations"`
  - [ ] messages table: `psql messaging_system -c "\d messages"`
  - [ ] channel_configs table: `psql messaging_system -c "\d channel_configs"`
  - [ ] webhooks table: `psql messaging_system -c "\d webhooks"`

## ⚙️ Configuration Verification

### Backend (.env)
- [ ] `.env` file created in `backend/`
- [ ] DATABASE_URL configured: `echo $DATABASE_URL`
- [ ] JWT_SECRET configured (not empty)
- [ ] PORT set to 3000
- [ ] NODE_ENV set to 'development'
- [ ] FRONTEND_URL set correctly

### Frontend (.env.local)
- [ ] `.env.local` file created in `frontend/`
- [ ] NEXT_PUBLIC_API_URL set to `http://localhost:3000`
- [ ] NEXT_PUBLIC_WS_URL set to `http://localhost:3000`

## 🚀 Server Startup Verification

### Backend Server
- [ ] Backend starts without errors: `cd backend && npm run dev`
- [ ] Server listening on port 3000: `lsof -i :3000`
- [ ] Health check works: `curl http://localhost:3000/health`
- [ ] No database connection errors in logs
- [ ] No PORT already in use errors

### Frontend Server
- [ ] Frontend starts without errors: `cd frontend && npm run dev`
- [ ] Server listening on port 3001: `lsof -i :3001`
- [ ] Next.js compilation completes: "ready - started server on ..."
- [ ] No build errors or warnings

## 🌐 Frontend Access Verification

- [ ] Frontend loads: Visit `http://localhost:3001`
- [ ] Login page displays
- [ ] Navigation UI visible
- [ ] No 404 errors in browser console
- [ ] No CORS errors in browser console
- [ ] CSS loads properly (styled correctly)

## 👤 Authentication Verification

- [ ] Register button visible
- [ ] Can click register
- [ ] Form accepts: email, password, name
- [ ] Register request succeeds
- [ ] Token saved to localStorage
- [ ] Redirects to inbox after register
- [ ] Can logout
- [ ] Logout clears token
- [ ] Redirects to login when not authenticated

## 💬 Conversation UI Verification

- [ ] Inbox page displays
- [ ] Conversation list visible (sidebar)
- [ ] Empty state shown (no conversations yet)
- [ ] Search input present
- [ ] Header shows user name and role
- [ ] Logout button visible

## 🔗 WebSocket Verification

- [ ] Browser DevTools → Network → WS
- [ ] WebSocket connection to backend established
- [ ] Connection status: "101 Switching Protocols"
- [ ] No WebSocket error messages
- [ ] Real-time events can be sent

## 📨 Webhook Verification

### Email Webhook
```bash
curl -X POST http://localhost:3000/webhooks/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": "customer@example.com",
    "subject": "Test Message",
    "text": "Hello",
    "html": "<p>Hello</p>"
  }'
```
- [ ] Webhook accepts POST request
- [ ] Response status: 200 or 201
- [ ] Response includes message: "Message received"
- [ ] No error messages in backend logs
- [ ] Check database: `psql messaging_system -c "SELECT * FROM messages;"`
- [ ] Message appears in database
- [ ] Frontend refreshes and shows conversation
- [ ] Customer appears in conversation list

### SMS Webhook (if Twilio configured)
```bash
curl -X POST http://localhost:3000/webhooks/sms \
  -H "Content-Type: application/json" \
  -d '{
    "From": "+1234567890",
    "To": "+0987654321",
    "Body": "SMS Test",
    "MessageSid": "SM123456"
  }'
```
- [ ] Webhook accepts POST request
- [ ] Response status: 200 or 201

## 🐳 Docker Verification

- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Services start: `docker-compose up`
- [ ] PostgreSQL container healthy: `docker-compose ps`
- [ ] Backend container running
- [ ] Frontend container running
- [ ] All services communicate: no connection errors
- [ ] Can access frontend on `http://localhost:3001`

## 📊 Code Verification

- [ ] Backend code exists:
  - [ ] `backend/src/index.js` (500+ lines)
  - [ ] `backend/src/db.js` (present)
  - [ ] `backend/src/db/schema.sql` (1000+ lines)
  - [ ] `backend/src/routes/auth.js` (present)
  - [ ] `backend/src/routes/conversations.js` (present)
  - [ ] `backend/src/routes/webhooks.js` (present)
  - [ ] `backend/src/services/` (3+ services)

- [ ] Frontend code exists:
  - [ ] `frontend/app/login/page.js` (present)
  - [ ] `frontend/app/inbox/page.js` (present)
  - [ ] `frontend/components/` (5+ components)
  - [ ] All CSS modules present

## 📚 Documentation Verification

- [ ] README.md exists (comprehensive)
- [ ] QUICK_START.md exists (step-by-step)
- [ ] API_DOCUMENTATION.md exists (all endpoints)
- [ ] DEPLOYMENT.md exists (production setup)
- [ ] ARCHITECTURE.md exists (system design)
- [ ] PROJECT_SUMMARY.md exists (overview)
- [ ] GETTING_STARTED.md exists (navigation)
- [ ] backend/README.md exists
- [ ] frontend/README.md exists
- [ ] .env.example files present

## 🔒 Git Verification

- [ ] Repository initialized: `git log`
- [ ] Multiple commits present: `git log --oneline | wc -l`
- [ ] Recent commit message relevant
- [ ] .gitignore exists and configured
- [ ] node_modules not tracked: `git status | grep node_modules`

## 🚀 Pre-Deployment Verification

- [ ] All local tests pass
- [ ] No console errors or warnings
- [ ] Environment variables documented
- [ ] Docker setup works
- [ ] Database schema complete
- [ ] API endpoints accessible
- [ ] WebSocket connects successfully
- [ ] Webhook integration works
- [ ] Frontend UI is responsive
- [ ] Authentication works end-to-end

## ✨ Final Verification

- [ ] Can complete full user flow:
  1. Register new account
  2. Login with credentials
  3. View inbox (empty)
  4. Send test webhook
  5. See conversation appear
  6. See message thread
  7. Compose and send reply
  8. See reply in thread
  9. Logout successfully

- [ ] System is production-ready:
  - [ ] Error handling implemented
  - [ ] Input validation present
  - [ ] Security measures in place
  - [ ] Documentation complete
  - [ ] Code is clean and organized
  - [ ] All features work correctly

---

## 📋 If Verification Fails

### Issue: Port Already in Use
```bash
# Find process using port
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Issue: Database Connection Error
```bash
# Test PostgreSQL connection
psql $DATABASE_URL
# Verify DATABASE_URL format
echo $DATABASE_URL
```

### Issue: Module Not Found
```bash
# Reinstall dependencies
rm -rf backend/node_modules frontend/node_modules
npm install --prefix backend
npm install --prefix frontend
```

### Issue: WebSocket Not Connecting
- Check CORS configuration
- Verify WS_URL matches backend URL
- Check firewall/network settings
- Review browser console for errors

### Issue: Webhook Not Working
```bash
# Test webhook with verbose output
curl -v -X POST http://localhost:3000/webhooks/email \
  -H "Content-Type: application/json" \
  -d '{"from":"test@test.com","subject":"Test","text":"Test"}'
# Check backend logs for errors
```

---

## ✅ Success Indicators

If you can check ALL these boxes, your system is working correctly:

- ✅ Frontend loads and displays UI
- ✅ Can register and login
- ✅ Can send test webhook
- ✅ Message appears in conversations
- ✅ WebSocket connects in real-time
- ✅ Can compose and send replies
- ✅ All documentation is present
- ✅ Docker setup works
- ✅ Database has correct schema
- ✅ Code is organized and clean

**Congratulations! Your Messaging System is ready! 🎉**

---

For more help, see:
- [QUICK_START.md](./QUICK_START.md) - Setup guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [TROUBLESHOOTING.md](./DEPLOYMENT.md#troubleshooting) - Common issues

