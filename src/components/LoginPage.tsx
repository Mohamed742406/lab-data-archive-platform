import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (role: 'technician' | 'engineer', id: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<'technician' | 'engineer'>('technician');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      onLogin(role, userId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">منصة أرشفة الدرفت</h1>
          <p className="text-slate-600 mt-2">Lab Draft Archive Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              الدور / Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('technician')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === 'technician'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span>فني</span>
                  <span className="text-xs opacity-80">Technician</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('engineer')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  role === 'engineer'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span>مهندس</span>
                  <span className="text-xs opacity-80">Engineer</span>
                </div>
              </button>
            </div>
          </div>

          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              رقم الموظف / Employee ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="أدخل رقم الموظف"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            تسجيل الدخول / Login
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>منصة إدارة وأرشفة الدرفت المعملية</p>
          <p>Laboratory Draft Management & Archive Platform</p>
        </div>
      </div>
    </div>
  );
}
