'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './LiveChatPanel.module.css';

export default function LiveChatPanel({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://messaging-system-backend.vercel.app/api';

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/livechat/conversations/${conversationId}/messages`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    // Connect to WebSocket
    socketRef.current = io(API_URL.replace('/api', ''));
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-conversation', conversationId);
    });

    socketRef.current.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [conversationId, API_URL]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/livechat/messages`,
        {
          conversationId,
          content: input,
          sender: 'agent'
        }
      );

      // Add message to state
      setMessages(prev => [...prev, {
        id: response.data.id,
        content: input,
        direction: 'outgoing',
        created_at: response.data.createdAt,
        status: 'sent'
      }]);

      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.messagesContainer}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.message} ${styles[msg.direction]}`}
          >
            <div className={styles.bubble}>{msg.content}</div>
            <span className={styles.timestamp}>
              {new Date(msg.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
}

