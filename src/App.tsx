import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { TechnicianUpload } from './components/TechnicianUpload';
import { EngineerDashboard } from './components/EngineerDashboard';
import { StatsCards } from './components/StatsCards';
import { BilingualButton } from './components/BilingualButton';
import { BilingualLabel } from './components/BilingualLabel';
import { StatusBadge } from './components/StatusBadge';
import { DraftRecord, ReportStatus, TestType, User } from './types';
import { initialDrafts } from './data/mockData';

export function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data State
  const [drafts, setDrafts] = useState<DraftRecord[]>(initialDrafts);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handleUpload = (newDraft: Omit<DraftRecord, 'id' | 'uploadedAt' | 'status'>) => {
    const draft: DraftRecord = {
      ...newDraft,
      id: Date.now().toString(),
      uploadedAt: new Date(),
      status: 'under_review',
    };
    setDrafts((prev) => [draft, ...prev]);
  };

  const handleStatusChange = (id: string, status: ReportStatus, notes?: string) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === id
          ? { ...draft, status, engineerNotes: notes || draft.engineerNotes }
          : draft
      )
    );
  };

  const handleDelete = (id: string) => {
    // Only engineers can delete
    if (currentUser?.role !== 'engineer') return;
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
  };

  const handleEdit = (id: string, updatedData: Partial<DraftRecord>) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === id ? { ...draft, ...updatedData } : draft
      )
    );
  };

  // Show login page if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50" dir="rtl">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <section className="mb-8">
          <StatsCards drafts={drafts} />
        </section>

        {/* Main Content */}
        {currentUser.role === 'technician' ? (
          <div className="space-y-8">
            <div className="max-w-xl mx-auto">
              <TechnicianUpload onUpload={handleUpload} technicianName={currentUser.name} />
            </div>
            
            {/* Technician's Uploaded Drafts - NO DELETE BUTTON */}
            {drafts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="mb-4 text-center border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-800">الدرفت المرفوعة</h2>
                  <p className="text-gray-500 text-sm">Uploaded Drafts</p>
                </div>
                <TechnicianDraftList 
                  drafts={drafts} 
                  onEdit={handleEdit}
                />
              </div>
            )}
          </div>
        ) : (
          <EngineerDashboard 
            drafts={drafts} 
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
            userRole={currentUser.role}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <p className="font-semibold">منصة أرشفة الدرفت والتقارير المعملية</p>
            <p className="text-gray-400 text-sm">Lab Draft & Reports Archive Platform</p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 - مختبرات مواد البناء | Construction Materials Laboratories
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Technician Draft List Component - NO DELETE functionality for technicians
interface TechnicianDraftListProps {
  drafts: DraftRecord[];
  onEdit: (id: string, data: Partial<DraftRecord>) => void;
}

function TechnicianDraftList({ drafts, onEdit }: TechnicianDraftListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ sampleId: string; testType: TestType; notes: string }>({
    sampleId: '',
    testType: 'concrete',
    notes: '',
  });

  const startEdit = (draft: DraftRecord) => {
    if (draft.status === 'approved') return; // Cannot edit approved drafts
    setEditingId(draft.id);
    setEditData({
      sampleId: draft.sampleId,
      testType: draft.testType,
      notes: draft.notes || '',
    });
  };

  const saveEdit = () => {
    if (editingId) {
      onEdit(editingId, editData);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ sampleId: '', testType: 'concrete', notes: '' });
  };

  const getTestTypeBadge = (type: TestType) => {
    const configs = {
      concrete: { arabic: 'خرسانة', english: 'Concrete', bg: 'bg-gray-100', text: 'text-gray-700' },
      asphalt: { arabic: 'أسفلت', english: 'Asphalt', bg: 'bg-stone-100', text: 'text-stone-700' },
      soil: { arabic: 'تربة', english: 'Soil', bg: 'bg-amber-100', text: 'text-amber-700' },
    };
    const config = configs[type];
    return (
      <span className={`inline-flex flex-col items-center px-2 py-1 rounded ${config.bg} ${config.text}`}>
        <span className="text-xs font-medium">{config.arabic}</span>
        <span className="text-[10px]">{config.english}</span>
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-center">
              <BilingualLabel arabicText="الصورة" englishText="Image" size="sm" />
            </th>
            <th className="px-4 py-3 text-center">
              <BilingualLabel arabicText="رقم العينة" englishText="Sample ID" size="sm" />
            </th>
            <th className="px-4 py-3 text-center">
              <BilingualLabel arabicText="نوع الاختبار" englishText="Test Type" size="sm" />
            </th>
            <th className="px-4 py-3 text-center">
              <BilingualLabel arabicText="ملف الحسابات" englishText="Excel File" size="sm" />
            </th>
            <th className="px-4 py-3 text-center">
              <BilingualLabel arabicText="تاريخ الرفع" englishText="Upload Date" size="sm" />
            </th>
            <th className="px-4 py-3 text-center">
              <BilingualLabel arabicText="الحالة" englishText="Status" size="sm" />
            </th>
            <th className="px-4 py-3 text-center">
              <BilingualLabel arabicText="الإجراءات" englishText="Actions" size="sm" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {drafts.map((draft) => (
            <tr key={draft.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <img
                  src={draft.imageUrl}
                  alt={draft.imageName}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </td>
              <td className="px-4 py-3 text-center">
                {editingId === draft.id ? (
                  <input
                    type="text"
                    value={editData.sampleId}
                    onChange={(e) => setEditData({ ...editData, sampleId: e.target.value })}
                    className="w-full px-2 py-1 border rounded text-center"
                  />
                ) : (
                  <span className="font-mono font-semibold text-blue-600">{draft.sampleId}</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {editingId === draft.id ? (
                  <select
                    value={editData.testType}
                    onChange={(e) => setEditData({ ...editData, testType: e.target.value as TestType })}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="concrete">خرسانة</option>
                    <option value="asphalt">أسفلت</option>
                    <option value="soil">تربة</option>
                  </select>
                ) : (
                  getTestTypeBadge(draft.testType)
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {draft.excelFileName ? (
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs text-gray-500 truncate max-w-[80px]">{draft.excelFileName}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600">
                {formatDate(draft.uploadedAt)}
              </td>
              <td className="px-4 py-3 text-center">
                <StatusBadge status={draft.status} />
              </td>
              <td className="px-4 py-3 text-center">
                {draft.status === 'under_review' ? (
                  editingId === draft.id ? (
                    <div className="flex gap-2 justify-center">
                      <BilingualButton
                        arabicText="حفظ"
                        englishText="Save"
                        variant="success"
                        size="sm"
                        onClick={saveEdit}
                      />
                      <BilingualButton
                        arabicText="إلغاء"
                        englishText="Cancel"
                        variant="secondary"
                        size="sm"
                        onClick={cancelEdit}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <BilingualButton
                        arabicText="تعديل"
                        englishText="Edit"
                        variant="warning"
                        size="sm"
                        onClick={() => startEdit(draft)}
                      />
                      {/* NO DELETE BUTTON for technicians */}
                    </div>
                  )
                ) : (
                  <span className="text-green-600 text-sm font-medium flex flex-col items-center">
                    <span>معتمد</span>
                    <span className="text-xs text-green-500">Approved</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {drafts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">لا توجد درفت مرفوعة</p>
          <p className="text-sm">No drafts uploaded yet</p>
        </div>
      )}
    </div>
  );
}
