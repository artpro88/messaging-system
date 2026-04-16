import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import styles from './ConversationList.module.css'

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading,
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = conversations.filter((conv) => {
    const term = searchTerm.toLowerCase()
    return (
      conv.name?.toLowerCase().includes(term) ||
      conv.email?.toLowerCase().includes(term) ||
      conv.phone_number?.toLowerCase().includes(term)
    )
  })

  const getChannelIcon = (channel) => {
    const icons = {
      email: '📧',
      sms: '📱',
      whatsapp: '💬',
      live_chat: '💭',
    }
    return icons[channel] || '📬'
  }

  const getStatusColor = (status) => {
    const colors = {
      open: '#27ae60',
      closed: '#999',
      pending: '#f39c12',
    }
    return colors[status] || '#666'
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Conversations</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : filteredConversations.length === 0 ? (
          <div className={styles.empty}>No conversations</div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.item} ${
                selectedConversation?.id === conv.id ? styles.active : ''
              }`}
              onClick={() => onSelectConversation(conv)}
            >
              <div className={styles.itemContent}>
                <div className={styles.itemHeader}>
                  <span className={styles.name}>{conv.name || 'Unknown'}</span>
                  <span className={styles.time}>
                    {conv.last_message_at
                      ? formatDistanceToNow(new Date(conv.last_message_at), {
                          addSuffix: true,
                        })
                      : 'Never'}
                  </span>
                </div>
                <div className={styles.itemFooter}>
                  <span className={styles.contact}>{conv.email || conv.phone_number}</span>
                </div>
                <div className={styles.badges}>
                  <span className={styles.channelBadge}>
                    {getChannelIcon(conv.last_channel || 'email')}
                  </span>
                  <span
                    className={styles.statusBadge}
                    style={{ color: getStatusColor(conv.status) }}
                  >
                    {conv.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

