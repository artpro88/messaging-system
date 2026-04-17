import db from '../db.js';

// Get or create customer by email/phone
export const getOrCreateCustomer = async (email, phoneNumber, name) => {
  try {
    let customer;
    
    if (email) {
      const result = await db.query(
        'SELECT * FROM customers WHERE email = $1',
        [email]
      );
      customer = result.rows[0];
    } else if (phoneNumber) {
      const result = await db.query(
        'SELECT * FROM customers WHERE phone_number = $1',
        [phoneNumber]
      );
      customer = result.rows[0];
    }

    if (customer) {
      return customer;
    }

    // Create new customer
    const result = await db.query(
      'INSERT INTO customers (email, phone_number, name) VALUES ($1, $2, $3) RETURNING *',
      [email, phoneNumber, name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
};

// Get or create conversation for customer
export const getOrCreateConversation = async (customerId) => {
  try {
    const result = await db.query(
      'SELECT * FROM conversations WHERE customer_id = $1 AND status != $2 ORDER BY updated_at DESC LIMIT 1',
      [customerId, 'closed']
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Create new conversation
    const newConv = await db.query(
      'INSERT INTO conversations (customer_id) VALUES ($1) RETURNING *',
      [customerId]
    );
    return newConv.rows[0];
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    throw error;
  }
};

// Add message to conversation
export const addMessage = async (conversationId, senderId, content, channel, direction, externalId = null) => {
  try {
    const result = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, content, channel, direction, external_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [conversationId, senderId, content, channel, direction, externalId]
    );

    // Update conversation last_message_at
    await db.query(
      'UPDATE conversations SET last_message_at = NOW(), updated_at = NOW() WHERE id = $1',
      [conversationId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error in addMessage:', error);
    throw error;
  }
};

// Get conversation with messages
export const getConversation = async (conversationId) => {
  try {
    const conv = await db.query(
      `SELECT c.*, cust.name, cust.email, cust.phone_number,
              (SELECT channel FROM messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1) as channel
       FROM conversations c LEFT JOIN customers cust ON c.customer_id = cust.id WHERE c.id = $1`,
      [conversationId]
    );

    const messages = await db.query(
      'SELECT m.*, u.name as sender_name FROM messages m LEFT JOIN users u ON m.sender_id = u.id WHERE m.conversation_id = $1 ORDER BY m.created_at ASC',
      [conversationId]
    );

    return {
      ...conv.rows[0],
      messages: messages.rows,
    };
  } catch (error) {
    console.error('Error in getConversation:', error);
    throw error;
  }
};

// List all conversations
export const listConversations = async (limit = 50, offset = 0) => {
  try {
    const result = await db.query(
      `SELECT c.*, cust.name, cust.email,
              (SELECT channel FROM messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1) as channel,
              (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_preview
       FROM conversations c
       LEFT JOIN customers cust ON c.customer_id = cust.id
       ORDER BY c.updated_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } catch (error) {
    console.error('Error in listConversations:', error);
    throw error;
  }
};

// Update conversation status
export const updateConversationStatus = async (conversationId, status) => {
  try {
    const result = await db.query(
      'UPDATE conversations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, conversationId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateConversationStatus:', error);
    throw error;
  }
};

