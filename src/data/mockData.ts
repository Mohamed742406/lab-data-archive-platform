import { DraftRecord, User } from '../types';

// Default users with authentication credentials
export const defaultUsers: User[] = [
  { 
    id: '1', 
    name: 'فني المختبر', 
    role: 'technician',
    username: 'technician',
    password: 'tech123'
  },
  { 
    id: '2', 
    name: 'المهندس المسؤول', 
    role: 'engineer',
    username: 'engineer',
    password: 'eng123'
  },
];

// Empty initial data - ready for real data entry
export const initialDrafts: DraftRecord[] = [];
