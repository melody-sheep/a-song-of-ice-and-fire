// ============================================
// WINTERFELL MAP STUDIO - Canvas Engine
// ============================================

// ===== CONFIGURATION =====
const CONFIG = {
    cols: 18,
    rows: 10,
    cellWidth: 60,
    cellHeight: 40,
    minZoom: 0.3,
    maxZoom: 3.0,
    defaultZoom: 1.0,
    gridColor: 'rgba(255,255,255,0.06)',
    gridColorHover: 'rgba(79,195,247,0.15)',
    gridColorSelected: 'rgba(79,195,247,0.25)',
};

// ===== STATE =====
let state = {
    zoom: 1.0,
    panX: 0,
    panY: 0,
    selectedTool: 'paint',
    selectedAsset: null,
    selectedCell: null,
    hoverCell: null,
    mapData: {
        cells: {},
        trees: {},
        buildings: {},
        decorations: {}
    },
    gridVisible: true,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartPanX: 0,
    dragStartPanY: 0,
};

// ===== ASSET DEFINITIONS =====
const ASSETS = {
    terrain: [
        { id: 'grass', name: 'Grass', icon: '🟩', color: '#3a7a3a' },
        { id: 'grass-dark', name: 'Dark Grass', icon: '🟫', color: '#2a5a2a' },
        { id: 'snow', name: 'Snow', icon: '⬜', color: '#e8eaf0' },
        { id: 'snow-patchy', name: 'Patchy Snow', icon: '◽', color: '#c8d0d8' },
        { id: 'dirt', name: 'Dirt', icon: '🟧', color: '#8a7a5a' },
        { id: 'mud', name: 'Mud', icon: '🟤', color: '#5a4a3a' },
        { id: 'water', name: 'Water', icon: '🟦', color: '#2a5a7a' },
        { id: 'stone', name: 'Stone', icon: '⬜', color: '#6a6a6a' },
    ],
    trees: [
        { id: 'pine-snow', name: 'Snow Pine', icon: '🌲', size: 1 },
        { id: 'pine-dark', name: 'Dark Pine', icon: '🌲', size: 1 },
        { id: 'pine-dead', name: 'Dead Pine', icon: '🌲', size: 1 },
        { id: 'oak-winter', name: 'Winter Oak', icon: '🌳', size: 1 },
        { id: 'forest-cluster', name: 'Forest Cluster', icon: '🌲', size: 2 },
    ],
    buildings: [
        { id: 'castle', name: 'Castle', icon: '🏰', size: 2 },
        { id: 'house-stone', name: 'Stone House', icon: '🏠', size: 1 },
        { id: 'house-wood', name: 'Wood House', icon: '🏡', size: 1 },
        { id: 'farm', name: 'Farm', icon: '🌾', size: 2 },
        { id: 'barracks', name: 'Barracks', icon: '⚔', size: 2 },
        { id: 'wall-straight', name: 'Wall', icon: '🧱', size: 1 },
        { id: 'wall-tower', name: 'Wall Tower', icon: '🗼', size: 1 },
    ],
    decorations: [
        { id: 'rock-01', name: 'Rock', icon: '🪨', size: 1 },
        { id: 'rock-02', name: 'Large Rock', icon: '🪨', size: 1 },
        { id: 'snow-patch', name: 'Snow Patch', icon: '❄', size: 1 },
        { id: 'campfire', name: 'Campfire', icon: '🔥', size: 1 },
        { id: 'raven', name: 'Raven', icon: '🐦', size: 1 },
    ]
};

// ===== DOM REFERENCES =====
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const canvasWrapper = document.getElementById('canvasWrapper');
const gridOverlay = document.getElementById('gridOverlay');
const coordDisplay = document.getElementById('coordDisplay');
const zoomDisplay = document.getElementById('zoomDisplay');

