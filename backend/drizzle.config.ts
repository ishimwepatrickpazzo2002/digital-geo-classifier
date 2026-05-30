import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schemas',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/digital_geo_classifier',
  },
  verbose: true,
  strict: true,
});
