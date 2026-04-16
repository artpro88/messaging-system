-- Users (Agents/Admins)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'agent', -- admin, agent
  status VARCHAR(50) DEFAULT 'active', -- active, inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers (End users across all channels)
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  phone_number VARCHAR(20),
  name VARCHAR(255),
  whatsapp_number VARCHAR(20),
  avatar_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, phone_number)
);

-- Conversations (Thread across all channels for one customer)
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  assigned_agent_id INTEGER REFERENCES users(id),
  subject VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open', -- open, closed, pending
  priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages (Individual messages in conversations)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id), -- NULL if from customer
  content TEXT NOT NULL,
  channel VARCHAR(50) NOT NULL, -- email, sms, whatsapp, live_chat
  direction VARCHAR(20) NOT NULL, -- incoming, outgoing
  status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, read, failed
  external_id VARCHAR(255), -- For tracking in external APIs
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channel Configurations
CREATE TABLE IF NOT EXISTS channel_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- channel name
  type VARCHAR(50) NOT NULL, -- email, sms, whatsapp, live_chat
  config JSONB NOT NULL, -- Stores API keys, settings per channel
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhooks (Track webhook deliveries for debugging)
CREATE TABLE IF NOT EXISTS webhooks (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, delivered, failed
  retries INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_assigned_agent_id ON conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

