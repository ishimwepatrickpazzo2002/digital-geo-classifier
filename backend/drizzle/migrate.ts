import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Migration error: DATABASE_URL is not configured.');
  console.error('Copy .env.example to .env and set DATABASE_URL to your PostgreSQL connection string.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const runMigrations = async () => {
  try {
    const migrationFile = path.join(__dirname, '0001_create_tables.sql');
    const migrationSQL = fs.readFileSync(migrationFile, 'utf-8');

    await pool.query(migrationSQL);
    console.log('Migrations completed successfully');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'ECONNREFUSED') {
      console.error('Migration error: Unable to connect to PostgreSQL.');
      console.error('Please ensure PostgreSQL is running and DATABASE_URL is correct.');
      console.error(
        'If you are using Docker Compose, run: docker-compose up -d postgres'
      );
    } else {
      console.error('Migration error:', error);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
