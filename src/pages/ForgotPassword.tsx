import React, { useMemo, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import ForgotPasswordBg from "../assets/ForgotPasswordBg.mp4"; 

const API_BASE = "http://127.0.0.1:5000"; // Flask backend URL

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const canSubmitPassword = useMemo(
    () => password.length >= 8 && password === confirm,
    [password, confirm]
  );

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setMessage("OTP sent to your email. Valid for 5 minutes.");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      setMessage("OTP verified. You can set a new password.");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmitPassword) return;
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setMessage("Password updated successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center px-4 overflow-hidden">
      {/* 🔹 Video Background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={ForgotPasswordBg}
        autoPlay loop muted playsInline
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Foreground */}
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center gap-3 text-white">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
        </div>

        <div className="rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-md">
          {/* STEP 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Registered email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="block w-full rounded-lg border py-3 pl-10 pr-3 text-gray-900"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <div className="relative mt-1">
                <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  inputMode="numeric"
                  maxLength={6}
                  required
                  className="block w-full rounded-lg border py-3 pl-10 pr-3 text-gray-900 tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                minLength={8}
                required
                className="block w-full rounded-lg border py-3 pl-3 text-gray-900"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
              <input
                type="password"
                minLength={8}
                required
                className="block w-full rounded-lg border py-3 pl-3 text-gray-900"
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading || !canSubmitPassword}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          {(message || error) && (
            <div
              className={`mt-4 rounded-lg border p-3 text-sm ${
                error
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-emerald-300 bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
