import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeonAuth } from '../context/NeonAuthContext';
import { NeonAuthCard } from './NeonAuthCard';

export const NeonAuthModal: React.FC = () => {
  const { isSignInOpen, signInMode, closeSignIn } = useNeonAuth();

  useEffect(() => {
    if (!isSignInOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSignIn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSignInOpen, closeSignIn]);

  return (
    <AnimatePresence>
      {isSignInOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSignIn}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-sm sm:max-w-md my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <NeonAuthCard
              defaultMode={signInMode}
              isModal={true}
              onClose={closeSignIn}
              onSuccess={closeSignIn}
              onGuestAccess={closeSignIn}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
