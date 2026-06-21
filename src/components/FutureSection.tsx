/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function FutureSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Track resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars array
    const stars: { x: number; y: number; size: number; twinkleSpeed: number; alpha: number; delta: number }[] = [];
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        alpha: Math.random(),
        delta: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Dynamic mouse-drawn stardust particles array
    const mouseParticles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string }[] = [];

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn gold, warm champagne, and dust rose magical particles conforming to Elegant Dark
      const colors = ['#C5A059', '#E6D5B8', '#D4A5A5', '#F7E7CE', '#A88241'];
      for (let i = 0; i < 3; i++) {
        mouseParticles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8 - 0.2, // slightly drift upward
          alpha: 1,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Limit particle count for high frame performance
      if (mouseParticles.length > 250) {
        mouseParticles.splice(0, 50);
      }
    };

    canvas.addEventListener('pointermove', handlePointerMove);

    // Cinematic render loops
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background night gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0A0502');
      gradient.addColorStop(0.5, '#0E0805');
      gradient.addColorStop(1, '#050201');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Twinkle and Draw static stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed * star.delta;
        if (star.alpha <= 0.1) {
          star.alpha = 0.1;
          star.delta = 1;
        } else if (star.alpha >= 1) {
          star.alpha = 1;
          star.delta = -1;
        }

        ctx.fillStyle = `rgba(247, 231, 206, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Update and Draw pointer stardust
      for (let i = mouseParticles.length - 1; i >= 0; i--) {
        const p = mouseParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015; // slow fadeout

        if (p.alpha <= 0) {
          mouseParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('pointermove', handlePointerMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="le-futur"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15 selection:bg-[#C5A059]/15"
    >
      {/* Absolute canvas night sky background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0502]/30 to-[#050201]/70 pointer-events-none" />

      {/* Narrative Overlays centered carefully */}
      <div className="relative z-10 max-w-4xl text-center px-6 md:px-12 flex flex-col items-center justify-center gap-14 select-none pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-1.5 text-[#C5A059]">
            <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
            <span className="font-display tracking-[0.4em] text-xs font-semibold uppercase">L'Horizon Doré</span>
          </div>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#C5A059]/50 to-transparent mx-auto pt-2" />
        </motion.div>

        <div className="space-y-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-[#F7E7CE] font-light leading-relaxed tracking-wide shadow-gold-text"
          >
            « Le plus beau chapitre de notre histoire reste encore à écrire. »
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="font-sans text-[#E6D5B8] font-light text-sm md:text-base leading-relaxed max-w-lg mx-auto italic"
          >
            « Et parmi tous les rêves que l'avenir peut offrir, le plus beau est celui de continuer à avancer à tes côtés. »
          </motion.p>
        </div>
      </div>
    </section>
  );
}
