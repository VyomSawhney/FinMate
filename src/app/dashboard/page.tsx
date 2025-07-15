'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/molecules/StatCard';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { 
  Trophy, 
  Flame, 
  Target, 
  BookOpen, 
  LogOut,
  TrendingUp,
  Calendar,
  Star,
  Play,
  CheckCircle,
  Lock
} from 'lucide-react';
import { getLessonsByModule } from '@/data/lessons';
import { SupportChatbot } from '@/components/organisms/SupportChatbot';

export default function DashboardPage() {
  const { user, loading, logout, updateUserStreak } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    } else if (!loading && user && !(user.primaryGoal || (user.selectedGoals && user.selectedGoals.length > 0))) {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.lastLogin && user.uid) {
      // Add a small delay to ensure user data is fully loaded
      const timer = setTimeout(() => {
        updateUserStreak();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, updateUserStreak]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial journey...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.lastLogin || !user.uid || !Array.isArray(user.completedLessons)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial journey...</p>
        </div>
      </div>
    );
  }

  const lessons = getLessonsByModule(user.primaryGoal || (user.selectedGoals && user.selectedGoals[0]) || 'budgeting');
  const completedLessons = lessons.filter(lesson => 
    Array.isArray(user.completedLessons) && user.completedLessons.includes(lesson.id)
  );
  const progressPercentage = (completedLessons.length / lessons.length) * 100;
  const totalXP = lessons.reduce((sum, lesson) => sum + lesson.xpValue, 0);
  const earnedXP = completedLessons.reduce((sum, lesson) => sum + lesson.xpValue, 0);
  const nextLevelXP = (user.level * 1000) - user.xp;
  const xpToNextLevel = 1000 - (user.xp % 1000);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const getNextLesson = () => {
    return lessons.find(lesson => !Array.isArray(user.completedLessons) || !user.completedLessons.includes(lesson.id));
  };

  const nextLesson = getNextLesson();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">FinMate</h1>
              <span className="ml-2 text-sm text-gray-500">Your Daily Financial Gym</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-gray-900">Level {user.level}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/profile')}>
                <span className="mr-2">Profile</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.displayName || 'FinMate'}! 💪
          </h2>
          <p className="text-gray-600">
            Ready to crush your financial goals today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total XP"
            value={user.xp}
            icon={Star}
            trend="up"
            trendValue="+25 today"
          />
          <StatCard
            title="Current Streak"
            value={user.streak}
            icon={Flame}
            trend="up"
            trendValue="days"
          />
          <StatCard
            title="Lessons Completed"
            value={completedLessons.length}
            icon={BookOpen}
            trend="up"
            trendValue={`of ${lessons.length}`}
          />
          <StatCard
            title="Progress"
            value={`${Math.round(progressPercentage)}%`}
            icon={Target}
            trend="up"
            trendValue="complete"
          />
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Level Progress</h3>
            <span className="text-sm text-gray-500">
              {user.xp} / {user.level * 1000} XP
            </span>
          </div>
          <ProgressBar
            current={user.xp % 1000}
            max={1000}
            size="lg"
            className="mb-2"
          />
          <p className="text-sm text-gray-600">
            {xpToNextLevel} XP to reach Level {user.level + 1}
          </p>
        </Card>

        {/* Quick Start */}
        {nextLesson && (
          <Card className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Continue Your Journey
                </h3>
                <p className="text-gray-600 mb-4">
                  Ready for your next lesson: <strong>{nextLesson.title}</strong>
                </p>
                <Button onClick={() => handleStartLesson(nextLesson.id)}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Lesson
                </Button>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {nextLesson.xpValue} XP
                </div>
                <div className="text-sm text-gray-500">
                  Available
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Lessons Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {user.primaryGoal ? user.primaryGoal.charAt(0).toUpperCase() + user.primaryGoal.slice(1) : (user.selectedGoals && user.selectedGoals[0] ? user.selectedGoals[0].charAt(0).toUpperCase() + user.selectedGoals[0].slice(1) : 'Budgeting')} Path
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => {
              const isCompleted = Array.isArray(user.completedLessons) && user.completedLessons.includes(lesson.id);
              
              // Find the highest completed lesson index
              const completedIndices = lessons
                .map((l, idx) => Array.isArray(user.completedLessons) && user.completedLessons.includes(l.id) ? idx : -1)
                .filter(idx => idx !== -1);
              
              const highestCompletedIndex = completedIndices.length > 0 ? Math.max(...completedIndices) : -1;
              
              // Lesson is locked if it's more than 1 lesson ahead of the highest completed lesson
              // This allows users to access the next lesson after completing any lesson
              const isLocked = highestCompletedIndex !== -1 && index > highestCompletedIndex + 1;
              
              return (
                <Card
                  key={lesson.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isCompleted ? 'border-green-200 bg-green-50' : ''
                  } ${isLocked ? 'opacity-60' : ''}`}
                  onClick={() => !isLocked && handleStartLesson(lesson.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {lesson.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                        </span>
                        <span className="text-sm font-medium text-orange-600">
                          {lesson.xpValue} XP
                        </span>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="ml-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                    {isLocked && (
                      <div className="ml-4">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Lock className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Support Chatbot */}
      <SupportChatbot />
    </div>
  );
} 