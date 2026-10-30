import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Send,
  Eye,
} from 'lucide-react';

export default function ItemDetailModal({ item, isOpen, onClose, onRequestBorrow }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !item) return null;

  const isOwner =
    user && item.ownerId && String(user._id) === String(item.ownerId._id || item.ownerId);
  const isAvailable = item.status === 'AVAILABLE';

  const handleBorrowClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/marketplace' } } });
      return;
    }
    if (onRequestBorrow) {
      onRequestBorrow(item);
    }
  };

  const conditionColors = {
    'Brand New': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Like New': 'bg-teal-100 text-teal-800 border-teal-300',
    'Good': 'bg-blue-100 text-blue-800 border-blue-300',
    'Fair': 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="relative h-64 sm:h-72 bg-slate-900">
          <img
            src={item.images?.[0] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=800&q=80'}
            alt={item.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-sm">
              {item.category}
            </span>
            <span
              className={`px-3 py-1 border text-xs font-semibold rounded-full shadow-sm ${
                conditionColors[item.condition] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {item.condition}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{item.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-1.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {item.location || 'Main Campus'}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                {item.viewCount || 1} views
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-center">
              <span className="text-xs text-slate-500 font-medium">Max Duration</span>
              <p className="text-base font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                {item.maxDuration || 7} Days
              </p>
            </div>
            <div className="text-center border-x border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Green Points</span>
              <p className="text-base font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                +{item.depositPoints || 10} pts
              </p>
            </div>
            <div className="text-center">
              <span className="text-xs text-slate-500 font-medium">Current Status</span>
              <p className="text-base font-bold mt-0.5">
                {isAvailable ? (
                  <span className="text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Available
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> {item.status}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Item Details & Notes
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Verified Student Owner Card */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {item.ownerId?.name ? item.ownerId.name.charAt(0) : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {item.ownerId?.name || 'Verified Student Owner'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {item.ownerId?.department || 'Computer Science'} • Sem {item.ownerId?.semester || 4}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">Trust Score</span>
              <span className="text-sm font-black text-emerald-800">
                {item.ownerId?.reputationScore ?? 100}%
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Close
            </button>

            {isOwner ? (
              <span className="text-xs text-slate-500 font-medium px-4 py-2 bg-slate-100 rounded-xl">
                You listed this resource
              </span>
            ) : isAvailable ? (
              <button
                type="button"
                onClick={handleBorrowClick}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Request to Borrow</span>
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-2.5 bg-slate-200 text-slate-500 text-sm font-medium rounded-xl cursor-not-allowed"
              >
                Currently Borrowed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
