import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for milestones
let milestones: any[] = [
  {
    id: '1',
    childId: 'c1',
    kind: 'birthday',
    title: 'Emma\'s 5th Birthday',
    date: '2024-03-15',
    confidence: 0.95,
    linkedMemoryIds: ['m1'],
    createdAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    childId: 'c2',
    kind: 'first-step',
    title: 'Leo\'s First Steps',
    date: '2024-02-20',
    confidence: 0.88,
    linkedMemoryIds: ['m2'],
    createdAt: '2024-02-20T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get('childId');

  if (childId) {
    const childMilestones = milestones.filter(m => m.childId === childId);
    return NextResponse.json(childMilestones);
  }

  return NextResponse.json(milestones);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, kind, title, date, linkedMemoryIds } = body;

    const milestone = {
      id: Date.now().toString(),
      childId,
      kind,
      title,
      date,
      confidence: 0.9,
      linkedMemoryIds: linkedMemoryIds || [],
      createdAt: new Date().toISOString(),
    };

    milestones.push(milestone);
    return NextResponse.json(milestone);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}
