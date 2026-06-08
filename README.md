# Digital Geo Classifier

A full-stack soil classification application with a TypeScript + Express backend and a Vite + React frontend.

## Project structure

- `backend/` – Express API, PostgreSQL persistence, Drizzle ORM, Zod validation.
- `soil-stabilization/` – React app built with Vite, Tailwind, and Recharts.

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL 12+

## Backend setup

1. Open a terminal and go to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment template and configure it:

```bash
copy .env.example .env
```

4. Update `.env` with your database connection and JWT secret. Example settings:

```env
POSTGRES_DB=digital_geo_classifier
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-this-local-db-password
DATABASE_URL=postgresql://postgres:change-this-local-db-password@localhost:5432/digital_geo_classifier
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRY=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

5. Create the PostgreSQL database if it does not already exist:

```bash
psql -U postgres -c "CREATE DATABASE digital_geo_classifier;"
```

6. Run migrations:

```bash
npm run db:migrate
```

7. Start the backend server in development mode:

```bash
npm run dev
```

The backend will listen on `http://localhost:3000` by default.

### Optional: Docker Compose

If you want to run the backend with Docker Compose, use:

```bash
docker-compose up -d
```

This starts PostgreSQL and the backend service together.

## Frontend setup

1. Open a second terminal and go to the frontend directory:

```bash
cd soil-stabilization
```

2. Install dependencies:

```bash
npm install
```

3. Copy the frontend environment template:

```bash
copy .env.example .env
```

4. Update `soil-stabilization/.env` to point to the backend API. For local development:

```env
VITE_API_URL=http://localhost:3000/api
```

5. Start the frontend dev server:

```bash
npm run dev
```

The frontend will usually be available at `http://localhost:5173`.

## Build for production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd soil-stabilization
npm run build
npm run preview
```

## Notes

- The backend is configured to accept requests from `http://localhost:5173` by default.
- If you use the frontend and backend locally, make sure `VITE_API_URL` matches the backend API URL.
- If you add new database schema fields, rerun migrations or update your local database accordingly.
