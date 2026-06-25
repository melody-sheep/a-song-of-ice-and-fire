// ============================================
// WINTERFELL - Map Editor Logic
// Premium Theme | Grid Only | UI Preview
// ============================================

// ===== CONFIGURATION =====
let CONFIG = {
    cols: 20,
    rows: 12,
    cellWidth: 60,
    cellHeight: 40,
    zoom: 1.0,
    minZoom: 0.3,
    maxZoom: 2.0,
};

// ===== DOM REFERENCES =====
const gridContainer = document.getElementById('gridContainer');
const coordDisplay = document.getElementById('coordDisplay');
const zoomDisplay = document.getElementById('zoomDisplay');
const hoverCoordDisplay = document.getElementById('hoverCoordDisplay');
const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
const statusCoord = document.getElementById('statusCoord');
const statusZoom = document.getElementById('statusZoom');
const statusGrid = document.getElementById('statusGrid');
const statusCells = document.getElementById('statusCells');
const gridSizeDisplay = document.getElementById('gridSizeDisplay');
const gridWrapper = document.getElementById('gridWrapper');

// ===== STATE =====
let currentZoom = 1.0;
let hoverX = null;
let hoverY = null;
let particles = [];

// ===== PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const colors = ['#ff1744', '#ffd700', '#4fc3f7', '#d4a74a', '#f0d080'];
    
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const bottom = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 15;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            left: ${x}%;
            bottom: ${bottom}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            --duration: ${duration}s;
            --delay: ${delay}s;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 4}px ${size * 2}px ${color}33;
        `;
        
        container.appendChild(particle);
    }
}

// ===== BUILD GRID =====
function buildGrid() {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${CONFIG.cols}, ${CONFIG.cellWidth}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${CONFIG.rows}, ${CONFIG.cellHeight}px)`;
    
    for (let y = 0; y < CONFIG.rows; y++) {
        for (let x = 0; x < CONFIG.cols; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            const coords = document.createElement('span');
            coords.className = 'coords';
            coords.textContent = `${x},${y}`;
            cell.appendChild(coords);
            
            cell.addEventListener('mouseenter', () => {
                hoverX = x;
                hoverY = y;
                updateCoordDisplay(x, y);
            });
            
            cell.addEventListener('mouseleave', () => {
                hoverX = null;
                hoverY = null;
                updateCoordDisplay(null, null);
            });
            
            gridContainer.appendChild(cell);
        }
    }
    
    updateStats();
    updateZoomDisplay();
}

// ===== UPDATE STATS =====
function updateStats() {
    const total = CONFIG.cols * CONFIG.rows;
    statusGrid.textContent = `${CONFIG.cols} × ${CONFIG.rows}`;
    statusCells.textContent = total;
    gridSizeDisplay.textContent = `${CONFIG.cols} × ${CONFIG.rows}`;
}

// ===== COORDINATE DISPLAY =====
function updateCoordDisplay(x, y) {
    const coordText = (x !== null && y !== null) ? `${x}, ${y}` : '—';
    coordDisplay.textContent = `📍 ${coordText}`;
    hoverCoordDisplay.textContent = coordText;
    statusCoord.textContent = coordText;
}

// ===== ZOOM CONTROLS =====
function setZoom(zoom) {
    currentZoom = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, zoom));
    updateZoomDisplay();
    applyZoom();
}

function updateZoomDisplay() {
    const percent = Math.round(currentZoom * 100);
    zoomDisplay.textContent = `🔍 ${percent}%`;
    zoomLevelDisplay.textContent = `${percent}%`;
    statusZoom.textContent = `${percent}%`;
}

function applyZoom() {
    const cells = document.querySelectorAll('.grid-cell');
    const newWidth = CONFIG.cellWidth * currentZoom;
    const newHeight = CONFIG.cellHeight * currentZoom;
    
    gridContainer.style.gridTemplateColumns = `repeat(${CONFIG.cols}, ${newWidth}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${CONFIG.rows}, ${newHeight}px)`;
    
    cells.forEach(cell => {
        cell.style.width = `${newWidth}px`;
        cell.style.height = `${newHeight}px`;
        
        const coords = cell.querySelector('.coords');
        if (coords) {
            const fontSize = Math.max(5, Math.min(10, 8 * currentZoom));
            coords.style.fontSize = `${fontSize}px`;
        }
    });
}

