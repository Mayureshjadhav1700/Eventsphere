
import {
  Search,
  CalendarCheck,
  Users,
  ShieldCheck
} from 'lucide-react'

import '../css/WhyEventSphere.css'

const features = [
  {
    icon: Search,
    title: 'Discover Events',
    description:
      'Explore events across different categories and find experiences that match your interests.'
  },
  {
    icon: CalendarCheck,
    title: 'Easy Registration',
    description:
      'Register for your favourite events through a simple and convenient process.'
  },
  {
    icon: Users,
    title: 'Connect with People',
    description:
      'Discover opportunities to meet people and participate in exciting experiences.'
  },
  {
    icon: ShieldCheck,
    title: 'Reliable Platform',
    description:
      'Manage your event registrations and keep track of your upcoming activities.'
  }
]

function WhyEventSphere() {
  return (
    <section className="why-section" id="about">
      <div className="why-heading">
        <span className="section-tag">WHY EVENTSPHERE</span>
        <h2>Everything You Need to Experience More</h2>
        <p>
          We make discovering and managing events simple,
          convenient and enjoyable.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon

          return (
            <article className="feature-card" key={index}>
              <div className="feature-icon">
                <Icon size={27} />
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default WhyEventSphere
