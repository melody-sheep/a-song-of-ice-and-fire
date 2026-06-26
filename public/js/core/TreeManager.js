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
        
        // Tree image path
        this.treePath = '/kingdoms/winterfell/assets/trees/';
    }
    
    // Set the tree type to place
    setTree(treeId) {
        const treeDef = getTreeById(treeId);
        if (treeDef) {
            this.currentTree = {
                id: treeId,
                ...treeDef
            };
            return true;
        }
        return false;
    }
    
    // Clear current tree selection
    clearTree() {
        this.currentTree = null;
        this.clearPreview();
    }
    
    // Get tree image path
    getTreePath(imageName) {
        return `${this.treePath}${imageName}`;
    }
    
    // Check if tree exists at position (root position)
    hasTree(x, y) {
        const key = `${x},${y}`;
        return !!this.treeData[key];
    }
    
    // Get tree at position
    getTree(x, y) {
        const key = `${x},${y}`;
        return this.treeData[key] || null;
    }
    
    // Get all trees
    getAllTrees() {
        return this.treeData;
    }
    
    // Place a tree at root position
    placeTree(rootX, rootY) {
        if (!this.currentTree) {
            this.showNotification('⚠️ Select a tree type first!', 'warning');
            return false;
        }
        
        if (rootX >= this.gridManager.cols || rootY >= this.gridManager.rows) {
            this.showNotification('❌ Invalid position!', 'error');
            return false;
        }
        
        // Check if there's already a tree at this root
        if (this.hasTree(rootX, rootY)) {
            this.showNotification('❌ A tree already exists at this root!', 'error');
            return false;
        }
        
        // Place the tree
        const key = `${rootX},${rootY}`;
        this.treeData[key] = {
            id: this.currentTree.id,
            name: this.currentTree.name,
            image: this.currentTree.image,
            spread: this.currentTree.spread,
            gridSize: this.currentTree.gridSize,
            rootX: rootX,
            rootY: rootY,
            timestamp: Date.now()
        };
        
        this.renderTrees();
        
        if (this.onTreePlaced) {
            this.onTreePlaced(this.currentTree, rootX, rootY);
        }
        
        this.showNotification(`🌲 ${this.currentTree.name} placed at (${rootX}, ${rootY})!`, 'success');
        return true;
    }
    
    // Remove a tree by root position
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
    
    // Remove tree at any position (find root from any covered cell)
    removeTreeAt(x, y) {
        // Check if this exact position has a tree root
        if (this.hasTree(x, y)) {
            return this.removeTree(x, y);
        }
        
        // Check if this position is covered by a tree
        for (const key in this.treeData) {
            const tree = this.treeData[key];
            const spread = tree.spread;
            const rootX = tree.rootX;
            const rootY = tree.rootY;
            
            // Check if (x,y) is within the tree's spread area
            if (x >= rootX - spread && x <= rootX + spread &&
                y >= rootY - spread && y <= rootY + spread) {
                return this.removeTree(rootX, rootY);
            }
        }
        
        return false;
    }
    
    // Get the tree root that covers a given cell
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
    
    // Render all trees on the grid
    renderTrees() {
        const container = this.gridManager.container;
        if (!container) return;
        
        // Remove existing tree elements
        container.querySelectorAll('.tree-container').forEach(el => el.remove());
        
        // For each tree, create a container div that overlays the grid
        for (const key in this.treeData) {
            const tree = this.treeData[key];
            const rootX = tree.rootX;
            const rootY = tree.rootY;
            const spread = tree.spread;
            const imageName = tree.image;
            
            // Get the root cell element
            const rootCell = container.querySelector(`.grid-cell[data-x="${rootX}"][data-y="${rootY}"]`);
            if (!rootCell) continue;
            
            // Create tree container
            const treeContainer = document.createElement('div');
            treeContainer.className = 'tree-container';
            treeContainer.dataset.rootX = rootX;
            treeContainer.dataset.rootY = rootY;
            treeContainer.dataset.treeId = tree.id;
            
            // Calculate the spread in pixels
            const cellSize = rootCell.offsetWidth || 30;
            const spreadPixels = spread * cellSize;
            
            // Position the tree centered on the root cell
            treeContainer.style.cssText = `
                position: absolute;
                top: ${rootCell.offsetTop - spreadPixels}px;
                left: ${rootCell.offsetLeft - spreadPixels}px;
                width: ${(spread * 2 + 1) * cellSize}px;
                height: ${(spread * 2 + 1) * cellSize}px;
                pointer-events: none;
                z-index: 10;
                background-image: url('${this.getTreePath(imageName)}');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
                transition: filter 0.3s ease;
            `;
            
            // Make tree clickable for removal via right-click
            treeContainer.style.pointerEvents = 'none';
            
            container.appendChild(treeContainer);
        }
    }
    
    // Preview tree placement
    previewTree(rootX, rootY) {
        this.clearPreview();
        
        if (!this.currentTree) return;
        
        const container = this.gridManager.container;
        if (!container) return;
        
        const spread = this.currentTree.spread;
        const rootCell = container.querySelector(`.grid-cell[data-x="${rootX}"][data-y="${rootY}"]`);
        if (!rootCell) return;
        
        // Highlight the cells that will be covered
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
    
    // Clear preview
    clearPreview() {
        this.previewElements.forEach(cell => {
            cell.classList.remove('tree-preview');
            cell.style.border = '';
            cell.style.boxShadow = '';
        });
        this.previewElements = [];
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`[TreeManager] ${message}`);
        }
    }
    
    // Save tree data
    saveTrees() {
        return JSON.stringify(this.treeData);
    }
    
    // Load tree data
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
    
    // Clear all trees
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
    
    // Get tree count
    getTreeCount() {
        return Object.keys(this.treeData).length;
    }
    
    // Re-render trees (call after grid resize/zoom)
    refresh() {
        this.renderTrees();
    }
}