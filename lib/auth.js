// Login = a JWT token stored in an httpOnly cookie.
// httpOnly means JavaScript in the browser cannot read it (safer against XSS).
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const WEEK = 60 * 60 * 24 * 7;

export function startSession(userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: WEEK });
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS-only when deployed
    sameSite: "lax",
    path: "/",
    maxAge: WEEK,
  });
}

export function endSession() {
  cookies().delete("token");
}

// Returns the logged-in user's id, or null if not logged in.
export function getUserId() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null;
  }
}
