'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './ReplyBox.module.css'

export default function ReplyBox({ conversation, onMessageSent }) {
  const [channel, setChannel] = useState(() => {
    // Auto-detect channel from conversation if available
    return conversation?.channel || 'email'
  })
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSend = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      let data

      if (channel === 'email') {
        if (!subject) {
          setError('Subject required for email')
          setLoading(false)
          return
        }
        if (!conversation.email) {
          setError('Customer email not available')
          setLoading(false)
          return
        }
        data = {
          to: conversation.email,
          subject,
          text: message,
        }
      } else if (channel === 'sms') {
        if (!conversation.phone_number) {
          setError('Customer phone number not available')
          setLoading(false)
          return
        }
        data = { to: conversation.phone_number, message }
      } else if (channel === 'whatsapp') {
        if (!conversation.phone_number) {
          setError('Customer phone number not available')
          setLoading(false)
          return
        }
        data = { to: conversation.phone_number, message }
      } else if (channel === 'live_chat') {
        data = { message }
      }

      await axios.post(`${API_URL}/api/conversations/${conversation.id}/reply/${channel}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setMessage('')
      setSubject('')
      onMessageSent()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.channelSelector}>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className={styles.select}
        >
          <option value="email">📧 Email</option>
          <option value="sms">📱 SMS</option>
          <option value="whatsapp">💬 WhatsApp</option>
          <option value="live_chat">💭 Live Chat</option>
        </select>
      </div>

      <form onSubmit={handleSend} className={styles.form}>
        {channel === 'email' && (
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
            className={styles.subjectInput}
          />
        )}

        <textarea
          placeholder={`Type ${channel} message...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          className={styles.textarea}
        />

        <button type="submit" disabled={loading || !message.trim()} className={styles.button}>
          {loading ? 'Sending...' : `Send ${channel}`}
        </button>
      </form>
    </div>
  )
}

