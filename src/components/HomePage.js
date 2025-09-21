// Homepage component - handles theme filtering and scene selection
class HomePage {
    constructor() {
        this.element = document.getElementById('homepage');
        this.currentTheme = 'all';

        this.initializeElements();
        this.createThemeFilters();
        this.createSceneGrid();
        this.bindEvents();
    }

    initializeElements() {
        // 基于 index-2.html 设计重新构建结构
        this.element.innerHTML = `
            <header class="app-header">
                <h1>英语图片点读</h1>
                <div class="version-info">v1.1.2</div>
                <p>选择一个主题开始学习</p>
            </header>

            <main>
                <div class="theme-filters">
                    <h2>主题 (Topics)</h2>
                    <div class="theme-filter-buttons"></div>
                </div>

                <div class="scene-grid-header">
                    <h2>场景 (Scenes)</h2>
                </div>
                <div class="scene-grid"></div>
            </main>
        `;

        this.themeFilterButtons = this.element.querySelector('.theme-filter-buttons');
        this.sceneGrid = this.element.querySelector('.scene-grid');
    }

    createThemeFilters() {
        const themes = window.themeDataService.getAllThemes();

        themes.forEach(theme => {
            const filterBtn = document.createElement('button');
            filterBtn.className = `theme-filter ${theme.id === 'all' ? 'active' : ''}`;
            filterBtn.dataset.theme = theme.id;
            filterBtn.textContent = theme.name;

            this.themeFilterButtons.appendChild(filterBtn);
        });
    }

    createSceneGrid() {
        this.updateSceneGrid();
    }

    updateSceneGrid() {
        // 清空现有场景卡片
        this.sceneGrid.innerHTML = '';

        // 获取当前主题的场景
        const scenes = window.themeDataService.getThemeScenes(this.currentTheme);

        scenes.forEach(scene => {
            const sceneCard = this.createSceneCard(scene);
            this.sceneGrid.appendChild(sceneCard);
        });
    }

    createSceneCard(scene) {
        const progress = window.userProgressService.getSceneProgress(scene.id);

        const card = document.createElement('div');
        card.className = 'scene-card';
        card.dataset.scene = scene.id;

        // 获取场景图片路径
        const imagePath = `/src/assets/images/scenes/${scene.id}.jpg`;

        // 确定进度颜色类
        let progressClass = 'progress-in-progress';
        if (progress.percentage === 0) {
            progressClass = 'progress-0';
        } else if (progress.percentage === 100) {
            progressClass = 'progress-complete';
        }

        card.innerHTML = `
            <div class="scene-card-image">
                <img src="${imagePath}" alt="${scene.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="scene-icon" style="display: none;">🏠</div>
                <div class="progress-badge ${progressClass}">
                    ${progress.percentage}%
                </div>
            </div>
            <div class="scene-card-content">
                <h3>${this.getSceneChineseName(scene.id)}</h3>
                <p>${this.getSceneEnglishName(scene.id)}</p>
            </div>
        `;

        return card;
    }

    getSceneChineseName(sceneId) {
        const chineseNames = {
            kitchen: '厨房',
            living: '客厅',
            park: '公园',
            desk: '工作桌',
            bedroom: '卧室',
            bathroom: '浴室',
            restaurant: '餐厅',
            library: '图书馆',
            hospital: '医院',
            office: '办公室',
            garden: '花园',
            street: '街道',
            beach: '海滩',
            mountain: '山脉',
            forest: '森林',
            coffee: '咖啡',
            supermarket: '超市',
            takeaflight: '乘飞机',
            checkin: '办理登机手续'
        };
        return chineseNames[sceneId] || sceneId;
    }

    getSceneEnglishName(sceneId) {
        const englishNames = {
            kitchen: 'Kitchen',
            living: 'Living Room',
            park: 'Park',
            desk: 'Desk',
            bedroom: 'Bedroom',
            bathroom: 'Bathroom',
            restaurant: 'Restaurant',
            library: 'Library',
            hospital: 'Hospital',
            office: 'Office',
            garden: 'Garden',
            street: 'Street',
            beach: 'Beach',
            mountain: 'Mountain',
            forest: 'Forest',
            coffee: 'Coffee',
            supermarket: 'Supermarket',
            takeaflight: 'Take a flight',
            checkin: 'Check in'
        };
        return englishNames[sceneId] || sceneId;
    }

    bindEvents() {
        // 主题筛选事件
        this.themeFilterButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-filter')) {
                this.switchTheme(e.target.dataset.theme);
            }
        });

        // 场景卡片点击事件
        this.sceneGrid.addEventListener('click', (e) => {
            const sceneCard = e.target.closest('.scene-card');
            if (sceneCard) {
                const sceneId = sceneCard.dataset.scene;
                this.selectScene(sceneId);
            }
        });

        // 监听进度更新事件
        window.addEventListener('progressUpdated', () => {
            this.updateSceneGrid();
        });
    }

    switchTheme(themeId) {
        // 更新当前主题
        this.currentTheme = themeId;

        // 更新按钮状态
        this.themeFilterButtons.querySelectorAll('.theme-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === themeId);
        });

        // 更新场景网格
        this.updateSceneGrid();
    }

    selectScene(sceneId) {
        // Add selection animation
        const card = document.querySelector(`[data-scene="${sceneId}"]`);
        if (card) {
            card.classList.add('scale-in');
        }

        // Navigate to scene page after short delay
        setTimeout(() => {
            this.navigateToScene(sceneId);
        }, 200);
    }

    navigateToScene(sceneId) {
        // Hide homepage
        this.element.classList.remove('active');

        // Show scene page and load the selected scene
        const scenePage = document.getElementById('scenepage');
        scenePage.classList.add('active');

        // Load the scene content
        if (window.scenePage) {
            window.scenePage.loadScene(sceneId);
        }
    }

    show() {
        this.element.classList.add('active');

        // 确保主题数据服务已初始化
        if (window.themeDataService) {
            window.themeDataService.initialize();
        }

        // 刷新场景网格以显示最新进度
        this.updateSceneGrid();

        // Add entrance animation
        this.element.classList.add('fade-in');
        setTimeout(() => {
            this.element.classList.remove('fade-in');
        }, 300);
    }

    hide() {
        this.element.classList.remove('active');
    }

    // Method to handle back navigation
    handleBackNavigation() {
        this.show();
    }
}