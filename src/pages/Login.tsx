// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, Mail, Lock } from "lucide-react";
import LiquidEther from "../components/LiquidEther";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed. Please check your credentials.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Fullscreen LiquidEther background */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <LiquidEther
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={1000}
          autoRampDuration={0.6}
          className="absolute inset-0 h-full w-full"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Login card */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-300 shadow-lg">
              <LogIn className="h-6 w-6 text-slate-900" />
            </div>

            {/* Heading & subtitle */}
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-black">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-green-800">
              Sign in to your SpendMate account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-xl bg-white/90 p-8 shadow-2xl backdrop-blur-md"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-500">
                  Email address
                </label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-300 sm:text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-500">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-300 sm:text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <div className="mt-2 text-right">
                  <Link to="/forgot-password" className="text-sm font-medium text-lime-600 hover:text-lime-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-lime-400 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-colors hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-slate-700">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-lime-600 hover:text-lime-500">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
