import React from 'react';
import { Repeat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Repeat className="w-5 h-5 text-emerald-600" />
            <span>CampusLoop</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
              Smart Resource Sharing
            </span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CampusLoop. Smart Campus Resource Sharing.
          </p>
        </div>
      </div>
    </footer>
  );
}
