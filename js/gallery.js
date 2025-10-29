/**
 * Gallery Component
 * Manages the display and interaction of image cards
 */

export class Gallery {
    constructor(images = []) {
        this.images = images;
        this.container = document.getElementById('gallery');
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.isRendering = false;
        
        if (!this.container) {
            throw new Error('Gallery container not found');
        }
        
        this.init();
    }

    /**
     * Initialize the gallery
     */
    init() {
        this.setupIntersectionObserver();
        this.render();
    }

    /**
     * Setup intersection observer for lazy loading
     */
    setupIntersectionObserver() {
        this.imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.imageObserver.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.1
            }
        );
    }

    /**
     * Load an image with error handling
     */
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        img.addEventListener('error', () => {
            img.classList.add('error');
            img.alt = 'Failed to load image';
            // Show placeholder or error image
            img.src = this.generatePlaceholder(img.dataset.title || 'Image');
        });

        img.src = src;
    }

    /**
     * Generate a placeholder image
     */
    generatePlaceholder(title) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        // Icon
        ctx.fillStyle = '#999';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📷', canvas.width / 2, canvas.height / 2 - 20);
        
        // Text
        ctx.font = '14px Arial';
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 + 20);
        
        return canvas.toDataURL();
    }

    /**
     * Render the gallery
     */
    render() {
        if (this.isRendering) return;
        this.isRendering = true;

        try {
            this.container.innerHTML = '';
            this.container.className = `gallery gallery--${this.viewMode}`;

            if (this.images.length === 0) {
                this.renderEmptyState();
                return;
            }

            // Create document fragment for better performance
            const fragment = document.createDocumentFragment();

            this.images.forEach((image, index) => {
                const card = this.createImageCard(image, index);
                fragment.appendChild(card);
            });

            this.container.appendChild(fragment);
            
            // Start observing images for lazy loading
            this.observeImages();
            
        } catch (error) {
            console.error('Error rendering gallery:', error);
            this.renderErrorState(error.message);
        } finally {
            this.isRendering = false;
        }
    }

    /**
     * Create an image card element
     */
    createImageCard(image, index) {
        const card = document.createElement('article');
        card.className = `gallery__card gallery__card--${this.viewMode}`;
        card.dataset.index = index;
        card.dataset.imageId = image.id;

        // Create card HTML
        card.innerHTML = this.getCardHTML(image, index);

        // Add event listeners
        this.attachCardEvents(card, image, index);

        return card;
    }

    /**
     * Get HTML template for image card
     */
    getCardHTML(image, index) {
        const displayDate = this.formatDate(image.dateAdded);
        const tags = image.tags?.slice(0, 3) || []; // Show max 3 tags
        
        return `
            <div class="card__image-wrapper">
                <img 
                    class="card__image" 
                    data-src="${image.thumbnail || image.path}"
                    data-title="${image.filename}"
                    alt="${image.description || image.filename}"
                    loading="lazy"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E"
                >
                <div class="card__overlay">
                    <button 
                        class="card__view-btn" 
                        data-index="${index}"
                        aria-label="View ${image.filename} full size"
                    >
                        View Full Size
                    </button>
                </div>
            </div>
            <div class="card__info">
                <h3 class="card__title">${this.escapeHtml(image.filename)}</h3>
                <div class="card__meta">
                    <span class="card__category">${this.escapeHtml(image.category)}</span>
                    <span class="card__date">${displayDate}</span>
                </div>
                ${image.description ? `<p class="card__description">${this.escapeHtml(image.description)}</p>` : ''}
                ${tags.length > 0 ? `
                    <div class="card__tags">
                        ${tags.map(tag => `<span class="card__tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Attach event listeners to a card
     */
    attachCardEvents(card, image, index) {
        // View button click
        const viewBtn = card.querySelector('.card__view-btn');
        viewBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openImage(index);
        });

        // Card click
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on interactive elements
            if (e.target.closest('button, a, input')) return;
            this.openImage(index);
        });

        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openImage(index);
            }
        });

        // Make card focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${image.filename}`);
    }

    /**
     * Open image in modal
     */
    openImage(index) {
        const event = new CustomEvent('imageClick', {
            detail: { 
                image: this.images[index], 
                index,
                images: this.images 
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Observe images for lazy loading
     */
    observeImages() {
        const images = this.container.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    /**
     * Update gallery with new images
     */
    update(images) {
        this.images = images;
        this.render();
    }

    /**
     * Toggle between grid and list view
     */
    toggleView() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        this.container.className = `gallery gallery--${this.viewMode}`;
        
        // Update existing cards
        const cards = this.container.querySelectorAll('.gallery__card');
        cards.forEach(card => {
            card.className = `gallery__card gallery__card--${this.viewMode}`;
        });

        // Trigger custom event
        const event = new CustomEvent('viewChanged', {
            detail: { viewMode: this.viewMode }
        });
        document.dispatchEvent(event);
    }

    /**
     * Render empty state
     */
    renderEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">📷</div>
                <h3>No images found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        this.container.className = 'gallery gallery--empty';
    }

    /**
     * Render error state
     */
    renderErrorState(message) {
        this.container.innerHTML = `
            <div class="error">
                <div class="error__icon">⚠️</div>
                <h3>Something went wrong</h3>
                <p>${this.escapeHtml(message)}</p>
                <button class="btn btn--primary" onclick="location.reload()">
                    Refresh Page
                </button>
            </div>
        `;
        this.container.className = 'gallery gallery--error';
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Re-observe images that might have become visible
            this.observeImages();
        }, 100);
    }

    /**
     * Get gallery statistics
     */
    getStats() {
        return {
            totalImages: this.images.length,
            viewMode: this.viewMode,
            isRendering: this.isRendering
        };
    }

    /**
     * Cleanup method
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Remove event listeners
        const cards = this.container.querySelectorAll('.gallery__card');
        cards.forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });
    }
}