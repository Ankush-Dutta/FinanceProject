import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  BarChart3,
  Wallet,
  ShieldCheck,
  Smartphone,
  Search,
  ChevronRight,
  Calendar,
  Bell,
  TrendingUp,
  Target,
  CreditCard,
  CheckCircle,
  Users,
  ArrowUpRight,
  Zap,
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

const rotatingWords = [
  "tracks your daily expenses",
  "spots hidden bank charges",
  "forecasts your monthly budget",
  "alerts you before bills are due",
  "summarizes your spending habits",
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  );
};

const LandingPage = () => {
  const [spend, setSpend] = useState(48320);

  useEffect(() => {
    const id = setInterval(() => {
      setSpend((prev) => {
        const change = Math.floor(Math.random() * 200 - 100);
        return Math.max(48000, prev + change);
      });
    }, 2500);
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
    <div className="min-h-screen bg-slate-900 text-gray-100 relative overflow-hidden">
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
              <a href="#about" className="hover:text-white">About</a>
              <a href="#how" className="hover:text-white">How it works</a>
              <a href="#security" className="hover:text-white">Security</a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-2.5 text-sm font-semibold text-gray-900 hover:from-emerald-300 hover:to-teal-400 shadow-lg"
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
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300"
              >
                <Brain className="h-4 w-4" />
                <span>Private, on-device AI insights</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 text-5xl font-extrabold sm:text-6xl lg:text-7xl"
              >
                A money app that{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
                  helps
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
                className="mt-6 max-w-xl text-lg text-gray-300"
              >
                Connect your accounts, and SpendMate builds a clear picture of your
                cashflow—no spreadsheets, no hassle.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-4 text-lg font-semibold text-gray-900 hover:from-emerald-300 hover:to-teal-400 shadow-xl"
                >
                  Start for free
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>

            {/* KPI Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:pl-6 relative"
            >
              <Glass className="p-6 relative overflow-hidden">
                <div className="flex items-center justify-between text-sm text-gray-300 mb-6">
                  <div className="inline-flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    Today's Overview
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Insights
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <FloatingCard delay={0.1}>
                    <Glass className="p-4 hover:bg-white/10 cursor-pointer">
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
                    <Glass className="p-4 hover:bg-white/10 cursor-pointer">
                      <div className="text-xs text-gray-400 mb-1">Next Bill</div>
                      <div className="text-2xl font-bold text-white">₹1,450</div>
                      <div className="text-xs text-orange-300 flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        Due in 2 days
                      </div>
                    </Glass>
                  </FloatingCard>

                  <FloatingCard delay={0.3}>
                    <Glass className="p-4 hover:bg-white/10 cursor-pointer">
                      <div className="text-xs text-gray-400 mb-1">Safe to spend</div>
                      <div className="text-2xl font-bold text-white">₹12,800</div>
                      <div className="text-xs text-blue-300 flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Till next payday
                      </div>
                    </Glass>
                  </FloatingCard>
                </div>

                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
                  <Ticker />
                </div>
              </Glass>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 bg-white/5">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            About <span className="text-emerald-400">SpendMate</span>
          </motion.h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            SpendMate is built to simplify how you manage money. We combine
            AI-powered insights with intuitive design to give you a clear picture
            of your spending, saving, and future planning. Our mission is to make
            financial clarity effortless, so you can focus on what matters most.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-12"
          >
            How SpendMate Works
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect accounts",
                desc: "Securely link your bank accounts and cards in under 2 minutes.",
                icon: CreditCard,
              },
              {
                step: "02",
                title: "AI analyzes everything",
                desc: "We categorize your transactions and build a personalized model.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get smart insights",
                desc: "Receive proactive alerts and forecasts tailored to your lifestyle.",
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
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-gray-900 shadow-xl">
                    <item.icon className="h-8 w-8" />
                  </div>
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
      <section id="security" className="relative z-10 py-20 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Your data stays{" "}
              <span className="text-emerald-400">secure</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              SpendMate is designed with security at its core. Your financial
              data is processed locally, never shared, and protected by
              bank-grade encryption.
            </p>
            <div className="space-y-4">
              {[
                "256-bit bank-level encryption",
                "Read-only account access",
                "Local data processing",
                "SOC 2 Type II certified",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-300">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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
      </section>
    </div>
  );
};

function Ticker() {
  const items = [
    { icon: Wallet, text: "Coffee at Starbucks ₹220 • Food & Drinks", color: "emerald" },
    { icon: Bell, text: "Electricity bill due in 2 days (₹1,450)", color: "orange" },
    { icon: CreditCard, text: "Netflix subscription charged: ₹499", color: "purple" },
    { icon: TrendingUp, text: "Cashback credited: ₹300 from Amazon Pay", color: "blue" },
  ];

  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{ y: [0, -160, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
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
              <div
                className={`grid h-8 w-8 place-items-center rounded-lg bg-${it.color}-400/20 border border-${it.color}-400/30`}
              >
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
