import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { startSession } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  const rows = await query(
    "SELECT id, password_hash FROM users WHERE email = $1",
    [email]
  );
  const user = rows[0];

  // bcrypt.compare hashes the typed password and compares it with the stored hash
  const ok = user && (await bcrypt.compare(password, user.password_hash));

  if (!ok) {
    // Same message for both cases so attackers cannot tell which emails exist
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  startSession(user.id);
  return NextResponse.json({ ok: true });
}
