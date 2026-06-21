/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MailOpen, Compass, Sparkles, Send } from 'lucide-react';
import { FlowerBouquetOrnament, FlickeringCandle } from './LuxuryAestheticOverlays';

export default function LetterSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="lettre-a-mon-amour"
      className="relative min-h-screen bg-[#0A0502] py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15 selection:bg-[#C5A059]/20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(212,165,165,0.06)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl w-full flex flex-col items-center gap-14 relative z-10">
        
        {/* Title Group */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-[#C5A059] text-xs font-display tracking-[0.43em] uppercase"
          >
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>Le Sceau Cosmique</span>
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#F7E7CE] tracking-wide">
            Lettre à Mon Amour
          </h2>
          
          <p className="font-sans font-light sm:max-w-lg mx-auto text-[#E6D5B8]/80 italic text-sm md:text-base leading-relaxed">
            « Brisez le sceau de cire dorée pour déployer la lettre écrite avec le sang de nos souvenirs... »
          </p>
        </div>

        {/* Envelope Container Wrapper */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[400px]">
          
          <AnimatePresence mode="wait">
            {!isOpen ? (
              // SEALED ENVELOPE STAGE
              <motion.div
                key="sealed-envelope"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setIsOpen(true)}
                className="group relative w-full max-w-lg h-[280px] sm:h-[320px] rounded-2xl glass-gold p-8 flex flex-col items-center justify-center shadow-2xl border border-[#C5A059]/30 cursor-pointer overflow-hidden text-center transition-all bg-[#151312]"
              >
                {/* Visual envelope flaps representation */}
                <div className="absolute top-0 inset-x-0 h-[50%] bg-[#1A1817]/20 border-b border-[#C5A059]/10 pointer-events-none rounded-t-2xl flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[250px] border-l-transparent border-r-[250px] border-r-transparent border-t-[140px] border-t-[#0A0502]/40" />
                </div>
                
                {/* Luxurious soft gold candle-glowing background */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/5 via-[#E6D5B8]/10 to-[#C5A059]/5 opacity-50 group-hover:opacity-100 duration-500" />

                {/* Royal Wax Seal button */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="relative flex items-center justify-center">
                    {/* Glowing outer orbit rings */}
                    <span className="absolute w-24 h-24 rounded-full border border-[#C5A059]/30 animate-ping opacity-25" />
                    <span className="absolute w-20 h-20 rounded-full border border-[#D4A5A5]/20 animate-pulse-slow" />
                    
                    {/* Golden Wax Seal */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E6D5B8] via-[#C5A059] to-[#A88241] shadow-xl border border-[#C5A059]/50 flex items-center justify-center text-stone-950 filter duration-500 group-hover:scale-110">
                      <Mail className="w-6 h-6 animate-pulse text-[#0A0502]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-serif text-lg text-[#E6D5B8] font-light tracking-wide duration-300 group-hover:text-[#F7E7CE]">
                      À la Reine de Mon Cœur
                    </p>
                    <p className="font-display text-[10px] text-stone-500 tracking-[0.2em] uppercase">
                      [ Sceau Secret • Briser pour Lire ]
                    </p>
                  </div>
                </div>
                
              </motion.div>
            ) : (
              // OPEN LETTER EXPANDED STAGE
              <motion.div
                key="open-scroll"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl rounded-2xl bg-[#FCFBF7] text-stone-900 border border-[#E6D5B8] p-8 sm:p-14 shadow-3xl text-left relative overflow-hidden select-text"
              >
                {/* Luxury gold lining decoration */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#E6D5B8] via-[#C5A059] to-[#A88241]" />
                <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#A88241] via-[#C5A059] to-[#E6D5B8]" />
                
                {/* Fine watermark background */}
                <div className="absolute inset-4 border border-[#C5A059]/10 pointer-events-none rounded-xl" />

                <div className="flex justify-between items-center text-stone-400 text-[10px] font-display font-semibold tracking-widest pb-6 border-b border-stone-100">
                  <span className="flex items-center gap-1.5 uppercase">
                    <MailOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                    Written By Your On Man
                  </span>
                  <span>15 Juin 2026</span>
                </div>

                {/* Letter Content area */}
                <div className="pt-10 space-y-8 pb-10">
                  <h3 className="font-script text-4.5xl sm:text-5xl text-[#C5A059] font-normal leading-none">
                    Ma Bien-Aimée, Kayoo d'Amour,
                  </h3>

                  <div className="font-serif text-sm sm:text-base leading-relaxed text-stone-800 space-y-6 font-light">
                    <p>
                      Aujourd’hui, alors que le monde s’arrête un court instant pour célébrer le jour précieux où tu es née il y a vingt ans de cela, mon âme ressent l’irrésistible besoin de te livrer ses plus doux secrets. T’aimer au quotidien, ma belle Kai, s’avère être le privilège le plus noble et le plus sacré de toute mon existence.
                    </p>
                    
                    <p>
                      Depuis bientôt une année entière que nos chemins se sont harmonieusement assemblés, j’ai découvert auprès de toi une complicité d’une pureté bouleversante. Tu es <strong className="font-medium text-stone-950">la Reine de mon cœur</strong>, mon Trésor précieux, ma tendre Mammie, la femme douce, bienveillante et extraordinaire qui éclaire la moindre de mes incertitudes par la seule force de sa lumière intérieure.
                    </p>
                    
                    <p>
                      Je ressens une gratitude éternelle et infinie envers le destin de t'avoir guidée vers moi, Hun. Je t’admire profondément pour ton intelligence vive, ta douceur souveraine et ton élégance innée qui m’apprennent à devenir un homme meilleur, de jour en jour, simplement en vivant à tes côtés, ma Manmi vim.
                    </p>
                    
                    <p>
                      En ce vingtième anniversaire si symbolique, ma sublime Fanm vim, je formule la promesse sacrée de chérir chaque seconde partagée, d'ériger ton sourire en véritable joyau de mon quotidien, et de dessiner un futur radieux à l'unisson. Le plus beau chapitre de notre odyssée s'apprête encore à être couché par écrit.
                    </p>
                  </div>

                  <div className="space-y-1 pt-6 text-right">
                    <p className="font-serif italic text-xs text-stone-400 uppercase tracking-widest">Ton Amour Éternel,</p>
                    <p className="font-script text-4.5xl text-[#C5A059] leading-none">Celui qui t'aime infiniment.</p>
                  </div>
                </div>

                {/* Fold Back action */}
                <div className="flex justify-center border-t border-stone-100 pt-8">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-xs font-display tracking-widest text-[#C5A059] hover:text-[#A88241] uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-[#C5A059] rotate-185" />
                    Reposer la lettre dans son écrin
                  </button>
                </div>
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative luxury room ornaments flanking the envelope */}
      <FlowerBouquetOrnament className="absolute bottom-8 left-4 md:left-12 z-0 scale-75 md:scale-90 opacity-40 md:opacity-80 pointer-events-none" />
      
      <div className="absolute top-16 right-8 md:right-16 z-0 scale-75 md:scale-100 opacity-40 md:opacity-80">
        <FlickeringCandle size="md" delay={0.5} />
      </div>

      <div className="absolute bottom-16 right-8 md:right-16 z-0 scale-75 md:scale-100 opacity-45 md:opacity-80">
        <FlickeringCandle size="lg" delay={1.4} />
      </div>
    </section>
  );
}
