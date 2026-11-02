import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Calendar,
  Key,
  LogOut,
  ArrowLeftRight,
  ShieldCheck,
  Check,
  Copy,
} from 'lucide-react';
import { useNeonAuth } from '../context/NeonAuthContext';
import { useAccent } from '../context/AccentContext';

export const NeonUserProfileModal: React.FC = () => {
  const { isUserProfileOpen, closeUserProfile, user, signOut, openSignIn } = useNeonAuth();
  const { accentHex } = useAccent();
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (!isUserProfileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeUserProfile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUserProfileOpen, closeUserProfile]);

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (!user && isUserProfileOpen) {
    // If not signed in and profile opened, switch to sign in
    return null;
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recent Member';

  return (
    <AnimatePresence>
      {isUserProfileOpen && user && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeUserProfile}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-md my-auto rounded-2xl bg-[#303841] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-7 text-white select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeUserProfile}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-white/10">
              <div className="relative">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name || 'User'}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                  />
                ) : (
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg border-2 border-white/20"
                    style={{ backgroundColor: accentHex || '#2185D5' }}
                  >
                    {initials}
                  </div>
                )}
                <span
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#303841]"
                  title="Active Session"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    {user.name || user.fullName || 'Echora User'}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" />
                    Better Auth Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information Details */}
            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-xl bg-[#3A4750]/60 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Key className="h-3.5 w-3.5 text-zinc-400" /> User Identifier
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedId ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-[11px] text-zinc-300 bg-black/30 p-2 rounded-lg truncate select-all">
                  {user.id}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#3A4750]/60 border border-white/10 text-xs">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Member Since
                </span>
                <span className="text-zinc-400 font-medium">{memberSince}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  closeUserProfile();
                  openSignIn({ mode: 'signin' });
                }}
                className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-[#2185D5]" />
                <span>Switch / Add Another Account</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  closeUserProfile();
                }}
                className="w-full h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-zinc-500 pt-4">
              Managed by{' '}
              <a
                href="https://neon.com/docs/auth/overview"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white underline underline-offset-2"
              >
                Neon Cloud Database & Better Auth
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
