# Digital Geo Classifier - Backend

A production-ready backend for the Digital Geo Classifier application built with Express.js, TypeScript, PostgreSQL, and Drizzle ORM.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Soil Classification**: USCS soil classification system with treatment recommendations
- **Reports Management**: Create, read, and delete soil classification reports
- **Dashboard**: User statistics and report analytics
- **Type Safety**: Full TypeScript support with type-safe database queries
- **Validation**: Input validation using Zod schemas
- **Error Handling**: Comprehensive error handling with custom error classes
- **Security**: Helmet for security headers, CORS configuration
- **Logging**: Morgan HTTP logging and custom logger

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation

1. **Clone the repository or navigate to the backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and update the following values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/digital_geo_classifier
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

4. **Create PostgreSQL database**

```bash
psql -U postgres -c "CREATE DATABASE digital_geo_classifier;"
```

5. **Run migrations**

```bash
npm run db:migrate
```

Or using Drizzle Kit:

```bash
npm run db:push
```

## Development

### Start development server

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Database Studio (Drizzle)

```bash
npm run db:studio
```

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token"
  },
  "message": "User registered successfully"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token"
  },
  "message": "Logged in successfully"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### Reports

#### Create Report
```
POST /api/reports
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "sieveNo200": 45.5,
  "sieveNo4": 55.2,
  "liquidLimit": 35.0,
  "plasticLimit": 18.5,
  "plasticityIndex": 16.5
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "sieveNo200": 45.5,
    "sieveNo4": 55.2,
    "liquidLimit": 35.0,
    "plasticLimit": 18.5,
    "plasticityIndex": 16.5,
    "soilClassification": "CL",
    "treatmentRecommendation": "Lime Stabilization - Add 2-4% hydrated lime by weight",
    "createdAt": "2024-01-01T12:00:00Z"
  },
  "message": "Report created successfully"
}
```

#### Get User Reports
```
GET /api/reports
Authorization: Bearer <jwt-token>
```

#### Get Single Report
```
GET /api/reports/:id
Authorization: Bearer <jwt-token>
```

#### Delete Report
```
DELETE /api/reports/:id
Authorization: Bearer <jwt-token>
```

### Dashboard

#### Get Dashboard Statistics
```
GET /api/dashboard/stats
Authorization: Bearer <jwt-token>
```

Response:
```json
{
  "success": true,
  "data": {
    "totalReports": 10,
    "classifications": {
      "CL": 4,
      "CH": 3,
      "SM": 2,
      "SC": 1
    },
    "lastReportDate": "2024-01-01T12:00:00Z"
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── authController.ts
│   │   ├── reportController.ts
│   │   └── dashboardController.ts
│   ├── routes/                # Express routes
│   │   ├── auth.ts
│   │   ├── reports.ts
│   │   └── dashboard.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts            # JWT authentication
│   │   ├── errorHandler.ts    # Error handling
│   │   └── validation.ts      # Request validation
│   ├── services/              # Business logic
│   │   ├── authService.ts
│   │   ├── reportService.ts
│   │   └── classificationService.ts
│   ├── db/
│   │   └── connection.ts      # Database connection
│   ├── schemas/               # Drizzle ORM schemas
│   │   └── index.ts
│   ├── validators/            # Zod validation schemas
│   │   ├── auth.ts
│   │   └── reports.ts
│   ├── types/                 # TypeScript types
│   │   ├── index.ts
│   │   └── express.d.ts
│   ├── utils/                 # Utility functions
│   │   ├── jwt.ts
│   │   ├── errors.ts
│   │   ├── responses.ts
│   │   ├── logger.ts
│   │   └── asyncHandler.ts
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Entry point
├── drizzle/
│   ├── 0001_create_tables.sql # Database migration
│   └── migrate.ts             # Migration runner
├── .env.example               # Environment variables example
├── drizzle.config.ts          # Drizzle config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## USCS Soil Classification Logic

The backend implements simplified USCS (Unified Soil Classification System) logic:

| Classification | Description | Treatment |
|---|---|---|
| CH | High Plasticity Clay | Cement Stabilization (3-5% Portland cement) |
| CL | Low Plasticity Clay | Lime Stabilization (2-4% hydrated lime) |
| SM | Silty Sand | Compaction (95% Standard Proctor density) |
| ML | Silt | Drainage Improvement |
| SC | Clayey Sand | Mechanical Stabilization |

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt (10 rounds)
3. User is created in the database
4. JWT token is generated and returned
5. Token must be included in `Authorization: Bearer <token>` header for protected routes
6. Token expires according to JWT_EXPIRY (default: 7 days)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `409` - Conflict (email already registered)
- `500` - Internal Server Error

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configured to accept requests from frontend origin
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing with salt rounds
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection Prevention**: Drizzle ORM parameterized queries

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Secret key for JWT signing | - |
| JWT_EXPIRY | JWT token expiry time | 7d |
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Soil Reports Table
```sql
CREATE TABLE soil_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sieve_no_200 NUMERIC(5, 2) NOT NULL,
  sieve_no_4 NUMERIC(5, 2) NOT NULL,
  liquid_limit NUMERIC(5, 2) NOT NULL,
  plastic_limit NUMERIC(5, 2) NOT NULL,
  plasticity_index NUMERIC(5, 2) NOT NULL,
  soil_classification TEXT NOT NULL,
  treatment_recommendation TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

To test the API, you can use:

- **Postman**: Import the API endpoints
- **cURL**: Command line HTTP client
- **Thunder Client**: VS Code extension
- **Insomnia**: Desktop API client

### Example cURL request

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Create Report
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sieveNo200": 45.5,
    "sieveNo4": 55.2,
    "liquidLimit": 35.0,
    "plasticLimit": 18.5,
    "plasticityIndex": 16.5
  }'
```

## Deployment

### Build for production

```bash
npm run build
```

### Run production build

```bash
npm start
```

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t digital-geo-classifier-backend .
docker run -p 3000:3000 --env-file .env digital-geo-classifier-backend
```

## Troubleshooting

### Database Connection Error

Ensure PostgreSQL is running and the DATABASE_URL is correct:

```bash
psql -c "SELECT 1"
```

### Port Already in Use

Change the PORT in `.env` or kill the process using port 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### JWT Token Invalid

- Ensure JWT_SECRET is the same in .env
- Check token hasn't expired (default 7 days)
- Verify token format in Authorization header: `Bearer <token>`

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
