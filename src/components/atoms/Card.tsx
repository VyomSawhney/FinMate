import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-transparent border-2 border-gray-300',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 