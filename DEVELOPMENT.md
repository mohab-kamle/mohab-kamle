# Author details
- Name: Mohab mamdouh kamle
- Email: mohabkamle9@gmail.com
- GitHub_Username: mohab-kamle
- LinkedIn: https://www.linkedin.com/in/mohab-kamle?_l=en_US


# Tiso Vision - Development Guide

## Project Structure

```
ShopifyTest/
├── assets/
│   ├── banner_hero_mobile.png
│   ├── banner_hero.png
│   ├── banner_main.png
│   ├── base.css - Base styles, variables, utilities
│   ├── components.css - Reusable component styles
│   ├── icon_arrow_down.svg
│   ├── icon_arrow_right.svg
│   ├── icon_arrow_up.svg
│   ├── icon_cross.svg
│   ├── icon_plus.svg
│   ├── layout.css - Layout-specific styles
│   ├── responsive.css - Media queries and responsive design
│   └── script_product_modal.js
├── config/
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/
│   └── theme.liquid
├── locales/              # Internationalization files
│   ├── en.default.json
│   ├── en.default.schema.json
│   └── [other language files]
├── sections/
│   ├── Banner.liquid     # Main banner with navigation
│   └── Product_Grid.liquid
├── snippets/
│   ├── button.liquid     # Reusable button component
│   └── product_modal.liquid # Product modal component
├── templates/
│   └── index.json
└── DEVELOPMENT.md        # This file
```

## CSS Architecture

### File Organization
The CSS has been reorganized into a modular structure:

1. **base.css** - Foundation styles
   - CSS custom properties (variables)
   - Reset and base element styles
   - Utility classes
   - Accessibility helpers

2. **components.css** - Reusable components
   - Button variants
   - Modal components
   - Dropdown components
   - Color option components

3. **layout.css** - Layout-specific styles
   - Banner and navigation
   - Hero sections
   - Product grid layout
   - Mobile menu structure

4. **responsive.css** - Responsive design
   - Mobile-first approach
   - Breakpoint-specific styles
   - Accessibility preferences
   - Print styles

### CSS Custom Properties
The project uses CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --color-primary: #000;
  --color-secondary: #FFF544;
  --color-background: #F5F5F5;
  
  /* Spacing */
  --spacing-xs: 5px;
  --spacing-sm: 10px;
  --spacing-md: 20px;
  
  /* Typography */
  --font-size-base: 14px;
  --font-size-lg: 18px;
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
}
```

## Component Guidelines

### Button Component
Use the reusable button snippet:
```liquid
{% render 'button', 
  text: 'Primary Button',
  type: 'primary',
  class: 'additional-class'
%}

{% render 'button', 
  text: 'Secondary Button',
  type: 'secondary',
  url: '/products'
%}
```

Parameters:
- `text` (required): Button text content
- `type` (optional): 'primary' or 'secondary', defaults to 'primary'
- `url` (optional): Link URL, renders as `<a>` tag if provided
- `icon` (optional): Icon filename from assets
- `class` (optional): Additional CSS classes
- `onclick` (optional): JavaScript onclick handler

### Modal Component
Use the product modal snippet:
```liquid
{% render 'product_modal' %}
```

The product modal is specifically designed for displaying product details and includes:
- Product image display
- Product information
- Size and color selection
- Add to cart functionality
- Responsive design for mobile and desktop

### Dropdown Component
Dropdown functionality is implemented using CSS and JavaScript within the product modal and other components. The styling includes:

```css
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.dropdown__options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--color-border);
  z-index: var(--z-dropdown);
}
```

## Responsive Design

### Breakpoints
- Mobile: 450px and below
- Tablet: 451px to 768px
- Desktop: 769px to 1024px
- Large Desktop: 1025px and above

### Mobile Navigation
The mobile navigation uses a hamburger menu that:
- Transforms into an X when active
- Pushes content down (no overlay)
- Closes when clicking outside
- Auto-closes on window resize

## JavaScript Patterns

### Mobile Menu Toggle
```javascript
const toggleButton = document.querySelector('.mobile-menu-toggle-container');
const mobileMenu = document.querySelector('.mobile-menu');

toggleButton.addEventListener('click', function() {
  this.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});
```

### Modal Management
```javascript
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.querySelector('.modal__overlay');
  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.querySelector('.modal__overlay');
  modal.style.display = 'none';
  overlay.style.display = 'none';
}
```


## Performance Optimization

### CSS Loading
Load CSS files in order of importance:
1. base.css (critical)
2. layout.css (above-the-fold)
3. components.css (interactive elements)
4. responsive.css (progressive enhancement)

### Image Optimization
- Use appropriate image formats
- Implement lazy loading for product images
- Provide alt text for all images

## Development Workflow

### Adding New Components
1. Create component styles in `components.css`
2. Follow BEM naming convention
3. Use CSS custom properties for theming
4. Add responsive styles in `responsive.css`
5. Document component usage

### Modifying Existing Styles
1. Check if changes affect multiple components
2. Update CSS custom properties if needed
3. Test across all breakpoints
4. Verify accessibility compliance

### Testing Checklist
- [ ] Mobile responsiveness (450px and below)
- [ ] Tablet layout (451px to 768px)
- [ ] Desktop layout (769px and above)
- [ ] Performance impact
- [ ] Cross-browser compatibility

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Improvements

### Recommended Enhancements
1. **CSS Preprocessing**: Consider Sass/SCSS for better organization
2. **Build Process**: Implement CSS minification and autoprefixing
3. **Component Library**: Create a living style guide
4. **Performance**: Implement critical CSS extraction
5. **Testing**: Add visual regression testing
6. **Internationalization**: Expand locale support

## Troubleshooting

### Common Issues
1. **Mobile menu not working**: Check JavaScript event listeners
2. **Styles not applying**: Verify CSS file loading order
3. **Responsive issues**: Check media query syntax
4. **Performance problems**: Audit CSS for unused rules

### Debug Tools
- Browser DevTools for responsive testing
- Lighthouse for performance auditing
- WAVE for accessibility testing
- Can I Use for browser compatibility

## Component Development

### Creating New Snippets
When creating reusable components:
1. Add comprehensive documentation comments
2. Include parameter descriptions and examples
3. Implement accessibility features (ARIA labels, keyboard support)
4. Add error handling for missing parameters
5. Follow consistent naming conventions

### Snippet Best Practices
- Use liquid `assign` for parameter defaults
- Include conditional rendering for optional elements
- Add CSS classes for styling hooks
- Implement progressive enhancement
- Test with various parameter combinations

---