// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, ArrowLeft } from "lucide-react";
import LetterGlitch from "../components/LetterGlitch";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await resetPassword(email);
      setMessage("Check your inbox for further instructions.");
    } catch (error: unknown) {
      console.error("Password reset failed:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Fullscreen LetterGlitch background */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <LetterGlitch
          glitchColors={["#2b4539", "#61dca3", "#61b3dc"]}
          glitchSpeed={60}
          outerVignette={true}
          centerVignette={false}
          smooth={true}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Forgot password card */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 shadow-lg">
              <Mail className="h-6 w-6 text-slate-900" />
            </div>

            {/* Heading & subtitle in white */}
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-white">
              Enter your email to get reset instructions
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-xl bg-white/90 p-8 shadow-2xl backdrop-blur-md"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-600"
              >
                Email address
              </label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-400 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            {message && (
              <p className="mt-2 text-center text-sm text-slate-700">{message}</p>
            )}

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
