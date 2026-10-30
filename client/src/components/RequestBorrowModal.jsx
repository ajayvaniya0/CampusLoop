import React, { useState } from 'react';
import { requestApi } from '../services/api';
import {
  X,
  Send,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  AlertCircle,
  Loader2,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

export default function RequestBorrowModal({ item, isOpen, onClose, onRequestSuccess }) {
  if (!isOpen || !item) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [durationDays, setDurationDays] = useState(Math.min(item.maxDuration || 7, 7));
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculate Due Date based on start date + duration
  const start = new Date(startDate);
  const dueDate = new Date(start);
  dueDate.setDate(start.getDate() + Number(durationDays));
  const dueDateStr = dueDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!purpose.trim()) {
      setError('Please provide the course name or reason for borrowing this item.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        itemId: item._id,
        startDate: new Date(startDate).toISOString(),
        dueDate: dueDate.toISOString(),
        purpose: purpose.trim(),
      };

      const result = await requestApi.create(payload);
      if (result.success) {
        if (onRequestSuccess) {
          onRequestSuccess(result.request);
        }
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit borrow request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Send className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Request to Borrow</h2>
              <p className="text-xs text-emerald-100/80">Send request to peer item owner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <img
            src={item.images?.[0] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=400&q=80'}
            alt={item.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {item.category}
            </span>
            <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">{item.title}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {item.location || 'Campus'} • Owner: {item.ownerId?.name || 'Peer'}
            </p>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Dates & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Days
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  {durationDays} d (max {item.maxDuration || 7})
                </span>
              </label>
              <input
                type="number"
                min={1}
                max={item.maxDuration || 14}
                value={durationDays}
                onChange={(e) => setDurationDays(Math.max(1, Math.min(item.maxDuration || 14, Number(e.target.value))))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Calculated Due Date banner */}
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <span className="text-slate-600">Expected Return Date:</span>
            <span className="font-bold text-emerald-800">
              {dueDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Academic Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Purpose / Course <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. For Calculus II Midterm exam and homework problems..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Green Points Notice */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Green Points Reward:</span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Completing this transaction and returning on time awards +{item.depositPoints || 10} Green Points to your account!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Borrow Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
