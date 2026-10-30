import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestApi, itemApi } from '../services/api';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  ShieldCheck,
  ShoppingBag,
  PlusCircle,
  Sparkles,
  Send,
  Inbox,
  Calendar,
  MapPin,
  AlertCircle,
  Loader2,
  Trash2,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin, refreshUser } = useAuth();
  const location = useLocation();

  // Parse URL tab parameter if present (e.g. ?tab=incoming or ?tab=sent)
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState('');

  const [responseNotes, setResponseNotes] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [incomingRes, sentRes, listingsRes] = await Promise.all([
        requestApi.getIncoming().catch(() => ({ requests: [] })),
        requestApi.getSent().catch(() => ({ requests: [] })),
        itemApi.getMyListings().catch(() => ({ items: [] })),
      ]);

      setIncomingRequests(incomingRes.requests || []);
      setSentRequests(sentRes.requests || []);
      setMyListings(listingsRes.items || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab && ['overview', 'incoming', 'sent', 'listings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Handle Approve Request
  const handleApprove = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const note = responseNotes[requestId] || '';
      await requestApi.approve(requestId, note);
      setActionFeedback('Request approved! Item is marked for handover.');
      await fetchData();
      if (refreshUser) refreshUser();
      setTimeout(() => setActionFeedback(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to approve request');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject Request
  const handleReject = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const note = responseNotes[requestId] || '';
      await requestApi.reject(requestId, note);
      setActionFeedback('Request declined.');
      await fetchData();
      setTimeout(() => setActionFeedback(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to decline request');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Cancel Sent Request
  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this borrow request?')) return;
    try {
      setActionLoadingId(requestId);
      await requestApi.cancel(requestId);
      setActionFeedback('Borrow request cancelled.');
      await fetchData();
      setTimeout(() => setActionFeedback(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to cancel request');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete/Archive Listing
  const handleDeleteListing = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this resource listing?')) return;
    try {
      setActionLoadingId(itemId);
      await itemApi.deleteItem(itemId);
      setActionFeedback('Listing removed successfully.');
      await fetchData();
      setTimeout(() => setActionFeedback(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to remove listing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'PENDING').length;
  const activeBorrowingsCount = sentRequests.filter((r) => ['APPROVED', 'BORROWED', 'HANDOVER_PENDING'].includes(r.status)).length;

  const stats = [
    {
      title: 'Active Borrowings',
      value: activeBorrowingsCount.toString(),
      icon: ArrowDownLeft,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Items Listed',
      value: myListings.length.toString(),
      icon: ArrowUpRight,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Pending Requests',
      value: pendingIncomingCount.toString(),
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Green Points',
      value: `${user?.points ?? 50} pts`,
      icon: Award,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Approved for Handover
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      case 'BORROWED':
        return (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active Borrowing
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Returned & Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-full">
            Cancelled
          </span>
        );
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Feedback Toast */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Student Profile Card Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl font-bold text-emerald-300 shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{user?.name || 'Student'}</h1>
                {user?.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Student
                  </span>
                )}
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 border border-purple-400/30 text-purple-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-emerald-200/80 text-xs sm:text-sm mt-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {user?.department || 'Department of Engineering'} • Semester {user?.semester || 1}
              </p>
              <p className="text-emerald-300/60 text-xs mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-white/10 backdrop-blur rounded-2xl border border-white/10 text-center min-w-[110px]">
              <div className="text-xs text-emerald-200 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Green Points
              </div>
              <div className="text-2xl font-black text-white mt-0.5">{user?.points ?? 50}</div>
            </div>
            <div className="px-4 py-3 bg-white/10 backdrop-blur rounded-2xl border border-white/10 text-center min-w-[110px]">
              <div className="text-xs text-emerald-200">Reputation</div>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">{user?.reputationScore ?? 100}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap cursor-pointer relative ${
            activeTab === 'incoming'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Inbox className="w-4 h-4" />
            Incoming Requests
            {pendingIncomingCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
                {pendingIncomingCount}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeTab === 'sent'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Send className="w-4 h-4" /> My Sent Requests ({sentRequests.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4" /> My Listings ({myListings.length})
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4 transition hover:border-emerald-300"
                >
                  <div className={`p-3 rounded-xl border ${stat.color}`}>
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

          {/* Quick Action Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incoming Requests Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-emerald-600" /> Pending Requests for Your Gear
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    {pendingIncomingCount} action needed
                  </span>
                </div>
                {pendingIncomingCount === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-50 p-6 rounded-2xl text-center border border-dashed border-slate-200">
                    No pending borrow requests right now.
                  </p>
                ) : (
                  <p className="text-xs text-slate-600">
                    You have {pendingIncomingCount} classmate(s) waiting for approval on your listed equipment.
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveTab('incoming')}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition text-center cursor-pointer"
              >
                Review Incoming Requests
              </button>
            </div>

            {/* Marketplace Explorer Banner */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" /> Explore Campus Inventory
                  </h2>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Need graphing calculators, Arduino kits, or multimeters for an upcoming midterm or lab assignment?
                </p>
              </div>
              <Link
                to="/marketplace"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition text-center"
              >
                Browse Campus Marketplace
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INCOMING REQUESTS */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Incoming Requests from Peers</h2>
              <p className="text-xs text-slate-500">
                Approve or decline students requesting to borrow your listed resources.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-xs">Loading requests...</p>
            </div>
          ) : incomingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No requests received yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When other students request to borrow your listed gear, their requests will appear here for your approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req) => {
                const isPending = req.status === 'PENDING';
                return (
                  <div
                    key={req._id}
                    className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    {/* Item & Requester Details */}
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={req.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=300&q=80'}
                        alt={req.itemId?.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{req.itemId?.title}</span>
                          {statusBadge(req.status)}
                        </div>

                        {/* Requester Profile Pill */}
                        <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                          <span className="font-semibold text-emerald-800">{req.borrowerId?.name}</span>
                          <span>•</span>
                          <span>{req.borrowerId?.department || 'Engineering'} (Sem {req.borrowerId?.semester || 4})</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">★ {req.borrowerId?.reputationScore ?? 100}%</span>
                        </div>

                        {/* Purpose & Dates */}
                        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                          <span className="font-semibold text-slate-700">Purpose:</span> {req.purpose}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(req.startDate).toLocaleDateString()} → {new Date(req.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <Sparkles className="w-3 h-3 text-amber-500" /> +{req.itemId?.depositPoints || 10} Green Points
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Owner Action Buttons */}
                    {isPending ? (
                      <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                        <input
                          type="text"
                          placeholder="Optional handover note / spot..."
                          value={responseNotes[req._id] || ''}
                          onChange={(e) =>
                            setResponseNotes({ ...responseNotes, [req._id]: e.target.value })
                          }
                          className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={actionLoadingId === req._id}
                            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            disabled={actionLoadingId === req._id}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-right text-xs text-slate-400">
                        {req.decidedAt && (
                          <p>Processed on {new Date(req.decidedAt).toLocaleDateString()}</p>
                        )}
                        {req.responseNote && (
                          <p className="italic text-slate-500 text-[11px] mt-0.5">"{req.responseNote}"</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SENT REQUESTS */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Sent Borrow Requests</h2>
            <p className="text-xs text-slate-500">Track status of campus resources you requested to borrow.</p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-xs">Loading sent requests...</p>
            </div>
          ) : sentRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Send className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No sent requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the marketplace and request gear from peers to see tracking status here.
              </p>
              <Link
                to="/marketplace"
                className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={req.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=300&q=80'}
                      alt={req.itemId?.title}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{req.itemId?.title}</h4>
                        {statusBadge(req.status)}
                      </div>

                      <p className="text-xs text-slate-500">
                        Owner: <span className="font-semibold text-slate-700">{req.ownerId?.name}</span> ({req.ownerId?.department})
                      </p>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-medium text-slate-500">Your note:</span> {req.purpose}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(req.startDate).toLocaleDateString()} to {new Date(req.dueDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {req.itemId?.location || 'Campus'}
                        </span>
                      </div>

                      {req.responseNote && (
                        <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 mt-2">
                          <span className="font-bold">Owner Note:</span> {req.responseNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {req.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(req._id)}
                      disabled={actionLoadingId === req._id}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY LISTED RESOURCES */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Listed Resources</h2>
              <p className="text-xs text-slate-500">Academic items and gear you've made available for borrowing.</p>
            </div>
            <Link
              to="/marketplace"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> List Another Item
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-xs">Loading listings...</p>
            </div>
          ) : myListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <ArrowUpRight className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No resources listed</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Share your unused calculators, lab equipment, and textbooks to earn Green Points.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden justify-between p-5 space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 bg-slate-100 rounded-2xl overflow-hidden">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=400&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-white/95 text-slate-800 text-[10px] font-bold rounded-full">
                        {item.category}
                      </span>
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">
                      +{item.depositPoints || 10} pts
                    </span>
                    <button
                      onClick={() => handleDeleteListing(item._id)}
                      disabled={actionLoadingId === item._id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Remove listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
