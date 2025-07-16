
"use client";

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react';

const AUDIO_VOLUME = 0.3;

type AudioOptions = {
    loop?: boolean;
    fade?: boolean;
    volume?: number;
};

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playAudio: (src: string, options?: AudioOptions) => void;
    stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [isMuted, setIsMuted] = useState(true); // Default to muted until client-side check
    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const sfxAudioRefs = useRef<Set<HTMLAudioElement>>(new Set());
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        try {
            const savedMuteState = localStorage.getItem('isMuted');
            setIsMuted(savedMuteState ? JSON.parse(savedMuteState) : false);
        } catch (error) {
            console.error("Could not parse mute state from localStorage", error)
            setIsMuted(false);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('isMuted', JSON.stringify(isMuted));
            if (musicAudioRef.current) {
                musicAudioRef.current.muted = isMuted;
            }
            sfxAudioRefs.current.forEach(audio => {
                audio.muted = isMuted;
            });
        } catch (error) {
            console.error("Could not save mute state to localStorage", error);
        }
    }, [isMuted]);

    const cleanupMusic = useCallback(() => {
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            musicAudioRef.current.src = ""; // Detach the source
            musicAudioRef.current = null;
        }
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    }, []);
    
    const fadeOut = useCallback((onComplete: () => void) => {
        if (!musicAudioRef.current || musicAudioRef.current.volume === 0) {
            onComplete();
            return;
        }
    
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
        const audio = musicAudioRef.current;
        fadeIntervalRef.current = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume = Math.max(0, audio.volume - 0.05);
            } else {
                audio.volume = 0;
                audio.pause();
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                onComplete();
            }
        }, 50);
    }, []);

    const playAudio = useCallback((src: string, options: AudioOptions = {}) => {
        const { loop = false, fade = false, volume = AUDIO_VOLUME } = options;

        if (loop) { // Handle looping music
            const startPlayback = () => {
                cleanupMusic();
                const audio = new Audio(src);
                audio.loop = true;
                audio.muted = isMuted;
                audio.volume = isMuted ? 0 : volume;
                audio.play().catch(error => console.error(`Music play failed for ${src}:`, error));
                musicAudioRef.current = audio;
            };

            const currentMusicSrc = musicAudioRef.current ? new URL(musicAudioRef.current.src).pathname : null;
            const newMusicSrc = new URL(src, window.location.origin).pathname;
            
            if (currentMusicSrc === newMusicSrc && !musicAudioRef.current?.paused) {
              return; // Already playing this track
            }

            if (fade && musicAudioRef.current) {
                fadeOut(startPlayback);
            } else {
                startPlayback();
            }
        } else { // Handle one-shot sound effects
            const sfx = new Audio(src);
            sfx.loop = false;
            sfx.muted = isMuted;
            sfx.volume = isMuted ? 0 : volume;
            sfx.play().catch(error => console.error(`SFX play failed for ${src}:`, error));
            
            sfxAudioRefs.current.add(sfx);
            sfx.onended = () => {
                sfxAudioRefs.current.delete(sfx);
            };
        }
    }, [isMuted, fadeOut, cleanupMusic]);

    const stopAudio = useCallback(() => {
        if (musicAudioRef.current) {
            fadeOut(() => {
                cleanupMusic();
            });
        }
    }, [fadeOut, cleanupMusic]);

    const toggleMute = () => {
        setIsMuted(prevMuted => !prevMuted);
    };

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute, playAudio, stopAudio }}>
            {children}
        </AudioContext.Provider>
    );
};
