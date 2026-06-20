// ========================================
// MAIN.JS - Landing Page Logic
// ========================================

// ===== CONFIGURATION =====
const CONFIG = {
    particleCount: 60
};

// ===== DOM ELEMENTS =====
const beginBtn = document.getElementById('beginBtn');

// ===== PARTICLE SYSTEM =====
function createParticles() {
    const container = document.getElementById('particles-container');
    const colors = ['#d4a74a', '#ffd700', '#f0e6d2', '#ff8c00', '#ff6347', '#ffaa33'];
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        const x = Math.random() * 100;
        const bottomPos = Math.random() * 100;
        const duration = Math.random() * 7 + 3;
        const delay = Math.random() * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            left: ${x}%;
            bottom: ${bottomPos}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 3}px ${size * 1.5}px ${color}44;
        `;
        
        container.appendChild(particle);
    }
}

// ===== BUTTON INTERACTION =====
beginBtn.addEventListener('click', function(e) {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
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
        background: #0a0806;
        z-index: 999;
        opacity: 0;
        transition: opacity 1.5s ease;
        pointer-events: none;
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
    
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        color: #d4a74a;
        font-family: 'Cinzel', serif;
        font-size: 2rem;
        letter-spacing: 5px;
        opacity: 0;
        transition: opacity 1s ease;
        text-shadow: 0 0 30px rgba(212, 167, 74, 0.5);
        pointer-events: none;
    `;
    message.textContent = '🐺 THE NORTH REMEMBERS...';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '1';
    }, 500);
    
    setTimeout(() => {
        window.location.href = '/map.html';
    }, 2500);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        beginBtn.click();
    }
});

// ===== TEST SERVER =====
async function testServer() {
    try {
        const response = await fetch('/api/test');
        const data = await response.json();
        console.log('🐺 Server says:', data.message);
    } catch (error) {
        console.log('ℹ️ Make sure you run: npm start');
    }
}

// ===== INITIALIZE =====
function init() {
    console.log('🏰 Westeros Rising - Loading...');
    console.log('🐺 Winter is coming...');
    createParticles();
    testServer();
    console.log('✅ Landing page ready!');
}

document.addEventListener('DOMContentLoaded', init);