import { cn } from '../utils/cn';

interface BilingualLabelProps {
  arabicText: string;
  englishText: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BilingualLabel({
  arabicText,
  englishText,
  className,
  size = 'md',
}: BilingualLabelProps) {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={cn('flex flex-col leading-tight', className)}>
      <span className={cn('font-semibold text-gray-800', sizes[size])}>
        {arabicText}
      </span>
      <span className={cn('text-gray-500', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
        {englishText}
      </span>
    </div>
  );
}
