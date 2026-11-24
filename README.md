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
- Receive registration confirmation emails
- Receive registration cancellation emails

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

### Email Notifications
- Registration confirmation notifications
- Registration cancellation notifications
- Gmail SMTP integration using Spring Boot Mail
- SMTP credentials managed through environment variables
- Email delivery failures handled without interrupting registration or cancellation workflows

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, HTML, CSS |
| Backend | Java, Spring Boot |
| Database | MySQL |
| ORM | Spring Data JPA, Hibernate |
| Authentication | Spring Security, JWT, BCrypt |
| Email Service | Spring Boot Mail, Gmail SMTP |
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

- Java 26 (as configured in the Gradle project)
- Node.js and npm
- MySQL Server
- Git
- A Google account if email notifications are required

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

```powershell
cd backend/eventspere
```

Copy the example configuration:

```powershell
Copy-Item src/main/resources/application.properties.example src/main/resources/application.properties
```

Update `application.properties` with your local MySQL username, password, database URL, and a secure JWT secret.

Never commit your actual credentials or secrets.

### 4. Configure Email Notifications

EventSphere uses Spring Boot Mail with Gmail SMTP to send registration confirmation and cancellation emails.

To enable email notifications:

1. Enable 2-Step Verification on your Google account.
2. Generate an App Password from [Google App Passwords](https://myaccount.google.com/apppasswords).
3. Configure the following Windows user environment variables:

| Variable | Description |
|---|---|
| `MAIL_USERNAME` | Gmail address used for SMTP |
| `MAIL_PASSWORD` | Gmail App Password (16 characters) |
| `MAIL_HOST` | SMTP host (default: `smtp.gmail.com`) |
| `MAIL_PORT` | SMTP port (default: `587`) |

For Windows PowerShell, configure the username:

```powershell
[Environment]::SetEnvironmentVariable(
    "MAIL_USERNAME",
    "your-email@gmail.com",
    "User"
)
```

Configure the App Password:

```powershell
[Environment]::SetEnvironmentVariable(
    "MAIL_PASSWORD",
    "your-16-character-app-password",
    "User"
)
```

Replace the example values with your own credentials. Never share or commit your App Password.

Restart your terminal or IDE after setting the environment variables.

**Note:** Google Workspace accounts may have administrator-controlled restrictions on App Passwords.

### 5. Run the Backend

From the backend directory:

```powershell
.\gradlew.bat bootRun
```

The backend runs at:

http://localhost:8080

### 6. Configure and Run the Frontend

Open another terminal and navigate to the frontend directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend runs at:

http://localhost:5173

## API Documentation

Swagger UI is available at:

http://localhost:8080/swagger-ui/index.html

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
- Registration confirmation and cancellation email notifications are implemented.
- User management and platform-wide analytics are not implemented.
- The home page featured events and hero search are currently demonstration elements.

## Future Enhancements

- Admin user management
- Platform-wide analytics
- Event image uploads
- Payment gateway integration
- Event reminders and scheduled notifications
- Improved event discovery and search

## Author

**Mayuresh Mahesh Jadhav**

B.Tech – Artificial Intelligence and Data Science

GitHub: [Mayureshjadhav1700](https://github.com/Mayureshjadhav1700)

---

*EventSphere – Discover Events. Connect. Participate.*