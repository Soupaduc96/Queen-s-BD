/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Quote, CheckCircle2, History } from 'lucide-react';
import { StoryMilestone } from '../types';

export default function TimelineSection() {
  const milestones: StoryMilestone[] = [
    {
      id: 'm1',
      period: 'La Genèse',
      title: 'La Rencontre Éveillée',
      description: 'Le jour béni où nos univers croisés se sont soudain assemblés. Un premier échange timide avec toi, ma douce Kayoo, le point zéro de l\'aventure sacrée de nos âmes.',
      emotion: 'Un instant d’éternité suspendu, Kayoo.'
    },
    {
      id: 'm2',
      period: 'L\'Éveil Complice',
      title: 'L\'Alchimie de Nos Conversations',
      description: 'Chaque soir s\'ouvrait sur un ballet infini d\'échanges sincères. Confidences sur nos rêves d\'enfants, nos doutes du quotidien, et l\'amour se dessinant pas à pas.',
      emotion: 'Des heures comme des secondes.'
    },
    {
      id: 'm3',
      period: 'Le Premier Rayon',
      title: 'L\'Éclat de Nos Sourires',
      description: 'Le moment où ton rire, mon Trésor, est devenu mon morceau de musique favori. Découvrir que ta joie a le pouvoir instantané d\'effacer tout le gris de mes journées.',
      emotion: 'Ton bonheur est ma boussole, Mammie.'
    },
    {
      id: 'm4',
      period: 'La Constance',
      title: 'L\'Écrin de Nos Souvenirs',
      description: 'Le tissage rigoureux de nos plus beaux instants : des regards de complicité muette, des journées d’escapades, et des soirs calmes de tendresse.',
      emotion: 'Chaque détail gravé à jamais.'
    },
    {
      id: 'm5',
      period: 'Le Sacré',
      title: 'La Force des Moments Simples',
      description: 'Tenir ta main en silence, se blottir l’un contre l’autre, regarder la pluie tomber sans rien dire. C\'est là que j\'ai compris que tout était devenu complet, Hun.',
      emotion: 'La grandeur dans la simplicité.'
    },
    {
      id: 'm6',
      period: 'Le Premier Anniversaire',
      title: 'Déjà Presque Une Année Ensemble',
      description: 'Bientôt un an à marcher main dans la main avec toi, ma Fanm vim. Douze mois d\'une complicité d\'or où chaque seconde passée à tes côtés est une bénédiction éternelle.',
      emotion: 'L\'aube de notre éternité, Manmi vim.'
    }
  ];

  return (
    <section
      id="notre-histoire"
      className="relative min-h-screen bg-[#0A0502] py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15 selection:bg-[#C5A059]/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,165,165,0.05)_0%,transparent_55%)] pointer-events-none" />

      <div className="max-w-5xl w-full flex flex-col items-center gap-20 relative z-10">
        
        {/* Title Block */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-[#C5A059] text-xs font-display tracking-[0.4em] uppercase"
          >
            <History className="w-3.5 h-3.5" />
            <span>Le Livre de Nos Heures</span>
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#F7E7CE] tracking-wide">
            Notre Histoire
          </h2>
          
          <p className="font-sans font-light sm:max-w-lg mx-auto text-[#E6D5B8]/80 italic text-sm md:text-base leading-relaxed">
            « Se remémorer chaque murmure, chaque baiser, chaque promesse, au fil de notre constellation temporelle... »
          </p>
        </div>

        {/* Timeline Line & Node Layout */}
        <div className="relative w-full">
          {/* Vertical central spine line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#C5A059]/10 via-[#C5A059]/30 to-[#D4A5A5]/10 transform md:-translate-x-1/2" />

          <div className="space-y-16">
            {milestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              
              return (
                <div
                  key={milestone.id}
                  className="flex flex-col md:flex-row items-stretch w-full relative"
                >
                  {/* Left Side spacer on desktop */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-12 md:text-right flex flex-col md:justify-center ${
                    isEven ? 'md:order-1' : 'md:order-2 opacity-0 md:opacity-100 pointer-events-none h-0 md:h-auto overflow-hidden'
                  }`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-3"
                      >
                        <span className="font-display text-[10px] tracking-[0.25em] font-bold text-[#D4A5A5]">
                          {milestone.period}
                        </span>
                        <h3 className="font-serif text-xl text-[#F7E7CE] tracking-wide font-light">
                          {milestone.title}
                        </h3>
                        <p className="font-sans text-xs md:text-sm text-[#E6D5B8]/85 font-light leading-relaxed">
                          {milestone.description}
                        </p>
                        <p className="font-serif italic text-xs text-[#D4A5A5]/80 tracking-wider">
                          — {milestone.emotion}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Central Node Indicator */}
                  <div className="absolute left-5 md:left-1/2 top-1.5 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className="w-4 h-4 rounded-full border border-[#C5A059] bg-[#151312] flex items-center justify-center shadow-lg cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                    </motion.div>
                  </div>

                  {/* Right Side spacer on desktop */}
                  <div className={`w-full md:w-1/2 pl-12 flex flex-col justify-center ${
                    isEven ? 'md:order-2 opacity-0 md:opacity-100 pointer-events-none h-0 md:h-auto overflow-hidden' : 'md:order-1'
                  }`}>
                    {!isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-3"
                      >
                        <span className="font-display text-[10px] tracking-[0.25em] font-bold text-[#D4A5A5] font-medium">
                          {milestone.period}
                        </span>
                        <h3 className="font-serif text-xl text-[#F7E7CE] tracking-wide font-light">
                          {milestone.title}
                        </h3>
                        <p className="font-sans text-xs md:text-sm text-[#E6D5B8]/85 font-light leading-relaxed">
                          {milestone.description}
                        </p>
                        <p className="font-serif italic text-xs text-[#D4A5A5]/80 tracking-wider">
                          — {milestone.emotion}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Mobile details (rendered only for even items when in layout order-1 is hidden) */}
                  {isEven && (
                    <div className="md:hidden pl-12 space-y-3 pb-8">
                      {/* Already rendered by first block on mobile */}
                    </div>
                  )}
                  {!isEven && (
                    <div className="md:hidden pl-12 space-y-3 pb-8">
                      {/* Already rendered by second block on mobile */}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Bottom Quote block */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="glass-gold py-10 px-12 rounded-2xl max-w-2xl text-center space-y-4 border border-[#C5A059]/20 shadow-2xl relative"
        >
          <Quote className="w-6 h-6 text-[#C5A059]/30 mx-auto" />
          <p className="font-serif text-base text-[#F7E7CE] font-light leading-relaxed italic">
            « Cet an passé ensemble s’avère être notre plus belle symphonie, et chaque note partagée m’assure que tu es celle dont je ne veux plus jamais m'éloigner. »
          </p>
          <div className="flex items-center justify-center gap-2 text-[#E6D5B8]/60 text-[10px] font-display tracking-[0.2em] uppercase font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Unis par le temps, accordés pour toujours</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
