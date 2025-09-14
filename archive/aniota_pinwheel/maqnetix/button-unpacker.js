
import { deployWebsite, saveWebsiteFiles, generateWebsite } from "../js/website-generator.js";
import { createToggleButton } from "./button-maker.js";

export function createUnpackerButton(config = {}) {
  console.log("[Unpacker] *** CREATING MAQNETIX INSTA-TOOL UNPACKER BUTTON ***");
  console.log("[Unpacker] Import check - generateWebsite:", typeof generateWebsite);
  console.log("[Unpacker] Import check - deployWebsite:", typeof deployWebsite);
  console.log("[Unpacker] Import check - saveWebsiteFiles:", typeof saveWebsiteFiles);
  
  let unpackedWebsite = null;
  let isUnpacked = false;
  
  const btn = createToggleButton({
    id: "btn-unpacker",
    label: "📤 Unpack",
    right: "10px",
    initialTop: config.initialTop || 40,
    theme: {
      backgroundEnabledOn: "#28a745",
      backgroundEnabledOff: "#28a745", 
      backgroundInactive: "#1e7e34"
    },
    onEnable: () => {
      console.log("[Unpacker] *** BUTTON ENABLED - STARTING UNPACK PROCESS ***");
      console.log("[Unpacker] Button state: enabled");
      console.log("[Unpacker] isUnpacked:", isUnpacked);
      console.log("[Unpacker] unpackedWebsite exists:", !!unpackedWebsite);
      
      try {
        if (isUnpacked && unpackedWebsite) {
          console.log("[Unpacker] Showing existing unpacked interface");
          // Show existing unpacked interface
          unpackedWebsite.style.display = 'block';
          isUnpacked = true;
          return;
        }
        
        console.log("[Unpacker] Starting fresh unpack process");
        console.log("[Unpacker] window._aniotaAllShapes:", window._aniotaAllShapes?.length || 0);
        
        // Check if shapes already exist in memory or can be loaded from storage
        if (window._aniotaAllShapes && window._aniotaAllShapes.length > 0) {
          console.log("[Unpacker] Shapes found in memory - proceeding with unpack");
          proceedWithUnpack();
          return;
        }
        
        // Try to load from local storage
        if (typeof window.loadShapesFromLocalStorage === 'function') {
          console.log("[Unpacker] Attempting to load from local storage");
          window.loadShapesFromLocalStorage();
          
          // Check if we got shapes after loading
          if (window._aniotaAllShapes && window._aniotaAllShapes.length > 0) {
            console.log("[Unpacker] Shapes loaded from storage, proceeding with unpack");
            proceedWithUnpack();
            return;
          }
        }
        
        // No shapes available - show file browser to let user import shapes
        console.log("[Unpacker] No shapes available - showing file browser");
        showFileBrowser();
        
      } catch (error) {
        console.error("[Unpacker] ERROR in onEnable:", error);
        console.error("[Unpacker] Error stack:", error.stack);
      }
    },
    onDisable: () => {
      console.log("[Unpacker] Hiding MAQNETIX interface insta-tool");
      if (unpackedWebsite) {
        unpackedWebsite.style.display = 'none';
        isUnpacked = false;
      }
    },
    defaultActiveState: "off"
  });

  btn.title = "Unpack: Transform UICA components into functional website";
  console.log("[Unpacker] UICA unpacker button created successfully");
  
  // Show file browser to select shapes file
  function showFileBrowser() {
    console.log("[Unpacker] Showing file browser for shapes selection");
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log("[Unpacker] File selected:", file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const shapesData = JSON.parse(e.target.result);
            console.log("[Unpacker] Shapes data loaded from file:", shapesData.length);
            
            // Validate that it's actually shapes data
            if (!Array.isArray(shapesData) || shapesData.length === 0) {
              throw new Error("File does not contain valid shapes data");
            }
            
            // Check if shapes have required properties
            const hasValidShapes = shapesData.some(shape => 
              shape.id && shape.type && shape.x !== undefined && shape.y !== undefined
            );
            
            if (!hasValidShapes) {
              throw new Error("File does not contain valid MAQNETIX shapes");
            }
            
            // Set the global shapes data
            window._aniotaAllShapes = shapesData;
            
            // Save to local storage for future use
            if (typeof window.saveShapesToLocalStorage === 'function') {
              window.saveShapesToLocalStorage();
            } else {
              // Fallback - save directly to localStorage
              localStorage.setItem('maqnetix-shapes', JSON.stringify(shapesData));
            }
            
            console.log("[Unpacker] Shapes file imported successfully");
            alert(`Successfully imported ${shapesData.length} shapes from ${file.name}`);
            
            // Proceed with unpacking
            proceedWithUnpack();
            
          } catch (error) {
            console.error("[Unpacker] Error parsing shapes file:", error);
            alert(`Error loading shapes file: ${error.message}\n\nPlease ensure the file contains valid MAQNETIX shapes data in JSON format.`);
          }
        };
        
        reader.onerror = () => {
          console.error("[Unpacker] Error reading file");
          alert('Error reading the selected file. Please try again.');
        };
        
        reader.readAsText(file);
      } else {
        // User cancelled file selection
        console.log("[Unpacker] File selection cancelled");
        showNoShapesMessage();
      }
      
      // Clean up
      document.body.removeChild(input);
    });
    
    // Handle case where user clicks away or cancels
    input.addEventListener('cancel', () => {
      console.log("[Unpacker] File browser cancelled");
      showNoShapesMessage();
      document.body.removeChild(input);
    });
    
    // Trigger file browser
    document.body.appendChild(input);
    input.click();
  }
  
  // Show helpful message when no shapes are available
  function showNoShapesMessage() {
    console.log("[Unpacker] Showing no shapes available message");
    
    const message = `No MAQNETIX shapes found!

To use the Unpacker, you need to:

1. Create shapes in MAQNETIX first, OR
2. Import a shapes file (shapes.json or shapes_now.json)

The Unpacker transforms abstract shapes into functional UI components.

Would you like to:
• Create shapes using MAQNETIX tools
• Try importing a shapes file again`;

    alert(message);
  }
  
  // Proceed with unpacking process
  function proceedWithUnpack() {
    console.log("[Unpacker] Proceeding with unpack process");
    
    if (!window._aniotaAllShapes || window._aniotaAllShapes.length === 0) {
      console.error("[Unpacker] No shapes data available for unpacking");
      alert('No shapes data available. Please load a shapes file first.');
      return;
    }
    
    // Save current state if save function exists
    if (typeof window.saveShapesToLocalStorage === 'function') {
      console.log("[Unpacker] Saving current state");
      window.saveShapesToLocalStorage();
    }
    
    // Render shapes if render function exists
    if (typeof window.renderAllShapes === 'function') {
      console.log("[Unpacker] Rendering shapes");
      window.renderAllShapes(window._aniotaAllShapes);
    }
    
    // Filter active shapes only
    const activeShapes = window._aniotaAllShapes.filter(shape => shape.state === 'active');
    console.log(`[Unpacker] Found ${activeShapes.length} active shapes out of ${window._aniotaAllShapes.length} total`);
    
    // Use active shapes if available, otherwise use all shapes
    const shapesToUnpack = activeShapes.length > 0 ? activeShapes : window._aniotaAllShapes;
    
    // Create the unpacked interface overlay
    createUnpackedOverlay(shapesToUnpack);
    
    console.log("[Unpacker] MAQNETIX insta-tool activated");
  }
  
  // Create overlay interface function
  function createUnpackedOverlay(shapes) {
    console.log("[Unpacker] Creating MAQNETIX interface with shapes:", shapes.length);
    
    if (unpackedWebsite) {
      unpackedWebsite.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'maqnetix-unpacked-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 10000;
      overflow: auto;
      pointer-events: none;
    `;
    
    // Transform each shape into a functional component
    try {
      shapes.forEach(shape => {
        const component = createComponentFromShape(shape);
        if (component) {
          overlay.appendChild(component);
        }
      });
      
      console.log("[Unpacker] MAQNETIX interface components created successfully");
    } catch (error) {
      console.error("[Unpacker] Error creating interface:", error);
      overlay.innerHTML = `<div style="padding: 20px; color: red; pointer-events: auto;">Error creating MAQNETIX interface: ${error.message}</div>`;
    }
    
    document.body.appendChild(overlay);
    unpackedWebsite = overlay;
    isUnpacked = true;
    console.log("[Unpacker] MAQNETIX interface added to DOM");
  }

  // Transform a shape into a functional UI component
  function createComponentFromShape(shape) {
    console.log(`[Unpacker] Creating ${shape.type} component for ${shape.id}`);
    
    const element = document.createElement('div');
    element.id = `component-${shape.id}`;
    element.className = `maqnetix-component ${shape.type.toLowerCase()}`;
    
    // Parse dimensions (handle both "123px" strings and 123 numbers)
    const width = typeof shape.width === 'string' ? parseInt(shape.width) : shape.width;
    const height = typeof shape.height === 'string' ? parseInt(shape.height) : shape.height;
    
    // Position and style the component
    element.style.cssText = `
      position: absolute;
      left: ${shape.x}px;
      top: ${shape.y}px;
      width: ${width}px;
      height: ${height}px;
      background: ${shape.background};
      border: 2px solid #333;
      border-radius: 4px;
      box-sizing: border-box;
      z-index: ${shape.zIndex || 1};
      padding: 8px;
      font-family: Arial, sans-serif;
      overflow: hidden;
      cursor: ${shape.isSelectable ? 'pointer' : 'default'};
      pointer-events: auto;
    `;
    
    // Make component interactive if it should be selectable/draggable/scalable/snapable
    if (shape.isSelectable || shape.isDraggable || shape.isScalable || shape.isSnapable) {
      makeComponentInteractive(element, shape);
    }
    
    // Create component content based on type
    switch(shape.type) {
      case 'TEXT':
        element.innerHTML = `
          <div style="font-size: 14px; font-weight: bold; color: white;">
            ${shape.sourceData}
          </div>
        `;
        break;
        
      case 'NAVIGATION_HORIZONTAL':
        element.innerHTML = `
          <nav style="display: flex; align-items: center; height: 100%;">
            <div style="color: #333; font-weight: bold; margin-right: 20px;">MAQNETIX</div>
            <button onclick="alert('File menu')" style="margin-right: 10px; padding: 5px 10px; border: none; background: rgba(255,255,255,0.2); color: #333; border-radius: 3px; cursor: pointer;">File</button>
            <button onclick="alert('Edit menu')" style="margin-right: 10px; padding: 5px 10px; border: none; background: rgba(255,255,255,0.2); color: #333; border-radius: 3px; cursor: pointer;">Edit</button>
            <button onclick="alert('View menu')" style="margin-right: 10px; padding: 5px 10px; border: none; background: rgba(255,255,255,0.2); color: #333; border-radius: 3px; cursor: pointer;">View</button>
            <button onclick="alert('Tools menu')" style="margin-right: 10px; padding: 5px 10px; border: none; background: rgba(255,255,255,0.2); color: #333; border-radius: 3px; cursor: pointer;">Tools</button>
            <button onclick="alert('Help menu')" style="margin-left: auto; padding: 5px 10px; border: none; background: rgba(255,255,255,0.2); color: #333; border-radius: 3px; cursor: pointer;">Help</button>
          </nav>
        `;
        break;
        
      case 'NAVIGATION_VERTICAL':
        element.innerHTML = `
          <nav style="height: 100%;">
            <div style="color: #333; font-weight: bold; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #333;">Navigation</div>
            <button onclick="alert('Dashboard clicked')" style="display: block; width: 100%; padding: 8px; margin-bottom: 2px; border: none; background: rgba(255,255,255,0.1); color: #333; text-align: left; cursor: pointer; border-radius: 3px;">📊 Dashboard</button>
            <button onclick="alert('Projects clicked')" style="display: block; width: 100%; padding: 8px; margin-bottom: 2px; border: none; background: rgba(255,255,255,0.1); color: #333; text-align: left; cursor: pointer; border-radius: 3px;">📁 Projects</button>
            <button onclick="alert('Components clicked')" style="display: block; width: 100%; padding: 8px; margin-bottom: 2px; border: none; background: rgba(255,255,255,0.1); color: #333; text-align: left; cursor: pointer; border-radius: 3px;">🧩 Components</button>
            <button onclick="alert('Settings clicked')" style="display: block; width: 100%; padding: 8px; margin-bottom: 2px; border: none; background: rgba(255,255,255,0.1); color: #333; text-align: left; cursor: pointer; border-radius: 3px;">⚙️ Settings</button>
            <button onclick="alert('Export clicked')" style="display: block; width: 100%; padding: 8px; border: none; background: rgba(255,255,255,0.1); color: #333; text-align: left; cursor: pointer; border-radius: 3px;">📤 Export</button>
          </nav>
        `;
        break;
        
      case 'IMAGE':
        element.innerHTML = `
          <div style="width: 100%; height: 100%; background: #ddd; display: flex; align-items: center; justify-content: center; color: #666; position: relative; overflow: hidden;">
            <div style="text-align: center;">
              <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">MAQNETIX</div>
              <div style="font-size: 12px; opacity: 0.7;">${shape.sourceData}</div>
            </div>
            <div style="position: absolute; top: 5px; right: 5px; font-size: 10px; opacity: 0.5;">🖼️</div>
          </div>
        `;
        break;
        
      case 'FUNCTION_SIDEPANEL':
        let panelContent = '';
        if (shape.purpose === 'properties') {
          panelContent = `
            <div style="color: white; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.3);">Properties Inspector</div>
            <div style="color: #ccc; font-size: 12px;">
              <div style="margin-bottom: 8px;">
                <label style="display: block; margin-bottom: 2px;">Selected:</label>
                <select style="width: 100%; padding: 2px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 2px;">
                  <option>None</option>
                  <option>Text Component</option>
                  <option>Navigation</option>
                </select>
              </div>
              <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                <div style="flex: 1;">
                  <label style="display: block; margin-bottom: 2px;">X:</label>
                  <input type="number" value="0" style="width: 100%; padding: 2px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 2px;">
                </div>
                <div style="flex: 1;">
                  <label style="display: block; margin-bottom: 2px;">Y:</label>
                  <input type="number" value="0" style="width: 100%; padding: 2px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 2px;">
                </div>
              </div>
              <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                <div style="flex: 1;">
                  <label style="display: block; margin-bottom: 2px;">Width:</label>
                  <input type="number" value="100" style="width: 100%; padding: 2px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 2px;">
                </div>
                <div style="flex: 1;">
                  <label style="display: block; margin-bottom: 2px;">Height:</label>
                  <input type="number" value="50" style="width: 100%; padding: 2px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 2px;">
                </div>
              </div>
              <div style="margin-bottom: 8px;">
                <label style="display: block; margin-bottom: 2px;">Background:</label>
                <input type="color" value="#ff0000" style="width: 100%; padding: 2px; background: rgba(255,255,255,0.1); border: 1px solid #666; border-radius: 2px;">
              </div>
            </div>
          `;
        } else if (shape.purpose === 'mauica status') {
          panelContent = `
            <div style="color: white; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.3);">MAUICA Status</div>
            <div style="color: #ccc; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Status:</span> <span style="color: #90EE90;">● Active</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Components:</span> <span>8</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Area:</span> <span>1 of 9</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Theme:</span> <span>Default</span>
              </div>
              <button onclick="alert('Refresh status')" style="width: 100%; padding: 5px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 3px; cursor: pointer; font-size: 10px;">Refresh</button>
            </div>
          `;
        } else if (shape.purpose === 'mauica stats') {
          panelContent = `
            <div style="color: white; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.3);">MAUICA Statistics</div>
            <div style="color: #ccc; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Shapes Created:</span> <span>8</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Functions:</span> <span>4</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Unpacks:</span> <span>1</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Packs:</span> <span>0</span>
              </div>
              <button onclick="alert('Export stats')" style="width: 100%; padding: 5px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 3px; cursor: pointer; font-size: 10px;">Export Stats</button>
            </div>
          `;
        }
        element.innerHTML = panelContent;
        break;
        
      case 'FUNCTION_CHAT_BOX':
        element.innerHTML = `
          <div style="height: 100%; display: flex; flex-direction: column;">
            <div style="color: white; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.3); display: flex; justify-content: space-between; align-items: center;">
              <span>MAUICA Chat</span>
              <div>
                <button onclick="alert('Clear chat')" style="padding: 2px 6px; margin-left: 5px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 2px; cursor: pointer; font-size: 10px;">Clear</button>
                <button onclick="alert('Settings')" style="padding: 2px 6px; margin-left: 2px; background: rgba(255,255,255,0.1); border: 1px solid #666; color: white; border-radius: 2px; cursor: pointer; font-size: 10px;">⚙️</button>
              </div>
            </div>
            <div id="chat-messages-${shape.id}" style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 4px; padding: 8px; margin-bottom: 8px; overflow-y: auto; font-size: 12px;">
              <div style="color: #90EE90; margin-bottom: 5px;">[System] MAQNETIX interface ready</div>
              <div style="color: #87CEEB; margin-bottom: 5px;">[MAUICA] How can I help you design?</div>
              <div style="color: #ccc; margin-bottom: 5px;">[You] Testing the chat interface</div>
              <div style="color: #87CEEB; margin-bottom: 5px;">[MAUICA] Chat is working! What would you like to create?</div>
            </div>
            <div style="display: flex; gap: 5px;">
              <input id="chat-input-${shape.id}" type="text" placeholder="Type your message..." style="flex: 1; padding: 6px; border: 1px solid #666; border-radius: 4px; background: rgba(255,255,255,0.1); color: white; font-size: 12px;">
              <button onclick="sendChatMessage('${shape.id}')" style="padding: 6px 12px; background: rgba(135,206,235,0.8); border: 1px solid #666; color: white; border-radius: 4px; cursor: pointer; font-size: 12px;">Send</button>
            </div>
          </div>
        `;
        break;
        
      default:
        element.innerHTML = `
          <div style="color: white; font-size: 12px;">
            <div style="font-weight: bold; margin-bottom: 5px;">${shape.type}</div>
            <div style="opacity: 0.8;">${shape.purpose}</div>
            <div style="font-size: 10px; opacity: 0.6; margin-top: 5px;">${shape.sourceData}</div>
          </div>
        `;
    }
    
    return element;
  }

  // Make component interactive based on shape properties
  function makeComponentInteractive(element, shape) {
    let isDragging = false;
    let isResizing = false;
    let startX, startY, startLeft, startTop, startWidth, startHeight;
    
    // Grid snapping configuration
    const gridSize = shape.isSnapable ? 20 : 1; // 20px grid if snapable, otherwise pixel-perfect
    
    function snapToGrid(value) {
      return shape.isSnapable ? Math.round(value / gridSize) * gridSize : value;
    }
    
    if (shape.isSelectable) {
      element.addEventListener('click', (e) => {
        // Don't select if clicking on interactive content (buttons, inputs, etc.)
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
          return;
        }
        
        // Toggle selection
        const isSelected = element.classList.contains('selected');
        document.querySelectorAll('.maqnetix-component.selected').forEach(el => {
          el.classList.remove('selected');
          el.style.border = '2px solid #333';
        });
        
        if (!isSelected) {
          element.classList.add('selected');
          element.style.border = '2px solid #00ff00';
          element.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        } else {
          element.style.boxShadow = 'none';
        }
      });
    }
    
    if (shape.isDraggable) {
      // Add drag handle for better UX
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      dragHandle.style.cssText = `
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: rgba(0, 255, 0, 0.7);
        cursor: move;
        border-radius: 3px;
        display: none;
        z-index: 1000;
        font-size: 10px;
        text-align: center;
        line-height: 20px;
        color: white;
      `;
      dragHandle.innerHTML = '⋮⋮';
      element.appendChild(dragHandle);
      
      // Show/hide drag handle on hover
      element.addEventListener('mouseenter', () => {
        if (element.classList.contains('selected')) {
          dragHandle.style.display = 'block';
        }
      });
      
      element.addEventListener('mouseleave', () => {
        if (!isDragging) {
          dragHandle.style.display = 'none';
        }
      });
      
      // Drag functionality
      element.addEventListener('mousedown', (e) => {
        // Only drag if clicking on the drag handle or the element itself (not content)
        if (e.target === dragHandle || (e.target === element && element.classList.contains('selected'))) {
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          startLeft = parseInt(element.style.left);
          startTop = parseInt(element.style.top);
          element.style.cursor = 'grabbing';
          dragHandle.style.display = 'block';
          
          // Bring to front while dragging
          element.style.zIndex = '10001';
          
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }
    
    if (shape.isScalable) {
      // Add resize handles in corners and edges
      const handles = [
        { pos: 'nw', cursor: 'nw-resize', x: 0, y: 0 },
        { pos: 'ne', cursor: 'ne-resize', x: 1, y: 0 },
        { pos: 'sw', cursor: 'sw-resize', x: 0, y: 1 },
        { pos: 'se', cursor: 'se-resize', x: 1, y: 1 },
        { pos: 'n', cursor: 'n-resize', x: 0.5, y: 0 },
        { pos: 's', cursor: 's-resize', x: 0.5, y: 1 },
        { pos: 'w', cursor: 'w-resize', x: 0, y: 0.5 },
        { pos: 'e', cursor: 'e-resize', x: 1, y: 0.5 }
      ];
      
      handles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle resize-${handle.pos}`;
        resizeHandle.style.cssText = `
          position: absolute;
          width: 8px;
          height: 8px;
          background: #00ff00;
          cursor: ${handle.cursor};
          border-radius: 2px;
          display: none;
          z-index: 1001;
          border: 1px solid #fff;
        `;
        
        // Position handle
        if (handle.x === 0) resizeHandle.style.left = '-4px';
        else if (handle.x === 1) resizeHandle.style.right = '-4px';
        else resizeHandle.style.left = 'calc(50% - 4px)';
        
        if (handle.y === 0) resizeHandle.style.top = '-4px';
        else if (handle.y === 1) resizeHandle.style.bottom = '-4px';
        else resizeHandle.style.top = 'calc(50% - 4px)';
        
        element.appendChild(resizeHandle);
        
        // Show/hide resize handles on selection
        const toggleHandles = () => {
          const isSelected = element.classList.contains('selected');
          resizeHandle.style.display = isSelected ? 'block' : 'none';
        };
        
        element.addEventListener('click', toggleHandles);
        document.addEventListener('click', (e) => {
          if (!element.contains(e.target)) {
            resizeHandle.style.display = 'none';
          }
        });
        
        resizeHandle.addEventListener('mousedown', (e) => {
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = parseInt(element.style.width);
          startHeight = parseInt(element.style.height);
          startLeft = parseInt(element.style.left);
          startTop = parseInt(element.style.top);
          
          // Store which handle is being used
          element.dataset.resizeHandle = handle.pos;
          
          e.preventDefault();
          e.stopPropagation();
        });
      });
    }
    
    // Global mouse move and up handlers
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Apply snapping if enabled
        let newLeft = snapToGrid(startLeft + deltaX);
        let newTop = snapToGrid(startTop + deltaY);
        
        // Constrain to viewport
        newLeft = Math.max(0, Math.min(window.innerWidth - parseInt(element.style.width), newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - parseInt(element.style.height), newTop));
        
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        
        // Show snap guidelines if snapable
        if (shape.isSnapable) {
          showSnapGuidelines(newLeft, newTop, parseInt(element.style.width), parseInt(element.style.height));
        }
        
      } else if (isResizing) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const handle = element.dataset.resizeHandle;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
        
        // Apply constraints based on handle position
        if (handle.includes('e')) newWidth = snapToGrid(Math.max(100, startWidth + deltaX));
        if (handle.includes('w')) {
          newWidth = snapToGrid(Math.max(100, startWidth - deltaX));
          newLeft = startLeft + (startWidth - newWidth);
        }
        if (handle.includes('s')) newHeight = snapToGrid(Math.max(50, startHeight + deltaY));
        if (handle.includes('n')) {
          newHeight = snapToGrid(Math.max(50, startHeight - deltaY));
          newTop = startTop + (startHeight - newHeight);
        }
        
        // Constrain to viewport
        newLeft = Math.max(0, Math.min(window.innerWidth - newWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - newHeight, newTop));
        
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        
        // Show snap guidelines if snapable
        if (shape.isSnapable) {
          showSnapGuidelines(newLeft, newTop, newWidth, newHeight);
        }
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging || isResizing) {
        element.style.cursor = shape.isSelectable ? 'pointer' : 'default';
        element.style.zIndex = shape.zIndex || 1;
        
        // Hide drag handle unless still selected
        const dragHandle = element.querySelector('.drag-handle');
        if (dragHandle && !element.matches(':hover')) {
          dragHandle.style.display = 'none';
        }
        
        // Hide snap guidelines
        if (shape.isSnapable) {
          hideSnapGuidelines();
        }
        
        isDragging = false;
        isResizing = false;
        delete element.dataset.resizeHandle;
      }
    });
    
    // Snap guidelines functions
    function showSnapGuidelines(x, y, width, height) {
      // Remove existing guidelines
      hideSnapGuidelines();
      
      const overlay = element.closest('#maqnetix-unpacked-overlay');
      if (!overlay) return;
      
      // Create vertical guideline
      const vGuide = document.createElement('div');
      vGuide.className = 'snap-guideline-v';
      vGuide.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: 0;
        width: 1px;
        height: 100vh;
        background: rgba(0, 255, 0, 0.5);
        pointer-events: none;
        z-index: 9999;
      `;
      
      // Create horizontal guideline
      const hGuide = document.createElement('div');
      hGuide.className = 'snap-guideline-h';
      hGuide.style.cssText = `
        position: absolute;
        left: 0;
        top: ${y}px;
        width: 100vw;
        height: 1px;
        background: rgba(0, 255, 0, 0.5);
        pointer-events: none;
        z-index: 9999;
      `;
      
      overlay.appendChild(vGuide);
      overlay.appendChild(hGuide);
    }
    
    function hideSnapGuidelines() {
      const overlay = element.closest('#maqnetix-unpacked-overlay');
      if (!overlay) return;
      
      const guidelines = overlay.querySelectorAll('.snap-guideline-v, .snap-guideline-h');
      guidelines.forEach(guide => guide.remove());
    }
  }

  // Global chat function
  window.sendChatMessage = function(shapeId) {
    const input = document.getElementById(`chat-input-${shapeId}`);
    const messages = document.getElementById(`chat-messages-${shapeId}`);
    
    if (input.value.trim()) {
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = 'color: #ccc; margin-bottom: 5px;';
      messageDiv.textContent = `[You] ${input.value}`;
      messages.appendChild(messageDiv);
      
      // Simulate MAUICA response
      setTimeout(() => {
        const responseDiv = document.createElement('div');
        responseDiv.style.cssText = 'color: #87CEEB; margin-bottom: 5px;';
        responseDiv.textContent = `[MAUICA] I understand: "${input.value}". How can I help with that?`;
        messages.appendChild(responseDiv);
        messages.scrollTop = messages.scrollHeight;
      }, 500);
      
      input.value = '';
      messages.scrollTop = messages.scrollHeight;
    }
  };
  
  return btn;
}
