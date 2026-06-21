/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';
import { FlickeringCandle, FlowerBouquetOrnament } from './LuxuryAestheticOverlays';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export default function GallerySection({
  galleryItems,
}: GallerySectionProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleCardClick = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  return (
    <section
      id="la-femme-exceptionnelle"
      className="relative min-h-screen bg-[#0A0502] py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,165,165,0.06)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl w-full flex flex-col items-center gap-16 relative z-10">
        
        {/* Glamour Header */}
        <div className="text-center space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display tracking-[0.3em] text-xs font-semibold text-[#C5A059] uppercase"
          >
            Miroir Sacré de l'Élégance
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#F7E7CE] tracking-wide"
          >
            La Femme Exceptionnelle
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="font-sans font-light sm:max-w-xl mx-auto text-[#E6D5B8]/80 italic text-sm md:text-base leading-relaxed"
          >
            « Huit facettes divines d'une âme majestueuse, célébrées à travers la lumière de son être... »
          </motion.p>
        </div>

        {/* Cinematic Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {galleryItems.map((item, idx) => {
            const displayUrl = item.defaultImageUrl;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleCardClick(item)}
                className="group relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden glass-gold glass-gold-hover cursor-pointer duration-500 shadow-2xl flex flex-col justify-end p-6 select-none"
              >
                {/* Background image component */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={displayUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 filter brightness-[0.7] group-hover:brightness-[0.5]"
                  />
                  {/* Luxury soft golden overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0502] via-[#0A0502]/40 to-transparent opacity-90" />
                </div>

                {/* Card description text */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-1.5 text-[#C5A059]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-display uppercase tracking-[0.2em] text-[10px] font-semibold text-[#D4A5A5]">
                      {item.quality}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-xl text-[#F7E7CE] tracking-wide font-light">
                    {item.title}
                  </h3>
                  
                  <p className="font-sans text-xs text-[#E6D5B8]/70 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cinematic Media Inspector Modal for full view */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0502]/95 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-4xl w-full rounded-2xl overflow-hidden glass-gold flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Image wrapper */}
              <div className="w-full md:w-1/2 h-[350px] md:h-[500px] relative">
                <img
                  src={selectedItem.defaultImageUrl}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Descriptions */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6 bg-[#1A1817]/95 text-left">
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-display font-semibold tracking-widest uppercase">
                  <ImageIcon className="w-4 h-4" />
                  <span>{selectedItem.quality}</span>
                </div>
                
                <h3 className="font-serif text-3xl text-[#F7E7CE] tracking-wide font-light">
                  {selectedItem.title}
                </h3>
                
                <div className="w-12 h-[1px] bg-gradient-to-r from-[#C5A059] to-transparent" />
                
                <p className="font-sans text-[#E6D5B8] font-light leading-relaxed text-sm md:text-base italic">
                  « {selectedItem.description} »
                </p>

                <p className="font-serif text-xs text-[#C5A059] italic font-light pt-4 border-t border-[#C5A059]/15">
                  Mon Amour, ta présence transforme chaque instant de la vie en un chef-d’œuvre d'élégance et d’émotion pure.
                </p>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="self-start mt-4 text-xs font-display tracking-[0.2em] font-medium text-[#E6D5B8]/60 hover:text-[#C5A059] uppercase transition-all duration-300 cursor-pointer"
                >
                  [ Fermer la vue ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exquisite candlelit flanking ornaments */}
      <div className="absolute bottom-6 left-8 z-0 flex gap-3.5 items-end opacity-40 xl:opacity-80 scale-75 md:scale-100 origin-bottom-left pointer-events-none">
        <FlickeringCandle size="sm" delay={0.3} />
        <FlickeringCandle size="md" delay={1.1} />
      </div>

      <FlowerBouquetOrnament className="absolute bottom-6 right-8 z-0 scale-75 md:scale-90 opacity-40 xl:opacity-80 pointer-events-none" />
    </section>
  );
}
