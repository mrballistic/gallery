# Gallery App PRD & Implementation Plan

## Product Requirements Document (PRD)

### 1. Product Overview
A simple, elegant gallery application for displaying and managing images without backend infrastructure. Images will be stored in the repository and served statically.

### 2. Core Features

#### 2.1 Image Display
- Grid layout of images with responsive design
- Thumbnail view in gallery
- Full-size image viewer (lightbox/modal)
- Image metadata display (filename, dimensions)
- Smooth transitions and animations

#### 2.2 Image Management
- Upload images (stored in `/public/images` directory)
- Delete images
- Organize images into albums/categories
- Search/filter by filename or category
- Sort by name, date added, or custom order

#### 2.3 User Interface
- Clean, modern design using MUI components
- Mobile-responsive layout
- Dark/light mode toggle
- Grid/list view toggle
- Zoom controls in lightbox view

### 3. Technical Constraints
- **Frontend**: React with Next.js 14+ (App Router)
- **UI Library**: Material-UI (MUI)
- **Storage**: Static files in `/public/images`
- **Metadata**: JSON file in `/public` or `/data` directory
- **Deployment**: Vercel
- **No backend, no database, no authentication**

### 4. Data Structure

Images metadata will be stored in a JSON file (`/data/gallery.json`):

```json
{
  "images": [
    {
      "id": "unique-id",
      "filename": "image.jpg",
      "path": "/images/image.jpg",
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
**Estimated Time: 1-2 hours**

#### Tasks:
1. **Initialize Next.js project**
   ```bash
   npx create-next-app@latest gallery-app --typescript --app --no-src-dir
   cd gallery-app
   ```

2. **Install dependencies**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   ```

3. **Create folder structure**
   ```
   /app
     /page.tsx (home/gallery page)
     /layout.tsx (root layout with MUI theme)
   /components
     /Gallery.tsx
     /ImageCard.tsx
     /ImageViewer.tsx
     /Header.tsx
     /FilterBar.tsx
   /data
     /gallery.json
   /public
     /images
       /.gitkeep
   /lib
     /galleryData.ts (utility functions)
   /types
     /gallery.ts (TypeScript interfaces)
   ```

4. **Setup MUI theme provider in layout.tsx**

**Copilot Prompts:**
- "Create a Next.js 14 app router layout with MUI theme provider supporting dark/light mode"
- "Create TypeScript interfaces for gallery image data structure"

---

### Phase 2: Core Components
**Estimated Time: 2-3 hours**

#### Tasks:
1. **Create type definitions** (`/types/gallery.ts`)
   - Image interface
   - Category interface
   - Gallery data interface

2. **Create data utilities** (`/lib/galleryData.ts`)
   - Function to read gallery.json
   - Filter functions
   - Sort functions

3. **Build Header component**
   - App title
   - Theme toggle button
   - View mode toggle (grid/list)

4. **Build FilterBar component**
   - Category dropdown
   - Search input
   - Sort dropdown

5. **Build ImageCard component**
   - Thumbnail display
   - Image info overlay on hover
   - Click handler for full view

**Copilot Prompts:**
- "Create a MUI-based Header component with app title and theme toggle button"
- "Create a FilterBar component with MUI Select for categories and TextField for search"
- "Create an ImageCard component using MUI Card that shows image thumbnail with hover overlay"

---

### Phase 3: Gallery View & Image Viewer
**Estimated Time: 2-3 hours**

#### Tasks:
1. **Build Gallery component**
   - Responsive grid layout using MUI Grid
   - Map through filtered images
   - Handle empty states

2. **Build ImageViewer component**
   - Modal/Dialog for full-size view
   - Navigation arrows (prev/next)
   - Close button
   - Image metadata display
   - Zoom controls (optional)

3. **Integrate components in main page**
   - Load gallery data
   - Manage filter/search state
   - Pass data to Gallery component

**Copilot Prompts:**
- "Create a Gallery component with responsive MUI Grid layout that displays ImageCard components"
- "Create an ImageViewer component using MUI Dialog for full-screen image viewing with prev/next navigation"
- "Create the main gallery page that loads data from gallery.json and manages filter state"

---

### Phase 4: Interactivity & Polish
**Estimated Time: 2-3 hours**

