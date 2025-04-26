# HubLocal Manager

A SaaS platform for managing companies and their locations, built with NestJS and NextJS.

## Features

- User authentication with JWT
- Company management (CRUD)
- Location management per company (CRUD)
- Multi-tenant architecture
- Docker support
- Database migrations

## Tech Stack

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Docker

## Prerequisites

- Node.js (v20 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hublocal-manager.git
cd hublocal-manager
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
```

3. Start the services with Docker Compose:
```bash
docker-compose up -d
```

4. Run database migrations:
```bash
cd backend
npm run migration:run
```

## Development

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

### Database Migrations

To create a new migration:
```bash
npm run migration:generate src/migrations/NameOfMigration
```

To run migrations:
```bash
npm run migration:run
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Environment Variables

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_SYNCHRONIZE`: Auto-sync database schema (false in production)
- `DB_LOGGING`: Enable database logging
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION`: JWT token expiration time
- `THROTTLE_TTL`: Rate limiting time window
- `THROTTLE_LIMIT`: Maximum requests per time window

## License

This project is licensed under the MIT License. 