import { ReportStatus } from '../types';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    under_review: {
      arabic: 'قيد المراجعة',
      english: 'Under Review',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300',
    },
    approved: {
      arabic: 'تم الاعتماد',
      english: 'Approved',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center px-3 py-1.5 rounded-lg border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <span className="font-semibold text-sm">{config.arabic}</span>
      <span className="text-[10px] opacity-75">{config.english}</span>
    </div>
  );
}
