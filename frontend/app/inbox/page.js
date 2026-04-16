'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { io } from 'socket.io-client'
import ConversationList from '@/components/ConversationList'
import ConversationThread from '@/components/ConversationThread'
import Header from '@/components/Header'
import styles from './page.module.css'

export default function InboxPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [socket, setSocket] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch user info
    fetchUser(token)
    // Fetch conversations
    fetchConversations(token)

    // Connect to WebSocket
    const newSocket = io(WS_URL, {
      auth: { token },
    })
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data)
    } catch (err) {
      console.error('Failed to fetch user:', err)
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  const fetchConversations = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setConversations(response.data)
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleMessageSent = () => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchConversations(token)
      if (selectedConversation) {
        socket?.emit('new-message', selectedConversation.id)
      }
    }
  }

  return (
    <div className={styles.container}>
      <Header user={user} onLogout={handleLogout} />
      <div className={styles.mainContent}>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          loading={loading}
        />
        {selectedConversation ? (
          <ConversationThread
            conversation={selectedConversation}
            socket={socket}
            onMessageSent={handleMessageSent}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>Select a conversation to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

