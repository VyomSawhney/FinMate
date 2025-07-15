'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useRouter } from 'next/navigation';
import { FinancialGoal } from '@/types';
import { 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Target,
  CheckCircle 
} from 'lucide-react';

const goals = [
  {
    id: 'budgeting' as FinancialGoal,
    title: 'Budgeting Basics',
    description: 'Learn to track income and expenses, create budgets, and manage your money effectively.',
    icon: PiggyBank,
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'credit' as FinancialGoal,
    title: 'Credit & Debt',
    description: 'Understand credit scores, credit cards, loans, and how to manage debt responsibly.',
    icon: CreditCard,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'investing' as FinancialGoal,
    title: 'Investing Fundamentals',
    description: 'Learn about stocks, bonds, mutual funds, and building wealth through investing.',
    icon: TrendingUp,
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'debt' as FinancialGoal,
    title: 'Debt Management',
    description: 'Strategies for paying off debt, understanding interest rates, and becoming debt-free.',
    icon: DollarSign,
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'saving' as FinancialGoal,
    title: 'Smart Saving',
    description: 'Build emergency funds, save for goals, and develop healthy saving habits.',
    icon: Target,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

export default function OnboardingPage() {
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { updateUserGoal, firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/auth');
    }
  }, [firebaseUser, authLoading, router]);

  const handleGoalSelect = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
  };

  const handleContinue = async () => {
    if (!selectedGoal || loading) return;
    
    setLoading(true);
    try {
      await updateUserGoal(selectedGoal);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating goal:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            What&apos;s your financial goal?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the area you&apos;d like to focus on first. Don&apos;t worry, you can always change this later!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            
            return (
              <Card
                key={goal.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? `${goal.bgColor} ${goal.borderColor} border-2` 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleGoalSelect(goal.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${goal.color} text-white mr-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {goal.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {goal.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedGoal}
            loading={loading}
            size="lg"
            className="px-8"
          >
            Continue to Dashboard
          </Button>
          
          {!selectedGoal && (
            <p className="text-sm text-gray-500 mt-2">
              Please select a goal to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 