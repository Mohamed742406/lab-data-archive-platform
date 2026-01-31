import { BilingualButton } from './BilingualButton';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="text-center md:text-right">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="bg-white/10 p-3 rounded-xl">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">منصة أرشفة الدرفت والتقارير المعملية</h1>
                <p className="text-blue-200 text-sm">Lab Draft & Reports Archive Platform</p>
              </div>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">{currentUser.name}</span>
              <span className={`text-sm px-2 py-0.5 rounded ${
                currentUser.role === 'engineer' 
                  ? 'bg-green-500/30 text-green-200' 
                  : 'bg-amber-500/30 text-amber-200'
              }`}>
                {currentUser.role === 'technician' ? 'فني / Technician' : 'مهندس / Engineer'}
              </span>
            </div>

            <BilingualButton
              arabicText="تسجيل الخروج"
              englishText="Logout"
              variant="danger"
              size="sm"
              onClick={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
