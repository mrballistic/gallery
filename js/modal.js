/**
 * Modal Component
 * Handles full-screen image viewing with navigation
 */

export class Modal {
    constructor() {
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalTags = document.getElementById('modalTags');
        
        this.currentIndex = 0;
        this.images = [];
        this.isOpen = false;
        this.isLoading = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        if (!this.modal) {
            throw new Error('Modal element not found');
        }
        
        this.init();
    }

    /**
     * Initialize the modal
     */
    init() {
        this.setupEventListeners();
        this.preloadAdjacentImages = this.debounce(this.preloadAdjacentImages.bind(this), 500);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Close button
        const closeBtn = this.modal.querySelector('.modal__close');
        closeBtn?.addEventListener('click', () => this.close());

        // Navigation buttons
        const prevBtn = this.modal.querySelector('.modal__nav--prev');
        const nextBtn = this.modal.querySelector('.modal__nav--next');
        
        prevBtn?.addEventListener('click', () => this.navigate(-1));
        nextBtn?.addEventListener('click', () => this.navigate(1));

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch/swipe gestures
        this.setupTouchEvents();

        // Listen for image click events from gallery
        document.addEventListener('imageClick', (e) => {
            const { image, index, images } = e.detail;
            this.open(index, images);
        });

        // Image load events
        this.modalImage?.addEventListener('load', () => this.handleImageLoad());
        this.modalImage?.addEventListener('error', () => this.handleImageError());
    }

    /**
     * Setup touch events for swipe gestures
     */
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        this.modal.addEventListener('touchstart', (e) => {
            if (!this.isOpen) return;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        }, { passive: true });

