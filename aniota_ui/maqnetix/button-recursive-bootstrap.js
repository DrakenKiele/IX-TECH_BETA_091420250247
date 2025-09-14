
import { bootstrapMAQNETIXInterface, downloadBootstrapFiles } from "../js/bootstrapMAQNETIX.js";

export function createRecursiveBootstrapButton(theme, onThemeChange) {
  const btnContainer = document.getElementById("grid-buttons-container");
  if (!btnContainer) return;

  // Remove existing button if present
  const existingBtn = document.getElementById("btn-recursive-bootstrap");
  if (existingBtn) existingBtn.remove();

  const btn = document.createElement("button");
  btn.id = "btn-recursive-bootstrap";
  btn.textContent = "🔄 Bootstrap Self-Design";
  btn.style.cssText = `
    background: linear-gradient(45deg, #9C27B0, #E91E63);
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
    animation: glow 2s infinite alternate;
  `;

  // Add glowing animation for this special button
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glow {
      from { box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
      to { box-shadow: 0 4px 20px rgba(156, 39, 176, 0.4); }
    }
  `;
  document.head.appendChild(style);

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.05)';
    btn.textContent = "🚀 Redesign MAQNETIX!";
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
    btn.textContent = "🔄 Bootstrap Self-Design";
  });

  btn.addEventListener("click", async () => {
    if (!window._aniotaAllShapes || window._aniotaAllShapes.length === 0) {
      alert("⚠️ No shapes found! Design your ideal MAQNETIX interface first, then click this button.");
      return;
    }

    // Confirm the recursive bootstrap
    const confirmed = confirm(`
🔄 RECURSIVE BOOTSTRAP CONFIRMED?

This will use your current MAQNETIX design to create a NEW MAQNETIX interface!

Current shapes: ${window._aniotaAllShapes.length}

The generated interface will REPLACE the current MAQNETIX system.

Continue with recursive self-redesign?`);

    if (!confirmed) return;

    console.log("🚀 INITIATING RECURSIVE BOOTSTRAP");
    btn.textContent = "⏳ Bootstrapping...";
    btn.disabled = true;

    try {
      const bootstrap = await bootstrapMAQNETIXInterface(window._aniotaAllShapes, {
        generateFiles: true,
        createBackup: true,
        testBootstrap: true
      });

      if (bootstrap.success) {
        btn.textContent = "✅ Bootstrap Complete!";
        btn.style.background = "linear-gradient(45deg, #4CAF50, #8BC34A)";

        // Show results
        const fidelity = bootstrap.testResults ? 
          `Fidelity: ${(bootstrap.testResults.fidelity * 100).toFixed(1)}%` : 
          "No test performed";

        const result = confirm(`
🏆 RECURSIVE BOOTSTRAP SUCCESSFUL!

${fidelity}
Files generated: ${Object.keys(bootstrap.generatedFiles).length}

🎯 MAQNETIX has successfully redesigned itself using itself!

Download the new interface files now?`);

        if (result) {
          downloadBootstrapFiles(bootstrap);
          
          alert(`
📁 FILES DOWNLOADED!

Replace your current maqnetix_ui_core_snapgrid.html with:
→ maqnetix_ui_core_snapgrid_NEW.html

🔄 The recursive bootstrap is complete!
Your designed layout is now the new MAQNETIX interface!`);
        }

        // Store bootstrap result globally for inspection
        window._lastBootstrap = bootstrap;
        
      } else {
        throw new Error(bootstrap.error || "Bootstrap failed");
      }

    } catch (error) {
      console.error("❌ Bootstrap failed:", error);
      btn.textContent = "❌ Bootstrap Failed";
      btn.style.background = "linear-gradient(45deg, #F44336, #D32F2F)";
      
      alert(`Bootstrap failed: ${error.message}`);
    }

    btn.disabled = false;
    
    // Reset button after 5 seconds
    setTimeout(() => {
      btn.textContent = "🔄 Bootstrap Self-Design";
      btn.style.background = "linear-gradient(45deg, #9C27B0, #E91E63)";
    }, 5000);
  });

  btn.title = "RECURSIVE BOOTSTRAP: Use MAQNETIX to redesign MAQNETIX itself! The ultimate self-improvement loop.";
  btnContainer.appendChild(btn);
  
  console.log("[Recursive Bootstrap] Button created - ready for self-redesign!");
}
