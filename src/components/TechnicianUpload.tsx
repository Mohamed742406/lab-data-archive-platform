import React, { useState } from 'react';
import { Draft } from '../types';

interface TechnicianUploadProps {
  onAddDraft: (draft: Omit<Draft, 'id' | 'created_at'>) => void;
  technicianId: string;
  onLogout: () => void;
}

export function TechnicianUpload({ onAddDraft, technicianId, onLogout }: TechnicianUploadProps) {
  const [formData, setFormData] = useState({
    draft_number: '',
    project_name: '',
    client_name: '',
    test_type: '',
    sample_location: '',
    depth: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddDraft({
      ...formData,
      status: 'pending',
      technician_id: technicianId,
      engineer_id: null,
    });

    // Reset form
    setFormData({
      draft_number: '',
      project_name: '',
      client_name: '',
      test_type: '',
      sample_location: '',
      depth: '',
      notes: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">رفع درفت جديد</h1>
              <p className="text-slate-600 mt-1">Upload New Draft</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Draft Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رقم الدرفت / Draft Number
                </label>
                <input
                  type="text"
                  name="draft_number"
                  value={formData.draft_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: D-2024-001"
                />
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم المشروع / Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اسم المشروع"
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم العميل / Client Name
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اسم العميل"
                />
              </div>

              {/* Test Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  نوع الاختبار / Test Type
                </label>
                <input
                  type="text"
                  name="test_type"
                  value={formData.test_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: اختبار الكثافة"
                />
              </div>

              {/* Sample Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  موقع العينة / Sample Location
                </label>
                <input
                  type="text"
                  name="sample_location"
                  value={formData.sample_location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="موقع أخذ العينة"
                />
              </div>

              {/* Depth */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  العمق / Depth
                </label>
                <input
                  type="text"
                  name="depth"
                  value={formData.depth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: 2.5m"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ملاحظات / Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أي ملاحظات إضافية..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                رفع الدرفت / Upload Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
