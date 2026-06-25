// ============================================
// GRID MANAGER - Grid Rendering & Placement
// ============================================

class GridManager {
    constructor(config) {
        this.cols = config.gridCols || 18;
        this.rows = config.gridRows || 10;
        this.cellWidth = config.cellWidth || 60;
        this.cellHeight = config.cellHeight || 40;
        this.gridData = [];
        this.buildings = [];
        this.container = null;
        this.onCellClick = null;
        this.onCellHover = null;
        
        this.initGrid();
    }
    
    initGrid() {
        this.gridData = [];
        for (let y = 0; y < this.rows; y++) {
            this.gridData[y] = [];
            for (let x = 0; x < this.cols; x++) {
                this.gridData[y][x] = {
                    x: x,
                    y: y,
                    terrain: 'grass',
                    building: null,
                    isBuildable: true
                };
            }
        }
    }
    
    setContainer(container) {
        this.container = container;
        this.render();
    }
    
    render() {
        if (!this.container) return;
        
        // Clear container
        this.container.innerHTML = '';
        
        // Set grid template
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.container.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.container.style.gap = '1px';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        
        // Create cells
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Store reference
                this.gridData[y][x].element = cell;
                
                // Coords label
                const coords = document.createElement('span');
                coords.className = 'coords';
                coords.textContent = `${x},${y}`;
                cell.appendChild(coords);
                
                // Check if building exists
                const building = this.getBuildingAt(x, y);
                if (building) {
                    const buildingData = BUILDINGS[building.type];
                    if (buildingData) {
                        const icon = document.createElement('span');
                        icon.className = 'building-icon';
                        if (building.type === 'castle') {
                            icon.classList.add('castle');
                        }
                        icon.textContent = buildingData.icon;
                        cell.appendChild(icon);
                        cell.classList.add('has-building');
                    }
                }
                
                // Events
                cell.addEventListener('click', () => {
                    if (this.onCellClick) {
                        this.onCellClick(x, y);
                    }
                });
                
                cell.addEventListener('mouseenter', () => {
                    if (this.onCellHover) {
                        this.onCellHover(x, y);
                    }
                });
                
                this.container.appendChild(cell);
            }
        }
    }
    
    getBuildingAt(x, y) {
        return this.buildings.find(b => 
            x >= b.x && x < b.x + b.size.width &&
            y >= b.y && y < b.y + b.size.height
        ) || null;
    }
    
    placeBuilding(type, x, y) {
        const buildingData = BUILDINGS[type];
        if (!buildingData) return false;
        
        const size = buildingData.size;
        
        // Check if can place
        if (!this.canPlace(x, y, size)) return false;
        
        // Add building
        const building = {
            type: type,
            x: x,
            y: y,
            level: 1,
            size: size
        };
        this.buildings.push(building);
        
        // Update grid data
        for (let dy = 0; dy < size.height; dy++) {
            for (let dx = 0; dx < size.width; dx++) {
                const cellX = x + dx;
                const cellY = y + dy;
                if (this.gridData[cellY] && this.gridData[cellY][cellX]) {
                    this.gridData[cellY][cellX].building = building;
                }
            }
        }
        
        this.render();
        return true;
    }
    
    canPlace(x, y, size) {
        // Check bounds
        if (x + size.width > this.cols || y + size.height > this.rows) {
            return false;
        }
        
        // Check if occupied
        for (let dy = 0; dy < size.height; dy++) {
            for (let dx = 0; dx < size.width; dx++) {
                const cellX = x + dx;
                const cellY = y + dy;
                if (this.getBuildingAt(cellX, cellY)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    upgradeBuilding(x, y) {
        const building = this.getBuildingAt(x, y);
        if (!building) return false;
        
        const buildingData = BUILDINGS[building.type];
        if (!buildingData) return false;
        
        if (building.level >= buildingData.maxLevel) {
            return false;
        }
        
        building.level++;
        this.render();
        return true;
    }
    
    getBuildings() {
        return this.buildings;
    }
    
    getCellData(x, y) {
        if (this.gridData[y] && this.gridData[y][x]) {
            return this.gridData[y][x];
        }
        return null;
    }
    
    setOnCellClick(callback) {
        this.onCellClick = callback;
    }
    
    setOnCellHover(callback) {
        this.onCellHover = callback;
    }
}