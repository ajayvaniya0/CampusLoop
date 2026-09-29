import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';

export default function Login() {
  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-sm text-slate-500 mt-1">
          Log in with your college email to access CampusLoop
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            College Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              placeholder="student@college.edu"
              disabled
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="password"
              placeholder="••••••••"
              disabled
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-500"
            />
          </div>
        </div>

        <button
          disabled
          className="w-full py-2.5 px-4 bg-emerald-600/60 text-white rounded-lg font-medium text-sm cursor-not-allowed shadow-sm transition"
        >
          Login (Placeholder)
        </button>

        <div className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
