import { BookOpen, Layers, FlaskConical, Award, CheckCircle, BarChart3, Shield, Zap } from 'lucide-react';

const USCS_GROUPS = [
  {
    group: 'Coarse-Grained Soils',
    color: 'bg-amber-500',
    desc: '>50% retained on #200 sieve',
    types: [
      { symbol: 'GW', name: 'Well-Graded Gravel', props: 'Excellent drainage, high strength' },
      { symbol: 'GP', name: 'Poorly-Graded Gravel', props: 'Good drainage, variable strength' },
      { symbol: 'GM', name: 'Silty Gravel', props: 'Reduced drainage, moderate strength' },
      { symbol: 'GC', name: 'Clayey Gravel', props: 'Low drainage, plastic when wet' },
      { symbol: 'SW', name: 'Well-Graded Sand', props: 'Good drainage, medium strength' },
      { symbol: 'SP', name: 'Poorly-Graded Sand', props: 'Good drainage, low cohesion' },
      { symbol: 'SM', name: 'Silty Sand', props: 'Moderate drainage, frost susceptible' },
      { symbol: 'SC', name: 'Clayey Sand', props: 'Limited drainage, plastic fines' },
    ],
  },
  {
    group: 'Fine-Grained Soils (Low Plasticity)',
    color: 'bg-blue-500',
    desc: '>50% passing #200 sieve, LL < 50%',
    types: [
      { symbol: 'ML', name: 'Inorganic Silt', props: 'Frost heave risk, sensitive' },
      { symbol: 'CL', name: 'Lean Clay', props: 'Medium plasticity, low compressibility' },
      { symbol: 'OL', name: 'Organic Clay/Silt', props: 'Low organic content, compressible' },
      { symbol: 'CL-ML', name: 'Silty Clay', props: 'Borderline classification' },
    ],
  },
  {
    group: 'Fine-Grained Soils (High Plasticity)',
    color: 'bg-navy-700',
    desc: '>50% passing #200 sieve, LL ≥ 50%',
    types: [
      { symbol: 'MH', name: 'Elastic Silt', props: 'High plasticity, low strength' },
      { symbol: 'CH', name: 'Fat Clay', props: 'High swelling, very compressible' },
      { symbol: 'OH', name: 'Organic Clay', props: 'High organic, very compressible' },
      { symbol: 'PT', name: 'Peat', props: 'Extremely compressible, avoid' },
    ],
  },
];

const ATTERBERG_LIMITS = [
  { limit: 'Liquid Limit (LL)', symbol: 'LL', desc: 'Water content at which soil transitions from plastic to liquid state. Determined by Casagrande cup drop test. Higher LL indicates greater compressibility.', color: 'bg-blue-100 text-blue-700' },
  { limit: 'Plastic Limit (PL)', symbol: 'PL', desc: 'Water content at which soil ceases to be plastic and becomes semi-solid. Determined by rolling thread test at 3mm diameter.', color: 'bg-amber-100 text-amber-700' },
  { limit: 'Plasticity Index (PI)', symbol: 'PI = LL − PL', desc: 'Range of water content over which soil is plastic. PI = LL - PL. Higher PI indicates more plastic soil with greater volume change potential.', color: 'bg-navy-100 text-navy-700' },
  { limit: 'Shrinkage Limit (SL)', symbol: 'SL', desc: 'Water content below which further drying does not cause volume change. Used to assess shrinkage cracking potential.', color: 'bg-green-100 text-green-700' },
];

const BENEFITS = [
  { title: 'Standardized Classification', desc: 'USCS is internationally recognized and used by engineers worldwide', icon: Shield },
  { title: 'Engineering Decision Support', desc: 'Classification directly informs foundation, pavement, and earthwork design', icon: Layers },
  { title: 'Treatment Selection', desc: 'Soil class guides the most appropriate stabilization or improvement method', icon: Zap },
  { title: 'Risk Assessment', desc: 'Identifies problematic soils early in project planning stages', icon: Award },
  { title: 'Quality Control', desc: 'Provides objective basis for material acceptance during construction', icon: CheckCircle },
  { title: 'Cost Optimization', desc: 'Proper classification prevents over- or under-engineering costly treatments', icon: BarChart3 },
];

