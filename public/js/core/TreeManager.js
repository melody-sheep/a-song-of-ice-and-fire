// ============================================
// TREE MANAGER - Tree Placement & Rendering
// ============================================

class TreeManager {
    constructor(gridManager) {
        this.gridManager = gridManager;
        this.treeData = {};
        this.currentTree = null;
        this.previewElements = [];
        this.onTreePlaced = null;
        this.onTreeRemoved = null;
        this.treePath = '/kingdoms/winterfell/assets/trees/';
    }
    
    setTree(treeId) {
        const treeDef = getTreeById(treeId);
        if (treeDef) {
            this.currentTree = {
                id: treeId,
                ...treeDef
            };
            console.log('🌲 Tree selected:', this.currentTree.name, 'Spread:', this.currentTree.spread);
            return true;
        }
        console.error('❌ Tree not found:', treeId);
        return false;
    }
    
    clearTree() {
        this.currentTree = null;
        this.clearPreview();
    }
    
    getTreePath(imageName) {
        return `${this.treePath}${imageName}`;
    }
    
    hasTree(x, y) {
        const key = `${x},${y}`;
        return !!this.treeData[key];
    }
    
    getTree(x, y) {
        const key = `${x},${y}`;
        return this.treeData[key] || null;
    }
    
    getAllTrees() {
        return this.treeData;
    }
    
    // Single tree placement - click
    placeTree(rootX, rootY) {
        if (!this.currentTree) {
            this.showNotification('⚠️ Select a tree first!', 'warning');
            return false;
        }
        
        if (rootX >= this.gridManager.cols || rootY >= this.gridManager.rows) {
            this.showNotification('❌ Invalid position!', 'error');
            return false;
        }
        
        const key = `${rootX},${rootY}`;
        if (this.treeData[key]) {
            this.showNotification('❌ Tree already here!', 'error');
            return false;
        }
        
        this.treeData[key] = {
            id: this.currentTree.id,
            name: this.currentTree.name,
            image: this.currentTree.image,
            spread: this.currentTree.spread,
            scale: this.currentTree.scale || 1.0,
            rootX: rootX,
            rootY: rootY,
            timestamp: Date.now()
        };
        
        this.renderTrees();
        
        if (this.onTreePlaced) {
            this.onTreePlaced(this.currentTree, rootX, rootY);
        }
        
        this.showNotification(`🌲 ${this.currentTree.name} placed!`, 'success');
        return true;
    }
    
    // Brush placement - drag to paint trees
    // Places EXACTLY ONE tree per cell as you drag over cells
    placeTreeBrush(centerX, centerY, radius) {
        // radius is IGNORED - we only place ONE tree at the exact cell
        if (!this.currentTree) {
            this.showNotification('⚠️ Select a tree first!', 'warning');
            return 0;
        }
        
        const x = centerX;
        const y = centerY;
        
        // Bounds check
        if (x < 0 || x >= this.gridManager.cols || y < 0 || y >= this.gridManager.rows) {
            return 0;
        }
        
        // Check if already has tree
        const key = `${x},${y}`;
        if (this.treeData[key]) {
            return 0;
        }
        
        // Place ONE tree at this cell
        this.treeData[key] = {
            id: this.currentTree.id,
            name: this.currentTree.name,
            image: this.currentTree.image,
            spread: this.currentTree.spread,
            scale: this.currentTree.scale || 1.0,
            rootX: x,
            rootY: y,
            timestamp: Date.now()
        };
        
        this.renderTrees();
        if (this.onTreePlaced) {
            this.onTreePlaced(this.currentTree, x, y);
        }
        return 1;
    }
    
    removeTree(rootX, rootY) {
        const key = `${rootX},${rootY}`;
        if (this.treeData[key]) {
            const treeName = this.treeData[key].name;
            delete this.treeData[key];
            this.renderTrees();
            
            if (this.onTreeRemoved) {
                this.onTreeRemoved(rootX, rootY);
            }
            
            this.showNotification(`🗑 ${treeName} removed!`, 'warning');
            return true;
        }
        return false;
    }
    
