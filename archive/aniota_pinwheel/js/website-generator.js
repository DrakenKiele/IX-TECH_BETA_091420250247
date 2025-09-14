
/**
 * Generate a complete functional website from MAQNETIX shapes
 * @param {Array} shapes - Array of shape objects from shapes JSON
 * @returns {Object} { html, css, js, assets }
 */
export function generateWebsite(shapes = []) {
  console.log(`[Website Generator] Processing ${shapes.length} shapes`);
  
  const website = {
    html: generateHTML(shapes),
    css: generateCSS(shapes),
    js: generateJS(shapes),
    assets: extractAssets(shapes)
  };
  
  return website;
}

/**
 * Generate HTML structure from shapes
 */
function generateHTML(shapes) {
  const components = shapes.map(shape => {
    switch(shape.type) {
      case 'TEXT':
        return generateTextComponent(shape);
      case 'NAVIGATION_HORIZONTAL':
        return generateHorizontalNav(shape);
      case 'NAVIGATION_VERTICAL':
        return generateVerticalNav(shape);
      case 'IMAGE':
        return generateImageComponent(shape);
      case 'FUNCTION_SIDEPANEL':
        return generateSidePanel(shape);
      case 'FUNCTION_CHAT_BOX':
        return generateChatBox(shape);
      default:
        return generateGenericComponent(shape);
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAQNETIX Generated Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="maqnetix-container">
        ${components}
    </div>
    <script src="script.js"></script>
</body>
</html>`;
}

/**
 * Generate CSS from shape positions and styles
 */
function generateCSS(shapes) {
  let css = `
/* MAQNETIX Generated Styles */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Noto Sans Rounded', Arial, sans-serif; }
.maqnetix-container { position: relative; width: 100vw; height: 100vh; overflow: hidden; }

`;

  shapes.forEach(shape => {
    const id = shape.id;
    const x = parseInt(shape.x) || 0;
    const y = parseInt(shape.y) || 0;
    const width = parseInt(shape.width) || 100;
    const height = parseInt(shape.height) || 100;
    const background = shape.background || '#f0f0f0';
    
    css += `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${width}px;
    height: ${height}px;
    background-color: ${background};
    border: 1px solid #ccc;
    border-radius: 4px;
    z-index: ${shape.zIndex || 1};
}

`;
  });

  return css;
}

/**
 * Generate JavaScript functionality
 */
function generateJS(shapes) {
  let js = `
console.log('MAQNETIX Website loaded with ${shapes.length} components');

document.addEventListener('DOMContentLoaded', function() {
`;

  shapes.forEach(shape => {
    if (shape.type === 'FUNCTION_CHAT_BOX') {
      js += generateChatJS(shape);
    } else if (shape.type === 'FUNCTION_SIDEPANEL') {
      js += generateSidePanelJS(shape);
    } else if (shape.type.startsWith('NAVIGATION')) {
      js += generateNavigationJS(shape);
    }
  });

  js += `
});

// Save current state back to MAQNETIX
function saveMaqnetixState() {
    const state = [];
    // Implementation for saving changes back
    console.log('Saving state back to MAQNETIX');
}
`;

  return js;
}

/**
 * Component Generators
 */
function generateTextComponent(shape) {
  const content = shape.sourceData || shape.purpose || 'Text Content';
  return `
    <div id="${shape.id}" class="text-component">
        <h2>${content}</h2>
        <p>Purpose: ${shape.purpose}</p>
    </div>`;
}

function generateHorizontalNav(shape) {
  const navItems = extractNavItems(shape.sourceData);
  const items = navItems.map(item => `<a href="#${item.toLowerCase().replace(/\s+/g, '-')}">${item}</a>`).join('');
  
  return `
    <nav id="${shape.id}" class="horizontal-nav">
        <div class="nav-items">${items}</div>
    </nav>`;
}

function generateVerticalNav(shape) {
  const navItems = extractNavItems(shape.sourceData);
  const items = navItems.map(item => `<li><a href="#${item.toLowerCase().replace(/\s+/g, '-')}">${item}</a></li>`).join('');
  
  return `
    <nav id="${shape.id}" class="vertical-nav">
        <ul>${items}</ul>
    </nav>`;
}

function generateImageComponent(shape) {
  const src = shape.sourceData || 'placeholder.jpg';
  const alt = shape.purpose || shape.label || 'Image';
  
  return `
    <div id="${shape.id}" class="image-component">
        <img src="${src}" alt="${alt}" />
    </div>`;
}

function generateSidePanel(shape) {
  const title = shape.purpose || 'Side Panel';
  const functionName = extractFunctionName(shape.sourceData);
  
  return `
    <div id="${shape.id}" class="side-panel">
        <h3>${title}</h3>
        <div class="panel-content" data-function="${functionName}">
            Loading ${title}...
        </div>
    </div>`;
}

function generateChatBox(shape) {
  return `
    <div id="${shape.id}" class="chat-box">
        <div class="chat-header">
            <h3>${shape.purpose}</h3>
        </div>
        <div class="chat-messages" id="${shape.id}-messages"></div>
        <div class="chat-input">
            <input type="text" id="${shape.id}-input" placeholder="Type a message..." />
            <button onclick="sendMessage('${shape.id}')">Send</button>
        </div>
    </div>`;
}

function generateGenericComponent(shape) {
  return `
    <div id="${shape.id}" class="generic-component">
        <h4>${shape.label || shape.type}</h4>
        <p>${shape.purpose}</p>
    </div>`;
}

/**
 * JavaScript Generators
 */
function generateChatJS(shape) {
  return `
    // Chat functionality for ${shape.id}
    function sendMessage(chatId) {
        const input = document.getElementById(chatId + '-input');
        const messages = document.getElementById(chatId + '-messages');
        if (input.value.trim()) {
            const msg = document.createElement('div');
            msg.textContent = input.value;
            msg.className = 'message user-message';
            messages.appendChild(msg);
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
        }
    }
`;
}

function generateSidePanelJS(shape) {
  const functionName = extractFunctionName(shape.sourceData);
  return `
    // Side panel functionality for ${shape.id}
    function load${shape.id}Content() {
        const panel = document.querySelector('#${shape.id} .panel-content');
        // Simulate loading ${functionName}
        panel.innerHTML = '<p>Data loaded from ${functionName}</p>';
    }
    load${shape.id}Content();
`;
}

function generateNavigationJS(shape) {
  return `
    // Navigation functionality for ${shape.id}
    document.querySelectorAll('#${shape.id} a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigate to:', this.href);
        });
    });
