import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAccent } from '../context/AccentContext';
import { useNeonAuth } from '../context/NeonAuthContext';
import { EchoraLogo } from './EchoraLogo';

export interface NeonAuthCardProps {
  defaultMode?: 'signin' | 'signup';
  onSuccess?: () => void;
  onGuestAccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const NeonAuthCard: React.FC<NeonAuthCardProps> = ({
  defaultMode = 'signin',
  onSuccess,
  onGuestAccess,
  isModal = false,
  onClose,
}) => {
  const { accentHex } = useAccent();
  const { signIn, signUp, signInWithGoogle } = useNeonAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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
        setSuccessMsg('Account created successfully!');
      } else {
        const res = await signIn({
          email: trimmedEmail,
          password,
        });
        if (res.error) {
          setErrorMsg(res.error.message || 'Invalid email or password.');
          return;
        }
        setSuccessMsg('Signed in successfully!');
      }

      // Small delay for smooth feedback, then notify caller
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else if (onClose) {
          onClose();
        }
      }, 350);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to initialize Google sign-in');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-sm sm:max-w-md mx-auto p-6 sm:p-8 rounded-2xl bg-[#303841] border border-white/10 shadow-2xl relative select-none transition-all ${
        isModal ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]' : ''
      }`}
    >
      {/* Optional Close Button for Modal */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Header / Brand */}
      <div className="flex flex-col items-center text-center space-y-2 mb-6">
        <EchoraLogo size="sm" />

        <div className="pt-1">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {authMode === 'signin' ? 'Sign in to Echora' : 'Create your account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
            {authMode === 'signin'
              ? 'Welcome back! Please enter your details'
              : 'Sign up with email to unlock cloud sync across all your devices'}
          </p>
        </div>
      </div>

      {/* Social Provider (Google via Neon Better Auth) */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full h-11 rounded-xl bg-[#3A4750] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-300" />
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#303841] px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 absolute">
            or
          </span>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span className="flex-1 text-left">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span className="flex-1 text-left">{successMsg}</span>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {authMode === 'signup' && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#3A4750] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#2185D5] transition-all"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="email"
              required
              autoCapitalize="none"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#3A4750] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#2185D5] transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300">Password</label>
            {authMode === 'signin' && (
              <span className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer">
                Forgot password?
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#3A4750] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#2185D5] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {authMode === 'signup' && (
            <p className="text-[11px] text-zinc-400 pt-0.5">
              Must be at least 8 characters long
            </p>
          )}
        </div>

        {authMode === 'signin' && (
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-[#3A4750] border-white/10 text-[#2185D5] focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
              />
              <span>Remember this device</span>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
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
      <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 pt-5 border-t border-white/10 mt-5">
        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setSuccessMsg(null);
            setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
          }}
          className="hover:text-white underline underline-offset-4 transition-colors cursor-pointer font-medium"
        >
          {authMode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>

        <span>•</span>

        <button
          type="button"
          onClick={() => {
            if (onGuestAccess) {
              onGuestAccess();
            } else if (onSuccess) {
              onSuccess();
            } else if (onClose) {
              onClose();
            }
          }}
          className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer font-medium text-amber-300 hover:text-amber-200"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Guest Access</span>
        </button>
      </div>

      {/* Security Footer Attribution */}
      <div className="text-center text-[10px] text-zinc-500 pt-4">
        Secured by{' '}
        <a
          href="https://neon.com/docs/auth/overview"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-zinc-400 underline underline-offset-2 hover:text-[#2185D5]"
        >
          Neon Managed Better Auth
        </a>
      </div>
    </div>
  );
};
