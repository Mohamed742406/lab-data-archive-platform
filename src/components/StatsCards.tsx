import { DraftRecord } from '../types';
import { BilingualLabel } from './BilingualLabel';

interface StatsCardsProps {
  drafts: DraftRecord[];
}

export function StatsCards({ drafts }: StatsCardsProps) {
  const totalDrafts = drafts.length;
  const underReview = drafts.filter((d) => d.status === 'under_review').length;
  const approved = drafts.filter((d) => d.status === 'approved').length;
  const concreteTests = drafts.filter((d) => d.testType === 'concrete').length;
  const asphaltTests = drafts.filter((d) => d.testType === 'asphalt').length;
  const soilTests = drafts.filter((d) => d.testType === 'soil').length;

  const stats = [
    {
      arabic: 'إجمالي الدرفت',
      english: 'Total Drafts',
      value: totalDrafts,
      color: 'bg-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      arabic: 'قيد المراجعة',
      english: 'Under Review',
      value: underReview,
      color: 'bg-amber-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      arabic: 'تم الاعتماد',
      english: 'Approved',
      value: approved,
      color: 'bg-green-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      arabic: 'اختبارات الخرسانة',
      english: 'Concrete Tests',
      value: concreteTests,
      color: 'bg-gray-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      arabic: 'اختبارات الأسفلت',
      english: 'Asphalt Tests',
      value: asphaltTests,
      color: 'bg-stone-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      arabic: 'اختبارات التربة',
      english: 'Soil Tests',
      value: soilTests,
      color: 'bg-amber-700',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className={`${stat.color} text-white p-2 rounded-lg`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <BilingualLabel arabicText={stat.arabic} englishText={stat.english} size="sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