    removeTreeAt(x, y) {
        if (this.hasTree(x, y)) {
            return this.removeTree(x, y);
        }
        
        for (const key in this.treeData) {
            const tree = this.treeData[key];
            const spread = tree.spread;
            const rootX = tree.rootX;
            const rootY = tree.rootY;
            
            if (x >= rootX - spread && x <= rootX + spread &&
                y >= rootY - spread && y <= rootY + spread) {
                return this.removeTree(rootX, rootY);
            }
        }
        
        return false;
    }
    
    getTreeRootAt(x, y) {
        for (const key in this.treeData) {
            const tree = this.treeData[key];
            const spread = tree.spread;
            const rootX = tree.rootX;
            const rootY = tree.rootY;
            
            if (x >= rootX - spread && x <= rootX + spread &&
                y >= rootY - spread && y <= rootY + spread) {
                return { rootX, rootY, tree };
            }
        }
        return null;
    }
    
    renderTrees() {
        const container = this.gridManager.container;
        if (!container) return;
        
        container.querySelectorAll('.tree-container').forEach(el => el.remove());
        
        for (const key in this.treeData) {
            const tree = this.treeData[key];
            const rootX = tree.rootX;
            const rootY = tree.rootY;
            const spread = tree.spread;
            const imageName = tree.image;
            const scale = tree.scale || 1.0;
            
            const rootCell = container.querySelector(`.grid-cell[data-x="${rootX}"][data-y="${rootY}"]`);
            if (!rootCell) continue;
            
            const treeContainer = document.createElement('div');
            treeContainer.className = 'tree-container';
            treeContainer.dataset.rootX = rootX;
            treeContainer.dataset.rootY = rootY;
            treeContainer.dataset.treeId = tree.id;
            
            const cellSize = rootCell.offsetWidth || 30;
            const spreadPixels = spread * cellSize;
            const totalSize = (spread * 2 + 1) * cellSize;
            const scaledSize = totalSize * scale;
            const offset = (totalSize - scaledSize) / 2;
            
            treeContainer.style.cssText = `
                position: absolute;
                top: ${rootCell.offsetTop - spreadPixels + offset}px;
                left: ${rootCell.offsetLeft - spreadPixels + offset}px;
                width: ${scaledSize}px;
                height: ${scaledSize}px;
                pointer-events: none;
                z-index: 10;
                background-image: url('${this.getTreePath(imageName)}');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
            `;
            
            container.appendChild(treeContainer);
        }
    }
    
    previewTree(rootX, rootY) {
        this.clearPreview();
        if (!this.currentTree) return;
        
        const container = this.gridManager.container;
        if (!container) return;
        
        const spread = this.currentTree.spread;
        
        for (let dy = -spread; dy <= spread; dy++) {
            for (let dx = -spread; dx <= spread; dx++) {
                const x = rootX + dx;
                const y = rootY + dy;
                
                if (x < 0 || x >= this.gridManager.cols || y < 0 || y >= this.gridManager.rows) continue;
                
                const cell = container.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
                if (cell) {
                    cell.classList.add('tree-preview');
                    cell.style.border = '2px solid rgba(212, 167, 74, 0.6)';
                    cell.style.boxShadow = 'inset 0 0 20px rgba(212, 167, 74, 0.15)';
                    this.previewElements.push(cell);
                }
            }
        }
    }
    
    clearPreview() {
        this.previewElements.forEach(cell => {
            cell.classList.remove('tree-preview');
            cell.style.border = '';
            cell.style.boxShadow = '';
        });
        this.previewElements = [];
    }
    
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`[TreeManager] ${message}`);
        }
    }
    
    saveTrees() {
        return JSON.stringify(this.treeData);
    }
    
    loadTrees(data) {
        try {
            this.treeData = JSON.parse(data);
            this.renderTrees();
            return true;
        } catch (e) {
            console.error('Failed to load tree data:', e);
            return false;
        }
    }
    
    clearAllTrees() {
        const count = Object.keys(this.treeData).length;
        if (count === 0) {
            this.showNotification('ℹ️ No trees to clear', 'warning');
            return;
        }
        this.treeData = {};
        this.renderTrees();
        this.showNotification(`🗑 ${count} trees cleared!`, 'warning');
    }
    
    getTreeCount() {
        return Object.keys(this.treeData).length;
    }
    
    refresh() {
        this.renderTrees();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeManager;
}