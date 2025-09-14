
document.addEventListener('DOMContentLoaded', function() {
    initializeSubscribix();
});

function initializeSubscribix() {
    console.log('SUBSCRIBIX initializing...');
    
    // Initialize subscription tier interactions
    initializeTierSelection();
    
    // Initialize module access visualization
    initializeModuleMatrix();
    
    // Initialize navigation flow
    initializeNavigation();
    
    // Initialize ANIOTA mood circle
    initializeMoodCircle();
    
    console.log('SUBSCRIBIX initialized successfully');
}

function initializeTierSelection() {
    const tierCards = document.querySelectorAll('.tier-card');
    const tierButtons = document.querySelectorAll('.tier-button');
    
    tierCards.forEach(card => {
        card.addEventListener('click', () => {
            selectTier(card.dataset.tier);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            highlightTierFeatures(card);
        });
        
        card.addEventListener('mouseleave', () => {
            clearTierHighlights();
        });
    });
    
    tierButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            handleTierSelection(button);
        });
    });
}

function selectTier(tierName) {
    console.log(`Tier selected: ${tierName}`);
    
    // Update visual selection
    document.querySelectorAll('.tier-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelector(`[data-tier="${tierName}"]`).classList.add('selected');
    
    // Update module access matrix
    updateModuleAccess(tierName);
    
    // Show relevant information
    displayTierInformation(tierName);
}

function highlightTierFeatures(card) {
    const tierType = card.dataset.tier;
    
    // Add visual emphasis
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.2)';
    
    // Highlight corresponding module access
    highlightModuleAccess(tierType);
}

function clearTierHighlights() {
    document.querySelectorAll('.tier-card').forEach(card => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
    
    clearModuleHighlights();
}

function handleTierSelection(button) {
    const tierCard = button.closest('.tier-card');
    const tierType = tierCard.dataset.tier;
    
    if (button.classList.contains('selected')) {
        // Already selected, no action needed
        return;
    }
    
    // Handle different tier actions
    switch (tierType) {
        case 'starter':
            // Already free tier
            break;
        case 'companion':
            handleUpgrade('companion');
            break;
        case 'symbie':
            handleSymbieSelection();
            break;
        case 'ecosystem':
            handleEnterpriseInquiry();
            break;
    }
}

function handleUpgrade(tierType) {
    console.log(`Upgrading to ${tierType}...`);
    
    // Show upgrade modal or redirect
    showUpgradeModal(tierType);
}

function handleSymbieSelection() {
    console.log('Symbie tier selected - preparing physical companion integration...');
    
    // Special handling for Symbie - physical component required
    showSymbieInformation();
}

function handleEnterpriseInquiry() {
    console.log('Enterprise tier inquiry...');
    
    // Contact sales flow
    showContactSalesModal();
}

function initializeModuleMatrix() {
    const matrixRows = document.querySelectorAll('.matrix-row');
    
    matrixRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            highlightModuleRow(row);
        });
        
        row.addEventListener('mouseleave', () => {
            clearModuleRowHighlight(row);
        });
    });
}

function updateModuleAccess(tierType) {
    const accessLevels = {
        starter: ['basic', 'none', 'none', 'none', 'none', 'basic', 'none'],
        companion: ['full', 'full', 'full', 'none', 'none', 'full', 'none'],
        symbie: ['full', 'full', 'full', 'basic', 'basic', 'full', 'full'],
        ecosystem: ['full', 'full', 'full', 'full', 'full', 'full', 'full']
    };
    
    const indicators = document.querySelectorAll('.access-indicator');
    const levels = accessLevels[tierType] || accessLevels.starter;
    
    indicators.forEach((indicator, index) => {
        if (index < levels.length) {
            // Remove existing classes
            indicator.classList.remove('none', 'basic', 'full');
            
            // Add appropriate class
            indicator.classList.add(levels[index]);
            
            // Update text content
            const textMap = {
                'none': 'None',
                'basic': 'Basic',
                'full': 'Full'
            };
            indicator.textContent = textMap[levels[index]];
        }
    });
}

function highlightModuleAccess(tierType) {
    // Add visual emphasis to module access for selected tier
    const matrix = document.querySelector('.access-matrix');
    matrix.classList.add(`highlight-${tierType}`);
}

function clearModuleHighlights() {
    const matrix = document.querySelector('.access-matrix');
    matrix.className = 'access-matrix'; // Reset classes
}

function highlightModuleRow(row) {
    row.style.backgroundColor = '#e3f2fd';
    row.style.transform = 'scale(1.02)';
}

function clearModuleRowHighlight(row) {
    row.style.backgroundColor = '';
    row.style.transform = '';
}

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add transition effect
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
}

// Modal and Information Display
function showUpgradeModal(tierType) {
    // Create upgrade modal
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Upgrade to ${tierType.charAt(0).toUpperCase() + tierType.slice(1)}</h3>
            <p>You're about to upgrade your ANIOTA experience!</p>
            <div class="modal-actions">
                <button class="btn-cancel">Cancel</button>
                <button class="btn-confirm">Confirm Upgrade</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle modal actions
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.btn-confirm').addEventListener('click', () => {
        processUpgrade(tierType);
        document.body.removeChild(modal);
    });
}

