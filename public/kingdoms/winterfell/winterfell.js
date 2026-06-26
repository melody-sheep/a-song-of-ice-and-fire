// ============================================
// WINTERFELL - Map Editor Logic
// Premium Theme | Full Functionality
// ============================================

// ===== CONFIGURATION =====
let CONFIG = {
    cols: 20,
    rows: 12,
    cellSize: 30,
    zoom: 1.0,
    minZoom: 0.02,
    maxZoom: 3.0,
    terrainEnabled: true,
    autosaveInterval: 5000,
    brushSize: 1
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
let gridManager = null;
let terrainManager = null;
let treeManager = null;
let isTerrainMode = false;
let isEraseMode = false;
let isFreehandMode = false;
let isTreeMode = false;
let isDrawing = false;
let drawStartX = null;
let drawStartY = null;
let autosaveTimer = null;
let lastSaveTime = null;
let currentBrushSize = 1;
let isTreeDragging = false;
let treeDragLastX = null;
let treeDragLastY = null;
let treeBrushPreview = [];

// ============================================
// SNOWFLAKE PARTICLES
// ============================================

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const snowflakeChars = ['❄', '❅', '❆', '✦', '•'];
    const numSnowflakes = 80;
    
    for (let i = 0; i < numSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const char = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        const size = Math.random() * 14 + 6;
        const x = Math.random() * 100;
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 15;
        const opacity = Math.random() * 0.5 + 0.3;
        
        snowflake.textContent = char;
        snowflake.style.cssText = `
            left: ${x}%;
            font-size: ${size}px;
            opacity: ${opacity};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            color: rgba(255, 255, 255, ${opacity});
            text-shadow: 0 0 ${size/2}px rgba(255, 255, 255, 0.1);
            position: absolute;
            pointer-events: none;
            animation: snowfall linear infinite;
        `;
        
        container.appendChild(snowflake);
    }
}

// Add snowflake animation to CSS dynamically
const snowflakeStyle = document.createElement('style');
snowflakeStyle.textContent = `
    @keyframes snowfall {
        0% { opacity: 0; transform: translateY(-10px) rotate(0deg) scale(0.8); }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; transform: translateY(calc(100vh + 50px)) rotate(720deg) scale(0.2); }
    }
`;
document.head.appendChild(snowflakeStyle);

// ===== BUILD GRID =====
function buildGrid() {
    gridContainer.innerHTML = '';
    
    const cellSize = Math.max(2, Math.min(60, CONFIG.cellSize * currentZoom));
    const totalWidth = CONFIG.cols * cellSize;
    const totalHeight = CONFIG.rows * cellSize;
    
    gridContainer.style.gridTemplateColumns = `repeat(${CONFIG.cols}, ${cellSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${CONFIG.rows}, ${cellSize}px)`;
    gridContainer.style.gap = '0';
    gridContainer.style.padding = '0';
    gridContainer.style.width = `${totalWidth}px`;
    gridContainer.style.height = `${totalHeight}px`;
    
    for (let y = 0; y < CONFIG.rows; y++) {
        for (let x = 0; x < CONFIG.cols; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            const coords = document.createElement('span');
            coords.className = 'coords';
            coords.textContent = `${x},${y}`;
            
            if (CONFIG.cols > 50 || CONFIG.rows > 50 || cellSize < 15) {
                coords.style.display = 'none';
            }
            
            cell.appendChild(coords);
            gridContainer.appendChild(cell);
        }
    }
    
    updateStats();
    updateZoomDisplay();
    
    if (gridManager) {
        gridManager.container = gridContainer;
        gridManager.connectToGrid();
    }
    
    if (terrainManager) {
        terrainManager.renderTerrain();
    }
    
    if (treeManager) {
        treeManager.refresh();
    }
}

// ===== UPDATE STATS =====
function updateStats() {
    const total = CONFIG.cols * CONFIG.rows;
    statusGrid.textContent = `${CONFIG.cols} × ${CONFIG.rows}`;
    statusCells.textContent = total.toLocaleString();
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
    const cellSize = Math.max(2, Math.min(60, CONFIG.cellSize * currentZoom));
    const totalWidth = CONFIG.cols * cellSize;
    const totalHeight = CONFIG.rows * cellSize;
    
    gridContainer.style.gridTemplateColumns = `repeat(${CONFIG.cols}, ${cellSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${CONFIG.rows}, ${cellSize}px)`;
    gridContainer.style.width = `${totalWidth}px`;
    gridContainer.style.height = `${totalHeight}px`;
    
    cells.forEach(cell => {
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        
        const coords = cell.querySelector('.coords');
        if (coords) {
            if (cellSize < 15 || CONFIG.cols > 50 || CONFIG.rows > 50) {
                coords.style.display = 'none';
            } else {
                coords.style.display = '';
                const fontSize = Math.max(4, Math.min(8, cellSize * 0.2));
                coords.style.fontSize = `${fontSize}px`;
            }
        }
    });
    
    if (terrainManager) {
        terrainManager.renderTerrain();
    }
    
    if (treeManager) {
        treeManager.refresh();
    }
}

