import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export async function createOrGetCustomer(email, name, metadata = {}) {
  try {
    // Check if customer exists
    const existing = await db.query(
      'SELECT id FROM customers WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0].id;
    }

    // Create new customer
    const result = await db.query(
      `INSERT INTO customers (email, name, metadata) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [email, name, JSON.stringify(metadata)]
    );

    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating/getting customer:', error);
    throw error;
  }
}

export async function createOrGetConversation(customerId, subject = 'Live Chat') {
  try {
    // Check for open conversation
    const existing = await db.query(
      `SELECT id FROM conversations 
       WHERE customer_id = $1 AND status = 'open'
       ORDER BY created_at DESC LIMIT 1`,
      [customerId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0].id;
    }

    // Create new conversation
    const result = await db.query(
      `INSERT INTO conversations (customer_id, subject, status) 
       VALUES ($1, $2, 'open') 
       RETURNING id`,
      [customerId, subject]
    );

    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    throw error;
  }
}

export async function saveMessage(conversationId, customerId, content, channel = 'live_chat') {
  try {
    const result = await db.query(
      `INSERT INTO messages (conversation_id, content, channel, direction, status) 
       VALUES ($1, $2, $3, 'incoming', 'received') 
       RETURNING id, created_at`,
      [conversationId, content, channel]
    );

    // Update last_message_at
    await db.query(
      'UPDATE conversations SET last_message_at = NOW() WHERE id = $1',
      [conversationId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function getConversationMessages(conversationId) {
  try {
    const result = await db.query(
      `SELECT id, sender_id, content, direction, created_at, status
       FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function assignAgentToConversation(conversationId, agentId) {
  try {
    const result = await db.query(
      `UPDATE conversations 
       SET assigned_agent_id = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING assigned_agent_id`,
      [agentId, conversationId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error assigning agent:', error);
    throw error;
  }
}

export async function closeConversation(conversationId) {
  try {
    const result = await db.query(
      `UPDATE conversations 
       SET status = 'closed', updated_at = NOW() 
       WHERE id = $1`,
      [conversationId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error closing conversation:', error);
    throw error;
  }
}

