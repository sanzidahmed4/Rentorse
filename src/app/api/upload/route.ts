import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth-server";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    // Restrict file uploads strictly to authenticated admins
    const unauthorized = await requireAdmin(req);
    if (unauthorized) return unauthorized;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/jpg"];
    if (!validMimes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
      return NextResponse.json({ error: "Invalid file type. Please upload a JPG, PNG, or WebP image." }, { status: 400 });
    }

    // Limit to 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Cloudinary is configured, upload directly to Cloudinary CDN!
    if (isCloudinaryConfigured()) {
      try {
        const cloudResult = await uploadToCloudinary(buffer, "apartmento/apartments");
        return NextResponse.json({
          success: true,
          url: cloudResult.url,
          provider: "cloudinary",
          publicId: cloudResult.publicId,
        });
      } catch (cloudErr) {
        console.error("Cloudinary upload error, falling back to local storage:", cloudErr);
      }
    }

    // 2. Fallback to local public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 30);
    const fileName = `apt-${Date.now()}-${cleanBaseName || "photo"}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      provider: "local",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
