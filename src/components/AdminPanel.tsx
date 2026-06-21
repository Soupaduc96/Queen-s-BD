/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Upload, Music, Sparkles, Image as ImageIcon, 
  RotateCcw, CheckCircle, Database, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { GalleryItem } from '../types';
import { saveAudioBlob, getAudioBlob, deleteAudioBlob } from '../utils/audioStorage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItems: GalleryItem[];
  onUpdateImage: (id: string, base64Data: string) => void;
  onResetImages: () => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  galleryItems,
  onUpdateImage,
  onResetImages,
}: AdminPanelProps) {
  const [audioStatus, setAudioStatus] = useState<'empty' | 'loading' | 'success'>('empty');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioName, setAudioName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load current audio state on mount or change
  const checkCurrentAudio = async () => {
    try {
      const blob = await getAudioBlob();
      if (blob) {
        setAudioStatus('success');
        setAudioName('main-romantic-soundtrack.mp3');
        
        // Retrieve duration
        const tempAudio = new Audio(URL.createObjectURL(blob));
        tempAudio.addEventListener('loadedmetadata', () => {
          setAudioDuration(tempAudio.duration);
        });
      } else {
        setAudioStatus('empty');
        setAudioDuration(0);
        setAudioName('');
      }
    } catch (e) {
      console.error(e);
      setAudioStatus('empty');
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkCurrentAudio();
    }
  }, [isOpen]);

  // Handle soundtrack file absorption
  const processAudioFile = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      setErrorMsg('Veuillez sélectionner un fichier audio valide (MP3).');
      return;
    }
    
    setErrorMsg('');
    setAudioStatus('loading');
    setAudioProgress(10);

    const interval = setInterval(() => {
      setAudioProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: file.type });
        
        // Save to IndexedDB
        await saveAudioBlob(blob);
        
        // Clear interval and set success
        clearInterval(interval);
        setAudioProgress(100);

        // Notify audio system to fetch newly loaded track
        window.dispatchEvent(new CustomEvent('romantic-soundtrack-updated'));

        setTimeout(() => {
          setAudioStatus('success');
          setAudioName('main-romantic-soundtrack.mp3');
          
          // Get duration
          const tempAudio = new Audio(URL.createObjectURL(blob));
          tempAudio.addEventListener('loadedmetadata', () => {
            setAudioDuration(tempAudio.duration);
          });
        }, 300);

      } catch (err) {
        clearInterval(interval);
        setErrorMsg("Erreur lors de l'enregistrement du fichier audio.");
        setAudioStatus('empty');
      }
    };
    
    reader.onerror = () => {
      clearInterval(interval);
      setErrorMsg("Erreur lors de la lecture du fichier.");
      setAudioStatus('empty');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleAudioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const triggerAudioSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleRemoveAudio = async () => {
    try {
      await deleteAudioBlob();
      setAudioStatus('empty');
      setAudioDuration(0);
      setAudioName('');
      window.dispatchEvent(new CustomEvent('romantic-soundtrack-updated'));
    } catch (e) {
      setErrorMsg("Impossible de supprimer la bande sonore.");
    }
  };

  // Gallery image handling
  const triggerImageSelect = (id: string) => {
    setActiveImageId(id);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImageId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High-end smart Compression to fit inside localStorage
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
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          onUpdateImage(activeImageId, compressedBase64);
        }
        setActiveImageId(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const formatAudioDuration = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs) || secs === 0) return "Durée inconnue";
    const minutes = Math.floor(secs / 60);
    const remainSecs = Math.floor(secs % 60);
    return `${minutes} min ${remainSecs.toString().padStart(2, '0')} s`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          {/* Hidden utility hardware ports */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAudioInputChange} 
            accept="audio/mp3,audio/*" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={imageInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl rounded-2xl border border-[#C5A059]/40 bg-[#0A0502]/95 p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-8 select-none my-8 max-h-[90vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background luxury highlights */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#C5A059]/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial-gradient from-[#D4A5A5]/5 to-transparent pointer-events-none" />

            {/* Header Title Board */}
            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#C5A059]/45 flex items-center justify-center bg-[#C5A059]/5">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#F7E7CE] font-light tracking-wide">
                    Console d'Ajustements
                  </h2>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#E6D5B8]/60">
                    Administration Premium de l'Écrin d'Amour
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-stone-800 bg-stone-900/40 hover:bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TWO SECTION SPLIT: 1. MUSIC, 2. MEMORIES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: AUDIO SOUNDTRACK UPLOAD CONTROL (12 cols in small, 5 cols in large) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2 border-b border-[#C5A059]/10 pb-2">
                  <Music className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-serif text-base text-[#F7E7CE] tracking-wide font-medium">
                    Bande Sonore Exclusive
                  </h3>
                </div>

                {/* Error Box */}
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                {/* Main Audio State Selector */}
                {audioStatus === 'empty' && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerAudioSelect}
                    className={`h-[190px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 ${
                      isDragging 
                        ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                        : 'border-[#C5A059]/30 hover:border-[#C5A059]/70 bg-stone-950/60 hover:bg-[#C5A059]/5'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-[#C5A059]/70 group-hover:text-[#F7E7CE] mb-3 animate-pulse" />
                    <p className="font-serif text-xs text-[#F7E7CE] font-semibold mb-1">
                      Déposez votre bande sonore officielle
                    </p>
                    <p className="text-[10px] text-[#E6D5B8]/60 max-w-[200px] leading-relaxed">
                      Format <span className="text-[#C5A059] font-mono">MP3</span> uniquement. (Sera sauvegardé comme <strong className="font-mono text-[9px]">main-romantic-soundtrack.mp3</strong>).
                    </p>
                  </div>
                )}

                {audioStatus === 'loading' && (
                  <div className="h-[190px] rounded-xl border border-[#C5A059]/20 bg-[#0A0502] flex flex-col items-center justify-center p-5 text-center space-y-4">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-[#C5A059]/20 border-t-[#C5A059] animate-spin" />
                      <Music className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <div className="space-y-1.5 w-full">
                      <p className="font-serif text-xs text-[#F7E7CE] font-semibold">
                        Absorption & Preloading Actif
                      </p>
                      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#C5A059] to-[#D4A5A5] h-full duration-300 transition-all rounded-full"
                          style={{ width: `${audioProgress}%` }}
                        />
                      </div>
                      <p className="font-mono text-[9px] text-[#E6D5B8]/60">
                        {audioProgress}% • Enregistrement en base
                      </p>
                    </div>
                  </div>
                )}

                {audioStatus === 'success' && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-[13px] text-stone-200 font-bold truncate">
                          Bande Sonore Intégrée !
                        </h4>
                        <p className="font-mono text-[8.5px] text-[#C5A059] uppercase tracking-wider truncate mt-0.5">
                          {audioName}
                        </p>
                        <p className="font-mono text-[9.5px] text-[#E6D5B8]/60 mt-1">
                          Durée lue : {formatAudioDuration(audioDuration)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      <button
                        onClick={triggerAudioSelect}
                        className="flex-1 py-1.5 px-3 rounded-lg border border-[#C5A059]/30 hover:border-[#C5A059] bg-stone-900/50 hover:bg-[#C5A059]/10 text-[#C5A059] hover:text-[#F7E7CE] text-[10.5px] font-serif transition-colors duration-200 font-semibold text-center cursor-pointer"
                      >
                        Changer le fichier
                      </button>
                      <button
                        onClick={handleRemoveAudio}
                        className="py-1.5 px-3 rounded-lg border border-red-500/30 hover:border-red-500 bg-red-950/10 hover:bg-red-900/30 text-red-400 hover:text-red-200 text-[10.5px] font-serif transition-colors duration-200 font-semibold cursor-pointer"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                )}

                {/* Helpful explanatory text */}
                <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800 text-[10.5px] text-[#E6D5B8]/75 leading-relaxed space-y-1.5">
                  <p className="text-[#C5A059] font-semibold font-serif">Note Techniques :</p>
                  <p>L’audio est stocké localement de manière sécurisée et ultra-fluide via le moteur autonome de votre navigateur.</p>
                  <p>Pour le rendre permanent partout (même sur d'autres ordinateurs), vous pourrez également copier votre fichier sous le nom exact de <strong className="font-mono text-emerald-300">public/main-romantic-soundtrack.mp3</strong> avant de publier.</p>
                </div>
              </div>

              {/* RIGHT COLUMN: MEMORIES GALLERY MANAGEMENT (7 cols in large) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between border-b border-[#C5A059]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="font-serif text-base text-[#F7E7CE] tracking-wide font-medium">
                      Galerie Terrestre & Photos
                    </h3>
                  </div>
                  <button
                    onClick={onResetImages}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#E6D5B8]/60 hover:text-[#C5A059] duration-300 cursor-pointer"
                    title="Réinitialiser toutes les photos"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Réinitialiser tout
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryItems.map((item, idx) => {
                    const displayUrl = item.customImageUrl || item.defaultImageUrl;
                    return (
                      <div 
                        key={item.id} 
                        className="rounded-xl overflow-hidden border border-stone-850 bg-stone-950/90 flex flex-col items-center p-2.5 relative group hover:border-[#C5A059]/40 duration-300"
                      >
                        {/* Thumbnail view */}
                        <div className="w-full aspect-square rounded-lg overflow-hidden relative bg-stone-900 border border-stone-800">
                          <img 
                            src={displayUrl} 
                            alt={item.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 duration-500"
                          />
                          <div className="absolute top-1 left-1 bg-black/75 rounded px-1.5 py-0.5 text-[8px] font-sans font-semibold text-[#C5A059]">
                            SLOT {idx + 1}
                          </div>
                        </div>

                        {/* Title text */}
                        <p className="font-serif text-[10px] text-[#F7E7CE] font-semibold truncate w-full mt-2 text-center" title={item.title}>
                          {item.title}
                        </p>
                        <p className="font-mono text-[7.5px] text-[#D4A5A5] uppercase tracking-wider text-center truncate w-full">
                          {item.quality}
                        </p>

                        {/* Hover Overlay button */}
                        <button
                          onClick={() => triggerImageSelect(item.id)}
                          className="mt-2 text-[9.5px] text-[#C5A059] hover:text-[#F7E7CE] border border-[#C5A059]/30 hover:border-[#C5A059] rounded-md px-2 py-0.5 bg-[#0D0B0A] hover:bg-[#C5A059]/10 duration-200 w-full text-center cursor-pointer"
                        >
                          Remplacer
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Admin Footer */}
            <div className="flex justify-end pt-3 border-t border-[#C5A059]/15">
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-full border border-[#C5A059] bg-[#C5A059] hover:bg-transparent text-black hover:text-[#F7E7CE] font-serif text-[11.5px] uppercase tracking-widest transition-all duration-300 shadow-md font-bold cursor-pointer hover:shadow-lg"
              >
                Fermer & Appliquer
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
