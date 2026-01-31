import React, { useState } from 'react';
import { Draft } from '../types';

interface EngineerDashboardProps {
  drafts: Draft[];
  onUpdateDraft: (id: number, updates: Partial<Draft>) => void;
  onDeleteDraft: (id: number) => void;
  engineerId: string;
  onLogout: () => void;
}

export function EngineerDashboard({ drafts, onUpdateDraft, onDeleteDraft, onLogout }: EngineerDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredDrafts = filter === 'all' 
    ? drafts 
    : drafts.filter(d => d.status === filter);

  const handleApprove = (id: number) => {
    onUpdateDraft(id, { status: 'approved' });
  };

  const handleReject = (id: number) => {
    onUpdateDraft(id, { status: 'rejected' });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'قيد المراجعة',
      approved: 'معتمد',
      rejected: 'مرفوض',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">لوحة المهندس</h1>
              <p className="text-slate-600 mt-1">Engineer Dashboard</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-slate-800">{drafts.length}</div>
            <div className="text-slate-600 text-sm">إجمالي الدرفت</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{drafts.filter(d => d.status === 'pending').length}</div>
            <div className="text-slate-600 text-sm">قيد المراجعة</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{drafts.filter(d => d.status === 'approved').length}</div>
            <div className="text-slate-600 text-sm">معتمد</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600">{drafts.filter(d => d.status === 'rejected').length}</div>
            <div className="text-slate-600 text-sm">مرفوض</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              قيد المراجعة
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              معتمد
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              مرفوض
            </button>
          </div>
        </div>

        {/* Drafts Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">رقم الدرفت</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">المشروع</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">العميل</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">نوع الاختبار</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">الموقع</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDrafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{draft.draft_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{draft.project_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{draft.client_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{draft.test_type}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{draft.sample_location}</td>
                    <td className="px-6 py-4">{getStatusBadge(draft.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {draft.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(draft.id)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              اعتماد
                            </button>
                            <button
                              onClick={() => handleReject(draft.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              رفض
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onDeleteDraft(draft.id)}
                          className="px-3 py-1 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDrafts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">لا توجد درفت</p>
              <p className="text-sm">No drafts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
