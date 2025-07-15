# FinMate - Your Daily Financial Gym 💪

A gamified financial literacy app designed for Gen Z and young adults, built with Next.js, TypeScript, and Firebase.

## 🎯 Overview

FinMate transforms financial education into an engaging, Duolingo-style experience. Users learn budgeting, credit, investing, and more through interactive lessons, quizzes, and real-world scenarios while earning XP and maintaining streaks.

## ✨ Features

### Core Features
- **User Authentication** - Email/password and Google OAuth
- **Gamification System** - XP, levels, and daily streaks
- **Interactive Lessons** - Multiple choice quizzes, scenarios, and info lessons
- **Progress Tracking** - Visual progress bars and completion status
- **Goal Selection** - Choose your financial focus area
- **Support Chatbot** - AI-powered assistance for common questions

### Lesson Types
- **📚 Info Lessons** - Educational content with completion tracking
- **📝 Quiz Lessons** - Multiple choice questions with explanations
- **🎯 Scenario Lessons** - Real-world budgeting scenarios

### Gamification Elements
- **XP System** - Earn points for completing lessons
- **Level Progression** - Level up every 1000 XP
- **Daily Streaks** - Track consecutive days of learning
- **Progress Visualization** - See your journey at a glance

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Backend**: Firebase (Auth, Firestore)
- **Styling**: TailwindCSS with custom components
- **Icons**: Lucide React
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Update `src/lib/firebase.ts` with your config

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── lesson/[id]/       # Dynamic lesson pages
│   ├── onboarding/        # Goal selection
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── atoms/            # Basic components (Button, Card, etc.)
│   ├── molecules/        # Composite components (StatCard, LessonCard)
│   └── organisms/        # Complex components (MultipleChoiceQuestion, SupportChatbot)
├── contexts/             # React contexts (AuthContext)
├── data/                 # Static data (lessons)
├── lib/                  # Utilities and configurations
└── types/                # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Primary**: Orange (#f97316) - Energy and motivation
- **Secondary**: Teal (#14b8a6) - Trust and stability
- **Background**: Gradient from orange-50 to teal-50

### Components
- **Atomic Design** - Organized from atoms to organisms
- **Responsive** - Mobile-first design approach
- **Accessible** - WCAG compliant components

## 📚 Available Lessons

### Budgeting 101 Module
1. **What is a Budget?** - Introduction to budgeting concepts
2. **Income vs Expenses** - Understanding cash flow
3. **The 50/30/20 Rule** - Popular budgeting method
4. **Needs vs Wants** - Distinguishing essential vs discretionary spending
5. **Emergency Fund Basics** - Building financial safety nets
6. **Budget Scenario: College Student** - Real-world application
7. **Tracking Your Spending** - Methods for monitoring expenses
8. **Budget Quiz: Final Test** - Comprehensive assessment

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database in test mode
4. Copy your Firebase config to `src/lib/firebase.ts`

### Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Firebase configuration values in `.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**⚠️ Security Note:** Never commit your `.env.local` file to version control. It's already included in `.gitignore` to prevent accidental commits.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📈 Future Enhancements

### Phase 2 Features
- **GPT-powered Financial Coach** - Advanced AI assistance
- **Leaderboards** - Social competition
- **Push Notifications** - Reminder system
- **Certificates & Badges** - Achievement system
- **Additional Modules** - Credit, Investing, Debt Management

### Technical Improvements
- **PWA Support** - Offline functionality
- **React Native** - Mobile app development
- **Advanced Analytics** - User behavior tracking
- **A/B Testing** - Content optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Duolingo** - Inspiration for gamification design
- **Firebase** - Backend infrastructure
- **TailwindCSS** - Styling framework
- **Lucide** - Icon library

## 🔒 Security

### Environment Variables
- All sensitive configuration is stored in environment variables
- The `.env.local` file is automatically ignored by Git
- Never commit API keys or secrets to version control

### Firebase Security Rules
Make sure to configure proper Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📞 Support

For support, email support@finmate.app or use the in-app chatbot.

---

**Built with ❤️ for financial literacy**
