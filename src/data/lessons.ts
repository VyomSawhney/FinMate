import { Lesson } from '@/types';

export const budgetingLessons: Lesson[] = [
  {
    id: 'budget-1',
    title: 'What is a Budget?',
    content: 'A budget is a plan for how to spend and save your money. It helps you control your finances, avoid debt, and reach financial goals. Budgeting includes tracking income, expenses, and planning ahead.',
    type: 'info',
    xpValue: 50,
    order: 1,
    module: 'budgeting',
    practicePrompt: 'Match terms: Budget → Spending Plan, Expense → Money Going Out, Goal → Future Financial Target'
  },
  {
    id: 'budget-2',
    title: 'Income vs. Expenses',
    content: 'Income = Money you earn (e.g., salary, gifts, freelance). Expenses = Money you spend (e.g., rent, food, Netflix).',
    type: 'quiz',
    xpValue: 75,
    order: 2,
    module: 'budgeting',
    questions: [
      {
        id: 'q1',
        text: 'Which of the following is an example of income?',
        type: 'multiple-choice',
        options: [
          'Grocery bill',
          'Side hustle payment',
          'Movie ticket',
          'Electricity bill'
        ],
        correctAnswer: 'Side hustle payment',
        explanation: 'Income is money you receive, while the other options are expenses (money you spend).'
      },
      {
        id: 'q2',
        text: 'Money earned from a job is called _____.',
        type: 'fill-blank',
        options: ['income', 'expense', 'budget', 'savings'],
        correctAnswer: 'income',
        explanation: 'Income refers to money you receive from various sources like employment, investments, or gifts.'
      },
      {
        id: 'q3',
        text: 'Sort the following items into Income and Expenses:',
        type: 'drag-drop',
        categories: ['Income', 'Expenses'],
        items: [
          { text: 'Scholarship', category: 'Income' },
          { text: 'Part-time job', category: 'Income' },
          { text: 'Rent', category: 'Expenses' },
          { text: 'Gas', category: 'Expenses' },
          { text: 'Coffee', category: 'Expenses' }
        ],
        explanation: 'Income includes money you receive, while expenses are money you spend.'
      }
    ]
  },
  {
    id: 'budget-3',
    title: 'The 50/30/20 Rule',
    content: '50% Needs (rent, food, utilities), 30% Wants (entertainment, dining out), 20% Savings (emergency fund, investing)',
    type: 'info',
    xpValue: 50,
    order: 3,
    module: 'budgeting',
    practicePrompt: 'Fill in the blanks: 50% of your budget should go to needs. 30% goes to wants, and 20% to savings.'
  },
  {
    id: 'budget-4',
    title: 'Needs vs Wants',
    content: 'Needs: essential to survive and live (food, rent, medicine). Wants: non-essential, enjoyable (games, dining out, new shoes).',
    type: 'quiz',
    xpValue: 100,
    order: 4,
    module: 'budgeting',
    questions: [
      {
        id: 'q4',
        text: 'Netflix subscription is a need.',
        type: 'true-false',
        correctAnswer: false,
        explanation: 'Entertainment subscriptions like Netflix are wants, not needs. They\'re enjoyable but not essential for survival.'
      },
      {
        id: 'q5',
        text: 'Which of the following is a want?',
        type: 'multiple-choice',
        options: [
          'Groceries',
          'Water bill',
          'Concert tickets',
          'Health insurance'
        ],
        correctAnswer: 'Concert tickets',
        explanation: 'Concert tickets are entertainment and therefore a want. The other options are essential needs.'
      },
      {
        id: 'q6',
        text: 'Classify the following items as Needs or Wants:',
        type: 'drag-drop',
        categories: ['Need', 'Want'],
        items: [
          { text: 'Rent', category: 'Need' },
          { text: 'Ice cream', category: 'Want' },
          { text: 'Medication', category: 'Need' },
          { text: 'Gym membership', category: 'Want' }
        ],
        explanation: 'Needs are essential for survival and basic living, while wants are things that enhance your life but aren\'t necessary.'
      }
    ]
  },
  {
    id: 'budget-5',
    title: 'Emergency Fund Basics',
    content: 'Emergency fund = money set aside for surprise expenses. Aim for 3–6 months of essential expenses. Helps avoid debt during emergencies.',
    type: 'info',
    xpValue: 75,
    order: 5,
    module: 'budgeting',
    practicePrompt: 'Complete the sentence: An emergency fund helps protect you from unexpected costs like job loss or car repairs.'
  },
  {
    id: 'budget-6',
    title: 'Budget Scenario – College Student',
    content: 'Help Alex create a monthly budget. Alex earns $800/month from a part-time job and spends $500 on rent, $150 on groceries, and $80 on fun.',
    type: 'scenario',
    xpValue: 150,
    order: 6,
    module: 'budgeting',
    scenario: {
      id: 'scenario-1',
      title: 'Alex\'s College Budget',
      description: 'Alex is a college student with a part-time job earning $800/month. They need to budget for rent, food, and other expenses.',
      budget: 800,
      goal: 'Create a balanced budget that covers all essential expenses while leaving room for savings.',
      expenses: [
        { id: 'rent', name: 'Rent', amount: 500, category: 'Housing', isOptional: false },
        { id: 'groceries', name: 'Groceries', amount: 150, category: 'Food', isOptional: false },
        { id: 'fun', name: 'Fun/Entertainment', amount: 80, category: 'Entertainment', isOptional: true },
        { id: 'savings', name: 'Savings', amount: 70, category: 'Savings', isOptional: true }
      ],
      questions: [
        {
          id: 'scenario-q1',
          text: 'How much is left for savings?',
          type: 'calculation',
          correctAnswer: 70,
          explanation: '$800 - $500 - $150 - $80 = $70'
        },
        {
          id: 'scenario-q2',
          text: 'What percentage is Alex saving?',
          type: 'calculation',
          correctAnswer: 8.75,
          explanation: '($70 / $800) × 100 = 8.75%'
        },
        {
          id: 'scenario-q3',
          text: 'Suggest one way Alex can increase savings.',
          type: 'open-ended',
          possibleAnswers: ['Reduce fun spending', 'Look for cheaper rent', 'Add freelance work', 'Find roommates'],
          explanation: 'There are many ways to increase savings, including reducing expenses or increasing income.'
        }
      ]
    }
  },
  {
    id: 'budget-7',
    title: 'Tracking Your Spending',
    content: 'Use apps, spreadsheets, or a notebook to track. Categorize spending: food, transport, bills, etc. Helps spot patterns and areas to cut costs.',
    type: 'info',
    xpValue: 50,
    order: 7,
    module: 'budgeting',
    practicePrompt: 'Complete the sentence: Tracking your spending helps you stay accountable and spot wasteful habits.'
  },
  {
    id: 'budget-8',
    title: 'Budget Quiz – Final Test',
    content: 'Test your budgeting knowledge with this comprehensive quiz covering all the concepts you\'ve learned.',
    type: 'quiz',
    xpValue: 200,
    order: 8,
    module: 'budgeting',
    questions: [
      {
        id: 'q7',
        text: 'The 50/30/20 rule helps you:',
        type: 'multiple-choice',
        options: [
          'Get rich quick',
          'Create a balanced budget',
          'Pay more taxes',
          'Track stock prices'
        ],
        correctAnswer: 'Create a balanced budget',
        explanation: 'The 50/30/20 rule is a simple framework for creating a balanced budget that covers needs, wants, and savings.'
      },
      {
        id: 'q8',
        text: 'An emergency fund is for planned expenses.',
        type: 'true-false',
        correctAnswer: false,
        explanation: 'An emergency fund is specifically for unexpected, unplanned expenses like medical emergencies or job loss.'
      },
      {
        id: 'q9',
        text: 'You earn $2,000/month. Using 50/30/20, how much should go to savings?',
        type: 'calculation',
        correctAnswer: 400,
        explanation: '20% of $2,000 = $400'
      },
      {
        id: 'q10',
        text: 'Classify these budget items:',
        type: 'drag-drop',
        categories: ['Needs', 'Wants', 'Savings'],
        items: [
          { text: 'Health insurance', category: 'Needs' },
          { text: 'Vacation', category: 'Wants' },
          { text: 'Roth IRA', category: 'Savings' }
        ],
        explanation: 'Health insurance is essential (need), vacation is discretionary (want), and Roth IRA is for future financial security (savings).'
      }
    ]
  }
];

export const getLessonsByModule = (module: string): Lesson[] => {
  switch (module) {
    case 'budgeting':
      return budgetingLessons;
    default:
      return [];
  }
};

export const getLessonById = (id: string): Lesson | undefined => {
  return budgetingLessons.find(lesson => lesson.id === id);
}; 