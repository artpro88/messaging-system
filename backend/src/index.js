import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversations.js';
import webhookRoutes from './routes/webhooks.js';
import livechatRoutes from './routes/livechat.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes (MUST be before routes)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/livechat', livechatRoutes);
app.use('/webhooks', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join conversation room
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // New message notification
  socket.on('new-message', (conversationId) => {
    io.to(`conversation:${conversationId}`).emit('message-received');
  });

  // Agent typing
  socket.on('typing', (conversationId) => {
    socket.broadcast.to(`conversation:${conversationId}`).emit('agent-typing');
  });

  socket.on('stop-typing', (conversationId) => {
    socket.broadcast.to(`conversation:${conversationId}`).emit('agent-stopped-typing');
  });

  // Live chat customer connect
  socket.on('livechat-connect', (conversationId) => {
    socket.join(`livechat:${conversationId}`);
    console.log(`Customer ${socket.id} connected to livechat:${conversationId}`);
  });

  // Live chat customer disconnect
  socket.on('livechat-disconnect', (conversationId) => {
    socket.leave(`livechat:${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
});

export { io, app, httpServer };

