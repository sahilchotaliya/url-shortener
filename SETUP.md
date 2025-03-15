# Local Development Setup Guide

This guide will help you set up the URL shortener project for local development.

## Prerequisites

1. **Node.js and npm**
   - Install Node.js (v14 or higher) from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Java Development Kit (JDK)**
   - Install JDK 17 or higher
   - Verify installation:
     ```bash
     java --version
     ```

3. **PostgreSQL**
   - Install PostgreSQL from [postgresql.org](https://www.postgresql.org/)
   - Create a database named `url_shortener`
   - Verify installation:
     ```bash
     psql --version
     ```

4. **Google Cloud Console Account**
   - Create an account at [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project
   - Enable Google OAuth API
   - Create OAuth 2.0 credentials

## Local Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2. Frontend Setup

```bash
cd url-shortener-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Use the values from your Google Cloud Console project
```

### 3. Backend Setup

```bash
cd url-shortener-sb

# Create application.properties
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit application.properties with your database credentials
```

### 4. Database Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE url_shortener;

-- Connect to the database
\c url_shortener

-- Exit psql
\q
```

### 5. Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project
3. Enable Google OAuth API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. Add authorized redirect URIs:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
7. Copy the Client ID to your frontend `.env` file

### 6. Start the Applications

1. Start the backend:
```bash
cd url-shortener-sb
./mvnw spring-boot:run
```

2. Start the frontend (in a new terminal):
```bash
cd url-shortener-react
npm run dev
```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

## Development Guidelines

### Code Style
- Frontend: Follow ESLint rules
- Backend: Follow Google Java Style Guide

### Git Workflow
1. Create a feature branch
2. Make changes
3. Run tests
4. Create pull request

### Testing
- Frontend: `npm test`
- Backend: `./mvnw test`

### Common Issues

1. **Database Connection**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **Google OAuth**
   - Verify client ID is correct
   - Check authorized origins
   - Ensure redirect URIs match

3. **CORS Issues**
   - Check backend CORS configuration
   - Verify frontend URL matches allowed origins

## Security Notes

1. Never commit sensitive information:
   - Database credentials
   - JWT secrets
   - API keys
   - OAuth credentials

2. Use environment variables for:
   - Database connection
   - JWT configuration
   - API endpoints
   - OAuth credentials

3. Keep dependencies updated:
   - Run `npm audit` for frontend
   - Run `./mvnw dependency-check:check` for backend

## Support

For local development issues:
1. Check the logs
2. Review the documentation
3. Create an issue in the repository 