import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const childId = formData.get('childId') as string

    if (!file || !childId) {
      return NextResponse.json({ error: 'File and childId are required' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}.${extension}`
    const filepath = join(uploadsDir, filename)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Determine file type
    const kind = file.type.startsWith('image/') ? 'photo' : 'video'
    const url = `/uploads/${filename}`

    // Save to database
    const memory = await prisma.memory.create({
      data: {
        childId,
        kind,
        url,
        tags: ''
      },
      include: {
        child: true
      }
    })

    return NextResponse.json(memory)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
