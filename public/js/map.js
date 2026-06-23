// ============================================
// MAP PAGE - Main Script (Complete)
// ============================================

let currentLocation = 'winterfell';
let hoverTimeout = null;

// ===== DOM REFERENCES =====
const hotspotsContainer = document.getElementById('hotspots-container');
const tooltip = document.getElementById('tooltip');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const returnBtn = document.getElementById('returnBtn');
const kingdomSelect = document.getElementById('kingdomSelect');
const modal = document.getElementById('modal');

// ===== KINGDOM PATH MAPPING =====
const KINGDOM_PATHS = {
    'winterfell': '/kingdoms/winterfell/winterfell.html',
    'westerlands': '/kingdoms/casterlyrock/casterlyrock.html',
    'thevale': '/kingdoms/thevale/thevale.html',
    'dragonstone': '/kingdoms/dragonstone/dragonstone.html',
    'kingslanding': '/kingdoms/kingslanding/kingslanding.html',
    'highgarden': '/kingdoms/highgarden/highgarden.html',
    'sunspear': '/kingdoms/sunspear/sunspear.html',
    'castleblack': '/kingdoms/castleblack/castleblack.html'
};

// ===== GENERATE HOTSPOTS =====
function generateHotspots() {
    const locations = getAllLocations();
    const fragment = document.createDocumentFragment();
    
    locations.forEach((location, index) => {
        const hotspot = document.createElement('div');
        hotspot.className = 'hotspot';
        hotspot.dataset.id = location.id;
        hotspot.style.left = location.x + 'px';
        hotspot.style.top = location.y + 'px';
        hotspot.style.animationDelay = (0.05 * (index + 1)) + 's';
        
        const ring = document.createElement('div');
        ring.className = 'hotspot-ring';
        hotspot.appendChild(ring);
        
        const locationIcon = document.createElement('span');
        locationIcon.className = 'hotspot-location-icon';
        locationIcon.textContent = '📍';
        hotspot.appendChild(locationIcon);
        
        const sigil = document.createElement('span');
        sigil.className = 'hotspot-sigil';
        sigil.textContent = location.sigil || Utils.getHouseSigil(location.house);
        sigil.style.zIndex = '3';
        hotspot.appendChild(sigil);
        
        hotspot.addEventListener('mouseenter', () => onHotspotHover(location.id, hotspot), { passive: true });
        hotspot.addEventListener('mouseleave', onHotspotLeave, { passive: true });
        hotspot.addEventListener('click', () => onHotspotClick(location.id), { passive: true });
        
        fragment.appendChild(hotspot);
    });
    
    hotspotsContainer.appendChild(fragment);
}

