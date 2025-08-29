import React, { useMemo, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import ForgotPasswordBg from "../assets/ForgotPasswordBg.mp4"; // ✅ import your mp4

const mockAuth = {
  sendOtp: async (email: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 600));
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const map: Record<string, { otp: string; issuedAt: number }> = JSON.parse(
      localStorage.getItem("_otp_map") || "{}"
    );
    map[email] = { otp, issuedAt: Date.now() };
    localStorage.setItem("_otp_map", JSON.stringify(map));
    return otp;
  },
  verifyOtp: async (email: string, code: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 400));
    const map: Record<string, { otp: string; issuedAt: number }> = JSON.parse(
      localStorage.getItem("_otp_map") || "{}"
    );
    const rec = map[email];
    if (!rec) throw new Error("OTP not requested for this email.");
    const expired = Date.now() - rec.issuedAt > 5 * 60 * 1000;
    if (expired) throw new Error("OTP expired. Please request a new one.");
    if (rec.otp !== code) throw new Error("Invalid OTP.");
    return true;
  },
  resetPassword: async (email: string, newPassword: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));
    const users: Record<string, { password: string }> = JSON.parse(
      localStorage.getItem("_users_demo") || "{}"
    );
    users[email] = { ...(users[email] || {}), password: newPassword };
    localStorage.setItem("_users_demo", JSON.stringify(users));
    const map: Record<string, { otp: string; issuedAt: number }> = JSON.parse(
      localStorage.getItem("_otp_map") || "{}"
    );
    delete map[email];
    localStorage.setItem("_otp_map", JSON.stringify(map));
    return true;
  },
};

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
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await mockAuth.sendOtp(email);
      setMessage("OTP sent to your email (demo: stored locally). Valid for 5 minutes.");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await mockAuth.verifyOtp(email, otp);
      setMessage("OTP verified. You can set a new password.");
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmitPassword) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await mockAuth.resetPassword(email, password);
      setMessage("Password updated successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
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
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Foreground content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center gap-3 text-white">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
        </div>

        <div className="rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-md">
          {/* STEP 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Registered email
              </label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
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
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="relative mt-1">
                <ShieldCheck className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 tracking-widest focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
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

          {/* STEP 3: Reset password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  minLength={8}
                  required
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Confirm new password
              </label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirm"
                  type="password"
                  minLength={8}
                  required
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900"
                  placeholder="Re-enter new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

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
