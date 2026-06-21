/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import { GalleryItem } from '../types';
import { FlickeringCandle, FlowerBouquetOrnament } from './LuxuryAestheticOverlays';

interface FinalSectionProps {
  galleryItems: GalleryItem[];
}

export default function FinalSection({ galleryItems }: FinalSectionProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set visual emotional climate peak status flag dynamically to boost ambient weather patterns
  useEffect(() => {
    (window as any).romanticIsEndingScene = true;
    return () => {
      (window as any).romanticIsEndingScene = false;
    };
  }, []);

  const texts = [
    "Joyeux 20ème anniversaire, Kai.",
    "Merci pour tous ces moments, Kayoo.",
    "Tu seras toujours mon Trésor.",
    "Je t'aime infiniment."
  ];

  // Auto progression of cinematic text slides
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => {
        if (prev < texts.length - 1) return prev + 1;
        return prev; // hold on the last "Je t'aime infiniment." slide
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [texts.length]);

  // Golden Rain Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle models representing golden luxury dust fall
    interface GoldenDrop {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      drift: number;
      spin: number;
      spinSpeed: number;
    }

    interface TwinklerStar {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      speed: number;
    }

    const particles: GoldenDrop[] = [];
    const maxParticles = 120; // Increased count for epic magical final

    const stars: TwinklerStar[] = [];
    const maxStars = 140;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height, // start offscreen
        size: Math.random() * 3.5 + 1.2,
        speed: Math.random() * 1.3 + 0.8,
        opacity: Math.random() * 0.7 + 0.3,
        drift: (Math.random() - 0.5) * 0.4,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.03,
      });
    }

    for (let i = 0; i < maxStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.4,
        baseOpacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.015 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep vignette overlay background
      const radialGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      radialGradient.addColorStop(0, 'rgba(10, 5, 2, 0.4)');
      radialGradient.addColorStop(1, '#0A0502');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw background twinkling starry night (Ciel étoilé)
      stars.forEach((s, idx) => {
        const opacity = s.baseOpacity + Math.sin(Date.now() * s.speed + idx) * 0.2;
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, opacity));
        ctx.fillStyle = '#FCF8EC'; // Luxe Warm White
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw and advance each gold flake
      particles.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        p.spin += p.spinSpeed;

        // Reset if goes off limits
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);

        // Render soft golden crystal stars or flakes
        const colors = ['#C5A059', '#E6D5B8', '#F7E7CE', '#D4A5A5', '#A88241'];
        ctx.shadowBlur = 6;
        ctx.shadowColor = colors[Math.floor(p.x) % colors.length];
        ctx.fillStyle = colors[Math.floor(p.y) % colors.length];

        // Draw diamond shape leaf
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.6, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Fetch images from gallery for slide show
  const activeImage = galleryItems[slideIndex % galleryItems.length];
  const activeImageUrl = activeImage?.customImageUrl || activeImage?.defaultImageUrl;

  const restartCinematic = () => {
    setSlideIndex(0);
    // Smooth scroll back to section 1 index
    const introEl = document.getElementById('intro-cinematic-screen');
    if (introEl) {
      introEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="finale-cinematique"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden selection:bg-gold-500/10 select-none"
    >
      {/* Background Slideshow of key customized/default photos with absolute blur and overlays */}
      <div className="absolute inset-0 w-full h-full bg-stone-950 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={slideIndex}
            src={activeImageUrl}
            alt="Slideshow"
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(3px) brightness(40%)' }}
            animate={{ opacity: 0.55, scale: 1, filter: 'blur(1px) brightness(28%)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(3px)' }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Soft blackout veil and vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Gold rain drawing canvas overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Cinematic Text sequence overlay */}
      <div className="relative z-10 max-w-4xl text-center px-6 md:px-12 flex flex-col items-center justify-center h-full">
        {/* Heart logo indicator */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="mb-8"
        >
          <Heart className="w-8 h-8 text-[#D4A5A5] fill-[#D4A5A5]/20" />
        </motion.div>

        <div className="min-h-[160px] flex items-center justify-center max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.h2
              key={slideIndex}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className={`font-serif tracking-wide text-3xl md:text-5xl lg:text-5xl font-light leading-relaxed ${
                slideIndex === texts.length - 1
                  ? 'text-[#C5A059] font-medium shadow-gold-text text-4xl md:text-6xl uppercase tracking-widest'
                  : 'text-[#F7E7CE] italic'
              }`}
            >
              {texts[slideIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Finale triggers shown after ending slides */}
        {slideIndex === texts.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex flex-col items-center gap-6 mt-16"
          >
            <div className="flex items-center gap-2 text-stone-400 text-xs font-display tracking-widest uppercase">
              <Sparkles className="w-4.5 h-4.5 text-[#C5A059] animate-spin-slow" />
              <span>Dévoué Éternellement</span>
            </div>

            <button
              onClick={restartCinematic}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#C5A059]/30 text-[#E6D5B8] hover:text-[#F7E7CE] bg-[#151312]/40 hover:bg-[#C5A059]/10 hover:border-[#E6D5B8]/60 duration-300 transition-all font-display text-xs tracking-widest uppercase cursor-pointer shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Rejouer le film
            </button>
          </motion.div>
        )}
      </div>

      {/* Exquisite candle lighting flanking the final scene */}
      <div className="absolute bottom-6 left-8 z-20 flex gap-3.5 items-end opacity-85 scale-75 md:scale-100 origin-bottom-left">
        <FlickeringCandle size="md" delay={0.4} />
        <FlickeringCandle size="lg" delay={1.2} />
        <FlickeringCandle size="sm" delay={0.1} />
      </div>

      <div className="absolute bottom-6 right-8 z-20 flex gap-3.5 items-end opacity-85 scale-75 md:scale-100 origin-bottom-right">
        <FlickeringCandle size="sm" delay={0.9} />
        <FlickeringCandle size="md" delay={0.3} />
        <FlickeringCandle size="lg" delay={0.7} />
      </div>

      {/* Luxury Flower Bouquet corner decorations */}
      <FlowerBouquetOrnament className="absolute top-10 left-4 md:left-12 z-20 scale-75 md:scale-100 opacity-60 md:opacity-90 origin-top-left" />
      <FlowerBouquetOrnament className="absolute top-10 right-4 md:right-12 z-20 scale-75 md:scale-100 opacity-60 md:opacity-90 origin-top-right" />
    </section>
  );
}