// ===== ZOOM EVENTS =====
document.getElementById('zoomInBtn').addEventListener('click', () => {
    setZoom(currentZoom + (currentZoom * 0.1));
});

document.getElementById('zoomOutBtn').addEventListener('click', () => {
    setZoom(currentZoom - (currentZoom * 0.1));
});

document.getElementById('zoomFitBtn').addEventListener('click', () => {
    const containerRect = gridWrapper.getBoundingClientRect();
    const availableWidth = containerRect.width - 40;
    const availableHeight = containerRect.height - 40;
    
    const fitWidth = availableWidth / (CONFIG.cols * CONFIG.cellSize);
    const fitHeight = availableHeight / (CONFIG.rows * CONFIG.cellSize);
    const fitZoom = Math.min(fitWidth, fitHeight);
    
    setZoom(Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, fitZoom)));
});

document.getElementById('resetViewBtn').addEventListener('click', () => {
    setZoom(1.0);
    gridWrapper.scrollTo(0, 0);
    showNotification('⟲ View reset to default');
});

// ===== BACK BUTTON =====
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/map.html';
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom(currentZoom + (currentZoom * 0.1));
    }
    if (e.key === '-') {
        e.preventDefault();
        setZoom(currentZoom - (currentZoom * 0.1));
    }
    if (e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.option-btn.active').forEach(b => b.classList.remove('active'));
        if (terrainManager) {
            terrainManager.clearTerrain();
            terrainManager.currentTerrain = null;
            isTerrainMode = false;
            isEraseMode = false;
            isFreehandMode = false;
            isTreeMode = false;
            const sideTitle = document.querySelector('.side-title');
            if (sideTitle) sideTitle.textContent = 'CONTROLS';
            gridWrapper.style.cursor = 'crosshair';
            showNotification('🔴 Mode deactivated');
            hideBrushIndicator();
        }
        if (treeManager) {
            treeManager.clearTree();
            treeManager.currentTree = null;
        }
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && hoverX !== null && hoverY !== null) {
        if (terrainManager && terrainManager.hasTerrain(hoverX, hoverY)) {
            terrainManager.removeTerrain(hoverX, hoverY);
            showNotification('🗑 Terrain removed!');
            autoSave();
        }
        if (treeManager) {
            const removed = treeManager.removeTreeAt(hoverX, hoverY);
            if (removed) {
                autoSave();
            }
        }
    }
    if (e.key === '[') {
        currentBrushSize = Math.max(1, currentBrushSize - 1);
        showNotification(`🖌 Brush size: ${currentBrushSize}`);
        updateBrushIndicator();
    }
    if (e.key === ']') {
        currentBrushSize = Math.min(5, currentBrushSize + 1);
        showNotification(`🖌 Brush size: ${currentBrushSize}`);
        updateBrushIndicator();
    }
});

// ===== BRUSH INDICATOR =====
function showBrushIndicator() {
    let indicator = document.querySelector('.brush-size-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'brush-size-indicator';
        document.body.appendChild(indicator);
    }
    indicator.classList.add('show');
    updateBrushIndicator();
}

function updateBrushIndicator() {
    const indicator = document.querySelector('.brush-size-indicator');
    if (indicator) {
        indicator.textContent = `🖌 Brush: ${currentBrushSize}x${currentBrushSize}`;
    }
}

function hideBrushIndicator() {
    const indicator = document.querySelector('.brush-size-indicator');
    if (indicator) {
        indicator.classList.remove('show');
    }
}

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
        
        if (gridManager) {
            gridManager.cols = cols;
            gridManager.rows = rows;
            gridManager.initGrid();
            gridManager.container = gridContainer;
            gridManager.connectToGrid();
        }
        
        if (treeManager) {
            treeManager.refresh();
        }
        
        setTimeout(() => {
            document.getElementById('zoomFitBtn').click();
        }, 100);
        
        autoSave();
    });
});