// ===== INITIALIZATION =====
function init() {
    console.log('🏰 Winterfell Map Studio - Loading...');
    setupCanvas();
    setupAssets();
    setupTools();
    setupShortcuts();
    render();
    updateStats();
    showNotification('🗺 Map Studio ready! Select an asset and click the canvas.');
}

// ===== CANVAS SETUP =====
function setupCanvas() {
    const rect = canvasWrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    ctx.scale(dpr, dpr);
    
    // Center the map initially
    const totalWidth = CONFIG.cols * CONFIG.cellWidth;
    const totalHeight = CONFIG.rows * CONFIG.cellHeight;
    state.panX = (rect.width - totalWidth) / 2;
    state.panY = (rect.height - totalHeight) / 2;
    
    // Mouse events
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('wheel', onWheel);
    
    // Window resize
    window.addEventListener('resize', () => {
        setupCanvas();
        render();
    });
}

// ===== RENDER ENGINE =====
function render() {
    const rect = canvasWrapper.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Calculate visible area
    const totalWidth = CONFIG.cols * CONFIG.cellWidth * state.zoom;
    const totalHeight = CONFIG.rows * CONFIG.cellHeight * state.zoom;
    
    // Draw terrain
    drawTerrain(rect);
    
    // Draw trees
    drawTrees(rect);
    
    // Draw buildings
    drawBuildings(rect);
    
    // Draw decorations
    drawDecorations(rect);
    
    // Draw grid
    if (state.gridVisible) {
        drawGrid(rect);
    }
    
    // Draw hover highlight
    if (state.hoverCell) {
        drawHoverHighlight(rect);
    }
    
    // Draw selected highlight
    if (state.selectedCell) {
        drawSelectedHighlight(rect);
    }
}

function drawTerrain(rect) {
    const { cols, rows, cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const key = `${x},${y}`;
            const cell = state.mapData.cells[key];
            const terrainId = cell ? cell.terrain : 'grass';
            const asset = ASSETS.terrain.find(t => t.id === terrainId) || ASSETS.terrain[0];
            
            const px = state.panX + x * cellWidth * zoom;
            const py = state.panY + y * cellHeight * zoom;
            const w = cellWidth * zoom;
            const h = cellHeight * zoom;
            
            // Draw terrain color
            ctx.fillStyle = asset.color;
            ctx.fillRect(px, py, w, h);
            
            // Draw subtle border
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(px, py, w, h);
        }
    }
}

