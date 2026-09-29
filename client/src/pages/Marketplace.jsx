import React from 'react';
import { ShoppingBag, Search, Filter, Sparkles, Tag } from 'lucide-react';

export default function Marketplace() {
  const dummyItems = [
    {
      id: '1',
      title: 'TI-84 Plus Graphic Calculator',
      category: 'Electronics',
      condition: 'Like New',
      location: 'Main Campus Library',
      status: 'AVAILABLE',
    },
    {
      id: '2',
      title: 'Arduino Starter Kit Complete',
      category: 'Lab Kits',
      condition: 'Good',
      location: 'Engineering Block B',
      status: 'AVAILABLE',
    },
    {
      id: '3',
      title: 'Data Structures & Algorithms in Java',
      category: 'Textbooks',
      condition: 'Fair',
      location: 'Hostel Block C',
      status: 'AVAILABLE',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse and request resources shared by fellow campus students.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          Placeholder View (Features coming soon)
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search items, calculators, textbooks, lab kits..."
            disabled
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-500"
          />
        </div>
        <button
          disabled
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 bg-slate-50 cursor-not-allowed"
        >
          <Filter className="w-4 h-4" />
          Category Filter
        </button>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                  <Tag className="w-3 h-3" />
                  {item.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 mb-2">Condition: <span className="font-medium text-slate-700">{item.condition}</span></p>
              <p className="text-xs text-slate-500">Pickup: <span className="font-medium text-slate-700">{item.location}</span></p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                disabled
                className="w-full py-2 px-3 bg-slate-100 text-slate-400 font-medium rounded-lg text-xs cursor-not-allowed"
              >
                Request Item (Placeholder)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
