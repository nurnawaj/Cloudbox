import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

// Download: "AND user_id = $2" means you can only get your own files
export async function GET(req, { params }) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rows = await query(
    "SELECT name, mime_type, url FROM files WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fetch the file from Cloudinary and send it to the browser
  const file = rows[0];
  const upstream = await fetch(file.url);
  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Cloudinary could not deliver this file. For PDFs, enable PDF delivery in Cloudinary Security settings." },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": file.mime_type,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    },
  });
}

// Delete from Cloudinary first, then remove the database row
export async function DELETE(req, { params }) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rows = await query(
    "SELECT public_id, resource_type FROM files WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteFromCloudinary(rows[0].public_id, rows[0].resource_type).catch(() => {});
  await query("DELETE FROM files WHERE id = $1 AND user_id = $2", [id, userId]);
  return NextResponse.json({ ok: true });
}
