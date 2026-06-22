// ============================================
// HOUSE DATA - All Major Houses of Westeros
// ============================================

const HOUSES = {
    stark: {
        id: 'stark',
        name: 'House Stark',
        sigil: '🐺',
        words: '"Winter is Coming"',
        color: '#4fc3f7',
        region: 'The North',
        lore: 'The North remembers. Honor. Duty. Family. The lone wolf dies, but the pack survives.',
        bonuses: ['+20% Food Production', '+10% Defense'],
        stats: { population: 15, soldiers: 10, defense: 20, wood: 150, food: 120, gold: 80 }
    },
    lannister: {
        id: 'lannister',
        name: 'House Lannister',
        sigil: '🦁',
        words: '"Hear Me Roar!"',
        color: '#ff1744',
        region: 'The Westerlands',
        lore: 'A Lannister always pays his debts. Gold. Power. Cunning. The lion does not concern himself with the opinions of sheep.',
        bonuses: ['+20% Gold Production', '-10% Build Cost'],
        stats: { population: 18, soldiers: 12, defense: 25, wood: 100, food: 90, gold: 200 }
    },
    targaryen: {
        id: 'targaryen',
        name: 'House Targaryen',
        sigil: '🐉',
        words: '"Fire and Blood"',
        color: '#ff6b35',
        region: 'The Crownlands',
        lore: 'The dragon has three heads. Legacy. Fire. Conquest. I am the blood of the dragon.',
        bonuses: ['+20% Army Attack Power', '+10% Raid Rewards'],
        stats: { population: 12, soldiers: 15, defense: 18, wood: 80, food: 70, gold: 120 }
    },
    baratheon: {
        id: 'baratheon',
        name: 'House Baratheon',
        sigil: '🦌',
        words: '"Ours is the Fury"',
        color: '#ffd700',
        region: 'The Stormlands',
        lore: 'Storms rage. Strength. Ferocity. Determination. In the storm, we find our strength.',
        bonuses: ['+15% Defense', '+15% Army Size'],
        stats: { population: 14, soldiers: 13, defense: 22, wood: 110, food: 100, gold: 90 }
    },
    greyjoy: {
        id: 'greyjoy',
        name: 'House Greyjoy',
        sigil: '🦑',
        words: '"We Do Not Sow"',
        color: '#4dd0e1',
        region: 'The Iron Islands',
        lore: 'What is dead may never die. Iron. Reaving. Independence. We are the ironborn.',
        bonuses: ['+20% Raid Rewards', '+10% Raid Speed'],
        stats: { population: 10, soldiers: 14, defense: 15, wood: 60, food: 50, gold: 100 }
    },
    tyrell: {
        id: 'tyrell',
        name: 'House Tyrell',
        sigil: '🌹',
        words: '"Growing Strong"',
        color: '#66bb6a',
        region: 'The Reach',
        lore: 'The reach is vast. Beauty. Plenty. Ambition. Growing strong in all seasons.',
        bonuses: ['+15% Food Production', '+15% Gold Production'],
        stats: { population: 20, soldiers: 8, defense: 16, wood: 130, food: 180, gold: 140 }
    },
    martell: {
        id: 'martell',
        name: 'House Martell',
        sigil: '☀️',
        words: '"Unbowed, Unbent, Unbroken"',
        color: '#ff8f00',
        region: 'Dorne',
        lore: 'The sun of Dorne. Pride. Passion. Resilience. We do not kneel.',
        bonuses: ['+10% All Production', 'Resistance to Raids'],
        stats: { population: 13, soldiers: 11, defense: 20, wood: 90, food: 110, gold: 130 }
    },
    tully: {
        id: 'tully',
        name: 'House Tully',
        sigil: '🐟',
        words: '"Family, Duty, Honor"',
        color: '#4fc3f7',
        region: 'The Riverlands',
        lore: 'The river runs deep. Loyalty. Integrity. Service. Family comes first.',
        bonuses: ['+10% Defense', '+10% Population Growth'],
        stats: { population: 16, soldiers: 9, defense: 18, wood: 120, food: 130, gold: 70 }
    },
    arryn: {
        id: 'arryn',
        name: 'House Arryn',
        sigil: '🦅',
        words: '"As High as Honor"',
        color: '#4fc3f7',
        region: 'The Vale of Arryn',
        lore: 'The Eyrie is impregnable. Honor. Duty. Justice. As high as honor.',
        bonuses: ['+20% Defense', '+10% Army Size'],
        stats: { population: 12, soldiers: 10, defense: 30, wood: 100, food: 90, gold: 100 }
    },
    nightswatch: {
        id: 'nightswatch',
        name: 'The Night\'s Watch',
        sigil: '⚔️',
        words: '"I Am the Shield That Guards the Realms of Men"',
        color: '#78909c',
        region: 'The Wall',
        lore: 'I am the sword in the darkness. I am the watcher on the walls. I am the fire that burns against the cold.',
        bonuses: ['+50% Defense', '-50% Raid Rewards'],
        stats: { population: 8, soldiers: 20, defense: 40, wood: 50, food: 40, gold: 30 }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HOUSES;
}