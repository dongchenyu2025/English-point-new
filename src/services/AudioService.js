// Audio service for handling sound playback
class AudioService {
    constructor() {
        this.currentAudio = null;
        this.audioCache = new Map();
    }

    // Preload audio file
    preloadAudio(audioUrl) {
        if (!this.audioCache.has(audioUrl)) {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = audioUrl;
            this.audioCache.set(audioUrl, audio);
        }
        return this.audioCache.get(audioUrl);
    }

    // Play audio with error handling - LOCAL AUDIO FIRST
    async playAudio(audioUrlOrWord, hotspotElement = null) {
        try {
            // Extract word from URL or use the word directly
            let word;
            if (audioUrlOrWord && audioUrlOrWord.includes('/')) {
                // It's a URL, extract filename
                word = audioUrlOrWord.split('/').pop().split('.')[0].replace('_', ' ');
            } else {
                // It's already a word
                word = audioUrlOrWord || '';
            }

            if (hotspotElement) {
                this.showHotspotRipple(hotspotElement);
            }

            let audioPlayed = false;

            // PRIORITY 1: Try local audio files first from audio folder
            if (word) {
                try {
                    console.log('🔊 AudioService: Trying local audio first for:', word);
                    audioPlayed = await this.tryLocalAudio(word);
                } catch (error) {
                    console.warn('🔊 AudioService: Local audio failed, trying provided URL:', error);
                }
            }

            // PRIORITY 2: Fallback to provided audio URL if local fails
            if (!audioPlayed && audioUrlOrWord && audioUrlOrWord.includes('/')) {
                try {
                    console.log('🔊 AudioService: Trying provided audio URL for:', audioUrlOrWord);
                    audioPlayed = await this.tryNativeAudio(audioUrlOrWord);
                } catch (error) {
                    console.warn('🔊 AudioService: Provided audio also failed, trying TTS:', error);
                }
            }

            // PRIORITY 3: Final fallback to TTS
            if (!audioPlayed && word && 'speechSynthesis' in window) {
                try {
                    console.log('🔊 AudioService: Using TTS fallback for:', word);
                    audioPlayed = await this.playTextToSpeech(word);
                } catch (error) {
                    console.warn('🔊 AudioService: TTS also failed:', error);
                }
            }

            if (!audioPlayed) {
                this.showSilentFeedback(word);
            }

            return audioPlayed;

        } catch (error) {
            console.error('Audio service error:', error);
            this.showErrorFeedback();
            return false;
        }
    }

    // Try to play audio from local audio folder
    async tryLocalAudio(word) {
        return new Promise((resolve) => {
            // Create possible audio file paths
            const possiblePaths = [
                `./src/assets/audio/${word}.MP3`,
                `./src/assets/audio/${word}.mp3`,
                `./src/assets/audio/${word.replace(' ', '_')}.MP3`,
                `./src/assets/audio/${word.replace(' ', '_')}.mp3`,
                `./src/assets/audio/${word.toLowerCase()}.MP3`,
                `./src/assets/audio/${word.toLowerCase()}.mp3`,
                `./src/assets/audio/${word.toLowerCase().replace(' ', '_')}.MP3`,
                `./src/assets/audio/${word.toLowerCase().replace(' ', '_')}.mp3`,
                `./src/assets/audio/${word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()}.MP3`,
                `./src/assets/audio/${word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()}.mp3`,
                `./src/assets/audio/${word.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_')}.MP3`,
                `./src/assets/audio/${word.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_')}.mp3`
            ];

            let attempts = 0;
            let resolved = false;

            const tryNextPath = () => {
                if (attempts >= possiblePaths.length) {
                    if (!resolved) {
                        resolved = true;
                        resolve(false);
                    }
                    return;
                }

                const path = possiblePaths[attempts];
                attempts++;

                const audio = new Audio(path);

                const timeout = setTimeout(() => {
                    if (!resolved) {
                        tryNextPath();
                    }
                }, 2000);

                audio.oncanplaythrough = () => {
                    clearTimeout(timeout);
                    if (!resolved) {
                        audio.play().then(() => {
                            resolved = true;
                            console.log('🔊 Successfully played local audio:', path);
                            resolve(true);
                        }).catch(() => {
                            tryNextPath();
                        });
                    }
                };

                audio.onerror = () => {
                    clearTimeout(timeout);
                    tryNextPath();
                };

                audio.load();
            };

            tryNextPath();
        });
    }

