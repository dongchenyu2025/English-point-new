// Scene page component - handles the interactive scene experience with word marking
class ScenePage {
    constructor() {
        this.element = document.getElementById('scenepage');
        this.currentScene = null;
        this.hotspots = [];
        this.currentFilter = 'all';

        this.createFilterTabs(); // 先创建HTML结构
        this.displayController = new DisplayController(); // 再初始化DisplayController
        this.bindEvents();
    }

    createFilterTabs() {
        // 在场景头部添加筛选标签栏 - 基于 index-2.html 结构
        const sceneHeader = this.element.querySelector('.scene-header');

        // 重新构建头部结构
        sceneHeader.innerHTML = `
            <div class="scene-title-row">
                <button id="back-btn" class="back-button">← 返回</button>
                <h2 id="scene-title">Scene Name</h2>
            </div>
            <div class="controls-and-filters">
                <div class="word-filters">
                    <button class="filter-tab active" data-filter="all">
                        <span class="filter-label">全部</span>
                        <span class="filter-count">0</span>
                    </button>
                    <button class="filter-tab" data-filter="unmarked">
                        <span class="filter-label">未标记</span>
                        <span class="filter-count">0</span>
                    </button>
                    <button class="filter-tab" data-filter="known">
                        <span class="filter-label">认识</span>
                        <span class="filter-count">0</span>
                    </button>
                    <button class="filter-tab" data-filter="unknown">
                        <span class="filter-label">不认识</span>
                        <span class="filter-count">0</span>
                    </button>
                </div>
                <div class="display-controls">
                    <button id="english-btn" class="display-btn active">英文</button>
                    <button id="phonetic-btn" class="display-btn">音标</button>
                    <button id="chinese-btn" class="display-btn">中文</button>
                </div>
            </div>
        `;

        // 重新获取元素引用
        this.sceneTitle = document.getElementById('scene-title');
        this.backButton = document.getElementById('back-btn');
        this.sceneImage = document.getElementById('scene-image');
        this.hotspotsContainer = document.getElementById('hotspots-container');
        this.filterContainer = sceneHeader.querySelector('.word-filters');
    }

    bindEvents() {
        // Back button functionality
        this.backButton.addEventListener('click', () => {
            this.navigateBack();
        });

        // Listen for word clicks
        this.element.addEventListener('wordClicked', (e) => {
            this.handleWordClick(e.detail);
        });

        // Handle image load events
        this.sceneImage.addEventListener('load', () => {
            this.onImageLoaded();
        });

        // Handle image error
        this.sceneImage.addEventListener('error', () => {
            this.handleImageError();
        });

        // 筛选标签事件
        this.filterContainer.addEventListener('click', (e) => {
            const filterTab = e.target.closest('.filter-tab');
            if (filterTab) {
                const filter = filterTab.dataset.filter;
                this.switchFilter(filter);
            }
        });

        // 监听进度更新事件
        window.addEventListener('progressUpdated', () => {
            this.updateFilterCounts();
            this.applyCurrentFilter();
        });

        // 监听窗口大小变化，重新调整hotspots容器
        window.addEventListener('resize', () => {
            if (this.currentScene) {
                setTimeout(() => {
                    this.adjustHotspotsContainer();
                }, 100);
            }
        });
    }

    async loadScene(sceneId) {
        try {
            // Get scene data
            this.currentScene = window.sceneDataService.getScene(sceneId);

            if (!this.currentScene) {
                throw new Error(`Scene not found: ${sceneId}`);
            }

            // Update title
            this.sceneTitle.textContent = this.currentScene.name;

            // Clear previous hotspots
            this.clearHotspots();

            // Reset display modes
            this.displayController.resetModes();

            // Load scene image
            await this.loadSceneImage();

            // Create hotspots
            this.createHotspots();

            // Register hotspots and show default English labels
            this.displayController.registerHotspots(this.hotspots);

            // Force update to ensure English labels are shown
            setTimeout(() => {
                this.displayController.updateAllHotspots();
                // 初始化筛选计数和状态
                this.updateFilterCounts();
                this.resetFilter();
                // 确保hotspots容器正确调整
                this.adjustHotspotsContainer();
            }, 100);

            // Preload audio
            window.audioService.preloadSceneAudio(this.currentScene.vocabulary);

            // Add entrance animation
            this.element.classList.add('fade-in');
            setTimeout(() => {
                this.element.classList.remove('fade-in');
            }, 300);

        } catch (error) {
            console.error('Failed to load scene:', error);
            this.showError('Failed to load scene. Please try again.');
        }
    }

