/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Wand2 } from 'lucide-react';
import { QualityItem } from '../types';

export default function QualitiesSection() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const qualities: QualityItem[] = [
    {
      id: 'q1',
      title: 'Le Sourire d\'Or',
      description: 'Ton sourire illumine les journées les plus ordinaires.',
      sentiment: 'Chaque rire de toi est une aurore boréale qui dissipe les ombres de mon quotidien.'
    },
    {
      id: 'q2',
      title: 'Le Sanctuaire de Paix',
      description: 'Ta présence apporte la paix.',
      sentiment: 'Dans le vacarme du monde, être à tes côtés est le seul port de calme infini.'
    },
    {
      id: 'q3',
      title: 'Le Cœur Précieux',
      description: 'Ton cœur est précieux.',
      sentiment: 'Un océan de bienveillance, pur et sincère, qui réchauffe tous ceux qui s’en approchent.'
    },
    {
      id: 'q4',
      title: 'L\'Étincelle d\'Inspiration',
      description: 'Ta force inspire.',
      sentiment: 'Ton humilité, ta persévérance et ta dignité me donnent le courage d\'être un homme meilleur.'
    },
    {
      id: 'q5',
      title: 'Le Cocon Doré',
      description: 'Ta douceur réconforte.',
      sentiment: 'Une caresse de mots doux, un havre où je peux déposer toutes mes vulnérabilités.'
    },
    {
      id: 'q6',
      title: 'Le Regard Infini',
      description: 'Ton regard raconte une histoire.',
      sentiment: 'Deux constellations profondes d’où jaillit une complicité muette que nous seuls comprenons.'
    }
  ];

  const handleCardClick = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="pourquoi-elle-est-unique"
      className="relative min-h-screen bg-[#0A0502] py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15 selection:bg-[#C5A059]/20"
    >
      <div className="absolute inset-0 bg-[#0A0502] opacity-40 pointer-events-none" />
      {/* Decorative luxury lines background elements */}
      <div className="absolute top-20 left-10 w-[1px] h-96 bg-gradient-to-b from-[#C5A059]/10 to-transparent invisible md:block" />
      <div className="absolute bottom-20 right-10 w-[1px] h-96 bg-gradient-to-t from-[#C5A059]/10 to-transparent invisible md:block" />

      <div className="max-w-7xl w-full flex flex-col items-center gap-16 relative z-10">
        
        {/* Section Intro */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-[#C5A059] text-xs font-display tracking-[0.34em] uppercase"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Harmonie du Cœur</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-serif text-4xl md:text-5xl font-light text-[#F7E7CE] tracking-wide"
          >
            Pourquoi elle est Unique
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-sans font-light max-w-lg mx-auto text-[#E6D5B8]/80 text-sm md:text-base leading-relaxed"
          >
            « Touche chaque carte dorée pour lever le voile protecteur de ses secrets divins... »
          </motion.p>
        </div>

        {/* 3D Interactive Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {qualities.map((item, idx) => {
            const isFlipped = !!flippedCards[item.id];
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                className="relative h-[280px] w-full perspective-[1200px] cursor-pointer"
                onClick={() => handleCardClick(item.id)}
              >
                {/* Flipping animation wrapper */}
                <div
                  className={`relative w-full h-full duration-700 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{ transformStyle: 'preserve-3d', transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1)' }}
                >
                  
                  {/* FRONT SIDE (Luxury Golden Back of Tarot) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl glass-gold p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-[#C5A059]/20 backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Filigree corner accents */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C5A059]/40 rounded-tl" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C5A059]/40 rounded-tr" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C5A059]/40 rounded-bl" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C5A059]/40 rounded-br" />

                    {/* Shimmer linear background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 via-transparent to-[#D4A5A5]/5" />

                    <div className="relative flex justify-between items-center text-[#C5A059]/40 font-display text-xs tracking-widest font-bold">
                      <span>0{idx + 1}</span>
                      <Sparkles className="w-4 h-4 text-[#C5A059]/30" />
                    </div>

                    <div className="relative flex flex-col items-center text-center py-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C5A059]/30 text-[#C5A059] mb-4 bg-stone-950/50 shadow-inner group-hover:scale-110 duration-300">
                        <Heart className="w-5 h-5 text-[#C5A059] animate-pulse" />
                      </div>
                      
                      <h3 className="font-serif text-lg text-[#F7E7CE] tracking-[0.15em] font-medium">
                        {item.title}
                      </h3>
                    </div>

                    <div className="relative text-center font-display text-[9px] text-[#C5A059]/40 tracking-[0.2em] uppercase">
                      [ Toucher pour révéler ]
                    </div>
                  </div>

                  {/* BACK SIDE (Quality Statement Revealed) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-[#151312] to-[#1A1817] border border-[#C5A059]/40 p-8 flex flex-col justify-between shadow-2xl rotate-y-180 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {/* Inner elegant borders */}
                    <div className="absolute inset-2 border border-[#C5A059]/10 pointer-events-none rounded-xl" />

                    <div className="relative flex justify-between items-center text-[#C5A059]">
                      <span className="font-display font-bold text-xs">VALEUR 0{idx + 1}</span>
                      <Heart className="w-3.5 h-3.5 text-[#D4A5A5] fill-[#D4A5A5]/30" />
                    </div>

                    <div className="relative py-2 text-left">
                      <p className="font-serif text-base text-[#F7E7CE] font-light tracking-wide leading-relaxed mb-3 italic">
                        « {item.description} »
                      </p>
                      
                      <p className="font-sans text-xs text-[#E6D5B8] leading-relaxed font-light">
                        {item.sentiment}
                      </p>
                    </div>

                    <div className="relative text-right font-display text-[9px] text-stone-500 tracking-[0.15em] uppercase">
                      [ Toucher pour retourner ]
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
