// Word hotspot component - handles individual clickable word points with marking functionality
class WordHotspot {
    constructor(wordData, container) {
        this.wordData = wordData;
        this.container = container;
        this.element = null;
        this.label = null;
        this.isClicked = false;
        this.markingPanel = null;
        this.isVisible = true; // 用于筛选显示

        this.create();
        this.bindEvents();
        this.updateStatus(); // 初始化状态
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'hotspot';

        const position = this.validatePosition(this.wordData.position);
        this.element.style.left = position.x;
        this.element.style.top = position.y;
        this.element.style.transform = 'translate(-50%, -50%)';

        const marker = document.createElement('div');
        marker.className = 'hotspot-marker';
        marker.innerHTML = '●';

        this.labels = {
            phonetic: this.createLabel(),
            english: this.createLabel(),
            chinese: this.createLabel()
        };

        // 创建标记面板
        this.createMarkingPanel();

        this.element.appendChild(marker);
        Object.values(this.labels).forEach(label => {
            this.element.appendChild(label);
        });
        this.element.appendChild(this.markingPanel);

        try {
            this.container.appendChild(this.element);
        } catch (error) {
            console.error('Failed to append hotspot to container:', error);
            this.showPositionError();
        }
    }

    createMarkingPanel() {
        this.markingPanel = document.createElement('div');
        this.markingPanel.className = 'marking-panel';
        this.markingPanel.innerHTML = `
            <button class="marking-btn known-btn" data-status="known">认识</button>
            <button class="marking-btn unknown-btn" data-status="unknown">不认识</button>
        `;
    }

    validatePosition(position) {
        const x = this.sanitizePercentage(position.x);
        const y = this.sanitizePercentage(position.y);

        if (x < 0 || x > 100 || y < 0 || y > 100) {
            console.warn(`Invalid hotspot position for ${this.wordData.word}: x=${x}%, y=${y}%`);
            return { x: '50%', y: '50%' };
        }

        return { x: `${x}%`, y: `${y}%` };
    }

    sanitizePercentage(value) {
        if (typeof value === 'string') {
            value = parseFloat(value.replace('%', ''));
        }
        return isNaN(value) ? 50 : Math.max(0, Math.min(100, value));
    }

