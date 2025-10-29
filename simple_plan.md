# Gallery App PRD & Implementation Plan (Vanilla HTML/CSS/JS)

## Product Requirements Document (PRD)

### 1. Product Overview
A simple, elegant gallery application for displaying and managing images using pure HTML, CSS, and JavaScript. Images will be stored in the repository and served statically.

### 2. Core Features

#### 2.1 Image Display
- Grid layout of images with responsive design
- Thumbnail view in gallery
- Full-size image viewer (lightbox/modal)
- Image metadata display (filename, dimensions)
- Smooth transitions and animations

#### 2.2 Image Management
- Display images from `/images` directory
- Organize images into albums/categories
- Search/filter by filename or category
- Sort by name, date added, or custom order

#### 2.3 User Interface
- Clean, modern design using CSS Grid and Flexbox
- Mobile-responsive layout
- Dark/light mode toggle
- Grid/list view toggle
- Zoom controls in lightbox view

### 3. Technical Constraints
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Static files in `/images`
- **Metadata**: JSON file loaded via fetch
- **Deployment**: Vercel (or any static host)
- **No frameworks, no build tools, no backend**

### 4. Data Structure

Images metadata will be stored in a JSON file (`/data/gallery.json`):

```json
{
  "images": [
    {
      "id": "unique-id",
      "filename": "image.jpg",
      "path": "./images/image.jpg",
      "thumbnail": "./images/thumbnails/image.jpg",
      "category": "nature",
      "dateAdded": "2025-10-29",
      "description": "Optional description",
      "tags": ["landscape", "sunset"]
    }
  ],
  "categories": ["nature", "urban", "portrait"]
}
```

### 5. User Stories

1. As a user, I want to view all my images in a grid so I can browse my collection
2. As a user, I want to click on an image to view it full-size
3. As a user, I want to filter images by category
4. As a user, I want to search for images by name
5. As a user, I want to toggle between light and dark themes
6. As a user, I want the app to work well on mobile devices

---

## Implementation Plan

### Phase 1: Project Setup & Basic Structure
**Estimated Time: 30 minutes - 1 hour**

#### Tasks:
1. **Create folder structure**
   ```
   gallery-app/
   ├── index.html
   ├── css/
   │   ├── styles.css
   │   ├── gallery.css
   │   ├── modal.css
   │   └── themes.css
   ├── js/
   │   ├── app.js
   │   ├── gallery.js
   │   ├── modal.js
   │   ├── filters.js
   │   └── theme.js
   ├── data/
   │   └── gallery.json
   ├── images/
   │   └── .gitkeep
   └── README.md
   ```

2. **Create basic HTML structure** (`index.html`)
   - Semantic HTML5 elements
   - Meta tags for responsive design
   - Link CSS files
   - Script tags for JS modules

3. **Setup CSS variables for theming** (`css/themes.css`)
   - Light theme colors
   - Dark theme colors
   - Transition properties

**Copilot Prompts:**
- "Create an HTML5 boilerplate for a gallery app with semantic structure including header, main, and footer"
- "Create CSS custom properties for a light and dark theme with modern color palette"

---

### Phase 2: Core HTML Structure
**Estimated Time: 1 hour**

