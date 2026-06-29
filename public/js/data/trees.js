// ============================================
// TREE DATA - All Tree Definitions
// ============================================

const TREES = {
    // ===== PINE TREES =====
    'pine_small': {
        id: 'pine_small',
        name: 'Small Pine',
        image: 'small_pine1x1.png',
        spread: 1,
        gridSize: 1,
        category: 'pine',
        description: 'A small pine tree',
        scale: 1.0
    },
    'pine_medium': {
        id: 'pine_medium',
        name: 'Medium Pine',
        image: 'small_pine1x1.png',
        spread: 1,
        gridSize: 1,
        category: 'pine',
        description: 'A medium pine tree',
        scale: 1.0
    },
    'pine_large': {
        id: 'pine_large',
        name: 'Large Pine',
        image: 'small_pine1x1.png',
        spread: 2,
        gridSize: 1,
        category: 'pine',
        description: 'A large pine tree',
        scale: 1.0
    },
    'pine_ancient': {
        id: 'pine_ancient',
        name: 'Ancient Pine',
        image: 'small_pine1x1.png',
        spread: 3,
        gridSize: 1,
        category: 'pine',
        description: 'An ancient pine tree',
        scale: 1.0
    },
    
    // ===== OAK TREES =====
    'oak_small': {
        id: 'oak_small',
        name: 'Small Oak',
        image: 'small_pine1x1.png',
        spread: 1,
        gridSize: 1,
        category: 'oak',
        description: 'A small oak tree',
        scale: 1.0
    },
    'oak_medium': {
        id: 'oak_medium',
        name: 'Medium Oak',
        image: 'small_pine1x1.png',
        spread: 1,
        gridSize: 1,
        category: 'oak',
        description: 'A medium oak tree',
        scale: 1.0
    },
    'oak_large': {
        id: 'oak_large',
        name: 'Large Oak',
        image: 'small_pine1x1.png',
        spread: 2,
        gridSize: 1,
        category: 'oak',
        description: 'A large oak tree',
        scale: 1.0
    },
    
    // ===== WEIRWOOD =====
    'weirwood_small': {
        id: 'weirwood_small',
        name: 'Small Weirwood',
        image: 'small_pine1x1.png',
        spread: 1,
        gridSize: 1,
        category: 'weirwood',
        description: 'A small weirwood tree',
        scale: 1.0
    },
    'weirwood_medium': {
        id: 'weirwood_medium',
        name: 'Medium Weirwood',
        image: 'small_pine1x1.png',
        spread: 2,
        gridSize: 1,
        category: 'weirwood',
        description: 'A medium weirwood tree',
        scale: 1.0
    }
};

// Get tree by ID
function getTreeById(id) {
    return TREES[id] || null;
}

// Get all trees in a category
function getTreesByCategory(category) {
    const result = [];
    for (const key in TREES) {
        if (TREES[key].category === category) {
            result.push({ id: key, ...TREES[key] });
        }
    }
    return result;
}

// Get all tree categories
function getTreeCategories() {
    const categories = new Set();
    for (const key in TREES) {
        categories.add(TREES[key].category);
    }
    return Array.from(categories);
}

// Get all trees
function getAllTrees() {
    const result = [];
    for (const key in TREES) {
        result.push({ id: key, ...TREES[key] });
    }
    return result;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TREES,
        getTreeById,
        getTreesByCategory,
        getTreeCategories,
        getAllTrees
    };
}