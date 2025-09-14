
import { getBlockCorners, generalizeBlockLocation } from './unpacker.js';

/**
 * Generate a complete HTML interface from shapes data
 * @param {Array} shapes - Array of shape objects from shapes_now.json
 * @param {Object} options - Generation options
 * @returns {Object} - { html, css, js, manifest }
 */
export function generateInterface(shapes, options = {}) {
  const {
    title = "Generated Interface",
    theme = "default",
    responsive = true,
    pwa = true
  } = options;

  // Analyze shapes and create layout structure
  const layout = analyzeLayout(shapes);
  
  // Generate HTML structure
  const html = generateHTML(layout, title);
  
  // Generate CSS styles
  const css = generateCSS(layout, theme, responsive);
  
  // Generate JavaScript functionality
  const js = generateJS(layout);
  
  // Generate PWA manifest if requested
  const manifest = pwa ? generateManifest(title) : null;

  return { html, css, js, manifest, layout };
}

/**
 * Analyze shapes and create semantic layout structure
 */
function analyzeLayout(shapes) {
  const layout = {
    header: [],
    navigation: [],
    sidebar: [],
    main: [],
    footer: [],
    components: [],
    functions: new Map()
  };

  shapes.forEach(shape => {
    const location = generalizeBlockLocation(shape, shapes);
    const component = createComponent(shape, location);
    
    // Classify components by type and location
    if (shape.type === 'NAVIGATION_HORIZONTAL' || location.area.includes('upper')) {
      if (shape.type === 'TEXT' && location.area === 'upper center') {
        layout.header.push(component);
      } else {
        layout.navigation.push(component);
      }
    } else if (shape.type === 'FUNCTION_SIDEPANEL' || location.area.includes('left') || location.area.includes('right')) {
      layout.sidebar.push(component);
    } else if (location.area.includes('lower')) {
      layout.footer.push(component);
    } else {
      layout.main.push(component);
    }

    // Store function references
    if (shape.function) {
      layout.functions.set(shape.id, shape.function);
    }
  });

  return layout;
}

/**
 * Create a component object from shape data
 */
function createComponent(shape, location) {
  return {
    id: shape.id,
    type: shape.type,
    label: shape.label || shape.text || 'Component',
    x: parseInt(shape.x),
    y: parseInt(shape.y),
    width: parseInt(shape.width),
    height: parseInt(shape.height),
    fill: shape.fill || '#ffffff',
    border: shape.border || '#000000',
    function: shape.function,
    location: location,
    corners: getBlockCorners(shape),
    zIndex: shape.zIndex || 1,
    vectorFromCenter: shape.vectorFromCenter || { angle: 0, distance: 0 }
  };
}

/**
 * Generate HTML structure from layout
 */
