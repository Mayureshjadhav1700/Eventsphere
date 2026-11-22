
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Users,
  Eye,
  FileText,
  Plus,
  MapPin,
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'
import '../../css/OrganizerDashboard.css'



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



function OrganizerDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/events/organizer/dashboard')
      setDashboard(response.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load organizer dashboard. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setDeletingId(event.id)
      setDeleteError('')

      await api.delete(`/events/${event.id}`)

      // Refresh dashboard and statistics after deletion
      await fetchDashboard()
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          'Unable to delete this event. Please try again.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Navbar />

      <main className="organizer-dashboard">
        <section className="organizer-welcome">
          <div>
            <span>ORGANIZER DASHBOARD</span>
            <h1>Manage Your Events</h1>
            <p>
              Create events, track registrations, and manage your
              event activities from one place.
            </p>
          </div>

          <Link
            to="/organizer/events/create"
            className="create-event-button"
          >
            <Plus size={19} />
            Create Event
          </Link>
        </section>

        {loading ? (
          <div className="organizer-events-section">
            <h2>Loading Dashboard...</h2>
            <p>Please wait while we fetch your event information.</p>
          </div>
        ) : error ? (
          <div className="organizer-events-section">
            <h2>Unable to Load Dashboard</h2>
            <p>{error}</p>
          </div>
        ) : dashboard ? (
          <>
            <section className="organizer-stats">
              <div className="organizer-stat-card">
                <div className="organizer-stat-icon orange">
                  <CalendarDays size={23} />
                </div>
                <div>
                  <span>Total Events</span>
                  <h2>{dashboard.totalEvents}</h2>
                </div>
              </div>

              <div className="organizer-stat-card">
                <div className="organizer-stat-icon blue">
                  <Eye size={23} />
                </div>
                <div>
                  <span>Published Events</span>
                  <h2>{dashboard.publishedEvents}</h2>
                </div>
              </div>

              <div className="organizer-stat-card">
                <div className="organizer-stat-icon green">
                  <Users size={23} />
                </div>
                <div>
                  <span>Confirmed Registrations</span>
                  <h2>{dashboard.totalConfirmedRegistrations}</h2>
                </div>
              </div>

              <div className="organizer-stat-card">
                <div className="organizer-stat-icon purple">
                  <FileText size={23} />
                </div>
                <div>
                  <span>Draft Events</span>
                  <h2>{dashboard.draftEvents}</h2>
                </div>
              </div>
            </section>

            <section className="organizer-events-section">
              <div className="organizer-section-heading">
                <div>
                  <h2>My Events</h2>
                  <p>
                    Manage and monitor the events you have created.
                  </p>
                </div>

                <Link to="/organizer/events/create">
                  Create New Event <ArrowRight size={16} />
                </Link>
              </div>

              {deleteError && (
                <p className="organizer-delete-error">
                  {deleteError}
                </p>
              )}

              <div className="organizer-event-list">
                {dashboard.events?.length > 0 ? (
                  dashboard.events.map((event) => (
                    <article
                      className="organizer-event-card"
                      key={event.id}
                    >
                      <div className="organizer-event-icon">
                        <CalendarDays size={25} />
                      </div>

                      <div className="organizer-event-details">
                        <h3>{event.title}</h3>

                        <div className="organizer-event-meta">
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

                      <div className="organizer-event-registrations">
                        <strong>{event.capacity}</strong>
                        <span>Capacity</span>
                      </div>

                      <div className="organizer-event-actions">
                        <span
                          className={`organizer-status ${
                            event.status === 'PUBLISHED'
                              ? 'published'
                              : 'draft'
                          }`}
                        >
                          {event.status}
                        </span>

                        <div className="organizer-event-buttons">
                          {event.status === 'PUBLISHED' && (
                            <Link to={`/events/${event.id}`}>
                              <Eye size={15} />
                              View
                            </Link>
                          )}

                          {event.status === 'DRAFT' && (
                            <Link
                              to={`/organizer/events/edit/${event.id}`}
                            >
                              <Pencil size={15} />
                              Edit
                            </Link>
                          )}

                          <button
                            type="button"
                            className="organizer-delete-button"
                            onClick={() => handleDelete(event)}
                            disabled={deletingId === event.id}
                          >
                            <Trash2 size={15} />
                            {deletingId === event.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="participant-empty-state">
                    <CalendarDays size={35} />
                    <h3>No Events Created Yet</h3>
                    <p>Create your first event to get started.</p>
                    <Link to="/organizer/events/create">
                      Create Event
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>

      <Footer />
    </>
  )
}

export default OrganizerDashboard
