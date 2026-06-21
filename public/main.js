// ============================================
// A SONG OF ICE AND FIRE - Main Script
// ============================================

// ===== CONFIGURATION =====
const CONFIG = {
    particleCount: 120,
    loreRotationInterval: 7000,
    houseColors: {
        stark: { primary: '#4fc3f7', secondary: '#0288d1', glow: 'rgba(79,195,247,' },
        lannister: { primary: '#ff1744', secondary: '#d50000', glow: 'rgba(255,23,68,' },
        targaryen: { primary: '#ff6b35', secondary: '#e65100', glow: 'rgba(255,107,53,' },
        baratheon: { primary: '#ffd700', secondary: '#f9a825', glow: 'rgba(255,215,0,' },
        greyjoy: { primary: '#4dd0e1', secondary: '#00bcd4', glow: 'rgba(77,208,225,' },
        tyrell: { primary: '#66bb6a', secondary: '#388e3c', glow: 'rgba(102,187,106,' },
        martell: { primary: '#ff8f00', secondary: '#e65100', glow: 'rgba(255,143,0,' },
        tully: { primary: '#4fc3f7', secondary: '#0277bd', glow: 'rgba(79,195,247,' }
    }
};

// ===== DOM REFERENCES =====
const beginBtn = document.getElementById('beginBtn');
const houseBtns = document.querySelectorAll('.house-btn');
const houseNameEl = document.getElementById('houseName');
const houseWordsEl = document.getElementById('houseWords');
const loreTagline = document.getElementById('loreTagline');
const maesterText = document.getElementById('maesterText');

// ===== HOUSE DATA =====
const HOUSES = {
    stark: {
        name: 'House Stark',
        words: '"Winter is Coming"',
        sigil: '🐺',
        color: '#4fc3f7',
        lore: 'The North remembers. Honor. Duty. Family. The lone wolf dies, but the pack survives.'
    },
    lannister: {
        name: 'House Lannister',
        words: '"Hear Me Roar!"',
        sigil: '🦁',
        color: '#ff1744',
        lore: 'A Lannister always pays his debts. Gold. Power. Cunning. The lion does not concern himself with the opinions of sheep.'
    },
    targaryen: {
        name: 'House Targaryen',
        words: '"Fire and Blood"',
        sigil: '🐉',
        color: '#ff6b35',
        lore: 'The dragon has three heads. Legacy. Fire. Conquest. I am the blood of the dragon.'
    },
    baratheon: {
        name: 'House Baratheon',
        words: '"Ours is the Fury"',
        sigil: '🦌',
        color: '#ffd700',
        lore: 'Storms rage. Strength. Ferocity. Determination. In the storm, we find our strength.'
    },
    greyjoy: {
        name: 'House Greyjoy',
        words: '"We Do Not Sow"',
        sigil: '🦑',
        color: '#4dd0e1',
        lore: 'What is dead may never die. Iron. Reaving. Independence. We are the ironborn.'
    },
    tyrell: {
        name: 'House Tyrell',
        words: '"Growing Strong"',
        sigil: '🌹',
        color: '#66bb6a',
        lore: 'The reach is vast. Beauty. Plenty. Ambition. Growing strong in all seasons.'
    },
    martell: {
        name: 'House Martell',
        words: '"Unbowed, Unbent, Unbroken"',
        sigil: '☀️',
        color: '#ff8f00',
        lore: 'The sun of Dorne. Pride. Passion. Resilience. We do not kneel.'
    },
    tully: {
        name: 'House Tully',
        words: '"Family, Duty, Honor"',
        sigil: '🐟',
        color: '#4fc3f7',
        lore: 'The river runs deep. Loyalty. Integrity. Service. Family comes first.'
    }
};

