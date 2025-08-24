export type MemoryKind = 'PHOTO'|'VIDEO'|'AUDIO'|'DOC'|'SCAN3D';
export interface Child { id: string; name: string; dob?: string }
export interface Memory { id: string; childId: string; kind: MemoryKind; url: string; takenAt?: string; tags?: string[] }
