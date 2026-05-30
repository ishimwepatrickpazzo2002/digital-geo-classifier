import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { FileBarChart, Download, Printer, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadAnalyses, type SoilAnalysis } from '../lib/api';
import { classifySoil, SOIL_CLASS_COLORS } from '../lib/soilClassification';
import { useApp } from '../contexts/AppContext';

export default function ReportsPage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [analyses, setAnalyses] = useState<SoilAnalysis[]>([]);
  const [selected, setSelected] = useState<SoilAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!user) {
      setAnalyses([]);
      setSelected(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadAnalyses(user.id)
      .then(list => {
        if (!active) return;
        setAnalyses(list);
        setSelected(list[0] ?? null);
      })
      .catch(error => {
        if (!active) return;
        setAnalyses([]);
        setSelected(null);
        addToast(error instanceof Error ? error.message : 'Failed to load reports', 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, addToast]);

  const result = selected ? classifySoil({
    percentPassing200: selected.percent_passing_200,
    percentPassing4: selected.percent_passing_4,
    liquidLimit: selected.liquid_limit ?? undefined,
    plasticLimit: selected.plastic_limit ?? undefined,
  }) : null;

  // Aggregate data for all analyses
  const classDistribution = Object.entries(
    analyses.reduce<Record<string, number>>((acc, a) => {
      acc[a.soil_class] = (acc[a.soil_class] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: SOIL_CLASS_COLORS[name] ?? '#6b7280' }));

  const confidenceData = analyses.slice(0, 8).map(a => ({
    name: a.sample_name.length > 10 ? a.sample_name.slice(0, 10) + '…' : a.sample_name,
    confidence: a.confidence,
    fill: SOIL_CLASS_COLORS[a.soil_class] ?? '#6b7280',
  }));

  const radarData = result ? result.engineeringProperties.map(p => ({
    subject: p.property.split(' ')[0],
    value: p.rating,
    fullMark: p.max,
  })) : [];

  function handlePrint() {
    window.print();
  }

  function handleExport() {
    if (!selected || !result) return;
    const content = `DIGITAL GEO CLASSIFIER — ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
---
Sample: ${selected.sample_name}
Classification: ${result.soilClass} — ${result.soilDescription}
Plasticity Level: ${result.plasticityLevel}
Confidence: ${result.confidence}%
---
Input Data:
  % Passing #200: ${selected.percent_passing_200}%
  % Passing #4: ${selected.percent_passing_4}%
  Liquid Limit: ${selected.liquid_limit ?? 'N/A'}%
  Plastic Limit: ${selected.plastic_limit ?? 'N/A'}%
  Plasticity Index: ${selected.plasticity_index ?? 'N/A'}
---
Treatment Recommendation: ${result.treatment}
Construction Suitability: ${result.treatmentDetails.constructionSuitability}
---
Engineering Characteristics:
${result.engineeringCharacteristics.map(c => '  • ' + c).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geo-classifier-${selected.sample_name.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Report exported successfully!', 'success');
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-navy-200 border-t-navy-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileBarChart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Analysis Data</h3>
          <p className="text-gray-400 text-sm">Run a soil classification first to generate visualizations and reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Visualization & Reports</h2>
          <p className="text-gray-500 mt-1">Analysis charts and exportable reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-secondary text-sm flex items-center gap-2 py-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleExport} className="btn-primary text-sm flex items-center gap-2 py-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Sample selector */}
      {analyses.length > 1 && (
        <div className="card p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Analysis</p>
          <div className="flex flex-wrap gap-2">
            {analyses.map(a => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  selected?.id === a.id
                    ? 'border-navy-300 bg-navy-50 text-navy-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: SOIL_CLASS_COLORS[a.soil_class] ?? '#6b7280' }}
                >
                  {a.soil_class.charAt(0)}
                </span>
                {a.sample_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && result && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Soil Class', value: result.soilClass, sub: result.soilDescription.split(' ').slice(0, 3).join(' '), color: SOIL_CLASS_COLORS[result.soilClass] ?? '#6b7280' },
              { label: 'Confidence', value: `${result.confidence}%`, sub: 'Classification accuracy', color: '#22c55e' },
              { label: 'Treatment', value: result.treatment.split(' ')[0], sub: result.treatment, color: '#497fb0' },
              { label: 'Plasticity', value: result.plasticityLevel.split(' ')[0], sub: result.plasticityLevel, color: '#d38432' },
            ].map((s, i) => (
              <div key={i} className="card p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-3" style={{ backgroundColor: s.color }}>
                  {s.value.charAt(0)}
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Soil composition pie */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-4 bg-navy-700 rounded" />
                Soil Composition
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={result.composition}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={false}
                  >
                    {result.composition.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Engineering properties radar */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-4 bg-steel-600 rounded" />
                Engineering Properties
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Radar name="Rating" dataKey="value" stroke="#1e2b87" fill="#1e2b87" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engineering properties bar */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-4 bg-amber-500 rounded" />
              Engineering Property Ratings
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={result.engineeringProperties} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="property" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  formatter={(v) => [`${v}/10`, 'Rating']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="rating" radius={[6, 6, 0, 0]}>
                  {result.engineeringProperties.map((entry, i) => (
                    <Cell key={i} fill={entry.rating >= 7 ? '#22c55e' : entry.rating >= 5 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Aggregate charts */}
      {analyses.length > 1 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Class distribution */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-4 bg-steel-500 rounded" />
              All Soil Classes Distribution
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={classDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                  {classDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Confidence bar */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-4 bg-green-500 rounded" />
              Classification Confidence
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={confidenceData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Confidence']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="confidence" radius={[6, 6, 0, 0]}>
                  {confidenceData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {selected && result && (
        <div className="card p-6 gradient-navy text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold">AI-Style Soil Insights</h3>
            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Automated Analysis</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="font-semibold mb-1">Soil Behavior</p>
              <p className="text-blue-200 text-xs leading-relaxed">
                {result.soilClass.startsWith('C') ? 'This cohesive soil exhibits plastic deformation under load with volume change sensitivity to moisture. Monitor swelling during wet cycles.' :
                 result.soilClass.startsWith('M') ? 'Silty soil shows intermediate behavior. Frost susceptibility is a key design concern for this material.' :
                 'Granular soil demonstrates frictional resistance. Density and gradation are primary engineering parameters.'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="font-semibold mb-1">Design Considerations</p>
              <p className="text-blue-200 text-xs leading-relaxed">
                {result.confidence >= 90 ? 'High confidence classification. Standard engineering parameters apply. Laboratory verification recommended for critical structures.' :
                 'Moderate confidence. Consider additional testing (compaction, CBR, consolidation) for design verification.'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="font-semibold mb-1">Foundation Implication</p>
              <p className="text-blue-200 text-xs leading-relaxed">
                {['CH', 'MH', 'OH'].includes(result.soilClass) ? 'High compressibility — deep foundations or soil improvement recommended.' :
                 ['CL', 'ML'].includes(result.soilClass) ? 'Moderate bearing capacity — shallow foundations with load limitations.' :
                 'Good to excellent bearing capacity — shallow foundations generally suitable.'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="font-semibold mb-1">Processing Accuracy</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${result.confidence}%` }} />
                </div>
                <span className="text-green-300 font-bold text-sm">{result.confidence}%</span>
              </div>
              <p className="text-blue-200 text-xs mt-1">Based on input data completeness</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
