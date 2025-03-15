# URL Shortener Project

A full-stack URL shortener application with React frontend and Spring Boot backend.

## Project Structure

- `url-shortener-react/` - Frontend React application
- `url-shortener-sb/` - Backend Spring Boot application

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Java 17+
- MySQL or PostgreSQL database
- Maven

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd url-shortener-sb
   ```

2. Create your own `application.properties` file:
   ```
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

3. Edit the `application.properties` file with your database credentials and JWT secret.

4. Build and run the application:
   ```
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd url-shortener-react
   ```

2. Create your own `.env` file:
   ```
   cp .env.example .env
   ```

3. Edit the `.env` file with your configuration values, including Google Client ID if using OAuth.

4. Install dependencies:
   ```
   npm install
   ```

5. Run the application:
   ```
   npm run dev
   ```

## Security Note

This project contains example configuration files that do not include real credentials. When setting up your own instance:

1. Never commit sensitive information like database credentials, API keys, or JWT secrets to Git.
2. Always use environment variables or configuration files that are excluded in `.gitignore`.
3. For production deployment, use environment variables or secure secret management services.

## Features

- URL shortening with custom aliases
- User authentication
- Analytics for shortened URLs
- Google OAuth integration
- Responsive design 