async function loadShapesFromJSON(jsonPath = "shapes.json") {
  try {
    console.log("[shapesLoader.js] Loading shapes from", jsonPath);
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error("Failed to load " + jsonPath);
    const shapes = await response.json();
    console.log("[shapesLoader.js] Loaded", shapes.length, "shapes");
    window._aniotaAllShapes = shapes;
    // Immediately render all shapes for the current area, preserving exact positions
    const areaNum = window.currentTheme || 1;
    reloadUICAForArea(areaNum, window._aniotaAllShapes, { preserveExactPositions: true });
  } catch (e) {
    console.error("[shapesLoader.js] Error loading shapes from JSON:", e);
  }
}
window.loadShapesFromJSON = loadShapesFromJSON;
function clearUICAItems() {
  document.querySelectorAll(".uica-backdrop").forEach((e) => e.remove());
  document.querySelectorAll(".uica-real").forEach((e) => e.remove());
}
function reloadUICAForArea(areaNum = 1, shapes = [], options = {}) {
  // Remove all .snapgrid-square elements (shapes) before rendering new ones
  document.querySelectorAll(".snapgrid-square").forEach((e) => e.remove());
  clearUICAItems();

  // After rendering, re-initialize multiSelect and drag/resize handlers so logic is always attached
  setTimeout(() => {
    if (window.attachDragResizeHandlers) {
      console.log("[shapesLoader.js] Re-initializing drag/resize handlers");
      // window.attachDragResizeHandlers(); // Locking logic is commented out for now
    } else {
      console.warn(
        "[shapesLoader.js] window.attachDragResizeHandlers not found"
      );
    }
    // DEPRECATED: Use SelectionManager instead of selectedSquaresRef
    // if (window.initializeMultiSelect && window.selectedSquaresRef) {
    //   console.log('[shapesLoader.js] Re-initializing multiSelect');
    //   window.initializeMultiSelect(window.selectedSquaresRef);
    // } else {
    //   console.warn('[shapesLoader.js] window.initializeMultiSelect or window.selectedSquaresRef not found');
    // }
    if (window.initializeMultiSelect && window.selectionManager) {
      console.log(
        "[shapesLoader.js] Re-initializing multiSelect (SelectionManager)"
      );
      window.initializeMultiSelect();
    } else {
      console.warn(
        "[shapesLoader.js] window.initializeMultiSelect or window.selectionManager not found"
      );
    }
  }, 0);
  // Use provided shapes, or fall back to global
  const allShapes =
    shapes && shapes.length ? shapes : window._aniotaAllShapes || [];
  console.log(
    "[shapesLoader.js][DEBUG] reloadUICAForArea called with areaNum:",
    areaNum
  );
  console.log("[shapesLoader.js][DEBUG] allShapes:", allShapes);
  // Only render shapes with area exactly matching areaNum (integer) and state 'active'
  const filtered = allShapes.filter(
    (s) => s.area === areaNum && s.state === "active"
  );
  console.log("[shapesLoader.js][DEBUG] filtered shapes:", filtered);
  window._aniotaShapesArray = filtered;
  console.log(
    `[shapesLoader.js] Rendering zone ${areaNum}:`,
    filtered.map((s) => s.id)
  );
  const workspace = document.getElementById("snapgrid-workspace");
  if (!workspace) {
    console.error("[shapesLoader.js] snapgrid-workspace not found!");
    return;
  }
  const margin = 8;
  const wsW = workspace.offsetWidth;
  const wsH = workspace.offsetHeight;
  const centerX = wsW / 2;
  const centerY = wsH / 2;
  // Compute max possible magnitude (distance from center to farthest corner)
  const maxMag = Math.sqrt(centerX * centerX + centerY * centerY);
  filtered.forEach((shape) => {
    let width = parseInt(shape.width, 10);
    let height = parseInt(shape.height, 10);
    let x = parseInt(shape.x, 10);
    let y = parseInt(shape.y, 10);
    let scale = 1;
    if (!options.preserveExactPositions) {
      // Scale based on vectorFromCenter magnitude (farther = smaller)
      if (
        shape.vectorFromCenter &&
        typeof shape.vectorFromCenter.magnitude === "number"
      ) {
        const pct = Math.min(
          1,
          Math.abs(shape.vectorFromCenter.magnitude) / maxMag
        );
        // Linear scale: 1 at center, 0.5 at edge
        scale = 1 - 0.5 * pct;
      }
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      // Clamp size to fit workspace
      width = Math.max(24, Math.min(width, wsW - margin));
      height = Math.max(24, Math.min(height, wsH - margin));
      // Clamp position so shape stays in bounds
      x = Math.max(margin, Math.min(x, wsW - width - margin));
      y = Math.max(margin, Math.min(y, wsH - height - margin));
    }
    const el = document.createElement("div");
    el.id = shape.id;
    el.className = "snapgrid-square";
    el.innerText = shape.label;
    el.style.position = "absolute";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";
    el.style.background = shape.background;
    el.style.zIndex = shape.zIndex;
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.fontWeight = "bold";
    el.style.color = "#fff";
    el.style.boxSizing = "border-box";
    el.style.cursor = "move";
    // Add centroid snap-point visual
    const centroid = document.createElement("div");
    centroid.className = "centroid-snappoint";
    el.appendChild(centroid);
    // Debug log for each shape
    console.log(
      `[shapesLoader.js] Placing shape ${
        shape.id
      } at (${x},${y}) size (${width},${height}) scale ${scale.toFixed(2)}`
    );
    workspace.appendChild(el);

    // --- Drag logic restored, locking logic still commented out ---
  /*
    --- Maqnetix UI Core Interaction Rules ---
    Selection:
      - Click and release toggles selection/deselection.
      - Click and hold to drag does not toggle selection.
      - After dragging, a new click/release will deselect.
    Snapping:
      - When dragging, the center of the shape snaps to the nearest coarse or fine grid point.
      - When scaling, on mouse release, the corner being dragged snaps to the nearest coarse or fine grid point.
    Dragging:
      - Click and hold initiates drag after threshold movement.
      - Dragging moves the shape, snapping its center to the grid if enabled.
    Scaling:
      - Resizing anchors the center and scales corners proportionately.
      - On release, the dragged corner snaps to the nearest grid point.
  */
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let isDragging = false;
        let dragStarted = false;
        let startX = 0;
        let startY = 0;
        const DRAG_THRESHOLD = 5; // pixels before drag starts


        function onDragMove(e) {
          // Dragging logic: moves shape, snapping center to grid if enabled
      // Selection logic: toggles selection only on true click (not drag)
          if (!dragStarted) {
            // Check if mouse moved enough to start dragging
            const dx = Math.abs(e.clientX - startX);
            const dy = Math.abs(e.clientY - startY);
            if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
              return; // Not enough movement to start drag
            }
            dragStarted = true;
            isDragging = true;
            el.style.opacity = "0.7";
            document.body.style.userSelect = "none";
          }
          
          if (!isDragging) return;
          let newLeft = e.clientX - dragOffsetX;
          let newTop = e.clientY - dragOffsetY;
          if (window.snapToGridEnabled && typeof getNearestSnapPoint === 'function') {
            // Calculate center of shape
            const shapeWidth = el.offsetWidth;
            const shapeHeight = el.offsetHeight;
            const centerX = newLeft + shapeWidth / 2;
            const centerY = newTop + shapeHeight / 2;
            // Snap center to nearest grid point
            const snapped = getNearestSnapPoint(centerX, centerY);
            newLeft = snapped.x - shapeWidth / 2;
            newTop = snapped.y - shapeHeight / 2;
          }
          el.style.left = newLeft + "px";
          el.style.top = newTop + "px";
          shape.x = parseInt(el.style.left, 10);
          shape.y = parseInt(el.style.top, 10);
        }
    function onDragUp(e) {
      if (isDragging) {
        isDragging = false;
        el.style.opacity = "1";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onDragMove);
        document.removeEventListener("mouseup", onDragUp);
      } else if (!dragStarted) {
        // This was a click, not a drag - trigger selection
        // Only dispatch click if not dragging
        el._wasDragged = false;
        const clickEvent = new Event('trueclick', { bubbles: true });
        el.dispatchEvent(clickEvent);
      } else {
        // Drag occurred, suppress click selection
        el._wasDragged = true;
      }
      dragStarted = false;
    }
    el.addEventListener("mousedown", function (e) {
      if (e.target.classList.contains("resize-handle")) return;
      startX = e.clientX;
      startY = e.clientY;
      dragOffsetX = e.clientX - el.offsetLeft;
      dragOffsetY = e.clientY - el.offsetTop;
      document.addEventListener("mousemove", onDragMove);
      document.addEventListener("mouseup", onDragUp);
    });

  // Selection logic: only toggle selection on true click (not drag)
  el.addEventListener("trueclick", function (e) {
  // Selection logic: toggles selection/deselection on click/release
    if (el._wasDragged) {
      // Suppress selection if drag occurred
      el._wasDragged = false;
      return;
    }
    // Toggle selection
    if (el.classList.contains('selected')) {
      el.classList.remove('selected');
      if (window.selectionManager) window.selectionManager.deselect(el);
    } else {
      el.classList.add('selected');
      if (window.selectionManager) window.selectionManager.select(el);
    }
    // Update selectedSquaresRef if available
    if (window.selectedSquaresRef && typeof window.selectedSquaresRef === 'object' && 'value' in window.selectedSquaresRef) {
      window.selectedSquaresRef.value = window.selectionManager.getSelected();
    }
  });

    const handles = [
      { x: 0, y: 0, cursor: "nwse-resize" }, // top-left
      { x: 1, y: 0, cursor: "nesw-resize" }, // top-right
      { x: 0, y: 1, cursor: "nesw-resize" }, // bottom-left
      { x: 1, y: 1, cursor: "nwse-resize" }, // bottom-right
    ];
    handles.forEach((h) => {
      // Scaling logic: anchors center, scales corners proportionately
      const handle = document.createElement("div");
      handle.className = "resize-handle";
      handle.style.position = "absolute";
      handle.style.width = "12px";
      handle.style.height = "12px";
      handle.style.background = "#fff8";
      handle.style.border = "1px solid #333";
      handle.style.borderRadius = "50%";
      handle.style.cursor = h.cursor;
      handle.style.zIndex = 10;
      handle.style.left = h.x ? "calc(100% - 8px)" : "-4px";
      handle.style.top = h.y ? "calc(100% - 8px)" : "-4px";
      handle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        let startX = e.clientX;
        let startY = e.clientY;
        let startW = el.offsetWidth;
        let startH = el.offsetHeight;
        let startL = el.offsetLeft;
        let startT = el.offsetTop;
        // Calculate center
        let centerX = startL + startW / 2;
        let centerY = startT + startH / 2;
        function onMove(ev) {
          let dx = ev.clientX - startX;
          let dy = ev.clientY - startY;
          // Proportionally scale width and height
          let newW = startW + (h.x === 0 ? -dx : dx);
          let newH = startH + (h.y === 0 ? -dy : dy);
          // Anchor center
          el.style.width = newW + "px";
          el.style.height = newH + "px";
          el.style.left = (centerX - newW / 2) + "px";
          el.style.top = (centerY - newH / 2) + "px";
          shape.x = parseInt(el.style.left, 10);
          shape.y = parseInt(el.style.top, 10);
          shape.width = el.style.width;
          shape.height = el.style.height;
        }
        function onUp(ev) {
          // On release, snap the dragged corner to the nearest snap point
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          // On release, snap the dragged corner to the nearest snap point
          if (window.snapToGridEnabled && typeof getNearestSnapPoint === 'function') {
            // Determine which corner was dragged
            let newW = el.offsetWidth;
            let newH = el.offsetHeight;
            let newL = el.offsetLeft;
            let newT = el.offsetTop;
            let snapX = h.x ? newL + newW : newL;
            let snapY = h.y ? newT + newH : newT;
            const snapped = getNearestSnapPoint(snapX, snapY);
            // Calculate offset from current to snapped
            let offsetX = snapped.x - snapX;
            let offsetY = snapped.y - snapY;
            // Move the shape so the dragged corner aligns with the snap point
            el.style.left = (newL + offsetX) + "px";
            el.style.top = (newT + offsetY) + "px";
            shape.x = parseInt(el.style.left, 10);
            shape.y = parseInt(el.style.top, 10);
            shape.width = el.style.width;
            shape.height = el.style.height;
          }
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
      el.appendChild(handle);
    });
  });
}

