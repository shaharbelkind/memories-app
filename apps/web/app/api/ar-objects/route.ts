import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    
    const where = childId ? { childId } : {}
    
    const arObjects = await prisma.aRObject.findMany({
      where,
      include: {
        child: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(arObjects)
  } catch (error) {
    console.error('Error fetching AR objects:', error)
    return NextResponse.json({ error: 'Failed to fetch AR objects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { childId, name } = body
    
    const arObject = await prisma.aRObject.create({
      data: {
        childId,
        name,
        meshUrl: 'https://picsum.photos/400x400',
        previewUrl: 'https://picsum.photos/200x200',
        status: 'processing'
      },
      include: {
        child: true
      }
    })
    
    return NextResponse.json(arObject)
  } catch (error) {
    console.error('Error creating AR object:', error)
    return NextResponse.json({ error: 'Failed to create AR object' }, { status: 500 })
  }
}