function drawTrees(rect) {
    const { cols, rows, cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    
    for (const [key, treeData] of Object.entries(state.mapData.trees)) {
        const [x, y] = key.split(',').map(Number);
        const asset = ASSETS.trees.find(t => t.id === treeData.type);
        if (!asset) continue;
        
        const px = state.panX + (x + 0.5) * cellWidth * zoom;
        const py = state.panY + (y + 0.5) * cellHeight * zoom;
        const size = 40 * zoom * (asset.size || 1);
        
        // Draw tree as icon
        ctx.font = `${size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(asset.icon, px, py);
    }
}

function drawBuildings(rect) {
    const { cols, rows, cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    
    for (const [key, buildingData] of Object.entries(state.mapData.buildings)) {
        const [x, y] = key.split(',').map(Number);
        const asset = ASSETS.buildings.find(t => t.id === buildingData.type);
        if (!asset) continue;
        
        const size = asset.size || 1;
        const px = state.panX + x * cellWidth * zoom;
        const py = state.panY + y * cellHeight * zoom;
        const w = cellWidth * zoom * size;
        const h = cellHeight * zoom * size;
        
        // Draw building as icon
        const iconSize = Math.min(w, h) * 0.7;
        ctx.font = `${iconSize}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(asset.icon, px + w/2, py + h/2);
    }
}

function drawDecorations(rect) {
    const { cols, rows, cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    
    for (const [key, decoData] of Object.entries(state.mapData.decorations)) {
        const [x, y] = key.split(',').map(Number);
        const asset = ASSETS.decorations.find(t => t.id === decoData.type);
        if (!asset) continue;
        
        const px = state.panX + (x + 0.5) * cellWidth * zoom;
        const py = state.panY + (y + 0.5) * cellHeight * zoom;
        const size = 24 * zoom;
        
        ctx.font = `${size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(asset.icon, px, py);
    }
}

function drawGrid(rect) {
    const { cols, rows, cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    
    ctx.strokeStyle = CONFIG.gridColor;
    ctx.lineWidth = 0.5;
    
    for (let y = 0; y <= rows; y++) {
        const py = state.panY + y * cellHeight * zoom;
        ctx.beginPath();
        ctx.moveTo(state.panX, py);
        ctx.lineTo(state.panX + cols * cellWidth * zoom, py);
        ctx.stroke();
    }
    
    for (let x = 0; x <= cols; x++) {
        const px = state.panX + x * cellWidth * zoom;
        ctx.beginPath();
        ctx.moveTo(px, state.panY);
        ctx.lineTo(px, state.panY + rows * cellHeight * zoom);
        ctx.stroke();
    }
    
    // Draw coordinate labels
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    for (let x = 0; x < cols; x++) {
        const px = state.panX + (x + 0.5) * cellWidth * zoom;
        ctx.fillText(x, px, state.panY - 2);
    }
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = 0; y < rows; y++) {
        const py = state.panY + (y + 0.5) * cellHeight * zoom;
        ctx.fillText(y, state.panX - 4, py);
    }
}

function drawHoverHighlight(rect) {
    const { cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    const { x, y } = state.hoverCell;
    
    const px = state.panX + x * cellWidth * zoom;
    const py = state.panY + y * cellHeight * zoom;
    const w = cellWidth * zoom;
    const h = cellHeight * zoom;
    
    ctx.fillStyle = CONFIG.gridColorHover;
    ctx.fillRect(px, py, w, h);
    
    ctx.strokeStyle = 'rgba(79,195,247,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, w, h);
}

function drawSelectedHighlight(rect) {
    const { cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    const { x, y } = state.selectedCell;
    
    const px = state.panX + x * cellWidth * zoom;
    const py = state.panY + y * cellHeight * zoom;
    const w = cellWidth * zoom;
    const h = cellHeight * zoom;
    
    ctx.fillStyle = CONFIG.gridColorSelected;
    ctx.fillRect(px, py, w, h);
    
    ctx.strokeStyle = 'rgba(79,195,247,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, w, h);
}

// ===== ASSET SETUP =====
function setupAssets() {
    const grids = {
        terrainGrid: ASSETS.terrain,
        treeGrid: ASSETS.trees,
        buildingGrid: ASSETS.buildings,
        decoGrid: ASSETS.decorations
    };
    
    for (const [gridId, assets] of Object.entries(grids)) {
        const container = document.getElementById(gridId);
        if (!container) continue;
        container.innerHTML = '';
        
        assets.forEach(asset => {
            const btn = document.createElement('button');
            btn.className = 'asset-btn';
            btn.dataset.assetId = asset.id;
            btn.dataset.assetCategory = gridId.replace('Grid', '');
            btn.innerHTML = `
                <span class="asset-icon">${asset.icon}</span>
                <span class="asset-name">${asset.name}</span>
            `;
            btn.addEventListener('click', () => selectAsset(asset.id, gridId.replace('Grid', '')));
            container.appendChild(btn);
        });
    }
}

function selectAsset(assetId, category) {
    state.selectedAsset = { id: assetId, category: category };
    
    // Update UI
    document.querySelectorAll('.asset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.assetId === assetId);
    });
    
    const asset = getAssetById(assetId, category);
    if (asset) {
        showNotification(`🎨 Selected: ${asset.name} (${category})`);
    }
}

function getAssetById(id, category) {
    const list = ASSETS[category] || [];
    return list.find(a => a.id === id);
}

// ===== TOOLS =====
function setupTools() {
    const tools = ['paint', 'tree', 'building', 'deco', 'erase', 'select'];
    
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tool = btn.dataset.tool;
            state.selectedTool = tool;
            
            document.querySelectorAll('.tool-btn[data-tool]').forEach(b => {
                b.classList.toggle('active', b.dataset.tool === tool);
            });
            
            showNotification(`🛠 Tool: ${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
        });
    });
    
    // Grid toggle
    document.getElementById('gridToggle').addEventListener('click', () => {
        state.gridVisible = !state.gridVisible;
        render();
        showNotification(state.gridVisible ? '⊞ Grid visible' : '⊟ Grid hidden');
    });
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => zoom(0.2));
    document.getElementById('zoomOut').addEventListener('click', () => zoom(-0.2));
    document.getElementById('zoomReset').addEventListener('click', () => {
        state.zoom = CONFIG.defaultZoom;
        updateZoomDisplay();
        render();
        showNotification('⟲ Zoom reset');
    });
    
    // Save/Load/Export/Reset
    document.getElementById('saveBtn').addEventListener('click', saveMap);
    document.getElementById('loadBtn').addEventListener('click', loadMap);
    document.getElementById('exportBtn').addEventListener('click', exportMap);
    document.getElementById('resetBtn').addEventListener('click', resetMap);
    document.getElementById('helpBtn').addEventListener('click', showHelp);
    document.getElementById('closeBtn').addEventListener('click', () => {
        window.location.href = '/map.html';
    });
}

