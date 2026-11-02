import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAccent } from '../context/AccentContext';
import { useNeonAuth } from '../context/NeonAuthContext';
import { EchoraLogo } from './EchoraLogo';

interface LoginViewProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack, onSuccess }) => {
  const { accentHex } = useAccent();
  const { signIn, signUp } = useNeonAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }
    if (authMode === 'signup' && password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      if (authMode === 'signup') {
        const res = await signUp({
          email: trimmedEmail,
          password,
          name: name.trim() || trimmedEmail.split('@')[0],
        });
        if (res.error) {
          setErrorMsg(res.error.message || 'Sign up failed. Please check your credentials.');
          return;
        }
      } else {
        const res = await signIn({
          email: trimmedEmail,
          password,
        });
        if (res.error) {
          setErrorMsg(res.error.message || 'Invalid email or password.');
          return;
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#303841] text-[#F3F3F3] grid lg:grid-cols-2 select-none">
      {/* Left Column: Authentic Neon Managed Better Auth Form Structure */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative z-10">
        {/* Top Header: Brand & Back to Browse */}
        <div className="flex items-center justify-between">
          <EchoraLogo size="md" />

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Browse</span>
          </button>
        </div>

        {/* Center: Neon Auth Form */}
        <div className="mx-auto w-full max-w-sm sm:max-w-md py-6 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center space-y-5">
            {/* Header Title */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p className="text-xs text-zinc-400">
                {authMode === 'signin'
                  ? 'Sign in to access your synchronized watchlist and history'
                  : 'Sign up with email to unlock cloud sync across all devices'}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="w-full p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span className="flex-1 text-left">{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-3.5">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-9.5 pr-3.5 rounded-xl bg-[#3A4750] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#2185D5] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-9.5 pr-3.5 rounded-xl bg-[#3A4750] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#2185D5] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Password</label>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-9.5 pr-3.5 rounded-xl bg-[#3A4750] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#2185D5] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                style={{ backgroundColor: accentHex || '#2185D5' }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Mode Toggle & Guest Action */}
            <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                }}
                className="hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                {authMode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  if (onSuccess) onSuccess();
                  else onBack();
                }}
                className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Guest Access</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Legal & Security Disclaimer */}
        <div className="text-center text-[11px] text-zinc-400 pt-6">
          Secured by{' '}
          <a
            href="https://neon.com/docs/auth/overview"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white underline underline-offset-4 hover:text-[#2185D5]"
          >
            Neon Managed Better Auth
          </a>
          . By continuing, you agree to our{' '}
          <a href="#" className="underline underline-offset-4 hover:text-white">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-4 hover:text-white">
            Privacy
          </a>
          .
        </div>
      </div>

      {/* Right Column: Hero Cinematic Artwork */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#1f252b]">
        {/* Cinematic Backdrop Image with Contrast & Vignette */}
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"
          alt="Echora Cinematic Experience"
          className="absolute inset-0 h-full w-full object-cover filter brightness-[0.45] contrast-[1.1] scale-105 transform hover:scale-100 transition-transform duration-1000"
        />

        {/* Multi-layered Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#303841] via-transparent to-[#303841]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#303841] via-transparent to-transparent" />

        {/* Top Floating Badge */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lg">
            Ultra-Crisp 4K HDR Streaming
          </span>
        </div>

        {/* Bottom Floating Cinema Quote Glass Card */}
        <div className="relative z-10 max-w-lg rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 p-6 shadow-2xl">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium text-white italic leading-relaxed">
              &ldquo;Cinema is a mirror by which we often see ourselves. It doesn&apos;t have a flag or a border or a passport.&rdquo;
            </p>
            <footer className="text-xs font-semibold text-zinc-400 pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-white">Echora Premium Streaming Engine</span>
              <span className="font-mono text-[10px] tracking-wider text-zinc-400">100% AD-FREE</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
