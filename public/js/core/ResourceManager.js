// ============================================
// RESOURCE MANAGER - Resource Management
// ============================================

class ResourceManager {
    constructor(config) {
        this.resources = {
            wood: config.startingResources?.wood || 100,
            food: config.startingResources?.food || 80,
            gold: config.startingResources?.gold || 50,
            soldiers: config.startingResources?.soldiers || 0,
            population: config.startingResources?.population || 5,
            defense: config.startingResources?.defense || 10,
            populationMax: 10
        };
        this.bonuses = config.bonuses || {};
        this.onUpdate = null;
    }
    
    getResources() {
        return { ...this.resources };
    }
    
    get(resource) {
        return this.resources[resource] || 0;
    }
    
    add(resource, amount) {
        if (this.resources.hasOwnProperty(resource)) {
            this.resources[resource] += amount;
            this.triggerUpdate();
            return true;
        }
        return false;
    }
    
    subtract(resource, amount) {
        if (this.resources.hasOwnProperty(resource)) {
            if (this.resources[resource] >= amount) {
                this.resources[resource] -= amount;
                this.triggerUpdate();
                return true;
            }
            return false;
        }
        return false;
    }
    
    canAfford(cost) {
        for (const [resource, amount] of Object.entries(cost)) {
            if ((this.resources[resource] || 0) < amount) {
                return false;
            }
        }
        return true;
    }
    
    spend(cost) {
        if (!this.canAfford(cost)) return false;
        
        for (const [resource, amount] of Object.entries(cost)) {
            this.resources[resource] -= amount;
        }
        this.triggerUpdate();
        return true;
    }
    
    calculateProduction(buildings) {
        let food = 0;
        let wood = 0;
        let gold = 0;
        let defense = 0;
        let population = 0;
        
        buildings.forEach(building => {
            const buildingData = BUILDINGS[building.type];
            if (!buildingData) return;
            
            const production = buildingData.production || {};
            const level = building.level || 1;
            
            if (production.food) food += production.food * level;
            if (production.wood) wood += production.wood * level;
            if (production.gold) gold += production.gold * level;
            if (production.defense) defense += production.defense * level;
            if (production.population) population += production.population * level;
        });
        
        // Apply bonuses
        if (this.bonuses.food) food *= (1 + this.bonuses.food);
        if (this.bonuses.defense) defense *= (1 + this.bonuses.defense);
        if (this.bonuses.gold) gold *= (1 + this.bonuses.gold);
        if (this.bonuses.wood) wood *= (1 + this.bonuses.wood);
        
        // Update resources
        this.resources.food += Math.floor(food);
        this.resources.wood += Math.floor(wood);
        this.resources.gold += Math.floor(gold);
        this.resources.defense += Math.floor(defense);
        this.resources.populationMax += Math.floor(population);
        
        this.triggerUpdate();
    }
    
    consumeFood() {
        const consumption = Math.floor(this.resources.population * 0.1);
        if (this.resources.food >= consumption) {
            this.resources.food -= consumption;
            this.triggerUpdate();
            return true;
        } else {
            // Food shortage - lose population
            this.resources.population = Math.max(0, this.resources.population - 1);
            this.triggerUpdate();
            return false;
        }
    }
    
    setOnUpdate(callback) {
        this.onUpdate = callback;
    }
    
    triggerUpdate() {
        if (this.onUpdate) {
            this.onUpdate(this.getResources());
        }
    }
}