// ===== LORE SNIPPETS =====
const LORE_SNIPPETS = [
    { text: '"The lone wolf dies, but the pack survives."', attribution: '— Old Nan' },
    { text: '"When you play the game of thrones, you win or you die."', attribution: '— Cersei Lannister' },
    { text: '"Winter is coming. You know the words, but you don\'t know what they mean."', attribution: '— Old Nan' },
    { text: '"A mind needs books like a sword needs a whetstone."', attribution: '— Tyrion Lannister' },
    { text: '"Power resides where men believe it resides."', attribution: '— Varys' },
    { text: '"The night is dark and full of terrors."', attribution: '— Melisandre' },
    { text: '"All men must die, but we are not men."', attribution: '— Dothraki Sayings' },
    { text: '"What is dead may never die."', attribution: '— Greyjoy Saying' },
    { text: '"I am the shield that guards the realms of men."', attribution: '— Night\'s Watch Vow' },
    { text: '"The crown does not make the king."', attribution: '— Ned Stark' },
    { text: '"A dragon is not a slave."', attribution: '— Daenerys Targaryen' },
    { text: '"Chaos is a ladder."', attribution: '— Petyr Baelish' },
    { text: '"The North remembers."', attribution: '— Stark House Words' },
    { text: '"Valar morghulis."', attribution: '— High Valyrian' },
    { text: '"Valar dohaeris."', attribution: '— High Valyrian' },
    { text: '"A man who reads lives a thousand lives."', attribution: '— Old Saying' }
];

// ===== TAGLINE ROTATION =====
const TAGLINES = [
    '"The world is full of stories, but the best ones are written in ice and fire."',
    '"Winter is Coming"',
    '"Fire and Blood"',
    '"The North Remembers"',
    '"Hear Me Roar!"',
    '"We Do Not Sow"',
    '"Growing Strong"',
    '"Unbowed, Unbent, Unbroken"',
    '"Family, Duty, Honor"',
    '"Ours is the Fury"',
    '"A Lannister Always Pays His Debts"',
    '"What is Dead May Never Die"'
];

// ===== PARTICLE SYSTEM - Red & Gold Shades =====
function createParticles() {
    const container = document.getElementById('particles-container');
    // Red and Gold shades only
    const colors = [
        '#ff1744', '#ff5252', '#d50000', '#ff6b35', // Reds
        '#ffd700', '#f0d080', '#d4a74a', '#b8860b', // Golds
        '#ff8f00', '#ffab00', '#ff6f00', '#ff3d00'  // Amber/Orange
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

// ===== HOUSE SELECTION WITH SYNC =====
let selectedHouse = 'stark';
let isTransitioning = false;
let animationFrameId = null;

function selectHouse(houseKey) {
    if (isTransitioning || houseKey === selectedHouse) return;
    isTransitioning = true;
    
    const house = HOUSES[houseKey];
    const color = CONFIG.houseColors[houseKey];
    
    // Cancel any pending animations
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Update active state with smooth transition
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
    
    // Sync all text elements with animation
    const elements = [
        { el: houseNameEl, text: house.name, isName: true },
        { el: houseWordsEl, text: house.words, isName: false },
        { el: loreTagline, text: house.words, isName: false },
        { el: maesterText, text: house.lore, isName: false }
    ];
    
    elements.forEach(({ el, text, isName }) => {
        // Fade out
        el.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        el.style.opacity = '0';
        el.style.transform = 'scale(0.96)';
        
        // Use requestAnimationFrame for sync
        animationFrameId = requestAnimationFrame(() => {
            // Update content and color
            el.textContent = text;
            el.style.color = house.color;
            
            const glowColor = color.glow;
            if (isName) {
                el.style.textShadow = `
                    0 0 30px ${glowColor}0.15),
                    0 0 60px ${glowColor}0.08),
                    0 2px 20px rgba(0,0,0,0.9)
                `;
            } else {
                el.style.textShadow = `
                    0 0 20px ${glowColor}0.1),
                    0 0 40px ${glowColor}0.05),
                    0 2px 20px rgba(0,0,0,0.9)
                `;
            }
            
            // Fade in with slight scale bounce
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                }, 150);
            });
        });
    });
    
    // Update attribution color
    const attribution = document.querySelector('.maester-attribution');
    if (attribution) {
        attribution.style.color = house.color;
        attribution.style.textShadow = `
            0 0 20px ${color.glow}0.08),
            0 2px 20px rgba(0,0,0,0.8)
        `;
    }
    
    selectedHouse = houseKey;
    
    setTimeout(() => {
        isTransitioning = false;
    }, 400);
}

