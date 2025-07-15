import React from 'react';
import { Card } from '@/components/atoms/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <Card className={cn('text-center', className)}>
      <div className="flex items-center justify-center mb-2">
        {Icon && <Icon className="w-5 h-5 text-orange-500 mr-2" />}
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      {trend && trendValue && (
        <div className={cn('text-xs font-medium flex items-center justify-center', trendColors[trend])}>
          <span className="mr-1">{trendIcons[trend]}</span>
          {trendValue}
        </div>
      )}
    </Card>
  );
}; 