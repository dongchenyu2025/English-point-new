// Performance monitoring and debugging utilities for v1.1.2
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            sceneLoadTimes: [],
            audioLoadTimes: [],
            hotspotRenderTimes: [],
            userInteractions: 0,
            errors: []
        };
        this.startTime = performance.now();
        this.isDebugMode = false;

        this.init();
    }

    init() {
        this.setupDebugUI();
        this.trackPageLoad();
        this.trackErrors();

        // Enable debug mode with URL parameter
        if (window.location.search.includes('debug=true')) {
            this.enableDebugMode();
        }
    }

    setupDebugUI() {
        // Only show debug UI in debug mode
        if (!window.location.search.includes('debug=true')) {
            return;
        }

        // Create debug panel (initially hidden)
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 2000;
            display: none;
            max-height: 400px;
            overflow-y: auto;
        `;

        // Add toggle button
        this.debugToggle = document.createElement('button');
        this.debugToggle.textContent = '🔧';
        this.debugToggle.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 2001;
            font-size: 16px;
        `;

        this.debugToggle.onclick = () => this.toggleDebugPanel();

        document.body.appendChild(this.debugPanel);
        document.body.appendChild(this.debugToggle);
    }

    enableDebugMode() {
        this.isDebugMode = true;
        this.debugToggle.style.background = '#48bb78';
        console.log('🔧 Debug mode enabled - Performance monitoring active');
    }

    toggleDebugPanel() {
        const isVisible = this.debugPanel.style.display !== 'none';
        this.debugPanel.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            this.updateDebugPanel();
        }
    }

    updateDebugPanel() {
        const avgSceneLoad = this.calculateAverage(this.metrics.sceneLoadTimes);
        const avgAudioLoad = this.calculateAverage(this.metrics.audioLoadTimes);
        const uptime = ((performance.now() - this.startTime) / 1000).toFixed(1);

        this.debugPanel.innerHTML = `
            <h4>📊 Performance Monitor v1.1.2</h4>
            <div><strong>Uptime:</strong> ${uptime}s</div>
            <div><strong>Scene Load Avg:</strong> ${avgSceneLoad}ms</div>
            <div><strong>Audio Load Avg:</strong> ${avgAudioLoad}ms</div>
            <div><strong>User Interactions:</strong> ${this.metrics.userInteractions}</div>
            <div><strong>Errors:</strong> ${this.metrics.errors.length}</div>

            <h5>📈 Recent Metrics</h5>
            <div style="max-height: 150px; overflow-y: auto; font-size: 10px;">
                ${this.getRecentLogs()}
            </div>

            <h5>🚨 Errors</h5>
            <div style="max-height: 100px; overflow-y: auto; font-size: 10px; color: #ff6b6b;">
                ${this.getErrorLogs()}
            </div>
        `;
    }

    calculateAverage(array) {
        if (array.length === 0) return '0';
        const sum = array.reduce((a, b) => a + b, 0);
        return (sum / array.length).toFixed(1);
    }

    getRecentLogs() {
        const logs = [
            ...this.metrics.sceneLoadTimes.slice(-3).map(t => `Scene loaded: ${t}ms`),
            ...this.metrics.audioLoadTimes.slice(-3).map(t => `Audio loaded: ${t}ms`)
        ];
        return logs.length > 0 ? logs.join('<br>') : 'No recent activity';
    }

    getErrorLogs() {
        const recentErrors = this.metrics.errors.slice(-5);
        return recentErrors.length > 0
            ? recentErrors.map(e => `${e.time}: ${e.message}`).join('<br>')
            : 'No errors';
    }

    // Performance tracking methods
    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            console.log(`📄 Page loaded in ${loadTime.toFixed(1)}ms`);
        });
    }

    trackSceneLoad(sceneId) {
        const startTime = performance.now();
        return () => {
            const loadTime = performance.now() - startTime;
            this.metrics.sceneLoadTimes.push(loadTime);

            if (this.isDebugMode) {
                console.log(`🖼️ Scene '${sceneId}' loaded in ${loadTime.toFixed(1)}ms`);
            }
        };
    }

    trackAudioLoad(audioUrl) {
        const startTime = performance.now();
        return (success) => {
            const loadTime = performance.now() - startTime;
            this.metrics.audioLoadTimes.push(loadTime);

            if (this.isDebugMode) {
                const status = success ? '✅' : '❌';
                console.log(`🔊 ${status} Audio load: ${loadTime.toFixed(1)}ms - ${audioUrl}`);
            }
        };
    }

    trackUserInteraction(action, details = '') {
        this.metrics.userInteractions++;

        if (this.isDebugMode) {
            console.log(`👆 User ${action}: ${details}`);
        }
    }

    trackErrors() {
        const originalError = window.onerror;
        window.onerror = (message, filename, lineno, colno, error) => {
            this.logError(message, filename, lineno);

            if (originalError) {
                return originalError(message, filename, lineno, colno, error);
            }
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.logError(`Promise rejection: ${event.reason}`, 'unknown', 0);
        });
    }

    logError(message, filename = '', lineno = 0) {
        const timestamp = new Date().toLocaleTimeString();
        this.metrics.errors.push({
            time: timestamp,
            message: message,
            file: filename,
            line: lineno
        });

        if (this.isDebugMode) {
            console.error(`🚨 Error logged: ${message}`);
        }

        // Update debug panel if visible
        if (this.debugPanel.style.display !== 'none') {
            this.updateDebugPanel();
        }
    }

    // Memory monitoring
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }

    // Export metrics for analysis
    exportMetrics() {
        const metrics = {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            memory: this.getMemoryUsage(),
            uptime: (performance.now() - this.startTime) / 1000
        };

        const blob = new Blob([JSON.stringify(metrics, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `english-point-learn-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize global performance monitor
window.performanceMonitor = new PerformanceMonitor();

// Add keyboard shortcut for debug mode
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        window.performanceMonitor.enableDebugMode();
        window.performanceMonitor.toggleDebugPanel();
    }
});