// ===== MOUSE EVENTS =====
function onMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if we clicked a cell
    const cell = getCellAt(x, y);
    if (cell) {
        handleCellAction(cell.x, cell.y);
    }
    
    // Start dragging for pan
    state.isDragging = true;
    state.dragStartX = x;
    state.dragStartY = y;
    state.dragStartPanX = state.panX;
    state.dragStartPanY = state.panY;
}

function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update hover
    const cell = getCellAt(x, y);
    state.hoverCell = cell;
    
    if (cell) {
        coordDisplay.textContent = `📍 ${cell.x}, ${cell.y}`;
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'crosshair';
    }
    
    // Handle dragging
    if (state.isDragging) {
        const dx = x - state.dragStartX;
        const dy = y - state.dragStartY;
        state.panX = state.dragStartPanX + dx;
        state.panY = state.dragStartPanY + dy;
    }
    
    render();
}

function onMouseUp(e) {
    state.isDragging = false;
}

function onMouseLeave(e) {
    state.hoverCell = null;
    coordDisplay.textContent = '📍 - , -';
    render();
}

function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoom(delta);
}

function getCellAt(screenX, screenY) {
    const { cols, rows, cellWidth, cellHeight } = CONFIG;
    const zoom = state.zoom;
    
    const relX = (screenX - state.panX) / (cellWidth * zoom);
    const relY = (screenY - state.panY) / (cellHeight * zoom);
    
    const cellX = Math.floor(relX);
    const cellY = Math.floor(relY);
    
    if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
        return { x: cellX, y: cellY };
    }
    return null;
}

