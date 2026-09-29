import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Repeat, ShoppingBag, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-emerald-100 text-emerald-800'
        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-700 tracking-tight">
            <span className="p-2 bg-emerald-600 text-white rounded-lg shadow-sm">
              <Repeat className="w-5 h-5" />
            </span>
            <span>Campus<span className="text-slate-900">Loop</span></span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/marketplace" className={navLinkClass}>
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              Marketplace
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              Dashboard
            </NavLink>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