// ===== TOOL BUTTONS =====
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const toolText = btn.textContent.trim();
        
        isEraseMode = false;
        isFreehandMode = false;
        isTreeMode = false;
        isDrawing = false;
        
        if (toolText.includes('Erase')) {
            isEraseMode = true;
            gridWrapper.style.cursor = 'not-allowed';
            showNotification('🗑 Erase mode: Click or drag to remove terrain/trees');
            updateSideTitle('🗑 ERASE MODE', '#ff6b7a');
            showBrushIndicator();
            
            document.querySelectorAll('#terrainMenu .option-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tree-btn').forEach(b => b.classList.remove('active'));
            if (terrainManager) terrainManager.currentTerrain = null;
            if (treeManager) treeManager.currentTree = null;
            
        } else if (toolText.includes('Paint')) {
            isFreehandMode = true;
            gridWrapper.style.cursor = 'crosshair';
            showNotification('🖌 Freehand mode: Select terrain and click/drag to paint');
            updateSideTitle('🎨 FREEFHAND', '#4fc3f7');
            showBrushIndicator();
            
        } else {
            isFreehandMode = true;
            gridWrapper.style.cursor = 'crosshair';
            updateSideTitle('CONTROLS', '');
            hideBrushIndicator();
        }
    });
});

// ===== UPDATE SIDE TITLE =====
function updateSideTitle(text, color) {
    const sideTitle = document.querySelector('.side-title');
    if (sideTitle) {
        sideTitle.textContent = text;
        if (color) {
            sideTitle.style.color = color;
        } else {
            sideTitle.style.color = '';
        }
    }
}

// ===== OPTION BUTTONS =====
document.querySelectorAll('.option-btn:not(#gridSizeMenu .option-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.closest('#terrainMenu')) {
            return;
        }
        if (btn.closest('#treesMenu')) {
            return;
        }
        
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
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
    if (confirm('🔄 Reset terrain and buildings?')) {
        if (terrainManager) {
            terrainManager.clearAllTerrain();
        }
        if (treeManager) {
            treeManager.clearAllTrees();
        }
        resetModes();
        autoSave();
    }
});

document.querySelector('.action-btn.danger').addEventListener('click', () => {
    if (confirm('⚠️ WARNING: Clear ALL grid content (terrain + trees + buildings)?')) {
        if (terrainManager) {
            terrainManager.clearAllTerrain();
        }
        if (treeManager) {
            treeManager.clearAllTrees();
        }
        if (gridManager) {
            gridManager.buildings = [];
            gridManager.render();
        }
        resetModes();
        autoSave();
        showNotification('🗑 All content cleared!');
    }
});

function resetModes() {
    isTerrainMode = false;
    isEraseMode = false;
    isFreehandMode = false;
    isTreeMode = false;
    isDrawing = false;
    updateSideTitle('CONTROLS', '');
    gridWrapper.style.cursor = 'crosshair';
    hideBrushIndicator();
    document.querySelectorAll('#terrainMenu .option-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tree-btn').forEach(b => b.classList.remove('active'));
    if (terrainManager) terrainManager.currentTerrain = null;
    if (treeManager) treeManager.currentTree = null;
}

// ============================================
// AUTOSAVE SYSTEM
// ============================================

function startAutosave() {
    if (autosaveTimer) {
        clearInterval(autosaveTimer);
    }
    
    autosaveTimer = setInterval(() => {
        autoSave();
    }, CONFIG.autosaveInterval);
    
    console.log(`💾 Autosave started (every ${CONFIG.autosaveInterval/1000}s)`);
}

function autoSave() {
    if (!gridManager || !terrainManager || !treeManager) return;
    
    const gridData = {
        grid: CONFIG,
        buildings: gridManager.getBuildings(),
        terrain: terrainManager.saveTerrain(),
        trees: treeManager.saveTrees(),
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('winterfell_map_data', JSON.stringify(gridData));
        lastSaveTime = new Date();
        updateAutosaveStatus(true);
    } catch (e) {
        console.error('Autosave error:', e);
        updateAutosaveStatus(false);
    }
}

function updateAutosaveStatus(success) {
    const statusItem = document.querySelector('.status-item:last-child');
    if (statusItem) {
        if (success) {
            const time = new Date().toLocaleTimeString();
            statusItem.textContent = `💾 Auto-saved at ${time}`;
            statusItem.style.color = 'rgba(79, 195, 247, 0.5)';
            setTimeout(() => {
                statusItem.textContent = '⚡ Ready';
                statusItem.style.color = 'rgba(255, 255, 255, 0.15)';
            }, 2000);
        }
    }
}

