import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  BarChart3,
  Bolt,
  LineChart,
  Wallet,
  ShieldCheck,
  Smartphone,
  Search,
  ChevronRight,
  Calendar,
  Bell,
  TrendingUp,
  Star,
  Users,
  Zap,
  Target,
  PieChart,
  CreditCard,
  ArrowUpRight,
  CheckCircle,
  Play,
} from "lucide-react";

type GlassProps = {
  children: React.ReactNode;
  className?: string;
};

const Glass = ({ children, className = "" }: GlassProps) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
);

const Dot = () => (
  <span className="mx-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-emerald-400/80" />
);

const rotatingWords = [
  "categorizes itself",
  "spots wasteful fees", 
  "projects your cashflow",
  "nudges before you overspend",
  "summarizes your month in 30s",
];

const FloatingCard = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      
      {/* Animated orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
      />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  );
};

const LandingPage = () => {
  const [spend, setSpend] = useState(48320);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const id = setInterval(() => {
      setSpend(48320 + Math.floor(Math.random() * 300));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % rotatingWords.length),
      2200
    );
    return () => clearInterval(id);
  }, []);

  const spendDisplay = useMemo(() => spend.toLocaleString("en-IN"), [spend]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 selection:bg-emerald-400/30 selection:text-emerald-200 relative overflow-hidden">
      <AnimatedBackground />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-gray-900 shadow-lg"
              >
                <BarChart3 className="h-5 w-5" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SpendMate
              </span>
            </Link>
            <div className="hidden items-center gap-8 md:flex text-sm text-gray-300">
              <a href="#product" className="hover:text-white transition-colors relative group">
                Product
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" />
              </a>
              <a href="#how" className="hover:text-white transition-colors relative group">
                How it works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" />
              </a>
              <a href="#security" className="hover:text-white transition-colors relative group">
                Security
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" />
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-2.5 text-sm font-semibold text-gray-900 hover:from-emerald-300 hover:to-teal-400 transition-all shadow-lg hover:shadow-emerald-500/25"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 py-20 md:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 shadow-lg"
              >
                <Brain className="h-4 w-4" /> 
                <span>Private, on-device AI insights</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
              >
                A money app that{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
                  thinks
                </span>
              </motion.h1>
              
              <div className="relative mt-4 h-10 overflow-hidden text-xl text-gray-300 sm:text-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute font-medium"
                  >
                    It {rotatingWords[idx]}.
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 max-w-xl text-lg text-gray-300 leading-relaxed"
              >
                Connect accounts, and SpendMate builds a living model of your
                cashflow to keep you one step ahead—no spreadsheets, no nags.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-4 text-lg font-semibold text-gray-900 hover:from-emerald-300 hover:to-teal-400 transition-all shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105"
                >
                  Start for free
                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <div className="relative">
                    <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-white/30"
                    />
                  </div>
                  Watch demo
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 flex items-center gap-6 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Bank-level security</span>
                </div>
              </motion.div>
            </div>

            {/* Enhanced KPI card section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:pl-6 relative"
            >
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl"
              />
              
              <Glass className="p-6 relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-20 h-20 border border-emerald-400/20 rounded-full"
                />
                
                <div className="flex items-center justify-between text-sm text-gray-300 mb-6">
                  <div className="inline-flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Wallet className="h-4 w-4 text-emerald-400" />
                    </motion.div>
                    Today's Overview
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 
                    Smart insights
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <FloatingCard delay={0.1}>
                    <Glass className="p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="text-xs text-gray-400 mb-1">Total Spending</div>
                      <motion.div 
                        key={spend}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-white"
                      >
                        ₹{spendDisplay}
                      </motion.div>
                      <div className="text-xs text-emerald-300 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        ↓ 11% vs last week
                      </div>
                    </Glass>
                  </FloatingCard>
                  
                  <FloatingCard delay={0.2}>
                    <Glass className="p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="text-xs text-gray-400 mb-1">Next Bill</div>
                      <div className="text-2xl font-bold text-white">₹2,499</div>
                      <div className="text-xs text-orange-300 flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        Due Fri, 6 PM
                      </div>
                    </Glass>
                  </FloatingCard>
                  
                  <FloatingCard delay={0.3}>
                    <Glass className="p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="text-xs text-gray-400 mb-1">Runway</div>
                      <div className="text-2xl font-bold text-white">26 days</div>
                      <div className="text-xs text-blue-300 flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Projected safe
                      </div>
                    </Glass>
                  </FloatingCard>
                </div>
                
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
                  <Ticker />
                </div>
              </Glass>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-center text-xs text-gray-500"
              >
                Live demo data • Updates in real-time
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="product" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Everything you need to master your money
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features that work together to give you complete financial clarity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Smart Categorization"
              desc="AI automatically tags every transaction with perfect accuracy"
              icon={Brain}
              hint="99.2% accurate"
              delay={0.1}
            />
            <FeatureCard
              title="Cashflow Projection"
              desc="See exactly when money comes in and goes out, weeks ahead"
              icon={LineChart}
              hint="30-day forecast"
              delay={0.2}
            />
            <FeatureCard
              title="Fee Detection"
              desc="Spots hidden charges and suggests better alternatives"
              icon={Search}
              hint="Saved users ₹12k avg"
              delay={0.3}
            />
            <FeatureCard
              title="Smart Alerts"
              desc="Get notified before you overspend, not after"
              icon={Bell}
              hint="Proactive warnings"
              delay={0.4}
            />
            <FeatureCard
              title="Bank-Level Security"
              desc="256-bit encryption with read-only bank connections"
              icon={ShieldCheck}
              hint="SOC 2 certified"
              delay={0.5}
            />
            <FeatureCard
              title="Mobile First"
              desc="Beautiful native apps for iOS and Android"
              icon={Smartphone}
              hint="4.9★ rating"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 py-20 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How SpendMate works</h2>
            <p className="text-xl text-gray-400">Three simple steps to financial clarity</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect your accounts",
                desc: "Securely link your bank accounts and cards in under 2 minutes",
                icon: CreditCard,
              },
              {
                step: "02", 
                title: "AI analyzes everything",
                desc: "Our AI categorizes transactions and builds your financial model",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get smart insights",
                desc: "Receive personalized recommendations and future projections",
                icon: Zap,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-gray-900 shadow-xl"
                  >
                    <item.icon className="h-8 w-8" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 rounded-full bg-slate-800 border border-emerald-400/50 px-2 py-1 text-xs font-bold text-emerald-400">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Your data stays{" "}
                <span className="text-emerald-400">private</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                We use read-only connections and process everything locally on your device.
                Your financial data never leaves your control.
              </p>
              
              <div className="space-y-4">
                {[
                  "256-bit bank-level encryption",
                  "Read-only account access",
                  "Local data processing",
                  "SOC 2 Type II certified",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Glass className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  <span className="font-semibold">Security Dashboard</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Encryption Status", value: "Active", color: "emerald" },
                    { label: "Data Location", value: "Your Device", color: "blue" },
                    { label: "Access Type", value: "Read-Only", color: "purple" },
                    { label: "Compliance", value: "SOC 2", color: "orange" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-400">{item.label}</span>
                      <span className={`text-${item.color}-400 font-medium`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Glass>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-20 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">50K+</div>
                <div className="text-sm text-gray-400">Active users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">₹2.1Cr</div>
                <div className="text-sm text-gray-400">Money managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">4.9★</div>
                <div className="text-sm text-gray-400">App store rating</div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-4 text-lg font-semibold text-gray-900 shadow-xl cursor-pointer"
            >
              <Users className="h-5 w-5" />
              Join thousands of smart spenders
              <ArrowUpRight className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-gray-900">
                <BarChart3 className="h-4 w-4" />
              </div>
              <span className="font-semibold">SpendMate</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 SpendMate. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ title, desc, icon: Icon, hint, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Glass className="p-6 h-full hover:bg-white/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-gray-900 shadow-lg group-hover:shadow-emerald-500/25 transition-all"
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          {hint && (
            <span className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 text-xs text-emerald-300">
              {hint}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-300 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </Glass>
    </motion.div>
  );
}

function Ticker() {
  const items = [
    { 
      icon: Wallet, 
      text: "Auto-tagged ₹499 'Food & Drinks' at Blue Tokai",
      color: "emerald"
    },
    { 
      icon: Bell, 
      text: "Heads-up: Rent due in 3 days (balance safe)",
      color: "orange"
    },
    {
      icon: TrendingUp,
      text: "Projection updated: +₹3,200 this week after refunds",
      color: "blue"
    },
  ];
  
  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{ y: [0, -120, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="divide-y divide-white/10"
      >
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div 
              key={i} 
              className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
              whileHover={{ x: 4 }}
            >
              <div className={`grid h-8 w-8 place-items-center rounded-lg bg-${it.color}-400/20 border border-${it.color}-400/30`}>
                <Icon className={`h-4 w-4 text-${it.color}-400`} />
              </div>
              <div className="text-sm text-gray-200 flex-1">{it.text}</div>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default LandingPage;