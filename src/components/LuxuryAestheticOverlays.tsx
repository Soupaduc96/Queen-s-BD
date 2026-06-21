/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ============================================================================
// 1. DYNAMIC ROSE & GOLD PARTICLES SIMULATOR (HIGH-PERFORMANCE CANVAS PATTERN)
// ============================================================================
export function RosePetalsRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    interface Petal {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      spinSpeed: number;
      swing: number;
      swingSpeed: number;
      opacity: number;
      color: string;
      aspectRatio: number;
    }

    interface GoldParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      drift: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const petals: Petal[] = [];
    const maxPetals = 180; // Supports intense ending scenes

    const goldParticles: GoldParticle[] = [];
    const maxGoldParticles = 165;

    // Rich luxury rose tones
    const roseColors = [
      'rgba(179, 27, 27, 0.76)',   // Deep Crimson Red
      'rgba(192, 41, 43, 0.72)',   // Rich Scarlet Rose
      'rgba(212, 165, 165, 0.85)', // Luxury Champagne Blush
      'rgba(141, 15, 15, 0.80)',   // Velvet Bordeaux
      'rgba(247, 231, 206, 0.78)'  // Delicate White Rose Gold
    ];

    // Seed variables once
    for (let i = 0; i < maxPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height * 1.5 - height,
        size: Math.random() * 12 + 8,
        speed: Math.random() * 1.1 + 0.6,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.02,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.012 + 0.005,
        opacity: Math.random() * 0.55 + 0.4,
        color: roseColors[i % roseColors.length],
        aspectRatio: Math.random() * 0.4 + 0.7,
      });
    }

    for (let i = 0; i < maxGoldParticles; i++) {
      goldParticles.push({
        x: Math.random() * width,
        y: Math.random() * height * 1.4 - height,
        size: Math.random() * 2.5 + 0.8,
        speed: Math.random() * 0.5 + 0.3,
        drift: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Extract progressive parameters from window contexts
      const progress = (window as any).romanticAudioProgress || 0;
      const isEndingScene = (window as any).romanticIsEndingScene === true || progress > 0.88;

      // Adjust density of rose petals and golden stars dynamically based on progression
      const activePetalsCount = isEndingScene 
        ? 180 
        : Math.floor(40 + progress * 75);

      const activeGoldCount = isEndingScene 
        ? 165 
        : Math.floor(35 + progress * 95);

      // Shimmer brightness multiplier
      const goldBrightnessFactor = isEndingScene ? 1.9 : (1.0 + progress * 0.8);

      // Draw sweeping cinematic romantic light rays (intensity matches music progression)
      const rayAlpha = (0.04 + progress * 0.14 + (isEndingScene ? 0.16 : 0));
      if (rayAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = rayAlpha;
        const linearGrad = ctx.createLinearGradient(0, 0, width * 0.75, height * 0.75);
        linearGrad.addColorStop(0, 'rgba(197, 160, 89, 0.38)'); // Royalty gold glow
        linearGrad.addColorStop(0.4, 'rgba(212, 165, 165, 0.14)'); // Sunset rose blend
        linearGrad.addColorStop(1, 'rgba(10, 5, 2, 0)');
        ctx.fillStyle = linearGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Atmospheric gold blanket
      if (progress > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.18, progress * 0.18);
        ctx.fillStyle = 'rgba(197, 160, 89, 0.07)';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Draw shimmering golden particles
      for (let i = 0; i < activeGoldCount; i++) {
        const gp = goldParticles[i];
        gp.y += gp.speed * (isEndingScene ? 1.35 : (1.02 + progress * 0.25));
        gp.x += gp.drift;

        if (gp.y > height + gp.size) {
          gp.y = -gp.size - 6;
          gp.x = Math.random() * width;
        }
        if (gp.x < 0) gp.x = width;
        if (gp.x > width) gp.x = 0;

        const pulseOpacity = (gp.opacity + Math.sin(Date.now() * gp.pulseSpeed + gp.pulseOffset) * 0.18) * goldBrightnessFactor;
        const clampedOpacity = Math.max(0.1, Math.min(1.0, pulseOpacity));

        ctx.save();
        ctx.globalAlpha = clampedOpacity;
        ctx.shadowBlur = 8 * goldBrightnessFactor;
        ctx.shadowColor = '#C5A059';
        ctx.fillStyle = i % 2 === 0 ? '#F7E7CE' : '#C5A059';
        ctx.beginPath();
        ctx.arc(gp.x, gp.y, gp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw flowing crimson/white rose petals
      for (let i = 0; i < activePetalsCount; i++) {
        const p = petals[i];
        p.y += p.speed * (isEndingScene ? 1.25 : (1.0 + progress * 0.35));
        p.angle += p.spinSpeed;
        p.swing += p.swingSpeed;

        // Elegant floating horizontal sway
        p.x += Math.sin(p.swing) * 0.8;

        if (p.y > height + p.size) {
          p.y = -p.size - 10;
          p.x = Math.random() * width;
        }
        if (p.x < -p.size) p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle + Math.sin(p.swing) * 0.45);
        ctx.globalAlpha = p.opacity;

        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(10, 5, 2, 0.28)';

        ctx.fillStyle = p.color;
        ctx.beginPath();
        const w = p.size;
        const h = p.size * p.aspectRatio;

        ctx.moveTo(0, -h / 2);
        ctx.bezierCurveTo(w / 2, -h / 2, w / 1.5, h / 3, 0, h / 2);
        ctx.bezierCurveTo(-w / 1.5, h / 3, -w / 2, -h / 2, 0, -h / 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.quadraticCurveTo(w / 6, 0, 0, h / 2);
        ctx.stroke();

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}

// ============================================================================
// 2. LUXURY CANDLE ATMOSPHERE ORNAMENT (COZY REALISTIC FLAME FLICKERING)
// ============================================================================
interface CandleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}

export function FlickeringCandle({ className = '', size = 'md', delay = 0 }: CandleProps) {
  const heightClass = size === 'lg' ? 'h-24 w-7' : size === 'sm' ? 'h-12 w-4' : 'h-18 w-5';
  
  return (
    <div className={`flex flex-col items-center select-none pointer-events-none relative ${className}`}>
      
      {/* 1. Realistic Flickering Golden Flame Element */}
      <div className="relative mb-[3px] flex items-center justify-center">
        {/* Flame core outer bloom halo effect */}
        <div 
          className="absolute rounded-full bg-amber-400/25 blur-[12px] animate-pulse pointer-events-none transition-all duration-1000"
          style={{
            width: size === 'lg' ? '60px' : '45px',
            height: size === 'lg' ? '60px' : '45px',
            animationDuration: '2.5s',
            animationDelay: `${delay}s`,
            transform: `scale(var(--candle-glow, 1))`
          }}
        />
        
        {/* Soft magical flare */}
        <div 
          className="absolute rounded-full bg-rose-300/15 blur-[6px] pointer-events-none animate-ping"
          style={{
            width: size === 'lg' ? '30px' : '20px',
            height: size === 'lg' ? '30px' : '20px',
            animationDuration: '4s',
            animationDelay: `${delay + 1}s`
          }}
        />

        {/* Animated Wax Flame vector shape with organic micro-translations */}
        <motion.div
          animate={{
            scaleY: [1, 1.15, 0.95, 1.08, 1],
            scaleX: [1, 0.9, 1.1, 0.95, 1],
            rotate: [-1, 2, -1.5, 0.5, -2, 1, 0],
            skewX: [-1, 1.5, -0.5, 1, 0]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: delay
          }}
          className={`relative origin-bottom bg-gradient-to-t from-amber-600 via-amber-400 to-[#F7E7CE] rounded-full filter drop-shadow(0 0 8px rgba(247, 231, 206, 0.85)) transition-transform duration-1000`}
          style={{
            width: size === 'lg' ? '12px' : '8px',
            height: size === 'lg' ? '28px' : '20px',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transform: `scale(var(--candle-glow, 1))`
          }}
        >
          {/* Flame inner burning core */}
          <div className="absolute bottom-1 left-[25%] w-[50%] h-[50%] bg-[#4B4BFF]/50 rounded-full blur-[0.6px] mix-blend-screen" />
          <div className="absolute bottom-[20%] left-[30%] w-[40%] h-[60%] bg-[#FCF8EC] rounded-full" />
        </motion.div>

        {/* Tiny dark wicked thread */}
        <div className="w-[1.5px] h-[5px] bg-stone-800 rotate-[3deg] absolute top-[90%] left-1/2 -translate-x-1/2 z-10" />
      </div>

      {/* 2. Wax Candle Body Column Solid */}
      <div 
        className={`${heightClass} rounded-t-sm rounded-b-md bg-gradient-to-r from-stone-900 via-[#1C120B] to-stone-950 border-r border-[#C5A059]/15 shadow-2xl relative overflow-hidden`}
      >
        {/* Flowing melting wax drip line accent */}
        <div className="absolute top-0 left-1 w-[3px] h-4 rounded-full bg-stone-800 opacity-60" />
        <div className="absolute top-0 right-2 w-[2px] h-6 rounded-full bg-stone-900 opacity-40" />

        {/* Outer body smooth premium wood/clay wax tint mapping */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/12 via-transparent to-black/60 pointer-events-none" />

        {/* Highlight edges */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#E6D5B8]/30" />
        <div className="absolute left-[10%] inset-y-0 w-[0.5px] bg-white/5" />
      </div>

    </div>
  );
}

// ============================================================================
// 3. CINEMATIC BACKGROUND LIVING PARALLAX (THE PHOTO SLIDESHOW THAT FLOATS)
// ============================================================================
export function LivingParallaxBackground() {
  const [slideIndex, setSlideIndex] = useState(0);

  // Rotate between image 0 and image 1 every 14 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const bgPhotos = ['/input_file_0.png', '/input_file_1.png'];

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(4px) brightness(15%)' }}
          animate={{
            opacity: 0.18, // Ambient luxury soft exposure
            scale: [1.05, 1.12, 1.06],
            x: [0, 10, -5, 0],
            y: [0, -8, 5, 0],
            rotate: [0, 0.5, -0.5, 0],
            filter: 'blur(2px) brightness(28%)'
          }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
          transition={{
            duration: 18,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror'
          }}
          className="absolute inset-0 w-full h-full"
          style={{
            transform: 'scale(var(--scenic-zoom, 1.0))',
            transition: 'transform 2.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src={bgPhotos[slideIndex]}
            alt="Living Frame"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic dark luxury veil overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0502] via-[#0A0502]/92 to-[#010101] mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/50" />

      {/* Subtle organic light leaks and golden bokeh spots */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,#C5A059_0%,transparent_50%)]" />
      <div className="absolute inset-0 opacity-12 pointer-events-none bg-[radial-gradient(circle_at_20%_80%,#D4A5A5_0%,transparent_50%)] animate-pulse" style={{ animationDuration: '8s' }} />
    </div>
  );
}

// ============================================================================
// 4. LUXURIOUS FLOWER BOUQUET ORNAMENT
// ============================================================================
interface BouquetProps {
  className?: string;
}

export function FlowerBouquetOrnament({ className = '' }: BouquetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* Decorative luxury vector bouquet resembling red roses, white roses, and golden leaves */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Soft Golden glow ring */}
        <div className="absolute inset-4 rounded-full border border-[#C5A059]/15 animate-ping" style={{ animationDuration: '6s' }} />
        <div className="absolute inset-6 rounded-full border border-[#D4A5A5]/20" />

        {/* Layered Rose buds stylized via SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          {/* Elegant gold ties & foliage leaves */}
          <path d="M50,55 Q40,75 35,85" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M50,55 Q50,78 50,88" stroke="#A88241" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M50,55 Q60,75 65,85" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Foliage leaves */}
          <path d="M30,42 Q20,38 24,50 Q28,62 38,52 Z" fill="#2E251A" stroke="#C5A059" strokeWidth="0.5" opacity="0.8" />
          <path d="M70,42 Q80,38 76,50 Q72,62 62,52 Z" fill="#2E251A" stroke="#C5A059" strokeWidth="0.5" opacity="0.8" />
          <path d="M50,30 Q50,15 42,22 Q34,29 45,38 Z" fill="#1C1510" stroke="#C5A059" strokeWidth="0.5" opacity="0.7" />

          {/* Rose 1: Left Deep Velvet Red */}
          <circle cx="38" cy="46" r="14" fill="#8C1313" stroke="#C5A059" strokeWidth="1" />
          <path d="M38,36 A10,10 0 0,0 28,46 A10,10 0 0,0 38,56" fill="none" stroke="#E6D5B8" strokeWidth="0.8" opacity="0.4" />
          <path d="M32,42 Q38,44 38,36" fill="none" stroke="#F7E7CE" strokeWidth="0.7" />
          <circle cx="38" cy="46" r="5" fill="#5F0808" />

          {/* Rose 2: Right Elegant White/Champagne */}
          <circle cx="62" cy="46" r="14" fill="#F7E7CE" stroke="#C5A059" strokeWidth="1" />
          <path d="M62,36 A10,10 0 0,1 72,46 A10,10 0 0,1 62,56" fill="none" stroke="#8C662E" strokeWidth="0.8" opacity="0.4" />
          <path d="M68,42 Q62,44 62,36" fill="none" stroke="#C5A059" strokeWidth="0.7" />
          <circle cx="62" cy="46" r="5" fill="#E6D5B8" />

          {/* Rose 3: Top Center Luxury Red Rose */}
          <circle cx="50" cy="34" r="16" fill="#A11818" stroke="#C5A059" strokeWidth="1" />
          {/* Rose folds */}
          <path d="M42,30 Q50,22 58,30" fill="none" stroke="#F7E7CE" strokeWidth="0.8" />
          <path d="M40,36 Q50,44 60,36" fill="none" stroke="#E6D5B8" strokeWidth="0.8" />
          <circle cx="50" cy="34" r="6" fill="#4A0505" />

          {/* Tiny Baby Breath golden dots */}
          <circle cx="26" cy="36" r="2.5" fill="#FCF5E8" stroke="#C5A059" strokeWidth="0.4" />
          <circle cx="74" cy="36" r="2.5" fill="#FCF5E8" stroke="#C5A059" strokeWidth="0.4" />
          <circle cx="50" cy="54" r="3" fill="#C5A059" />
          <circle cx="46" cy="58" r="2" fill="#E6D5B8" />
          <circle cx="54" cy="58" r="2" fill="#E6D5B8" />
        </svg>

        {/* Splendid bouquet soft fragrance particle ripples */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D4A5A5]/30 animate-ping" style={{ animationDuration: '3.5s' }} />
      </div>
    </motion.div>
  );
}