#### Tasks:
1. **Create main HTML layout** (`index.html`)
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>My Gallery</title>
       <link rel="stylesheet" href="css/styles.css">
       <link rel="stylesheet" href="css/gallery.css">
       <link rel="stylesheet" href="css/modal.css">
       <link rel="stylesheet" href="css/themes.css">
   </head>
   <body>
       <header class="header">
           <h1 class="header__title">My Gallery</h1>
           <div class="header__controls">
               <button id="themeToggle" class="btn btn--icon" aria-label="Toggle theme">
                   <span class="icon">🌙</span>
               </button>
               <button id="viewToggle" class="btn btn--icon" aria-label="Toggle view">
                   <span class="icon">⊞</span>
               </button>
           </div>
       </header>

       <main class="main">
           <aside class="filters">
               <div class="filter-group">
                   <label for="searchInput">Search</label>
                   <input type="text" id="searchInput" placeholder="Search images...">
               </div>
               
               <div class="filter-group">
                   <label for="categoryFilter">Category</label>
                   <select id="categoryFilter">
                       <option value="">All Categories</option>
                   </select>
               </div>
               
               <div class="filter-group">
                   <label for="sortFilter">Sort By</label>
                   <select id="sortFilter">
                       <option value="name">Name</option>
                       <option value="date">Date Added</option>
                       <option value="category">Category</option>
                   </select>
               </div>
           </aside>

           <section class="gallery" id="gallery">
               <!-- Images will be dynamically inserted here -->
           </section>
       </main>

       <!-- Modal for full-size image viewing -->
       <div id="imageModal" class="modal">
           <button class="modal__close" aria-label="Close">&times;</button>
           <button class="modal__nav modal__nav--prev" aria-label="Previous">‹</button>
           <button class="modal__nav modal__nav--next" aria-label="Next">›</button>
           <div class="modal__content">
               <img id="modalImage" src="" alt="">
               <div class="modal__info">
                   <h3 id="modalTitle"></h3>
                   <p id="modalDescription"></p>
                   <div id="modalTags" class="modal__tags"></div>
               </div>
           </div>
       </div>

       <script type="module" src="js/app.js"></script>
   </body>
   </html>
   ```

**Copilot Prompts:**
- "Create semantic HTML structure for a gallery app with header, filters sidebar, gallery grid, and modal"
- "Add accessibility attributes to the HTML gallery structure"

---

### Phase 3: Base Styling
**Estimated Time: 2-3 hours**

#### Tasks:

1. **Create base styles** (`css/styles.css`)
   - CSS reset/normalize
   - Base typography
   - Layout structure
   - Utility classes

2. **Create theme styles** (`css/themes.css`)
   ```css
   :root {
       /* Light theme (default) */
       --color-bg: #ffffff;
       --color-surface: #f5f5f5;
       --color-text: #333333;
       --color-text-secondary: #666666;
       --color-primary: #2196F3;
       --color-border: #e0e0e0;
       --shadow: 0 2px 8px rgba(0,0,0,0.1);
       --shadow-hover: 0 4px 16px rgba(0,0,0,0.15);
   }

   [data-theme="dark"] {
       --color-bg: #1a1a1a;
       --color-surface: #2d2d2d;
       --color-text: #ffffff;
       --color-text-secondary: #b0b0b0;
       --color-primary: #64B5F6;
       --color-border: #404040;
       --shadow: 0 2px 8px rgba(0,0,0,0.3);
       --shadow-hover: 0 4px 16px rgba(0,0,0,0.4);
   }
   ```

3. **Create gallery grid styles** (`css/gallery.css`)
   - Responsive CSS Grid layout
   - Image card styles
   - Hover effects
   - Loading states

4. **Create modal styles** (`css/modal.css`)
   - Full-screen overlay
   - Image container
   - Navigation buttons
   - Animations

**Copilot Prompts:**
- "Create a modern CSS reset and base styles with CSS custom properties"
- "Create responsive CSS Grid layout for image gallery with 1-4 columns based on screen size"
- "Create CSS for a full-screen modal with smooth fade-in animation and backdrop blur"
- "Create image card styles with hover effects and smooth transitions"

---

### Phase 4: JavaScript - Data Loading
**Estimated Time: 1-2 hours**

#### Tasks:

1. **Create main app initialization** (`js/app.js`)
   ```javascript
   import { Gallery } from './gallery.js';
   import { Modal } from './modal.js';
   import { Filters } from './filters.js';
   import { Theme } from './theme.js';

   class App {
       constructor() {
           this.gallery = null;
           this.modal = null;
           this.filters = null;
           this.theme = null;
           this.data = null;
       }

       async init() {
           try {
               // Load gallery data
               const response = await fetch('./data/gallery.json');
               this.data = await response.json();

               // Initialize components
               this.gallery = new Gallery(this.data.images);
               this.modal = new Modal();
               this.filters = new Filters(this.data);
               this.theme = new Theme();

               // Setup event listeners
               this.setupEventListeners();

               // Initial render
               this.gallery.render();
           } catch (error) {
               console.error('Failed to initialize app:', error);
               this.showError('Failed to load gallery. Please refresh the page.');
           }
       }

       setupEventListeners() {
           // Filter events
           document.getElementById('searchInput').addEventListener('input', (e) => {
               this.filters.setSearch(e.target.value);
               this.updateGallery();
           });

           document.getElementById('categoryFilter').addEventListener('change', (e) => {
               this.filters.setCategory(e.target.value);
               this.updateGallery();
           });

           document.getElementById('sortFilter').addEventListener('change', (e) => {
               this.filters.setSort(e.target.value);
               this.updateGallery();
           });

           // Theme toggle
           document.getElementById('themeToggle').addEventListener('click', () => {
               this.theme.toggle();
           });

           // View toggle
           document.getElementById('viewToggle').addEventListener('click', () => {
               this.gallery.toggleView();
           });
       }

       updateGallery() {
           const filteredImages = this.filters.apply(this.data.images);
           this.gallery.update(filteredImages);
       }

       showError(message) {
           const gallery = document.getElementById('gallery');
           gallery.innerHTML = `<div class="error">${message}</div>`;
       }
   }

   // Initialize app when DOM is ready
   document.addEventListener('DOMContentLoaded', () => {
       const app = new App();
       app.init();
   });
   ```

2. **Create gallery module** (`js/gallery.js`)
   - Render image grid
   - Handle image clicks
   - Toggle view modes
   - Update with filtered data

**Copilot Prompts:**
- "Create a JavaScript module that fetches gallery.json and initializes the app"
- "Create a Gallery class that renders image cards dynamically from JSON data"
- "Add error handling for failed fetch requests with user-friendly messages"

---

### Phase 5: JavaScript - Gallery Component
**Estimated Time: 2 hours**

#### Tasks:

1. **Complete Gallery class** (`js/gallery.js`)
   ```javascript
   export class Gallery {
       constructor(images) {
           this.images = images;
           this.container = document.getElementById('gallery');
           this.viewMode = 'grid'; // 'grid' or 'list'
       }

       render() {
           this.container.innerHTML = '';
           
           if (this.images.length === 0) {
               this.container.innerHTML = '<div class="empty-state">No images found</div>';
               return;
           }

           this.images.forEach((image, index) => {
               const card = this.createImageCard(image, index);
               this.container.appendChild(card);
           });
       }

       createImageCard(image, index) {
           const card = document.createElement('div');
           card.className = `gallery__card gallery__card--${this.viewMode}`;
           card.dataset.index = index;

           card.innerHTML = `
               <div class="card__image-wrapper">
                   <img 
                       src="${image.thumbnail || image.path}" 
                       alt="${image.description || image.filename}"
                       loading="lazy"
                       class="card__image"
                   >
                   <div class="card__overlay">
                       <button class="card__view-btn" data-index="${index}">
                           View Full Size
                       </button>
                   </div>
               </div>
               <div class="card__info">
                   <h3 class="card__title">${image.filename}</h3>
                   <span class="card__category">${image.category}</span>
               </div>
           `;

           // Add click event
           card.querySelector('.card__view-btn').addEventListener('click', (e) => {
               e.stopPropagation();
               this.openImage(index);
           });

           card.addEventListener('click', () => {
               this.openImage(index);
           });

           return card;
       }

       openImage(index) {
           const event = new CustomEvent('imageClick', { 
               detail: { image: this.images[index], index } 
           });
           document.dispatchEvent(event);
       }

       update(images) {
           this.images = images;
           this.render();
       }

       toggleView() {
           this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
           this.container.classList.toggle('gallery--list');
           this.render();
       }
   }
   ```

**Copilot Prompts:**
- "Create a Gallery class with methods to render image cards dynamically"
- "Add lazy loading to images using the loading='lazy' attribute"
- "Create a method to toggle between grid and list view modes"

---

### Phase 6: JavaScript - Modal Component
**Estimated Time: 1-2 hours**

#### Tasks:

1. **Create Modal class** (`js/modal.js`)
   ```javascript
   export class Modal {
       constructor() {
           this.modal = document.getElementById('imageModal');
           this.modalImage = document.getElementById('modalImage');
           this.modalTitle = document.getElementById('modalTitle');
           this.modalDescription = document.getElementById('modalDescription');
           this.modalTags = document.getElementById('modalTags');
           
           this.currentIndex = 0;
           this.images = [];
           
           this.setupEventListeners();
       }

       setupEventListeners() {
           // Close button
           this.modal.querySelector('.modal__close').addEventListener('click', () => {
               this.close();
           });

           // Click outside to close
           this.modal.addEventListener('click', (e) => {
               if (e.target === this.modal) {
                   this.close();
               }
           });

           // Navigation buttons
           this.modal.querySelector('.modal__nav--prev').addEventListener('click', () => {
               this.navigate(-1);
           });

           this.modal.querySelector('.modal__nav--next').addEventListener('click', () => {
               this.navigate(1);
           });

           // Keyboard navigation
           document.addEventListener('keydown', (e) => {
               if (!this.modal.classList.contains('modal--open')) return;

               switch(e.key) {
                   case 'Escape':
                       this.close();
                       break;
                   case 'ArrowLeft':
                       this.navigate(-1);
                       break;
                   case 'ArrowRight':
                       this.navigate(1);
                       break;
               }
           });

           // Listen for image click events
           document.addEventListener('imageClick', (e) => {
               this.open(e.detail.index, e.detail.images || []);
           });
       }

       open(index, images) {
           this.currentIndex = index;
           this.images = images;
           this.updateContent();
           this.modal.classList.add('modal--open');
           document.body.style.overflow = 'hidden';
       }

       close() {
           this.modal.classList.remove('modal--open');
           document.body.style.overflow = '';
       }

       navigate(direction) {
           this.currentIndex += direction;
           
           if (this.currentIndex < 0) {
               this.currentIndex = this.images.length - 1;
           } else if (this.currentIndex >= this.images.length) {
               this.currentIndex = 0;
           }
           
           this.updateContent();
       }

       updateContent() {
           const image = this.images[this.currentIndex];
           
           this.modalImage.src = image.path;
           this.modalImage.alt = image.description || image.filename;
           this.modalTitle.textContent = image.filename;
           this.modalDescription.textContent = image.description || '';
           
           // Update tags
           this.modalTags.innerHTML = '';
           if (image.tags && image.tags.length > 0) {
               image.tags.forEach(tag => {
                   const tagEl = document.createElement('span');
                   tagEl.className = 'tag';
                   tagEl.textContent = tag;
                   this.modalTags.appendChild(tagEl);
               });
           }
       }
   }
   ```

**Copilot Prompts:**
- "Create a Modal class for displaying full-size images with prev/next navigation"
- "Add keyboard navigation support (Escape to close, arrows to navigate)"
- "Prevent body scroll when modal is open"

---

### Phase 7: JavaScript - Filters & Theme
**Estimated Time: 1-2 hours**

#### Tasks:

1. **Create Filters class** (`js/filters.js`)
   ```javascript
   export class Filters {
       constructor(data) {
           this.data = data;
           this.searchTerm = '';
           this.selectedCategory = '';
           this.sortBy = 'name';
           
           this.populateCategoryFilter();
       }

       populateCategoryFilter() {
           const select = document.getElementById('categoryFilter');
           
           this.data.categories.forEach(category => {
               const option = document.createElement('option');
               option.value = category;
               option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
               select.appendChild(option);
           });
       }

       setSearch(term) {
           this.searchTerm = term.toLowerCase();
       }

       setCategory(category) {
           this.selectedCategory = category;
       }

       setSort(sortBy) {
           this.sortBy = sortBy;
       }

       apply(images) {
           let filtered = [...images];

           // Apply search filter
           if (this.searchTerm) {
               filtered = filtered.filter(img => 
                   img.filename.toLowerCase().includes(this.searchTerm) ||
                   (img.description && img.description.toLowerCase().includes(this.searchTerm)) ||
                   (img.tags && img.tags.some(tag => tag.toLowerCase().includes(this.searchTerm)))
               );
           }

           // Apply category filter
           if (this.selectedCategory) {
               filtered = filtered.filter(img => img.category === this.selectedCategory);
           }

           // Apply sorting
           filtered.sort((a, b) => {
               switch(this.sortBy) {
                   case 'name':
                       return a.filename.localeCompare(b.filename);
                   case 'date':
                       return new Date(b.dateAdded) - new Date(a.dateAdded);
                   case 'category':
                       return a.category.localeCompare(b.category);
                   default:
                       return 0;
               }
           });

           return filtered;
       }
   }
   ```

2. **Create Theme class** (`js/theme.js`)
   ```javascript
   export class Theme {
       constructor() {
           this.currentTheme = localStorage.getItem('theme') || 'light';
           this.button = document.getElementById('themeToggle');
           this.apply();
       }

       toggle() {
           this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
           this.apply();
           localStorage.setItem('theme', this.currentTheme);
       }

       apply() {
           document.documentElement.setAttribute('data-theme', this.currentTheme);
           this.updateIcon();
       }

       updateIcon() {
           const icon = this.button.querySelector('.icon');
           icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
       }
   }
   ```

**Copilot Prompts:**
- "Create a Filters class that filters images by search term, category, and sorts them"
- "Create a Theme class that toggles between light and dark mode and persists to localStorage"
- "Add debouncing to the search input for better performance"

---

### Phase 8: Styling Polish
**Estimated Time: 2-3 hours**

#### Tasks:

1. **Complete gallery.css**
   ```css
   .gallery {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
       gap: 1.5rem;
       padding: 2rem;
   }

   .gallery--list {
       grid-template-columns: 1fr;
   }

   .gallery__card {
       background: var(--color-surface);
       border-radius: 8px;
       overflow: hidden;
       box-shadow: var(--shadow);
       transition: transform 0.3s ease, box-shadow 0.3s ease;
       cursor: pointer;
   }

   .gallery__card:hover {
       transform: translateY(-4px);
       box-shadow: var(--shadow-hover);
   }

   .card__image-wrapper {
       position: relative;
       padding-top: 75%; /* 4:3 aspect ratio */
       overflow: hidden;
       background: var(--color-border);
   }

   .card__image {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       object-fit: cover;
       transition: transform 0.3s ease;
   }

   .gallery__card:hover .card__image {
       transform: scale(1.05);
   }

   .card__overlay {
       position: absolute;
       top: 0;
       left: 0;
       right: 0;
       bottom: 0;
       background: rgba(0, 0, 0, 0.7);
       display: flex;
       align-items: center;
       justify-content: center;
       opacity: 0;
       transition: opacity 0.3s ease;
   }

   .gallery__card:hover .card__overlay {
       opacity: 1;
   }

   .card__view-btn {
       padding: 0.75rem 1.5rem;
       background: var(--color-primary);
       color: white;
       border: none;
       border-radius: 4px;
       cursor: pointer;
       font-size: 1rem;
       transition: background 0.2s ease;
   }

   .card__view-btn:hover {
       background: var(--color-primary-dark);
   }

   .card__info {
       padding: 1rem;
   }

   .card__title {
       margin: 0 0 0.5rem 0;
       font-size: 1rem;
       color: var(--color-text);
   }

   .card__category {
       display: inline-block;
       padding: 0.25rem 0.75rem;
       background: var(--color-primary);
       color: white;
       border-radius: 12px;
       font-size: 0.875rem;
   }

   /* List view styles */
   .gallery__card--list {
       display: flex;
       flex-direction: row;
   }

   .gallery__card--list .card__image-wrapper {
       flex: 0 0 200px;
       padding-top: 0;
       height: 150px;
   }

   .gallery__card--list .card__info {
       flex: 1;
   }

   /* Responsive */
   @media (max-width: 768px) {
       .gallery {
           grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
           gap: 1rem;
           padding: 1rem;
       }
   }
   ```

2. **Complete modal.css**
   ```css
   .modal {
       display: none;
       position: fixed;
       top: 0;
       left: 0;
       right: 0;
       bottom: 0;
       background: rgba(0, 0, 0, 0.9);
       z-index: 1000;
       align-items: center;
       justify-content: center;
   }

   .modal--open {
       display: flex;
       animation: fadeIn 0.3s ease;
   }

   @keyframes fadeIn {
       from { opacity: 0; }
       to { opacity: 1; }
   }

   .modal__content {
       max-width: 90vw;
       max-height: 90vh;
       display: flex;
       flex-direction: column;
       align-items: center;
   }

   .modal__content img {
       max-width: 100%;
       max-height: 70vh;
       object-fit: contain;
       border-radius: 4px;
   }

   .modal__close {
       position: absolute;
       top: 1rem;
       right: 1rem;
       background: rgba(255, 255, 255, 0.2);
       border: none;
       color: white;
       font-size: 2rem;
       width: 3rem;
       height: 3rem;
       border-radius: 50%;
       cursor: pointer;
       transition: background 0.2s ease;
   }

   .modal__close:hover {
       background: rgba(255, 255, 255, 0.3);
   }

   .modal__nav {
       position: absolute;
       top: 50%;
       transform: translateY(-50%);
       background: rgba(255, 255, 255, 0.2);
       border: none;
       color: white;
       font-size: 3rem;
       width: 3rem;
       height: 3rem;
       border-radius: 50%;
       cursor: pointer;
       transition: background 0.2s ease;
   }

   .modal__nav:hover {
       background: rgba(255, 255, 255, 0.3);
   }

   .modal__nav--prev {
       left: 1rem;
   }

   .modal__nav--next {
       right: 1rem;
   }

   .modal__info {
       margin-top: 1rem;
       color: white;
       text-align: center;
       max-width: 600px;
   }

   .modal__tags {
       display: flex;
       gap: 0.5rem;
       justify-content: center;
       flex-wrap: wrap;
       margin-top: 0.5rem;
   }

   .tag {
       padding: 0.25rem 0.75rem;
       background: rgba(255, 255, 255, 0.2);
       border-radius: 12px;
       font-size: 0.875rem;
   }
   ```

3. **Add responsive styles and animations**

**Copilot Prompts:**
- "Create responsive CSS Grid layout for gallery that adapts to mobile, tablet, and desktop"
- "Add smooth hover animations to image cards with transform and shadow effects"
- "Create full-screen modal styles with backdrop blur and fade-in animation"
- "Add CSS for list view mode as alternative to grid view"

---

### Phase 9: Sample Data & Images
**Estimated Time: 1 hour**

#### Tasks:

1. **Create sample gallery.json**
   ```json
   {
     "images": [
       {
         "id": "img-001",
         "filename": "sunset-beach.jpg",
         "path": "./images/sunset-beach.jpg",
         "thumbnail": "./images/sunset-beach.jpg",
         "category": "nature",
         "dateAdded": "2025-10-15",
         "description": "Beautiful sunset at the beach",
         "tags": ["sunset", "beach", "ocean"]
       },
       {
         "id": "img-002",
         "filename": "city-lights.jpg",
         "path": "./images/city-lights.jpg",
         "thumbnail": "./images/city-lights.jpg",
         "category": "urban",
         "dateAdded": "2025-10-20",
         "description": "City skyline at night",
         "tags": ["city", "night", "lights"]
       }
     ],
     "categories": ["nature", "urban", "portrait", "abstract"]
   }
   ```

2. **Add placeholder images**
   - Use placeholder services (placeholder.com, unsplash.com)
   - Or add your own images
   - Optimize images for web

3. **Test with various image sizes and ratios**

**Copilot Prompts:**
- "Create a sample gallery.json with 10-15 diverse image entries"
- "Generate placeholder image URLs using unsplash API for testing"

---

### Phase 10: Testing & Optimization
**Estimated Time: 2 hours**

#### Tasks:

1. **Cross-browser testing**
   - Test in Chrome, Firefox, Safari, Edge
   - Fix any compatibility issues

2. **Responsive testing**
   - Test on mobile devices
   - Test on tablets
   - Test on different screen sizes

3. **Performance optimization**
   - Lazy load images
   - Optimize CSS (remove unused styles)
   - Minify JavaScript (optional)
   - Compress images

4. **Accessibility improvements**
   - Add ARIA labels
   - Test keyboard navigation
   - Test with screen readers
   - Ensure color contrast

5. **Add loading states**
   - Show spinner while loading data
   - Handle errors gracefully

**Copilot Prompts:**
- "Add loading spinner while gallery data is being fetched"
- "Add error handling with user-friendly error messages"
- "Improve accessibility with proper ARIA labels and keyboard navigation"
- "Add image lazy loading with intersection observer for better performance"

---

### Phase 11: Deployment to Vercel
**Estimated Time: 30 minutes**

#### Tasks:

1. **Create vercel.json** (optional configuration)
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "**/*",
         "use": "@vercel/static"
       }
     ]
   }
   ```

2. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel` in project directory
   - Or connect GitHub repo to Vercel dashboard

3. **Configure custom domain** (optional)

4. **Test deployed version**

**Copilot Prompts:**
- "Create a vercel.json configuration for a static HTML site"
- "What's the best way to deploy a vanilla HTML/CSS/JS app to Vercel?"

---

## Complete File Structure

```
gallery-app/
├── index.html
├── css/
│   ├── styles.css          # Base styles, reset, layout
│   ├── gallery.css         # Gallery grid and card styles
│   ├── modal.css           # Modal/lightbox styles
│   └── themes.css          # Light/dark theme variables
├── js/
│   ├── app.js              # Main app initialization
│   ├── gallery.js          # Gallery component
│   ├── modal.js            # Modal component
│   ├── filters.js          # Filter and sort logic
│   └── theme.js            # Theme toggle logic
├── data/
│   └── gallery.json        # Image metadata
├── images/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── vercel.json             # Vercel configuration (optional)
└── README.md
```

---

## Development Tips for Working with Copilot

### Effective Prompting Strategy:

1. **Start with HTML structure**: "Create semantic HTML for a gallery with header, filters, and grid"

2. **Build CSS incrementally**: "Create CSS Grid layout for responsive image gallery"

3. **JavaScript modules**: "Create a JavaScript class for managing gallery state"

4. **Be specific about vanilla JS**: Always mention "vanilla JavaScript" or "no frameworks"

5. **Request modern features**: "Use ES6 modules, async/await, fetch API"

6. **Ask for accessibility**: Include "with ARIA labels" or "keyboard accessible"

### Sample Workflow:

```
You: "Create semantic HTML5 structure for an image gallery with filters and modal"

