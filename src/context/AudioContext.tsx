
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
    const [isMuted, setIsMuted] = useState(true);
    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const sfxAudioRefs = useRef<Set<HTMLAudioElement>>(new Set());

    useEffect(() => {
        try {
            const savedMuteState = localStorage.getItem('isMuted');
            setIsMuted(savedMuteState ? JSON.parse(savedMuteState) : false);
        } catch (error) {
            console.error("Could not parse mute state from localStorage", error);
            setIsMuted(false);
        }
    }, []);

    const toggleMute = () => {
        setIsMuted(currentMuteState => {
            const newMuteState = !currentMuteState;
             try {
                localStorage.setItem('isMuted', JSON.stringify(newMuteState));
            } catch (error) {
                console.error("Could not save mute state to localStorage", error);
            }

            if (musicAudioRef.current) {
                musicAudioRef.current.muted = newMuteState;
                if (!newMuteState && musicAudioRef.current.paused) {
                    musicAudioRef.current.play().catch(e => console.error("Error resuming music:", e));
                }
            }
            sfxAudioRefs.current.forEach(sfx => {
                sfx.muted = newMuteState;
            });

            return newMuteState;
        });
    };
    
    const playAudio = useCallback((src: string, options: AudioOptions = {}) => {
        const { loop = false, volume = AUDIO_VOLUME } = options;

        if (loop) { // Music
            if (musicAudioRef.current && musicAudioRef.current.src.endsWith(src)) {
                if(musicAudioRef.current.paused && !isMuted) {
                    musicAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
                }
                return;
            }
            
            if(musicAudioRef.current) {
                musicAudioRef.current.pause();
            }

            const audio = new Audio(src);
            audio.loop = true;
            audio.volume = volume;
            audio.muted = isMuted;
            if(!isMuted) {
                audio.play().catch(e => console.error("Audio play failed:", e));
            }
            musicAudioRef.current = audio;

        } else { // Sound Effects
            const sfx = new Audio(src);
            sfx.volume = volume;
            sfx.muted = isMuted;
            if(!isMuted) {
                 sfx.play().catch(e => console.error("SFX play failed:", e));
            }

            sfxAudioRefs.current.add(sfx);
            sfx.addEventListener('ended', () => {
                sfxAudioRefs.current.delete(sfx);
            });
        }
    }, [isMuted]);

    const stopAudio = useCallback(() => {
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            musicAudioRef.current = null;
        }
        sfxAudioRefs.current.forEach(audio => audio.pause());
        sfxAudioRefs.current.clear();
    }, []);

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute, playAudio, stopAudio }}>
            {children}
        </AudioContext.Provider>
    );
};
