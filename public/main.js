// ============================================
// LANDING PAGE - Main Script
// ============================================

// ===== CONFIGURATION =====
const CONFIG = {
    particleCount: 120,
    loreRotationInterval: 7000,
    taglineRotationInterval: 5000
};

// ===== DOM REFERENCES =====
const beginBtn = document.getElementById('beginBtn');
const houseBtns = document.querySelectorAll('.house-btn');
const houseNameEl = document.getElementById('houseName');
const houseWordsEl = document.getElementById('houseWords');
const loreTagline = document.getElementById('loreTagline');
const maesterText = document.getElementById('maesterText');

// ===== STATE =====
let selectedHouse = 'stark';
let isTransitioning = false;
let loreInterval = null;
let taglineInterval = null;

// ===== PARTICLE SYSTEM =====
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const colors = [
        '#ff1744', '#ff5252', '#d50000', '#ff6b35',
        '#ffd700', '#f0d080', '#d4a74a', '#b8860b',
        '#ff8f00', '#ffab00', '#ff6f00', '#ff3d00'
    ];
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        const x = Math.random() * 100;
        const bottomPos = Math.random() * 100;
        const duration = Math.random() * 8 + 4;
        const delay = Math.random() * 15;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            left: ${x}%;
            bottom: ${bottomPos}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            --duration: ${duration}s;
            --delay: ${delay}s;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 5}px ${size * 2.5}px ${color}55;
        `;
        
        fragment.appendChild(particle);
    }
    
    container.appendChild(fragment);
}

// ===== HOUSE SELECTION =====
function selectHouse(houseKey) {
    if (isTransitioning || houseKey === selectedHouse) return;
    isTransitioning = true;
    
    const house = HOUSES[houseKey];
    const color = house.color;
    
    // Update buttons
    houseBtns.forEach((btn) => {
        const isActive = btn.dataset.house === houseKey;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive);
        
        const tooltip = btn.querySelector('.house-tooltip');
        if (isActive) {
            tooltip.style.opacity = '0.7';
            tooltip.style.transform = 'translateX(-50%) scale(1)';
        } else {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) scale(0.8)';
        }
    });
    
    // Update display
    const elements = [
        { el: houseNameEl, text: house.name, isName: true },
        { el: houseWordsEl, text: house.words, isName: false },
        { el: loreTagline, text: house.words, isName: false },
        { el: maesterText, text: house.lore, isName: false }
    ];
    
    elements.forEach(({ el, text, isName }) => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.96)';
        
        setTimeout(() => {
            el.textContent = text;
            el.style.color = color;
            
            if (isName) {
                el.style.textShadow = `
                    0 0 30px ${color}22,
                    0 0 60px ${color}11,
                    0 2px 20px rgba(0,0,0,0.9)
                `;
            } else {
                el.style.textShadow = `
                    0 0 20px ${color}18,
                    0 0 40px ${color}0a,
                    0 2px 20px rgba(0,0,0,0.9)
                `;
            }
            
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                }, 150);
            });
        }, 150);
    });
    
    // Update attribution
    const attribution = document.querySelector('.maester-attribution');
    if (attribution) {
        attribution.style.color = color;
        attribution.style.textShadow = `0 0 20px ${color}14, 0 2px 20px rgba(0,0,0,0.8)`;
    }
    
    selectedHouse = houseKey;
    
    setTimeout(() => {
        isTransitioning = false;
    }, 400);
}

// ===== LORE ROTATION =====
let loreIndex = 0;

function rotateLore() {
    const snippet = LORE_SNIPPETS[loreIndex];
    const house = HOUSES[selectedHouse];
    const color = house.color;
    
    maesterText.style.opacity = '0';
    
    setTimeout(() => {
        maesterText.textContent = snippet.text;
        maesterText.style.color = color;
        maesterText.style.textShadow = `0 0 20px ${color}14, 0 2px 20px rgba(0,0,0,0.8)`;
        maesterText.style.opacity = '1';
        
        const attribution = document.querySelector('.maester-attribution');
        if (attribution) {
            attribution.textContent = snippet.attribution;
            attribution.style.color = color;
            attribution.style.textShadow = `0 0 20px ${color}14, 0 2px 20px rgba(0,0,0,0.8)`;
        }
    }, 200);
    
    loreIndex = (loreIndex + 1) % LORE_SNIPPETS.length;
}

// ===== TAGLINE ROTATION =====
let taglineIndex = 0;

function rotateTagline() {
    const tagline = TAGLINES[taglineIndex];
    const house = HOUSES[selectedHouse];
    const color = house.color;
    
    loreTagline.style.opacity = '0';
    loreTagline.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
        loreTagline.textContent = tagline;
        loreTagline.style.color = color;
        loreTagline.style.textShadow = `
            0 0 30px ${color}14,
            0 0 60px ${color}0a,
            0 2px 30px rgba(0,0,0,0.95)
        `;
        loreTagline.style.opacity = '1';
        loreTagline.style.transform = 'scale(1)';
    }, 300);
    
    taglineIndex = (taglineIndex + 1) % TAGLINES.length;
}

// ===== BEGIN BUTTON HANDLER =====
beginBtn.addEventListener('click', function(e) {
    const content = this.querySelector('.btn-content');
    content.style.transform = 'scale(0.97)';
    setTimeout(() => {
        content.style.transform = 'scale(1)';
    }, 200);
    
    // Use the transition system
    TransitionSystem.transitionToMap(selectedHouse);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === document.body) {
        e.preventDefault();
        beginBtn.click();
    }
    
    const numKey = parseInt(e.key);
    if (numKey >= 1 && numKey <= 8 && houseBtns[numKey - 1]) {
        houseBtns[numKey - 1].click();
    }
});

// ===== EVENT LISTENERS =====
houseBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        selectHouse(btn.dataset.house);
    });
    btn.title = `Press ${index + 1} to select`;
});

// ===== SERVER CONNECTION TEST =====
async function testServer() {
    try {
        const response = await fetch('/api/test');
        const data = await response.json();
        console.log('🐉 Server:', data.message);
    } catch (error) {
        // Silent fail - not critical
    }
}

// ===== INITIALIZE =====
function init() {
    console.log('❄️🔥 A Song of Ice and Fire - Loading...');
    
    // Create particles
    createParticles();
    
    // Default house selection
    selectHouse('stark');
    
    // Start rotations
    loreInterval = setInterval(rotateLore, CONFIG.loreRotationInterval);
    taglineInterval = setInterval(rotateTagline, CONFIG.taglineRotationInterval);
    
    // Test server
    testServer();
    
    console.log('✅ The realm is ready!');
    console.log('📋 Press numbers 1-8 to select houses');
    console.log('⌨️  Press Enter or Space to begin');
}

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', init);

// ===== WINDOW LOAD =====
window.addEventListener('load', () => {
    console.log('🏰 The Seven Kingdoms await...');
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    if (loreInterval) clearInterval(loreInterval);
    if (taglineInterval) clearInterval(taglineInterval);
});