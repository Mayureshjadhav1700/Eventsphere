
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import '../../css/CreateEvent.css'

function CreateEvent() {
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

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // Convert datetime-local values into LocalDateTime format.
  const formatDateTime = (value) => {
    return value.length === 16 ? `${value}:00` : value
  }

  // Validate dates only when publishing.
  const validatePublishDates = () => {
    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)
    const deadline = new Date(formData.registrationDeadline)
    const now = new Date()

    if (end <= start) {
      return 'Event end time must be after the start time.'
    }

    if (deadline >= start) {
      return 'Registration deadline must be before the event start time.'
    }

    if (start <= now) {
      return 'Event start time must be in the future.'
    }

    if (deadline <= now) {
      return 'Registration deadline must be in the future.'
    }

    return ''
  }

  const handleCreateEvent = async (mode) => {
    setError('')

    // Check required form fields.
    if (!formRef.current.reportValidity()) {
      return
    }

    // Apply date restrictions only when publishing.
    if (mode === 'publish') {
      const dateError = validatePublishDates()

      if (dateError) {
        setError(dateError)
        return
      }
    }

    try {
      setSubmitting(true)

      // Get the logged-in organizer.
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const organizerId = Number(user.userId)

      if (!organizerId) {
        throw new Error('Organizer information not found. Please log in again.')
      }

      // Prepare request according to EventRequest.
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

      // Step 1: Create event. Backend automatically saves it as DRAFT.
      const createResponse = await api.post('/events', payload)
      const createdEvent = createResponse.data

      if (mode === 'draft') {
        navigate('/organizer/dashboard')
        return
      }

      // Get the newly created event ID.
      const eventId =
        createdEvent?.id ??
        createdEvent?.eventId ??
        createdEvent?.event?.id

      if (!eventId) {
        throw new Error(
          'Event was created as a draft, but its ID was not returned. Please check your dashboard.'
        )
      }

      // Step 2: Publish the newly created event.
      await api.patch(`/events/${eventId}/publish`)

      navigate('/organizer/dashboard')
    } catch (err) {
      console.error('Event creation error:', err)

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Something went wrong while creating the event.'

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="create-event-page">
        <div className="create-event-container">

          <Link to="/organizer/dashboard" className="create-event-back">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <section className="create-event-heading">
            <span>EVENT MANAGEMENT</span>
            <h1>Create New Event</h1>
            <p>
              Fill in the details below to create and organize
              your next event.
            </p>
          </section>

          <form
            ref={formRef}
            className="create-event-form"
            onSubmit={(event) => event.preventDefault()}
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

            <div className="create-form-section">
              <div className="create-form-section-heading">
                <FileText size={21} />
                <div>
                  <h2>Basic Information</h2>
                  <p>Provide the main details about your event.</p>
                </div>
              </div>

              <div className="create-form-group">
                <label htmlFor="title">Event Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter your event title"
                  maxLength={150}
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-form-group">
                <label htmlFor="description">Event Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event..."
                  rows={5}
                  maxLength={2000}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="create-form-group">
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

            <div className="create-form-section">
              <div className="create-form-section-heading">
                <MapPin size={21} />
                <div>
                  <h2>Location Details</h2>
                  <p>Where will your event take place?</p>
                </div>
              </div>

              <div className="create-form-group">
                <label htmlFor="venue">Venue</label>
                <input
                  id="venue"
                  name="venue"
                  type="text"
                  placeholder="Enter event venue or location"
                  maxLength={200}
                  value={formData.venue}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="create-form-section">
              <div className="create-form-section-heading">
                <CalendarDays size={21} />
                <div>
                  <h2>Date and Time</h2>
                  <p>Set the event schedule and registration deadline.</p>
                </div>
              </div>

              <div className="create-form-grid">
                <div className="create-form-group">
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

                <div className="create-form-group">
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

                <div className="create-form-group full-width">
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

            <div className="create-form-section">
              <div className="create-form-section-heading">
                <Users size={21} />
                <div>
                  <h2>Registration Settings</h2>
                  <p>Set the maximum number of participants.</p>
                </div>
              </div>

              <div className="create-form-group">
                <label htmlFor="capacity">Maximum Participants *</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="Enter participant capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="create-event-actions">
              <Link
                to="/organizer/dashboard"
                className="create-cancel-button"
              >
                Cancel
              </Link>

              <button
                type="button"
                className="create-draft-button"
                onClick={() => handleCreateEvent('draft')}
                disabled={submitting}
              >
                {submitting ? 'Please wait...' : 'Save as Draft'}
              </button>

              <button
                type="button"
                className="create-publish-button"
                onClick={() => handleCreateEvent('publish')}
                disabled={submitting}
              >
                {submitting ? 'Please wait...' : 'Publish Event'}
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default CreateEvent
