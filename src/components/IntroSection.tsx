/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { FlickeringCandle } from './LuxuryAestheticOverlays';

interface IntroSectionProps {
  onComplete: () => void;
}

export default function IntroSection({ onComplete }: IntroSectionProps) {
  const [step, setStep] = useState(0);

  // Sequence steps:
  // 0: First sentence
  // 1: Second sentence
  // 2: Third sentence + Button
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 3800);
    const t2 = setTimeout(() => setStep(2), 7800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Soft glowing background particles helper
  const particles = Array.from({ length: 48 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 10}s`,
    size: Math.random() * 3 + 1,
  }));

  return (
    <div
      id="intro-cinematic-screen"
      className="relative w-full h-screen bg-[#0A0502] flex flex-col items-center justify-center overflow-hidden px-6 selection:bg-[#C5A059]/30 select-none"
    >
      {/* Subtle vignettes and glowing colors resembling Dior/Netflix style */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#0A0502] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0A0502] to-transparent pointer-events-none" />

      {/* Star Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#E6D5B8] animate-drift opacity-0 filter blur-[0.4px]"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Decorative luxury logo header (Cartier/Dior style monogram feel) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute top-12 flex flex-col items-center gap-1 text-[#C5A059]"
      >
        <span className="font-display tracking-[0.4em] text-xs font-light text-[#E6D5B8]">XX</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#C5A059] to-transparent" />
      </motion.div>

      {/* Animated Cinematic Statements container */}
      <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center justify-center min-h-[220px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.p
              key="text-1"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
              className="font-serif italic text-2xl md:text-3xl text-gold-100 font-light leading-relaxed tracking-wide"
            >
              « Il y a vingt ans, mon Trésor, une lumière pure nommée Kai est née... »
            </motion.p>
          )}

          {step === 1 && (
            <motion.p
              key="text-2"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
              className="font-serif italic text-2xl md:text-3xl text-[#D4A5A5] font-light leading-relaxed tracking-wide"
            >
              « Une lumière si douce et radieuse, capable d’émerveiller quiconque croise ton chemin, ma belle Kayoo. »
            </motion.p>
          )}

          {step === 2 && (
            <motion.div
              key="text-3"
              className="flex flex-col items-center gap-10"
            >
              <motion.p
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="font-serif italic text-3xl md:text-4xl text-[#C5A059] font-light leading-relaxed tracking-wide shadow-gold-text"
              >
                « Aujourd'hui, ma Fanm vim, cette lumière illumine ma vie tout entière. »
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-4"
              >
                <button
                  onClick={onComplete}
                  className="relative px-12 py-4 rounded-full border border-[#C5A059] group overflow-hidden bg-transparent cursor-pointer transition-all duration-500 hover:border-[#E6D5B8] shadow-xl"
                >
                  {/* Elegant button shimmering hover effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/20 via-[#E6D5B8]/30 to-[#C5A059]/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  
                  <span className="relative flex items-center justify-center gap-3 font-display tracking-[0.25em] text-xs font-semibold text-[#E6D5B8] group-hover:text-[#F7E7CE] uppercase transition-colors">
                    Commencer l'expérience
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                  </span>
                </button>
                
                <p className="text-[11px] font-display text-[#C5A059]/70 tracking-wider">
                  ( Activez le contenu audio pour une immersion totale )
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Realistic flickering romance candles in bottom corners */}
      <div className="absolute bottom-6 left-8 z-20 flex gap-3 items-end opacity-90 sm:opacity-100 scale-75 sm:scale-100 origin-bottom-left">
        <FlickeringCandle size="sm" delay={0.2} />
        <FlickeringCandle size="md" delay={0.8} />
      </div>

      <div className="absolute bottom-6 right-8 z-20 flex gap-3 items-end opacity-90 sm:opacity-100 scale-75 sm:scale-100 origin-bottom-right">
        <FlickeringCandle size="sm" delay={1.1} />
        <FlickeringCandle size="lg" delay={0.3} />
      </div>

      {/* Subtle luxury brand footer details */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute bottom-8 font-serif text-[11px] text-stone-500 tracking-[0.3em] uppercase flex items-center gap-2 z-10"
      >
        <span>Une histoire sacrée</span>
        <Heart className="w-2.5 h-2.5 fill-[#C5A059]/50 stroke-none" />
        <span>Vingt Ans D'Éclat</span>
      </motion.p>
    </div>
  );
}
