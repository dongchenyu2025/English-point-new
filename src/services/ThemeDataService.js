// Theme data service - manages theme filtering for existing scenes
class ThemeDataService {
    constructor() {
        // 基于现有场景的主题分组
        this.themes = {
            all: {
                id: 'all',
                name: '全部',
                scenes: [] // 将在初始化时填充所有场景
            },
            home: {
                id: 'home',
                name: '居家生活',
                scenes: ['kitchen', 'living', 'desk'] // 现有的家居场景
            },
            education: {
                id: 'education',
                name: '校园活动',
                scenes: [] // 现有的教育场景
            },
            recreation: {
                id: 'recreation',
                name: '娱乐休闲',
                scenes: ['park'] // 现有的休闲场景
            },
            shopping: {
                id: 'shopping',
                name: '购物美食',
                scenes: ['coffee', 'supermarket'] // 现有的购物场景
            }
        };
    }

    // 初始化 - 获取所有可用场景
    initialize() {
        if (window.sceneDataService) {
            const allScenes = window.sceneDataService.getAllScenes();
            this.themes.all.scenes = allScenes.map(scene => scene.id);
        }
    }

    // 获取所有主题
    getAllThemes() {
        return Object.values(this.themes);
    }

    // 获取主题信息
    getTheme(themeId) {
        return this.themes[themeId] || null;
    }

    // 获取主题下的场景
    getThemeScenes(themeId) {
        const theme = this.getTheme(themeId);
        if (!theme) return [];

        return theme.scenes.map(sceneId => {
            return window.sceneDataService.getScene(sceneId);
        }).filter(scene => scene !== null);
    }

    // 获取场景所属主题
    getSceneTheme(sceneId) {
        for (const theme of Object.values(this.themes)) {
            if (theme.scenes.includes(sceneId)) {
                return theme;
            }
        }
        return this.themes.all; // 默认归到"全部"
    }
}

// 初始化全局实例
window.themeDataService = new ThemeDataService();