function showSymbieInformation() {
    const modal = document.createElement('div');
    modal.className = 'symbie-modal';
    modal.innerHTML = `
        <div class="modal-content symbie-content">
            <div class="symbie-header">
                <h3>🐙 Welcome to the Symbie Experience!</h3>
                <p>Your physical ANIOTA companion awaits...</p>
            </div>
            <div class="symbie-features">
                <div class="feature-item">
                    <span class="feature-icon">🎒</span>
                    <span>Wearable as scarf, usable as pillow</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🎮</span>
                    <span>Trainable pet commands (sit, stay, fetch, swim)</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🔌</span>
                    <span>USB intelligence transfer + Bluetooth connection</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🎨</span>
                    <span>Customizable skins, textures, and outfits</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📚</span>
                    <span>Educational mission: authentic learning partner</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-cancel">Learn More Later</button>
                <button class="btn-confirm symbie-confirm">Get My Symbie!</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle modal actions
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.symbie-confirm').addEventListener('click', () => {
        processSymbieOrder();
        document.body.removeChild(modal);
    });
}

function showContactSalesModal() {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Enterprise Ecosystem Access</h3>
            <p>Ready to transform your organization's learning capabilities?</p>
            <form class="contact-form">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Email Address" required>
                <input type="text" placeholder="Organization" required>
                <textarea placeholder="Tell us about your learning goals..."></textarea>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-confirm">Contact Sales</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle modal actions
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        processContactInquiry();
        document.body.removeChild(modal);
    });
}

// Process Actions
function processUpgrade(tierType) {
    console.log(`Processing upgrade to ${tierType}...`);
    
    // Here you would integrate with payment processing
    showSuccessMessage(`Welcome to ANIOTA ${tierType.charAt(0).toUpperCase() + tierType.slice(1)}!`);
    
    // Update UI to reflect new tier
    updateCurrentTier(tierType);
}

function processSymbieOrder() {
    console.log('Processing Symbie order...');
    
    // Special handling for physical product
    showSuccessMessage('Your Symbie companion will be shipped within 2-3 weeks!');
    
    // Update UI
    updateCurrentTier('symbie');
}

function processContactInquiry() {
    console.log('Processing enterprise contact inquiry...');
    
    showSuccessMessage('Thank you! Our enterprise team will contact you within 24 hours.');
}

function updateCurrentTier(newTier) {
    // Update selected tier button
    document.querySelectorAll('.tier-button').forEach(button => {
        button.textContent = button.classList.contains('selected') ? 'Current Plan' : 
                           (button.closest(`[data-tier="${newTier}"]`) ? 'Current Plan' : 
                           button.textContent);
        
        button.className = button.closest(`[data-tier="${newTier}"]`) ? 
                          'tier-button selected' : 
                          button.className.replace('selected', '');
    });
    
    // Update module access
    updateModuleAccess(newTier);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

// ANIOTA Mood Circle Integration
function initializeMoodCircle() {
    const moodCircle = document.getElementById('aniota-mood-circle');
    
    if (moodCircle) {
        // Add interactive behavior
        moodCircle.addEventListener('click', () => {
            triggerANIOTAInteraction();
        });
        
        // Periodic mood updates
        setInterval(updateMoodCircle, 5000);
    }
}

function triggerANIOTAInteraction() {
    console.log('ANIOTA interaction triggered from SUBSCRIBIX');
    
    // Show ANIOTA guidance
    showANIOTAGuidance();
}

function updateMoodCircle() {
    const moodCircle = document.getElementById('aniota-mood-circle');
    
    if (moodCircle) {
        // Cycle through different moods based on user interaction
        const moods = ['excited', 'curious', 'helpful', 'encouraging'];
        const currentMood = moods[Math.floor(Math.random() * moods.length)];
        
        moodCircle.className = `mood-${currentMood}`;
    }
}

function showANIOTAGuidance() {
    const guidance = document.createElement('div');
    guidance.className = 'aniota-guidance';
    guidance.innerHTML = `
        <div class="guidance-bubble">
            <p>Hi! I'm ANIOTA! 🌟</p>
            <p>Need help choosing the right subscription? I'm here to guide you through your learning journey!</p>
            <button onclick="this.parentElement.parentElement.remove()">Thanks, ANIOTA!</button>
        </div>
    `;
    
    document.body.appendChild(guidance);
    
    setTimeout(() => {
        if (document.body.contains(guidance)) {
            document.body.removeChild(guidance);
        }
    }, 8000);
}

// Utility Functions
function displayTierInformation(tierName) {
    const infoMap = {
        starter: 'Perfect for exploring ANIOTA\'s core learning capabilities',
        companion: 'Unlock the full power of AI-assisted learning',
        symbie: 'Experience learning in both digital and physical worlds',
        ecosystem: 'Complete educational transformation for organizations'
    };
    
    console.log(`Tier Info: ${infoMap[tierName] || 'Unknown tier'}`);
}

// Export functions for external use
window.SUBSCRIBIX = {
    selectTier,
    updateModuleAccess,
    processUpgrade,
    triggerANIOTAInteraction
};
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------
