import { useState } from 'react';
import { BilingualButton } from './BilingualButton';
import { BilingualLabel } from './BilingualLabel';
import { StatusBadge } from './StatusBadge';
import { AdvancedSearch } from './AdvancedSearch';
import { ArchiveSection } from './ArchiveSection';
import { NotificationAlert } from './NotificationBadge';
import { PrintReport } from './PrintReport';
import { DraftRecord, ReportStatus, TestType, ViewTab, UserRole } from '../types';

interface EngineerDashboardProps {
  drafts: DraftRecord[];
  onStatusChange: (id: string, status: ReportStatus, notes?: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: Partial<DraftRecord>) => void;
  userRole: UserRole;
}

export function EngineerDashboard({ drafts, onStatusChange, onDelete, onEdit, userRole }: EngineerDashboardProps) {
  const [selectedDraft, setSelectedDraft] = useState<DraftRecord | null>(null);
  const [engineerNotes, setEngineerNotes] = useState('');
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [showNotification, setShowNotification] = useState(true);
  const [printDraft, setPrintDraft] = useState<DraftRecord | null>(null);
  
  // Advanced Search States
  const [searchSampleId, setSearchSampleId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filterType, setFilterType] = useState<TestType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');
  const [searchNotes, setSearchNotes] = useState('');
  const [searchTechnician, setSearchTechnician] = useState('');

  // Edit & Delete States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ sampleId: string; testType: TestType; notes: string }>({
    sampleId: '',
    testType: 'concrete',
    notes: '',
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Count under review items for notification
  const underReviewCount = drafts.filter(d => d.status === 'under_review').length;

  const clearFilters = () => {
    setSearchSampleId('');
    setSearchDate('');
    setFilterType('all');
    setFilterStatus('all');
    setSearchNotes('');
    setSearchTechnician('');
  };

  const filteredDrafts = drafts.filter((draft) => {
    const sampleMatch = searchSampleId === '' || 
      draft.sampleId.toLowerCase().includes(searchSampleId.toLowerCase());
    const dateMatch = searchDate === '' || 
      draft.uploadedAt.toISOString().split('T')[0] === searchDate;
    const typeMatch = filterType === 'all' || draft.testType === filterType;
    const statusMatch = filterStatus === 'all' || draft.status === filterStatus;
    const notesMatch = searchNotes === '' || 
      (draft.notes?.toLowerCase().includes(searchNotes.toLowerCase()) ?? false);
    const technicianMatch = searchTechnician === '' ||
      draft.uploadedBy.toLowerCase().includes(searchTechnician.toLowerCase());
    
    return sampleMatch && dateMatch && typeMatch && statusMatch && notesMatch && technicianMatch;
  });

  const handleApprove = (draft: DraftRecord) => {
    onStatusChange(draft.id, 'approved', engineerNotes);
    setSelectedDraft(null);
    setEngineerNotes('');
  };

  const startEdit = (draft: DraftRecord) => {
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

  const confirmDelete = (id: string) => {
    // Only engineers can delete
    if (userRole !== 'engineer') return;
    onDelete(id);
    setDeleteConfirmId(null);
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

  const getTestTypeBadge = (type: TestType) => {
    const configs = {
      concrete: {
        arabic: 'خرسانة',
        english: 'Concrete',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
      },
      asphalt: {
        arabic: 'أسفلت',
        english: 'Asphalt',
        bgColor: 'bg-stone-100',
        textColor: 'text-stone-700',
      },
      soil: {
        arabic: 'تربة',
        english: 'Soil',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
      },
    };
    const config = configs[type];
    return (
      <span className={`inline-flex flex-col items-center px-2 py-1 rounded ${config.bgColor} ${config.textColor}`}>
        <span className="text-xs font-medium">{config.arabic}</span>
        <span className="text-[10px]">{config.english}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Notification Alert for Under Review Items */}
      {showNotification && activeTab === 'dashboard' && (
        <NotificationAlert 
          count={underReviewCount} 
          onDismiss={() => setShowNotification(false)} 
        />
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex flex-col items-center relative ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>لوحة التحكم</span>
            {underReviewCount > 0 && activeTab !== 'dashboard' && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {underReviewCount}
              </span>
            )}
          </div>
          <span className="text-xs opacity-80">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex flex-col items-center ${
            activeTab === 'archive'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>الأرشيف</span>
          </div>
          <span className="text-xs opacity-80">Archive</span>
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Advanced Search */}
          <AdvancedSearch
            searchSampleId={searchSampleId}
            setSearchSampleId={setSearchSampleId}
            searchDate={searchDate}
            setSearchDate={setSearchDate}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onClearFilters={clearFilters}
            searchNotes={searchNotes}
            setSearchNotes={setSearchNotes}
            searchTechnician={searchTechnician}
            setSearchTechnician={setSearchTechnician}
          />

          {/* Dashboard Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">لوحة تحكم المهندس</h2>
                  <p className="text-gray-500 text-sm">Engineer Dashboard</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                  <span className="font-bold text-lg">{filteredDrafts.length}</span>
                  <span className="text-sm mr-2">سجل / Records</span>
                </div>
              </div>
            </div>

            {/* Table */}
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
                      <BilingualLabel arabicText="الفني" englishText="Technician" size="sm" />
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
                  {filteredDrafts.map((draft) => (
                    <tr key={draft.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <img
                          src={draft.imageUrl}
                          alt={draft.imageName}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedDraft(draft)}
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
                          <span className="font-mono font-semibold text-blue-600">
                            {draft.sampleId}
                          </span>
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
                          <a
                            href={draft.excelFileUrl}
                            download={draft.excelFileName}
                            className="flex flex-col items-center text-green-600 hover:text-green-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs">تحميل</span>
                            <span className="text-[10px]">Download</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {draft.uploadedBy}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {formatDate(draft.uploadedAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={draft.status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editingId === draft.id ? (
                          <div className="flex gap-1 justify-center flex-wrap">
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
                        ) : deleteConfirmId === draft.id ? (
                          <div className="flex gap-1 justify-center flex-wrap">
                            <BilingualButton
                              arabicText="تأكيد الحذف"
                              englishText="Confirm"
                              variant="danger"
                              size="sm"
                              onClick={() => confirmDelete(draft.id)}
                            />
                            <BilingualButton
                              arabicText="إلغاء"
                              englishText="Cancel"
                              variant="secondary"
                              size="sm"
                              onClick={() => setDeleteConfirmId(null)}
                            />
                          </div>
                        ) : (
                          <div className="flex gap-1 justify-center flex-wrap">
                            <BilingualButton
                              arabicText="عرض"
                              englishText="View"
                              variant="primary"
                              size="sm"
                              onClick={() => setSelectedDraft(draft)}
                            />
                            {draft.status === 'under_review' && (
                              <BilingualButton
                                arabicText="تعديل"
                                englishText="Edit"
                                variant="warning"
                                size="sm"
                                onClick={() => startEdit(draft)}
                              />
                            )}
                            {/* Only engineers can delete */}
                            {userRole === 'engineer' && (
                              <BilingualButton
                                arabicText="مسح"
                                englishText="Delete"
                                variant="danger"
                                size="sm"
                                onClick={() => setDeleteConfirmId(draft.id)}
                              />
                            )}
                            {draft.status === 'approved' && (
                              <BilingualButton
                                arabicText="طباعة"
                                englishText="Print"
                                variant="success"
                                size="sm"
                                onClick={() => setPrintDraft(draft)}
                              />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDrafts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">لا توجد سجلات</p>
                  <p className="text-sm">No records found</p>
                  {(searchSampleId || searchDate || filterType !== 'all' || filterStatus !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-blue-600 hover:underline text-sm"
                    >
                      مسح جميع الفلاتر / Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <ArchiveSection drafts={drafts} onDelete={onDelete} userRole={userRole} onPrint={setPrintDraft} />
      )}

      {/* Modal */}
      {selectedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">تفاصيل الدرفت</h3>
                  <p className="text-gray-500 text-sm">Draft Details</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDraft(null);
                    setEngineerNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Image */}
              <div>
                <img
                  src={selectedDraft.imageUrl}
                  alt={selectedDraft.imageName}
                  className="w-full rounded-lg border border-gray-200 shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-2">{selectedDraft.imageName}</p>
                
                {/* Excel File Download in Modal */}
                {selectedDraft.excelFileName && (
                  <a
                    href={selectedDraft.excelFileUrl}
                    download={selectedDraft.excelFileName}
                    className="mt-3 flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">تحميل ملف الحسابات</span>
                      <span className="text-xs">Download Calculations File</span>
                    </div>
                  </a>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <BilingualLabel arabicText="رقم العينة" englishText="Sample ID" size="sm" />
                    <p className="font-mono font-bold text-blue-600 mt-1">
                      {selectedDraft.sampleId}
                    </p>
                  </div>
                  <div>
                    <BilingualLabel arabicText="نوع الاختبار" englishText="Test Type" size="sm" />
                    <div className="mt-1">{getTestTypeBadge(selectedDraft.testType)}</div>
                  </div>
                  <div>
                    <BilingualLabel arabicText="الفني" englishText="Technician" size="sm" />
                    <p className="text-gray-700 mt-1">{selectedDraft.uploadedBy}</p>
                  </div>
                  <div>
                    <BilingualLabel arabicText="الحالة" englishText="Status" size="sm" />
                    <div className="mt-1">
                      <StatusBadge status={selectedDraft.status} />
                    </div>
                  </div>
                </div>

                {selectedDraft.notes && (
                  <div>
                    <BilingualLabel arabicText="ملاحظات الفني" englishText="Technician Notes" size="sm" />
                    <p className="text-gray-600 mt-1 text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedDraft.notes}
                    </p>
                  </div>
                )}

                {selectedDraft.status === 'under_review' && (
                  <div className="space-y-3 pt-4 border-t">
                    <BilingualLabel arabicText="ملاحظات المهندس" englishText="Engineer Notes" />
                    <textarea
                      value={engineerNotes}
                      onChange={(e) => setEngineerNotes(e.target.value)}
                      placeholder="أضف ملاحظاتك هنا..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex gap-3">
                      <BilingualButton
                        arabicText="اعتماد التقرير"
                        englishText="Approve Report"
                        variant="success"
                        onClick={() => handleApprove(selectedDraft)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}

                {selectedDraft.status === 'approved' && selectedDraft.engineerNotes && (
                  <div>
                    <BilingualLabel arabicText="ملاحظات المهندس" englishText="Engineer Notes" size="sm" />
                    <p className="text-green-700 mt-1 text-sm bg-green-50 p-3 rounded-lg">
                      {selectedDraft.engineerNotes}
                    </p>
                  </div>
                )}

                {selectedDraft.status === 'approved' && (
                  <div className="pt-4 border-t">
                    <BilingualButton
                      arabicText="طباعة التقرير"
                      englishText="Print Report"
                      variant="primary"
                      onClick={() => {
                        setSelectedDraft(null);
                        setPrintDraft(selectedDraft);
                      }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {printDraft && (
        <PrintReport draft={printDraft} onClose={() => setPrintDraft(null)} />
      )}
    </div>
  );
}
