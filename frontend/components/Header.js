import styles from './Header.module.css'

export default function Header({ user, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.logo}>📧 Messaging System</h1>
      </div>
      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.role}>({user.role})</span>
          </>
        )}
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  )
}

