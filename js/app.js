/**
 * Main Gallery Application
 * Coordinates all components and manages app state
 */

import { Gallery } from './gallery.js';
import { Modal } from './modal.js';
import { Filters } from './filters.js';
import { Theme } from './theme.js';

class GalleryApp {
    constructor() {
        this.gallery = null;
        this.modal = null;
        this.filters = null;
        this.theme = null;
        this.data = null;
        this.currentImages = [];
        this.isLoading = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoading(true);
            
            // Load gallery data
            await this.loadData();
            
            // Initialize components
            this.initializeComponents();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initial render
            this.updateGallery();
            
            this.showLoading(false);
            
            console.log('Gallery app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize gallery app:', error);
            this.showError('Failed to load gallery. Please refresh the page.');
            this.showLoading(false);
        }
    }

    /**
     * Load gallery data from JSON file
     */
    async loadData() {
        try {
            const response = await fetch('./data/gallery.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            this.currentImages = [...this.data.images];
            
            // Validate data structure
            if (!this.data.images || !Array.isArray(this.data.images)) {
                throw new Error('Invalid gallery data structure');
            }
            
        } catch (error) {
            console.error('Failed to load gallery data:', error);
            throw error;
        }
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        // Initialize theme first (affects all other components)
        this.theme = new Theme();
        
        // Initialize gallery
        this.gallery = new Gallery(this.currentImages);
        
        // Initialize modal
        this.modal = new Modal();
        
        // Initialize filters
        this.filters = new Filters(this.data);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Filter events
        this.setupFilterEvents();
        
        // UI control events
        this.setupUIEvents();
        
        // Gallery events
        this.setupGalleryEvents();
        
        // Global events
        this.setupGlobalEvents();
    }

    /**
     * Setup filter-related event listeners
     */
    setupFilterEvents() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        // Search input with debouncing
        let searchTimeout;
        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filters.setSearch(e.target.value);
                this.updateGallery();
            }, 300);
        });

        // Category filter
        categoryFilter?.addEventListener('change', (e) => {
            this.filters.setCategory(e.target.value);
            this.updateGallery();
        });

        // Sort filter
        sortFilter?.addEventListener('change', (e) => {
            this.filters.setSort(e.target.value);
            this.updateGallery();
        });
    }

    /**
     * Setup UI control event listeners
     */
    setupUIEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => {
            this.theme.toggle();
        });

        // View toggle
        const viewToggle = document.getElementById('viewToggle');
        viewToggle?.addEventListener('click', () => {
            this.gallery.toggleView();
            this.updateViewToggleIcon();
        });
    }

    /**
     * Setup gallery-related event listeners
     */
    setupGalleryEvents() {
        // Listen for image clicks from gallery
        document.addEventListener('imageClick', (e) => {
            const { image, index } = e.detail;
            this.modal.open(index, this.currentImages);
        });

        // Listen for modal navigation
        document.addEventListener('modalNavigation', (e) => {
            const { direction } = e.detail;
            this.modal.navigate(direction);
        });
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEvents() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle visibility change (performance optimization)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    /**
     * Update gallery with filtered images
     */
    updateGallery() {
        if (!this.filters || !this.data) return;
        
        try {
            const filteredImages = this.filters.apply(this.data.images);
            this.currentImages = filteredImages;
            this.gallery.update(filteredImages);
            this.updateResultsCount(filteredImages.length);
        } catch (error) {
            console.error('Error updating gallery:', error);
            this.showError('Error filtering images');
        }
    }

    /**
     * Update the view toggle icon
     */
    updateViewToggleIcon() {
        const viewToggle = document.getElementById('viewToggle');
        const icon = viewToggle?.querySelector('.icon');
        if (icon) {
            icon.textContent = this.gallery.viewMode === 'grid' ? '☰' : '⊞';
        }
    }

    /**
     * Update results count display
     */
    updateResultsCount(count) {
        const total = this.data.images.length;
        const resultsText = count === total 
            ? `Showing all ${total} images`
            : `Showing ${count} of ${total} images`;
        
        // Update or create results indicator
        let resultsEl = document.querySelector('.results-count');
        if (!resultsEl) {
            resultsEl = document.createElement('div');
            resultsEl.className = 'results-count';
            resultsEl.style.cssText = `
                padding: var(--space-sm) var(--space);
                background: var(--color-surface);
                border-bottom: 1px solid var(--color-border);
                font-size: 0.875rem;
                color: var(--color-text-secondary);
                text-align: center;
            `;
            
            const gallery = document.getElementById('gallery');
            gallery?.parentNode.insertBefore(resultsEl, gallery);
        }
        
        resultsEl.textContent = resultsText;
    }

    /**
     * Show/hide loading state
     */
    showLoading(show) {
        this.isLoading = show;
        const loadingEl = document.getElementById('loadingState');
        const gallery = document.getElementById('gallery');
        
        if (show) {
            loadingEl?.classList.remove('hidden');
            gallery?.classList.add('hidden');
        } else {
            loadingEl?.classList.add('hidden');
            gallery?.classList.remove('hidden');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const gallery = document.getElementById('gallery');
        if (gallery) {
            gallery.innerHTML = `
                <div class="error">
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button class="btn btn--primary" onclick="location.reload()">
                        Refresh Page
                    </button>
                </div>
            `;
            gallery.classList.remove('hidden');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate modal positioning if open
        if (this.modal?.isOpen) {
            this.modal.updateLayout();
        }
        
        // Update gallery layout if needed
        this.gallery?.handleResize?.();
    }

    /**
     * Handle visibility change (tab switching)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause any animations or timers when tab is hidden
            this.pauseAnimations();
        } else {
            // Resume when tab becomes visible
            this.resumeAnimations();
        }
    }

    /**
     * Handle global keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case '/':
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
                break;
            case 't':
            case 'T':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.theme.toggle();
                }
                break;
            case 'v':
            case 'V':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.gallery.toggleView();
                    this.updateViewToggleIcon();
                }
                break;
        }
    }

    /**
     * Pause animations for performance
     */
    pauseAnimations() {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
    }

    /**
     * Resume animations
     */
    resumeAnimations() {
        document.documentElement.style.removeProperty('--transition-fast');
        document.documentElement.style.removeProperty('--transition-normal');
    }

    /**
     * Get app statistics
     */
    getStats() {
        return {
            totalImages: this.data?.images?.length || 0,
            currentImages: this.currentImages?.length || 0,
            categories: this.data?.categories?.length || 0,
            viewMode: this.gallery?.viewMode || 'grid',
            theme: this.theme?.currentTheme || 'light',
            isLoading: this.isLoading
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.galleryApp = new GalleryApp();
    window.galleryApp.init();
});

// Export for potential external use
export { GalleryApp };