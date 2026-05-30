import { useState, useEffect } from 'react';
import { Leaf, CheckCircle, Shield, Wrench, Droplets, Zap, Mountain, FlaskConical } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadLatestAnalysis } from '../lib/api';
import { SOIL_CLASS_COLORS } from '../lib/soilClassification';

const TREATMENTS = [
  {
    soil: ['CL', 'CL-ML'],
    method: 'Lime Stabilization',
    icon: Zap,
    color: 'bg-amber-500',
    severity: 'moderate',
    description: 'Adding hydrated lime to react with clay minerals through pozzolanic reactions, reducing plasticity and improving strength.',
    advantages: ['Reduces Plasticity Index by 10–20 pts', 'Increases CBR value significantly', 'Reduces swell potential', 'Economical for large volumes', 'Rapid strength gain in 7–28 days'],
    suitability: 'Road subgrade, embankments, parking areas',
    duration: '7–28 days',
    costIndicator: 'Medium',
  },
  {
    soil: ['CH', 'MH'],
    method: 'Cement Stabilization',
    icon: Mountain,
    color: 'bg-stone-600',
    severity: 'high',
    description: 'Portland cement binds soil particles through hydration, creating cementitious compounds that significantly increase strength and durability.',
    advantages: ['High compressive strength gain', 'Durable long-term performance', 'Reduces permeability substantially', 'Suitable for high-plasticity clays', 'Freezing-thawing resistant'],
    suitability: 'Pavement base, deep foundations, retaining walls',
    duration: '28 days curing',
    costIndicator: 'High',
  },
  {
    soil: ['SW', 'GW', 'GP', 'GC', 'SM'],
    method: 'Compaction',
    icon: Wrench,
    color: 'bg-green-600',
    severity: 'low',
    description: 'Controlled mechanical densification reduces void ratio and increases dry unit weight, improving bearing capacity and reducing settlement.',
    advantages: ['Simple and cost-effective', 'Improves bearing capacity 2–5x', 'Reduces consolidation settlement', 'No chemical additives required', 'Immediate results'],
    suitability: 'Fills, embankments, general earthworks',
    duration: 'Immediate',
    costIndicator: 'Low',
  },
  {
    soil: ['ML', 'OL'],
    method: 'Drainage Improvement',
    icon: Droplets,
    color: 'bg-blue-600',
    severity: 'moderate',
    description: 'Installing drainage systems (French drains, wick drains, sand columns) to reduce pore water pressure and improve effective stress.',
    advantages: ['Reduces pore water pressure', 'Accelerates consolidation 3–5x', 'Improves long-term stability', 'Prevents frost heave', 'Cost-effective for silty soils'],
    suitability: 'Waterlogged sites, slopes, retaining walls',
    duration: '3–12 months',
    costIndicator: 'Medium',
  },
  {
    soil: ['SC', 'GM'],
    method: 'Mechanical Stabilization',
    icon: Shield,
    color: 'bg-teal-600',
    severity: 'low',
    description: 'Blending granular materials to achieve optimal gradation curves, improving load distribution and friction angle.',
    advantages: ['Improves particle gradation', 'Increases friction angle', 'Uses locally available materials', 'Flexible application', 'Good for road construction'],
    suitability: 'Road base, unpaved surfaces, general fill',
    duration: 'Immediate',
    costIndicator: 'Low–Medium',
  },
  {
    soil: ['SP', 'GP'],
    method: 'Vibroflotation / Densification',
    icon: Zap,
    color: 'bg-orange-600',
    severity: 'high',
    description: 'Vibro-compaction or stone column installation densifies loose sandy soils at depth, reducing liquefaction risk significantly.',
    advantages: ['Deep improvement capability', 'Reduces liquefaction potential', 'Increases relative density 70%+', 'Minimal site disruption', 'High load-bearing improvement'],
    suitability: 'Loose sand sites, seismic zones, ports',
    duration: '2–6 weeks',
    costIndicator: 'High',
  },
  {
    soil: ['OH', 'PT'],
    method: 'Cement + Drainage Combination',
    icon: Leaf,
    color: 'bg-navy-700',
    severity: 'critical',
    description: 'Comprehensive treatment combining cement stabilization with improved drainage for highly compressible organic soils.',
    advantages: ['Comprehensive problem treatment', 'Addresses both strength and drainage', 'Reduces organic decomposition', 'Long-term stability assured', 'Custom-engineered solution'],
    suitability: 'Organic silt sites, waterfront, weak subgrade',
    duration: '4–12 weeks',
    costIndicator: 'Very High',
  },
];

