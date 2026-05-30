import { useState } from 'react';
import {
  ChevronRight, ChevronLeft, CheckCircle, FlaskConical, Info,
  Layers, BarChart3, Zap, Award, Save, RotateCcw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { createAnalysis } from '../lib/api';
import { classifySoil, SOIL_CLASS_COLORS, type ClassificationResult } from '../lib/soilClassification';

interface FormData {
  sampleName: string;
  percentPassing200: string;
  percentPassing4: string;
  liquidLimit: string;
  plasticLimit: string;
}

const STEPS = ['Grain Size', 'Atterberg Limits', 'Results'];

export default function ClassificationPage() {
  const { user } = useAuth();
  const { addToast, setCurrentPage, setLastAnalysisId } = useApp();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [form, setForm] = useState<FormData>({
    sampleName: '', percentPassing200: '', percentPassing4: '',
    liquidLimit: '', plasticLimit: '',
  });

  const p200 = parseFloat(form.percentPassing200);
  const p4 = parseFloat(form.percentPassing4);
  const ll = parseFloat(form.liquidLimit) || 0;
  const pl = parseFloat(form.plasticLimit) || 0;
  const pi = ll && pl ? ll - pl : null;
  const isFineGrained = !isNaN(p200) && p200 > 50;

  function update(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function validate(stepIdx: number): boolean {
    if (stepIdx === 0) {
      if (isNaN(p200) || p200 < 0 || p200 > 100) return false;
      if (isNaN(p4) || p4 < 0 || p4 > 100) return false;
      if (p200 > p4) return false;
      return true;
    }
    if (stepIdx === 1) {
      if (isFineGrained) {
        if (!ll || !pl) return false;
        if (ll < pl) return false;
      }
      return true;
    }
    return true;
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1800));
    const classification = classifySoil({
      percentPassing200: p200,
      percentPassing4: p4,
      liquidLimit: ll || undefined,
      plasticLimit: pl || undefined,
    });
    setResult(classification);
    setStep(2);
    setAnalyzing(false);
  }

  async function handleSave() {
    if (!result || !user) return;
    setSaving(true);
    try {
      const data = await createAnalysis(user.id, {
        sample_name: form.sampleName || 'Unnamed Sample',
        percent_passing_200: p200,
        percent_passing_4: p4,
        liquid_limit: ll || null,
        plastic_limit: pl || null,
        plasticity_index: pi,
        soil_class: result.soilClass,
        soil_description: result.soilDescription,
        plasticity_level: result.plasticityLevel,
        confidence: result.confidence,
        treatment: result.treatment,
        notes: '',
      });
      setSaved(true);
      if (data?.id) setLastAnalysisId(data.id);
      addToast('Analysis saved successfully!', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to save analysis', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setStep(0);
    setResult(null);
    setSaved(false);
    setForm({ sampleName: '', percentPassing200: '', percentPassing4: '', liquidLimit: '', plasticLimit: '' });
  }

  return (
    <div className="p-4 lg:p-8 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Soil Classification</h2>
        <p className="text-gray-500 mt-1">Enter laboratory test data to classify soil using USCS</p>
      </div>

      {/* Progress */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'gradient-navy text-white shadow-glow-navy' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <p className={`text-xs mt-2 font-medium hidden sm:block ${i === step ? 'text-navy-700 dark:text-blue-400' : 'text-gray-400'}`}>{s}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-3 rounded transition-all duration-300 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      {step === 0 && (
        <div className="space-y-6 animate-slide-up">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gradient-navy rounded-xl flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Sample Information</h3>
                <p className="text-sm text-gray-500">Optional: name your sample</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Sample name (e.g., Borehole BH-01, Site A)"
              value={form.sampleName}
              onChange={e => update('sampleName', e.target.value)}
              className="input-field"
            />
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Step 1 — Grain Size Distribution</h3>
                <p className="text-sm text-gray-500">Sieve analysis results from laboratory testing</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    % Passing Sieve No. 200
                  </label>
                  <Tooltip text="Percentage of soil passing through the #200 sieve (0.075mm). Values >50% indicate fine-grained soil." />
                </div>
                <div className="relative">
                  <input
                    type="number" min="0" max="100" step="0.1"
                    placeholder="e.g., 65.0"
                    value={form.percentPassing200}
                    onChange={e => update('percentPassing200', e.target.value)}
                    className="input-field pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Range: 0–100%. Fine-grained if &gt;50%</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    % Passing Sieve No. 4
                  </label>
                  <Tooltip text="Percentage of soil passing through the #4 sieve (4.75mm). Separates gravel from sand." />
                </div>
                <div className="relative">
                  <input
                    type="number" min="0" max="100" step="0.1"
                    placeholder="e.g., 90.0"
                    value={form.percentPassing4}
                    onChange={e => update('percentPassing4', e.target.value)}
                    className="input-field pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Must be ≥ No. 200 value</p>
              </div>
            </div>

            {!isNaN(p200) && !isNaN(p4) && p200 >= 0 && p4 >= 0 && (
              <div className="mt-5 bg-blue-50 dark:bg-navy-800 rounded-xl p-4 border border-blue-100 dark:border-navy-700">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3">Composition Preview</p>
                <div className="flex h-6 rounded-lg overflow-hidden">
                  <div className="bg-gray-400 transition-all" style={{ width: `${Math.max(0, 100 - p4)}%` }} title="Gravel" />
                  <div className="bg-amber-500 transition-all" style={{ width: `${Math.max(0, p4 - p200)}%` }} title="Sand" />
                  <div className="bg-blue-500 transition-all" style={{ width: `${Math.max(0, p200)}%` }} title="Silt/Clay" />
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-400 inline-block" />Gravel {Math.round(100 - p4)}%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" />Sand {Math.round(p4 - p200)}%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500 inline-block" />Silt/Clay {Math.round(p200)}%</span>
                </div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-2">
                  → {p200 > 50 ? 'Fine-grained soil (Atterberg limits required)' : 'Coarse-grained soil'}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              disabled={!validate(0)}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Atterberg Limits <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6 animate-slide-up">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Step 2 — Atterberg Limits</h3>
                <p className="text-sm text-gray-500">
                  {isFineGrained ? 'Required for fine-grained soil classification' : 'Optional for coarse-grained soils'}
                </p>
              </div>
              {!isFineGrained && (
                <span className="ml-auto badge bg-amber-50 text-amber-700">Optional</span>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Liquid Limit (LL)</label>
                  <Tooltip text="The water content at which soil transitions from plastic to liquid state. Determined by Casagrande cup test." />
                </div>
                <div className="relative">
                  <input
                    type="number" min="0" max="200" step="0.1"
                    placeholder="e.g., 45"
                    value={form.liquidLimit}
                    onChange={e => update('liquidLimit', e.target.value)}
                    className="input-field pr-10"
                    required={isFineGrained}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Plastic Limit (PL)</label>
                  <Tooltip text="The water content at which soil transitions from semi-solid to plastic state. Determined by rolling thread test." />
                </div>
                <div className="relative">
                  <input
                    type="number" min="0" max="200" step="0.1"
                    placeholder="e.g., 22"
                    value={form.plasticLimit}
                    onChange={e => update('plasticLimit', e.target.value)}
                    className="input-field pr-10"
                    required={isFineGrained}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            </div>

            {pi !== null && (
              <div className="mt-6 bg-navy-50 dark:bg-navy-800 rounded-2xl p-5 border border-navy-100 dark:border-navy-700">
                <p className="text-xs font-semibold text-navy-600 dark:text-navy-300 uppercase tracking-wide mb-3">Plasticity Index (Calculated)</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-mono">
                    <span>PI</span>
                    <span>=</span>
                    <span className="bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 px-2 py-1 rounded-lg">LL</span>
                    <span>−</span>
                    <span className="bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 px-2 py-1 rounded-lg">PL</span>
                    <span>=</span>
                    <span className="bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 px-2 py-1 rounded-lg text-blue-500 font-mono">{ll}</span>
                    <span>−</span>
                    <span className="bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 px-2 py-1 rounded-lg text-blue-500 font-mono">{pl}</span>
                  </div>
                  <div className="ml-auto">
                    <div className="bg-navy-700 text-white text-2xl font-bold px-5 py-3 rounded-xl shadow-glow-navy text-center min-w-[80px]">
                      {pi.toFixed(1)}
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-1">PI value</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <PIBar pi={pi} />
                </div>
              </div>
            )}

            {isFineGrained && ll && pl && ll < pl && (
              <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2 text-red-600 text-sm">
                <Info className="w-4 h-4 flex-shrink-0" />
                LL must be greater than PL. Please verify your values.
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!validate(1) || analyzing}
              className="btn-primary flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Soil
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div className="space-y-6 animate-slide-up">
          {/* Main result */}
          <div className="card overflow-hidden">
            <div className="h-2 w-full" style={{ backgroundColor: SOIL_CLASS_COLORS[result.soilClass] ?? '#6b7280' }} />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg"
                    style={{ backgroundColor: SOIL_CLASS_COLORS[result.soilClass] ?? '#6b7280' }}
                  >
                    {result.soilClass}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{result.soilDescription}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge bg-blue-50 text-blue-700">{result.plasticityLevel}</span>
                      <span className="badge bg-green-50 text-green-700 flex items-center gap-1">
                        <Award className="w-3 h-3" /> {result.confidence}% confidence
                      </span>
                      <span className="badge bg-gray-100 text-gray-600">USCS Class</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!saved ? (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60"
                    >
                      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Result
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                      <CheckCircle className="w-4 h-4" /> Saved
                    </span>
                  )}
                  <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm">
                    <RotateCcw className="w-4 h-4" /> New Analysis
                  </button>
                </div>
              </div>

              {/* Input Summary */}
              <div className="mt-6 bg-gray-50 dark:bg-navy-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Input Summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div><p className="text-gray-400 text-xs">% Pass #200</p><p className="font-semibold text-gray-800 dark:text-white">{p200}%</p></div>
                  <div><p className="text-gray-400 text-xs">% Pass #4</p><p className="font-semibold text-gray-800 dark:text-white">{p4}%</p></div>
                  {ll > 0 && <div><p className="text-gray-400 text-xs">Liquid Limit</p><p className="font-semibold text-gray-800 dark:text-white">{ll}%</p></div>}
                  {pl > 0 && <div><p className="text-gray-400 text-xs">Plastic Limit</p><p className="font-semibold text-gray-800 dark:text-white">{pl}%</p></div>}
                  {pi !== null && <div><p className="text-gray-400 text-xs">PI (Calc.)</p><p className="font-semibold text-navy-700 dark:text-blue-400">{pi.toFixed(1)}</p></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Engineering Characteristics */}
          <div className="card p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-navy-600" /> Engineering Characteristics
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {result.engineeringCharacteristics.map((c, i) => (
                <div key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-navy-800 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{c}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment preview */}
          <div className="card p-6 bg-navy-50 dark:bg-navy-800 border-navy-100 dark:border-navy-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-navy-600 dark:text-navy-300 uppercase tracking-wide mb-1">Recommended Treatment</p>
                <p className="text-xl font-bold text-navy-800 dark:text-white">{result.treatment}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{result.treatmentDetails.constructionSuitability}</p>
              </div>
              <button
                onClick={() => setCurrentPage('treatment')}
                className="btn-primary text-sm flex items-center gap-2"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

function PIBar({ pi }: { pi: number }) {
  const max = 60;
  const width = Math.min(100, (pi / max) * 100);
  const color = pi < 7 ? '#22c55e' : pi < 20 ? '#f59e0b' : pi < 40 ? '#ef4444' : '#7c3aed';
  const label = pi < 7 ? 'Low' : pi < 20 ? 'Medium' : pi < 40 ? 'High' : 'Very High';
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Plasticity: <strong style={{ color }}>{label}</strong></span>
        <span>PI = {pi.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
