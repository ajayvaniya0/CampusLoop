import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemApi } from '../services/api';
import ItemDetailModal from '../components/ItemDetailModal';
import {
  Repeat,
  ShieldCheck,
  QrCode,
  Sparkles,
  ArrowRight,
  Calculator,
  Cpu,
  BookOpen,
  Wrench,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  GraduationCap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await itemApi.getItems({ limit: 3, sort: 'newest' });
        if (data && data.items) {
          setFeaturedItems(data.items.slice(0, 3));
        }
      } catch (e) {
        // silent fallback
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/marketplace?q=${encodeURIComponent(tag)}`);
  };

  const campusFeatures = [
    {
      icon: GraduationCap,
      title: 'College Verified Network',
      description: 'Sign up with your college email. Exchange academic resources safely with verified peers.',
      tag: 'Security First',
      color: 'text-emerald-700 bg-emerald-100/80 border-emerald-200',
    },
    {
      icon: QrCode,
      title: 'Dynamic QR Handovers',
      description: 'Quick scan during handover & return ensures authentic check-ins without paper logs.',
      tag: 'Paperless',
      color: 'text-blue-700 bg-blue-100/80 border-blue-200',
    },
    {
      icon: Sparkles,
      title: 'Green Points Economy',
      description: 'Earn 10-25 Green Points and build your campus reputation score with every circular borrow.',
      tag: 'Sustainability',
      color: 'text-amber-700 bg-amber-100/80 border-amber-200',
    },
    {
      icon: Layers,
      title: 'Cross-Department Gear',
      description: 'From CS microcontrollers to Mechanical drafting boards and Medical references.',
      tag: 'Multi-Discipline',
      color: 'text-purple-700 bg-purple-100/80 border-purple-200',
    },
  ];

  const categories = [
    {
      name: 'Calculators',
      desc: 'TI-84 CE, Casio 991, HP Prime for Calculus & Physics',
      icon: Calculator,
      tag: 'High Demand',
    },
    {
      name: 'Electronics',
      desc: 'Arduino, Raspberry Pi 4, Breadboards & IoT Sensor Kits',
      icon: Cpu,
      tag: 'Lab Ready',
    },
    {
      name: 'Textbooks',
      desc: 'Engineering, Biology, CS & Business standard editions',
      icon: BookOpen,
      tag: 'Reference',
    },
    {
      name: 'Engineering Tools',
      desc: 'Mini Drafters, Multimeters, Vernier Calipers, Toolkits',
      icon: Wrench,
      tag: 'Practical Gear',
    },
  ];

  return (
    <div className="space-y-20 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-14 shadow-2xl border border-emerald-900/50">
        {/* Background glow effects */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Resource Sharing & Circular Economy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Borrow Campus Gear for <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-8">One Semester</span>.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Why buy expensive equipment you only need for one term? Connect with verified students to borrow calculators, lab kits, and textbooks sustainably.
          </p>

          {/* Interactive Search Bar inside Hero */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-xl hover:border-emerald-400/50 transition">
              <Search className="w-5 h-5 text-slate-300 ml-3" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search calculators, Arduino, Campbell Biology, multimeters..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer whitespace-nowrap"
              >
                Search Gear
              </button>
            </div>

            {/* Popular quick-click search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-300">
              <span className="text-slate-400">Popular on campus:</span>
              {['TI-84 Plus', 'Arduino Uno', 'Multimeter', 'Campbell Biology', 'Mini Drafter'].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-slate-200 transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>Explore All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 backdrop-blur transition"
            >
              <span>Student Sign Up (+50 pts)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Campus Trust & Architecture Cards (Clean, authentic student-focused layout) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {campusFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${feature.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Live Featured Gear Showcase */}
      {featuredItems.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Marketplace Listings</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Recently Listed on Campus
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <span>View all available items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all flex flex-col overflow-hidden"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={item.images?.[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-slate-800 text-[11px] font-bold rounded-full shadow-xs">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    +{item.depositPoints || 10} pts
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.maxDuration || 7} days max
                    </span>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailOpen(true);
                      }}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-semibold rounded-lg transition cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Categories Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Explore by Academic Category
          </h2>
          <p className="text-xs text-slate-500">
            Find necessary equipment and textbooks for your current semester classes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {cat.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 pt-2">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works - 3 Easy Steps */}
      <section className="bg-slate-900 rounded-3xl text-white p-8 sm:p-12 space-y-10 shadow-xl">
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold rounded-full">
            Campus Workflow
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            How CampusLoop Operates
          </h2>
          <p className="text-slate-400 text-xs">
            Simple 3-step lifecycle built for student convenience and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 01</span>
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Find & Request</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browse campus listings and send a borrow request specifying dates and purpose.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 02</span>
              <QrCode className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">QR Handover</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Meet at the library or department quad. The owner shows a dynamic QR code for instant check-in.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 03</span>
              <Sparkles className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Return & Earn Points</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scan to confirm return. Both students earn Green Points and boost their campus trust score.
            </p>
          </div>
        </div>
      </section>

      {/* Item Details Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRequestBorrow={(item) => {
          setIsDetailOpen(false);
          navigate(`/marketplace?q=${encodeURIComponent(item.title)}`);
        }}
      />
    </div>
  );
}
