import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (in production, use a real database)
let memories: any[] = [
  {
    id: '1',
    kind: 'photo',
    url: 'https://via.placeholder.com/400x300',
    previewUrl: 'https://via.placeholder.com/200x150',
    transcript: '',
    tags: ['family', 'birthday'],
    takenAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    kind: 'video',
    url: 'https://via.placeholder.com/400x300',
    previewUrl: 'https://via.placeholder.com/200x150',
    transcript: 'First steps! Look at that smile.',
    tags: ['first-steps', 'milestone'],
    takenAt: '2024-02-20T00:00:00Z',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get('childId');
  const query = searchParams.get('query') || '';
  const topK = parseInt(searchParams.get('topK') || '20');

  if (!query) {
    return NextResponse.json([]);
  }

  const searchTerm = query.toLowerCase();
  const results = memories
    .filter(memory => 
      memory.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
      memory.transcript?.toLowerCase().includes(searchTerm) ||
      memory.kind.toLowerCase().includes(searchTerm)
    )
    .slice(0, topK);

  return NextResponse.json(results);
}
