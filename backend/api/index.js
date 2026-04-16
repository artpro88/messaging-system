import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from '../src/routes/auth.js';
import conversationRoutes from '../src/routes/conversations.js';
import webhookRoutes from '../src/routes/webhooks.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/webhooks', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Messaging System Backend API' });
});

export default app;