[Review Copilot's response]

You: "Now create CSS Grid layout for this gallery that's responsive on mobile"

[Review and test]

You: "Create a vanilla JavaScript class that fetches gallery.json and renders image cards"

[Continue building...]
```

---

## Advantages of Vanilla Approach

✅ **No build process** - Just edit and refresh  
✅ **Faster load times** - No framework overhead  
✅ **Better understanding** - See exactly what's happening  
✅ **Easy debugging** - Simple stack traces  
✅ **Universal compatibility** - Works everywhere  
✅ **Smaller bundle size** - Only what you write  

---

## Success Criteria

- [ ] Gallery displays images in responsive grid
- [ ] Click image to view full-size in modal
- [ ] Filter by category works
- [ ] Search by filename works
- [ ] Theme toggle works (light/dark)
- [ ] Keyboard navigation works (arrows, escape)
- [ ] Mobile responsive
- [ ] Lazy loading implemented
- [ ] Deployed successfully on Vercel
- [ ] No console errors
- [ ] Accessible (ARIA labels, keyboard nav)

---

## Future Enhancements (Post-MVP)

- Image tagging system
- Slideshow mode with autoplay
- Share functionality (copy link)
- Favorite/like system (stored in localStorage)
- Multiple gallery collections
- Image EXIF data display
- Download image option
- Drag-and-drop upload (dev only)
- Service Worker for offline support
- Progressive Web App (PWA) features
