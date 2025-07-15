
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
    const audioRef = useRef<HTMLAudioElement | null>(null);
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
            if (audioRef.current) {
                audioRef.current.muted = isMuted;
                audioRef.current.volume = isMuted ? 0 : (audioRef.current.dataset.volume ? parseFloat(audioRef.current.dataset.volume) : AUDIO_VOLUME);
            }
        } catch (error) {
            console.error("Could not save mute state to localStorage", error);
        }
    }, [isMuted]);

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
        const { loop = false, fade = false, volume = AUDIO_VOLUME } = options;

        const startPlayback = () => {
            cleanup();
            const audio = new Audio(src);
            audio.loop = loop;
            audio.muted = isMuted;
            audio.volume = isMuted ? 0 : volume;
            audio.dataset.volume = String(volume); // Store original volume
            audio.play().catch(error => console.error("Audio play failed:", error));
            audioRef.current = audio;
        };

        if (fade && audioRef.current && audioRef.current.src !== new URL(src, window.location.origin).href) {
            fadeOut(startPlayback);
        } else if (!audioRef.current || audioRef.current.src !== new URL(src, window.location.origin).href) {
            startPlayback();
        } else if (audioRef.current) {
             // If the same audio is playing, but it's not a looping track, replay it.
            if (!loop) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            } else if (audioRef.current.paused) {
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
        setIsMuted(prevMuted => !prevMuted);
    };

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute, playAudio, stopAudio }}>
            {children}
        </AudioContext.Provider>
    );
};
