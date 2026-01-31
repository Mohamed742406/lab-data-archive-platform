import { BilingualLabel } from './BilingualLabel';
import { BilingualButton } from './BilingualButton';
import { TestType, ReportStatus } from '../types';

interface AdvancedSearchProps {
  searchSampleId: string;
  setSearchSampleId: (value: string) => void;
  searchDate: string;
  setSearchDate: (value: string) => void;
  filterType: TestType | 'all';
  setFilterType: (value: TestType | 'all') => void;
  filterStatus: ReportStatus | 'all';
  setFilterStatus: (value: ReportStatus | 'all') => void;
  onClearFilters: () => void;
  searchNotes?: string;
  setSearchNotes?: (value: string) => void;
  searchTechnician?: string;
  setSearchTechnician?: (value: string) => void;
}

export function AdvancedSearch({
  searchSampleId,
  setSearchSampleId,
  searchDate,
  setSearchDate,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  onClearFilters,
  searchNotes,
  setSearchNotes,
  searchTechnician,
  setSearchTechnician,
}: AdvancedSearchProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-800">البحث المتقدم</h3>
          <p className="text-xs text-gray-500">Advanced Search</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search by Sample ID */}
        <div className="space-y-2">
          <BilingualLabel arabicText="رقم العينة" englishText="Sample Number" size="sm" />
          <div className="relative">
            <input
              type="text"
              value={searchSampleId}
              onChange={(e) => setSearchSampleId(e.target.value)}
              placeholder="ابحث برقم العينة..."
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Search by Date */}
        <div className="space-y-2">
          <BilingualLabel arabicText="التاريخ" englishText="Date" size="sm" />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          />
        </div>

        {/* Filter by Test Type */}
        <div className="space-y-2">
          <BilingualLabel arabicText="نوع الاختبار" englishText="Test Type" size="sm" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TestType | 'all')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="all">الكل / All</option>
            <option value="concrete">خرسانة / Concrete</option>
            <option value="asphalt">أسفلت / Asphalt</option>
            <option value="soil">تربة / Soil</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div className="space-y-2">
          <BilingualLabel arabicText="الحالة" englishText="Status" size="sm" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReportStatus | 'all')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="all">الكل / All</option>
            <option value="under_review">قيد المراجعة / Under Review</option>
            <option value="approved">تم الاعتماد / Approved</option>
          </select>
        </div>

        {/* Search by Technician Name */}
        {setSearchTechnician && (
          <div className="space-y-2">
            <BilingualLabel arabicText="اسم الفني" englishText="Technician Name" size="sm" />
            <input
              type="text"
              value={searchTechnician || ''}
              onChange={(e) => setSearchTechnician(e.target.value)}
              placeholder="ابحث باسم الفني..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        )}

        {/* Search by Notes */}
        {setSearchNotes && (
          <div className="space-y-2">
            <BilingualLabel arabicText="الملاحظات" englishText="Notes" size="sm" />
            <input
              type="text"
              value={searchNotes || ''}
              onChange={(e) => setSearchNotes(e.target.value)}
              placeholder="ابحث في الملاحظات..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-end">
        <BilingualButton
          arabicText="مسح الفلاتر"
          englishText="Clear Filters"
          variant="secondary"
          onClick={onClearFilters}
        />
      </div>
    </div>
  );
}