// ===== NOTIFICATION =====
function showNotification(message, type = 'info') {
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
    
    if (type === 'error') {
        notification.style.borderColor = 'rgba(255, 23, 68, 0.3)';
        notification.style.color = '#ff6b7a';
    } else if (type === 'warning') {
        notification.style.borderColor = 'rgba(212, 167, 74, 0.3)';
        notification.style.color = '#d4a74a';
    } else {
        notification.style.borderColor = 'rgba(212, 167, 74, 0.1)';
        notification.style.color = '#d4a74a';
    }
    
    clearTimeout(notification._timeout);
    notification._timeout = setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
}

// ============================================
// TERRAIN INTEGRATION
// ============================================

function setupTerrainHandlers() {
    const terrainButtons = document.querySelectorAll('#terrainMenu .option-btn');
    
    console.log('🎯 Setting up terrain handlers, found:', terrainButtons.length, 'buttons');
    
    terrainButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            isEraseMode = false;
            isTreeMode = false;
            isDrawing = false;
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tree-btn').forEach(b => b.classList.remove('active'));
            if (treeManager) treeManager.currentTree = null;
            
            const terrainLabel = this.textContent.trim();
            console.log('🟩 Terrain clicked:', terrainLabel);
            
            terrainButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (terrainManager && terrainManager.setTerrain(terrainLabel)) {
                isTerrainMode = true;
                isFreehandMode = true;
                showNotification(`🟩 Selected: ${terrainManager.currentTerrain.displayName} - Click and drag to paint`);
                gridWrapper.style.cursor = 'crosshair';
                updateSideTitle(`🎨 ${terrainManager.currentTerrain.displayName}`, '#d4a74a');
                showBrushIndicator();
            } else {
                showNotification('❌ Failed to select terrain', 'error');
            }
        });
    });
}

