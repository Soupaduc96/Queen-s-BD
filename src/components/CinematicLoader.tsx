import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Gift } from 'lucide-react';
import { FlickeringCandle } from './LuxuryAestheticOverlays';

interface CinematicLoaderProps {
  onOpen: () => void;
}

export default function CinematicLoader({ onOpen }: CinematicLoaderProps) {
  const [textStep, setTextStep] = useState(0);
  const [boxState, setBoxState] = useState<'closed' | 'opening' | 'opened'>('closed');

  // Auto-progressing text steps
  useEffect(() => {
    // 0: "Pour Kai..." -> shows up for 3 seconds then fades out
    // 1: "Créé avec amour." -> shows up at 4.2 seconds, stays, fades out at 7.2
    // 2: "Une expérience unique t'attend." -> shows up at 8.4 seconds along with the luxury gift box
    const timer1 = setTimeout(() => setTextStep(1), 4000);
    const timer2 = setTimeout(() => setTextStep(2), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleOpenGiftBox = () => {
    setBoxState('opening');
    
    // Play system audio on client gesture frame to trigger HTML5/Youtube autoplay correctly
    if (typeof (window as any).playSystemAudio === 'function') {
      try {
        (window as any).playSystemAudio();
      } catch (err) {
        console.warn("Autoplay bypass failure inside loader gesture:", err);
      }
    }

    setTimeout(() => {
      setBoxState('opened');
      onOpen();
    }, 1800); // Wait for the splits sliding animation to complete
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-[#0A0502] overflow-hidden select-none">
      
      {/* Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(28,18,12,0.4)_0%,rgba(10,5,2,0.95)_100%)] pointer-events-none" />

      {/* Atmospheric candle glow overlay */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-amber-500/5 filter blur-[100px] mix-blend-screen pointer-events-none transition-all duration-[2000s]"
        style={{ transform: `translate(-50%, -50%) scale(${textStep === 2 ? 1.4 : 1.0})` }}
      />

      {/* Cinematic Golden Border frame */}
      <div className="absolute inset-4 sm:inset-6 border border-[#C5A059]/15 pointer-events-none z-10 transition-opacity duration-1000">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C5A059]/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#C5A059]/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#C5A059]/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C5A059]/40" />
      </div>

      {/* Split Panels simulating luxury gift box cardboard lid slide-away */}
      <AnimatePresence>
        {boxState === 'opening' && (
          <>
            {/* Top flap sliding up */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: '-100%' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 left-0 right-0 h-1/2 bg-[#0A0502] border-b border-[#C5A059]/20 z-40 pointer-events-none"
            />
            {/* Bottom flap sliding down */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: '100%' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0A0502] border-t border-[#C5A059]/20 z-40 pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {/* Core Cinematic text and box interactions container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 z-20">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: "Pour Kai..." */}
          {textStep === 0 && (
            <motion.div
              key="loader-pour-kai"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="font-serif italic text-3xl sm:text-5xl tracking-[0.1em] font-light text-[#F7E7CE] leading-relaxed">
                Pour Kai...
              </p>
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
                <p className="font-display tracking-[0.3em] text-[9px] uppercase text-[#C5A059]/70">
                  Un Trésor Unique
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 1: "Créé avec amour." */}
          {textStep === 1 && (
            <motion.div
              key="loader-cree-amour"
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="flex justify-center mb-6 text-[#D4A5A5]">
                <Heart className="w-6 h-6 animate-pulse fill-[#D4A5A5]/20" />
              </div>
              <p className="font-serif italic text-3xl sm:text-5xl tracking-[0.05em] font-light text-[#F7E7CE]">
                Créé avec amour.
              </p>
              <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#C5A059] mt-6">
                Chaque détail est une dévotion.
              </p>
            </motion.div>
          )}

          {/* STEP 2: "Une expérience unique t'attend." -> Interactive Box Interaction! */}
          {textStep === 2 && boxState === 'closed' && (
            <motion.div
              key="loader-explore"
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center max-w-lg w-full text-center"
            >
              {/* Gold Ribbon Label */}
              <div className="flex items-center gap-2.5 text-[#C5A059] mb-4">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-display tracking-[0.35em] text-[10px] font-bold uppercase text-[#D4A5A5]">
                  Vingt Ans d'Éclat
                </span>
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>

              {/* Main Heading Text */}
              <h2 className="font-serif italic text-3xl sm:text-5xl font-light text-[#F7E7CE] leading-[1.2] px-4">
                Une expérience unique t'attend.
              </h2>
              
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent my-6" />

              {/* Interactive Luxury Gift Box Element */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenGiftBox}
                className="relative mt-4 cursor-pointer group flex flex-col items-center"
              >
                {/* Radiant luxury halo backglow */}
                <div className="absolute inset-0 bg-[#C5A059]/10 filter blur-2xl rounded-full scale-125 opacity-70 group-hover:bg-[#C5A059]/15 duration-500" />

                {/* Simulated Luxury Gift Box card container */}
                <div className="relative w-72 p-8 rounded-2xl border border-[#C5A059]/35 bg-gradient-to-b from-[#1C120B]/95 to-[#0A0502]/95 shadow-2xl space-y-5 transition-colors group-hover:border-[#C5A059]/60">
                  {/* Glowing wax seal decoration */}
                  <div className="mx-auto w-14 h-14 rounded-full border border-[#C5A059]/40 bg-gradient-to-br from-[#2D1B11] to-[#120B06] flex items-center justify-center shadow-lg relative group-hover:border-[#F7E7CE]/60">
                    <div className="absolute inset-[3px] rounded-full border border-[#C5A059]/10 animate-spin-slow duration-[15s]" />
                    <Gift className="w-5.5 h-5.5 text-[#C5A059] group-hover:text-[#F7E7CE] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="font-serif text-[15px] font-semibold text-[#F7E7CE] group-hover:text-amber-100 duration-300">
                      Ouvrir le coffret de luxe
                    </p>
                    <p className="font-display tracking-[0.2em] text-[8.5px] uppercase text-[#C5A059]/75 group-hover:text-[#C5A059] duration-300">
                      Cliquer pour déballer le cadeau
                    </p>
                  </div>

                  <div className="border-t border-[#C5A059]/15 pt-3 flex.justify-center">
                    <p className="text-[10px] text-stone-400 font-mono tracking-wider italic">
                      ♪ James Arthur - Say You Won't Let Go
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Candle layout underneath box for glorious bottom light */}
              <div className="mt-10 flex gap-4 items-end opacity-80 scale-90">
                <FlickeringCandle size="sm" delay={0.4} />
                <FlickeringCandle size="md" delay={1.2} />
                <FlickeringCandle size="sm" delay={0.7} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Decorative Brand Monograms in absolute corner margins */}
      <div className="absolute top-8 left-8 text-[9px] font-mono tracking-[0.3em] uppercase text-stone-600 pointer-events-none">
        KAI • XX
      </div>
      <div className="absolute top-8 right-8 text-[9px] font-mono tracking-[0.3em] uppercase text-stone-600 pointer-events-none animate-pulse">
        LUMIÈRE ÉTERNELLE
      </div>
    </div>
  );
}
