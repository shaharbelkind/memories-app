export interface Memory {
  id: string;
  childId: string;
  kind: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOC' | 'SCAN3D';
  url: string;
  takenAt?: string;
  tags?: string[];
}

export interface Child {
  id: string;
  name: string;
  dob?: string;
}

export interface Milestone {
  id: string;
  childId: string;
  kind: string;
  title: string;
  date: string;
  confidence: number;
  linkedMemoryIds: string[];
  createdAt: string;
}

export interface Story {
  id: string;
  childId: string;
  type: 'annual-film' | 'storybook' | 'ar-room';
  title: string;
  status: 'processing' | 'completed' | 'failed';
  year?: number;
  duration?: number;
  url?: string;
  createdAt: string;
}

export interface ARObject {
  id: string;
  childId: string;
  name: string;
  meshUrl: string;
  previewUrl: string;
  linkedMemoryIds: string[];
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface Share {
  id: string;
  childId: string;
  type: 'family' | 'link';
  email?: string;
  role?: string;
  permissions: string[];
  status: string;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export const api = {
  // Memory operations
  async getMemories(childId: string): Promise<Memory[]> {
    const response = await fetch(`${API_BASE}/api/memories?childId=${childId}`);
    return response.json();
  },

  async uploadMemory(childId: string, file: File, kind: string): Promise<Memory> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('childId', childId);
    formData.append('kind', kind);

    const response = await fetch(`${API_BASE}/api/memories/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload memory');
    }
    
    return response.json();
  },

  // Child operations
  async getChildren(): Promise<Child[]> {
    const response = await fetch(`${API_BASE}/api/children`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch children');
    }
    
    return response.json();
  },

  async createChild(name: string, dob?: string): Promise<Child> {
    const response = await fetch(`${API_BASE}/api/children`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dob }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create child');
    }
    
    return response.json();
  },

  // Milestone operations
  async getMilestones(childId?: string): Promise<Milestone[]> {
    const url = childId ? `${API_BASE}/api/milestones?childId=${childId}` : `${API_BASE}/api/milestones`;
    const response = await fetch(url);
    return response.json();
  },

  async createMilestone(childId: string, kind: string, title: string, date: string, linkedMemoryIds?: string[]): Promise<Milestone> {
    const response = await fetch(`${API_BASE}/api/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childId, kind, title, date, linkedMemoryIds }),
    });
    return response.json();
  },

  // Story operations
  async getStories(childId?: string, type?: string): Promise<Story[]> {
    const params = new URLSearchParams();
    if (childId) params.append('childId', childId);
    if (type) params.append('type', type);
    
    const response = await fetch(`${API_BASE}/api/stories?${params.toString()}`);
    return response.json();
  },

  async createStory(childId: string, type: string, title: string, year?: number, duration?: number): Promise<Story> {
    const response = await fetch(`${API_BASE}/api/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childId, type, title, year, duration }),
    });
    return response.json();
  },

  // AR Object operations
  async getARObjects(childId?: string): Promise<ARObject[]> {
    const url = childId ? `${API_BASE}/api/ar-objects?childId=${childId}` : `${API_BASE}/api/ar-objects`;
    const response = await fetch(url);
    return response.json();
  },

  async createARObject(childId: string, name: string, linkedMemoryIds?: string[]): Promise<ARObject> {
    const response = await fetch(`${API_BASE}/api/ar-objects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childId, name, linkedMemoryIds }),
    });
    return response.json();
  },

  // Share operations
  async getShares(childId?: string): Promise<Share[]> {
    const url = childId ? `${API_BASE}/api/shares?childId=${childId}` : `${API_BASE}/api/shares`;
    const response = await fetch(url);
    return response.json();
  },

  async createShare(childId: string, type: string, email?: string, role?: string, permissions?: string[]): Promise<Share> {
    const response = await fetch(`${API_BASE}/api/shares`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childId, type, email, role, permissions }),
    });
    return response.json();
  },
};
