
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Mail, Lock } from 'lucide-react'

import api from '../../services/api'
import '../../css/Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const data = response.data

      // Save authentication details
      localStorage.setItem('token', data.token)

      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      )

      // Redirect according to user role
      if (data.role === 'PARTICIPANT') {
        navigate('/participant/dashboard')
      } else if (data.role === 'ORGANIZER') {
        navigate('/organizer/dashboard')
      } else if (data.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        setError('Unknown user role.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your email and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <CalendarDays size={30} />
          <span>EventSphere</span>
        </Link>

        <div className="auth-heading">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your event journey.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label>Email Address</label>

          <div className="auth-input">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="auth-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?
          {' '}
          <Link to="/register">Create Account</Link>
        </p>

        <Link to="/" className="back-home">
          Back to Home
        </Link>

      </div>
    </div>
  )
}

export default Login
  