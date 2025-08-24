import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const children = await prisma.child.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(children)
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, dob } = body
    
    const child = await prisma.child.create({
      data: {
        name,
        dob
      }
    })
    
    return NextResponse.json(child)
  } catch (error) {
    console.error('Error creating child:', error)
    return NextResponse.json({ error: 'Failed to create child' }, { status: 500 })
  }
}