    showPositionError() {
        console.error(`Hotspot positioning error for word: ${this.wordData.word}`);

        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(220, 53, 69, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            z-index: 1001;
            font-size: 0.9rem;
        `;
        errorDiv.textContent = `⚠️ Position error: ${this.wordData.word}`;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    createLabel() {
        const label = document.createElement('div');
        label.className = 'word-label';
        label.style.left = '50%';
        label.style.top = '0';
        return label;
    }

    bindEvents() {
        // 点击热点播放音频
        const handleInteraction = (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.handleClick();
        };

        this.element.addEventListener('click', handleInteraction);
        this.element.addEventListener('touchstart', handleInteraction, { passive: false });

        this.element.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });

        // 鼠标悬停显示标记面板
        this.element.addEventListener('mouseenter', () => {
            this.showMarkingPanel();
        });

        this.element.addEventListener('mouseleave', () => {
            this.hideMarkingPanel();
        });

        // 标记按钮事件
        this.markingPanel.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const btn = e.target.closest('.marking-btn');
            if (btn) {
                const status = btn.dataset.status;
                this.markWord(status);
            }
        });

        // 监听进度更新事件，更新状态
        window.addEventListener('progressUpdated', (e) => {
            if (e.detail.word === this.wordData.word) {
                this.updateStatus();
            }
        });
    }

    async handleClick() {
        console.log('🔊 WordHotspot clicked:', this.wordData.word);

        // Visual feedback
        const marker = this.element.querySelector('.hotspot-marker');
        marker.classList.add('clicked');

        setTimeout(() => {
            marker.classList.remove('clicked');
        }, 500);

        // Use AudioService for pronunciation (which now prioritizes local audio files)
        try {
            if (window.audioService) {
                // Try to play audio using AudioService (local files first, then TTS)
                const played = await window.audioService.playAudio(this.wordData.audio || '', this.element);
                console.log('🔊 AudioService result:', played ? 'Success' : 'Failed');
            } else {
                // Fallback to direct TTS if AudioService is not available
                const utterance = new SpeechSynthesisUtterance(this.wordData.word);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
                console.log('🔊 Direct TTS fallback:', this.wordData.word);
            }
        } catch (error) {
            console.log('🔊 发音失败:', error);
            // Show visual feedback even if audio fails
            this.showWordFeedback();
        }

        // Mark as clicked
        this.isClicked = true;

        // Trigger custom event for tracking
        this.element.dispatchEvent(new CustomEvent('wordClicked', {
            detail: this.wordData,
            bubbles: true
        }));
    }

    // 显示单词信息的视觉反馈（当TTS失败时）
    showWordFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(102, 126, 234, 0.95);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            z-index: 1000;
            text-align: center;
            font-size: 1.2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
        `;

        feedback.innerHTML = `
            <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 0.5rem;">${this.wordData.word}</div>
            <div style="font-size: 1rem; margin: 0.5rem 0; color: #E0E7FF;">${this.wordData.phonetic}</div>
            <div style="font-size: 1.1rem;">${this.wordData.chinese}</div>
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 2500);
    }

    // Update label display based on current modes
    updateDisplay(modes) {
        const activeLabels = [];
        let yOffset = -25; // 更靠近热点的起始位置 (从-50改为-25)

        // Update each label based on its mode
        Object.keys(modes).forEach(mode => {
            const label = this.labels[mode];
            if (modes[mode]) {
                // Show this mode
                let content = '';
                switch (mode) {
                    case 'phonetic':
                        content = this.wordData.phonetic;
                        break;
                    case 'english':
                        content = this.wordData.word;
                        break;
                    case 'chinese':
                        content = this.wordData.chinese;
                        break;
                }

                label.textContent = content;
                label.style.transform = `translateX(-50%) translateY(${yOffset}px)`;
                label.classList.add('show');
                activeLabels.push(label);
                yOffset -= 22; // 更紧凑的间距 (从35改为22)
            } else {
                // Hide this mode
                label.classList.remove('show');
            }
        });
    }

    // Hide all labels
    hideDisplay() {
        Object.values(this.labels).forEach(label => {
            label.classList.remove('show');
        });
    }

    // Get word data
    getWordData() {
        return this.wordData;
    }

    // Remove hotspot from DOM
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    // 显示标记面板
    showMarkingPanel() {
        this.markingPanel.classList.add('show');
    }

    // 隐藏标记面板
    hideMarkingPanel() {
        this.markingPanel.classList.remove('show');
    }

    // 标记单词
    markWord(status) {
        if (window.userProgressService) {
            window.userProgressService.setWordStatus(this.wordData.word, status);
            this.updateStatus();
            this.hideMarkingPanel();
        }
    }

    // 更新热点状态显示
    updateStatus() {
        if (!window.userProgressService) return;

        const status = window.userProgressService.getWordStatus(this.wordData.word);
        const marker = this.element.querySelector('.hotspot-marker');

        // 移除所有状态类
        marker.classList.remove('status-known', 'status-unknown', 'status-unmarked');

        // 添加当前状态类
        marker.classList.add(`status-${status}`);

        // 更新热点整体状态
        this.element.dataset.wordStatus = status;
    }

    // 设置可见性（用于筛选）
    setVisible(visible) {
        this.isVisible = visible;
        this.element.style.display = visible ? 'block' : 'none';
    }

    // 获取单词状态
    getWordStatus() {
        return window.userProgressService ?
            window.userProgressService.getWordStatus(this.wordData.word) : 'unmarked';
    }

    // 检查是否匹配筛选条件
    matchesFilter(filter) {
        if (filter === 'all') return true;

        const status = this.getWordStatus();
        return status === filter;
    }
}