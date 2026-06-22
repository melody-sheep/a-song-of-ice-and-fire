// ============================================
// LORE SNIPPETS - Game of Thrones Quotes & Wisdom
// ============================================

const LORE_SNIPPETS = [
    { text: '"The lone wolf dies, but the pack survives."', attribution: '— Old Nan' },
    { text: '"When you play the game of thrones, you win or you die."', attribution: '— Cersei Lannister' },
    { text: '"Winter is coming. You know the words, but you don\'t know what they mean."', attribution: '— Old Nan' },
    { text: '"A mind needs books like a sword needs a whetstone."', attribution: '— Tyrion Lannister' },
    { text: '"Power resides where men believe it resides."', attribution: '— Varys' },
    { text: '"The night is dark and full of terrors."', attribution: '— Melisandre' },
    { text: '"All men must die, but we are not men."', attribution: '— Dothraki Sayings' },
    { text: '"What is dead may never die."', attribution: '— Greyjoy Saying' },
    { text: '"I am the shield that guards the realms of men."', attribution: '— Night\'s Watch Vow' },
    { text: '"The crown does not make the king."', attribution: '— Ned Stark' },
    { text: '"A dragon is not a slave."', attribution: '— Daenerys Targaryen' },
    { text: '"Chaos is a ladder."', attribution: '— Petyr Baelish' },
    { text: '"The North remembers."', attribution: '— Stark House Words' },
    { text: '"Valar morghulis."', attribution: '— High Valyrian' },
    { text: '"Valar dohaeris."', attribution: '— High Valyrian' },
    { text: '"A man who reads lives a thousand lives."', attribution: '— Old Saying' },
    { text: '"The only thing worth writing about is the human heart in conflict with itself."', attribution: '— Maester Aemon' },
    { text: '"I have a tender spot in my heart for cripples and bastards and broken things."', attribution: '— Tyrion Lannister' },
    { text: '"There is no creature on earth half so terrifying as a truly just man."', attribution: '— Varys' },
    { text: '"The man who passes the sentence should swing the sword."', attribution: '— Ned Stark' },
    { text: '"Fear cuts deeper than swords."', attribution: '— Syrio Forel' },
    { text: '"The things I do for love."', attribution: '— Jaime Lannister' },
    { text: '"It is not a question of wanting. It is a question of doing."', attribution: '— Daenerys Targaryen' },
    { text: '"Sometimes the best way to baffle them is to make moves that have no purpose."', attribution: '— Littlefinger' },
    { text: '"A lion does not concern himself with the opinions of sheep."', attribution: '— Tywin Lannister' }
];

const TAGLINES = [
    '"The world is full of stories, but the best ones are written in ice and fire."',
    '"Winter is Coming"',
    '"Fire and Blood"',
    '"The North Remembers"',
    '"Hear Me Roar!"',
    '"We Do Not Sow"',
    '"Growing Strong"',
    '"Unbowed, Unbent, Unbroken"',
    '"Family, Duty, Honor"',
    '"Ours is the Fury"',
    '"A Lannister Always Pays His Debts"',
    '"What is Dead May Never Die"',
    '"The Night is Dark and Full of Terrors"',
    '"Valar Morghulis"',
    '"The Dragon Has Three Heads"'
];

// Get random lore snippet
function getRandomLore() {
    return LORE_SNIPPETS[Math.floor(Math.random() * LORE_SNIPPETS.length)];
}

// Get random tagline
function getRandomTagline() {
    return TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LORE_SNIPPETS, TAGLINES, getRandomLore, getRandomTagline };
}