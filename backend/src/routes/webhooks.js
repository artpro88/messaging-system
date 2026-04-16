import express from 'express';
import * as conversationService from '../services/conversationService.js';
import * as emailService from '../services/emailService.js';
import * as smsService from '../services/smsService.js';
import { query } from '../db.js';

const router = express.Router();

// Incoming email webhook
router.post('/email', async (req, res) => {
  try {
    const data = emailService.parseIncomingEmail(req.body);

    // Get or create customer
    const customer = await conversationService.getOrCreateCustomer(data.from, null, null);

    // Get or create conversation
    const conversation = await conversationService.getOrCreateConversation(customer.id);

    // Add message
    const message = await conversationService.addMessage(
      conversation.id,
      null, // Customer sending message
      data.html || data.text,
      'email',
      'incoming',
      data.externalId
    );

    res.json({ success: true, message, conversation, customer });
  } catch (error) {
    console.error('Email webhook error:', error);
    res.status(500).json({ error: 'Failed to process email' });
  }
});

// Incoming SMS webhook (from Twilio)
router.post('/sms', async (req, res) => {
  try {
    const data = smsService.parseIncomingSMS(req.body);

    // Get or create customer
    const customer = await conversationService.getOrCreateCustomer(null, data.from, null);

    // Get or create conversation
    const conversation = await conversationService.getOrCreateConversation(customer.id);

    // Add message
    const message = await conversationService.addMessage(
      conversation.id,
      null,
      data.message,
      'sms',
      'incoming',
      data.externalId
    );

    res.json({ success: true, message, conversation, customer });
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).json({ error: 'Failed to process SMS' });
  }
});

// Incoming WhatsApp webhook (from Twilio)
router.post('/whatsapp', async (req, res) => {
  try {
    const data = smsService.parseIncomingSMS(req.body);

    // Extract phone number without 'whatsapp:' prefix
    const phoneNumber = data.from.replace('whatsapp:', '');

    // Get or create customer
    const customer = await conversationService.getOrCreateCustomer(null, phoneNumber, null);

    // Get or create conversation
    const conversation = await conversationService.getOrCreateConversation(customer.id);

    // Add message
    const message = await conversationService.addMessage(
      conversation.id,
      null,
      data.message,
      'whatsapp',
      'incoming',
      data.externalId
    );

    res.json({ success: true, message, conversation, customer });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).json({ error: 'Failed to process WhatsApp message' });
  }
});

// Live chat webhook
router.post('/live-chat', async (req, res) => {
  try {
    const { customerId, message } = req.body;

    if (!customerId || !message) {
      return res.status(400).json({ error: 'customerId and message required' });
    }

    // Get or create conversation
    const conversation = await conversationService.getOrCreateConversation(customerId);

    // Add message
    const msg = await conversationService.addMessage(
      conversation.id,
      null,
      message,
      'live_chat',
      'incoming'
    );

    res.json({ success: true, message: msg, conversation });
  } catch (error) {
    console.error('Live chat webhook error:', error);
    res.status(500).json({ error: 'Failed to process live chat message' });
  }
});

export default router;

