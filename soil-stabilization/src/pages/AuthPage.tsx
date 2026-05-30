import { useState } from 'react';
import { Eye, EyeOff, FlaskConical, ArrowRight, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

type Mode = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const { signIn, signUp, resetPassword } = useAuth();
  const { addToast } = useApp();

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'forgot') {
      const { error } = await resetPassword(form.email);
      if (error) setError(error);
      else setForgotSent(true);
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      if (!form.fullName.trim()) { setError('Full name is required'); setLoading(false); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match'); setLoading(false); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      const { error } = await signUp(form.email, form.password, form.fullName);
      if (error) setError(error);
      else addToast('Account created successfully! Please sign in.', 'success');
      setLoading(false);
      return;
    }

    const { error } = await signIn(form.email, form.password);
    if (error) setError('Invalid email or password');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex soil-texture bg-slate-50">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-navy relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="600" height="600" fill="url(#grid)" />
          </svg>
        </div>
        {/* Soil layers illustration */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <div className="h-12 bg-amber-300" style={{clipPath: 'polygon(0 20%, 100% 0%, 100% 100%, 0% 100%)'}} />
          <div className="h-16 bg-amber-600" style={{clipPath: 'polygon(0 10%, 100% 0%, 100% 100%, 0% 100%)'}} />
          <div className="h-20 bg-stone-700" style={{clipPath: 'polygon(0 5%, 100% 15%, 100% 100%, 0% 100%)'}} />
          <div className="h-16 bg-stone-900" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest">Digital</p>
              <p className="text-white font-bold text-lg leading-none">Geo Classifier</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Advanced Soil<br/>Classification<br/>Platform
          </h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">
            Powered by the Unified Soil Classification System — bringing laboratory precision to digital engineering.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'System Accuracy', value: '96%' },
              { label: 'Soil Types', value: '15+' },
              { label: 'Treatment Methods', value: '8' },
              { label: 'Processing Time', value: '~8s' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-blue-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-blue-200 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>USCS Standard Compliant · ISO 14688</span>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 gradient-navy rounded-xl flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-navy-800 text-lg">Digital Geo Classifier</p>
          </div>

          <div className="card p-8 shadow-card-hover">
            {mode === 'forgot' ? (
              <ForgotForm
                forgotSent={forgotSent}
                email={form.email}
                loading={loading}
                error={error}
                onChange={v => update('email', v)}
                onSubmit={handleSubmit}
                onBack={() => { setMode('login'); setForgotSent(false); setError(''); }}
              />
            ) : (
              <>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
                  {(['login', 'register'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(''); }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                        mode === m
                          ? 'bg-white text-navy-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {m === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <InputField
                      icon={<User className="w-4 h-4" />}
                      type="text"
                      placeholder="Full Name"
                      value={form.fullName}
                      onChange={v => update('fullName', v)}
                      required
                    />
                  )}
                  <InputField
                    icon={<Mail className="w-4 h-4" />}
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={v => update('email', v)}
                    required
                  />
                  <div className="relative">
                    <InputField
                      icon={<Lock className="w-4 h-4" />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={form.password}
                      onChange={v => update('password', v)}
                      required
                      rightElement={
                        <button type="button" onClick={() => setShowPassword(s => !s)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  </div>
                  {mode === 'register' && (
                    <InputField
                      icon={<Lock className="w-4 h-4" />}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={form.confirm}
                      onChange={v => update('confirm', v)}
                      required
                      rightElement={
                        <button type="button" onClick={() => setShowConfirm(s => !s)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  )}
                  {mode === 'login' && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={e => setRemember(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                        />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(''); }}
                        className="text-navy-600 hover:text-navy-800 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                      <XCircleIcon />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.<br/>
            Digital Geo Classifier — USCS Standard
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon, type, placeholder, value, onChange, required, rightElement
}: {
  icon: React.ReactNode; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; rightElement?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="input-field pl-11 pr-11"
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
  );
}

function ForgotForm({
  forgotSent, email, loading, error, onChange, onSubmit, onBack
}: {
  forgotSent: boolean; email: string; loading: boolean; error: string;
  onChange: (v: string) => void; onSubmit: (e: React.FormEvent) => void; onBack: () => void;
}) {
  if (forgotSent) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
        <p className="text-gray-500 mb-6">We sent a password reset link to <strong>{email}</strong></p>
        <button onClick={onBack} className="btn-secondary w-full">Back to Sign In</button>
      </div>
    );
  }
  return (
    <>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
      <p className="text-gray-500 mb-6 text-sm">Enter your email to receive a reset link.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4" /></div>
          <input
            type="email" placeholder="Email Address" value={email}
            onChange={e => onChange(e.target.value)} required
            className="input-field pl-11"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
        </button>
        <button type="button" onClick={onBack} className="w-full btn-secondary">Back to Sign In</button>
      </form>
    </>
  );
}

function XCircleIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