// ===== CELL ACTIONS =====
function handleCellAction(x, y) {
    const key = `${x},${y}`;
    const tool = state.selectedTool;
    const asset = state.selectedAsset;
    
    switch (tool) {
        case 'paint':
            if (asset && asset.category === 'terrain') {
                if (!state.mapData.cells[key]) {
                    state.mapData.cells[key] = {};
                }
                state.mapData.cells[key].terrain = asset.id;
                render();
                updateStats();
                showNotification(`🟫 Painted ${getAssetById(asset.id, 'terrain').name} at (${x}, ${y})`);
            }
            break;
            
        case 'tree':
            if (asset && asset.category === 'trees') {
                if (!state.mapData.trees[key]) {
                    state.mapData.trees[key] = { type: asset.id };
                    render();
                    updateStats();
                    showNotification(`🌲 Placed ${getAssetById(asset.id, 'trees').name} at (${x}, ${y})`);
                } else {
                    showNotification('⚠️ A tree already exists here!');
                }
            }
            break;
            
        case 'building':
            if (asset && asset.category === 'buildings') {
                if (!state.mapData.buildings[key]) {
                    state.mapData.buildings[key] = { type: asset.id, level: 1 };
                    render();
                    updateStats();
                    showNotification(`🏰 Placed ${getAssetById(asset.id, 'buildings').name} at (${x}, ${y})`);
                } else {
                    showNotification('⚠️ A building already exists here!');
                }
            }
            break;
            
        case 'deco':
            if (asset && asset.category === 'decorations') {
                if (!state.mapData.decorations[key]) {
                    state.mapData.decorations[key] = { type: asset.id };
                    render();
                    updateStats();
                    showNotification(`🎨 Placed ${getAssetById(asset.id, 'decorations').name} at (${x}, ${y})`);
                } else {
                    showNotification('⚠️ A decoration already exists here!');
                }
            }
            break;
            
        case 'erase':
            if (state.mapData.trees[key]) {
                delete state.mapData.trees[key];
                render();
                updateStats();
                showNotification(`🗑 Removed tree at (${x}, ${y})`);
            } else if (state.mapData.buildings[key]) {
                delete state.mapData.buildings[key];
                render();
                updateStats();
                showNotification(`🗑 Removed building at (${x}, ${y})`);
            } else if (state.mapData.decorations[key]) {
                delete state.mapData.decorations[key];
                render();
                updateStats();
                showNotification(`🗑 Removed decoration at (${x}, ${y})`);
            } else if (state.mapData.cells[key]) {
                delete state.mapData.cells[key];
                render();
                updateStats();
                showNotification(`🗑 Reset terrain at (${x}, ${y})`);
            } else {
                showNotification('⚠️ Nothing to erase here');
            }
            break;
            
        case 'select':
            state.selectedCell = { x, y };
            showCellInfo(x, y);
            render();
            break;
    }
}

// ===== CELL INFO =====
function showCellInfo(x, y) {
    const key = `${x},${y}`;
    const cell = state.mapData.cells[key];
    const tree = state.mapData.trees[key];
    const building = state.mapData.buildings[key];
    const deco = state.mapData.decorations[key];
    
    const info = document.getElementById('selectedInfo');
    let html = `<div class="cell-info"><div class="cell-coords">📍 ${x}, ${y}</div>`;
    
    if (cell && cell.terrain) {
        const asset = ASSETS.terrain.find(t => t.id === cell.terrain);
        html += `<div class="cell-prop">🟫 Terrain: ${asset ? asset.name : cell.terrain}</div>`;
    }
    if (tree) {
        const asset = ASSETS.trees.find(t => t.id === tree.type);
        html += `<div class="cell-prop">🌲 Tree: ${asset ? asset.name : tree.type}</div>`;
    }
    if (building) {
        const asset = ASSETS.buildings.find(t => t.id === building.type);
        html += `<div class="cell-prop">🏰 Building: ${asset ? asset.name : building.type} (Lv.${building.level})</div>`;
    }
    if (deco) {
        const asset = ASSETS.decorations.find(t => t.id === deco.type);
        html += `<div class="cell-prop">🎨 Decoration: ${asset ? asset.name : deco.type}</div>`;
    }
    if (!cell && !tree && !building && !deco) {
        html += `<div class="cell-prop" style="color:rgba(255,255,255,0.15);">Empty</div>`;
    }
    
    html += '</div>';
    info.innerHTML = html;
}

// ===== ZOOM =====
function zoom(delta) {
    const newZoom = state.zoom + delta;
    state.zoom = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, newZoom));
    updateZoomDisplay();
    render();
}

function updateZoomDisplay() {
    zoomDisplay.textContent = `🔍 ${Math.round(state.zoom * 100)}%`;
}

