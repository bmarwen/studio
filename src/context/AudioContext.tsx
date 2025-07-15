
"use client";

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

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
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const cleanup = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
        }
    };
    
    const fadeOut = useCallback((onComplete: () => void) => {
        if (!audioRef.current || audioRef.current.volume === 0) {
            onComplete();
            return;
        }
    
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
        const audio = audioRef.current;
        fadeIntervalRef.current = setInterval(() => {
            if (audio.volume > 0.1) {
                audio.volume -= 0.1;
            } else {
                audio.volume = 0;
                audio.pause();
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                onComplete();
            }
        }, 100);
    }, []);

    const playAudio = useCallback((src: string, options: AudioOptions = {}) => {
        const { loop = false, fade = false, volume = 0.5 } = options;

        const startPlayback = () => {
            cleanup();
            const audio = new Audio(src);
            audio.loop = loop;
            audio.muted = isMuted;
            audio.volume = isMuted ? 0 : volume;
            audio.play().catch(error => console.error("Audio play failed:", error));
            audioRef.current = audio;
        };

        if (fade && audioRef.current && audioRef.current.src !== new URL(src, window.location.origin).href) {
            fadeOut(startPlayback);
        } else if (!audioRef.current || audioRef.current.src !== new URL(src, window.location.origin).href) {
            startPlayback();
        } else {
             // If the same audio is playing, just ensure its state is correct
            if (audioRef.current.paused) {
                 audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            }
            audioRef.current.muted = isMuted;
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [isMuted, fadeOut]);

    const stopAudio = useCallback(() => {
        fadeOut(() => {
            cleanup();
        });
    }, [fadeOut]);

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        if (audioRef.current) {
            audioRef.current.muted = newMutedState;
            audioRef.current.volume = newMutedState ? 0 : 0.5;
        }
    };

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute, playAudio, stopAudio }}>
            {children}
        </AudioContext.Provider>
    );
};
