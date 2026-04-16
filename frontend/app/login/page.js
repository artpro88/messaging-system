'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const data = isLogin
        ? { email, password }
        : { email, password, name }

      const response = await axios.post(`${API_URL}${endpoint}`, data)
      const { token } = response.data

      localStorage.setItem('token', token)
      router.push('/inbox')
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Messaging System</h1>
        <p className={styles.subtitle}>Omnichannel Customer Messaging</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              disabled={loading}
              className={styles.input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className={styles.toggleButton}
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}

