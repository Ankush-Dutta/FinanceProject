import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart3, 
  Calculator, 
  CreditCard, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Smartphone,
  Lock,
  Zap
} from 'lucide-react';
// Ensure you have this image in the specified path
import LandingPageBg from '../assets/LandingPageBg.jpg';


const LandingPage: React.FC = () => {
  // Data for the Features section
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Dashboard',
      description: 'Get a complete overview of your finances with interactive charts and real-time insights.',
      color: 'bg-emerald-400'
    },
    {
      icon: Calculator,
      title: 'Tax Calculator',
      description: 'Calculate your income tax accurately and plan your tax-saving investments effectively.',
      color: 'bg-indigo-400'
    },
    {
      icon: CreditCard,
      title: 'Loan Management',
      description: 'Track multiple loans, EMIs, and interest rates from different banks in one place.',
      color: 'bg-purple-400'
    },
    {
      icon: TrendingUp,
      title: 'Asset Tracking',
      description: 'Monitor your assets, liabilities, and net worth with detailed liquidity analysis.',
      color: 'bg-rose-400'
    },
    {
      icon: DollarSign,
      title: 'Currency Converter',
      description: 'Convert currencies with live exchange rates for international transactions.',
      color: 'bg-cyan-400'
    },
    {
      icon: Shield,
      title: 'Insurance Manager',
      description: 'Keep track of all your insurance policies, premiums, and renewal dates.',
      color: 'bg-teal-400'
    }
  ];

  // Data for the Benefits section
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

  // Framer Motion animation variants for staggered children effects
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Framer Motion animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Specific variants for the hero section to create a top-down reveal
  const heroItemVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Specific variants for the stats section for a pop-in effect
  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#0A192F] font-sans text-gray-100 overflow-x-hidden">
      
      {/* Header Section */}
      <header className="bg-[#0A192F] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Name with initial animation */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-8 w-8 bg-[#64FFDA] rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-gray-900" />
              </div>
              <span className="ml-2 text-xl font-bold">SpendMate</span>
            </motion.div>
            {/* Navigation links with initial animation */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/login"
                className="text-gray-400 hover:text-[#64FFDA] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#64FFDA] text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${LandingPageBg})` }}
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >

        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-100"
              variants={heroItemVariants}
            >
              Take Control of Your
              <motion.span 
                className="text-[#64FFDA] block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Financial Future
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              The complete finance management solution for individuals and families. 
              Track expenses, manage loans, calculate taxes, and grow your wealth - all in one place.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link
                  to="/register"
                  className="bg-[#64FFDA] text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
                >
                  Start Free Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <button className="border-2 border-[#64FFDA] text-[#64FFDA] px-8 py-4 rounded-lg font-semibold hover:bg-[#64FFDA] hover:text-gray-900 transition-colors">
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-sm text-gray-400 mt-4"
              variants={itemVariants}
            >
              No credit card required • Free forever • Setup in 2 minutes
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-[#112240]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Everything You Need to Manage Your Finances
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              From basic expense tracking to advanced financial planning, we've got you covered.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index} 
                  className="bg-[#1D324A] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className="h-6 w-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Why Choose SpendMate?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Built with modern technology and user experience in mind.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="w-16 h-16 bg-[#64FFDA] rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 * index }}
                    viewport={{ once: true }}
                  >
                    <Icon className="h-8 w-8 text-gray-900" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#112240]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="show"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.div variants={statVariants}>
              <div className="text-4xl font-bold text-[#64FFDA] mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </motion.div>
            <motion.div variants={statVariants}>
              <div className="text-4xl font-bold text-[#64FFDA] mb-2">₹50Cr+</div>
              <div className="text-gray-400">Money Managed</div>
            </motion.div>
            <motion.div variants={statVariants}>
              <div className="text-4xl font-bold text-[#64FFDA] mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </motion.div>
            <motion.div variants={statVariants}>
              <div className="text-4xl font-bold text-[#64FFDA] mb-2">4.9★</div>
              <div className="text-gray-400">User Rating</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#112240] to-[#0A192F]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-100 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Financial Life?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400 mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of users who have already taken control of their finances with SpendMate
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            whileInView="show"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.div variants={itemVariants}>
              <Link
                to="/register"
                className="bg-[#64FFDA] text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/login"
                className="border border-[#64FFDA] text-[#64FFDA] px-8 py-4 rounded-lg font-semibold hover:bg-[#64FFDA] hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A192F] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-4 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-[#64FFDA] rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-gray-900" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-100">SpendMate</span>
              </div>
              <p className="text-gray-400">
                The complete solution for managing your personal finances and achieving your financial goals.
              </p>
            </div>
            
            <div className="md:col-span-1">
              <h3 className="font-semibold text-gray-200 mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Dashboard</li>
                <li>Tax Calculator</li>
                <li>Loan Management</li>
                <li>Asset Tracking</li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h3 className="font-semibold text-gray-200 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h3 className="font-semibold text-gray-200 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Community</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 SpendMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
