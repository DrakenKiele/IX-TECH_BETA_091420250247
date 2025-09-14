
import { showPackerUI } from "../js/packerUI.js";
import { createToggleButton } from "./button-maker.js";

export function createPackerButton(config = {}) {
  console.log("[Packer Button] Creating packer button");
  
  const btn = createToggleButton({
    id: "btn-packer",
    label: "📦 Packer",
    right: "10px",
    initialTop: config.initialTop || 10,
    theme: {
      backgroundEnabledOn: "#28a745",
      backgroundEnabledOff: "#28a745",
      backgroundInactive: "#1e7e34"
    },
    onEnable: () => {
      console.log("[Packer] Opening packer interface");
      
      // Initialize packer data with current shapes if available
      if (window._aniotaAllShapes && window.setShapesData) {
        window.setShapesData(window._aniotaAllShapes, { width: 1920, height: 1080 });
        console.log(`[Packer] Loaded ${window._aniotaAllShapes.length} shapes for packing`);
      }
      
      // Show the packer UI
      showPackerUI();
      
      console.log("[Packer] Packer interface launched successfully");
    },
    onDisable: () => {
      console.log("[Packer] Packer button disabled");
      // Could close packer UI here if needed
    },
    defaultActiveState: "on"
  });

  btn.title = "Open Packer: Convert UI layouts to shape definitions";
  console.log("[Packer Button] Button created successfully");
  return btn;
}
