import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

// 4 MB because Vercel only accepts request bodies up to 4.5 MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const STORAGE_LIMIT = 100 * 1024 * 1024; // 100 MB per user
const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

// Let the database add up the size of all my files
async function usedStorage(userId) {
  const rows = await query(
    "SELECT COALESCE(SUM(size), 0) AS used FROM files WHERE user_id = $1",
    [userId]
  );
  return Number(rows[0].used);
}

// List my files and how much storage I have used
export async function GET() {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const files = await query(
    "SELECT id, name, mime_type, size, url, created_at FROM files WHERE user_id = $1 ORDER BY created_at DESC, id DESC",
    [userId]
  );
  const users = await query("SELECT email FROM users WHERE id = $1", [userId]);
  return NextResponse.json({
    files,
    user: { email: users[0]?.email || "" },
    storage: { used: await usedStorage(userId), limit: STORAGE_LIMIT },
  });
}

// Upload: the file goes to Cloudinary, the record goes to the database
export async function POST(req) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Choose a file first." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only photos and PDFs are allowed." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is larger than 4 MB." }, { status: 400 });
  }

  try {
    // Stop if this upload would go over my storage limit
    if ((await usedStorage(userId)) + file.size > STORAGE_LIMIT) {
      return NextResponse.json({ error: "Storage full. Delete some files first." }, { status: 400 });
    }

    // 1. Send the file to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadToCloudinary(buffer, `cloudbox/user_${userId}`);

    // 2. Save the Cloudinary link in the database
    await query(
      `INSERT INTO files (user_id, name, mime_type, size, url, public_id, resource_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, file.name, file.type, file.size, uploaded.secure_url, uploaded.public_id, uploaded.resource_type]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Check your Cloudinary keys." }, { status: 500 });
  }
}
