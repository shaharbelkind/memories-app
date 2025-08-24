import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    
    const where = childId ? { childId } : {}
    
    const shares = await prisma.share.findMany({
      where,
      include: {
        child: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(shares)
  } catch (error) {
    console.error('Error fetching shares:', error)
    return NextResponse.json({ error: 'Failed to fetch shares' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { childId, type, email, role, permissions } = body
    
    const share = await prisma.share.create({
      data: {
        childId,
        type,
        email: email || null,
        role: role || null,
        permissions: Array.isArray(permissions) ? permissions.join(',') : permissions || '',
        status: 'pending'
      },
      include: {
        child: true
      }
    })
    
    return NextResponse.json(share)
  } catch (error) {
    console.error('Error creating share:', error)
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 })
  }
}
