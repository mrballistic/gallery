/**
 * Theme Component
 * Handles light/dark mode toggle with localStorage persistence
 */

export class Theme {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.button = document.getElementById('themeToggle');
        this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }

    /**
     * Initialize theme component
     */
    init() {
        this.setupEventListeners();
        this.apply();
        this.updateIcon();
        
        console.log(`Theme initialized: ${this.currentTheme}`);
    }

    /**
     * Get initial theme from localStorage or system preference
     */
    getInitialTheme() {
        // Check localStorage first
        const stored = localStorage.getItem('gallery-theme');
        if (stored && ['light', 'dark', 'auto'].includes(stored)) {
            return stored;
        }

        // Check system preference
        if (this.prefersDarkScheme?.matches) {
            return 'dark';
        }

        // Default to light
        return 'light';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme toggle button
        if (this.button) {
            this.button.addEventListener('click', () => this.toggle());
            
            // Add keyboard support
            this.button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle();
                }
            });
        }

        // Listen for system theme changes
        if (this.prefersDarkScheme) {
            this.prefersDarkScheme.addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.apply();
                    this.announceThemeChange();
                }
            });
        }

        // Listen for storage events (theme changes in other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'gallery-theme' && e.newValue) {
                this.currentTheme = e.newValue;
                this.apply();
                this.updateIcon();
                this.announceThemeChange();
            }
        });
    }

    /**
     * Toggle between themes
     */
    toggle() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        this.setTheme(themes[nextIndex]);
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        this.currentTheme = theme;
        this.apply();
        this.updateIcon();
        this.saveToStorage();
        this.announceThemeChange();
        this.triggerThemeChange();
    }

    /**
     * Apply the current theme
     */
    apply() {
        const effectiveTheme = this.getEffectiveTheme();
        
        // Remove existing theme classes
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.documentElement.removeAttribute('data-theme');
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', effectiveTheme);
        document.documentElement.classList.add(`theme-${effectiveTheme}`);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(effectiveTheme);
        
        console.log(`Theme applied: ${this.currentTheme} (effective: ${effectiveTheme})`);
    }

    /**
     * Get the effective theme (resolving 'auto' to actual theme)
     */
    getEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            return this.prefersDarkScheme?.matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    /**
     * Update theme toggle button icon
     */
    updateIcon() {
        if (!this.button) return;

        const icon = this.button.querySelector('.icon');
        if (!icon) return;

        const icons = {
            light: '🌙',
            dark: '☀️',
            auto: '🌓'
        };

        icon.textContent = icons[this.currentTheme] || '🌙';
        
        // Update button title/aria-label
        const labels = {
            light: 'Switch to dark mode',
            dark: 'Switch to auto mode', 
            auto: 'Switch to light mode'
        };
        
        this.button.setAttribute('aria-label', labels[this.currentTheme]);
        this.button.title = labels[this.currentTheme];
    }

    /**
     * Update meta theme-color for mobile browsers
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }

        const colors = {
            light: '#ffffff',
            dark: '#0d1117'
        };

        metaThemeColor.setAttribute('content', colors[theme] || colors.light);
    }

    /**
     * Save theme preference to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('gallery-theme', this.currentTheme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }

    /**
     * Announce theme change to screen readers
     */
    announceThemeChange() {
        const effectiveTheme = this.getEffectiveTheme();
        const message = `Theme changed to ${this.currentTheme}${this.currentTheme === 'auto' ? ` (${effectiveTheme})` : ''}`;
        
        this.announce(message);
    }

    /**
     * Screen reader announcement
     */
    announce(message) {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        announcer.textContent = message;
        
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            if (document.body.contains(announcer)) {
                document.body.removeChild(announcer);
            }
        }, 1000);
    }

    /**
     * Trigger theme change event
     */
    triggerThemeChange() {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                effectiveTheme: this.getEffectiveTheme(),
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Get current theme information
     */
    getThemeInfo() {
        return {
            current: this.currentTheme,
            effective: this.getEffectiveTheme(),
            systemPreference: this.prefersDarkScheme?.matches ? 'dark' : 'light',
            available: ['light', 'dark', 'auto']
        };
    }

    /**
     * Check if dark mode is active
     */
    isDark() {
        return this.getEffectiveTheme() === 'dark';
    }

    /**
     * Check if light mode is active
     */
    isLight() {
        return this.getEffectiveTheme() === 'light';
    }

    /**
     * Check if auto mode is enabled
     */
    isAuto() {
        return this.currentTheme === 'auto';
    }

    /**
     * Get theme statistics
     */
    getStats() {
        return {
            currentTheme: this.currentTheme,
            effectiveTheme: this.getEffectiveTheme(),
            systemSupportsPreference: !!this.prefersDarkScheme,
            systemPrefersDark: this.prefersDarkScheme?.matches || false,
            storageSupported: this.isStorageSupported()
        };
    }

    /**
     * Check if localStorage is supported
     */
    isStorageSupported() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Handle system theme preference changes
     */
    handleSystemThemeChange(event) {
        if (this.currentTheme === 'auto') {
            this.apply();
            this.announceThemeChange();
            this.triggerThemeChange();
        }
    }

    /**
     * Export theme settings (for backup/sync)
     */
    exportSettings() {
        return {
            theme: this.currentTheme,
            timestamp: Date.now(),
            version: '1.0'
        };
    }

    /**
     * Import theme settings (for backup/sync)
     */
    importSettings(settings) {
        if (!settings || typeof settings !== 'object') {
            throw new Error('Invalid settings object');
        }

        if (settings.theme && ['light', 'dark', 'auto'].includes(settings.theme)) {
            this.setTheme(settings.theme);
            return true;
        }

        return false;
    }

    /**
     * Reset theme to system default
     */
    reset() {
        const systemTheme = this.prefersDarkScheme?.matches ? 'dark' : 'light';
        this.setTheme(systemTheme);
    }

    /**
     * Cleanup method
     */
    destroy() {
        // Remove event listeners
        if (this.prefersDarkScheme) {
            this.prefersDarkScheme.removeEventListener('change', this.handleSystemThemeChange);
        }
        
        window.removeEventListener('storage', this.handleStorageChange);
        
        // Remove theme classes
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.documentElement.removeAttribute('data-theme');
    }
}