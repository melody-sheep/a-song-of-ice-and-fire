// ============================================
// GRID MANAGER - Grid Rendering & Placement
// ============================================

class GridManager {
    constructor(config) {
        this.cols = config.gridCols || 20;
        this.rows = config.gridRows || 12;
        this.cellSize = config.cellSize || 30;
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
    }
    
    connectToGrid() {
        if (!this.container) return;
        
        const cells = this.container.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            
            if (this.gridData[y] && this.gridData[y][x]) {
                this.gridData[y][x].element = cell;
            }
            
            const building = this.getBuildingAt(x, y);
            if (building) {
                if (!cell.querySelector('.building-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'building-icon';
                    if (building.type === 'castle') {
                        icon.classList.add('castle');
                    }
                    icon.textContent = '🏰';
                    cell.appendChild(icon);
                    cell.classList.add('has-building');
                }
            }
        });
    }
    
    render() {
        if (!this.container) return;
        
        const cells = this.container.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            
            const building = this.getBuildingAt(x, y);
            let iconElement = cell.querySelector('.building-icon');
            
            if (building) {
                if (!iconElement) {
                    const icon = document.createElement('span');
                    icon.className = 'building-icon';
                    if (building.type === 'castle') {
                        icon.classList.add('castle');
                    }
                    icon.textContent = '🏰';
                    cell.appendChild(icon);
                    cell.classList.add('has-building');
                }
            } else {
                if (iconElement) {
                    iconElement.remove();
                    cell.classList.remove('has-building');
                }
            }
        });
    }
    
    getBuildingAt(x, y) {
        return this.buildings.find(b => 
            x >= b.x && x < b.x + b.size.width &&
            y >= b.y && y < b.y + b.size.height
        ) || null;
    }
    
    placeBuilding(type, x, y) {
        const buildingData = typeof BUILDINGS !== 'undefined' && BUILDINGS[type];
        if (!buildingData) return false;
        
        const size = buildingData.size || { width: 1, height: 1 };
        
        if (!this.canPlace(x, y, size)) return false;
        
        const building = {
            type: type,
            x: x,
            y: y,
            level: 1,
            size: size
        };
        this.buildings.push(building);
        
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
        if (x + size.width > this.cols || y + size.height > this.rows) {
            return false;
        }
        
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
        
        const buildingData = typeof BUILDINGS !== 'undefined' && BUILDINGS[building.type];
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