function renderAllShapes(shapes = [], options = {}) {
  const allShapes = shapes && shapes.length ? shapes : window._aniotaAllShapes || [];
  console.log("[shapesLoader.js] renderAllShapes called with", allShapes.length, "shapes");
  
  // Render ALL active shapes, not filtered by area
  const filtered = allShapes.filter((s) => s.state === "active");
  console.log("[shapesLoader.js] Rendering all areas:", filtered.map((s) => `${s.id}(area:${s.area})`));
  
  const workspace = document.getElementById("snapgrid-workspace");
  if (!workspace) {
    console.error("[shapesLoader.js] snapgrid-workspace not found!");
    return;
  }

  // Clear existing shapes and re-render all
  document.querySelectorAll(".snapgrid-square").forEach((e) => e.remove());
  
  const margin = 8;
  const wsW = workspace.offsetWidth;
  const wsH = workspace.offsetHeight;
  const centerX = wsW / 2;
  const centerY = wsH / 2;
  const maxMag = Math.sqrt(centerX * centerX + centerY * centerY);
  
  filtered.forEach((shape) => {
    const el = document.createElement("div");
    el.className = "snapgrid-square";
    el.id = shape.id;
    el.style.position = "absolute";
    el.style.backgroundColor = shape.color || "#ff0000";
    el.style.border = "1px solid #000";
    el.style.width = shape.width || "50px";
    el.style.height = shape.height || "50px";
    el.style.left = (shape.x || 0) + "px";
    el.style.top = (shape.y || 0) + "px";
    el.style.zIndex = "10";
    workspace.appendChild(el);
  });
  
  window._aniotaShapesArray = filtered;
  console.log("[shapesLoader.js] Rendered", filtered.length, "shapes from all areas");
}

window.reloadUICAForArea = reloadUICAForArea;
window.renderAllShapes = renderAllShapes;
export { loadShapesFromJSON, reloadUICAForArea, renderAllShapes };
