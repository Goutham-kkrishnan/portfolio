# Goutham K Krishnan — Developer Portfolio

An animated, interactive developer portfolio website built with HTML, CSS, and JavaScript with GSAP animations.

## 🚀 Quick Start

Open `index.html` in any browser. No build tools required.

```bash
# Or start a local server
python3 -m http.server 8000
# Then open http://localhost:8000
```

## 📁 File Structure

```
portfolio/
├── index.html              # Main page — edit content here
├── css/
│   ├── styles.css           # All styles and responsive rules
│   └── animations.css       # Keyframes and animation classes
├── js/
│   ├── main.js              # Initialization and utilities
│   ├── animations.js        # Hero, particles, cursor effects
│   └── scroll-effects.js    # Scroll animations, filters, modal
├── assets/
│   ├── images/              # Project thumbnails, hero image
│   ├── icons/               # Favicon
│   └── resume/
│       └── resume.pdf       # Your resume file
└── README.md
```

## ✏️ How to Edit Content

All content lives in `index.html`. Simply open it and edit the text.

### Update Personal Info
Edit the hero section text directly:
```html
<h1 class="hero-name">Your Name</h1>
<p class="hero-title">Your Title</p>
```

### Add a New Project
Duplicate an existing `<div class="project-card">` block and modify:
```html
<div class="project-card reveal-card" data-categories="ai" data-project="3">
    <div class="project-image">
        <img src="assets/images/project4.jpg" alt="Description" loading="lazy">
    </div>
    <div class="project-body">
        <h3 class="project-title">New Project</h3>
        <!-- ... rest of content -->
    </div>
</div>
```

### Replace Images
1. Add your images to `assets/images/`
2. Update the `src` attribute in `index.html`

### Update Resume
Replace `assets/resume/resume.pdf` with your actual resume file.

### Update Links
Search for `href="#"` in `index.html` and replace with your actual URLs (GitHub, LinkedIn, etc.)

## 🎨 Customization

### Colors
Edit CSS variables at the top of `css/styles.css`:
```css
:root {
    --bg-primary: #0B0F19;
    --accent-primary: #6366F1;
    --accent-secondary: #22D3EE;
    /* ... */
}
```

### Fonts
Change font imports in `index.html` `<head>` and update:
```css
--font-body: 'Inter', sans-serif;
--font-heading: 'Space Grotesk', sans-serif;
```

## 🚀 Deployment

### GitHub Pages
1. Push to a GitHub repo
2. Go to Settings → Pages → Source: main branch
3. Your site will be live at `https://username.github.io/portfolio`

### Netlify
1. Drag and drop the `portfolio` folder to [netlify.com/drop](https://app.netlify.com/drop)

### Vercel
1. Push to GitHub and import in [vercel.com](https://vercel.com)

## 🔍 Debug Mode
Add `?debug=true` to the URL to show section outlines and ScrollTrigger markers.

## ⚡ Tech Stack
- HTML5 / CSS3 / Vanilla JavaScript
- [GSAP](https://gsap.com) + ScrollTrigger for animations
- [Inter](https://fonts.google.com/specimen/Inter) + [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) fonts