    async loadSceneImage() {
        const sceneId = this.currentScene?.id || 'default';
        const realImagePath = `src/assets/images/scenes/${sceneId}.jpg`;

        this.showImageLoadingIndicator();

        return new Promise((resolve, reject) => {
            const img = new Image();
            let loadTimeout;

            const cleanupAndResolve = () => {
                clearTimeout(loadTimeout);
                this.hideImageLoadingIndicator();
                resolve();
            };

            const handleError = (errorType) => {
                clearTimeout(loadTimeout);
                console.warn(`Image loading failed (${errorType}) for ${sceneId}, using placeholder`);

                const sceneNames = {
                    kitchen: 'Kitchen',
                    living: 'Living Room',
                    park: 'Park',
                    school: 'School',
                    market: 'Market',
                    classroom: 'Classroom'
                };

                const sceneName = sceneNames[sceneId] || sceneId;
                this.sceneImage.src = `https://via.placeholder.com/1200x800/DDA0DD/333333?text=${encodeURIComponent(sceneName)}`;
                this.hideImageLoadingIndicator();
                resolve();
            };

            img.onload = () => {
                try {
                    this.sceneImage.src = realImagePath;

                    // 智能检测图片比例，设置对应的显示模式
                    const imageAspectRatio = img.naturalWidth / img.naturalHeight;
                    const targetRatio = 3 / 4; // 0.75
                    const tolerance = 0.02; // 2%容差，更精确

                    console.log(`📏 图片尺寸: ${img.naturalWidth}x${img.naturalHeight}, 比例: ${imageAspectRatio.toFixed(3)}`);

                    if (Math.abs(imageAspectRatio - targetRatio) < tolerance) {
                        // 标准3:4图片，完整显示
                        this.sceneImage.parentElement.setAttribute('data-aspect', '3-4');
                        console.log('✅ 检测到标准3:4图片，使用完整显示模式 (object-fit: contain)');
                    } else {
                        // 非标准比例图片，需要裁剪适配
                        this.sceneImage.parentElement.setAttribute('data-aspect', 'non-standard');
                        console.log('🔄 检测到非标准图片，使用智能裁剪模式 (object-fit: cover)', `${img.naturalWidth}x${img.naturalHeight}`);
                    }

                    cleanupAndResolve();
                } catch (error) {
                    console.error('Error setting image source:', error);
                    handleError('src-assignment');
                }
            };

            img.onerror = () => handleError('load-failed');

            loadTimeout = setTimeout(() => {
                handleError('timeout');
            }, 8000);

            try {
                img.src = realImagePath;
            } catch (error) {
                console.error('Error initiating image load:', error);
                handleError('init-failed');
            }
        });
    }

    // Generate placeholder image for demo
    getPlaceholderImage(sceneId) {
        // Using a placeholder service with scene-appropriate colors
        const colors = {
            kitchen: '87CEEB',
            living: 'DDA0DD',
            park: '90EE90',
            school: 'FFB6C1',
            market: 'F0E68C'
        };

        const color = colors[sceneId] || 'CCCCCC';
        return `https://via.placeholder.com/1200x800/${color}/333333?text=${this.currentScene.name}`;
    }

    createHotspots() {
        this.currentScene.vocabulary.forEach(wordData => {
            const hotspot = new WordHotspot(wordData, this.hotspotsContainer);
            this.hotspots.push(hotspot);
        });
    }

    clearHotspots() {
        this.hotspots.forEach(hotspot => {
            hotspot.destroy();
        });
        this.hotspots = [];
        this.displayController.clearHotspots();
    }

    handleWordClick(wordData) {
        console.log('Word clicked:', wordData.word);

        // Could add learning progress tracking here in V2
        // For now, just log the interaction
    }

