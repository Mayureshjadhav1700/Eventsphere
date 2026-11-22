
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
} from 'lucide-react'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'
import '../../css/EventDetails.css'

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'

function formatDate(dateTime) {
  if (!dateTime) return 'Date not available'

  const date = new Date(dateTime)

  if (Number.isNaN(date.getTime())) return 'Date not available'

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}


function formatTime(dateTime) {
  if (!dateTime) return ''

  const date = new Date(dateTime)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}


function EventDetails() {
  const { id } = useParams()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [registrationStatus, setRegistrationStatus] = useState(null)
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [registrationMessage, setRegistrationMessage] = useState('')
  const [registering, setRegistering] = useState(false)

  const token = localStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    user = null
  }

  const isParticipant =
    Boolean(token) && user?.role === 'PARTICIPANT'

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError('')
        setEvent(null)

        const response = await api.get(`/events/${id}`)
        setEvent(response.data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load event details. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  // Fetch existing participant registrations
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!isParticipant) {
        setRegistrationStatus(null)
        setRegistrationLoading(false)
        return
      }

      try {
        setRegistrationLoading(true)
        setRegistrationError('')
        setRegistrationMessage('')

        const response = await api.get('/registrations/my')

        const registrations = response.data

        const currentRegistration = registrations.find(
          (registration) =>
            Number(registration.eventId) === Number(id)
        )

        setRegistrationStatus(
          currentRegistration?.status || null
        )
      } catch (err) {
        setRegistrationError(
          'Unable to verify your registration status. Please refresh the page.'
        )
      } finally {
        setRegistrationLoading(false)
      }
    }

    fetchRegistrationStatus()
  }, [id, isParticipant])

  // Register participant for event
  const handleRegistration = async () => {
    try {
      setRegistering(true)
      setRegistrationError('')
      setRegistrationMessage('')

      const response = await api.post('/registrations', {
        eventId: Number(id),
      })

      setRegistrationStatus('CONFIRMED')

      setRegistrationMessage(
        response.data?.message ||
        'Registration successful! You are now registered for this event.'
      )
    } catch (err) {
      setRegistrationError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      )
    } finally {
      setRegistering(false)
    }
  }

  const startTime = formatTime(event?.startTime)
  const endTime = formatTime(event?.endTime)

  const eventTime =
    startTime && endTime
      ? `${startTime} - ${endTime}`
      : startTime || 'Time not available'

  return (
    <>
      <Navbar />

      <main className="event-details-page">
        {loading ? (
          <div className="event-not-found">
            <h1>Loading Event...</h1>
            <p>Please wait while we fetch the event details.</p>
          </div>
        ) : error || !event ? (
          <div className="event-not-found">
            <h1>Event Not Found</h1>
            <p>{error || 'The event you are looking for does not exist.'}</p>
            <Link to="/events">Explore Other Events</Link>
          </div>
        ) : (
          <div className="event-details-container">
            <Link to="/events" className="event-back-link">
              <ArrowLeft size={18} />
              Back to Events
            </Link>

            <div className="event-details-image">
              <img src={DEFAULT_IMAGE} alt={event.title} />
            </div>

            <div className="event-details-content">
              <div className="event-details-main">
                <span className="event-details-category">
                  {event.categoryName || 'General'}
                </span>

                <h1>{event.title}</h1>

                <p className="event-details-description">
                  {event.description}
                </p>

                <h2>About This Event</h2>

                <p>{event.description}</p>
              </div>

              <aside className="event-info-card">
                <h2>Event Information</h2>

                <div className="event-info-item">
                  <CalendarDays size={20} />
                  <div>
                    <small>Date</small>
                    <strong>{formatDate(event.startTime)}</strong>
                  </div>
                </div>

                <div className="event-info-item">
                  <Clock size={20} />
                  <div>
                    <small>Time</small>
                    <strong>{eventTime}</strong>
                  </div>
                </div>

                <div className="event-info-item">
                  <MapPin size={20} />
                  <div>
                    <small>Venue</small>
                    <strong>{event.venue}</strong>
                  </div>
                </div>

                <div className="event-info-item">
                  <Users size={20} />
                  <div>
                    <small>Event Capacity</small>
                    <strong>{event.capacity} Participants</strong>
                  </div>
                </div>

                {isParticipant ? (
                  <>
                    {registrationLoading ? (
                      <button
                        className="event-register-button"
                        disabled
                      >
                        Checking Registration...
                      </button>
                    ) : registrationError ? (
                      <button
                        className="event-register-button"
                        disabled
                      >
                        Status Unavailable
                      </button>
                    ) : registrationStatus === 'CONFIRMED' ? (
                      <button
                        className="event-register-button"
                        disabled
                      >
                        Successfully Registered
                      </button>
                    ) : registrationStatus === 'CANCELLED' ? (
                      <button
                        className="event-register-button"
                        disabled
                      >
                        Registration Cancelled
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="event-register-button"
                        onClick={handleRegistration}
                        disabled={registering}
                      >
                        {registering
                          ? 'Registering...'
                          : 'Register for Event'}
                      </button>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="event-register-button"
                  >
                    Login as Participant to Register
                  </Link>
                )}

                {registrationStatus === 'CANCELLED' && (
                  <p className="registration-error">
                    Your previous registration was cancelled.
                    Re-registration is not currently supported.
                  </p>
                )}

                {registrationMessage && (
                  <p className="registration-success">
                    {registrationMessage}
                  </p>
                )}

                {registrationError && (
                  <p className="registration-error">
                    {registrationError}
                  </p>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default EventDetails
