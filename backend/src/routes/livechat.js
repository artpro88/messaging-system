import express from 'express';
import * as liveChatService from '../services/liveChatService.js';

const router = express.Router();

// Start or get a conversation
router.post('/conversations', async (req, res) => {
  try {
    const { email, name, metadata } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name required' });
    }

    // Create or get customer
    const customerId = await liveChatService.createOrGetCustomer(email, name, metadata);

    // Create or get conversation
    const conversationId = await liveChatService.createOrGetConversation(customerId);

    // Get all messages
    const messages = await liveChatService.getConversationMessages(conversationId);

    res.json({
      conversationId,
      customerId,
      messages
    });
  } catch (error) {
    console.error('Error in POST /conversations:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send a message
router.post('/messages', async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    console.log('Received message:', { conversationId, content });

    if (!conversationId || !content) {
      console.error('Missing required fields:', { conversationId, content });
      return res.status(400).json({ error: 'Conversation ID and content required' });
    }

    // Save message
    console.log('Saving message to database...');
    const message = await liveChatService.saveMessage(conversationId, null, content);
    console.log('Message saved:', message);

    // Notify agents via WebSocket
    if (req.io) {
      console.log(`Broadcasting to conversation:${conversationId}`);
      req.io.to(`conversation:${conversationId}`).emit('new-message', {
        id: message.id,
        content,
        direction: 'incoming',
        createdAt: message.created_at
      });
    } else {
      console.warn('WebSocket (req.io) not available');
    }

    res.json({ id: message.id, createdAt: message.created_at });
  } catch (error) {
    console.error('Error in POST /messages:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get conversation messages
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await liveChatService.getConversationMessages(conversationId);
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Close conversation
router.post('/conversations/:conversationId/close', async (req, res) => {
  try {
    const { conversationId } = req.params;
    await liveChatService.closeConversation(conversationId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error closing conversation:', error);
    res.status(500).json({ error: 'Failed to close conversation' });
  }
});

export default router;