function onHotspotHover(locationId, element) {
    if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
    
    const location = getLocation(locationId);
    if (!location) return;
    const house = HOUSES[location.house];
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${location.sigil || ''} ${location.name}</div>
        <div class="tooltip-house">${house ? house.name : ''}</div>
        <div class="tooltip-region">${location.region}</div>
    `;
    
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 220;
    const tooltipHeight = 80;
    
    let left = rect.right + 16;
    let top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
    
    if (left + tooltipWidth > window.innerWidth - 10) {
        left = rect.left - tooltipWidth - 16;
    }
    if (top < 10) top = 10;
    if (top + tooltipHeight > window.innerHeight - 10) {
        top = window.innerHeight - tooltipHeight - 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.add('visible');
    element.classList.add('active');
}

function onHotspotLeave() {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
        tooltip.classList.remove('visible');
        document.querySelectorAll('.hotspot.active').forEach(el => el.classList.remove('active'));
        hoverTimeout = null;
    }, 100);
}

function onHotspotClick(locationId) {
    if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
    tooltip.classList.remove('visible');
    selectKingdom(locationId);
    showModal(locationId);
}

function selectKingdom(locationId) {
    const location = getLocation(locationId);
    if (!location) return;
    currentLocation = locationId;
    kingdomSelect.value = locationId;
    updateSidebar(locationId);
    updateTopBar(locationId);
    document.querySelectorAll('.hotspot').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === locationId);
    });
}

function updateSidebar(locationId) {
    const location = getLocation(locationId);
    if (!location) return;
    const house = HOUSES[location.house];
    if (!house) return;
    
    requestAnimationFrame(() => {
        document.getElementById('kingdomSigil').textContent = location.sigil || Utils.getHouseSigil(location.house);
        document.getElementById('kingdomName').textContent = location.name;
        document.getElementById('kingdomHouse').textContent = house.name;
        document.getElementById('kingdomWords').textContent = house.words;
        
        const stats = house.stats || { population: 0, soldiers: 0, defense: 0, wood: 0, food: 0, gold: 0 };
        document.getElementById('statPopulation').textContent = stats.population || 0;
        document.getElementById('statSoldiers').textContent = stats.soldiers || 0;
        document.getElementById('statDefense').textContent = stats.defense || 0;
        document.getElementById('statWood').textContent = stats.wood || 0;
        document.getElementById('statFood').textContent = stats.food || 0;
        document.getElementById('statGold').textContent = stats.gold || 0;
        
        const bonusList = document.getElementById('bonusList');
        bonusList.innerHTML = '';
        if (house.bonuses && house.bonuses.length > 0) {
            house.bonuses.forEach(bonus => {
                const li = document.createElement('li');
                li.textContent = bonus;
                bonusList.appendChild(li);
            });
        }
        document.getElementById('loreQuote').textContent = house.lore || 'The North remembers.';
        document.getElementById('loreAttribution').textContent = `— ${house.name}`;
    });
}

function updateTopBar(locationId) {
    const location = getLocation(locationId);
    if (!location) return;
    const house = HOUSES[location.house];
    if (!house) return;
    
    requestAnimationFrame(() => {
        document.getElementById('topbarSigil').textContent = location.sigil || Utils.getHouseSigil(location.house);
        document.getElementById('topbarHouse').textContent = house.name;
        const stats = house.stats || { wood: 0, food: 0, gold: 0, soldiers: 0 };
        document.getElementById('topbarWood').textContent = stats.wood || 0;
        document.getElementById('topbarFood').textContent = stats.food || 0;
        document.getElementById('topbarGold').textContent = stats.gold || 0;
        document.getElementById('topbarSoldiers').textContent = stats.soldiers || 0;
    });
}

function showModal(locationId) {
    const location = getLocation(locationId);
    if (!location) return;
    const house = HOUSES[location.house];
    if (!house) return;
    
    document.getElementById('modalSigil').textContent = location.sigil || Utils.getHouseSigil(location.house);
    document.getElementById('modalTitle').textContent = location.name;
    document.getElementById('modalHouse').textContent = house.name;
    document.getElementById('modalWords').textContent = house.words;
    
    const stats = house.stats || { population: 0, soldiers: 0, defense: 0, wood: 0, food: 0, gold: 0 };
    document.getElementById('modalStats').innerHTML = `
        <p>👥 Population: ${stats.population || 0}</p>
        <p>⚔️ Soldiers: ${stats.soldiers || 0}</p>
        <p>🛡️ Defense: ${stats.defense || 0}</p>
        <p>🪵 Wood: ${stats.wood || 0}</p>
        <p>🍗 Food: ${stats.food || 0}</p>
        <p>🪙 Gold: ${stats.gold || 0}</p>
    `;
    document.getElementById('modalLore').textContent = house.lore || 'The North remembers.';
    document.getElementById('modalNavigate').dataset.location = locationId;
    
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('visible');
    document.body.style.overflow = '';
}

// ===== MODAL CONTROLS =====
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
});

// ===== MODAL NAVIGATE BUTTON - FIXED =====
document.getElementById('modalNavigate').addEventListener('click', function() {
    const locationId = this.dataset.location;
    const location = getLocation(locationId);
    if (!location) return;
    
    closeModal();
    
    // Check if this kingdom has a page built
    const targetPath = KINGDOM_PATHS[locationId];
    
    if (targetPath) {
        // Save which house was selected for the kingdom page
        sessionStorage.setItem('selectedHouse', location.house);
        sessionStorage.setItem('currentKingdom', locationId);
        
        // Show travel notification
        showNotification(`🐺 Traveling to ${location.name}...`);
        
        // Navigate after a short delay so the notification is visible
        setTimeout(() => {
            window.location.href = targetPath;
        }, 600);
    } else {
        // Kingdom not built yet
        showNotification(`⚠️ ${location.name} is not ready yet. Coming soon!`);
    }
});

function showNotification(message) {
    // Remove any existing notifications
    const existing = document.querySelector('.map-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'map-notification';
    notification.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px);
        background: rgba(5,3,2,0.92); border: 1px solid rgba(212,167,74,0.2);
        padding: 14px 30px; border-radius: 10px; color: var(--gold);
        font-family: 'Cinzel', serif; font-size: 0.9rem; letter-spacing: 2px;
        z-index: 200; opacity: 0; transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        backdrop-filter: blur(12px); box-shadow: 0 8px 40px rgba(0,0,0,0.6);
        pointer-events: none;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 500);
    }, 2500);
}

// ===== SIDEBAR CONTROLS =====
function toggleSidebar() {
    const isOpen = !sidebar.classList.contains('collapsed');
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
        sidebarToggleBtn.classList.add('visible');
        sidebarToggleBtn.innerHTML = '📖';
    } else {
        sidebarToggleBtn.classList.remove('visible');
        sidebarToggleBtn.innerHTML = '📜';
    }
}

sidebarToggle.addEventListener('click', toggleSidebar);
sidebarToggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleSidebar();
});

// ===== RETURN TO LANDING =====
returnBtn.addEventListener('click', function() {
    sessionStorage.removeItem('hasTransitioned');
    window.location.href = '/';
});

// ===== KINGDOM SELECT DROPDOWN =====
kingdomSelect.addEventListener('change', function() {
    selectKingdom(this.value);
});

// ===== ACTION BUTTONS =====
document.getElementById('actionAttack').addEventListener('click', function() {
    showNotification(`⚔️ Preparing attack on ${document.getElementById('kingdomName').textContent}...`);
});

document.getElementById('actionDefend').addEventListener('click', function() {
    showNotification(`🛡️ Reinforcing defenses at ${document.getElementById('kingdomName').textContent}...`);
});

document.getElementById('actionLore').addEventListener('click', function() {
    const location = getLocation(currentLocation);
    if (location) showModal(currentLocation);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Toggle sidebar with 'S' key
    if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleSidebar();
    }
});

// ===== INITIALIZE =====
function init() {
    console.log('🗺️ Westeros Map - Loading...');
    generateHotspots();
    selectKingdom('winterfell');
    if (sidebar.classList.contains('collapsed')) {
        sidebarToggleBtn.classList.add('visible');
        sidebarToggleBtn.innerHTML = '📖';
    }
    console.log('✅ Map loaded!');
    console.log('📋 Click a kingdom and press "Navigate to Kingdom" to enter!');
}

document.addEventListener('DOMContentLoaded', init);