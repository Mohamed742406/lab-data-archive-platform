import { DraftRecord, User } from '../types';

// Default users with authentication credentials
export const defaultUsers: User[] = [
  {
    id: '1',
    name: 'فني المختبر',
    role: 'technician',
    username: 'elkasaby1988',
    password: 'elkasaby1988'
  },
  {
    id: '2',
    name: 'المهندس المسؤول',
    role: 'engineer',
    username: 'elkasaby1988',
    password: 'elkasaby1988'
  },
];

// Empty initial data - ready for real data entry
export const initialDrafts: DraftRecord[] = [];
