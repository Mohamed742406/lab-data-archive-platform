export interface Draft {
  id: number;
  draft_number: string;
  project_name: string;
  client_name: string;
  test_type: string;
  sample_location: string;
  depth: string;
  status: 'pending' | 'approved' | 'rejected';
  technician_id: string;
  engineer_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  role: 'technician' | 'engineer';
}
