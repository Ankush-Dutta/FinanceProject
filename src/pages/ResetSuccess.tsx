// src/pages/ResetSuccess.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, LogIn } from "lucide-react";

const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Password Updated</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your password has been changed successfully. You can now sign in with your new password.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <LogIn className="h-4 w-4" />
          Go to Login
        </button>

        <p className="mt-3 text-xs text-gray-500">
          or <Link to="/" className="text-blue-600 hover:text-blue-500">return to home</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetSuccess;