function setupTerrainGridHandlers() {
    let lastHoverX = null;
    let lastHoverY = null;
    let eraseHoverCells = [];
    let currentPaintCells = [];
    
    console.log('🎯 Setting up terrain grid handlers with freehand support');
    
    function getBrushCells(centerX, centerY, radius) {
        const cells = [];
        const maxCols = gridManager.cols;
        const maxRows = gridManager.rows;
        
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = centerX + dx;
                const y = centerY + dy;
                
                const distance = Math.sqrt(dx*dx + dy*dy);
                if (distance > radius) continue;
                
                if (x >= 0 && x < maxCols && y >= 0 && y < maxRows) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }
    
    gridContainer.addEventListener('mousemove', function(e) {
        const cell = e.target.closest('.grid-cell');
        
        document.querySelectorAll('.grid-cell.hover-highlight').forEach(c => {
            c.classList.remove('hover-highlight');
            if (c.classList.contains('terrain-cell')) {
                c.style.border = 'none';
            } else {
                c.style.border = '1px solid rgba(255, 255, 255, 0.04)';
            }
            c.style.boxShadow = '';
        });
        
        eraseHoverCells.forEach(c => {
            c.style.border = c.classList.contains('terrain-cell') ? 'none' : '1px solid rgba(255, 255, 255, 0.04)';
            c.style.boxShadow = '';
            c.style.backgroundColor = '';
        });
        eraseHoverCells = [];
        
        currentPaintCells.forEach(c => {
            c.classList.remove('terrain-preview');
            if (c.classList.contains('terrain-cell')) {
                c.style.border = 'none';
            } else {
                c.style.border = '1px solid rgba(255, 255, 255, 0.04)';
            }
            c.style.boxShadow = '';
        });
        currentPaintCells = [];
        
        if (!cell) {
            if (terrainManager) terrainManager.clearPreview();
            if (treeManager) treeManager.clearPreview();
            lastHoverX = null;
            lastHoverY = null;
            return;
        }
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        hoverX = x;
        hoverY = y;
        
        if (isEraseMode) {
            const brushCells = getBrushCells(x, y, currentBrushSize - 1);
            brushCells.forEach(({ x: bx, y: by }) => {
                const targetCell = gridContainer.querySelector(`.grid-cell[data-x="${bx}"][data-y="${by}"]`);
                if (targetCell && targetCell.classList.contains('terrain-cell')) {
                    targetCell.style.border = '2px solid #ff1744';
                    targetCell.style.boxShadow = 'inset 0 0 20px rgba(255, 23, 68, 0.3)';
                    targetCell.style.backgroundColor = 'rgba(255, 23, 68, 0.1)';
                    eraseHoverCells.push(targetCell);
                }
            });
            return;
        }
        
        if (isFreehandMode && isTerrainMode && terrainManager && terrainManager.currentTerrain) {
            const brushCells = getBrushCells(x, y, currentBrushSize - 1);
            brushCells.forEach(({ x: bx, y: by }) => {
                const targetCell = gridContainer.querySelector(`.grid-cell[data-x="${bx}"][data-y="${by}"]`);
                if (targetCell && !terrainManager.hasTerrain(bx, by) && !gridManager.getBuildingAt(bx, by)) {
                    targetCell.classList.add('terrain-preview');
                    targetCell.style.border = '2px solid rgba(212, 167, 74, 0.6)';
                    targetCell.style.boxShadow = 'inset 0 0 20px rgba(212, 167, 74, 0.15)';
                    currentPaintCells.push(targetCell);
                }
            });
        }
    });
    
    gridContainer.addEventListener('mouseleave', function() {
        document.querySelectorAll('.grid-cell.hover-highlight').forEach(c => {
            c.classList.remove('hover-highlight');
            if (c.classList.contains('terrain-cell')) {
                c.style.border = 'none';
            } else {
                c.style.border = '1px solid rgba(255, 255, 255, 0.04)';
            }
            c.style.boxShadow = '';
        });
        
        eraseHoverCells.forEach(c => {
            c.style.border = c.classList.contains('terrain-cell') ? 'none' : '1px solid rgba(255, 255, 255, 0.04)';
            c.style.boxShadow = '';
            c.style.backgroundColor = '';
        });
        eraseHoverCells = [];
        
        currentPaintCells.forEach(c => {
            c.classList.remove('terrain-preview');
            if (c.classList.contains('terrain-cell')) {
                c.style.border = 'none';
            } else {
                c.style.border = '1px solid rgba(255, 255, 255, 0.04)';
            }
            c.style.boxShadow = '';
        });
        currentPaintCells = [];
        
        if (terrainManager) {
            terrainManager.clearPreview();
        }
        if (treeManager) {
            treeManager.clearPreview();
        }
        lastHoverX = null;
        lastHoverY = null;
        hoverX = null;
        hoverY = null;
    });
    
    gridContainer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if (terrainManager && terrainManager.hasTerrain(x, y)) {
            terrainManager.removeTerrain(x, y);
            showNotification('🗑 Terrain removed!');
            autoSave();
            return;
        }
        
        if (treeManager) {
            const removed = treeManager.removeTreeAt(x, y);
            if (removed) {
                autoSave();
                return;
            }
        }
    });
    
    gridContainer.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if (isEraseMode) {
            isDrawing = true;
            const brushCells = getBrushCells(x, y, currentBrushSize - 1);
            let removed = 0;
            brushCells.forEach(({ x: bx, y: by }) => {
                if (terrainManager && terrainManager.hasTerrain(bx, by)) {
                    terrainManager.removeTerrain(bx, by);
                    removed++;
                }
                if (treeManager) {
                    treeManager.removeTreeAt(bx, by);
                }
            });
            if (removed > 0) {
                showNotification(`🗑 Removed ${removed} tiles`);
            }
            return;
        }
        
        if (isFreehandMode && isTerrainMode && terrainManager && terrainManager.currentTerrain) {
            isDrawing = true;
            drawStartX = x;
            drawStartY = y;
            
            const brushCells = getBrushCells(x, y, currentBrushSize - 1);
            let placed = 0;
            brushCells.forEach(({ x: bx, y: by }) => {
                if (!terrainManager.hasTerrain(bx, by) && !gridManager.getBuildingAt(bx, by)) {
                    terrainManager.placeSingleTerrain(bx, by);
                    placed++;
                }
            });
            if (placed > 0) {
                autoSave();
            }
        }
    });
    
    gridContainer.addEventListener('mousemove', function(e) {
        if (!isDrawing) return;
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if (isEraseMode) {
            const brushCells = getBrushCells(x, y, currentBrushSize - 1);
            brushCells.forEach(({ x: bx, y: by }) => {
                if (terrainManager && terrainManager.hasTerrain(bx, by)) {
                    terrainManager.removeTerrain(bx, by);
                }
                if (treeManager) {
                    treeManager.removeTreeAt(bx, by);
                }
            });
            return;
        }
        
        if (isFreehandMode && isTerrainMode && terrainManager && terrainManager.currentTerrain) {
            const brushCells = getBrushCells(x, y, currentBrushSize - 1);
            let placed = 0;
            brushCells.forEach(({ x: bx, y: by }) => {
                if (!terrainManager.hasTerrain(bx, by) && !gridManager.getBuildingAt(bx, by)) {
                    terrainManager.placeSingleTerrain(bx, by);
                    placed++;
                }
            });
            if (placed > 0) {
                autoSave();
            }
        }
    });
    
    gridContainer.addEventListener('mouseup', function(e) {
        if (isDrawing) {
            isDrawing = false;
            
            if (isEraseMode || isFreehandMode) {
                setTimeout(autoSave, 100);
            }
        }
    });
    
    gridContainer.addEventListener('click', function(e) {
        if (isDrawing) return;
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if (isTreeMode && treeManager && treeManager.currentTree) {
            return;
        }
        
        if (isFreehandMode && isTerrainMode && terrainManager && terrainManager.currentTerrain) {
            if (gridManager && gridManager.getBuildingAt(x, y)) {
                showNotification('❌ Cannot place terrain on a building!', 'error');
                return;
            }
            
            if (terrainManager.hasTerrain(x, y)) {
                showNotification('❌ Cell already has terrain!', 'error');
                return;
            }
            
            terrainManager.placeSingleTerrain(x, y);
            autoSave();
            return;
        }
        
        if (!isFreehandMode && isTerrainMode && terrainManager && terrainManager.currentTerrain) {
            if (gridManager && gridManager.getBuildingAt(x, y)) {
                showNotification('❌ Cannot place terrain on a building!', 'error');
                return;
            }
            
            terrainManager.placeTerrainWithModal(x, y, 'block');
        }
    });
}