// ===== ZOOM EVENTS =====
document.getElementById('zoomInBtn').addEventListener('click', () => setZoom(currentZoom + 0.1));
document.getElementById('zoomOutBtn').addEventListener('click', () => setZoom(currentZoom - 0.1));

document.getElementById('zoomFitBtn').addEventListener('click', () => {
    const containerRect = gridWrapper.getBoundingClientRect();
    const availableWidth = containerRect.width - 40;
    const availableHeight = containerRect.height - 40;
    
    const fitWidth = availableWidth / (CONFIG.cols * CONFIG.cellWidth);
    const fitHeight = availableHeight / (CONFIG.rows * CONFIG.cellHeight);
    const fitZoom = Math.min(fitWidth, fitHeight, 1.0);
    
    setZoom(Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, fitZoom)));
});

document.getElementById('resetViewBtn').addEventListener('click', () => {
    setZoom(1.0);
    gridWrapper.scrollTo(0, 0);
});

// ===== BACK BUTTON =====
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/map.html';
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom(currentZoom + 0.1);
    }
    if (e.key === '-') {
        e.preventDefault();
        setZoom(currentZoom - 0.1);
    }
    if (e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.option-btn.active').forEach(b => b.classList.remove('active'));
    }
});

// ===== MOUSE WHEEL ZOOM =====
gridWrapper.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom(currentZoom + delta);
    }
}, { passive: false });

// ===== DROPDOWN TOGGLES =====
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.dataset.target;
        const content = document.getElementById(targetId);
        if (content) {
            content.classList.toggle('open');
            toggle.classList.toggle('active');
        }
    });
});

// ===== GRID SIZE OPTIONS =====
document.querySelectorAll('#gridSizeMenu .option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const cols = parseInt(btn.dataset.cols);
        const rows = parseInt(btn.dataset.rows);
        
        document.querySelectorAll('#gridSizeMenu .option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        CONFIG.cols = cols;
        CONFIG.rows = rows;
        buildGrid();
        setZoom(1.0);
        gridWrapper.scrollTo(0, 0);
    });
});

// ===== TOOL BUTTONS =====
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ===== OPTION BUTTONS =====
document.querySelectorAll('.option-btn:not(#gridSizeMenu .option-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Visual feedback
        btn.style.background = 'rgba(212, 167, 74, 0.12)';
        btn.style.borderColor = 'rgba(212, 167, 74, 0.2)';
        setTimeout(() => {
            btn.style.background = '';
            btn.style.borderColor = '';
        }, 300);
    });
});

// ===== ACTION BUTTONS =====
document.querySelector('.action-btn.primary').addEventListener('click', () => {
    showNotification('✅ Apply clicked (UI only)');
});

document.querySelector('.action-btn.secondary').addEventListener('click', () => {
    showNotification('🔄 Reset clicked (UI only)');
});

document.querySelector('.action-btn.danger').addEventListener('click', () => {
    if (confirm('⚠️ Clear all grid content? (UI only)')) {
        showNotification('🗑 Clear All clicked (UI only)');
    }
});

// ===== SAVE/LOAD =====
document.getElementById('saveBtn').addEventListener('click', () => {
    showNotification('💾 Map saved to localStorage!');
});

document.getElementById('loadBtn').addEventListener('click', () => {
    showNotification('📂 Map loaded from localStorage!');
});

// ===== NOTIFICATION =====
function showNotification(message) {
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 28px;
            background: rgba(5, 3, 2, 0.92);
            border: 1px solid rgba(212, 167, 74, 0.1);
            color: var(--gold, #d4a74a);
            font-family: 'Cinzel', serif;
            font-size: 0.7rem;
            letter-spacing: 2px;
            z-index: 1000;
            transition: all 0.4s ease;
            pointer-events: none;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
            opacity: 0;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(-50%) translateY(0)';
    
    clearTimeout(notification._timeout);
    notification._timeout = setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
}

// ===== INITIALIZE =====
function init() {
    console.log('🐺 Winterfell Map Editor - Loading...');
    console.log(`📐 Grid: ${CONFIG.cols} × ${CONFIG.rows}`);
    
    createParticles();
    buildGrid();
    setZoom(1.0);
    
    console.log('✅ Map Editor ready!');
}

document.addEventListener('DOMContentLoaded', init);