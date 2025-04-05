import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Get PostgreSQL connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a Postgres client
const client = postgres(connectionString);

// Create a Drizzle client
export const db = drizzle(client, { schema });

// Export for use in the application
export default db;