
import { startInfiniteEvolution, infiniteEvolution, aniotaEvolve } from "../js/infiniteEvolution.js";

export function createInfiniteEvolutionButton(theme, onThemeChange) {
  const btnContainer = document.getElementById("grid-buttons-container");
  if (!btnContainer) return;

  // Remove existing button if present
  const existingBtn = document.getElementById("btn-infinite-evolution");
  if (existingBtn) existingBtn.remove();

  const btn = document.createElement("button");
  btn.id = "btn-infinite-evolution";
  btn.textContent = "🌌 Infinite Evolution";
  btn.style.cssText = `
    background: linear-gradient(45deg, #000051, #1A237E, #3F51B5, #2196F3);
    background-size: 400% 400%;
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
    animation: infiniteGradient 3s ease infinite, pulse 2s ease-in-out infinite;
    position: relative;
    overflow: hidden;
  `;

  // Add dynamic animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes infiniteGradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes pulse {
      0%, 100% { box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
      50% { box-shadow: 0 4px 20px rgba(33, 150, 243, 0.6); }
    }
    
    .evolution-active {
      animation: infiniteGradient 1s ease infinite, evolving 0.5s ease-in-out infinite!
    }
    
    @keyframes evolving {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
  `;
  document.head.appendChild(style);

  let evolutionRunning = false;

  btn.addEventListener('mouseenter', () => {
    if (!evolutionRunning) {
      btn.style.transform = 'scale(1.05)';
      btn.textContent = "🚀 Begin Evolution!";
    }
  });

  btn.addEventListener('mouseleave', () => {
    if (!evolutionRunning) {
      btn.style.transform = 'scale(1)';
      btn.textContent = "🌌 Infinite Evolution";
    }
  });

  btn.addEventListener("click", async () => {
    if (evolutionRunning) {
      // Stop evolution
      infiniteEvolution.stopEvolution();
      evolutionRunning = false;
      btn.textContent = "🌌 Infinite Evolution";
      btn.classList.remove('evolution-active');
      btn.style.background = "linear-gradient(45deg, #000051, #1A237E, #3F51B5, #2196F3)";
      return;
    }

    if (!window._aniotaAllShapes || window._aniotaAllShapes.length === 0) {
      alert("⚠️ No shapes found! Design something first to begin infinite evolution.");
      return;
    }

    // Configure evolution parameters
    const config = await showEvolutionConfigDialog();
    if (!config) return;

    console.log("🌌 INFINITE EVOLUTION INITIATED");
    evolutionRunning = true;
    btn.textContent = "⏹️ Stop Evolution";
    btn.classList.add('evolution-active');

    try {
      await startInfiniteEvolution({
        maxGenerations: config.maxGenerations,
        fidelityThreshold: config.fidelityThreshold,
        evolutionInterval: config.evolutionInterval,
        enableCrossSystem: config.enableCrossSystem,
        enableAIAutonomy: config.enableAIAutonomy
      });

    } catch (error) {
      console.error("❌ Infinite evolution error:", error);
      alert(`Evolution error: ${error.message}`);
    }

    evolutionRunning = false;
    btn.textContent = "🌌 Infinite Evolution";
    btn.classList.remove('evolution-active');
  });

  // Right-click for ANIOTA autonomous mode
  btn.addEventListener('contextmenu', async (e) => {
    e.preventDefault();
    
    const aniotaConfirm = confirm(`
🤖 ANIOTA AUTONOMOUS EVOLUTION

Let ANIOTA take control and evolve the system autonomously?

⚠️ WARNING: ANIOTA will make its own decisions about:
- Which systems to evolve
- Evolution strategies to use  
- Risk tolerance levels
- Cross-system improvements

Continue with AI autonomous control?`);

    if (aniotaConfirm) {
      console.log("🤖 TRANSFERRING CONTROL TO ANIOTA");
      btn.textContent = "🤖 ANIOTA Mode";
      btn.style.background = "linear-gradient(45deg, #FF6B35, #F7931E, #FFD23F)";
      
      try {
        const aniotaResult = await aniotaEvolve();
        console.log("🤖 ANIOTA evolution result:", aniotaResult);
        
        setTimeout(() => {
          btn.textContent = "🌌 Infinite Evolution";
          btn.style.background = "linear-gradient(45deg, #000051, #1A237E, #3F51B5, #2196F3)";
        }, 3000);
        
      } catch (error) {
        console.error("🤖 ANIOTA evolution failed:", error);
      }
    }
  });

  btn.title = "INFINITE EVOLUTION: Never-ending recursive self-improvement. Right-click for ANIOTA autonomous mode.";
  btnContainer.appendChild(btn);
  
  console.log("[Infinite Evolution] Button created - ready for endless evolution!");
}

/**
 * Show evolution configuration dialog
 */
async function showEvolutionConfigDialog() {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 10004;
      font-family: 'Noto Sans Rounded', sans-serif;
      min-width: 400px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;

    dialog.innerHTML = `
      <h3 style="margin-top: 0; color: #2196F3;">🌌 Configure Infinite Evolution</h3>
      
      <div style="margin: 15px 0;">
        <label>Max Generations:</label><br>
        <select id="maxGen" style="width: 100%; padding: 5px; margin-top: 5px;">
          <option value="10">10 (Quick test)</option>
          <option value="50">50 (Medium run)</option>
          <option value="100">100 (Long evolution)</option>
          <option value="Infinity" selected>∞ (Infinite)</option>
        </select>
      </div>
      
      <div style="margin: 15px 0;">
        <label>Evolution Interval:</label><br>
        <select id="interval" style="width: 100%; padding: 5px; margin-top: 5px;">
          <option value="5000">5 seconds (Fast)</option>
          <option value="15000">15 seconds (Medium)</option>
          <option value="30000" selected>30 seconds (Stable)</option>
          <option value="60000">60 seconds (Slow)</option>
        </select>
      </div>
      
      <div style="margin: 15px 0;">
        <label>Fidelity Threshold:</label><br>
        <select id="fidelity" style="width: 100%; padding: 5px; margin-top: 5px;">
          <option value="0.8">80% (Relaxed)</option>
          <option value="0.9">90% (Standard)</option>
          <option value="0.95" selected>95% (High)</option>
          <option value="0.99">99% (Perfect)</option>
        </select>
      </div>
      
      <div style="margin: 15px 0; display: flex; gap: 20px;">
        <label><input type="checkbox" id="crossSystem" checked> Cross-system evolution</label>
        <label><input type="checkbox" id="aiAutonomy" checked> ANIOTA autonomy</label>
      </div>
      
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button id="startEvolution" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">🚀 Start Evolution</button>
        <button id="cancelEvolution" style="flex: 1; padding: 10px; background: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer;">❌ Cancel</button>
      </div>
    `;

    document.body.appendChild(dialog);

    document.getElementById('startEvolution').onclick = () => {
      const config = {
        maxGenerations: document.getElementById('maxGen').value === 'Infinity' ? Infinity : parseInt(document.getElementById('maxGen').value),
        evolutionInterval: parseInt(document.getElementById('interval').value),
        fidelityThreshold: parseFloat(document.getElementById('fidelity').value),
        enableCrossSystem: document.getElementById('crossSystem').checked,
        enableAIAutonomy: document.getElementById('aiAutonomy').checked
      };
      
      document.body.removeChild(dialog);
      resolve(config);
    };

    document.getElementById('cancelEvolution').onclick = () => {
      document.body.removeChild(dialog);
      resolve(null);
    };
  });
}
