# EventSphere – Event Management & Registration Platform

EventSphere is a full-stack web application that allows users to discover events, register for events, and manage event activities through role-based dashboards.

The platform supports three user roles: **Participant, Organizer, and Admin**.

## Features

### Authentication and Authorization
- User registration and login
- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control

### Event Management
- Browse published events
- View event details
- Search and filter events
- Create and edit draft events
- Publish and delete events
- Event date, registration deadline, and capacity validation

### Participant
- View registered events
- Register for events
- Cancel registrations
- Track registration status
- View upcoming and completed events

### Organizer
- Create and manage events
- Save events as drafts
- Publish events
- Edit draft events
- Delete events
- View organizer dashboard statistics

### Admin
- View published events
- Access the admin dashboard
- View recent platform events

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, HTML, CSS |
| Backend | Java, Spring Boot |
| Database | MySQL |
| ORM | Spring Data JPA, Hibernate |
| Authentication | Spring Security, JWT, BCrypt |
| API Documentation | Swagger / OpenAPI |
| Build Tool | Gradle |
| Version Control | Git, GitHub |

## Project Structure

```text
EventSphere/
├── backend/
│   └── eventspere/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   └── resources/
│       │   └── test/
│       ├── build.gradle
│       └── gradlew
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── css/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Prerequisites

Install the following before running the application:

- Java (compatible with the configured Gradle project)
- Node.js and npm
- MySQL Server
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Mayureshjadhav1700/Eventsphere.git
cd Eventsphere
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE eventsphere_db;
```

### 3. Configure the Backend

Navigate to the backend directory:

```bash
cd backend/eventspere
```

Copy the example configuration:

```powershell
Copy-Item src/main/resources/application.properties.example src/main/resources/application.properties
```

Update `application.properties` with your local MySQL username, password, database URL, and a secure JWT secret.

Never commit your actual credentials or secrets.

Run the backend:

```powershell
.\gradlew.bat bootRun
```

The backend runs at:

`http://localhost:8080`

### 4. Configure the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## API Documentation

Swagger UI is available at:

[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a user |
| POST | `/api/v1/auth/login` | User login |
| GET | `/api/v1/events` | Browse published events |
| GET | `/api/v1/events/{id}` | View event details |
| POST | `/api/v1/events` | Create an event |
| PUT | `/api/v1/events/{id}` | Update a draft event |
| DELETE | `/api/v1/events/{id}` | Delete an event |
| PATCH | `/api/v1/events/{id}/publish` | Publish an event |
| POST | `/api/v1/registrations` | Register for an event |
| GET | `/api/v1/registrations/my` | View personal registrations |
| PATCH | `/api/v1/registrations/{registrationId}/cancel` | Cancel registration |

Protected endpoints require JWT authentication.

## Current Project Scope

- Participant registration and event management workflows are implemented.
- Organizer event management and dashboard functionality are implemented.
- Admin dashboard currently provides published-event visibility.
- User management and platform-wide analytics are not implemented.
- The home page featured events and hero search are currently demonstration elements.

## Future Enhancements

- Admin user management
- Platform-wide analytics
- Event image uploads
- Payment gateway integration
- Email notifications
- Improved event discovery and search

## Author

**Mayuresh Mahesh Jadhav**

B.Tech – Artificial Intelligence and Data Science

GitHub: [Mayureshjadhav1700](https://github.com/Mayureshjadhav1700)

---

*EventSphere – Discover Events. Connect. Participate.*