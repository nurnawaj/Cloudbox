import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { startSession } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email.includes("@") || password.length < 6) {
    return NextResponse.json(
      { error: "Enter a valid email and a password of at least 6 characters." },
      { status: 400 }
    );
  }

  // $1 is a placeholder: it prevents SQL injection
  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
  }

  // Hash the password (10 = salt rounds)
  const hash = await bcrypt.hash(password, 10);
  const rows = await query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
    [email, hash]
  );

  startSession(rows[0].id);
  return NextResponse.json({ ok: true });
}
