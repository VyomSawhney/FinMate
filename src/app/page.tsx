'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { 
  Trophy, 
  Flame, 
  Target, 
  BookOpen, 
  Star,
  TrendingUp,
  PiggyBank,
  CreditCard,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Users,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  const features = [
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Earn XP, level up, and maintain streaks while mastering financial skills.',
      color: 'text-orange-500'
    },
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Learn through quizzes, scenarios, and real-world applications.',
      color: 'text-teal-500'
    },
    {
      icon: Target,
      title: 'Personalized Goals',
      description: 'Choose your financial focus: budgeting, credit, investing, or debt management.',
      color: 'text-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Visual progress bars and statistics show your financial education journey.',
      color: 'text-green-500'
    },
    {
      icon: Flame,
      title: 'Daily Streaks',
      description: 'Build momentum with daily learning streaks and stay motivated.',
      color: 'text-red-500'
    },
    {
      icon: Star,
      title: 'Achievement System',
      description: 'Unlock badges and certificates as you master financial concepts.',
      color: 'text-yellow-500'
    }
  ];

  const stats = [
    { number: '8+', label: 'Interactive Lessons', icon: BookOpen },
    { number: '1000+', label: 'XP per Level', icon: Trophy },
    { number: '5', label: 'Financial Goals', icon: Target },
    { number: '∞', label: 'Learning Paths', icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: 'Alex, 22',
      role: 'College Student',
      content: 'FinMate made budgeting fun! I finally understand where my money goes.',
      avatar: '🎓'
    },
    {
      name: 'Sarah, 25',
      role: 'Young Professional',
      content: 'The gamification keeps me motivated. I\'ve learned more in a week than in years!',
      avatar: '💼'
    },
    {
      name: 'Mike, 19',
      role: 'High School Graduate',
      content: 'Perfect for beginners. The scenarios are so realistic and helpful.',
      avatar: '🎯'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FinMate</span>
            </div>
            <Button onClick={handleGetStarted} variant="primary">
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Your Daily Financial Gym
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Master Your Money with
                <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">
                  {' '}FinMate
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform financial literacy into an engaging game. Learn budgeting, credit, investing, and more through interactive lessons, earn XP, and build lasting money habits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleGetStarted} size="lg" className="px-8">
                  {user ? 'Go to Dashboard' : 'Start Your Journey'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-orange-500 mr-2" />
                      <span className="text-3xl font-bold text-gray-900">{stat.number}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FinMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've gamified financial education to make learning fun, engaging, and effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes and see results immediately
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up & Choose Your Goal</h3>
              <p className="text-gray-600">
                Create your account and select your financial focus area - budgeting, credit, investing, or debt management.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Interactive Lessons</h3>
              <p className="text-gray-600">
                Learn through quizzes, scenarios, and real-world applications. Earn XP for every completed lesson.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress & Level Up</h3>
              <p className="text-gray-600">
                Watch your progress grow, maintain daily streaks, and unlock achievements as you master financial skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of young adults mastering their finances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Master Your Money?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of young adults who are taking control of their financial future with FinMate.
          </p>
          <Button 
            onClick={handleGetStarted} 
            variant="secondary" 
            size="lg" 
            className="px-8 bg-white text-orange-600 hover:bg-gray-100"
          >
            {user ? 'Continue Learning' : 'Start Learning Today'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FinMate</span>
              </div>
              <p className="text-gray-400">
                Your daily financial gym for building wealth and financial literacy.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Interactive Lessons</li>
                <li>Gamification</li>
                <li>Progress Tracking</li>
                <li>Daily Streaks</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Topics</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Budgeting</li>
                <li>Credit & Debt</li>
                <li>Investing</li>
                <li>Financial Planning</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FinMate. All rights reserved. Built with ❤️ for financial literacy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
