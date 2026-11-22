
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, User, Mail, Lock } from 'lucide-react'

import api from '../../services/api'
import '../../css/Register.css'

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password,
      })

      setSuccess(response.data.message || 'Registration successful!')

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
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
          <h1>Create Account</h1>
          <p>Join EventSphere and discover exciting events.</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <label>Full Name</label>

          <div className="auth-input">
            <User size={19} />
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          {success && (
            <p className="auth-success">{success}</p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          {' '}
          <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="back-home">
          Back to Home
        </Link>

      </div>
    </div>
  )
}

export default Register