    async tryNativeAudio(audioUrl) {
        return new Promise((resolve) => {
            const audio = this.audioCache.get(audioUrl) || new Audio(audioUrl);

            let resolved = false;
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(false);
                }
            }, 3000);

            audio.oncanplaythrough = () => {
                if (!resolved) {
                    audio.play().then(() => {
                        clearTimeout(timeoutId);
                        resolved = true;
                        resolve(true);
                    }).catch(() => {
                        clearTimeout(timeoutId);
                        if (!resolved) {
                            resolved = true;
                            resolve(false);
                        }
                    });
                }
            };

            audio.onerror = () => {
                clearTimeout(timeoutId);
                if (!resolved) {
                    resolved = true;
                    resolve(false);
                }
            };

            if (audio.readyState >= 3) {
                audio.play().then(() => {
                    clearTimeout(timeoutId);
                    resolved = true;
                    resolve(true);
                }).catch(() => {
                    clearTimeout(timeoutId);
                    if (!resolved) {
                        resolved = true;
                        resolve(false);
                    }
                });
            } else {
                audio.load();
            }
        });
    }

    // Use browser's Text-to-Speech API (simplified, no central popup)
    async playTextToSpeech(text) {
        return new Promise((resolve) => {
            try {
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                }

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                utterance.pitch = 1;
                utterance.volume = 0.8;

                let resolved = false;
                const timeoutId = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve(false);
                    }
                }, 5000);

                utterance.onend = () => {
                    clearTimeout(timeoutId);
                    if (!resolved) {
                        resolved = true;
                        resolve(true);
                    }
                };

                utterance.onerror = () => {
                    clearTimeout(timeoutId);
                    if (!resolved) {
                        resolved = true;
                        resolve(false);
                    }
                };

                speechSynthesis.speak(utterance);

                setTimeout(() => {
                    if (!resolved && !speechSynthesis.speaking) {
                        resolved = true;
                        resolve(true);
                    }
                }, 100);

            } catch (error) {
                console.warn('Text-to-speech failed:', error);
                resolve(false);
            }
        });
    }

    showSilentFeedback(word) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            font-size: 1.1rem;
            font-weight: 500;
            text-align: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        feedback.innerHTML = `
            <div>🔊 ${word}</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">Click to hear pronunciation</div>
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    showErrorFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(220, 53, 69, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            font-size: 1rem;
            text-align: center;
        `;
        feedback.textContent = '⚠️ Audio temporarily unavailable';

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 1500);
    }

    // Show ripple effect around hotspot
    showHotspotRipple(hotspotElement) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 80px;
            height: 80px;
            border: 3px solid rgba(102, 126, 234, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: hotspotRipple 1s ease-out;
            pointer-events: none;
            z-index: 25;
        `;

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes hotspotRipple {
                0% {
                    width: 40px;
                    height: 40px;
                    opacity: 1;
                    border-width: 3px;
                }
                100% {
                    width: 120px;
                    height: 120px;
                    opacity: 0;
                    border-width: 1px;
                }
            }
        `;

        if (!document.querySelector('#hotspot-ripple-style')) {
            style.id = 'hotspot-ripple-style';
            document.head.appendChild(style);
        }

        hotspotElement.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    // Show visual feedback when audio fails (mobile fallback)
    showAudioFailedFeedback() {
        // Create a temporary visual indicator
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            font-size: 1rem;
        `;
        feedback.textContent = '🔊 Audio playing...';

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 1000);
    }

    // Preload all audio files for a scene
    preloadSceneAudio(vocabulary) {
        vocabulary.forEach(item => {
            this.preloadAudio(item.audio);
        });
    }

    // Stop all audio
    stopAll() {
        // Stop traditional audio
        if (this.currentAudio && !this.currentAudio.paused) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }

        // Stop text-to-speech
        if ('speechSynthesis' in window && speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
    }
}

// Initialize global instance
window.audioService = new AudioService();