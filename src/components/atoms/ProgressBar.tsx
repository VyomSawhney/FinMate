import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{current}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}; 