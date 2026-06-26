// ============================================
// TERRAIN MANAGER - Block Placement System
// ============================================

class TerrainManager {
    constructor(gridManager) {
        this.gridManager = gridManager;
        this.terrainData = {};
        this.currentTerrain = null;
        this.previewCells = [];
        this.onTerrainPlaced = null;
        
        this.TERRAIN_MAP = {
            '🟩 Grass': 'grass.png',
            '⬜ Snow': 'snow.png',
            '🟧 Dirt': 'dirt.png',
            '🟤 Mud': 'mud.png',
            '🟦 Water': 'water.png',
            '⬛ Stone': 'stone.png',
            '🟩 Dark Grass': 'grass-dark.png',
            '⬜ Patchy Snow': 'snow-patchy.png',
            '🟨 Sand': 'sand.png',
            '🟫 Forest Floor': 'forest-floor.png',
        };
        
        this.TERRAIN_NAMES = {
            'grass.png': 'Grass',
            'snow.png': 'Snow',
            'dirt.png': 'Dirt',
            'mud.png': 'Mud',
            'water.png': 'Water',
            'stone.png': 'Stone',
            'grass-dark.png': 'Dark Grass',
            'snow-patchy.png': 'Patchy Snow',
            'sand.png': 'Sand',
            'forest-floor.png': 'Forest Floor',
        };
    }
    
    setTerrain(terrainLabel) {
        const imageName = this.TERRAIN_MAP[terrainLabel];
        if (imageName) {
            this.currentTerrain = {
                label: terrainLabel,
                image: imageName,
                displayName: this.TERRAIN_NAMES[imageName] || terrainLabel
            };
            return true;
        }
        return false;
    }
    
    clearTerrain() {
        this.currentTerrain = null;
        this.clearPreview();
    }
    
    getTerrainPath(imageName) {
        return `/kingdoms/winterfell/assets/terrain/${imageName}`;
    }
    
    hasTerrain(x, y) {
        const key = `${x},${y}`;
        return !!this.terrainData[key];
    }
    
    getTerrain(x, y) {
        const key = `${x},${y}`;
        return this.terrainData[key] || null;
    }
    
    removeTerrain(x, y) {
        const key = `${x},${y}`;
        if (this.terrainData[key]) {
            delete this.terrainData[key];
            this.renderTerrain();
            return true;
        }
        return false;
    }
    
    placeSingleTerrain(x, y) {
        if (!this.currentTerrain) return false;
        if (this.hasTerrain(x, y)) return false;
        if (this.gridManager.getBuildingAt(x, y)) return false;
        
        const key = `${x},${y}`;
        this.terrainData[key] = {
            image: this.currentTerrain.image,
            label: this.currentTerrain.label,
            displayName: this.currentTerrain.displayName
        };
        this.renderTerrain();
        
        if (this.onTerrainPlaced) {
            this.onTerrainPlaced(1, this.currentTerrain);
        }
        return true;
    }
    
