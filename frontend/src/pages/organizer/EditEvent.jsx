
import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  MapPin,
  FileText,
  Users,
  ArrowLeft,
} from 'lucide-react'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import api from '../../services/api'
import '../../css/EditEvent.css'

function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    venue: '',
    startTime: '',
    endTime: '',
    registrationDeadline: '',
    capacity: '',
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Convert backend LocalDateTime into datetime-local format.
  const formatForInput = (value) => {
    if (!value) return ''

    return value.slice(0, 16)
  }

  // Fetch existing event details.
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/events/${id}`)
        const event = response.data

        if (event.status !== 'DRAFT') {
          setError(
            'Only draft events can be edited. Published events cannot be updated through this endpoint.'
          )
          setLoading(false)
          return
        }

        setFormData({
          title: event.title || '',
          description: event.description || '',
          categoryId: String(event.categoryId ?? ''),
          venue: event.venue || '',
          startTime: formatForInput(event.startTime),
          endTime: formatForInput(event.endTime),
          registrationDeadline: formatForInput(
            event.registrationDeadline
          ),
          capacity: String(event.capacity ?? ''),
        })
      } catch (err) {
        console.error('Error fetching event:', err)

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Unable to load event details.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const formatDateTime = (value) => {
    return value.length === 16 ? `${value}:00` : value
  }

  // Validate event dates before updating.
  const validateEventDates = () => {
    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)
    const deadline = new Date(formData.registrationDeadline)

    if (end <= start) {
      return 'Event end time must be after the start time.'
    }

    if (deadline >= start) {
      return 'Registration deadline must be before the event start time.'
    }

    return ''
  }

  // Update event.
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formRef.current.reportValidity()) {
      return
    }

    // Validate date relationships, but allow past dates for drafts.
    const dateError = validateEventDates()

    if (dateError) {
      setError(dateError)
      return
    }

    try {
      setSubmitting(true)

      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const organizerId = Number(user.userId)

      if (!organizerId) {
        throw new Error(
          'Organizer information not found. Please log in again.'
        )
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        venue: formData.venue.trim(),
        startTime: formatDateTime(formData.startTime),
        endTime: formatDateTime(formData.endTime),
        registrationDeadline: formatDateTime(
          formData.registrationDeadline
        ),
        capacity: Number(formData.capacity),
        categoryId: Number(formData.categoryId),
        organizerId,
      }

      await api.put(`/events/${id}`, payload)

      navigate('/organizer/dashboard')
    } catch (err) {
      console.error('Error updating event:', err)

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Unable to update event. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="edit-event-page">
        <div className="edit-event-container">

          <Link to="/organizer/dashboard" className="edit-event-back">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <section className="edit-event-heading">
            <span>EVENT MANAGEMENT</span>
            <h1>Edit Event</h1>
            <p>
              Update the details of your event and keep participants informed.
            </p>
          </section>

          {loading ? (
            <div className="edit-form-section">
              Loading event details...
            </div>
          ) : error && !formData.title ? (
            <div
              role="alert"
              className="edit-form-section"
              style={{ color: '#dc2626' }}
            >
              {error}
            </div>
          ) : (
            <form
              ref={formRef}
              className="edit-event-form"
              onSubmit={handleSubmit}
            >

              {error && (
                <div
                  role="alert"
                  style={{
                    padding: '12px 16px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    background: '#fff1f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                  }}
                >
                  {error}
                </div>
              )}

              <div className="edit-form-section">
                <div className="edit-form-section-heading">
                  <FileText size={21} />
                  <div>
                    <h2>Basic Information</h2>
                    <p>Update the main details about your event.</p>
                  </div>
                </div>

                <div className="edit-form-group">
                  <label htmlFor="title">Event Title *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="description">Event Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={2000}
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select an event category
                    </option>
                    <option value="1">Technology</option>
                    <option value="2">Education</option>
                    <option value="3">Business</option>
                  </select>
                </div>
              </div>

              <div className="edit-form-section">
                <div className="edit-form-section-heading">
                  <MapPin size={21} />
                  <div>
                    <h2>Location Details</h2>
                    <p>Update the event venue.</p>
                  </div>
                </div>

                <div className="edit-form-group">
                  <label htmlFor="venue">Venue</label>
                  <input
                    id="venue"
                    name="venue"
                    type="text"
                    value={formData.venue}
                    onChange={handleChange}
                    maxLength={200}
                  />
                </div>
              </div>

              <div className="edit-form-section">
                <div className="edit-form-section-heading">
                  <CalendarDays size={21} />
                  <div>
                    <h2>Date and Time</h2>
                    <p>Update the event schedule and registration deadline.</p>
                  </div>
                </div>

                <div className="edit-form-grid">
                  <div className="edit-form-group">
                    <label htmlFor="startTime">Start Date and Time *</label>
                    <input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="edit-form-group">
                    <label htmlFor="endTime">End Date and Time *</label>
                    <input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="edit-form-group full-width">
                    <label htmlFor="registrationDeadline">
                      Registration Deadline *
                    </label>
                    <input
                      id="registrationDeadline"
                      name="registrationDeadline"
                      type="datetime-local"
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="edit-form-section">
                <div className="edit-form-section-heading">
                  <Users size={21} />
                  <div>
                    <h2>Registration Settings</h2>
                    <p>Update the maximum number of participants.</p>
                  </div>
                </div>

                <div className="edit-form-group">
                  <label htmlFor="capacity">Maximum Participants *</label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="edit-event-actions">
                <Link
                  to="/organizer/dashboard"
                  className="edit-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="edit-save-button"
                  disabled={submitting}
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>

            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default EditEvent
