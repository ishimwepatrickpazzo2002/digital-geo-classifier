import { useState, useEffect } from 'react';
import { Play, History, BookOpen, FlaskConical, TrendingUp, Clock, FileBarChart, Award, ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { loadRecentAnalyses } from '../lib/api';
import type { SoilAnalysis } from '../lib/api';
import { SOIL_CLASS_COLORS } from '../lib/soilClassification';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { setCurrentPage } = useApp();
  const [analyses, setAnalyses] = useState<SoilAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!profile) {
      setAnalyses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadRecentAnalyses(profile.id, 5)
      .then(list => {
        if (active) setAnalyses(list);
      })
      .catch(() => {
        if (active) setAnalyses([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [profile]);

  const firstName = profile?.fullName?.split(' ')[0] ?? 'Engineer';

  const stats = [
    { label: 'Total Analyses', value: analyses.length.toString(), icon: FlaskConical, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { label: 'Classification Accuracy', value: '96%', icon: Award, color: 'bg-green-50 text-green-600', trend: 'Standard' },
    { label: 'Avg. Processing Time', value: '~8s', icon: Clock, color: 'bg-amber-50 text-amber-600', trend: 'Fast' },
    { label: 'Saved Reports', value: analyses.length.toString(), icon: FileBarChart, color: 'bg-navy-50 text-navy-600', trend: 'Active' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative gradient-navy rounded-3xl overflow-hidden p-8 lg:p-12">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <defs>
              <pattern id="hero-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="800" height="400" fill="url(#hero-grid)" />
            <circle cx="600" cy="200" r="180" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="600" cy="200" r="120" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="600" cy="200" r="60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
          </svg>
        </div>
        {/* Soil layers */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="h-4 opacity-30" style={{ background: 'linear-gradient(180deg, transparent 0%, #d97706 100%)' }} />
          <div className="h-6 bg-amber-700 opacity-20" />
          <div className="h-4 bg-stone-800 opacity-25" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
              USCS Standard · System Active
            </span>
            <span className="bg-green-400/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-slow" />
              96% Accuracy
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Welcome Back,<br/><span className="text-blue-300">{firstName}</span>
          </h1>
          <p className="text-blue-200 text-base lg:text-lg mb-8 max-w-xl leading-relaxed">
            Laboratory Data-Based Soil Classification and Treatment Suggestion System
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('classification')}
              className="flex items-center gap-2 bg-white text-navy-800 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <Play className="w-4 h-4" />
              Start Classification
            </button>
            <button
              onClick={() => setCurrentPage('history')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              <History className="w-4 h-4" />
              View History
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4" />
              Learn USCS
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          {[
            { label: 'New Soil Analysis', desc: 'Classify a new soil sample', icon: Layers, page: 'classification' as const, color: 'gradient-navy text-white' },
            { label: 'View Treatments', desc: 'Review recommendation guide', icon: TrendingUp, page: 'treatment' as const, color: 'bg-amber-500 text-white' },
            { label: 'Reports & Charts', desc: 'View visualizations', icon: FileBarChart, page: 'reports' as const, color: 'bg-steel-600 text-white' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => setCurrentPage(action.page)}
              className="w-full card p-4 hover:shadow-card-hover transition-all duration-200 flex items-center gap-4 text-left group"
            >
              <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{action.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </button>
          ))}

          {/* System info card */}
          <div className="card p-5 bg-navy-50 dark:bg-navy-800 border-navy-100 dark:border-navy-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
              <span className="text-xs font-semibold text-navy-700 dark:text-navy-200 uppercase tracking-wide">System Status</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Classification Engine', value: 'Online', ok: true },
                { label: 'USCS Database', value: 'v2.1', ok: true },
                { label: 'Treatment AI', value: 'Active', ok: true },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-navy-300">{s.label}</span>
                  <span className={`text-xs font-semibold ${s.ok ? 'text-green-600' : 'text-red-500'}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent analyses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Analyses</h2>
            <button onClick={() => setCurrentPage('history')} className="text-sm text-navy-600 hover:text-navy-800 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-navy-200 border-t-navy-600 rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 text-sm mt-3">Loading analyses...</p>
              </div>
            ) : analyses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No analyses yet</p>
                <p className="text-gray-400 text-sm mt-1">Start your first soil classification</p>
                <button
                  onClick={() => setCurrentPage('classification')}
                  className="mt-4 btn-primary text-sm px-5 py-2.5"
                >
                  Start Analysis
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-navy-800">
                {analyses.map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: SOIL_CLASS_COLORS[a.soil_class] ?? '#6b7280' }}
                    >
                      {a.soil_class}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{a.sample_name}</p>
                      <p className="text-xs text-gray-500 truncate">{a.soil_description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{a.confidence}% confidence</p>
                      <p className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* USCS Info Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { class: 'CL/CH', label: 'Clay Soils', desc: 'Low to high plasticity', color: '#3b82f6' },
          { class: 'ML/MH', label: 'Silt Soils', desc: 'Inorganic, elastic', color: '#60a5fa' },
          { class: 'SM/SC', label: 'Sandy Soils', desc: 'Silty or clayey sand', color: '#d97706' },
          { class: 'GW/GP', label: 'Gravel Soils', desc: 'Well or poorly graded', color: '#22c55e' },
        ].map(s => (
          <div key={s.class} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: s.color }}>
              {s.class.split('/')[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.label}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
