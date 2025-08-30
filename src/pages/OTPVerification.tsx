// src/pages/OTPVerification.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield } from "lucide-react";
import OtpBg from "../assets/OTPVerificationPage.mp4"; 

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTPAndRegister, requestOTP } = useAuth();

  const state = location.state as { 
    email?: string; 
    otpToken?: string; 
    userData?: { name: string; email: string; password: string } 
  };
  
  const email = state?.email;
  const [currentOtpToken, setCurrentOtpToken] = useState(state?.otpToken);
  const userData = state?.userData;

  const handleResendOTP = async () => {
    if (!email || !userData) {
      alert("Missing registration data. Please start registration again.");
      navigate("/register");
      return;
    }

    setResendLoading(true);
    try {
      const newOtpToken = await requestOTP(email);
      setCurrentOtpToken(newOtpToken);
      alert("New OTP sent successfully!");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOtpToken || !userData) {
      alert("Missing registration data. Please start registration again.");
      navigate("/register");
      return;
    }
    
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    
    setLoading(true);

    try {
      await verifyOTPAndRegister(otp, currentOtpToken, userData);
      alert("Registration successful! Welcome to SpendMate!");
      navigate("/app/profile-setup");
    } catch (error: unknown) {
      console.error("OTP verification and registration failed:", error);
      const errorMessage = error instanceof Error ? error.message : "OTP verification failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={OtpBg} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* OTP form */}
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Verify your Email
          </h2>
          <p className="mt-2 text-sm text-gray-200">
            We sent an OTP to <strong>{email || "your email"}</strong>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white bg-opacity-90 p-8 rounded-xl shadow-lg"
        >
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300">
          Didn't get the code?{" "}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-green-400 hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;