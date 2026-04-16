import express from 'express';
import { authenticateToken } from '../utils/auth.js';
import * as conversationService from '../services/conversationService.js';
import * as emailService from '../services/emailService.js';
import * as smsService from '../services/smsService.js';

const router = express.Router();

// List conversations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const conversations = await conversationService.listConversations(limit, offset);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get single conversation
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const conversation = await conversationService.getConversation(req.params.id);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Send reply via email
router.post('/:id/reply/email', authenticateToken, async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'Email, subject required' });
    }

    const result = await emailService.sendEmail(to, subject, html, text);
    const message = await conversationService.addMessage(
      req.params.id,
      req.user.id,
      text || html,
      'email',
      'outgoing',
      result.id
    );

    res.json({ message, externalResult: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Send reply via SMS
router.post('/:id/reply/sms', authenticateToken, async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message required' });
    }

    const result = await smsService.sendSMS(to, message);
    const msg = await conversationService.addMessage(
      req.params.id,
      req.user.id,
      message,
      'sms',
      'outgoing',
      result.sid
    );

    res.json({ message: msg, externalResult: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send reply via WhatsApp
router.post('/:id/reply/whatsapp', authenticateToken, async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'WhatsApp number and message required' });
    }

    const result = await smsService.sendWhatsApp(to, message);
    const msg = await conversationService.addMessage(
      req.params.id,
      req.user.id,
      message,
      'whatsapp',
      'outgoing',
      result.sid
    );

    res.json({ message: msg, externalResult: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// Send reply via live chat
router.post('/:id/reply/live_chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const msg = await conversationService.addMessage(
      req.params.id,
      req.user.id,
      message,
      'live_chat',
      'outgoing'
    );

    res.json({ message: msg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send live chat message' });
  }
});

// Update conversation status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const conversation = await conversationService.updateConversationStatus(req.params.id, status);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;

