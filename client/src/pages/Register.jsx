import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User, Mail, GraduationCap, Lock } from 'lucide-react';

export default function Register() {
  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Student Registration</h1>
        <p className="text-sm text-slate-500 mt-1">
          Join CampusLoop to share and borrow campus resources
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="John Doe"
              disabled
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-500"
            />
          </div>
        </div>

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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department
            </label>
            <div className="relative">
              <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Computer Sci"
                disabled
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Semester
            </label>
            <input
              type="number"
              placeholder="4"
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-500"
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
          Register (Placeholder)
        </button>

        <div className="text-center text-sm text-slate-500 mt-4">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
