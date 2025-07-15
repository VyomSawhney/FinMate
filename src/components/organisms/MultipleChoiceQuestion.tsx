'use client';

import React, { useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Question } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean, xpEarned: number) => void;
  xpValue: number;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswer,
  xpValue,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    setIsAnswered(true);
    
    // Award XP based on correctness
    const xpEarned = isCorrect ? xpValue : Math.floor(xpValue * 0.3);
    
    setTimeout(() => {
      onAnswer(isCorrect, xpEarned);
    }, 2000);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {question.text}
        </h2>
        
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === option
                  ? isAnswered
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {isAnswered && selectedAnswer === option && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {!isAnswered && selectedAnswer && (
        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
        >
          Submit Answer
        </Button>
      )}

      {isAnswered && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className={`font-semibold ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className={`text-sm ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {isCorrect 
                ? `Great job! You earned ${xpValue} XP.`
                : `The correct answer was: ${question.correctAnswer}. You earned ${Math.floor(xpValue * 0.3)} XP.`
              }
            </p>
          </div>

          {question.explanation && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 