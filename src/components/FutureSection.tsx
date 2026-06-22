/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function FutureSection() {
  return (
    <section
      id="le-futur"
      className="relative w-full h-[65vh] md:h-screen flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15 selection:bg-[#C5A059]/15"
    >
      {/* Elegant simple dark atmospheric background with slow luxurious glow */}
      <div className="absolute inset-0 bg-stone-950" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0502] via-[#0E0805] to-[#050201]" />
      
      {/* Soft atmospheric gradient leak matching the rest of the luxurious aesthetics */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Narrative Overlays centered carefully */}
      <div className="relative z-10 max-w-4xl text-center px-6 md:px-12 flex flex-col items-center justify-center gap-10 md:gap-14 select-none pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-1.5 text-[#C5A059]">
            <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
            <span className="font-display tracking-[0.4em] text-xs font-semibold uppercase">L'Horizon Doré</span>
          </div>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#C5A059]/50 to-transparent mx-auto pt-2" />
        </motion.div>

        <div className="space-y-6 md:space-y-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="font-serif text-2xl md:text-4xl text-[#F7E7CE] font-light leading-relaxed tracking-wide shadow-gold-text"
          >
            « Le plus beau chapitre de notre histoire reste encore à écrire. »
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.5 }}
            className="font-sans text-[#E6D5B8] font-light text-sm md:text-base leading-relaxed max-w-lg mx-auto italic"
          >
            « Et parmi tous les rêves que l'avenir peut offrir, le plus beau est celui de continuer à avancer à tes côtés. »
          </motion.p>
        </div>
      </div>
    </section>
  );
}
