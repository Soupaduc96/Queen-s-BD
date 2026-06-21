/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ArrowUp, Sparkles, Heart, ChevronDown } from 'lucide-react';
import { GalleryItem } from './types';
import IntroSection from './components/IntroSection';
import GallerySection from './components/GallerySection';
import QualitiesSection from './components/QualitiesSection';
import TimelineSection from './components/TimelineSection';
import ReasonsSection from './components/ReasonsSection';
import LetterSection from './components/LetterSection';
import FutureSection from './components/FutureSection';
import FinalSection from './components/FinalSection';
import AudioPlayer from './components/AudioPlayer';
import CinematicLoader from './components/CinematicLoader';
import { LivingParallaxBackground, RosePetalsRain, FlickeringCandle } from './components/LuxuryAestheticOverlays';

export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [introMode, setIntroMode] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize gallery items with premium luxury default parameters
  const defaultGallery: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Dignité & Beauté Royale',
      quality: 'Une Reine Céleste',
      description: 'Un rayonnement absolu qui capte la lumière naturelle, alliant charisme souverain et grâce intemporelle dans chaque regard.',
      defaultImageUrl: '/images/kai/kai-hero.jpg',
    },
    {
      id: 'g2',
      title: 'L\'Élégance de sa Démarche',
      quality: 'Grâce Souveraine',
      description: 'Chaque geste est une poésie muette. Du choix d’une tenue au port majestueux de la tête, l’élégance coule naturellement dans tes veines, ma belle Kai.',
      defaultImageUrl: '/images/kai/kai-portrait.jpg',
    },
    {
      id: 'g3',
      title: 'La Beauté de son Sourire',
      quality: 'Rayon de Soleil',
      description: 'Lorsque tes lèvres dessinent ce sourire espiègle et sincère, les nuages de mon quotidien s\'estompent pour laisser place à l’aurore, Kayoo.',
      defaultImageUrl: '/images/kai/kai-hero.jpg',
    },
    {
      id: 'g4',
      title: 'La Douceur de ses Gestes',
      quality: 'Havre Infini',
      description: 'Une bienveillance qui réconforte sans mot dire, comme la confiance immense que m’inspirent les battements chaleureux de ton cœur, mon Trésor.',
      defaultImageUrl: '/images/kai/kai-portrait.jpg',
    },
    {
      id: 'g5',
      title: 'Son Intelligence Vive',
      quality: 'Sagesse Dorée',
      description: 'Ta perception aiguisée des hommes et des choses enrichit mes journées. Ta curiosité intellectuelle et ton discernement absolu, Hun, me fascinent.',
      defaultImageUrl: '/images/kai/kai-hero.jpg',
    },
    {
      id: 'g6',
      title: 'Son Charisme Mystique',
      quality: 'Aura Majestueuse',
      description: 'Une présence irrésistible qui captive immédiatement tous ceux qui t\'entourent, sans effort apparent. Tu imposes le respect et la dévotion totale, Mammie.',
      defaultImageUrl: '/images/kai/kai-portrait.jpg',
    },
    {
      id: 'g7',
      title: 'La Noblesse de sa Force',
      quality: 'Pilier Secrète',
      description: 'Cachée derrière ta délicatesse divine bat une volonté de fer. Tu affrontes le monde avec dignité et courage, inspirant mon existence, ma Fanm vim.',
      defaultImageUrl: '/images/kai/kai-hero.jpg',
    },
    {
      id: 'g8',
      title: 'Sa Lumière Intérieure',
      quality: 'Éclat Divin',
      description: 'Une lueur immaculée qui provient du plus profond de ton âme précieuse, capable d\'illuminer et de guider celle de celui qui t\'aime, ma Manmi vim.',
      defaultImageUrl: '/images/kai/kai-portrait.jpg',
    }
  ];

  // Load and map photos on initial screen render, and handle scroll state
  useEffect(() => {
    setGalleryItems(defaultGallery);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automated background synchronization of the user-uploaded images to the server's public folder
  useEffect(() => {
    const syncAttachedImages = async () => {
      const targets = [
        {
          urls: [
            '/__aistudio_internal_control_plane/input_file_0.png',
            '/input_file_0.png',
            '/input_file_0'
          ],
          filename: 'kai-hero.jpg',
        },
        {
          urls: [
            '/__aistudio_internal_control_plane/input_file_1.png',
            '/input_file_1.png',
            '/input_file_1'
          ],
          filename: 'kai-portrait.jpg',
        }
      ];

      for (const t of targets) {
        let success = false;
        for (const url of t.urls) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const contentType = res.headers.get('content-type') || '';
              // Make sure we actually fetched an image, not the fallback html page
              if (contentType.startsWith('image/')) {
                const blob = await res.blob();
                const base64Data = await new Promise<string | null>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.onerror = () => resolve(null);
                  reader.readAsDataURL(blob);
                });

                if (base64Data) {
                  await fetch('/api/save-kai-asset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: t.filename, base64Data }),
                  });
                  console.log(`[Sync Client] Successfully saved ${t.filename} from ${url}`);
                  
                  // Instantly update the gallery to display newly synchronized images
                  setGalleryItems(prev => prev.map(item => {
                    const isHero = item.id.match(/[1357]/);
                    if (isHero && t.filename === 'kai-hero.jpg') {
                      return { ...item, defaultImageUrl: '/images/kai/kai-hero.jpg' };
                    } else if (!isHero && t.filename === 'kai-portrait.jpg') {
                      return { ...item, defaultImageUrl: '/images/kai/kai-portrait.jpg' };
                    }
                    return item;
                  }));
                  
                  // Dispatch update event to other luxury view layouts
                  window.dispatchEvent(new Event('kai-photos-updated'));
                  success = true;
                  break;
                }
              }
            }
          } catch (e) {
            // Silently try other urls
          }
        }
      }
    };

    syncAttachedImages();
  }, []);

  const handleIntroComplete = () => {
    // Wake up background audio system synchronously inside user click gesture frame!
    if (typeof (window as any).playSystemAudio === 'function') {
      try {
        (window as any).playSystemAudio();
      } catch (e) {
        console.warn("Autoplay gesture lock bypass:", e);
      }
    }
    setIntroMode(false);
    setIsPlayingAudio(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#0A0502] text-[#F7E7CE] font-sans leading-relaxed relative selection:bg-gold-500/20 antialiased duration-300 min-h-screen">
      
      {/* 20-year Golden Cinematic Living Slideshow Ambient Backdrop */}
      <LivingParallaxBackground />

      {/* High-Performance Canvas-Based Falling Rose Petals Rain */}
      <RosePetalsRain />
      
      {/* Background audio loop synth player */}
      <AudioPlayer isPlaying={isPlayingAudio} setIsPlaying={setIsPlayingAudio} />

      <AnimatePresence mode="wait">
        {showLoader ? (
          <motion.div
            key="cinematic-gift-box-loader"
            exit={{ opacity: 0, filter: 'blur(15px)' }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          >
            <CinematicLoader onOpen={() => {
              setShowLoader(false);
              setIsPlayingAudio(true);
            }} />
          </motion.div>
        ) : introMode ? (
          // STAGE 1: CINEMATIC INTRO FOR INTENSE EMOTION
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1] }}
          >
            <IntroSection onComplete={handleIntroComplete} />
          </motion.div>
        ) : (
          // STAGE 2: PRESTIGIOUS CORE EXPERIENCE
          <motion.div
            key="main-experience"
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col relative min-h-screen"
          >
            {/* Background Subtle Atmosphere */}
            <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
              <div className={`absolute top-[-5%] left-[-5%] w-[60%] h-[60%] rounded-full bg-[#C5A059] blur-[200px] ${isPlayingAudio ? 'animate-atmosphere-breathe' : ''}`} />
              <div className={`absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4A5A5] blur-[180px] ${isPlayingAudio ? 'animate-atmosphere-breathe' : ''}`} style={{ animationDelay: '1s' }} />
              <div className={`absolute top-[50%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#C5A059] blur-[150px] opacity-15 ${isPlayingAudio ? 'animate-atmosphere-breathe' : ''}`} style={{ animationDelay: '2s' }} />
            </div>

            {/* Luxury Corner Accents fixed or floating */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[#C5A059]/30 pointer-events-none z-30" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-[#C5A059]/30 pointer-events-none z-30" />

            {/* Elegant luxury navigation indicator */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#0A0502]/95 via-[#0A0502]/60 to-transparent backdrop-blur-[4px] py-4 px-8 border-b border-[#C5A059]/15 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 text-[#C5A059] fill-[#C5A059]/10 transition-transform ${isPlayingAudio ? 'animate-tempo-heartbeat text-[#D4A5A5] fill-[#D4A5A5]/25' : ''}`} />
                <span className="font-serif tracking-[0.2em] text-xs font-light text-[#E6D5B8]">
                  Mon Amour éternel
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <p className="font-display tracking-[0.3em] text-[10px] text-[#C5A059] uppercase font-bold">
                  Joyeux 20 ans • Vingt Ans d'Éclat
                </p>
              </div>
            </header>

            {/* Introductory scroll down hero banner */}
            <section className="h-screen w-full relative bg-[#0A0502] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,165,165,0.08)_0%,transparent_60%)] pointer-events-none" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2 }}
                className="space-y-6 relative z-10 max-w-2xl px-4"
              >
                <div className="flex items-center justify-center gap-2 text-[#C5A059]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="font-display tracking-[0.35em] text-[10px] font-bold uppercase text-[#D4A5A5]">
                    Un Cadeau Unique pour Un Être Rare
                  </span>
                </div>
                
                <h1 className="font-serif text-5xl md:text-7xl font-light tracking-wide text-[#F7E7CE] leading-[1.1]">
                  La Reine de <br /><span className="italic font-serif text-[#C5A059]">Mon Cœur, Kai</span>
                </h1>
                
                <p className="font-script text-4.5xl md:text-5xl text-[#D4A5A5] tracking-wide font-normal pt-2">
                  Vingt Ans d'Éclat de Mon Trésor, Kayoo
                </p>

                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto pt-4" />

                <p className="font-sans text-[#E6D5B8]/80 font-light max-w-md mx-auto italic text-xs md:text-sm pt-2 leading-relaxed">
                  « Ma Bien-Aimée, cet écrin de cinéma t'appartient. Fais défiler les tableaux célestes de mon attachement... »
                </p>
              </motion.div>

              {/* Scroll Indicator button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6, y: [0, 8, 0] }}
                transition={{ delay: 1.5, repeat: Infinity, duration: 2.2 }}
                className="absolute bottom-10 flex flex-col items-center gap-1.5 text-[#E6D5B8]/60 font-display text-[9.5px] tracking-widest uppercase cursor-pointer z-10"
                onClick={() => {
                  const el = document.getElementById('la-femme-exceptionnelle');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Faire défiler le film</span>
                <ChevronDown className="w-4 h-4 text-[#C5A059]" />
              </motion.div>
            </section>

            {/* Core Modules of the interactive celebration film */}
            <main className="w-full">
              
              {/* SECTION 2: LA FEMME EXCEPTIONNELLE (Gallery) */}
              <GallerySection
                galleryItems={galleryItems}
              />

              {/* SECTION 3: POURQUOI ELLE EST UNIQUE */}
              <QualitiesSection />

              {/* SECTION 4: NOTRE HISTOIRE (Timeline) */}
              <TimelineSection />

              {/* SECTION 5: 20 RAISONS DE T'AIMER (Tarot grid) */}
              <ReasonsSection />

              {/* SECTION 6: LETTRE À MON AMOUR (Envelope) */}
              <LetterSection />

              {/* SECTION 7: LE FUTUR (Interactive night stars canvas) */}
              <FutureSection />

              {/* SECTION 8: FINALE CINÉMATOGRAPHIQUE (Montage + gold rainfall) */}
              <FinalSection galleryItems={galleryItems} />

            </main>

            {/* Fine luxury brand footer */}
            <footer className="bg-[#0A0502] py-14 px-8 border-t border-[#C5A059]/15 text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Heart className="w-3.5 h-3.5 text-[#D4A5A5] fill-[#D4A5A5]/35" />
                <span className="font-serif text-sm text-[#C5A059] font-light tracking-widest italic">
                  Ma Reine, Mon Amour, Ma Bien-Aimée.
                </span>
              </div>
              
              <p className="font-display text-[10px] text-[#E6D5B8]/40 tracking-[0.25em] uppercase">
                Créé avec dévotion et amour • Vingt Ans d'Éclat • Juin 2026
              </p>
            </footer>

            {/* Scroll-to-top floating control */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={scrollToTop}
                  className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full border border-gold-400/20 glass-gold text-gold-300 hover:text-gold-100 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 duration-300 transition-all"
                  title="Revenir en haut du film"
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
