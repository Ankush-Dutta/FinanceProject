import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Calculator, 
  CreditCard, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  Smartphone,
  Lock,
  Zap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Dashboard',
      description: 'Get a complete overview of your finances with interactive charts and real-time insights.',
      color: 'bg-blue-500'
    },
    {
      icon: Calculator,
      title: 'Tax Calculator',
      description: 'Calculate your income tax accurately and plan your tax-saving investments effectively.',
      color: 'bg-green-500'
    },
    {
      icon: CreditCard,
      title: 'Loan Management',
      description: 'Track multiple loans, EMIs, and interest rates from different banks in one place.',
      color: 'bg-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Asset Tracking',
      description: 'Monitor your assets, liabilities, and net worth with detailed liquidity analysis.',
      color: 'bg-orange-500'
    },
    {
      icon: DollarSign,
      title: 'Currency Converter',
      description: 'Convert currencies with live exchange rates for international transactions.',
      color: 'bg-teal-500'
    },
    {
      icon: Shield,
      title: 'Insurance Manager',
      description: 'Keep track of all your insurance policies, premiums, and renewal dates.',
      color: 'bg-red-500'
    }
  ];

  const benefits = [
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Access your finances anywhere, anytime with our mobile-optimized interface.'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely with bank-level security.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant updates and notifications about your financial activities.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      content: 'FinanceTracker has completely transformed how I manage my money. The tax calculator alone saved me thousands!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      content: 'Managing multiple loans was a nightmare until I found this app. Now everything is organized and clear.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Financial Advisor',
      content: 'I recommend FinanceTracker to all my clients. It\'s the most comprehensive finance app I\'ve seen.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">FinanceTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Take Control of Your
              <span className="text-blue-600 block">Financial Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The complete finance management solution for individuals and families. 
              Track expenses, manage loans, calculate taxes, and grow your wealth - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                Start Free Today
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free forever • Setup in 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Finances
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From basic expense tracking to advanced financial planning, we've got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FinanceTracker?
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern technology and user experience in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">₹50Cr+</div>
              <div className="text-blue-100">Money Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-blue-100">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">FinanceTracker</span>
              </div>
              <p className="text-gray-400">
                The complete solution for managing your personal finances and achieving your financial goals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Dashboard</li>
                <li>Tax Calculator</li>
                <li>Loan Management</li>
                <li>Asset Tracking</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Community</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FinanceTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;