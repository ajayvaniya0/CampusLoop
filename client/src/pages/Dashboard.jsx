import React from 'react';
import { LayoutDashboard, ArrowUpRight, ArrowDownLeft, Award, Clock } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Active Borrowings', value: '0', icon: ArrowDownLeft, color: 'text-blue-600 bg-blue-50' },
    { title: 'Items Listed', value: '0', icon: ArrowUpRight, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pending Requests', value: '0', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { title: 'Green Points', value: '0 pts', icon: Award, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-emerald-600" />
          Student Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your active borrowings, listed resources, and Green Points.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-2">Active Borrowings</h2>
          <p className="text-sm text-slate-500 mb-4">You have no items currently borrowed.</p>
          <div className="p-8 border-2 border-dashed border-slate-100 rounded-lg text-center text-sm text-slate-400">
            No active transactions (Placeholder)
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-2">My Resource Listings</h2>
          <p className="text-sm text-slate-500 mb-4">Manage and list items for other students to borrow.</p>
          <div className="p-8 border-2 border-dashed border-slate-100 rounded-lg text-center text-sm text-slate-400">
            No items listed yet (Placeholder)
          </div>
        </div>
      </div>
    </div>
  );
}
