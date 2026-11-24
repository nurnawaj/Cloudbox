// Creates the tables on your Neon database by running database/schema.sql.
// Usage:  npm run setup-db      (reads DATABASE_URL from .env.local)
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Put it in .env.local first.");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);
  const file = fs.readFileSync(path.join(__dirname, "..", "database", "schema.sql"), "utf8");

  // remove "-- comments", then run the statements one by one
  const statements = file
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
  const tables = await sql.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log("Done. Tables in your database:", tables.map((t) => t.table_name).join(", "));
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
