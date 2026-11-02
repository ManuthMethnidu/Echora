import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { EchoraLogo } from './EchoraLogo';
import { NeonAuthCard } from './NeonAuthCard';

interface LoginViewProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack, onSuccess }) => {

  return (
    <div className="min-h-screen w-full bg-[#303841] text-[#F3F3F3] grid lg:grid-cols-2 select-none">
      {/* Left Column: Authentic shadcn login-02 Form Structure */}
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

        {/* Center: Neon Authentication Form Card */}
        <div className="mx-auto w-full max-w-sm sm:max-w-md py-6 flex flex-col items-center justify-center">
          <NeonAuthCard
            defaultMode="signin"
            isModal={false}
            onSuccess={onSuccess || onBack}
            onGuestAccess={onSuccess || onBack}
          />
        </div>

        {/* Footer: Legal Disclaimer */}
        <div className="text-center text-[11px] text-zinc-400 pt-6">
          Protected by{' '}
          <a
            href="https://neon.com/docs/auth/overview"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white underline underline-offset-4 hover:text-[#2185D5]"
          >
            Neon Auth
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

      {/* Right Column: Hero Cinematic Artwork (shadcn login-02 pattern) */}
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
