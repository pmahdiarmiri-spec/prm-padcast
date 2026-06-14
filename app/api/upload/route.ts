import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization");
    const serverToken = process.env.ADMIN_SECRET_TOKEN;

    if (!token || token !== serverToken) {
      return NextResponse.json({ error: "Unauthorized Token Configuration" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, uniqueName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    return NextResponse.json({ error: "Server upload failed internal error", details: error.message || String(error) }, { status: 500 });
  }
}
