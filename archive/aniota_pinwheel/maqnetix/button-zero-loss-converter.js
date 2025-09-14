
import { showPackerUI } from "../js/packerUI.js";

export function createZeroLossConverterButton(theme, onThemeChange) {
  const btnContainer = document.getElementById("grid-buttons-container");
  if (!btnContainer) return;

  // Remove existing button if present
  const existingBtn = document.getElementById("btn-zero-loss-converter");
  if (existingBtn) existingBtn.remove();

  const btn = document.createElement("button");
  btn.id = "btn-zero-loss-converter";
  btn.textContent = "🔄 Zero-Loss Converter";
  btn.style.cssText = `
    background: linear-gradient(45deg, #4CAF50, #2196F3);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    margin: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.05)';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  });

  btn.addEventListener("click", () => {
    console.log("[Zero-Loss Converter] Opening conversion system");
    
    // Initialize unpacker data with current shapes
    if (window._aniotaAllShapes && window.setShapesData) {
      window.setShapesData(window._aniotaAllShapes, { width: 1920, height: 1080 });
    }
    
    // Show the packer UI (main converter interface)
    showPackerUI();
    
    // Log system status
    console.log("[Zero-Loss Converter] System ready for analog-digital-analog conversion");
    console.log(`[Zero-Loss Converter] Current shapes available: ${window._aniotaAllShapes?.length || 0}`);
  });

  btn.title = "Open Zero-Loss Converter: Complete round-trip analog↔digital conversion system";
  btnContainer.appendChild(btn);
  
  console.log("[Zero-Loss Converter] Button created and attached");
}