function generateHTML(layout, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="generated-styles.css">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#000000">
</head>
<body>
    ${generateHeaderHTML(layout.header)}
    ${generateNavigationHTML(layout.navigation)}
    
    <div class="main-container">
        ${generateSidebarHTML(layout.sidebar)}
        <main class="main-content">
            ${generateMainHTML(layout.main)}
        </main>
    </div>
    
    ${generateFooterHTML(layout.footer)}
    
    <script src="generated-interface.js"></script>
</body>
</html>`;
}

function generateHeaderHTML(headerComponents) {
  if (headerComponents.length === 0) return '';
  
  return `<header class="generated-header">
        ${headerComponents.map(comp => `
            <div class="component component-${comp.type.toLowerCase()}" 
                 id="comp-${comp.id}" 
                 data-function="${comp.function || ''}"
                 style="z-index: ${comp.zIndex}">
                ${comp.label}
            </div>
        `).join('')}
    </header>`;
}

function generateNavigationHTML(navComponents) {
  if (navComponents.length === 0) return '';
  
  return `<nav class="generated-navigation">
        ${navComponents.map(comp => `
            <div class="nav-item component-${comp.type.toLowerCase()}" 
                 id="comp-${comp.id}"
                 data-function="${comp.function || ''}"
                 style="z-index: ${comp.zIndex}">
                ${comp.label}
            </div>
        `).join('')}
    </nav>`;
}

function generateSidebarHTML(sidebarComponents) {
  if (sidebarComponents.length === 0) return '';
  
  return `<aside class="generated-sidebar">
        ${sidebarComponents.map(comp => `
            <div class="sidebar-item component-${comp.type.toLowerCase()}" 
                 id="comp-${comp.id}"
                 data-function="${comp.function || ''}"
                 style="z-index: ${comp.zIndex}">
                ${comp.label}
            </div>
        `).join('')}
    </aside>`;
}

function generateMainHTML(mainComponents) {
  return mainComponents.map(comp => `
        <div class="main-item component-${comp.type.toLowerCase()}" 
             id="comp-${comp.id}"
             data-function="${comp.function || ''}"
             style="z-index: ${comp.zIndex}">
            ${comp.label}
        </div>
    `).join('');
}

function generateFooterHTML(footerComponents) {
  if (footerComponents.length === 0) return '';
  
  return `<footer class="generated-footer">
        ${footerComponents.map(comp => `
            <div class="footer-item component-${comp.type.toLowerCase()}" 
                 id="comp-${comp.id}"
                 data-function="${comp.function || ''}"
                 style="z-index: ${comp.zIndex}">
                ${comp.label}
            </div>
        `).join('')}
    </footer>`;
}

/**
 * Generate CSS styles from layout
 */
function generateCSS(layout, theme, responsive) {
  let css = `
/* Generated Interface Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Noto Sans Rounded', sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f5f5f5;
}

.generated-header {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.generated-navigation {
    background: #34495e;
    padding: 0.5rem;
    display: flex;
    gap: 1rem;
}

.nav-item {
    color: white;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.3s;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.main-container {
    display: flex;
    min-height: calc(100vh - 200px);
}

.generated-sidebar {
    width: 250px;
    background: #ecf0f1;
    padding: 1rem;
    border-right: 1px solid #bdc3c7;
}

.sidebar-item {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main-content {
    flex: 1;
    padding: 2rem;
    position: relative;
}

.generated-footer {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    text-align: center;
}

/* Component-specific styles */`;

  // Add specific styles for each component based on original shape properties
  const allComponents = [
    ...layout.header,
    ...layout.navigation,
    ...layout.sidebar,
    ...layout.main,
    ...layout.footer
  ];

  allComponents.forEach(comp => {
    css += `
    background-color: ${comp.fill};
    border: 2px solid ${comp.border};
    width: ${comp.width}px;
    height: ${comp.height}px;
    position: relative;
}`;
  });

  if (responsive) {
    css += `
/* Responsive Design */
@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }
    
    .generated-sidebar {
        width: 100%;
        order: 2;
    }
    
    .generated-navigation {
        flex-wrap: wrap;
    }
}`;
  }

  return css;
}

/**
 * Generate JavaScript functionality
 */
function generateJS(layout) {
  const functionMap = Object.fromEntries(layout.functions);
  
  return `
class GeneratedInterface {
    constructor() {
        this.functions = ${JSON.stringify(functionMap, null, 2)};
        this.init();
    }
    
    init() {
        // Attach event listeners to components with functions
        Object.keys(this.functions).forEach(componentId => {
            const element = document.getElementById('comp-' + componentId);
            if (element) {
                element.addEventListener('click', () => {
                    this.executeFunction(componentId, this.functions[componentId]);
                });
            }
        });
    }
    
    executeFunction(componentId, functionName) {
        console.log('Executing function:', functionName, 'for component:', componentId);
        
        // Function execution logic
        switch(functionName) {
            case 'function:renderProperties':
                this.renderProperties(componentId);
                break;
            case 'function:getmauicaStatus':
                this.getmauicaStatus();
                break;
            default:
                console.warn('Unknown function:', functionName);
        }
    }
    
    renderProperties(componentId) {
        // Placeholder for property rendering
        console.log('Rendering properties for:', componentId);
    }
    
    getmauicaStatus() {
        // Placeholder for status retrieval
        console.log('Getting MAUICA status');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GeneratedInterface();
});

// Export for potential use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeneratedInterface;
}`;
}

/**
 * Generate PWA manifest
 */
function generateManifest(title) {
  return {
    name: title,
    short_name: title.replace(/\s+/g, ''),
    description: `Generated interface from MAQNETIX design`,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}

/**
 * Save generated interface to files
 */
export function saveGeneratedInterface(generatedInterface, outputPath = './generated/') {
  const { html, css, js, manifest } = generatedInterface;
  
  return {
    'index.html': html,
    'generated-styles.css': css,
    'generated-interface.js': js,
    'manifest.json': manifest ? JSON.stringify(manifest, null, 2) : null
  };
}
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------