    getAvailableBlockCells(centerX, centerY, width, height) {
        const cells = [];
        const maxCols = this.gridManager.cols;
        const maxRows = this.gridManager.rows;
        
        let startX = centerX - Math.floor(width / 2);
        let startY = centerY - Math.floor(height / 2);
        
        if (startX < 0) startX = 0;
        if (startY < 0) startY = 0;
        if (startX + width > maxCols) startX = maxCols - width;
        if (startY + height > maxRows) startY = maxRows - height;
        
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const x = startX + dx;
                const y = startY + dy;
                
                if (x >= maxCols || y >= maxRows) continue;
                if (this.hasTerrain(x, y)) continue;
                if (this.gridManager.getBuildingAt(x, y)) continue;
                
                cells.push({ x, y });
            }
        }
        
        return cells;
    }
    
    getAvailableDirectionCells(centerX, centerY, count, direction) {
        const cells = [];
        const maxCols = this.gridManager.cols;
        const maxRows = this.gridManager.rows;
        
        let startX = centerX;
        let startY = centerY;
        
        if (direction === 'right') {
            startX = centerX;
        } else if (direction === 'down') {
            startY = centerY;
        } else if (direction === 'both') {
            startX = centerX;
            startY = centerY;
        }
        
        for (let i = 0; i < count; i++) {
            const x = startX + i;
            const y = startY + i;
            
            if (direction === 'right') {
                if (x >= maxCols) break;
                if (this.hasTerrain(x, centerY)) continue;
                if (this.gridManager.getBuildingAt(x, centerY)) continue;
                cells.push({ x, y: centerY });
            } else if (direction === 'down') {
                if (y >= maxRows) break;
                if (this.hasTerrain(centerX, y)) continue;
                if (this.gridManager.getBuildingAt(centerX, y)) continue;
                cells.push({ x: centerX, y });
            } else {
                if (x >= maxCols || y >= maxRows) break;
                if (this.hasTerrain(x, y)) continue;
                if (this.gridManager.getBuildingAt(x, y)) continue;
                cells.push({ x, y });
            }
        }
        
        return cells;
    }
    
    placeTerrainWithModal(startX, startY, mode = 'block') {
        if (!this.currentTerrain) {
            this.showNotification('⚠️ Select a terrain type from the side panel first!', 'warning');
            return false;
        }
        
        if (startX >= this.gridManager.cols || startY >= this.gridManager.rows) {
            this.showNotification('❌ Invalid position!', 'error');
            return false;
        }
        
        if (this.gridManager.getBuildingAt(startX, startY)) {
            this.showNotification('❌ Cannot place terrain on a building!', 'error');
            return false;
        }
        
        this.showTerrainModal(startX, startY, mode);
        return true;
    }
    
    placeBlockTerrain(centerX, centerY, width, height) {
        if (!this.currentTerrain) return false;
        
        const cells = this.getAvailableBlockCells(centerX, centerY, width, height);
        let placed = 0;
        
        cells.forEach(({ x, y }) => {
            const key = `${x},${y}`;
            this.terrainData[key] = {
                image: this.currentTerrain.image,
                label: this.currentTerrain.label,
                displayName: this.currentTerrain.displayName
            };
            placed++;
        });
        
        if (placed > 0) {
            this.renderTerrain();
            this.showNotification(`✅ Placed ${placed} ${this.currentTerrain.displayName} tiles!`, 'success');
            
            if (this.onTerrainPlaced) {
                this.onTerrainPlaced(placed, this.currentTerrain);
            }
        }
        
        this.clearPreview();
        return placed > 0;
    }
    
    placeDirectionTerrain(startX, startY, count, direction) {
        if (!this.currentTerrain) return false;
        
        const cells = this.getAvailableDirectionCells(startX, startY, count, direction);
        let placed = 0;
        
        cells.forEach(({ x, y }) => {
            const key = `${x},${y}`;
            this.terrainData[key] = {
                image: this.currentTerrain.image,
                label: this.currentTerrain.label,
                displayName: this.currentTerrain.displayName
            };
            placed++;
        });
        
        if (placed > 0) {
            this.renderTerrain();
            this.showNotification(`✅ Placed ${placed} ${this.currentTerrain.displayName} tiles!`, 'success');
            
            if (this.onTerrainPlaced) {
                this.onTerrainPlaced(placed, this.currentTerrain);
            }
        }
        
        this.clearPreview();
        return placed > 0;
    }
    
    renderTerrain() {
        const container = this.gridManager.container;
        if (!container) return;
        
        const cells = container.querySelectorAll('.grid-cell');
        
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            const key = `${x},${y}`;
            
            cell.style.backgroundImage = '';
            cell.style.backgroundSize = '';
            cell.style.backgroundPosition = '';
            cell.style.backgroundRepeat = '';
            cell.style.backgroundColor = '';
            cell.classList.remove('has-terrain');
            cell.classList.remove('terrain-cell');
            
            const coords = cell.querySelector('.coords');
            if (coords) {
                coords.style.display = '';
            }
            
            const terrain = this.terrainData[key];
            if (terrain) {
                cell.style.backgroundImage = `url('${this.getTerrainPath(terrain.image)}')`;
                cell.style.backgroundSize = 'cover';
                cell.style.backgroundPosition = 'center';
                cell.style.backgroundRepeat = 'no-repeat';
                cell.style.backgroundColor = 'transparent';
                cell.classList.add('has-terrain');
                cell.classList.add('terrain-cell');
                cell.style.border = 'none';
                
                if (coords) {
                    coords.style.display = 'none';
                }
            } else {
                cell.style.border = '1px solid rgba(255, 255, 255, 0.04)';
            }
        });
    }
    
    previewBlock(centerX, centerY, width, height) {
        this.clearPreview();
        
        if (!this.currentTerrain) return;
        
        const cells = this.getAvailableBlockCells(centerX, centerY, width, height);
        const container = this.gridManager.container;
        if (!container) return;
        
        cells.forEach(({ x, y }) => {
            const cell = container.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                cell.classList.add('terrain-preview');
                cell.style.border = '2px solid rgba(212, 167, 74, 0.6)';
                cell.style.boxShadow = 'inset 0 0 20px rgba(212, 167, 74, 0.15)';
                this.previewCells.push(cell);
            }
        });
    }
    
    previewDirection(centerX, centerY, count, direction) {
        this.clearPreview();
        
        if (!this.currentTerrain) return;
        
        const cells = this.getAvailableDirectionCells(centerX, centerY, count, direction);
        const container = this.gridManager.container;
        if (!container) return;
        
        cells.forEach(({ x, y }) => {
            const cell = container.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                cell.classList.add('terrain-preview');
                cell.style.border = '2px solid rgba(212, 167, 74, 0.6)';
                cell.style.boxShadow = 'inset 0 0 20px rgba(212, 167, 74, 0.15)';
                this.previewCells.push(cell);
            }
        });
    }
    
    clearPreview() {
        this.previewCells.forEach(cell => {
            cell.classList.remove('terrain-preview');
            if (cell.classList.contains('terrain-cell')) {
                cell.style.border = 'none';
            } else {
                cell.style.border = '1px solid rgba(255, 255, 255, 0.04)';
            }
            cell.style.boxShadow = '';
        });
        this.previewCells = [];
    }
    
    showTerrainModal(startX, startY, mode = 'block') {
        const existingModal = document.querySelector('.terrain-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        const maxSize = Math.min(
            this.gridManager.cols,
            this.gridManager.rows,
            50
        );
        
        const overlay = document.createElement('div');
        overlay.className = 'terrain-modal-overlay';
        overlay.innerHTML = `
            <div class="terrain-modal">
                <div class="terrain-modal-header">
                    <span class="terrain-modal-icon">🟩</span>
                    <span class="terrain-modal-title">Place ${this.currentTerrain.displayName}</span>
                </div>
                
                <div class="terrain-modal-body">
                    <div class="terrain-info">
                        <div class="terrain-info-item">
                            <span class="terrain-info-label">📍 Center:</span>
                            <span class="terrain-info-value">${startX}, ${startY}</span>
                        </div>
                        <div class="terrain-info-item">
                            <span class="terrain-info-label">📐 Terrain:</span>
                            <span class="terrain-info-value">${this.currentTerrain.displayName}</span>
                        </div>
                        <div class="terrain-info-item">
                            <span class="terrain-info-label">📂 Image:</span>
                            <span class="terrain-info-value">${this.currentTerrain.image}</span>
                        </div>
                    </div>
                    
                    <div class="terrain-mode-selector">
                        <button class="terrain-mode-btn active" data-mode="block">📦 Block</button>
                        <button class="terrain-mode-btn" data-mode="row">➡️ Row</button>
                        <button class="terrain-mode-btn" data-mode="column">⬇️ Column</button>
                    </div>
                    
                    <div class="terrain-counter" id="blockControls">
                        <div class="terrain-counter-group">
                            <label class="terrain-counter-label">Width:</label>
                            <div class="terrain-counter-controls">
                                <button class="terrain-counter-btn" data-target="blockWidth">−</button>
                                <input type="number" class="terrain-counter-input" id="blockWidth" 
                                       value="5" min="1" max="${maxSize}">
                                <button class="terrain-counter-btn" data-target="blockWidth">＋</button>
                            </div>
                        </div>
                        <div class="terrain-counter-group">
                            <label class="terrain-counter-label">Height:</label>
                            <div class="terrain-counter-controls">
                                <button class="terrain-counter-btn" data-target="blockHeight">−</button>
                                <input type="number" class="terrain-counter-input" id="blockHeight" 
                                       value="5" min="1" max="${maxSize}">
                                <button class="terrain-counter-btn" data-target="blockHeight">＋</button>
                            </div>
                        </div>
                        <div class="terrain-counter-hint" id="blockTotal">Total: 25 cells</div>
                    </div>
                    
                    <div class="terrain-counter" id="directionControls" style="display:none;">
                        <div class="terrain-counter-group">
                            <label class="terrain-counter-label">Length:</label>
                            <div class="terrain-counter-controls">
                                <button class="terrain-counter-btn" data-target="directionLength">−</button>
                                <input type="number" class="terrain-counter-input" id="directionLength" 
                                       value="5" min="1" max="${maxSize * 2}">
                                <button class="terrain-counter-btn" data-target="directionLength">＋</button>
                            </div>
                        </div>
                        <div class="terrain-counter-hint" id="directionTotal">Total: 5 cells</div>
                    </div>
                    
                    <div class="terrain-preview-info">
                        <span id="terrainPreviewCount">25</span> cells will be placed
                    </div>
                </div>
                
                <div class="terrain-modal-footer">
                    <button class="terrain-modal-btn cancel" id="terrainCancelBtn">CANCEL</button>
                    <button class="terrain-modal-btn confirm" id="terrainConfirmBtn">✅ PLACE</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.dataset.startX = startX;
        overlay.dataset.startY = startY;
        overlay.dataset.mode = mode;
        
        const modeBtns = overlay.querySelectorAll('.terrain-mode-btn');
        const blockControls = overlay.querySelector('#blockControls');
        const directionControls = overlay.querySelector('#directionControls');
        const blockWidth = overlay.querySelector('#blockWidth');
        const blockHeight = overlay.querySelector('#blockHeight');
        const directionLength = overlay.querySelector('#directionLength');
        const blockTotal = overlay.querySelector('#blockTotal');
        const directionTotal = overlay.querySelector('#directionTotal');
        const previewInfo = overlay.querySelector('#terrainPreviewCount');
        const cancelBtn = overlay.querySelector('#terrainCancelBtn');
        const confirmBtn = overlay.querySelector('#terrainConfirmBtn');
        
        let currentMode = 'block';
        
        const updatePreview = () => {
            const x = parseInt(overlay.dataset.startX);
            const y = parseInt(overlay.dataset.startY);
            
            this.clearPreview();
            
            if (currentMode === 'block') {
                const w = parseInt(blockWidth.value) || 1;
                const h = parseInt(blockHeight.value) || 1;
                const total = w * h;
                previewInfo.textContent = total;
                blockTotal.textContent = `Total: ${total} cells`;
                this.previewBlock(x, y, w, h);
            } else if (currentMode === 'row') {
                const len = parseInt(directionLength.value) || 1;
                previewInfo.textContent = len;
                directionTotal.textContent = `Total: ${len} cells`;
                this.previewDirection(x, y, len, 'right');
            } else if (currentMode === 'column') {
                const len = parseInt(directionLength.value) || 1;
                previewInfo.textContent = len;
                directionTotal.textContent = `Total: ${len} cells`;
                this.previewDirection(x, y, len, 'down');
            }
        };
        
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                
                if (currentMode === 'block') {
                    blockControls.style.display = 'block';
                    directionControls.style.display = 'none';
                } else {
                    blockControls.style.display = 'none';
                    directionControls.style.display = 'block';
                }
                
                updatePreview();
            });
        });
        
        const setupCounter = (inputId) => {
            const input = overlay.querySelector(`#${inputId}`);
            const btns = overlay.querySelectorAll(`[data-target="${inputId}"]`);
            
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    let val = parseInt(input.value) || 1;
                    const max = parseInt(input.max) || 100;
                    if (btn.textContent === '−') {
                        val = Math.max(1, val - 1);
                    } else {
                        val = Math.min(max, val + 1);
                    }
                    input.value = val;
                    updatePreview();
                });
            });
            
            input.addEventListener('change', () => {
                let val = parseInt(input.value) || 1;
                const max = parseInt(input.max) || 100;
                val = Math.max(1, Math.min(max, val));
                input.value = val;
                updatePreview();
            });
            
            input.addEventListener('input', updatePreview);
        };
        
        setupCounter('blockWidth');
        setupCounter('blockHeight');
        setupCounter('directionLength');
        
        const closeModal = () => {
            this.clearPreview();
            overlay.remove();
        };
        
        cancelBtn.addEventListener('click', closeModal);
        
        confirmBtn.addEventListener('click', () => {
            const x = parseInt(overlay.dataset.startX);
            const y = parseInt(overlay.dataset.startY);
            
            if (currentMode === 'block') {
                const w = parseInt(blockWidth.value) || 1;
                const h = parseInt(blockHeight.value) || 1;
                this.placeBlockTerrain(x, y, w, h);
            } else if (currentMode === 'row') {
                const len = parseInt(directionLength.value) || 1;
                this.placeDirectionTerrain(x, y, len, 'right');
            } else if (currentMode === 'column') {
                const len = parseInt(directionLength.value) || 1;
                this.placeDirectionTerrain(x, y, len, 'down');
            }
            
            closeModal();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
        
        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', keyHandler);
            }
            if (e.key === 'Enter') {
                confirmBtn.click();
                document.removeEventListener('keydown', keyHandler);
            }
        };
        document.addEventListener('keydown', keyHandler);
        
        setTimeout(updatePreview, 50);
    }
    
    showNotification(message, type = 'info') {
        const existing = document.querySelector('.terrain-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `terrain-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            padding: 12px 28px;
            background: rgba(5, 3, 2, 0.95);
            border: 1px solid ${type === 'error' ? 'rgba(255, 23, 68, 0.3)' : 
                                  type === 'warning' ? 'rgba(212, 167, 74, 0.3)' : 
                                  'rgba(79, 195, 247, 0.3)'};
            color: ${type === 'error' ? '#ff6b7a' : 
                    type === 'warning' ? '#d4a74a' : 
                    '#4fc3f7'};
            font-family: 'Cinzel', serif;
            font-size: 0.7rem;
            letter-spacing: 2px;
            z-index: 99999;
            transition: all 0.4s ease;
            pointer-events: none;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
            opacity: 0;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
    
    saveTerrain() {
        return JSON.stringify(this.terrainData);
    }
    
    loadTerrain(data) {
        try {
            this.terrainData = JSON.parse(data);
            this.renderTerrain();
            return true;
        } catch (e) {
            console.error('Failed to load terrain data:', e);
            return false;
        }
    }
    
    clearAllTerrain() {
        if (Object.keys(this.terrainData).length === 0) {
            this.showNotification('ℹ️ No terrain to clear', 'warning');
            return;
        }
        this.terrainData = {};
        this.renderTerrain();
        this.showNotification('🗑 All terrain cleared!', 'warning');
    }
}