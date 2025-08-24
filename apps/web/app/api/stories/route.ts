import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    
    const where = childId ? { childId } : {}
    
    const stories = await prisma.story.findMany({
      where,
      include: {
        child: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(stories)
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { childId, type, title, year, duration } = body
    
    const story = await prisma.story.create({
      data: {
        childId,
        type,
        title,
        status: 'processing',
        year: year || null,
        duration: duration || null
      },
      include: {
        child: true
      }
    })
    
    return NextResponse.json(story)
  } catch (error) {
    console.error('Error creating story:', error)
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 })
  }
}
