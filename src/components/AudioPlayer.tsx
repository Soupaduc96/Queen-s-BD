/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Heart, Play, Pause, ChevronDown, ChevronUp, Youtube, Sparkles } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
}

declare global {
  interface Window {
    playSystemAudio?: () => void;
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
    romanticAudioProgress?: number;
    romanticAudioCurrentTime?: number;
    romanticAudioDuration?: number;
    romanticIsEndingScene?: boolean;
  }
}

// Global YouTube API loader manager
let apiReadyPromise: Promise<void> | null = null;
function loadYoutubeAPI(): Promise<void> {
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      resolve();
    };

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  });

  return apiReadyPromise;
}

export default function AudioPlayer({ isPlaying, setIsPlaying }: AudioPlayerProps) {
  const [isOpen, setIsOpen] = useState(true); // Open details panel initially
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Track Type: 'youtube' = Official Theme (MAJOR), 'local' = User uploaded MP3
  const [trackType, setTrackType] = useState<'youtube' | 'local'>('youtube');
  
  // Track existence of a loaded local audio soundtrack
  const [hasLocalSoundtrack, setHasLocalSoundtrack] = useState(false);
  const [audioSource, setAudioSource] = useState<string>('');
  
  // Unified soundtrack readiness flag
  const [hasSoundtrack, setHasSoundtrack] = useState(true);

  // Core Playback References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [ytReady, setYtReady] = useState(false);

  const fadeIntervalRef = useRef<any>(null);
  const isPlayingRef = useRef(isPlaying);
  const mutedRef = useRef(muted);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Smooth local HTML5 volume fade helper
  const fadeVolume = (targetVolume: number, durationMs = 1200, onComplete?: () => void) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    const stepTime = 50;
    const steps = durationMs / stepTime;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const currentRatio = currentStep / steps;
      let newVolume = startVolume + diff * currentRatio;

      if (newVolume < 0) newVolume = 0;
      if (newVolume > 1) newVolume = 1;

      audio.volume = newVolume;

      if (currentStep >= steps) {
        audio.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (onComplete) onComplete();
      }
    }, stepTime);
  };

  // Smooth YouTube volume fade helper (YT volume is scale 0 - 100)
  const fadeYoutubeVolume = (player: any, targetVolume0to100: number, durationMs = 1200, onComplete?: () => void) => {
    if (!player) return;
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    try {
      const startVol = player.getVolume();
      const diff = targetVolume0to100 - startVol;
      const stepTime = 50;
      const steps = durationMs / stepTime;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const currentRatio = currentStep / steps;
        let newVolume = startVol + diff * currentRatio;

        if (newVolume < 0) newVolume = 0;
        if (newVolume > 100) newVolume = 100;

        try {
          player.setVolume(Math.round(newVolume));
        } catch (e) {}

        if (currentStep >= steps) {
          try {
            player.setVolume(Math.round(targetVolume0to100));
          } catch (e) {}
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          if (onComplete) onComplete();
        }
      }, stepTime);
    } catch (err) {
      console.warn("Unable to perform interactive YouTube fade:", err);
    }
  };

  // 1. SOUNDTRACK ENGINE: LOCAL FILE DETECTOR
  const loadLocalSoundtrackSource = async () => {
    try {
      const response = await fetch('/main-romantic-soundtrack.mp3', { method: 'HEAD' });
      if (response.ok) {
        setAudioSource('/main-romantic-soundtrack.mp3');
        setHasLocalSoundtrack(true);
        return;
      }
    } catch (e) {
      console.log("No custom public offline files loaded yet.");
    }
    setHasLocalSoundtrack(false);
    setAudioSource('');
  };

  useEffect(() => {
    loadLocalSoundtrackSource();

    const handleUpdateEvent = () => {
      loadLocalSoundtrackSource();
    };

    window.addEventListener('romantic-soundtrack-updated', handleUpdateEvent);
    return () => {
      window.removeEventListener('romantic-soundtrack-updated', handleUpdateEvent);
    };
  }, []);

  // 2. SOUNDTRACK ENGINE: YOUTUBE CO-PROCESSOR INITIALIZATION
  useEffect(() => {
    if (trackType !== 'youtube') {
      if (ytPlayer) {
        try {
          ytPlayer.pauseVideo();
        } catch (e) {}
      }
      return;
    }

    let active = true;
    let playerInstance: any = null;

    const initYT = async () => {
      try {
        await loadYoutubeAPI();
        if (!active) return;

        if (window.YT && window.YT.Player) {
          playerInstance = new window.YT.Player('youtube-audio-player', {
            height: '1px',
            width: '1px',
            videoId: '8A7-54UguKg',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              loop: 1,
              playlist: '8A7-54UguKg',
              origin: window.location.origin
            },
            events: {
              onReady: (event: any) => {
                if (!active) return;
                const p = event.target;
                setYtPlayer(p);
                setYtReady(true);
                setIsPreloaded(true);
                setPreloadProgress(100);

                p.setVolume(0);
                if (isPlayingRef.current && !mutedRef.current) {
                  try {
                    p.playVideo();
                    fadeYoutubeVolume(p, 85, 1200);
                  } catch (e) {}
                }
              },
              onStateChange: (event: any) => {
                // Ensure state loop alignment
              }
            }
          });
        }
      } catch (err) {
        console.warn("YouTube player setup failed, falling back to gorgeous custom local files:", err);
      }
    };

    // Instantiate YouTube player after tiny microtask delay
    setTimeout(() => {
      if (active) initYT();
    }, 100);

    return () => {
      active = false;
      if (playerInstance) {
        try {
          playerInstance.destroy();
        } catch (e) {}
      }
      setYtPlayer(null);
      setYtReady(false);
    };
  }, [trackType]);

  // 3. SOUNDTRACK ENGINE: YOUTUBE LIVE METADATA POLL AND PROGRESS SYNC
  useEffect(() => {
    if (trackType !== 'youtube' || !ytPlayer || !ytReady) return;

    const interval = setInterval(() => {
      try {
        const cur = ytPlayer.getCurrentTime();
        const dur = ytPlayer.getDuration();
        
        if (dur > 0) {
          setCurrentTime(cur);
          setDuration(dur);
          
          const progress = cur / dur;
          (window as any).romanticAudioProgress = progress;
          (window as any).romanticAudioCurrentTime = cur;
          (window as any).romanticAudioDuration = dur;

          // Inject synchronous responsive CSS parameters!
          const root = document.documentElement;
          root.style.setProperty('--audio-progress', progress.toString());
          
          const candleGlow = (1.0 + progress * 0.95).toFixed(3);
          root.style.setProperty('--candle-glow', candleGlow);
          
          const goldBrightness = (0.5 + progress * 1.5).toFixed(3);
          root.style.setProperty('--gold-brightness', goldBrightness);
          
          const zoomScale = (1.0 + progress * 0.12).toFixed(3);
          root.style.setProperty('--scenic-zoom', zoomScale);

          // Volume rules: Smooth fade-out in remaining 5 seconds & fade-in in starting 3 seconds
          const secondsFromEnd = dur - cur;
          if (secondsFromEnd <= 5 && isPlayingRef.current && !mutedRef.current) {
            const fadeRatio = Math.max(0, secondsFromEnd / 5);
            ytPlayer.setVolume(Math.round(85 * fadeRatio));
          } else if (cur <= 3 && isPlayingRef.current && !mutedRef.current) {
            const fadeRatio = cur / 3;
            ytPlayer.setVolume(Math.round(85 * fadeRatio));
          } else if (isPlayingRef.current && !mutedRef.current) {
            ytPlayer.setVolume(85);
          }
        }
      } catch (e) {
        // Query locked temporarily
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [trackType, ytPlayer, ytReady]);

  // 4. SOUNDTRACK ENGINE: LOCAL AUDIO ENGINE CONFIGURATION AND ATTACHMENT
  useEffect(() => {
    if (trackType !== 'local' || !audioSource) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const oldAudio = audioRef.current;
    if (oldAudio) {
      oldAudio.pause();
    }

    const audio = new Audio(audioSource);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      const cur = audio.currentTime;
      setCurrentTime(cur);
      
      const dur = audio.duration;
      if (dur > 0) {
        setDuration(dur);
        const progress = cur / dur;
        
        (window as any).romanticAudioProgress = progress;
        (window as any).romanticAudioCurrentTime = cur;
        (window as any).romanticAudioDuration = dur;
        
        const root = document.documentElement;
        root.style.setProperty('--audio-progress', progress.toString());
        
        const candleGlow = (1.0 + progress * 0.95).toFixed(3);
        root.style.setProperty('--candle-glow', candleGlow);
        
        const goldBrightness = (0.5 + progress * 1.5).toFixed(3);
        root.style.setProperty('--gold-brightness', goldBrightness);
        
        const zoomScale = (1.0 + progress * 0.12).toFixed(3);
        root.style.setProperty('--scenic-zoom', zoomScale);

        const secondsFromEnd = dur - cur;
        if (secondsFromEnd <= 5 && isPlayingRef.current && !mutedRef.current) {
          const fadeRatio = Math.max(0, secondsFromEnd / 5);
          audio.volume = 0.85 * fadeRatio;
        } else if (cur <= 3 && isPlayingRef.current && !mutedRef.current) {
          const fadeRatio = cur / 3;
          audio.volume = 0.85 * fadeRatio;
        } else if (isPlayingRef.current && !mutedRef.current) {
          audio.volume = 0.85;
        }
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const totalDuration = audio.duration;
        if (totalDuration > 0) {
          const ratio = Math.round((bufferedEnd / totalDuration) * 100);
          setPreloadProgress(ratio);
          if (ratio >= 95) {
            setIsPreloaded(true);
          }
        }
      }
    };

    const onCanPlayThrough = () => {
      setIsPreloaded(true);
      setPreloadProgress(100);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('progress', onProgress);
    audio.addEventListener('canplaythrough', onCanPlayThrough);

    audio.load();

    if (isPlayingRef.current && !mutedRef.current) {
      audio.volume = 0;
      audio.play()
        .then(() => {
          fadeVolume(0.85, 1200);
        })
        .catch((err) => {
          console.log("Deferred local audio playback safely.", err);
        });
    }

    return () => {
      audio.pause();
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('progress', onProgress);
      audio.removeEventListener('canplaythrough', onCanPlayThrough);
      
      if (audioSource.startsWith('blob:')) {
        URL.revokeObjectURL(audioSource);
      }
    };
  }, [audioSource, trackType]);

  // 5. UNIFIED SOUND ENGINE: SWITCH PLAY / PAUSE / MUTE ACTIONS
  useEffect(() => {
    if (trackType === 'local') {
      const audio = audioRef.current;
      if (!audio || !hasLocalSoundtrack) return;

      if (isPlaying && !muted) {
        if (audio.paused) {
          audio.volume = 0;
          audio.play()
            .then(() => {
              fadeVolume(0.85, 1500);
            })
            .catch(() => {});
        } else {
          fadeVolume(0.85, 1200);
        }
      } else {
        if (!audio.paused) {
          fadeVolume(0, 1000, () => {
            if (!isPlayingRef.current || mutedRef.current) {
              audio.pause();
            }
          });
        }
      }
    } else if (trackType === 'youtube') {
      if (!ytPlayer || !ytReady) return;

      if (isPlaying && !muted) {
        try {
          ytPlayer.playVideo();
          fadeYoutubeVolume(ytPlayer, 85, 1500);
        } catch (e) {}
      } else {
        try {
          fadeYoutubeVolume(ytPlayer, 0, 1000, () => {
            if (!isPlayingRef.current || mutedRef.current) {
              ytPlayer.pauseVideo();
            }
          });
        } catch (e) {}
      }
    }
  }, [isPlaying, muted, trackType, ytPlayer, ytReady, hasLocalSoundtrack]);

  // 6. ADVERTISE playSystemAudio TRIGGER FOR CINEMATIC INTRO ENTRY GESTURE
  useEffect(() => {
    window.playSystemAudio = () => {
      setMuted(false);
      setIsPlaying(true);

      if (trackType === 'local') {
        const audio = audioRef.current;
        if (audio && hasLocalSoundtrack) {
          audio.volume = 0;
          audio.play()
            .then(() => {
              fadeVolume(0.85, 1500);
            })
            .catch((err) => {
              console.log("Audio gesture failure:", err);
            });
        }
      } else if (trackType === 'youtube') {
        if (ytPlayer && ytReady) {
          try {
            ytPlayer.setVolume(0);
            ytPlayer.playVideo();
            fadeYoutubeVolume(ytPlayer, 85, 1500);
          } catch (e) {}
        }
      }
    };

    return () => {
      delete window.playSystemAudio;
    };
  }, [setIsPlaying, trackType, ytPlayer, ytReady, hasLocalSoundtrack]);

  const handleMuteToggle = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);

    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (trackType === 'local' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    } else if (trackType === 'youtube' && ytPlayer && ytReady) {
      try {
        ytPlayer.seekTo(newTime, true);
      } catch (err) {}
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTrackTypeSwitch = (type: 'youtube' | 'local') => {
    if (type === 'local' && !hasLocalSoundtrack) {
      // Prompt upload instead or don't trigger if empty
      setIsOpen(true);
      return;
    }
    setTrackType(type);
    setIsPlaying(true);
  };

  return (
    <div id="premium-ambient-audio-station" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      
      {/* 1. HIDDEN IFRAME INLET BOX FOR YOUTUBE PLAYBACK */}
      <div 
        id="youtube-audio-player" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          left: '-9999px',
          top: '-9999px'
        }}
      />

      {/* 2. ELEGANT GLOWING CONTROL DRAWER PANEL */}
      {isOpen && (
        <div className="w-[315px] p-5 rounded-2xl border border-[#C5A059]/35 bg-[#0A0502]/95 backdrop-blur-xl shadow-2xl space-y-4 max-w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header Track Info */}
          <div className="flex items-center justify-between border-b border-[#C5A059]/15 pb-2.5">
            <div className="flex items-center gap-2">
              <Heart className={`w-3.5 h-3.5 text-[#D4A5A5] ${isPlaying && !muted ? 'animate-pulse' : ''}`} />
              <span className="font-serif text-[11px] tracking-[0.18em] font-medium text-[#E6D5B8] uppercase">
                Choix de la Bande Sonore
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#C5A059]/60 hover:text-[#F7E7CE] flex items-center gap-0.5 text-[9.5px] uppercase tracking-widest duration-200 cursor-pointer"
            >
              Cacher <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* DUAL ENGINE SWITCHING TABS */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#120B06] p-1 rounded-lg border border-[#C5A059]/10">
            <button
              onClick={() => handleTrackTypeSwitch('youtube')}
              className={`py-1 text-[9px] font-mono uppercase tracking-wider rounded duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                trackType === 'youtube'
                  ? 'bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#F7E7CE] font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Youtube className="w-3 h-3 text-[#C5A059]" />
              Officielle (MAJOR)
            </button>
            <button
              onClick={() => handleTrackTypeSwitch('local')}
              className={`py-1 text-[9px] font-mono uppercase tracking-wider rounded duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                trackType === 'local'
                  ? 'bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#F7E7CE] font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              } ${!hasLocalSoundtrack ? 'opacity-40 hover:opacity-100' : ''}`}
              title={!hasLocalSoundtrack ? "Aucun fichier MP3 encore importé" : ""}
            >
              <Music className="w-3 h-3" />
              Custom (MP3)
            </button>
          </div>

          {/* Active Sound Module Card */}
          <div className="bg-[#0A0502]/85 rounded-xl p-3.5 border border-[#C5A059]/15 flex items-center justify-between gap-3 relative overflow-hidden">
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div 
                  className={`w-11 h-11 rounded-full bg-gradient-to-tr from-[#1C120B]/90 to-[#2A1D15] border border-[#C5A059]/40 flex items-center justify-center shadow-lg transition-transform ${isPlaying && !muted ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '6s' }}
                >
                  <div className="w-4 h-4 rounded-full bg-[#0A0502] border border-[#C5A059]/20 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#C5A059]" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0D0B0A] border border-[#C5A059]/25 rounded-full flex items-center justify-center">
                  {trackType === 'youtube' ? (
                    <Youtube className="w-2.5 h-2.5 text-[#C5A059]" />
                  ) : (
                    <Music className="w-2.5 h-2.5 text-[#C5A059]" />
                  )}
                </div>
              </div>

              {/* Text label details */}
              <div className="min-w-0">
                <p className="font-serif text-[12.5px] text-[#F7E7CE] font-semibold truncate leading-tight">
                  {trackType === 'youtube' ? "Say You Won't Let Go" : "Bande d'Amour Romantique"}
                </p>
                <p className="font-mono text-[8px] text-[#E6D5B8]/55 uppercase mt-1 tracking-widest truncate">
                  {trackType === 'youtube' ? 'James Arthur (YouTube)' : 'main-romantic-soundtrack.mp3'}
                </p>
              </div>
            </div>

            {/* Main Play Action toggle button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full border border-[#C5A059]/40 hover:border-[#F7E7CE]/70 bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#F7E7CE] cursor-pointer flex items-center justify-center duration-200 transition-all shrink-0"
              title={isPlaying ? "Pause" : "Lancer"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* Luxury Music Seeker (Interactive Progress Bar) */}
          <div className="space-y-1.5 px-0.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#E6D5B8]/60">
              <span>{formatTime(currentTime)}</span>
              <span>{duration === 0 ? "--:--" : formatTime(duration)}</span>
            </div>
            
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-[3px] rounded-lg appearance-none focus:outline-none cursor-pointer bg-stone-700 accent-[#C5A059]"
              style={{
                background: `linear-gradient(to right, #C5A059 0%, #C5A059 ${(duration ? (currentTime / duration) : 0) * 100}%, #2e2824 ${(duration ? (currentTime / duration) : 0) * 100}%, #2e2824 100%)`
              }}
            />
          </div>

          {trackType === 'local' && !hasLocalSoundtrack && (
            <div className="p-3 rounded-xl bg-[#1C120B]/40 border border-[#C5A059]/15 text-stone-300 text-[10.5px] leading-relaxed">
              <span className="text-[#C5A059] font-semibold font-serif block mb-1">
                🎻 Musique MP3 absente :
              </span>
              Ajoutez un <strong className="text-[#F7E7CE]">MP3</strong> local via la console <strong className="text-[#F7E7CE]">Ajustements (en haut ⚙️)</strong> pour utiliser la piste personnalisée.
            </div>
          )}

          {trackType === 'youtube' && (
            <div className="p-2.5 rounded-lg bg-emerald-500/[0.02] border border-emerald-500/10 text-stone-300 text-[10px] leading-relaxed text-center">
              ✨ Bande sonore officielle chargée depuis YouTube.
            </div>
          )}

          {/* Bottom live frequency visualizer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#C5A059]/10">
            <p className="text-[10px] text-[#E6D5B8]/50 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying && !muted ? 'bg-emerald-400 animate-ping' : 'bg-red-400/60'}`} />
              {isPlaying && !muted ? 'Expérience synchronisée' : 'En sourdine'}
            </p>

            {isPlaying && !muted ? (
              <div className="flex items-end gap-[2px] h-3 px-1">
                <span className="w-[2px] bg-[#C5A059] rounded-full animate-bar-1" />
                <span className="w-[2px] bg-[#D4A5A5] rounded-full animate-bar-2" />
                <span className="w-[2px] bg-[#F7E7CE] rounded-full animate-bar-3" />
                <span className="w-[2px] bg-[#C5A059] rounded-full animate-bar-4" />
              </div>
            ) : (
              <span className="text-stone-600 text-[8.5px] font-mono tracking-wider">SILENCIEUX</span>
            )}
          </div>

        </div>
      )}

      {/* 3. COMPACT FLOATING PILLED TRIGGER BUTTONS */}
      <div className="flex items-center gap-2 bg-[#0A0502]/90 border border-[#C5A059]/25 p-1.5 rounded-full backdrop-blur-md shadow-2xl">
        
        {/* Equalizer visible only when sound waves are flowing */}
        {isPlaying && !muted && (
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-end justify-center gap-[3px] h-5 px-3 select-none cursor-pointer group animate-pulse" 
            title="Options de musique"
          >
            <span className="w-[3px] bg-[#C5A059] rounded-full animate-bar-1" />
            <span className="w-[3px] bg-[#D4A5A5] rounded-full animate-bar-2" />
            <span className="w-[3px] bg-[#F7E7CE] rounded-full animate-bar-3" />
            <span className="w-[3px] bg-[#C5A059] rounded-full animate-bar-4" />
          </div>
        )}

        {/* Toggle details drawer */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-[#C5A059]/15 bg-[#0A0502]/60 hover:bg-[#15100D] text-[#C5A059] hover:text-[#F7E7CE] shadow-sm hover:scale-105 duration-200 cursor-pointer"
          title="Ajuster la musique"
        >
          {isOpen ? <ChevronDown className="w-4 h-4 text-[#C5A059]" /> : <ChevronUp className="w-4 h-4 text-[#C5A059]" />}
        </button>

        {/* Mute/Unmute unified controller */}
        <button
          onClick={handleMuteToggle}
          className="flex items-center justify-center w-11 h-11 rounded-full border bg-gradient-to-br from-[#0A0502] via-[#1C120B] to-[#0A0502]/95 hover:scale-105 active:scale-95 duration-300 shadow-xl relative overflow-hidden text-[#C5A059] hover:text-[#F7E7CE] cursor-pointer border-[#C5A059]/35"
          title={muted || !isPlaying ? 'Activer le son' : 'Sourdine'}
        >
          {isPlaying && !muted && (
            <div className="absolute inset-0 bg-radial-gradient from-[#C5A059]/20 to-transparent animate-pulse pointer-events-none" />
          )}
          
          {muted || !isPlaying ? (
            <VolumeX className="w-4.5 h-4.5 text-red-400" />
          ) : (
            <Volume2 className="w-4.5 h-4.5 text-[#C5A059]" />
          )}
        </button>

      </div>

    </div>
  );
}
