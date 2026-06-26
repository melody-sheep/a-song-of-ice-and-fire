// ============================================
// TREE DEFINITIONS - Game of Thrones Trees
// ============================================

const TREES = {
    // ===== SMALL TREES (1x1 grid, spreads to 2x2) =====
    'small_pine': {
        id: 'small_pine',
        name: 'Small Pine',
        icon: '🌲',
        size: '1x1',
        spread: 1,
        gridSize: 1,
        image: 'small_pine1x1.png',
        description: 'A young pine tree from the North',
        category: 'small',
        color: '#2d5a3d'
    },
    
    'fir_1x1': {
        id: 'fir_1x1',
        name: 'Fir Tree',
        icon: '🌲',
        size: '1x1',
        spread: 1,
        gridSize: 1,
        image: 'fir-1x1.png',
        description: 'A tall northern fir tree',
        category: 'small',
        color: '#1a4a3a'
    },
    
    'birch_1x1': {
        id: 'birch_1x1',
        name: 'Birch Tree',
        icon: '🌳',
        size: '1x1',
        spread: 1,
        gridSize: 1,
        image: 'birch-1x1.png',
        description: 'A birch with golden leaves',
        category: 'small',
        color: '#c8a820'
    },
    
    // ===== MEDIUM TREES (2x2 grid, spreads to 3x3) =====
    'pine_2x2': {
        id: 'pine_2x2',
        name: 'Medium Pine',
        icon: '🌲',
        size: '2x2',
        spread: 2,
        gridSize: 2,
        image: 'pine-2x2.png',
        description: 'A mature pine tree',
        category: 'medium',
        color: '#1a4a2a'
    },
    
    'oak_2x2': {
        id: 'oak_2x2',
        name: 'Oak Tree',
        icon: '🌳',
        size: '2x2',
        spread: 2,
        gridSize: 2,
        image: 'oak-2x2.png',
        description: 'A strong oak tree',
        category: 'medium',
        color: '#2a5a2a'
    },
    
    'pine_cluster_2x2': {
        id: 'pine_cluster_2x2',
        name: 'Pine Cluster',
        icon: '🌲🌲',
        size: '2x2',
        spread: 2,
        gridSize: 2,
        image: 'pine-cluster-2x2.png',
        description: 'A cluster of pines',
        category: 'medium',
        color: '#1a3a2a'
    },
    
    'dead_tree_2x2': {
        id: 'dead_tree_2x2',
        name: 'Dead Tree',
        icon: '💀',
        size: '2x2',
        spread: 2,
        gridSize: 2,
        image: 'dead-tree-2x2.png',
        description: 'A haunted dead tree',
        category: 'medium',
        color: '#5a4a3a'
    },
    
    'large_birch_2x2': {
        id: 'large_birch_2x2',
        name: 'Large Birch',
        icon: '🌳',
        size: '2x2',
        spread: 2,
        gridSize: 2,
        image: 'birch-2x2.png',
        description: 'A large birch tree',
        category: 'medium',
        color: '#d4b030'
    },
    
    // ===== LARGE TREES (3x3 grid, spreads to 4x4) =====
    'pine_3x3': {
        id: 'pine_3x3',
        name: 'Large Pine',
        icon: '🌲',
        size: '3x3',
        spread: 3,
        gridSize: 3,
        image: 'pine-3x3.png',
        description: 'A majestic large pine',
        category: 'large',
        color: '#1a3a2a'
    },
    
    'oak_3x3': {
        id: 'oak_3x3',
        name: 'Large Oak',
        icon: '🌳',
        size: '3x3',
        spread: 3,
        gridSize: 3,
        image: 'oak-3x3.png',
        description: 'A massive old oak',
        category: 'large',
        color: '#1a4a2a'
    },
    
    'weirwood_3x3': {
        id: 'weirwood_3x3',
        name: 'Weirwood Tree',
        icon: '🌿',
        size: '3x3',
        spread: 3,
        gridSize: 3,
        image: 'weirwood-3x3.png',
        description: 'A sacred white tree with red leaves',
        category: 'large',
        color: '#8a1a1a'
    },
    
    'ancient_oak_3x3': {
        id: 'ancient_oak_3x3',
        name: 'Ancient Oak',
        icon: '🌳',
        size: '3x3',
        spread: 3,
        gridSize: 3,
        image: 'ancient-oak-3x3.png',
        description: 'An ancient, powerful oak',
        category: 'large',
        color: '#3a2a1a'
    },
    
    'dead_tree_3x3': {
        id: 'dead_tree_3x3',
        name: 'Large Dead Tree',
        icon: '💀',
        size: '3x3',
        spread: 3,
        gridSize: 3,
        image: 'dead-tree-3x3.png',
        description: 'A massive dead tree',
        category: 'large',
        color: '#6a5a4a'
    },
    
    // ===== HUGE TREES (4x4 grid, spreads to 5x5) =====
    'weirwood_4x4': {
        id: 'weirwood_4x4',
        name: 'Heart Tree',
        icon: '🌿',
        size: '4x4',
        spread: 4,
        gridSize: 4,
        image: 'weirwood-4x4.png',
        description: 'The sacred Heart Tree of the North',
        category: 'huge',
        color: '#7a0a0a'
    },
    
    'ancient_oak_4x4': {
        id: 'ancient_oak_4x4',
        name: 'Giant Ancient Oak',
        icon: '🌳',
        size: '4x4',
        spread: 4,
        gridSize: 4,
        image: 'ancient-oak-4x4.png',
        description: 'A colossal ancient oak',
        category: 'huge',
        color: '#3a2a1a'
    },
    
    'heart_tree_4x4': {
        id: 'heart_tree_4x4',
        name: 'Giant Heart Tree',
        icon: '🌿',
        size: '4x4',
        spread: 4,
        gridSize: 4,
        image: 'heart-tree-4x4.png',
        description: 'The legendary Giant Heart Tree',
        category: 'huge',
        color: '#6a0000'
    }
};

// Tree categories for UI grouping
const TREE_CATEGORIES = {
    'small': {
        name: '🌱 Small Trees',
        icon: '🌱',
        description: '1×1 grid - spreads to 2×2'
    },
    'medium': {
        name: '🌲 Medium Trees',
        icon: '🌲',
        description: '2×2 grid - spreads to 3×3'
    },
    'large': {
        name: '🌳 Large Trees',
        icon: '🌳',
        description: '3×3 grid - spreads to 4×4'
    },
    'huge': {
        name: '🌿 Huge Trees',
        icon: '🌿',
        description: '4×4 grid - spreads to 5×5'
    }
};

// Get trees by category
function getTreesByCategory(category) {
    return Object.values(TREES).filter(tree => tree.category === category);
}

// Get tree by ID
function getTreeById(id) {
    return TREES[id] || null;
}

// Get all tree IDs
function getAllTreeIds() {
    return Object.keys(TREES);
}