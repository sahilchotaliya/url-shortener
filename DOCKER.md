# Docker Setup for URL Shortener Project

This document provides instructions for running the URL Shortener project using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuration

1. Create a copy of the example environment file:

```bash
cp .env.docker .env
```

2. Edit the `.env` file to set your own values for:
   - Database credentials
   - JWT secret
   - Google Client ID (if using OAuth)

## Running the Application

1. Build and start all services:

```bash
docker-compose up -d
```

This command will:
- Build the Spring Boot backend
- Build the React frontend
- Start a MySQL database
- Connect all services together

2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080

## Stopping the Application

To stop all services:

```bash
docker-compose down
```

To stop all services and remove volumes (this will delete the database data):

```bash
docker-compose down -v
```

## Viewing Logs

To view logs from all services:

```bash
docker-compose logs -f
```

To view logs from a specific service:

```bash
docker-compose logs -f [service_name]
```

Where `[service_name]` can be `frontend`, `backend`, or `db`.

## Rebuilding Services

If you make changes to the code, you need to rebuild the services:

```bash
docker-compose build
docker-compose up -d
```

## Production Deployment

For production deployment, consider:

1. Using a more secure database password
2. Setting up proper SSL/TLS certificates
3. Using a production-ready database setup with backups
4. Implementing proper logging and monitoring

## Troubleshooting

### Database Connection Issues

If the backend cannot connect to the database, ensure:
1. The database service is running: `docker-compose ps`
2. The database credentials in `.env` are correct
3. The database has been initialized properly

### Frontend Cannot Connect to Backend

If the frontend cannot connect to the backend, ensure:
1. The backend service is running: `docker-compose ps`
2. The `VITE_BACKEND_URL` in `.env` is set correctly
3. The backend is accessible from the frontend container 