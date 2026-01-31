import { useState } from 'react';
import { BilingualLabel } from './BilingualLabel';
import { BilingualButton } from './BilingualButton';
import { StatusBadge } from './StatusBadge';
import { DraftRecord, TestType, UserRole } from '../types';

interface ArchiveSectionProps {
  drafts: DraftRecord[];
  onDelete: (id: string) => void;
  userRole: UserRole;
  onPrint: (draft: DraftRecord) => void;
}

export function ArchiveSection({ drafts, onDelete, userRole, onPrint }: ArchiveSectionProps) {
  const [selectedDraft, setSelectedDraft] = useState<DraftRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TestType | 'all'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Only show approved drafts in archive
  const archivedDrafts = drafts.filter((d) => d.status === 'approved');

  const filteredDrafts = archivedDrafts.filter((draft) => {
    const searchMatch = draft.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.uploadedBy.includes(searchTerm) ||
      draft.notes?.includes(searchTerm);
    const typeMatch = filterType === 'all' || draft.testType === filterType;
    return searchMatch && typeMatch;
  });

  const confirmDelete = (id: string) => {
    // Only engineers can delete
    if (userRole !== 'engineer') return;
    onDelete(id);
    setDeleteConfirmId(null);
    setSelectedDraft(null);
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-600 text-white p-3 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">أرشيف التقارير المعتمدة</h2>
            <p className="text-gray-500 text-sm">Approved Reports Archive</p>
          </div>
          <div className="mr-auto bg-green-600 text-white px-4 py-2 rounded-lg">
            <span className="font-bold text-lg">{archivedDrafts.length}</span>
            <span className="text-sm mr-2">تقرير معتمد</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في الأرشيف برقم العينة أو اسم الفني..."
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TestType | 'all')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
            >
              <option value="all">جميع الأنواع / All Types</option>
              <option value="concrete">خرسانة / Concrete</option>
              <option value="asphalt">أسفلت / Asphalt</option>
              <option value="soil">تربة / Soil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="p-6">
        {filteredDrafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div 
                  className="relative h-40 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedDraft(draft)}
                >
                  <img
                    src={draft.imageUrl}
                    alt={draft.imageName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={draft.status} />
                  </div>
                  <div className="absolute top-2 left-2">
                    {getTestTypeBadge(draft.testType)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-blue-600 text-lg">
                      {draft.sampleId}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{draft.uploadedBy}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(draft.uploadedAt)}
                  </div>
                  {draft.engineerNotes && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs text-green-700 line-clamp-2">
                      {draft.engineerNotes}
                    </div>
                  )}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <BilingualButton
                      arabicText="عرض"
                      englishText="View"
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedDraft(draft)}
                      className="flex-1"
                    />
                    <BilingualButton
                      arabicText="طباعة"
                      englishText="Print"
                      variant="success"
                      size="sm"
                      onClick={() => onPrint(draft)}
                    />
                    {/* Only engineers can delete */}
                    {userRole === 'engineer' && (
                      deleteConfirmId === draft.id ? (
                        <>
                          <BilingualButton
                            arabicText="تأكيد"
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
                        </>
                      ) : (
                        <BilingualButton
                          arabicText="مسح"
                          englishText="Delete"
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteConfirmId(draft.id)}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p className="text-lg font-medium">لا توجد تقارير في الأرشيف</p>
            <p className="text-sm">No reports in archive</p>
          </div>
        )}
      </div>

      {/* Modal for Archive Details */}
      {selectedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 text-white p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">تفاصيل التقرير المعتمد</h3>
                    <p className="text-gray-500 text-sm">Approved Report Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDraft(null)}
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
                
                {/* Excel File Download */}
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
                    <p className="font-mono font-bold text-blue-600 mt-1 text-lg">
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
                    <BilingualLabel arabicText="تاريخ الرفع" englishText="Upload Date" size="sm" />
                    <p className="text-gray-700 mt-1 text-sm">{formatDate(selectedDraft.uploadedAt)}</p>
                  </div>
                </div>

                <div>
                  <BilingualLabel arabicText="الحالة" englishText="Status" size="sm" />
                  <div className="mt-2">
                    <StatusBadge status={selectedDraft.status} />
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

                {selectedDraft.engineerNotes && (
                  <div>
                    <BilingualLabel arabicText="ملاحظات المهندس" englishText="Engineer Notes" size="sm" />
                    <p className="text-green-700 mt-1 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      <svg className="w-4 h-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedDraft.engineerNotes}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t flex gap-3">
                  <BilingualButton
                    arabicText="طباعة التقرير"
                    englishText="Print Report"
                    variant="primary"
                    onClick={() => {
                      setSelectedDraft(null);
                      onPrint(selectedDraft);
                    }}
                    className="flex-1"
                  />
                  <BilingualButton
                    arabicText="إغلاق"
                    englishText="Close"
                    variant="secondary"
                    onClick={() => setSelectedDraft(null)}
                  />
                  {/* Only engineers can delete */}
                  {userRole === 'engineer' && (
                    <BilingualButton
                      arabicText="مسح"
                      englishText="Delete"
                      variant="danger"
                      onClick={() => {
                        confirmDelete(selectedDraft.id);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
