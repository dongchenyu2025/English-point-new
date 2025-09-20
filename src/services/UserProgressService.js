// User progress service - manages word learning progress and storage
class UserProgressService {
    constructor() {
        this.storageKey = 'englishPointLearn_userProgress';
        this.progressData = this.loadProgress();
    }

    // 加载用户进度数据
    loadProgress() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Failed to load user progress:', error);
        }

        // 默认数据结构
        return {
            userId: 'default',
            wordStates: {}, // { 'word': { status: 'known|unknown|unmarked', timestamp: number } }
            sceneProgress: {} // { 'sceneId': { known: number, total: number, percentage: number } }
        };
    }

    // 保存进度数据
    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progressData));
        } catch (error) {
            console.error('Failed to save user progress:', error);
        }
    }

    // 获取单词状态
    getWordStatus(word) {
        const wordData = this.progressData.wordStates[word];
        return wordData ? wordData.status : 'unmarked';
    }

    // 设置单词状态
    setWordStatus(word, status) {
        if (!['known', 'unknown', 'unmarked'].includes(status)) {
            console.warn('Invalid word status:', status);
            return;
        }

        this.progressData.wordStates[word] = {
            status: status,
            timestamp: Date.now()
        };

        this.saveProgress();
        this.updateSceneProgress();

        // 触发进度更新事件
        window.dispatchEvent(new CustomEvent('progressUpdated', {
            detail: { word, status }
        }));
    }

    // 更新所有场景的进度
    updateSceneProgress() {
        if (!window.sceneDataService) return;

        const allScenes = window.sceneDataService.getAllScenes();

        allScenes.forEach(scene => {
            const progress = this.calculateSceneProgress(scene.id);
            this.progressData.sceneProgress[scene.id] = progress;
        });

        this.saveProgress();
    }

    // 计算场景学习进度（只计算已认识的单词）
    calculateSceneProgress(sceneId) {
        const scene = window.sceneDataService.getScene(sceneId);
        if (!scene) {
            return { known: 0, total: 0, percentage: 0 };
        }

        const totalWords = scene.vocabulary.length;
        const knownWords = scene.vocabulary.filter(wordData =>
            this.getWordStatus(wordData.word) === 'known'
        ).length;

        const percentage = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0;

        return {
            known: knownWords,
            total: totalWords,
            percentage: percentage
        };
    }

    // 获取场景进度
    getSceneProgress(sceneId) {
        // 实时计算以确保数据准确
        return this.calculateSceneProgress(sceneId);
    }

    // 获取场景进度详情文本
    getSceneProgressText(sceneId) {
        const progress = this.getSceneProgress(sceneId);
        return `${progress.known}/${progress.total}已认识`;
    }

    // 获取单词状态统计
    getWordStatusStats(sceneId) {
        const scene = window.sceneDataService.getScene(sceneId);
        if (!scene) {
            return { known: 0, unknown: 0, unmarked: 0, total: 0 };
        }

        const stats = { known: 0, unknown: 0, unmarked: 0, total: scene.vocabulary.length };

        scene.vocabulary.forEach(wordData => {
            const status = this.getWordStatus(wordData.word);
            stats[status]++;
        });

        return stats;
    }

    // 重置场景进度
    resetSceneProgress(sceneId) {
        const scene = window.sceneDataService.getScene(sceneId);
        if (!scene) return;

        scene.vocabulary.forEach(wordData => {
            if (this.progressData.wordStates[wordData.word]) {
                delete this.progressData.wordStates[wordData.word];
            }
        });

        this.updateSceneProgress();
    }

    // 重置所有进度
    resetAllProgress() {
        this.progressData = {
            userId: 'default',
            wordStates: {},
            sceneProgress: {}
        };
        this.saveProgress();

        window.dispatchEvent(new CustomEvent('progressReset'));
    }

    // 获取学习统计
    getLearningStats() {
        const totalWords = Object.keys(this.progressData.wordStates).length;
        const knownWords = Object.values(this.progressData.wordStates)
            .filter(word => word.status === 'known').length;
        const unknownWords = Object.values(this.progressData.wordStates)
            .filter(word => word.status === 'unknown').length;

        return {
            totalMarked: totalWords,
            known: knownWords,
            unknown: unknownWords,
            unmarked: totalWords - knownWords - unknownWords
        };
    }
}

// 初始化全局实例
window.userProgressService = new UserProgressService();