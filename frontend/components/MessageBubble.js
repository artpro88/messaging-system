import { format } from 'date-fns'
import styles from './MessageBubble.module.css'

export default function MessageBubble({ message }) {
  const isFromAgent = message.sender_id !== null
  const getChannelIcon = (channel) => {
    const icons = {
      email: '📧',
      sms: '📱',
      whatsapp: '💬',
      live_chat: '💭',
    }
    return icons[channel] || '📬'
  }

  return (
    <div className={`${styles.message} ${isFromAgent ? styles.agent : styles.customer}`}>
      <div className={styles.bubble}>
        <div className={styles.content}>
          {message.content}
        </div>
        <div className={styles.meta}>
          <span className={styles.channel}>{getChannelIcon(message.channel)}</span>
          <span className={styles.time}>
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        </div>
      </div>
      {isFromAgent && (
        <span className={styles.senderName}>{message.sender_name || 'Agent'}</span>
      )}
    </div>
  )
}