    showImageLoadingIndicator() {
        if (!this.loadingIndicator) {
            this.loadingIndicator = document.createElement('div');
            this.loadingIndicator.className = 'loading-indicator';
            this.loadingIndicator.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading scene...</div>
            `;
            this.hotspotsContainer.appendChild(this.loadingIndicator);
        }
        this.loadingIndicator.style.display = 'flex';
    }

    hideImageLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    onImageLoaded() {
        this.hideImageLoadingIndicator();
        console.log('Scene image loaded successfully');

        // 关键修复：调整hotspots容器以匹配图片实际显示区域
        this.adjustHotspotsContainer();
    }

    adjustHotspotsContainer() {
        const img = this.sceneImage;
        const container = this.hotspotsContainer;

        if (!img || !container) return;

        // 获取图片的自然尺寸和显示尺寸
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        const displayWidth = img.offsetWidth;
        const displayHeight = img.offsetHeight;

        // 计算图片的显示比例
        const imageRatio = naturalWidth / naturalHeight;
        const containerRatio = displayWidth / displayHeight;

        let actualWidth, actualHeight, offsetX, offsetY;

        if (imageRatio > containerRatio) {
            // 图片宽度受限，高度有黑边
            actualWidth = displayWidth;
            actualHeight = displayWidth / imageRatio;
            offsetX = 0;
            offsetY = (displayHeight - actualHeight) / 2;
        } else {
            // 图片高度受限，宽度有黑边
            actualWidth = displayHeight * imageRatio;
            actualHeight = displayHeight;
            offsetX = (displayWidth - actualWidth) / 2;
            offsetY = 0;
        }

        // 调整hotspots容器以匹配图片实际显示区域
        container.style.width = actualWidth + 'px';
        container.style.height = actualHeight + 'px';
        container.style.left = offsetX + 'px';
        container.style.top = offsetY + 'px';

        console.log('Hotspots container adjusted:', {
            actualWidth, actualHeight, offsetX, offsetY
        });
    }

    handleImageError() {
        console.error('Scene image failed to load, using fallback');
        this.hideImageLoadingIndicator();

        const sceneId = this.currentScene?.id || 'default';
        const sceneNames = {
            kitchen: 'Kitchen',
            living: 'Living Room',
            park: 'Park',
            school: 'School',
            market: 'Market',
            classroom: 'Classroom'
        };
        const sceneName = sceneNames[sceneId] || sceneId;
        this.sceneImage.src = `https://via.placeholder.com/1200x800/CCCCCC/333333?text=${encodeURIComponent(sceneName)}+Scene`;
    }

    navigateBack() {
        // Stop any playing audio
        window.audioService.stopAll();

        // Clear current scene
        this.clearHotspots();
        this.currentScene = null;

        // Hide scene page
        this.element.classList.remove('active');

        // Show homepage
        if (window.homePage) {
            window.homePage.show();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e53e3e;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <div>${message}</div>
            <button onclick="this.parentElement.remove()" style="
                background: white;
                color: #e53e3e;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                margin-top: 1rem;
                cursor: pointer;
            ">OK</button>
        `;

        document.body.appendChild(errorDiv);
    }

    // 切换筛选条件
    switchFilter(filter) {
        this.currentFilter = filter;

        // 更新标签状态
        this.filterContainer.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });

        // 应用筛选
        this.applyCurrentFilter();
    }

    // 应用当前筛选条件
    applyCurrentFilter() {
        this.hotspots.forEach(hotspot => {
            const shouldShow = hotspot.matchesFilter(this.currentFilter);
            hotspot.setVisible(shouldShow);
        });
    }

    // 更新筛选标签计数
    updateFilterCounts() {
        if (!this.currentScene || !window.userProgressService) return;

        const stats = window.userProgressService.getWordStatusStats(this.currentScene.id);

        // 更新各个标签的计数
        const tabs = {
            all: stats.total,
            unmarked: stats.unmarked,
            known: stats.known,
            unknown: stats.unknown
        };

        Object.keys(tabs).forEach(filter => {
            const tab = this.filterContainer.querySelector(`[data-filter="${filter}"]`);
            if (tab) {
                const countElement = tab.querySelector('.filter-count');
                countElement.textContent = tabs[filter];
            }
        });
    }

    // 重置筛选
    resetFilter() {
        this.currentFilter = 'all';
        this.filterContainer.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === 'all');
        });
        this.applyCurrentFilter();
    }
}