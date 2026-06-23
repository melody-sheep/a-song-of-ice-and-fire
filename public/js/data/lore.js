// ============================================
// LORE DATA - Westeros Quotes & Wisdom
// ============================================

const LORE_SNIPPETS = [
    // === Stark / North ===
    {
        text: '"Winter is coming. You know the words. You\'ve known them all your life."',
        attribution: 'Old Nan'
    },
    {
        text: '"The North remembers, and this mummer\'s farce is almost done."',
        attribution: 'Wyman Manderly'
    },
    {
        text: '"The lone wolf dies, but the pack survives."',
        attribution: 'Sansa Stark'
    },
    {
        text: '"There is only one war that matters. The Great War. And it is here."',
        attribution: 'Jon Snow'
    },
    {
        text: '"Winter is coming. The dead are coming. And we are not ready."',
        attribution: 'Jon Snow'
    },
    {
        text: '"When the snows fall and the white winds blow, the lone wolf dies, but the pack survives."',
        attribution: 'Sansa Stark'
    },
    
    // === Lannister ===
    {
        text: '"A Lannister always pays his debts."',
        attribution: 'House Lannister saying'
    },
    {
        text: '"When you play the game of thrones, you win or you die."',
        attribution: 'Cersei Lannister'
    },
    {
        text: '"The lion does not concern himself with the opinions of sheep."',
        attribution: 'Tywin Lannister'
    },
    {
        text: '"Power is power."',
        attribution: 'Cersei Lannister'
    },
    {
        text: '"A king who sits on the Iron Throne does not rule. The king who rules is the one who holds the sword."',
        attribution: 'Tywin Lannister'
    },
    
    // === Targaryen ===
    {
        text: '"Fire and blood. I am the blood of the dragon."',
        attribution: 'Daenerys Targaryen'
    },
    {
        text: '"The dragon has three heads."',
        attribution: 'Targaryen prophecy'
    },
    {
        text: '"I am the dragon\'s daughter, and I swear to you that those who would harm you will die screaming."',
        attribution: 'Daenerys Targaryen'
    },
    {
        text: '"A dragon is not a slave."',
        attribution: 'Daenerys Targaryen'
    },
    
    // === Baratheon ===
    {
        text: '"Ours is the fury."',
        attribution: 'Robert Baratheon'
    },
    {
        text: '"In the storm, we find our strength."',
        attribution: 'House Baratheon saying'
    },
    
    // === Greyjoy ===
    {
        text: '"What is dead may never die."',
        attribution: 'Ironborn saying'
    },
    {
        text: '"We do not sow."',
        attribution: 'House Greyjoy words'
    },
    {
        text: '"The ironborn are made of iron, and we do not break."',
        attribution: 'Ironborn saying'
    },
    
    // === Tyrell ===
    {
        text: '"Growing strong."',
        attribution: 'House Tyrell words'
    },
    {
        text: '"The reach is vast, and the roses bloom in all seasons."',
        attribution: 'House Tyrell saying'
    },
    
    // === Martell ===
    {
        text: '"Unbowed, unbent, unbroken."',
        attribution: 'House Martell words'
    },
    {
        text: '"The sun of Dorne shines bright and warm."',
        attribution: 'Dornish saying'
    },
    
    // === Tully ===
    {
        text: '"Family, duty, honor."',
        attribution: 'House Tully words'
    },
    {
        text: '"The river runs deep, and the fish swim strong."',
        attribution: 'House Tully saying'
    },
    
    // === Night's Watch ===
    {
        text: '"I am the sword in the darkness. I am the watcher on the walls."',
        attribution: 'The Night\'s Watch Oath'
    },
    {
        text: '"I am the fire that burns against the cold, the light that brings the dawn."',
        attribution: 'The Night\'s Watch Oath'
    },
    {
        text: '"The Wall stands, and the Watch endures."',
        attribution: 'The Night\'s Watch saying'
    },
    {
        text: '"We are the shield that guards the realms of men."',
        attribution: 'The Night\'s Watch Oath'
    },
    
    // === General Wisdom ===
    {
        text: '"A man who reads lives many lives. A man who doesn\'t lives but one."',
        attribution: 'Maester Aemon'
    },
    {
        text: '"The best stories are the ones with dragons."',
        attribution: 'Tyrion Lannister'
    },
    {
        text: '"All men must die. But we are not all men."',
        attribution: 'Faceless Men saying'
    },
    {
        text: '"The night is dark and full of terrors."',
        attribution: 'Lord of Light prayer'
    },
    {
        text: '"The world is full of stories, but the best ones are written in ice and fire."',
        attribution: 'Old Nan'
    },
    {
        text: '"There is no creature on earth half so terrifying as a truly just man."',
        attribution: 'Varys'
    },
    {
        text: '"A mind needs books as a sword needs a whetstone."',
        attribution: 'Tyrion Lannister'
    },
    {
        text: '"The common people pray for rain, health, and a summer that never ends."',
        attribution: 'Jorah Mormont'
    },
    {
        text: '"The things I do for love."',
        attribution: 'Jaime Lannister'
    },
    {
        text: '"Hodor."',
        attribution: 'Hodor'
    },
    {
        text: '"You know nothing, Jon Snow."',
        attribution: 'Ygritte'
    },
    {
        text: '"Chaos isn\'t a pit. Chaos is a ladder."',
        attribution: 'Petyr Baelish'
    },
    {
        text: '"The pack survives."',
        attribution: 'Sansa Stark'
    },
    {
        text: '"Valar morghulis."',
        attribution: 'Faceless Men saying'
    },
    {
        text: '"Valar dohaeris."',
        attribution: 'Faceless Men saying'
    }
];

const TAGLINES = [
    'The world is full of stories, but the best ones are written in ice and fire.',
    'In the game of thrones, you win or you die.',
    'The North remembers. The South forgets. But the realm endures.',
    'When the snows fall and the white winds blow, the lone wolf dies, but the pack survives.',
    'A man who reads lives many lives.',
    'There is only one war that matters: The Great War.',
    'The dead are coming. And winter is here.',
    'Fire and blood. Ice and steel. The world is made of contrasts.',
    'All men must die. But we are not all men.',
    'The night is dark and full of terrors.',
    'Winter is coming. Always. The cold winds are rising.',
    'The realm is vast, and the stories are endless.',
    'From the Wall to Dorne, a thousand tales await.',
    'The ravens carry the news. The lords make the decisions. The soldiers die.',
    'The Great War is coming. Are you prepared?',
    'In the end, the only thing that matters is what you leave behind.',
    'The Seven Kingdoms are at peace. For now.',
    'The old gods and the new watch over us all.',
    'Dragons. Direwolves. Giants. The world is full of wonders.',
    'The Maesters say... the Maesters always have something to say.'
];

// Get random lore snippet
function getRandomLore() {
    return LORE_SNIPPETS[Math.floor(Math.random() * LORE_SNIPPETS.length)];
}

// Get random tagline
function getRandomTagline() {
    return TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
}

// Get lore by index (for rotation)
function getLoreByIndex(index) {
    return LORE_SNIPPETS[index % LORE_SNIPPETS.length];
}

// Get tagline by index (for rotation)
function getTaglineByIndex(index) {
    return TAGLINES[index % TAGLINES.length];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LORE_SNIPPETS,
        TAGLINES,
        getRandomLore,
        getRandomTagline,
        getLoreByIndex,
        getTaglineByIndex
    };
}