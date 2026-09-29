import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, ShieldCheck, QrCode, Sparkles, ArrowRight } from 'lucide-react';

export default function Landing() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Verified Student Network',
      description: 'Campus email authentication ensures trust and accountability among peers.',
    },
    {
      icon: QrCode,
      title: 'Secure QR Handovers',
      description: 'Handover and return verification via dynamic QR tokens.',
    },
    {
      icon: Sparkles,
      title: 'Earn Green Points',
      description: 'Promote campus sustainability and earn reputation by sharing academic gear.',
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
          <Repeat className="w-3.5 h-3.5" />
          Campus Resource Sharing Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Borrow and Share Academic Resources on Campus
        </h1>
        <p className="text-lg text-slate-600">
          From calculators and lab kits to textbooks and project components — find what you need or circulate what you don't use.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition"
          >
            Explore Marketplace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-sm transition"
          >
            Join CampusLoop
          </Link>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