#### Tasks:
1. **Implement filtering logic**
   - Category filter
   - Search filter
   - Combined filters

2. **Implement sorting**
   - By name
   - By date added
   - By category

3. **Add animations**
   - Image card hover effects
   - Modal transitions
   - Loading states

4. **Mobile optimization**
   - Responsive breakpoints
   - Touch gestures for image viewer
   - Mobile-friendly controls

5. **Add sample images and data**
   - Create sample gallery.json
   - Add placeholder images

**Copilot Prompts:**
- "Add filter and search logic to filter images by category and search term"
- "Add smooth transitions and hover effects to ImageCard using MUI sx prop"
- "Make the Gallery responsive with proper breakpoints for mobile, tablet, and desktop"

---

### Phase 5: Image Management (Optional Enhancement)
**Estimated Time: 2-4 hours**

#### Tasks:
1. **Create admin mode toggle**
   - Simple button to enable edit mode
   - Show management controls when active

2. **Add image upload interface**
   - File input component
   - Preview before adding
   - Update gallery.json

3. **Add delete functionality**
   - Delete button on ImageCard (in edit mode)
   - Confirmation dialog
   - Update gallery.json

4. **Add category management**
   - Create new categories
   - Assign images to categories

**Note**: Since there's no backend, these operations would need to be done manually by updating the JSON file and adding images to the `/public/images` folder, then redeploying. You could create a development-only admin interface that generates the updated JSON for you to copy.

**Copilot Prompts:**
- "Create a development-only admin panel that helps generate updated gallery.json when adding/removing images"
- "Create a file upload component that previews images and generates JSON entries"

---

### Phase 6: Testing & Deployment
**Estimated Time: 1-2 hours**

#### Tasks:
1. **Testing**
   - Test all filter combinations
   - Test on different screen sizes
   - Test image viewer navigation
   - Test theme switching

2. **Optimization**
   - Add Next.js Image component for optimization
   - Lazy loading for images
   - Add metadata for SEO

3. **Deployment to Vercel**
   - Connect GitHub repository
   - Configure build settings
   - Deploy and test

**Copilot Prompts:**
- "Convert img tags to Next.js Image components with proper optimization"
- "Add SEO metadata to the gallery page using Next.js metadata API"

---

## Development Tips for Working with Copilot

### Effective Prompting Strategy:

1. **Start with structure**: "Create the folder structure and empty files for a gallery app"

2. **Build incrementally**: Complete one component before moving to the next

3. **Be specific about MUI**: Always mention you want MUI components, not plain HTML

4. **Request TypeScript**: Specify TypeScript types in your prompts

5. **Ask for responsive design**: Include "responsive" or "mobile-friendly" in prompts

6. **Iterate**: If the first result isn't perfect, refine with: "Update this component to..."

### Sample Workflow:

```
You: "Create a TypeScript interface for a gallery image with id, filename, path, category, dateAdded, description, and tags"

[Review Copilot's response]

You: "Now create a utility function that reads this data from a JSON file and filters by category"

[Review and test]

You: "Create a MUI-based ImageCard component that displays this image data with hover effects"

[Continue building...]
```

---

## Folder Structure Summary

```
gallery-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Gallery.tsx
│   ├── ImageCard.tsx
│   ├── ImageViewer.tsx
│   ├── Header.tsx
│   └── FilterBar.tsx
├── lib/
│   └── galleryData.ts
├── types/
│   └── gallery.ts
├── data/
│   └── gallery.json
├── public/
│   └── images/
│       └── (your image files)
├── package.json
└── next.config.js
```

---

## Success Criteria

- [ ] Gallery displays images in responsive grid
- [ ] Click image to view full-size
- [ ] Filter by category works
- [ ] Search by filename works
- [ ] Theme toggle works (light/dark)
- [ ] Mobile responsive
- [ ] Deployed successfully on Vercel
- [ ] Images load efficiently with Next.js Image optimization

---

## Future Enhancements (Post-MVP)

- Image tagging system
- Slideshow mode
- Share functionality (copy link)
- Favorite/like system (stored in localStorage)
- Multiple gallery collections
- Image EXIF data display
- Keyboard shortcuts for navigation
- Download image option

