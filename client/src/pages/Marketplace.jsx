import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemApi } from '../services/api';
import CreateItemModal from '../components/CreateItemModal';
import ItemDetailModal from '../components/ItemDetailModal';
import RequestBorrowModal from '../components/RequestBorrowModal';
import {
  Search,
  PlusCircle,
  Calculator,
  Cpu,
  BookOpen,
  Wrench,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  Filter,
  CheckCircle2,
  RefreshCw,
  Loader2,
  SlidersHorizontal,
  X,
  Check,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Layers },
  { name: 'Calculators', icon: Calculator },
  { name: 'Electronics', icon: Cpu },
  { name: 'Textbooks', icon: BookOpen },
  { name: 'Lab Equipment', icon: Sparkles },
  { name: 'Engineering Tools', icon: Wrench },
  { name: 'Notes & Stationery', icon: Layers },
];

const CONDITIONS = ['All', 'Brand New', 'Like New', 'Good', 'Fair'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Shortest Duration', value: 'duration_asc' },
  { label: 'Longest Duration', value: 'duration_desc' },
];

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const qParam = queryParams.get('q') || '';
  const catParam = queryParams.get('category') || 'All';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  // Sync state if URL query params change (e.g. from Landing page navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newQ = params.get('q');
    const newCat = params.get('category');
    if (newQ !== null && newQ !== searchTerm) {
      setSearchTerm(newQ);
    }
    if (newCat !== null && newCat !== selectedCategory) {
      setSelectedCategory(newCat);
    }
  }, [location.search]);

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/marketplace' } } });
      return;
    }
    setIsCreateOpen(true);
  };

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await itemApi.getItems({
        q: searchTerm,
        category: selectedCategory,
        condition: selectedCondition,
        sort: selectedSort,
      });
      if (data && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      setError(err.message || 'Failed to load marketplace items.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedCondition, selectedSort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleItemCreated = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    setSelectedItem(newItem);
    setIsDetailOpen(true);
  };

  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedSort('newest');
  };

  const conditionColors = {
    'Brand New': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Like New': 'bg-teal-100 text-teal-800 border-teal-300',
    'Good': 'bg-blue-100 text-blue-800 border-blue-300',
    'Fair': 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-8 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Verified Campus Resource Exchange
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Campus Marketplace
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Borrow calculators, lab gear, textbooks, and electronic kits from verified classmates. Earn Green Points with every circular exchange.
          </p>
        </div>

        {/* Floating Quick Action */}
        <div className="relative z-10 mt-6 sm:mt-0 sm:absolute sm:bottom-8 sm:right-8">
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-slate-950" />
            <span>List an Item</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        {/* Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, department, lab kit, book name, or tag..."
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="All">All Conditions</option>
              {CONDITIONS.filter((c) => c !== 'All').map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse shadow-sm"
            >
              <div className="w-full h-48 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
          <p className="text-red-700 font-semibold">{error}</p>
          <button
            onClick={fetchItems}
            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Retry Loading
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No resources found</h3>
          <p className="text-sm text-slate-500">
            We couldn't find any listings matching your current filters or query.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Clear Filters
            </button>
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs"
            >
              List First Resource
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isAvailable = item.status === 'AVAILABLE';
            return (
              <div
                key={item._id}
                className="group bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur text-slate-800 text-xs font-bold rounded-full shadow-sm">
                      {item.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 border text-[11px] font-semibold rounded-full shadow-sm ${
                        conditionColors[item.condition] || 'bg-white text-slate-700'
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>

                  {/* Green Points Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/95 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1 backdrop-blur">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    +{item.depositPoints || 10} pts
                  </div>

                  {/* Status Overlay */}
                  {!isAvailable && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full shadow-sm">
                      {item.status}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-emerald-700 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Metadata Specs */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {item.location || 'Main Campus'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Up to {item.maxDuration || 7} days
                    </span>
                  </div>

                  {/* Owner Card & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                        {item.ownerId?.name ? item.ownerId.name.charAt(0) : 'S'}
                      </div>
                      <div className="text-[11px] leading-tight">
                        <p className="font-semibold text-slate-800">{item.ownerId?.name || 'Peer'}</p>
                        <p className="text-emerald-700 font-medium">
                          ★ {item.ownerId?.reputationScore ?? 100}% Trust
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetail(item)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
                    >
                      View Resource
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn border border-emerald-500">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-semibold">{successBanner}</span>
          <button onClick={() => setSuccessBanner('')} className="p-1 hover:bg-emerald-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Listing Creation Modal */}
      <CreateItemModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onItemCreated={handleItemCreated}
      />

      {/* Item Detail View Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRequestBorrow={(item) => {
          setIsDetailOpen(false);
          setIsRequestOpen(true);
        }}
      />

      {/* Borrow Request Modal */}
      <RequestBorrowModal
        item={selectedItem}
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        onRequestSuccess={(request) => {
          setSuccessBanner(`Borrow request for "${selectedItem?.title}" sent to owner!`);
          setTimeout(() => setSuccessBanner(''), 6000);
        }}
      />
    </div>
  );
}
