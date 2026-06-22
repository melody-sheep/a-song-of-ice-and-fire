// ============================================
// LOCATIONS DATA - Westeros Map Coordinates
// ============================================

// All coordinates have been offset by:
// Left: +93px, Top: +53px (to match your Figma positioning)
// Casterly Rock: Left reduced by 86px, Top reduced by 15px

const LOCATIONS = {
    castleblack: {
        id: 'castleblack',
        name: 'Castle Black',
        house: 'nightswatch',
        sigil: '⚔️',
        x: 803,
        y: 100,
        region: 'The Wall',
        description: 'The headquarters of the Night\'s Watch, standing guard against the terrors beyond the Wall.',
        color: '#78909c'
    },
    winterfell: {
        id: 'winterfell',
        name: 'Winterfell',
        house: 'stark',
        sigil: '🐺',
        x: 735,
        y: 213,
        region: 'The North',
        description: 'The ancient seat of House Stark, where winter is always coming.',
        color: '#4fc3f7'
    },
    thevale: {
        id: 'thevale',
        name: 'The Vale',
        house: 'arryn',
        sigil: '🦅',
        x: 860,
        y: 400,
        region: 'The Vale of Arryn',
        description: 'The impregnable fortress of House Arryn, nestled high in the Mountains of the Moon.',
        color: '#4fc3f7'
    },
    westerlands: {
        id: 'westerlands',
        name: 'Casterly Rock',
        house: 'lannister',
        sigil: '🦁',
        x: 540,  // 626 - 86
        y: 470,  // 485 - 15
        region: 'The Westerlands',
        description: 'The golden seat of House Lannister, carved into a massive coastal rock formation.',
        color: '#ff1744'
    },
    dragonstone: {
        id: 'dragonstone',
        name: 'Dragonstone',
        house: 'targaryen',
        sigil: '🐉',
        x: 933,
        y: 468,
        region: 'The Narrow Sea',
        description: 'The ancient fortress of House Targaryen, built from dragonglass on a volcanic island.',
        color: '#ff6b35'
    },
    kingslanding: {
        id: 'kingslanding',
        name: "King's Landing",
        house: 'baratheon',
        sigil: '🦌',
        x: 823,
        y: 505,
        region: 'The Crownlands',
        description: 'The capital of the Seven Kingdoms, home to the Iron Throne and the Red Keep.',
        color: '#ffd700'
    },
    highgarden: {
        id: 'highgarden',
        name: 'Highgarden',
        house: 'tyrell',
        sigil: '🌹',
        x: 620,
        y: 616,
        region: 'The Reach',
        description: 'The beautiful seat of House Tyrell, surrounded by the fertile lands of the Reach.',
        color: '#66bb6a'
    },
    sunspear: {
        id: 'sunspear',
        name: 'Sunspear',
        house: 'martell',
        sigil: '☀️',
        x: 937,
        y: 714,
        region: 'Dorne',
        description: 'The southernmost stronghold of House Martell, where the sun shines brightest.',
        color: '#ff8f00'
    }
};

// Get location by ID
function getLocation(id) {
    return LOCATIONS[id] || null;
}

// Get all location IDs
function getAllLocationIds() {
    return Object.keys(LOCATIONS);
}

// Get all locations as array
function getAllLocations() {
    return Object.values(LOCATIONS);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LOCATIONS, getLocation, getAllLocationIds, getAllLocations };
}