
import { Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedEvents from './components/FeaturedEvents'
import WhyEventSphere from './components/WhyEventSphere'
import Footer from './components/Footer'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ExploreEvents from './pages/events/ExploreEvents'
import EventDetails from './pages/events/EventDetails'

import ParticipantDashboard from './pages/participant/ParticipantDashboard'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import CreateEvent from './pages/organizer/CreateEvent'
import EditEvent from './pages/organizer/EditEvent'
import AdminDashboard from './pages/admin/AdminDashboard'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedEvents />
      <WhyEventSphere />
      <Footer />
    </>
  )
}

// Protected route component
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    user = null
  }

  // Redirect logged-out users to Login
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Redirect users who do not have the required role
  if (user.role !== allowedRole) {
    if (user.role === 'PARTICIPANT') {
      return <Navigate to="/participant/dashboard" replace />
    }

    if (user.role === 'ORGANIZER') {
      return <Navigate to="/organizer/dashboard" replace />
    }

    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<ExploreEvents />} />
      <Route path="/events/:id" element={<EventDetails />} />

      {/* Participant Routes */}
      <Route
        path="/participant/dashboard"
        element={
          <ProtectedRoute allowedRole="PARTICIPANT">
            <ParticipantDashboard />
          </ProtectedRoute>
        }
      />

      {/* Organizer Routes */}
      <Route
        path="/organizer/dashboard"
        element={
          <ProtectedRoute allowedRole="ORGANIZER">
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/events/create"
        element={
          <ProtectedRoute allowedRole="ORGANIZER">
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/events/edit/:id"
        element={
          <ProtectedRoute allowedRole="ORGANIZER">
            <EditEvent />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
