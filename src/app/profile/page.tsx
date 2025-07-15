'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { StatCard } from '@/components/molecules/StatCard';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Target, 
  Edit3, 
  Save, 
  X,
  Trophy,
  Star,
  Flame,
  BookOpen,
  CheckCircle,
  Settings,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { FinancialGoal } from '@/types';
import { getLessonsByModule } from '@/data/lessons';

const goalOptions = [
  {
    id: 'budgeting' as FinancialGoal,
    title: 'Budgeting Basics',
    description: 'Learn to track income and expenses, create budgets, and manage your money effectively.',
    icon: '💰',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'credit' as FinancialGoal,
    title: 'Credit & Debt',
    description: 'Understand credit scores, credit cards, loans, and how to manage debt responsibly.',
    icon: '💳',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'investing' as FinancialGoal,
    title: 'Investing Fundamentals',
    description: 'Learn about stocks, bonds, mutual funds, and building wealth through investing.',
    icon: '📈',
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'debt' as FinancialGoal,
    title: 'Debt Management',
    description: 'Strategies for paying off debt, understanding interest rates, and becoming debt-free.',
    icon: '🏦',
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'saving' as FinancialGoal,
    title: 'Smart Saving',
    description: 'Build emergency funds, save for goals, and develop healthy saving habits.',
    icon: '🎯',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

export default function ProfilePage() {
  const { user, loading, updateUserProfile, updateUserGoals, resetProgress } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<FinancialGoal[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<FinancialGoal | undefined>();
  const [saving, setSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setSelectedGoals(user.selectedGoals || []);
      setPrimaryGoal(user.primaryGoal);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ displayName });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGoals = async () => {
    setSaving(true);
    try {
      await updateUserGoals(selectedGoals, primaryGoal);
      setIsEditingGoals(false);
    } catch (error) {
      console.error('Error updating goals:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleGoalToggle = (goal: FinancialGoal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
      if (primaryGoal === goal) {
        setPrimaryGoal(selectedGoals.find(g => g !== goal));
      }
    } else {
      setSelectedGoals([...selectedGoals, goal]);
      if (!primaryGoal) {
        setPrimaryGoal(goal);
      }
    }
  };

  const handleSetPrimaryGoal = (goal: FinancialGoal) => {
    setPrimaryGoal(goal);
  };

  const handleResetProgress = async () => {
    setSaving(true);
    try {
      await resetProgress();
      setShowResetConfirm(false);
      // Reset local state
      setSelectedGoals(['budgeting']);
      setPrimaryGoal('budgeting');
    } catch (error) {
      console.error('Error resetting progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const getGoalProgress = (goal: FinancialGoal) => {
    const lessons = getLessonsByModule(goal);
    const completedLessons = lessons.filter(lesson => 
      user.completedLessons?.includes(lesson.id) || false
    );
    return {
      completed: completedLessons.length,
      total: lessons.length,
      percentage: (completedLessons.length / lessons.length) * 100
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <Button
                  variant={isEditing ? "outline" : "primary"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="text-gray-900">{user.displayName || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      loading={saving}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Stats Card */}
          <div>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Level</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.level}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Total XP</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.xp}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Streak</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user.streak} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-teal-500" />
                    <span className="text-sm text-gray-600">Lessons Completed</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {user.completedLessons?.length || 0}
                  </span>
                </div>
              </div>
              
              {/* Reset Progress Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Goals Management */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Goals</h2>
            <Button
              variant={isEditingGoals ? "outline" : "primary"}
              size="sm"
              onClick={() => setIsEditingGoals(!isEditingGoals)}
            >
              {isEditingGoals ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {isEditingGoals ? 'Cancel' : 'Edit Goals'}
            </Button>
          </div>

          {isEditingGoals ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goalOptions.map((goal) => {
                    const isSelected = selectedGoals.includes(goal.id);
                    const isPrimary = primaryGoal === goal.id;
                    
                    return (
                      <div
                        key={goal.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? `${goal.bgColor} ${goal.borderColor}` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleGoalToggle(goal.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{goal.icon}</span>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        
                        {isSelected && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="primaryGoal"
                              checked={isPrimary}
                              onChange={() => handleSetPrimaryGoal(goal.id)}
                              className="text-orange-500"
                            />
                            <span className="text-xs text-gray-600">Set as primary goal</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveGoals}
                  loading={saving}
                  disabled={saving || selectedGoals.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Goals
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Goal */}
              {primaryGoal && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Goal</h3>
                  {(() => {
                    const goal = goalOptions.find(g => g.id === primaryGoal);
                    const progress = getGoalProgress(primaryGoal);
                    
                    return (
                      <div className={`p-4 ${goal?.bgColor} ${goal?.borderColor} border-2 rounded-lg`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{goal?.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{goal?.title}</h4>
                              <p className="text-sm text-gray-600">{goal?.description}</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {progress.completed}/{progress.total} lessons
                          </span>
                        </div>
                        <ProgressBar
                          current={progress.completed}
                          max={progress.total}
                          size="sm"
                          className="mb-2"
                        />
                        <p className="text-sm text-gray-600">
                          {Math.round(progress.percentage)}% complete
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* All Goals Progress */}
              {selectedGoals.length > 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">All Goals Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGoals.map((goalId) => {
                      if (goalId === primaryGoal) return null;
                      
                      const goal = goalOptions.find(g => g.id === goalId);
                      const progress = getGoalProgress(goalId);
                      
                      return (
                        <div key={goalId} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{goal?.icon}</span>
                              <h4 className="font-semibold text-gray-900">{goal?.title}</h4>
                            </div>
                            <span className="text-sm text-gray-600">
                              {progress.completed}/{progress.total}
                            </span>
                          </div>
                          <ProgressBar
                            current={progress.completed}
                            max={progress.total}
                            size="sm"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedGoals.length === 0 && (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No goals selected. Click &ldquo;Edit Goals&rdquo; to get started!</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      
      {/* Reset Progress Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Reset Progress?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will reset your XP, level, streak, and completed lessons. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(false)}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleResetProgress}
                loading={saving}
                disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Reset Progress
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 