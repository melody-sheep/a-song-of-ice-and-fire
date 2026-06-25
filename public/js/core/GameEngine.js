// ============================================
// GAME ENGINE - Main Game Loop & State
// ============================================

class GameEngine {
    constructor(config) {
        this.config = config;
        this.gridManager = new GridManager(config);
        this.resourceManager = new ResourceManager(config);
        this.isRunning = false;
        this.tickInterval = null;
        this.tickRate = 5000; // 5 seconds
        this.onUpdate = null;
        
        // Place starting buildings
        this.placeStartingBuildings();
    }
    
    placeStartingBuildings() {
        const buildings = this.config.startingBuildings || [];
        buildings.forEach(building => {
            this.gridManager.placeBuilding(building.type, building.x, building.y);
        });
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.tickInterval = setInterval(() => {
            this.tick();
        }, this.tickRate);
        
        // Initial tick
        this.tick();
    }
    
    stop() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
        this.isRunning = false;
    }
    
    tick() {
        // Calculate production from buildings
        const buildings = this.gridManager.getBuildings();
        this.resourceManager.calculateProduction(buildings);
        
        // Consume food
        this.resourceManager.consumeFood();
        
        // Update UI
        if (this.onUpdate) {
            this.onUpdate(this.getState());
        }
    }
    
    getState() {
        return {
            resources: this.resourceManager.getResources(),
            buildings: this.gridManager.getBuildings()
        };
    }
    
    getResources() {
        return this.resourceManager.getResources();
    }
    
    getBuildings() {
        return this.gridManager.getBuildings();
    }
    
    placeBuilding(type, x, y) {
        const buildingData = BUILDINGS[type];
        if (!buildingData) return false;
        
        // Check resources
        if (!this.resourceManager.canAfford(buildingData.cost)) {
            return false;
        }
        
        // Place building
        const success = this.gridManager.placeBuilding(type, x, y);
        if (success) {
            this.resourceManager.spend(buildingData.cost);
            if (this.onUpdate) {
                this.onUpdate(this.getState());
            }
            return true;
        }
        return false;
    }
    
    upgradeBuilding(x, y) {
        const building = this.gridManager.getBuildingAt(x, y);
        if (!building) return false;
        
        const buildingData = BUILDINGS[building.type];
        if (!buildingData) return false;
        
        const cost = buildingData.upgradeCost(building.level);
        if (!this.resourceManager.canAfford(cost)) {
            return false;
        }
        
        const success = this.gridManager.upgradeBuilding(x, y);
        if (success) {
            this.resourceManager.spend(cost);
            if (this.onUpdate) {
                this.onUpdate(this.getState());
            }
            return true;
        }
        return false;
    }
    
    canPlace(x, y, size) {
        return this.gridManager.canPlace(x, y, size);
    }
    
    getBuildingAt(x, y) {
        return this.gridManager.getBuildingAt(x, y);
    }
    
    setOnUpdate(callback) {
        this.onUpdate = callback;
    }
    
    getGridManager() {
        return this.gridManager;
    }
}