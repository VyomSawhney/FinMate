'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { QuestionRenderer } from '@/components/organisms/QuestionRenderer';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { 
  ArrowLeft, 
  CheckCircle, 
  Trophy, 
  Star,
  BookOpen,
  Target,
  Play
} from 'lucide-react';
import { getLessonById } from '@/data/lessons';
import { Lesson } from '@/types';

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState<'lesson' | 'questions' | 'completion'>('lesson');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [xpEarned, setXpEarned] = useState(0);
  
  const { user, updateUserXP, markLessonCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const lessonData = getLessonById(resolvedParams.id);
    if (!lessonData) {
      router.push('/dashboard');
      return;
    }

    setLesson(lessonData);
  }, [resolvedParams.id, user, router]);

  const handleStartQuestions = () => {
    setCurrentStep('questions');
  };

  const handleAnswer = async (isCorrect: boolean, xp: number) => {
    if (!lesson) return;
    setXpEarned(prev => prev + xp);
  };

  const handleNextQuestion = () => {
    if (!lesson) return;

    const totalQuestions = lesson.type === 'quiz' 
      ? (lesson.questions?.length || 0)
      : lesson.type === 'scenario' && lesson.scenario?.questions
      ? lesson.scenario.questions.length
      : 0;

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions completed
      completeLesson();
    }
  };

  const completeLesson = async () => {
    if (!lesson || !user) return;

    try {
      await updateUserXP(xpEarned);
      await markLessonCompleted(lesson.id);
      setCurrentStep('completion');
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = lesson.type === 'quiz' 
    ? lesson.questions?.[currentQuestionIndex]
    : lesson.scenario?.questions?.[currentQuestionIndex];

  const totalQuestions = lesson.type === 'quiz' 
    ? (lesson.questions?.length || 0)
    : lesson.type === 'scenario' && lesson.scenario?.questions
    ? lesson.scenario.questions.length
    : 0;

  const progressPercentage = currentStep === 'lesson' 
    ? 0 
    : currentStep === 'questions'
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100
    : 100;

  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">{lesson.xpValue} XP</span>
              </div>
              {currentStep === 'questions' && totalQuestions > 0 && (
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-teal-500" />
                  <span className="text-sm text-gray-600">
                    {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <ProgressBar
            current={progressPercentage}
            max={100}
            size="md"
          />
        </div>

        {/* Lesson Content */}
        {currentStep === 'lesson' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-teal-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {lesson.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {lesson.content}
                  </p>
                  {lesson.practicePrompt && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-orange-900 mb-2">Practice Prompt:</h4>
                      <p className="text-orange-800">{lesson.practicePrompt}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Scenario Content */}
            {lesson.type === 'scenario' && lesson.scenario && (
              <Card>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {lesson.scenario.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {lesson.scenario.description}
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Budget: ${lesson.scenario.budget}</h4>
                    <p className="text-sm text-gray-600">{lesson.scenario.goal}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Expenses:</h4>
                    {lesson.scenario.expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{expense.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({expense.category})</span>
                          {expense.isOptional && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">
                              Optional
                            </span>
                          )}
                        </div>
                        <span className="font-semibold">${expense.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Start Questions Button */}
            {totalQuestions > 0 && (
              <Card>
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Play className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Ready for the Quiz?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Test your knowledge with {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}.
                    </p>
                  </div>
                  <Button onClick={handleStartQuestions} size="lg">
                    Start Quiz
                    <Play className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {/* No Questions - Complete Directly */}
            {totalQuestions === 0 && (
              <Card>
                <div className="text-center py-8">
                  <div className="mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Lesson Complete!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You&apos;ve learned about {lesson.title.toLowerCase()}. Great job!
                    </p>
                  </div>
                  <Button onClick={completeLesson} size="lg">
                    Complete Lesson
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Questions */}
        {currentStep === 'questions' && currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            xpValue={lesson.xpValue / totalQuestions}
            isLastQuestion={isLastQuestion}
          />
        )}

        {/* Completion Screen */}
        {currentStep === 'completion' && (
          <Card className="text-center py-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Lesson Complete! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Congratulations! You&apos;ve earned {xpEarned} XP for completing this lesson.
              </p>
              
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">{xpEarned} XP Earned</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium">Great Job!</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handleContinue} size="lg">
              Continue to Dashboard
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
} 