const SEVERITY_CONFIG = {
  low: { label: 'Minimal Treatment', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  moderate: { label: 'Moderate Treatment', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  high: { label: 'Intensive Treatment', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  critical: { label: 'Critical Treatment', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const COST_COLORS: Record<string, string> = {
  'Low': 'text-green-600',
  'Low–Medium': 'text-teal-600',
  'Medium': 'text-amber-600',
  'High': 'text-orange-600',
  'Very High': 'text-red-600',
};

export default function TreatmentPage() {
  const { user } = useAuth();
  const [lastSoilClass, setLastSoilClass] = useState<string | null>(null);
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLastAnalysis() {
      if (!user) return;

      try {
        const last = await loadLatestAnalysis(user.id);
        if (!active || !last) return;
        setLastSoilClass(last.soil_class);
        setSelectedSoil(last.soil_class);
      } catch {
        if (active) {
          setLastSoilClass(null);
        }
      }
    }

    loadLastAnalysis();

    return () => {
      active = false;
    };
  }, [user]);

  const allSoilClasses = [...new Set(TREATMENTS.flatMap(t => t.soil))].sort();

  const matchingTreatment = TREATMENTS.find(t =>
    selectedSoil && t.soil.includes(selectedSoil)
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Treatment Recommendations</h2>
        <p className="text-gray-500 mt-1">Engineering treatment methods based on USCS soil classification</p>
      </div>

      {/* Soil selector */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="w-5 h-5 text-navy-600" />
          <h3 className="font-bold text-gray-900 dark:text-white">Select Soil Classification</h3>
          {lastSoilClass && (
            <span className="text-xs text-gray-400 ml-auto">Last analyzed: <strong className="text-navy-700">{lastSoilClass}</strong></span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allSoilClasses.map(sc => (
            <button
              key={sc}
              onClick={() => { setSelectedSoil(sc); setExpanded(null); }}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
                selectedSoil === sc
                  ? 'text-white border-transparent shadow-md scale-105'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              style={selectedSoil === sc ? { backgroundColor: SOIL_CLASS_COLORS[sc] ?? '#6b7280', borderColor: SOIL_CLASS_COLORS[sc] ?? '#6b7280' } : {}}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Matching treatment highlight */}
      {selectedSoil && matchingTreatment && (
        <div className="card overflow-hidden animate-slide-up">
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${SOIL_CLASS_COLORS[selectedSoil] ?? '#6b7280'}, #1e2b87)` }} />
          <div className="p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div
                className={`w-14 h-14 rounded-2xl ${matchingTreatment.color} flex items-center justify-center shadow-md flex-shrink-0`}
              >
                <matchingTreatment.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{matchingTreatment.method}</h3>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${SEVERITY_CONFIG[matchingTreatment.severity as keyof typeof SEVERITY_CONFIG].color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_CONFIG[matchingTreatment.severity as keyof typeof SEVERITY_CONFIG].dot}`} />
                    {SEVERITY_CONFIG[matchingTreatment.severity as keyof typeof SEVERITY_CONFIG].label}
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    For: {matchingTreatment.soil.join(', ')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{matchingTreatment.description}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <div><span className="text-gray-400">Duration: </span><span className="font-medium text-gray-700 dark:text-gray-200">{matchingTreatment.duration}</span></div>
                  <div><span className="text-gray-400">Cost: </span><span className={`font-semibold ${COST_COLORS[matchingTreatment.costIndicator] ?? 'text-gray-700'}`}>{matchingTreatment.costIndicator}</span></div>
                  <div><span className="text-gray-400">Suitability: </span><span className="font-medium text-gray-700 dark:text-gray-200">{matchingTreatment.suitability}</span></div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-2">
              {matchingTreatment.advantages.map((adv, i) => (
                <div key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-navy-800 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All treatment methods */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Treatment Methods</h3>
        <div className="space-y-3">
          {TREATMENTS.map(t => {
            const isExpanded = expanded === t.method;
            const sev = SEVERITY_CONFIG[t.severity as keyof typeof SEVERITY_CONFIG];
            return (
              <div key={t.method} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : t.method)}
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <t.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white">{t.method}</p>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sev.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                        {sev.label}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Soil types: {t.soil.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-semibold ${COST_COLORS[t.costIndicator] ?? 'text-gray-500'}`}>{t.costIndicator}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-50 dark:border-navy-800 animate-slide-up">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 mb-4 leading-relaxed">{t.description}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {t.advantages.map((adv, i) => (
                        <div key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-navy-800 rounded-lg p-2.5">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-600 dark:text-gray-300">{adv}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-4 text-sm">
                      <div><span className="text-gray-400 text-xs">Duration: </span><span className="font-medium text-gray-700 dark:text-gray-200 text-xs">{t.duration}</span></div>
                      <div><span className="text-gray-400 text-xs">Suitability: </span><span className="font-medium text-gray-700 dark:text-gray-200 text-xs">{t.suitability}</span></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
