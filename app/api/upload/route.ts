import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name) || '.png';
    const filename = `karya-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;

    // Target upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Dynamic media URL accessible immediately on all devices
    const publicUrl = `/api/media/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('API /api/upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
