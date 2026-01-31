export type TestType = 'concrete' | 'asphalt' | 'soil';
export type ReportStatus = 'under_review' | 'approved';
export type UserRole = 'technician' | 'engineer';
export type ViewTab = 'dashboard' | 'archive';

export interface DraftRecord {
  id: string;
  sampleId: string;
  testType: TestType;
  imageUrl: string;
  imageName: string;
  uploadedBy: string;
  uploadedAt: Date;
  status: ReportStatus;
  notes?: string;
  engineerNotes?: string;
  finalReportUrl?: string;
  excelFileUrl?: string;
  excelFileName?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}
