/**
 * Filters Component
 * Handles search, category filtering, and sorting functionality
 */

export class Filters {
    constructor(data) {
        this.data = data;
        this.searchTerm = '';
        this.selectedCategory = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc'; // 'asc' or 'desc'
        
        if (!this.data || !this.data.images || !this.data.categories) {
            throw new Error('Invalid data provided to Filters');
        }
        
        this.init();
    }

    /**
     * Initialize filters
     */
    init() {
        this.populateCategoryFilter();
        this.setupEventListeners();
        this.restoreFiltersFromURL();
    }

    /**
     * Populate category filter dropdown
     */
    populateCategoryFilter() {
        const select = document.getElementById('categoryFilter');
        if (!select) return;
        
        // Clear existing options (except "All Categories")
        const allOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (allOption) {
            select.appendChild(allOption);
        } else {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'All Categories';
            select.appendChild(defaultOption);
        }
        
        // Add category options
        this.data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.formatCategoryName(category);
            select.appendChild(option);
        });
        
        // Add image count to each category
        this.updateCategoryCount();
    }

    /**
     * Update category count in dropdown
     */
    updateCategoryCount() {
        const select = document.getElementById('categoryFilter');
        if (!select) return;
        
        const categoryCounts = this.getCategoryCounts();
        
        Array.from(select.options).forEach(option => {
            const category = option.value;
            if (category === '') {
                option.textContent = `All Categories (${this.data.images.length})`;
            } else {
                const count = categoryCounts[category] || 0;
                option.textContent = `${this.formatCategoryName(category)} (${count})`;
            }
        });
    }

    /**
     * Get count of images per category
     */
    getCategoryCounts() {
        const counts = {};
        this.data.images.forEach(image => {
            const category = image.category;
            counts[category] = (counts[category] || 0) + 1;
        });
        return counts;
    }

    /**
     * Format category name for display
     */
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/[-_]/g, ' ');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.setSearch(e.target.value);
                this.updateURL();
                this.triggerFilterChange();
            }, 300));
            
            // Clear search on Escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.setCategory(e.target.value);
                this.updateURL();
                this.triggerFilterChange();
            });
        }

        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.setSort(e.target.value);
                this.updateURL();
                this.triggerFilterChange();
            });
        }
    }

    /**
     * Set search term
     */
    setSearch(term) {
        this.searchTerm = (term || '').toLowerCase().trim();
    }

    /**
     * Set selected category
     */
    setCategory(category) {
        this.selectedCategory = category || '';
    }

    /**
     * Set sort criteria
     */
    setSort(sortBy, order = 'asc') {
        this.sortBy = sortBy || 'name';
        this.sortOrder = order;
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.searchTerm = '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.updateURL();
        this.triggerFilterChange();
    }

    /**
     * Clear all filters
     */
    clearAll() {
        this.searchTerm = '';
        this.selectedCategory = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        
        // Update UI
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (sortFilter) sortFilter.value = 'name';
        
        this.updateURL();
        this.triggerFilterChange();
    }

    /**
     * Apply all filters to images array
     */
    apply(images) {
        if (!images || !Array.isArray(images)) {
            return [];
        }

        let filtered = [...images];

        // Apply search filter
        if (this.searchTerm) {
            filtered = this.applySearchFilter(filtered);
        }

        // Apply category filter
        if (this.selectedCategory) {
            filtered = this.applyCategoryFilter(filtered);
        }

        // Apply sorting
        filtered = this.applySorting(filtered);

        return filtered;
    }

    /**
     * Apply search filter
     */
    applySearchFilter(images) {
        const searchTerms = this.searchTerm.split(' ').filter(term => term.length > 0);
        
        return images.filter(image => {
            return searchTerms.every(term => {
                return this.matchesSearchTerm(image, term);
            });
        });
    }

    /**
     * Check if image matches search term
     */
    matchesSearchTerm(image, term) {
        const searchableFields = [
            image.filename?.toLowerCase(),
            image.description?.toLowerCase(),
            image.category?.toLowerCase(),
            ...(image.tags || []).map(tag => tag.toLowerCase())
        ].filter(Boolean);

        return searchableFields.some(field => field.includes(term));
    }

    /**
     * Apply category filter
     */
    applyCategoryFilter(images) {
        return images.filter(image => image.category === this.selectedCategory);
    }

    /**
     * Apply sorting
     */
    applySorting(images) {
        return images.sort((a, b) => {
            let comparison = 0;

            switch (this.sortBy) {
                case 'name':
                    comparison = this.compareStrings(a.filename, b.filename);
                    break;
                case 'date':
                    comparison = this.compareDates(a.dateAdded, b.dateAdded);
                    break;
                case 'category':
                    comparison = this.compareStrings(a.category, b.category);
                    break;
                default:
                    comparison = 0;
            }

            return this.sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    /**
     * Compare strings for sorting
     */
    compareStrings(a, b) {
        const strA = (a || '').toLowerCase();
        const strB = (b || '').toLowerCase();
        return strA.localeCompare(strB);
    }

    /**
     * Compare dates for sorting
     */
    compareDates(a, b) {
        const dateA = new Date(a || 0);
        const dateB = new Date(b || 0);
        return dateA - dateB;
    }

    /**
     * Get current filter state
     */
    getState() {
        return {
            searchTerm: this.searchTerm,
            selectedCategory: this.selectedCategory,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder
        };
    }

    /**
     * Set filter state
     */
    setState(state) {
        if (!state) return;

        this.searchTerm = state.searchTerm || '';
        this.selectedCategory = state.selectedCategory || '';
        this.sortBy = state.sortBy || 'name';
        this.sortOrder = state.sortOrder || 'asc';

        this.updateUI();
    }

    /**
     * Update UI to reflect current filter state
     */
    updateUI() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (searchInput) searchInput.value = this.searchTerm;
        if (categoryFilter) categoryFilter.value = this.selectedCategory;
        if (sortFilter) sortFilter.value = this.sortBy;
    }

    /**
     * Update URL with current filter state
     */
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.searchTerm) params.set('search', this.searchTerm);
        if (this.selectedCategory) params.set('category', this.selectedCategory);
        if (this.sortBy !== 'name') params.set('sort', this.sortBy);
        if (this.sortOrder !== 'asc') params.set('order', this.sortOrder);

        const url = new URL(window.location);
        url.search = params.toString();
        
        // Update URL without page reload
        window.history.replaceState({}, '', url);
    }

    /**
     * Restore filters from URL parameters
     */
    restoreFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        const searchTerm = params.get('search');
        const category = params.get('category');
        const sortBy = params.get('sort');
        const sortOrder = params.get('order');

        if (searchTerm) this.setSearch(searchTerm);
        if (category) this.setCategory(category);
        if (sortBy) this.setSort(sortBy, sortOrder || 'asc');

        this.updateUI();
    }

    /**
     * Trigger filter change event
     */
    triggerFilterChange() {
        const event = new CustomEvent('filtersChanged', {
            detail: {
                state: this.getState(),
                filters: this
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get filter statistics
     */
    getStats(originalImages, filteredImages) {
        const categoryCounts = this.getCategoryCounts();
        
        return {
            totalImages: originalImages?.length || 0,
            filteredImages: filteredImages?.length || 0,
            hasActiveFilters: this.hasActiveFilters(),
            searchTerm: this.searchTerm,
            selectedCategory: this.selectedCategory,
            sortBy: this.sortBy,
            categoryCounts
        };
    }

    /**
     * Check if any filters are active
     */
    hasActiveFilters() {
        return !!(this.searchTerm || this.selectedCategory || this.sortBy !== 'name');
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
     * Get suggestions for search autocomplete (future enhancement)
     */
    getSearchSuggestions(term) {
        if (!term || term.length < 2) return [];

        const suggestions = new Set();
        const lowerTerm = term.toLowerCase();

        this.data.images.forEach(image => {
            // Add matching tags
            if (image.tags) {
                image.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(lowerTerm)) {
                        suggestions.add(tag);
                    }
                });
            }

            // Add matching filename parts
            if (image.filename?.toLowerCase().includes(lowerTerm)) {
                const words = image.filename.split(/[-_\s]+/);
                words.forEach(word => {
                    if (word.toLowerCase().includes(lowerTerm)) {
                        suggestions.add(word);
                    }
                });
            }
        });

        return Array.from(suggestions).slice(0, 10);
    }

    /**
     * Cleanup method
     */
    destroy() {
        // Remove event listeners if needed
        // Currently using anonymous functions, so no explicit cleanup needed
    }
}