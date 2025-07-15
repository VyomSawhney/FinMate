export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  lastLogin: Date;
  selectedGoals: FinancialGoal[];
  primaryGoal?: FinancialGoal;
  completedLessons?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for raw Firestore data (with timestamps)
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  lastLogin: any; // Firestore timestamp
  selectedGoal?: FinancialGoal;
  completedLessons?: string[];
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

export type FinancialGoal = 
  | 'budgeting'
  | 'credit'
  | 'investing'
  | 'debt'
  | 'saving';

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'quiz' | 'scenario' | 'info';
  xpValue: number;
  order: number;
  module: string;
  questions?: Question[];
  scenario?: Scenario;
  practicePrompt?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop' | 'calculation' | 'open-ended';
  options?: string[];
  correctAnswer?: string | boolean | number;
  explanation?: string;
  categories?: string[];
  items?: DragDropItem[];
  possibleAnswers?: string[];
}

export interface DragDropItem {
  text: string;
  category: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  budget: number;
  expenses: Expense[];
  goal: string;
  questions?: Question[];
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  isOptional: boolean;
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt: Date;
  xpEarned: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  totalXP: number;
  order: number;
} 