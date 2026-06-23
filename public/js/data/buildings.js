// ============================================
// BUILDING DATA - All Building Definitions
// ============================================

const BUILDINGS = {
    castle: {
        id: 'castle',
        name: 'Castle',
        icon: '🏰',
        size: { width: 2, height: 2 },
        cost: { wood: 0, food: 0, gold: 0 },
        production: { defense: 5 },
        maxLevel: 10,
        description: 'Your seat of power. The heart of your kingdom.',
        upgradeCost: (level) => ({
            wood: 50 * level,
            food: 30 * level,
            gold: 20 * level
        })
    },
    house: {
        id: 'house',
        name: 'House',
        icon: '🏠',
        size: { width: 1, height: 1 },
        cost: { wood: 30, food: 10, gold: 0 },
        production: { population: 2 },
        maxLevel: 5,
        description: 'Shelters your people. Increases population capacity.',
        upgradeCost: (level) => ({
            wood: 20 * level,
            food: 5 * level,
            gold: 0
        })
    },
    farm: {
        id: 'farm',
        name: 'Farm',
        icon: '🌾',
        size: { width: 2, height: 2 },
        cost: { wood: 20, food: 5, gold: 0 },
        production: { food: 5 },
        maxLevel: 5,
        description: 'Grows crops. Produces food every tick.',
        upgradeCost: (level) => ({
            wood: 30 * level,
            food: 10 * level,
            gold: 5 * level
        })
    },
    barracks: {
        id: 'barracks',
        name: 'Barracks',
        icon: '⚔️',
        size: { width: 2, height: 2 },
        cost: { wood: 40, food: 20, gold: 10 },
        production: { soldiers: 1 },
        maxLevel: 5,
        description: 'Train your soldiers here. Unlocks army training.',
        upgradeCost: (level) => ({
            wood: 50 * level,
            food: 30 * level,
            gold: 20 * level
        })
    },
    goldMine: {
        id: 'goldMine',
        name: 'Gold Mine',
        icon: '🪙',
        size: { width: 2, height: 2 },
        cost: { wood: 30, food: 10, gold: 0 },
        production: { gold: 3 },
        maxLevel: 5,
        description: 'Mines precious gold. Produces gold every tick.',
        upgradeCost: (level) => ({
            wood: 40 * level,
            food: 15 * level,
            gold: 10 * level
        })
    },
    lumberMill: {
        id: 'lumberMill',
        name: 'Lumber Mill',
        icon: '🪵',
        size: { width: 2, height: 2 },
        cost: { wood: 0, food: 10, gold: 5 },
        production: { wood: 3 },
        maxLevel: 5,
        description: 'Processes wood. Produces wood every tick.',
        upgradeCost: (level) => ({
            wood: 20 * level,
            food: 10 * level,
            gold: 5 * level
        })
    },
    wall: {
        id: 'wall',
        name: 'Wall Section',
        icon: '🧱',
        size: { width: 1, height: 1 },
        cost: { wood: 15, food: 0, gold: 5 },
        production: { defense: 2 },
        maxLevel: 10,
        description: 'Strengthens your defenses against attacks.',
        upgradeCost: (level) => ({
            wood: 20 * level,
            food: 0,
            gold: 10 * level
        })
    }
};

// Get building by ID
function getBuilding(type) {
    return BUILDINGS[type] || null;
}

// Get all building types
function getAllBuildings() {
    return Object.keys(BUILDINGS);
}

// Get building cost
function getBuildingCost(type, level = 1) {
    const building = getBuilding(type);
    if (!building) return null;
    return building.cost;
}

// Get upgrade cost
function getUpgradeCost(type, level) {
    const building = getBuilding(type);
    if (!building || !building.upgradeCost) return null;
    return building.upgradeCost(level);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BUILDINGS,
        getBuilding,
        getAllBuildings,
        getBuildingCost,
        getUpgradeCost
    };
}