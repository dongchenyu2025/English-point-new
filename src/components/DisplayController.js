// Display controller - manages the phonetic/English/Chinese display modes
class DisplayController {
    constructor() {
        this.currentModes = {
            english: true,   // Default to English active
            phonetic: false,
            chinese: false
        };

        this.buttons = {
            english: document.getElementById('english-btn'),
            phonetic: document.getElementById('phonetic-btn'),
            chinese: document.getElementById('chinese-btn')
        };

        this.hotspots = [];
        this.bindEvents();
        this.initializeDefaultState();
    }

    // Initialize default state - English button active
    initializeDefaultState() {
        // Set English button as active
        if (this.buttons.english) {
            this.buttons.english.classList.add('active');
            console.log('✅ English button set as active by default');
        }

        // Make sure other buttons are not active
        if (this.buttons.phonetic) {
            this.buttons.phonetic.classList.remove('active');
        }
        if (this.buttons.chinese) {
            this.buttons.chinese.classList.remove('active');
        }
    }

    bindEvents() {
        // Bind button click events
        Object.keys(this.buttons).forEach(mode => {
            const button = this.buttons[mode];
            if (button) {
                button.addEventListener('click', () => {
                    this.toggleMode(mode);
                });
            }
        });
    }

    // Toggle display mode on/off
    toggleMode(mode) {
        // Toggle the mode
        this.currentModes[mode] = !this.currentModes[mode];

        // Update button appearance
        const button = this.buttons[mode];
        if (button) {
            if (this.currentModes[mode]) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }

        // Update all hotspots
        this.updateAllHotspots();

        // Add visual feedback
        this.showModeChangeFeedback(mode, this.currentModes[mode]);
    }

    // Update all registered hotspots
    updateAllHotspots() {
        this.hotspots.forEach(hotspot => {
            // Check if any mode is active
            const hasActiveMode = Object.values(this.currentModes).some(active => active);

            if (!hasActiveMode) {
                hotspot.hideDisplay();
                return;
            }

            // Show all active modes simultaneously
            hotspot.updateDisplay(this.currentModes);
        });
    }

    // Register hotspots for display control
    registerHotspots(hotspots) {
        this.hotspots = hotspots;
    }

    // Clear all hotspots
    clearHotspots() {
        this.hotspots = [];
    }

    // Reset to default modes (English active by default)
    resetModes() {
        // Set default state - English active
        this.currentModes = {
            english: true,
            phonetic: false,
            chinese: false
        };

        // Update button appearances
        Object.keys(this.currentModes).forEach(mode => {
            const button = this.buttons[mode];
            if (button) {
                if (this.currentModes[mode]) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });

        // Update all hotspots to show English labels
        this.updateAllHotspots();
    }

    // Show visual feedback for mode change
    showModeChangeFeedback(mode, isActive) {
        const modeNames = {
            phonetic: '音标',
            english: '英语',
            chinese: '中文'
        };

        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isActive ? '#48bb78' : '#e53e3e'};
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            z-index: 1000;
            font-size: 0.9rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        feedback.textContent = `${modeNames[mode]} ${isActive ? '开启' : '关闭'}`;

        document.body.appendChild(feedback);

        // Animate in
        setTimeout(() => {
            feedback.style.opacity = '1';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 1500);
    }

    // Get current active modes
    getCurrentModes() {
        return { ...this.currentModes };
    }
}