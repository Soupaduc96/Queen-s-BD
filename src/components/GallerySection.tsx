/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';
import { FlickeringCandle, FlowerBouquetOrnament } from './LuxuryAestheticOverlays';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  onUpdateImage: (id: string, base64Data: string) => void;
  onResetImages: () => void;
}

export default function GallerySection({
  galleryItems,
  onUpdateImage,
  onResetImages,
}: GallerySectionProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleCardClick = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const triggerUpload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setUploadingId(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High-end smart Canvas Compression to fit inside localStorage (max 800px width/height)
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to JPEG with 0.75 quality for beautiful compression & small size
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          onUpdateImage(uploadingId, compressedBase64);
          
          // Also update selected modal item if open
          if (selectedItem && selectedItem.id === uploadingId) {
            setSelectedItem({
              ...selectedItem,
              customImageUrl: compressedBase64
            });
          }
        }
        setUploadingId(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="la-femme-exceptionnelle"
      className="relative min-h-screen bg-[#0A0502] py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,165,165,0.06)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Input hidden file stream */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onResetImages}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/30 hover:border-[#C5A059] text-[#E6D5B8] hover:text-[#F7E7CE] text-xs tracking-wider transition-colors duration-300 bg-[#151312] cursor-pointer"
              title="Réinitialiser les images"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rétablir les filtres d'origine
            </button>
          </motion.div>
        </div>

        {/* Cinematic Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {galleryItems.map((item, idx) => {
            const displayUrl = item.customImageUrl || item.defaultImageUrl;
            
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

                {/* Photo customization controls triggers on hover */}
                <button
                  onClick={(e) => triggerUpload(e, item.id)}
                  className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/80 border border-[#C5A059]/35 text-[#C5A059] hover:text-[#F7E7CE] hover:scale-110 duration-300 focus:outline-none"
                  title="Remplacer par sa propre photo"
                >
                  <Upload className="w-4 h-4" />
                </button>

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
                  src={selectedItem.customImageUrl || selectedItem.defaultImageUrl}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Image editor overlay */}
                <button
                  onClick={(e) => triggerUpload(e, selectedItem.id)}
                  className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-[#C5A059] text-[#C5A059] hover:text-[#F7E7CE] hover:scale-105 duration-300 transition-all text-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Remplacer l'image
                </button>
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
