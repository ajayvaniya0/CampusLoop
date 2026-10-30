import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Repeat,
  ShoppingBag,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* Green Points Balance Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user?.points ?? 50} Green Points</span>
                </div>

                {/* User Pill / Profile summary */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition text-slate-700 text-sm font-medium"
                  title="View Student Dashboard"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user?.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className="hidden lg:flex flex-col text-left text-xs leading-tight">
                    <span className="font-semibold text-slate-800">{user?.name}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      {isAdmin && (
                        <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Admin
                        </span>
                      )}
                      {!isAdmin && `${user?.department?.split(' ')[0] || 'Student'}`}
                    </span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign out of CampusLoop"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
