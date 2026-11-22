
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Ticket,
  Clock,
  User,
  MapPin,
  ArrowRight,
  XCircle,
} from 'lucide-react'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'
import '../../css/ParticipantDashboard.css'


function formatDate(dateTime) {
  if (!dateTime) return 'Date not available'

  const date = new Date(dateTime)

  if (Number.isNaN(date.getTime())) return 'Date not available'

  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}


function ParticipantDashboard() {
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [cancellationError, setCancellationError] = useState('')

  // Fetch participant registrations
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/registrations/my')

        setRegisteredEvents(response.data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Unable to load your registrations. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  // Calculate dashboard statistics
  const activeRegistrations = registeredEvents.filter(
    (event) => event.status === 'CONFIRMED'
  ).length

  const completedEvents = registeredEvents.filter(
    (event) => event.status === 'COMPLETED'
  ).length

  const totalRegistrations = registeredEvents.length

  const upcomingEvents = registeredEvents.filter(
    (event) =>
      event.status === 'CONFIRMED' &&
      new Date(event.startTime).getTime() >= Date.now()
  ).length

  // Cancel registration using backend API
  const cancelRegistration = async (registrationId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this registration?'
    )

    if (!confirmCancel) return

    try {
      setCancellingId(registrationId)
      setCancellationError('')

      await api.patch(
        `/registrations/${registrationId}/cancel`
      )

      setRegisteredEvents((previousEvents) =>
        previousEvents.map((event) =>
          event.registrationId === registrationId
            ? { ...event, status: 'CANCELLED' }
            : event
        )
      )
    } catch (err) {
      setCancellationError(
        err.response?.data?.message ||
          'Unable to cancel registration. Please try again.'
      )
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <>
      <Navbar />

      <main className="participant-dashboard">
        <section className="participant-welcome">
          <div>
            <span>PARTICIPANT DASHBOARD</span>
            <h1>Welcome Back!</h1>
            <p>Manage your registrations and explore upcoming events.</p>
          </div>

          <Link to="/events" className="browse-events-button">
            Explore Events <ArrowRight size={18} />
          </Link>
        </section>

        <section className="participant-stats">
          <div className="participant-stat-card">
            <div className="participant-stat-icon orange">
              <Ticket size={23} />
            </div>
            <div>
              <span>Total Registrations</span>
              <h2>{totalRegistrations}</h2>
            </div>
          </div>

          <div className="participant-stat-card">
            <div className="participant-stat-icon blue">
              <CalendarDays size={23} />
            </div>
            <div>
              <span>Upcoming Events</span>
              <h2>{upcomingEvents}</h2>
            </div>
          </div>

          <div className="participant-stat-card">
            <div className="participant-stat-icon green">
              <Clock size={23} />
            </div>
            <div>
              <span>Completed Events</span>
              <h2>{completedEvents}</h2>
            </div>
          </div>
        </section>

        <section className="participant-main-content">
          <div className="participant-section-heading">
            <div>
              <h2>My Registrations</h2>
              <p>Events you have registered for.</p>
            </div>

            <Link to="/events">Find More Events</Link>
          </div>

          <div className="participant-event-list">
            {loading ? (
              <div className="participant-empty-state">
                <h3>Loading Registrations...</h3>
                <p>Please wait while we fetch your events.</p>
              </div>
            ) : error ? (
              <div className="participant-empty-state">
                <h3>Unable to Load Registrations</h3>
                <p>{error}</p>
              </div>
            ) : registeredEvents.length === 0 ? (
              <div className="participant-empty-state">
                <Ticket size={35} />
                <h3>No Registrations Yet</h3>
                <p>You haven't registered for any events yet.</p>
                <Link to="/events">Explore Events</Link>
              </div>
            ) : (
              registeredEvents.map((event) => (
                <article
                  className="participant-event-card"
                  key={event.registrationId}
                >
                  <div className="participant-event-details">
                    <h3>{event.eventTitle}</h3>

                    <div className="participant-event-meta">
                      <span>
                        <CalendarDays size={15} />
                        {formatDate(event.startTime)}
                      </span>

                      <span>
                        <MapPin size={15} />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  <div className="participant-event-actions">
                    <span
                      className={`registration-status ${
                        event.status === 'CANCELLED'
                          ? 'cancelled'
                          : ''
                      }`}
                    >
                      {event.status}
                    </span>

                    <Link to={`/events/${event.eventId}`}>
                      View Event
                    </Link>

                    {event.status === 'CONFIRMED' && (
                      <button
                        type="button"
                        className="cancel-registration-button"
                        onClick={() =>
                          cancelRegistration(event.registrationId)
                        }
                        disabled={
                          cancellingId === event.registrationId
                        }
                      >
                        <XCircle size={15} />
                        {cancellingId === event.registrationId
                          ? 'Cancelling...'
                          : 'Cancel'}
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>

          {cancellationError && (
            <p className="registration-error">
              {cancellationError}
            </p>
          )}
        </section>

        <section className="participant-profile">
          <div className="participant-profile-icon">
            <User size={25} />
          </div>

          <div>
            <h2>My Account</h2>
            <p>Manage your personal account information.</p>
          </div>

          <span className="participant-profile-note">
            Profile management coming soon
          </span>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default ParticipantDashboard
