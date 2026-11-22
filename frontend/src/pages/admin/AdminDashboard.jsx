
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  CalendarDays,
  Ticket,
  ShieldCheck,
  ArrowRight,
  Eye,
} from 'lucide-react'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'
import '../../css/AdminDashboard.css'

function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events')
        setEvents(response.data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load events. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const adminStats = [
    {
      title: 'Published Events',
      value: events.length,
      icon: CalendarDays,
      color: 'orange',
    },
  ]

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    .slice(0, 5)

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  return (
    <>
      <Navbar />

      <main className="admin-dashboard-page">
        <div className="admin-dashboard-container">

          <section className="admin-welcome">
            <div>
              <span className="admin-eyebrow">ADMINISTRATION</span>
              <h1>Admin Dashboard</h1>
              <p>
                Monitor platform activity and manage the EventSphere
                community from one place.
              </p>
            </div>

            <div className="admin-welcome-icon">
              <ShieldCheck size={38} />
            </div>
          </section>

          <section className="admin-stats-grid">
            {adminStats.map((stat) => {
              const Icon = stat.icon

              return (
                <article className="admin-stat-card" key={stat.title}>
                  <div className={`admin-stat-icon ${stat.color}`}>
                    <Icon size={23} />
                  </div>

                  <div>
                    <p>{stat.title}</p>
                    <h2>{loading ? '...' : stat.value}</h2>
                  </div>
                </article>
            )})}
          </section>

          <section className="admin-management-grid">

            <article className="admin-management-card">
              <div className="admin-card-icon">
                <Users size={25} />
              </div>
              <div>
                <h3>User Management</h3>
                <p>
                  User management is not currently available.
                </p>
              </div>
              <span className="admin-coming-soon">Coming Soon</span>
            </article>

            <article className="admin-management-card">
              <div className="admin-card-icon">
                <CalendarDays size={25} />
              </div>
              <div>
                <h3>Event Management</h3>
                <p>
                  Browse published events and review their details.
                </p>
              </div>
              <Link to="/events" className="admin-action-link">
                <ArrowRight size={18} />
              </Link>
            </article>

            <article className="admin-management-card">
              <div className="admin-card-icon">
                <Ticket size={25} />
              </div>
              <div>
                <h3>Platform Overview</h3>
                <p>
                  View published events currently available on the platform.
                </p>
              </div>
              <span className="admin-coming-soon">Limited</span>
            </article>

          </section>

          <section className="admin-recent-section">
            <div className="admin-section-heading">
              <div>
                <h2>Recent Events</h2>
                <p>Published events retrieved from the database.</p>
              </div>

              <Link to="/events" className="admin-view-all">
                Explore Events
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <p>Loading events...</p>
            ) : error ? (
              <p className="admin-error">{error}</p>
            ) : recentEvents.length === 0 ? (
              <p>No published events available.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-events-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="admin-event-name">
                          {event.title}
                        </td>

                        <td>{event.organizerName}</td>

                        <td>{formatDate(event.startTime)}</td>

                        <td>
                          <span
                            className={`admin-status ${event.status.toLowerCase()}`}
                          >
                            {event.status}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/events/${event.id}`}
                            className="admin-action-link"
                            aria-label={`View ${event.title}`}
                          >
                            <Eye size={17} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default AdminDashboard

