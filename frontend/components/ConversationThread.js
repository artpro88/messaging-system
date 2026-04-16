'use client'

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import MessageBubble from './MessageBubble'
import ReplyBox from './ReplyBox'
import styles from './ConversationThread.module.css'

export default function ConversationThread({ conversation, socket, onMessageSent }) {
  const [fullConversation, setFullConversation] = useState(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (conversation) {
      fetchConversation()
      socket?.emit('join-conversation', conversation.id)

      return () => {
        socket?.emit('leave-conversation', conversation.id)
      }
    }
  }, [conversation?.id, socket])

  useEffect(() => {
    scrollToBottom()
  }, [fullConversation?.messages])

  useEffect(() => {
    socket?.on('message-received', () => {
      if (conversation) {
        fetchConversation()
      }
    })

    return () => {
      socket?.off('message-received')
    }
  }, [socket, conversation])

  const fetchConversation = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/conversations/${conversation.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFullConversation(response.data)
    } catch (err) {
      console.error('Failed to fetch conversation:', err)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMessageSent = () => {
    onMessageSent()
    fetchConversation()
  }

  if (loading || !fullConversation) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{fullConversation.name || 'Unknown'}</h2>
          <p className={styles.subtitle}>
            {fullConversation.email || fullConversation.phone_number}
          </p>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {fullConversation.messages?.length === 0 ? (
          <div className={styles.emptyMessages}>No messages yet</div>
        ) : (
          fullConversation.messages?.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ReplyBox
        conversation={fullConversation}
        onMessageSent={handleMessageSent}
      />
    </div>
  )
}

