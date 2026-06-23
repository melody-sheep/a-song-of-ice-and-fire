// ============================================
// WINTERFELL - House Stark Kingdom Logic
// ============================================

// ===== CONFIGURATION =====
const WINTERFELL_CONFIG = {
    id: 'winterfell',
    name: 'Winterfell',
    house: 'stark',
    sigil: '🐺',
    primaryColor: '#4fc3f7',
    gridSize: 10,
    startingResources: {
        wood: 100,
        food: 80,
        gold: 50,
        soldiers: 0,
        population: 5,
        defense: 10
    },
    startingBuildings: [
        { type: 'castle', x: 4, y: 4, level: 1 }
    ],
    bonuses: {
        food: 0.20,      // +20% Food production
        defense: 0.10    // +10% Defense
    }
};

// ===== DOM REFERENCES =====
const gridContainer = document.getElementById('grid-container');
const returnBtn = document.getElementById('returnBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// ===== STATE =====
let gameEngine = null;
let selectedBuilding = null;
let buildMode = false;

// ===== INITIALIZE =====
function initWinterfell() {
    console.log('🐺 Winterfell - The North Remembers');
    
    // Get house from session
    const house = sessionStorage.getItem('selectedHouse') || 'stark';
    console.log(`🏠 House: ${house}`);
    
    // Initialize game engine
    gameEngine = new GameEngine(WINTERFELL_CONFIG);
    gameEngine.start();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show welcome message
    showNotification('❄️ Welcome to Winterfell! Build your kingdom.');
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Return to map
    returnBtn.addEventListener('click', () => {
        window.location.href = '/map.html';
    });
    
    // Building buttons
    document.querySelectorAll('.build-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const buildingType = btn.dataset.building;
            enterBuildMode(buildingType);
        });
    });
    
    // Action buttons
    document.querySelector('.attack-btn').addEventListener('click', () => {
        showNotification('⚔️ Preparing attack...');
    });
    
    document.querySelector('.defend-btn').addEventListener('click', () => {
        showNotification('🛡️ Reinforcing defenses...');
    });
    
    document.querySelector('.map-btn').addEventListener('click', () => {
        window.location.href = '/map.html';
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            exitBuildMode();
        }
        if (e.key === 'm' || e.key === 'M') {
            window.location.href = '/map.html';
        }
    });
}

// ===== BUILD MODE =====
function enterBuildMode(buildingType) {
    const building = BUILDINGS[buildingType];
    if (!building) return;
    
    // Check if we have resources
    const resources = gameEngine.getResources();
    if (!hasEnoughResources(resources, building.cost)) {
        showNotification(`❌ Not enough resources! Need: ${formatCost(building.cost)}`);
        return;
    }
    
    buildMode = true;
    selectedBuilding = buildingType;
    
    // Highlight buildable cells
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        if (gameEngine.canPlace(x, y, building.size)) {
            cell.classList.add('can-place');
        }
    });
    
    showNotification(`🏗️ Place ${building.name}. Click a green cell. Press ESC to cancel.`);
}

function exitBuildMode() {
    buildMode = false;
    selectedBuilding = null;
    document.querySelectorAll('.grid-cell.can-place').forEach(cell => {
        cell.classList.remove('can-place');
    });
    document.querySelectorAll('.grid-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
    showNotification('❌ Build cancelled.');
}

// ===== GRID CLICK HANDLER =====
function onGridClick(x, y) {
    if (buildMode && selectedBuilding) {
        const building = BUILDINGS[selectedBuilding];
        if (!building) return;
        
        // Try to place building
        const success = gameEngine.placeBuilding(selectedBuilding, x, y);
        if (success) {
            showNotification(`✅ ${building.name} built!`);
            exitBuildMode();
            updateUI();
        } else {
            showNotification('❌ Cannot place here!');
        }
        return;
    }
    
    // Check if there's a building here
    const building = gameEngine.getBuildingAt(x, y);
    if (building) {
        showBuildingInfo(building);
    } else {
        showNotification(`📍 Cell (${x}, ${y}) - Empty`);
    }
}

// ===== BUILDING INFO =====
function showBuildingInfo(building) {
    const buildingData = BUILDINGS[building.type];
    if (!buildingData) return;
    
    const infoContent = document.getElementById('info-content');
    infoContent.innerHTML = `
        <div class="building-detail">
            <h5>${buildingData.icon} ${buildingData.name}</h5>
            <p class="building-level">Level ${building.level}</p>
            <p class="building-desc">${buildingData.description}</p>
            <div class="building-production">
                <span>Production:</span>
                ${Object.entries(buildingData.production).map(([key, value]) => 
                    `<span>${key}: +${value * building.level}</span>`
                ).join('')}
            </div>
            <button class="upgrade-btn" data-type="${building.type}" data-x="${building.x}" data-y="${building.y}">
                ⬆️ Upgrade (Cost: ${formatCost(buildingData.upgradeCost(building.level))})
            </button>
        </div>
    `;
    
    // Upgrade button
    document.querySelector('.upgrade-btn').addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        upgradeBuilding(type, x, y);
    });
}

// ===== UPGRADE BUILDING =====
function upgradeBuilding(type, x, y) {
    const success = gameEngine.upgradeBuilding(x, y);
    if (success) {
        showNotification(`⬆️ Building upgraded!`);
        updateUI();
    } else {
        showNotification('❌ Not enough resources to upgrade!');
    }
}

// ===== RESOURCE HELPERS =====
function hasEnoughResources(resources, cost) {
    for (const [resource, amount] of Object.entries(cost)) {
        if ((resources[resource] || 0) < amount) {
            return false;
        }
    }
    return true;
}

function formatCost(cost) {
    return Object.entries(cost)
        .map(([key, value]) => {
            const icons = { wood: '🪵', food: '🍗', gold: '🪙' };
            return `${icons[key] || ''}${value}`;
        })
        .join(' ');
}

// ===== UPDATE UI =====
function updateUI() {
    const resources = gameEngine.getResources();
    
    // Update top bar
    document.getElementById('topbarWood').textContent = resources.wood || 0;
    document.getElementById('topbarFood').textContent = resources.food || 0;
    document.getElementById('topbarGold').textContent = resources.gold || 0;
    document.getElementById('topbarSoldiers').textContent = resources.soldiers || 0;
    document.getElementById('topbarPopulation').textContent = resources.population || 0;
    
    // Update resource panel
    document.getElementById('resWood').textContent = resources.wood || 0;
    document.getElementById('resFood').textContent = resources.food || 0;
    document.getElementById('resGold').textContent = resources.gold || 0;
    document.getElementById('resSoldiers').textContent = resources.soldiers || 0;
    document.getElementById('resPopulation').textContent = resources.population || 0;
    document.getElementById('resDefense').textContent = resources.defense || 0;
    
    // Update population max
    document.getElementById('resPopulationMax').textContent = resources.populationMax || 10;
}

// ===== NOTIFICATION =====
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    clearTimeout(notification._timeout);
    notification._timeout = setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 500);
    }, 3000);
}

// ===== START =====
document.addEventListener('DOMContentLoaded', initWinterfell);