// ===== SAVE / LOAD / EXPORT / RESET =====
function saveMap() {
    try {
        localStorage.setItem('winterfell_map', JSON.stringify(state.mapData));
        showNotification('💾 Map saved to localStorage!');
    } catch (e) {
        showNotification('❌ Failed to save map');
        console.error(e);
    }
}

function loadMap() {
    try {
        const data = localStorage.getItem('winterfell_map');
        if (data) {
            state.mapData = JSON.parse(data);
            render();
            updateStats();
            showNotification('📂 Map loaded from localStorage!');
        } else {
            showNotification('⚠️ No saved map found');
        }
    } catch (e) {
        showNotification('❌ Failed to load map');
        console.error(e);
    }
}

function exportMap() {
    const data = JSON.stringify(state.mapData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'winterfell_map.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('📤 Map exported as JSON!');
}

function resetMap() {
    if (confirm('⚠️ Reset the entire map? This cannot be undone!')) {
        state.mapData = { cells: {}, trees: {}, buildings: {}, decorations: {} };
        state.selectedCell = null;
        render();
        updateStats();
        document.getElementById('selectedInfo').innerHTML = '<p class="info-placeholder">Click a cell to inspect</p>';
        showNotification('🔄 Map reset to blank');
    }
}

// ===== STATS =====
function updateStats() {
    const treeCount = Object.keys(state.mapData.trees).length;
    const buildingCount = Object.keys(state.mapData.buildings).length;
    const decoCount = Object.keys(state.mapData.decorations).length;
    
    document.getElementById('statTrees').textContent = treeCount;
    document.getElementById('statBuildings').textContent = buildingCount;
    document.getElementById('statDecos').textContent = decoCount;
}

// ===== SHORTCUTS =====
function setupShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Tool shortcuts (1-6)
        const toolMap = {
            '1': 'paint',
            '2': 'tree',
            '3': 'building',
            '4': 'deco',
            '5': 'erase',
            '6': 'select'
        };
        
        if (e.key in toolMap) {
            const tool = toolMap[e.key];
            state.selectedTool = tool;
            document.querySelectorAll('.tool-btn[data-tool]').forEach(b => {
                b.classList.toggle('active', b.dataset.tool === tool);
            });
            showNotification(`🛠 Tool: ${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
            e.preventDefault();
        }
        
        // Grid toggle
        if (e.key === 'g' || e.key === 'G') {
            state.gridVisible = !state.gridVisible;
            render();
            showNotification(state.gridVisible ? '⊞ Grid visible' : '⊟ Grid hidden');
            e.preventDefault();
        }
        
        // Zoom
        if (e.key === 'z' || e.key === 'Z') {
            zoom(0.1);
            e.preventDefault();
        }
        if (e.key === 'x' || e.key === 'X') {
            zoom(-0.1);
            e.preventDefault();
        }
        
        // Save
        if (e.key === 's' || e.key === 'S') {
            saveMap();
            e.preventDefault();
        }
        
        // Reset view
        if (e.key === 'r' || e.key === 'R') {
            state.zoom = CONFIG.defaultZoom;
            updateZoomDisplay();
            render();
            showNotification('⟲ View reset');
            e.preventDefault();
        }
        
        // Escape - deselect
        if (e.key === 'Escape') {
            state.selectedCell = null;
            document.getElementById('selectedInfo').innerHTML = '<p class="info-placeholder">Click a cell to inspect</p>';
            render();
            e.preventDefault();
        }
    });
}

// ===== HELP =====
function showHelp() {
    showNotification('📖 Press 1-6 for tools | G=Grid | Z/X=Zoom | S=Save | ESC=Deselect');
}

// ===== NOTIFICATION =====
function showNotification(message) {
    const el = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    text.textContent = message;
    el.classList.remove('hidden');
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
    
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => {
            el.classList.add('hidden');
        }, 400);
    }, 2500);
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);