        this.modal.addEventListener('touchend', (e) => {
            if (!this.isOpen || e.touches.length > 0) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Check if it's a swipe (not just a tap)
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const velocity = distance / deltaTime;
            
            if (distance > 50 && velocity > 0.3 && deltaTime < 500) {
                // Horizontal swipe
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        this.navigate(-1); // Swipe right = previous
                    } else {
                        this.navigate(1);  // Swipe left = next
                    }
                }
                // Vertical swipe down to close
                else if (deltaY > 0 && Math.abs(deltaY) > 100) {
                    this.close();
                }
            }
        }, { passive: true });
    }

    /**
     * Handle keyboard events
     */
    handleKeyboard(e) {
        if (!this.isOpen) return;

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.navigate(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.navigate(1);
                break;
            case 'Home':
                e.preventDefault();
                this.goToImage(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToImage(this.images.length - 1);
                break;
            case ' ':
                e.preventDefault();
                // Space bar can be used to navigate or close
                if (e.shiftKey) {
                    this.navigate(-1);
                } else {
                    this.navigate(1);
                }
                break;
        }
    }

    /**
     * Open modal with specific image
     */
    open(index, images = []) {
        this.currentIndex = Math.max(0, Math.min(index, images.length - 1));
        this.images = images;
        this.isOpen = true;
        
        // Update modal state
        this.modal.classList.add('modal--open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Update content
        this.updateContent();
        
        // Update navigation visibility
        this.updateNavigation();
        
        // Preload adjacent images
        this.preloadAdjacentImages();
        
        // Announce to screen readers
        this.announceModalOpen();
        
        // Focus management
        this.manageFocus();
        
        console.log(`Modal opened with image ${index + 1} of ${images.length}`);
    }

    /**
     * Close modal
     */
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.modal.classList.remove('modal--open');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clear image to free memory
        setTimeout(() => {
            if (!this.isOpen) {
                this.modalImage.src = '';
            }
        }, 300);
        
        // Restore focus to the gallery
        this.restoreFocus();
        
        console.log('Modal closed');
    }

    /**
     * Navigate to adjacent image
     */
    navigate(direction) {
        if (!this.isOpen || this.images.length <= 1) return;
        
        const newIndex = this.currentIndex + direction;
        
        if (newIndex < 0) {
            this.currentIndex = this.images.length - 1;
        } else if (newIndex >= this.images.length) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = newIndex;
        }
        
        this.updateContent();
        this.preloadAdjacentImages();
        
        // Emit navigation event
        const event = new CustomEvent('modalNavigation', {
            detail: { 
                direction, 
                currentIndex: this.currentIndex,
                image: this.images[this.currentIndex]
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Go to specific image by index
     */
    goToImage(index) {
        if (!this.isOpen || index < 0 || index >= this.images.length) return;
        
        this.currentIndex = index;
        this.updateContent();
        this.preloadAdjacentImages();
    }

    /**
     * Update modal content
     */
    updateContent() {
        if (!this.images[this.currentIndex]) return;
        
        const image = this.images[this.currentIndex];
        this.isLoading = true;
        
        // Update image
        this.modalImage.src = image.path;
        this.modalImage.alt = image.description || image.filename;
        
        // Update title
        if (this.modalTitle) {
            this.modalTitle.textContent = image.filename;
        }
        
        // Update description
        if (this.modalDescription) {
            this.modalDescription.textContent = image.description || '';
            this.modalDescription.style.display = image.description ? 'block' : 'none';
        }
        
        // Update tags
        this.updateTags(image.tags);
        
        // Update metadata
        this.updateMetadata(image);
        
        // Update navigation state
        this.updateNavigation();
    }

    /**
     * Update image tags display
     */
    updateTags(tags) {
        if (!this.modalTags) return;
        
        this.modalTags.innerHTML = '';
        
        if (tags && tags.length > 0) {
            tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag';
                tagEl.textContent = tag;
                this.modalTags.appendChild(tagEl);
            });
            this.modalTags.style.display = 'flex';
        } else {
            this.modalTags.style.display = 'none';
        }
    }

    /**
     * Update image metadata display
     */
    updateMetadata(image) {
        // Create or update metadata container
        let metadataEl = this.modal.querySelector('.modal__metadata');
        if (!metadataEl) {
            metadataEl = document.createElement('div');
            metadataEl.className = 'modal__metadata';
            this.modal.querySelector('.modal__info')?.appendChild(metadataEl);
        }
        
        const items = [];
        
        if (image.category) {
            items.push(`<span class="modal__metadata-item">📂 ${image.category}</span>`);
        }
        
        if (image.dateAdded) {
            const date = new Date(image.dateAdded).toLocaleDateString();
            items.push(`<span class="modal__metadata-item">📅 ${date}</span>`);
        }
        
        items.push(`<span class="modal__metadata-item">🖼️ ${this.currentIndex + 1} of ${this.images.length}</span>`);
        
        metadataEl.innerHTML = items.join('');
    }

    /**
     * Update navigation button visibility
     */
    updateNavigation() {
        const prevBtn = this.modal.querySelector('.modal__nav--prev');
        const nextBtn = this.modal.querySelector('.modal__nav--next');
        
        if (this.images.length <= 1) {
            prevBtn?.style.setProperty('display', 'none');
            nextBtn?.style.setProperty('display', 'none');
            this.modal.classList.add('modal--single');
        } else {
            prevBtn?.style.removeProperty('display');
            nextBtn?.style.removeProperty('display');
            this.modal.classList.remove('modal--single');
        }
    }

    /**
     * Handle successful image load
     */
    handleImageLoad() {
        this.isLoading = false;
        this.modalImage.classList.add('loaded');
        
        // Update layout after image loads
        this.updateLayout();
    }

    /**
     * Handle image load error
     */
    handleImageError() {
        this.isLoading = false;
        this.modalImage.classList.add('error');
        
        // Show error message
        const errorEl = document.createElement('div');
        errorEl.className = 'modal__error';
        errorEl.innerHTML = `
            <p>Failed to load image</p>
            <button class="btn btn--secondary" onclick="location.reload()">Retry</button>
        `;
        
        this.modal.querySelector('.modal__content')?.appendChild(errorEl);
    }

    /**
     * Preload adjacent images for smoother navigation
     */
    preloadAdjacentImages() {
        if (!this.images.length) return;
        
        const preloadIndexes = [];
        
        // Previous image
        const prevIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        preloadIndexes.push(prevIndex);
        
        // Next image
        const nextIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
        preloadIndexes.push(nextIndex);
        
        preloadIndexes.forEach(index => {
            if (this.images[index]) {
                const img = new Image();
                img.src = this.images[index].path;
            }
        });
    }

    /**
     * Update modal layout (responsive)
     */
    updateLayout() {
        // Adjust modal content size based on viewport
        const content = this.modal.querySelector('.modal__content');
        if (!content) return;
        
        const maxWidth = Math.min(window.innerWidth * 0.9, 1200);
        const maxHeight = Math.min(window.innerHeight * 0.9, 800);
        
        content.style.maxWidth = `${maxWidth}px`;
        content.style.maxHeight = `${maxHeight}px`;
    }

    /**
     * Announce modal opening to screen readers
     */
    announceModalOpen() {
        const announcement = `Image modal opened. Showing ${this.currentIndex + 1} of ${this.images.length}. Use arrow keys to navigate, Escape to close.`;
        this.announce(announcement);
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
        announcer.textContent = message;
        
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }

    /**
     * Focus management for accessibility
     */
    manageFocus() {
        // Store the previously focused element
        this.previouslyFocused = document.activeElement;
        
        // Focus the modal
        this.modal.focus();
    }

    /**
     * Restore focus when modal closes
     */
    restoreFocus() {
        if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
            this.previouslyFocused.focus();
        }
    }

    /**
     * Debounce utility function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Get modal statistics
     */
    getStats() {
        return {
            isOpen: this.isOpen,
            currentIndex: this.currentIndex,
            totalImages: this.images.length,
            isLoading: this.isLoading
        };
    }

    /**
     * Cleanup method
     */
    destroy() {
        if (this.isOpen) {
            this.close();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
        document.removeEventListener('imageClick', this.open);
    }
}