// ===== MAESTER ADVICE ROTATION =====
let loreIndex = 0;

function rotateLore() {
    const snippet = LORE_SNIPPETS[loreIndex];
    const house = HOUSES[selectedHouse];
    const color = CONFIG.houseColors[selectedHouse];
    
    maesterText.style.transition = 'opacity 0.2s ease';
    maesterText.style.opacity = '0';
    
    setTimeout(() => {
        maesterText.textContent = snippet.text;
        maesterText.style.color = house.color;
        maesterText.style.textShadow = `
            0 0 20px ${color.glow}0.05),
            0 2px 20px rgba(0,0,0,0.8)
        `;
        maesterText.style.opacity = '1';
        
        const attribution = document.querySelector('.maester-attribution');
        if (attribution) {
            attribution.textContent = snippet.attribution;
            attribution.style.color = house.color;
            attribution.style.textShadow = `
                0 0 20px ${color.glow}0.08),
                0 2px 20px rgba(0,0,0,0.8)
            `;
        }
    }, 200);
    
    loreIndex = (loreIndex + 1) % LORE_SNIPPETS.length;
}

// ===== TAGLINE ROTATION =====
let taglineIndex = 0;

function rotateTagline() {
    const tagline = TAGLINES[taglineIndex];
    const house = HOUSES[selectedHouse];
    const color = CONFIG.houseColors[selectedHouse];
    
    loreTagline.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    loreTagline.style.opacity = '0';
    loreTagline.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
        loreTagline.textContent = tagline;
        loreTagline.style.color = house.color;
        loreTagline.style.textShadow = `
            0 0 30px ${color.glow}0.08),
            0 0 60px ${color.glow}0.04),
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
    
    transitionToMap();
});

function transitionToMap() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #050302;
        z-index: 999;
        opacity: 0;
        transition: opacity 1.8s ease;
        pointer-events: none;
    `;
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    
    const house = HOUSES[selectedHouse];
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        color: ${house.color};
        font-family: 'Cinzel', serif;
        font-size: 2.5rem;
        letter-spacing: 8px;
        opacity: 0;
        transition: opacity 1.6s ease;
        text-shadow: 0 0 60px ${house.color}44, 0 0 120px ${house.color}22, 0 2px 40px rgba(0,0,0,0.9);
        pointer-events: none;
        text-align: center;
        line-height: 1.6;
    `;
    message.innerHTML = `
        ${house.sigil} ${house.name}
        <div style="font-size: 1.1rem; color: rgba(196,163,90,0.4); letter-spacing: 5px; margin-top: 12px; font-family: 'Lora', serif; font-style: italic; text-shadow: 0 2px 20px rgba(0,0,0,0.9);">
            ${house.words}
        </div>
        <div style="font-size: 0.7rem; color: rgba(196,163,90,0.15); letter-spacing: 3px; margin-top: 15px; text-shadow: 0 2px 20px rgba(0,0,0,0.9);">
            ❄ A Song of Ice and Fire 🔥
        </div>
    `;
    document.body.appendChild(message);
    
    requestAnimationFrame(() => {
        message.style.opacity = '1';
    });
    
    setTimeout(() => {
        window.location.href = '/map.html';
    }, 2800);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (e.target === document.body) {
            beginBtn.click();
        }
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
let loreInterval = null;
let taglineInterval = null;

function init() {
    console.log('❄️🔥 A Song of Ice and Fire - Loading...');
    
    // Create particles (red and gold)
    createParticles();
    
    // Default house selection with initial sync
    selectHouse('stark');
    
    // Clear any existing intervals
    if (loreInterval) clearInterval(loreInterval);
    if (taglineInterval) clearInterval(taglineInterval);
    
    // Start rotations with proper timing
    loreInterval = setInterval(rotateLore, CONFIG.loreRotationInterval);
    taglineInterval = setInterval(rotateTagline, 5000);
    
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
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    // Silent fail for non-critical errors
});