import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const childId = formData.get('childId') as string;
    const kind = formData.get('kind') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create memory object
    const memory = {
      id: timestamp.toString(),
      childId,
      kind,
      url: `/uploads/${fileName}`,
      takenAt: new Date().toISOString(),
      tags: getDefaultTags(kind),
      createdAt: new Date().toISOString(),
    };

    // TODO: Enqueue for AI processing
    // await enqueueMediaProcessing(memory);

    return NextResponse.json(memory);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

function getDefaultTags(kind: string): string[] {
  switch (kind) {
    case 'PHOTO': return ['photo', 'memory'];
    case 'VIDEO': return ['video', 'memory'];
    case 'AUDIO': return ['audio', 'memory'];
    case 'DOC': return ['document', 'memory'];
    case 'SCAN3D': return ['3d-scan', 'memory'];
    default: return ['memory'];
  }
}