export default function AboutPage() {
  return (
    <div className="p-4 lg:p-8 space-y-10 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About the System</h2>
        <p className="text-gray-500 mt-1">Understanding USCS, Atterberg Limits, and soil engineering</p>
      </div>

      {/* Hero info */}
      <div className="card p-8 gradient-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="120" fill="none" stroke="white" strokeWidth="1"/>
            <circle cx="150" cy="150" r="80" fill="none" stroke="white" strokeWidth="1"/>
            <circle cx="150" cy="150" r="40" fill="none" stroke="white" strokeWidth="1"/>
            <line x1="30" y1="150" x2="270" y2="150" stroke="white" strokeWidth="0.5"/>
            <line x1="150" y1="30" x2="150" y2="270" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black">Digital Geo Classifier</h3>
              <p className="text-blue-200 text-sm">Laboratory Data-Based Soil Classification System</p>
            </div>
          </div>
          <p className="text-blue-100 leading-relaxed max-w-3xl">
            Digital Geo Classifier is an advanced web-based platform that automates soil classification using the Unified Soil Classification System (USCS) standard. By inputting standard laboratory test data — sieve analysis and Atterberg limits — the system accurately classifies soils and recommends appropriate engineering treatment methods.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['USCS Compliant', 'ISO 14688', 'ASTM D2487', 'AASHTO M145'].map(tag => (
              <span key={tag} className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* What is USCS */}
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 gradient-navy rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">What is USCS?</h3>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              The <strong className="text-navy-700 dark:text-blue-400">Unified Soil Classification System (USCS)</strong> is a soil classification system used in engineering and geology to describe the texture and grain size of a soil. The classification system can be applied to most unconsolidated materials and is represented by two-letter symbols.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Originally developed by Arthur Casagrande in 1948 for the U.S. Army Corps of Engineers, USCS was later modified and standardized as ASTM D2487. It classifies soils into 15 groups based on grain size distribution and plasticity characteristics.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { step: '1', label: 'Sieve Analysis', desc: 'Determine grain size distribution' },
              { step: '2', label: 'Atterberg Limits', desc: 'Measure LL and PL for fine soils' },
              { step: '3', label: 'Plasticity Chart', desc: 'Plot on Casagrande A-Line' },
              { step: '4', label: 'Classification', desc: 'Assign 2-letter USCS symbol' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-4 bg-gray-50 dark:bg-navy-800 rounded-xl p-3">
                <div className="w-8 h-8 gradient-navy rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atterberg Limits */}
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Atterberg Limits</h3>
        </div>
        {/* Visual water content states */}
        <div className="mb-6 bg-gray-50 dark:bg-navy-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Soil Consistency States vs. Water Content</p>
          <div className="flex h-12 rounded-xl overflow-hidden mb-3">
            <div className="flex-1 bg-stone-700 flex items-center justify-center text-white text-xs font-semibold">Solid</div>
            <div className="flex-1 bg-stone-500 flex items-center justify-center text-white text-xs font-semibold">Semi-solid</div>
            <div className="flex-1 bg-amber-500 flex items-center justify-center text-white text-xs font-semibold">Plastic</div>
            <div className="flex-1 bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">Liquid</div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 relative px-[25%]">
            <div className="text-center">
              <div className="w-px h-4 bg-amber-400 mx-auto mb-1" />
              <p className="font-semibold text-amber-600">SL</p>
            </div>
            <div className="text-center">
              <div className="w-px h-4 bg-navy-600 mx-auto mb-1" />
              <p className="font-semibold text-navy-600">PL</p>
            </div>
            <div className="text-center">
              <div className="w-px h-4 bg-blue-500 mx-auto mb-1" />
              <p className="font-semibold text-blue-500">LL</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">Water content increases →</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {ATTERBERG_LIMITS.map(al => (
            <div key={al.limit} className="border border-gray-100 dark:border-navy-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${al.color} font-mono`}>{al.symbol}</span>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{al.limit}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{al.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* USCS Classification Table */}
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">USCS Classification Groups</h3>
        </div>
        <div className="space-y-6">
          {USCS_GROUPS.map(group => (
            <div key={group.group}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${group.color}`} />
                <h4 className="font-bold text-gray-800 dark:text-white">{group.group}</h4>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-navy-700 px-2 py-0.5 rounded-full">{group.desc}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {group.types.map(type => (
                  <div key={type.symbol} className="bg-gray-50 dark:bg-navy-800 rounded-xl p-3 border border-gray-100 dark:border-navy-700">
                    <span className={`badge ${group.color} text-white mb-2 inline-flex`}>{type.symbol}</span>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{type.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{type.props}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Benefits of Automated Classification</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map(b => (
            <div key={b.title} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl border border-gray-100 dark:border-navy-700">
              <div className="w-9 h-9 gradient-navy rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <b.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{b.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'System Version', value: 'v2.1.0', sub: 'USCS 2024 Standard' },
          { label: 'Classification Engine', value: 'ASTM D2487', sub: 'AASHTO M145' },
          { label: 'Last Updated', value: 'May 2026', sub: 'Actively maintained' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-lg font-black text-navy-700 dark:text-blue-400">{s.value}</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