function addTerrainClearButton() {
    const actionsSection = document.querySelector('.actions-section');
    if (actionsSection) {
        if (actionsSection.querySelector('.action-btn.clear-terrain')) return;
        
        const clearBtn = document.createElement('button');
        clearBtn.className = 'action-btn danger clear-terrain';
        clearBtn.textContent = '🗑 Clear Terrain';
        clearBtn.addEventListener('click', () => {
            if (confirm('⚠️ Clear ALL terrain from the map?')) {
                if (terrainManager) {
                    terrainManager.clearAllTerrain();
                    resetModes();
                    autoSave();
                }
            }
        });
        actionsSection.appendChild(clearBtn);
    }
}

// ============================================
// TREE INTEGRATION
// ============================================

function setupTreeHandlers() {
    const treeButtons = document.querySelectorAll('.tree-btn');
    
    console.log('🎯 Setting up tree handlers, found:', treeButtons.length, 'buttons');
    
    treeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            isEraseMode = false;
            isTerrainMode = false;
            isFreehandMode = false;
            isDrawing = false;
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#terrainMenu .option-btn').forEach(b => b.classList.remove('active'));
            if (terrainManager) terrainManager.currentTerrain = null;
            
            const treeId = this.dataset.tree;
            console.log('🌲 Tree clicked:', treeId);
            
            treeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (treeManager && treeManager.setTree(treeId)) {
                isTreeMode = true;
                showNotification(`🌲 Selected: ${treeManager.currentTree.name} - Click on grid to place`);
                gridWrapper.style.cursor = 'crosshair';
                updateSideTitle(`🌲 ${treeManager.currentTree.name}`, '#4fc3f7');
                showBrushIndicator();
            } else {
                showNotification('❌ Failed to select tree', 'error');
            }
        });
    });
}

function setupTreeGridHandlers() {
    let lastHoverX = null;
    let lastHoverY = null;
    
    console.log('🎯 Setting up tree grid handlers');
    
    gridContainer.addEventListener('mousemove', function(e) {
        if (!isTreeMode || !treeManager || !treeManager.currentTree) {
            return;
        }
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) {
            treeManager.clearPreview();
            lastHoverX = null;
            lastHoverY = null;
            return;
        }
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if (x !== lastHoverX || y !== lastHoverY) {
            lastHoverX = x;
            lastHoverY = y;
            
            treeManager.clearPreview();
            treeManager.previewTree(x, y);
        }
    });
    
    gridContainer.addEventListener('mouseleave', function() {
        if (treeManager) {
            treeManager.clearPreview();
        }
        lastHoverX = null;
        lastHoverY = null;
    });
    
    gridContainer.addEventListener('click', function(e) {
        if (!isTreeMode || !treeManager || !treeManager.currentTree) {
            return;
        }
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        console.log(`📍 Tree placement at: ${x}, ${y}`);
        
        if (treeManager.hasTree(x, y)) {
            showNotification('❌ A tree is already rooted here!', 'error');
            return;
        }
        
        treeManager.placeTree(x, y);
        autoSave();
    });
}

// ============================================
// TREE DRAG HANDLERS - Click & Drag to Paint Trees
// ============================================

