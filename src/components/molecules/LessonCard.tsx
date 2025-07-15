import React from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isLocked: boolean;
  onStart: () => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isCompleted,
  isLocked,
  onStart,
  className,
}) => {
  const getTypeIcon = () => {
    switch (lesson.type) {
      case 'quiz':
        return '📝';
      case 'scenario':
        return '🎯';
      case 'info':
        return '📚';
      default:
        return '📖';
    }
  };

  const getTypeLabel = () => {
    switch (lesson.type) {
      case 'quiz':
        return 'Quiz';
      case 'scenario':
        return 'Scenario';
      case 'info':
        return 'Lesson';
      default:
        return 'Lesson';
    }
  };

  return (
    <Card
      className={cn(
        'relative transition-all duration-200 hover:shadow-md',
        isCompleted && 'border-green-200 bg-green-50',
        isLocked && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">{getTypeIcon()}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {getTypeLabel()}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {lesson.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">XP: {lesson.xpValue}</span>
              <span>Order: {lesson.order}</span>
            </div>
            
            {isCompleted && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="ml-4">
          {isLocked ? (
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
          ) : (
            <Button
              variant={isCompleted ? 'outline' : 'primary'}
              size="sm"
              onClick={onStart}
              disabled={isLocked}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Review
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}; 