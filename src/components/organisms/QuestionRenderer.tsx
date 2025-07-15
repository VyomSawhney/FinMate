'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../atoms/ProgressBar';
import { Question } from '../../types';

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

  // Early return for unsupported question types
  if (!question || !['multiple-choice', 'true-false', 'fill-blank', 'drag-drop', 'calculation', 'open-ended'].includes(question.type)) {
    return (
      <Card>
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unsupported Question Type</h3>
          <p className="text-gray-600">This question type is not yet supported.</p>
        </div>
      </Card>
    );
  }

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Uncategorized items */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Items to categorize:</h4>
                <div className="space-y-2">
                  {getUncategorizedItems().map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handleCategorizeItem(item.text, Object.keys(categorizedItems)[0])}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Categories:</h4>
                <div className="space-y-4">
                  {Object.keys(categorizedItems).map((category) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-3">
                      <h5 className="font-medium text-gray-600 mb-2">{category}</h5>
                      <div className="space-y-2">
                        {categorizedItems[category].map((item, index) => (
                          <div
                            key={index}
                            className="p-2 bg-blue-50 border border-blue-200 rounded flex justify-between items-center"
                          >
                            <span>{item}</span>
                            <button
                              onClick={() => handleRemoveFromCategory(item)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'calculation':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{question.text}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your answer:
              </label>
              <input
                type="number"
                step="0.01"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your calculation result"
              />
            </div>
          </div>
        );

      case 'open-ended':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{question.text}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your answer:
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={4}
                placeholder="Type your answer here..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            Question type not supported
          </div>
        );
    }
  };

  return (
    <Card>
      <div className="p-6">
        {/* Question Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {question.text}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>XP: {xpValue}</span>
            <span>Question {question.id}</span>
          </div>
        </div>

        {/* Question Content */}
        <div className="mb-6">
          {renderQuestion()}
        </div>

        {/* Result Display */}
        {showResult && (
          <div className={`mb-6 p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <span className="text-white text-sm font-bold">
                  {isCorrect ? '✓' : '✗'}
                </span>
              </div>
              <div>
                <p className={`font-medium ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {question.explanation && (
                  <p className="text-sm text-gray-600 mt-1">
                    {question.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className="flex-1"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {isLastQuestion ? 'Finish Lesson' : 'Next Question'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}; 
