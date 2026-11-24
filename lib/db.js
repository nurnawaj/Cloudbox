// Neon = PostgreSQL in the cloud. We talk to it with Neon's serverless driver,
// which sends each query over HTTPS. That suits Vercel: no connection pool to manage
// and no "too many connections" problems.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// Run one SQL query and get back an array of rows.
// Use $1, $2, ... as placeholders (this is what prevents SQL injection).
export async function query(text, params = []) {
  return sql.query(text, params);
}