function setupTreeDragHandlers() {
    console.log('🎯 Setting up tree drag handlers');
    
    let lastPlacedX = null;
    let lastPlacedY = null;
    
    gridContainer.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        if (!isTreeMode || !treeManager || !treeManager.currentTree) return;
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        isTreeDragging = true;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        treeDragLastX = x;
        treeDragLastY = y;
        lastPlacedX = x;
        lastPlacedY = y;
        
        placeTreeAtBrush(x, y);
    });
    
    gridContainer.addEventListener('mousemove', function(e) {
        if (!isTreeDragging || !isTreeMode || !treeManager || !treeManager.currentTree) return;
        
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if (x === lastPlacedX && y === lastPlacedY) return;
        
        placeTreeAtBrush(x, y);
        lastPlacedX = x;
        lastPlacedY = y;
        
        updateTreeBrushPreview(x, y);
    });
    
    gridContainer.addEventListener('mouseup', function(e) {
        if (isTreeDragging) {
            isTreeDragging = false;
            treeDragLastX = null;
            treeDragLastY = null;
            clearTreeBrushPreview();
            
            if (treeManager) {
                autoSave();
            }
        }
    });
    
    gridContainer.addEventListener('mouseleave', function() {
        if (isTreeDragging) {
            isTreeDragging = false;
            treeDragLastX = null;
            treeDragLastY = null;
            clearTreeBrushPreview();
        }
    });
}

function placeTreeAtBrush(x, y) {
    if (!treeManager || !treeManager.currentTree) return;
    
    const radius = currentBrushSize;
    const placed = treeManager.placeTreeBrush(x, y, radius);
    
    if (placed > 0) {
        updateTreeStatus();
    }
}

function updateTreeBrushPreview(x, y) {
    clearTreeBrushPreview();
    
    if (!treeManager || !treeManager.currentTree) return;
    
    const radius = currentBrushSize;
    const maxCols = gridManager.cols;
    const maxRows = gridManager.rows;
    
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const cx = x + dx;
            const cy = y + dy;
            
            const distance = Math.sqrt(dx*dx + dy*dy);
            if (distance > radius) continue;
            
            if (cx < 0 || cx >= maxCols || cy < 0 || cy >= maxRows) continue;
            if (treeManager.hasTree(cx, cy)) continue;
            
            const cell = gridContainer.querySelector(`.grid-cell[data-x="${cx}"][data-y="${cy}"]`);
            if (cell) {
                cell.classList.add('tree-brush-preview');
                cell.style.border = '2px solid rgba(79, 195, 247, 0.6)';
                cell.style.boxShadow = 'inset 0 0 20px rgba(79, 195, 247, 0.2)';
                treeBrushPreview.push(cell);
            }
        }
    }
}

function clearTreeBrushPreview() {
    treeBrushPreview.forEach(cell => {
        cell.classList.remove('tree-brush-preview');
        cell.style.border = '';
        cell.style.boxShadow = '';
    });
    treeBrushPreview = [];
}

function addTreeClearButton() {
    const actionsSection = document.querySelector('.actions-section');
    if (actionsSection) {
        if (actionsSection.querySelector('.action-btn.clear-trees')) return;
        
        const clearTreesBtn = document.createElement('button');
        clearTreesBtn.className = 'action-btn danger clear-trees';
        clearTreesBtn.textContent = '🗑 Clear Trees';
        clearTreesBtn.addEventListener('click', () => {
            if (confirm('⚠️ Clear ALL trees from the map?')) {
                if (treeManager) {
                    treeManager.clearAllTrees();
                    isTreeMode = false;
                    updateSideTitle('CONTROLS', '');
                    autoSave();
                }
            }
        });
        
        const clearTerrainBtn = actionsSection.querySelector('.action-btn.clear-terrain');
        if (clearTerrainBtn) {
            actionsSection.insertBefore(clearTreesBtn, clearTerrainBtn.nextSibling);
        } else {
            actionsSection.appendChild(clearTreesBtn);
        }
    }
}

// ============================================
// UPDATE TREE STATUS
// ============================================

function updateTreeStatus() {
    const statusItem = document.querySelector('.status-item:last-child');
    if (statusItem && treeManager) {
        const count = treeManager.getTreeCount();
        if (count > 0) {
            statusItem.textContent = `🌲 ${count} trees`;
            statusItem.style.color = 'rgba(79, 195, 247, 0.5)';
        } else {
            statusItem.textContent = '⚡ Ready';
            statusItem.style.color = 'rgba(255, 255, 255, 0.15)';
        }
    }
}

// ============================================
// SAVE/LOAD WITH TREES
// ============================================

