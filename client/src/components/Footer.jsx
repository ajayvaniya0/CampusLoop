import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-emerald-700">
              <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <Repeat className="w-4 h-4" />
              </span>
              <span>Campus<span className="text-slate-900">Loop</span></span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Smart campus resource sharing platform enabling verified students to circulate academic gear, lab equipment, and textbooks securely.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sprint 2: Resource Marketplace Live</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link to="/marketplace" className="hover:text-emerald-600 transition">
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-600 transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-600 transition">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-600 transition">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Campus Trust</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Student Identity
              </li>
              <li>Green Points Incentives</li>
              <li>QR Handover Protocols</li>
              <li>Dispute & Community Safety</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusLoop. Built for sustainable student communities.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Circulating gear with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>on campus</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
