import { useState, useEffect } from 'react';
import { Search, Trash2, FlaskConical, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { deleteAnalysis, loadAnalyses } from '../lib/api';
import type { SoilAnalysis } from '../lib/api';
import { SOIL_CLASS_COLORS } from '../lib/soilClassification';

export default function HistoryPage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [analyses, setAnalyses] = useState<SoilAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!user) {
      setAnalyses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadAnalyses(user.id)
      .then(list => list.sort((a, b) => {
        if (sortDir === 'asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }))
      .then(list => {
        if (active) setAnalyses(list);
      })
      .catch(error => {
        if (active) {
          setAnalyses([]);
          addToast(error instanceof Error ? error.message : 'Failed to load history', 'error');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, sortDir]);

  const filtered = analyses.filter(a =>
    a.sample_name.toLowerCase().includes(search.toLowerCase()) ||
    a.soil_class.toLowerCase().includes(search.toLowerCase()) ||
    a.soil_description.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!user) return;
    setDeleting(id);
    try {
      await deleteAnalysis(user.id, id);
      setAnalyses(list => list.filter(a => a.id !== id));
      addToast('Analysis deleted', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to delete analysis', 'error');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-4 lg:p-8 animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis History</h2>
        <p className="text-gray-500 mt-1">All your previous soil classification analyses</p>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, class..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
          className="btn-secondary flex items-center gap-2 text-sm py-2.5"
        >
          <Filter className="w-4 h-4" />
          Date {sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">{analyses.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Analyses</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{Math.round(analyses.reduce((s, a) => s + a.confidence, 0) / Math.max(1, analyses.length))}%</p>
          <p className="text-xs text-gray-500 mt-1">Avg. Confidence</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{new Set(analyses.map(a => a.soil_class)).size}</p>
          <p className="text-xs text-gray-500 mt-1">Unique Classes</p>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="w-8 h-8 border-2 border-navy-200 border-t-navy-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">{search ? 'No results found' : 'No analyses yet'}</p>
          <p className="text-gray-400 text-sm mt-1">{search ? 'Try a different search term' : 'Complete a soil classification to see history'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 dark:bg-navy-800 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-4">Sample</div>
            <div className="col-span-2">Class</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-1 text-center">Conf.</div>
            <div className="col-span-1 text-center">Date</div>
            <div className="col-span-1" />
          </div>
          <div className="divide-y divide-gray-50 dark:divide-navy-800">
            {filtered.map(a => (
              <div key={a.id}>
                <div
                  className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-navy-800 cursor-pointer transition-colors items-center"
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  <div className="col-span-10 sm:col-span-4 flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: SOIL_CLASS_COLORS[a.soil_class] ?? '#6b7280' }}
                    >
                      {a.soil_class}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{a.sample_name}</p>
                  </div>
                  <div className="hidden sm:block col-span-2">
                    <span
                      className="badge text-white text-xs"
                      style={{ backgroundColor: SOIL_CLASS_COLORS[a.soil_class] ?? '#6b7280' }}
                    >
                      {a.soil_class}
                    </span>
                  </div>
                  <div className="hidden sm:block col-span-3 text-sm text-gray-500 truncate">{a.soil_description}</div>
                  <div className="hidden sm:block col-span-1 text-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{a.confidence}%</span>
                  </div>
                  <div className="hidden sm:block col-span-1 text-center text-xs text-gray-400">
                    {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(a.id); }}
                      disabled={deleting === a.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      {deleting === a.id ? <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                    {expanded === a.id ? <ChevronUp className="w-4 h-4 text-gray-400 self-center" /> : <ChevronDown className="w-4 h-4 text-gray-400 self-center" />}
                  </div>
                </div>
                {expanded === a.id && (
                  <div className="px-5 py-4 bg-gray-50 dark:bg-navy-800 border-t border-gray-100 dark:border-navy-700 animate-slide-up">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div><p className="text-gray-400 text-xs mb-1">% Pass #200</p><p className="font-semibold text-gray-800 dark:text-white">{a.percent_passing_200}%</p></div>
                      <div><p className="text-gray-400 text-xs mb-1">% Pass #4</p><p className="font-semibold text-gray-800 dark:text-white">{a.percent_passing_4}%</p></div>
                      {a.liquid_limit && <div><p className="text-gray-400 text-xs mb-1">Liquid Limit</p><p className="font-semibold text-gray-800 dark:text-white">{a.liquid_limit}%</p></div>}
                      {a.plastic_limit && <div><p className="text-gray-400 text-xs mb-1">Plastic Limit</p><p className="font-semibold text-gray-800 dark:text-white">{a.plastic_limit}%</p></div>}
                      {a.plasticity_index && <div><p className="text-gray-400 text-xs mb-1">Plasticity Index</p><p className="font-semibold text-navy-700 dark:text-blue-400">{a.plasticity_index}</p></div>}
                      <div><p className="text-gray-400 text-xs mb-1">Treatment</p><p className="font-semibold text-gray-800 dark:text-white">{a.treatment}</p></div>
                      <div><p className="text-gray-400 text-xs mb-1">Date</p><p className="font-semibold text-gray-800 dark:text-white">{new Date(a.created_at).toLocaleString()}</p></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
