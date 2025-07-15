'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { CheckCircle, XCircle, ArrowRight, BookOpen } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (isCorrect: boolean, xp: number) => void;
  onNext: () => void;
  xpValue: number;
  isLastQuestion: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  onNext,
  xpValue,
  isLastQuestion
}) => {
  // Safety check for undefined question
  if (!question) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">Question not available</p>
        </div>
      </Card>
    );
  }

  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | number | null>(null);
  const [userInput, setUserInput] = useState('');
  const [categorizedItems, setCategorizedItems] = useState<{ [category: string]: string[] }>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setUserInput('');
    setShowResult(false);
    setIsCorrect(false);
    setShowNext(false);
    
    // Initialize categorized items for drag-drop
    if (question.type === 'drag-drop' && question.categories) {
      const initial: { [category: string]: string[] } = {};
      question.categories.forEach(category => {
        initial[category] = [];
      });
      setCategorizedItems(initial);
    } else {
      setCategorizedItems({});
    }
  }, [question]);

  const handleSubmit = () => {
    let correct = false;

    try {
      switch (question.type) {
        case 'multiple-choice':
          correct = selectedAnswer === question.correctAnswer;
          break;
        case 'true-false':
          correct = selectedAnswer === question.correctAnswer;
          break;
        case 'fill-blank':
          correct = selectedAnswer === question.correctAnswer;
          break;
        case 'drag-drop':
          correct = question.items?.every(item => {
            const userCategory = Object.keys(categorizedItems).find(cat => 
              categorizedItems[cat].includes(item.text)
            );
            return userCategory === item.category;
          }) || false;
          break;
        case 'calculation':
          correct = Math.abs(Number(userInput) - (question.correctAnswer as number)) < 0.01;
          break;
        case 'open-ended':
          correct = question.possibleAnswers?.some(answer => 
            userInput.toLowerCase().includes(answer.toLowerCase())
          ) || false;
          break;
        default:
          console.error('Unknown question type:', question.type);
          correct = false;
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      correct = false;
    }

    setIsCorrect(correct);
    setShowResult(true);
    setShowNext(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect, isCorrect ? xpValue : 0);
    onNext();
  };

  const handleCategorizeItem = (itemText: string, category: string) => {
    const newCategorized = { ...categorizedItems };
    Object.keys(newCategorized).forEach(cat => {
      newCategorized[cat] = newCategorized[cat].filter(item => item !== itemText);
    });
    newCategorized[category].push(itemText);
    setCategorizedItems(newCategorized);
  };

  const handleRemoveFromCategory = (itemText: string) => {
    const newCategorized = { ...categorizedItems };
    Object.keys(newCategorized).forEach(cat => {
      newCategorized[cat] = newCategorized[cat].filter(item => item !== itemText);
    });
    setCategorizedItems(newCategorized);
  };

  const getUncategorizedItems = () => {
    const categorized = Object.values(categorizedItems).flat();
    return question.items?.filter(item => !categorized.includes(item.text)) || [];
  };

  const canSubmit = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
      case 'fill-blank':
        return selectedAnswer !== null;
      case 'calculation':
      case 'open-ended':
        return userInput.trim() !== '';
      case 'drag-drop':
        return getUncategorizedItems().length === 0;
      default:
        return false;
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  selectedAnswer === option
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            )) || (
              <div className="text-center text-gray-500">
                No options available
              </div>
            )}
          </div>
        );

      case 'true-false':
        return (
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedAnswer(true)}
              className={`flex-1 p-4 border rounded-lg transition-all ${
                selectedAnswer === true
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              True
            </button>
            <button
              onClick={() => setSelectedAnswer(false)}
              className={`flex-1 p-4 border rounded-lg transition-all ${
                selectedAnswer === false
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              False
            </button>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              {question.text.replace('_____', '________')}
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select the correct word:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-3 border rounded-lg transition-all text-center ${
                      selectedAnswer === option
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                )) || (
                  <div className="col-span-2 text-center text-gray-500">
                    No options available
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'drag-drop':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.categories?.map((category) => (
                <div key={category} className="p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[100px]">
                  <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {categorizedItems[category]?.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="p-2 bg-gray-100 rounded text-sm flex items-center justify-between"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() => handleRemoveFromCategory(item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✗
                        </button>
                      </div>
                    )) || []}
                  </div>
                </div>
              )) || (
                <div className="col-span-2 text-center text-gray-500">
                  No categories available
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Items to categorize:</h4>
              <div className="space-y-3">
                {getUncategorizedItems().map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm">
                      {item.text}
                    </span>
                    <div className="flex space-x-2">
                      {question.categories?.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategorizeItem(item.text, category)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          {category}
                        </button>
                      )) || []}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'calculation':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{question.text}</p>
            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        );

      case 'open-ended':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{question.text}</p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {question.text}
          </h3>
        </div>

        {renderQuestion()}

        {showResult && (
          <div className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {question.explanation && (
              <p className="mt-2 text-sm text-gray-600">
                {question.explanation}
              </p>
            )}
          </div>
        )}

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="w-full"
          >
            Submit Answer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {showNext && (
          <Button
            onClick={handleNext}
            className="w-full"
          >
            {isLastQuestion ? 'Continue to Dashboard' : 'Next Question'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  );
}; 
