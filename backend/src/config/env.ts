function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  databaseUrl: requiredEnv('DATABASE_URL'),
  jwtSecret: requiredEnv('JWT_SECRET'),
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
