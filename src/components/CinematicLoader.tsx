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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Performance-optimized Canvas for exclusive loader rose petals & golden sparkles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle seeds
    interface GoldenSparkle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulseSpeed: number;
      angle: number;
    }

    interface RosePetal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      spin: number;
      opacity: number;
    }

    const sparkles: GoldenSparkle[] = [];
    const maxSparkles = 60;
    const petals: RosePetal[] = [];
    const maxPetals = 35;

    for (let i = 0; i < maxSparkles; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1), // Float upwards
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < maxPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 5,
        speedY: Math.random() * 0.7 + 0.4, // Fall downwards
        speedX: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.015,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient dark radial backglow
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      grad.addColorStop(0, 'rgba(18, 12, 10, 0.4)');
      grad.addColorStop(1, 'rgba(10, 5, 2, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render sparkles (shimmering upwards)
      sparkles.forEach((s) => {
        s.y += s.speedY;
        s.x += s.speedX;
        s.angle += s.pulseSpeed;

        if (s.y < -5) {
          s.y = height + 5;
          s.x = Math.random() * width;
        }

        const pulseOpacity = s.opacity + Math.sin(s.angle) * 0.15;
        ctx.fillStyle = `rgba(197, 160, 89, ${Math.max(0.1, Math.min(1, pulseOpacity))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra glowing star bloom for largest ones
        if (s.size > 1.6) {
          ctx.strokeStyle = `rgba(247, 231, 206, ${Math.max(0.01, pulseOpacity * 0.25)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.size * 2, s.y);
          ctx.lineTo(s.x + s.size * 2, s.y);
          ctx.moveTo(s.x, s.y - s.size * 2);
          ctx.lineTo(s.x, s.y + s.size * 2);
          ctx.stroke();
        }
      });

      // Render velvet red rose petals (drifting downwards)
      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.2;
        p.angle += p.spin;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        // Elegant crimson velvet petal leaf design
        ctx.fillStyle = 'rgba(179, 27, 27, 0.7)';
        ctx.beginPath();
        const w = p.size;
        const h = p.size * 0.85;

        ctx.moveTo(0, -h / 2);
        ctx.bezierCurveTo(w / 2, -h / 2, w / 1.5, h / 3, 0, h / 2);
        ctx.bezierCurveTo(-w / 1.5, h / 3, -w / 2, -h / 2, 0, -h / 2);
        ctx.closePath();
        ctx.fill();

        // Shimmer highlighting
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.quadraticCurveTo(w / 8, 0, 0, h / 2);
        ctx.stroke();

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
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
      
      {/* High-fidelity Canvas-based background context */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

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
