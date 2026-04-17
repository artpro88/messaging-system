-- Debug Live Chat Issues

-- 1. Check all recent conversations with their first message channel
SELECT 
  c.id as conv_id,
  cust.name,
  cust.email,
  c.created_at,
  c.status,
  (SELECT channel FROM messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1) as first_message_channel,
  (SELECT channel FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_channel,
  (SELECT count(*) FROM messages WHERE conversation_id = c.id) as message_count
FROM conversations c
LEFT JOIN customers cust ON c.customer_id = cust.id
ORDER BY c.created_at DESC
LIMIT 10;

-- 2. Check all messages for a specific conversation (replace 1 with actual conversation ID)
SELECT 
  m.id,
  m.direction,
  m.channel,
  m.sender_id,
  u.name as sender_name,
  m.content,
  m.created_at
FROM messages m
LEFT JOIN users u ON m.sender_id = u.id
WHERE m.conversation_id = 1
ORDER BY m.created_at ASC;

-- 3. Check if agent has any messages without channel set
SELECT 
  m.id,
  m.conversation_id,
  m.direction,
  m.channel,
  m.content,
  u.name as sender_name,
  m.created_at
FROM messages m
LEFT JOIN users u ON m.sender_id = u.id
WHERE m.channel IS NULL OR m.channel = ''
ORDER BY m.created_at DESC
LIMIT 20;

-- 4. Verify customer and conversation relationship
SELECT 
  c.id as conv_id,
  c.customer_id,
  cust.name,
  cust.email,
  c.status,
  c.created_at
FROM conversations c
LEFT JOIN customers cust ON c.customer_id = cust.id
ORDER BY c.created_at DESC
LIMIT 10;

-- 5. Count conversations by channel (first message)
SELECT 
  (SELECT channel FROM messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1) as channel,
  count(*) as count
FROM conversations c
GROUP BY (SELECT channel FROM messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1)
ORDER BY count DESC;