`;
}

/**
 * Utility Functions
 */
function extractNavItems(sourceData) {
  if (Array.isArray(sourceData)) {
    return sourceData.map(item => item.split('#')[1] || item).slice(0, 5);
  }
  return ['Home', 'About', 'Services', 'Contact'];
}

function extractFunctionName(sourceData) {
  if (typeof sourceData === 'string' && sourceData.startsWith('function:')) {
    return sourceData.replace('function:', '');
  }
  return 'getData';
}

function extractAssets(shapes) {
  const assets = [];
  shapes.forEach(shape => {
    if (shape.type === 'IMAGE' && shape.sourceData) {
      assets.push(shape.sourceData);
    }
  });
  return assets;
}

/**
 * Create and open the generated website
 */
export function deployWebsite(shapes) {
  const website = generateWebsite(shapes);
  
  // Create a new window with the generated website
  const newWindow = window.open('', '_blank');
  newWindow.document.write(website.html);
  
  // Add the CSS
  const style = newWindow.document.createElement('style');
  style.textContent = website.css;
  newWindow.document.head.appendChild(style);
  
  // Add the JavaScript
  const script = newWindow.document.createElement('script');
  script.textContent = website.js;
  newWindow.document.body.appendChild(script);
  
  console.log('[Website Generator] Website deployed to new window');
  return website;
}

/**
 * Save website files to filesystem
 */
export async function saveWebsiteFiles(shapes, filename = 'maqnetix-website') {
  const website = generateWebsite(shapes);
  
  if ('showSaveFilePicker' in window) {
    try {
      // Save HTML file
      const htmlHandle = await window.showSaveFilePicker({
        suggestedName: `${filename}.html`,
        types: [{ description: 'HTML', accept: { 'text/html': ['.html'] } }],
      });
      const htmlWritable = await htmlHandle.createWritable();
      await htmlWritable.write(website.html);
      await htmlWritable.close();
      
      // Save CSS file
      const cssHandle = await window.showSaveFilePicker({
        suggestedName: 'styles.css',
        types: [{ description: 'CSS', accept: { 'text/css': ['.css'] } }],
      });
      const cssWritable = await cssHandle.createWritable();
      await cssWritable.write(website.css);
      await cssWritable.close();
      
      // Save JS file
      const jsHandle = await window.showSaveFilePicker({
        suggestedName: 'script.js',
        types: [{ description: 'JavaScript', accept: { 'application/javascript': ['.js'] } }],
      });
      const jsWritable = await jsHandle.createWritable();
      await jsWritable.write(website.js);
      await jsWritable.close();
      
      console.log('[Website Generator] Website files saved successfully');
    } catch (e) {
      console.error('Save cancelled or failed:', e);
    }
  }
}
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------