function saveWithTrees() {
    if (!gridManager || !terrainManager || !treeManager) {
        showNotification('❌ Managers not initialized!', 'error');
        return;
    }
    
    const gridData = {
        grid: CONFIG,
        buildings: gridManager.getBuildings(),
        terrain: terrainManager.saveTerrain(),
        trees: treeManager.saveTrees(),
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('winterfell_map_data', JSON.stringify(gridData));
        showNotification('💾 Map with trees saved!');
    } catch (e) {
        showNotification('❌ Failed to save!', 'error');
        console.error('Save error:', e);
    }
}

function loadWithTrees() {
    if (!gridManager || !terrainManager || !treeManager) {
        showNotification('❌ Managers not initialized!', 'error');
        return false;
    }
    
    try {
        const data = localStorage.getItem('winterfell_map_data');
        if (!data) {
            showNotification('ℹ️ No save data found', 'warning');
            return false;
        }
        
        const parsed = JSON.parse(data);
        
        if (parsed.terrain) {
            terrainManager.loadTerrain(parsed.terrain);
        }
        
        if (parsed.trees) {
            treeManager.loadTrees(parsed.trees);
            showNotification('📂 Trees loaded!');
        }
        
        if (parsed.buildings) {
            // Buildings handled by GridManager
        }
        
        updateTreeStatus();
        
        return true;
    } catch (e) {
        showNotification('❌ Failed to load!', 'error');
        console.error('Load error:', e);
        return false;
    }
}

// ============================================
// INITIALIZE
// ============================================

function init() {
    console.log('🐺 Winterfell Map Editor - Loading...');
    console.log(`📐 Grid: ${CONFIG.cols} × ${CONFIG.rows}`);
    console.log(`🔍 Zoom range: ${CONFIG.minZoom * 100}% - ${CONFIG.maxZoom * 100}%`);
    
    createParticles();
    
    gridManager = new GridManager({
        gridCols: CONFIG.cols,
        gridRows: CONFIG.rows,
        cellSize: CONFIG.cellSize
    });
    
    buildGrid();
    
    gridManager.container = gridContainer;
    gridManager.connectToGrid();
    
    gridManager.getBuildingAt = function(x, y) {
        return this.buildings.find(b => 
            x >= b.x && x < b.x + b.size.width &&
            y >= b.y && y < b.y + b.size.height
        ) || null;
    };
    
    terrainManager = new TerrainManager(gridManager);
    terrainManager.onTerrainPlaced = (count, terrain) => {
        console.log(`🌿 Placed ${count} ${terrain.displayName} tiles`);
        showNotification(`✅ ${count} ${terrain.displayName} tiles placed!`, 'success');
        autoSave();
    };
    
    console.log('✅ TerrainManager initialized');
    
    treeManager = new TreeManager(gridManager);
    treeManager.onTreePlaced = (tree, rootX, rootY) => {
        console.log(`🌲 ${tree.name} placed at (${rootX}, ${rootY})`);
        updateTreeStatus();
        autoSave();
    };
    treeManager.onTreeRemoved = (rootX, rootY) => {
        console.log(`🗑 Tree removed at (${rootX}, ${rootY})`);
        updateTreeStatus();
        autoSave();
    };
    console.log('✅ TreeManager initialized');
    
    setupTerrainHandlers();
    setupTerrainGridHandlers();
    addTerrainClearButton();
    
    setupTreeHandlers();
    setupTreeGridHandlers();
    setupTreeDragHandlers();
    addTreeClearButton();
    
    document.getElementById('saveBtn').addEventListener('click', saveWithTrees);
    document.getElementById('loadBtn').addEventListener('click', loadWithTrees);
    
    setTimeout(() => {
        loadWithTrees();
        setTimeout(updateTreeStatus, 100);
    }, 200);
    
    startAutosave();
    
    setTimeout(() => {
        document.getElementById('zoomFitBtn').click();
    }, 300);
    
    console.log('✅ Map Editor ready with Terrain + Tree + Drag support!');
    console.log('📝 To use terrain: Select terrain → Click/drag to paint');
    console.log('🌲 To use trees: Select tree → Click on grid to place');
    console.log('🌲 Click & drag to paint multiple trees!');
    console.log('🌲 Trees extend beyond their root grid (1x1→2x2, 2x2→3x3, etc.)');
    console.log('🔄 Right-click to remove terrain or trees');
    console.log('⌨️ Delete key to remove under cursor');
    console.log('🖌 Brush size: [ and ] keys to change');
    console.log('💾 Auto-save enabled (every 5 seconds)');
    console.log(`📐 Max grid size: 100x100`);
    console.log(`🔍 Min zoom: ${CONFIG.minZoom * 100}% (1 cell visible)`);
    console.log(`🔍 Max zoom: ${CONFIG.maxZoom * 100}% (full grid view)`);
}

document.addEventListener('DOMContentLoaded', init);