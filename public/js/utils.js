// ============================================
// UTILITY FUNCTIONS - Shared Helpers
// ============================================

const Utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Get element position relative to viewport
    getElementPosition: function(el) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get random item from array
    randomItem: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    // Format number with commas
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Capitalize first letter
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // Generate a random ID
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },
    
    // Sleep/pause execution
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Get house color with opacity
    getHouseColor: function(houseId, opacity = 1) {
        const colors = {
            stark: `rgba(79, 195, 247, ${opacity})`,
            lannister: `rgba(255, 23, 68, ${opacity})`,
            targaryen: `rgba(255, 107, 53, ${opacity})`,
            baratheon: `rgba(255, 215, 0, ${opacity})`,
            greyjoy: `rgba(77, 208, 225, ${opacity})`,
            tyrell: `rgba(102, 187, 106, ${opacity})`,
            martell: `rgba(255, 143, 0, ${opacity})`,
            tully: `rgba(79, 195, 247, ${opacity})`,
            nightswatch: `rgba(120, 144, 156, ${opacity})`
        };
        return colors[houseId] || colors.stark;
    },
    
    // Get house sigil from ID
    getHouseSigil: function(houseId) {
        const sigils = {
            stark: '🐺',
            lannister: '🦁',
            targaryen: '🐉',
            baratheon: '🦌',
            greyjoy: '🦑',
            tyrell: '🌹',
            martell: '☀️',
            tully: '🐟',
            nightswatch: '⚔️'
        };
        return sigils[houseId] || '🏰';
    },
    
    // Get house words from ID
    getHouseWords: function(houseId) {
        const words = {
            stark: '"Winter is Coming"',
            lannister: '"Hear Me Roar!"',
            targaryen: '"Fire and Blood"',
            baratheon: '"Ours is the Fury"',
            greyjoy: '"We Do Not Sow"',
            tyrell: '"Growing Strong"',
            martell: '"Unbowed, Unbent, Unbroken"',
            tully: '"Family, Duty, Honor"',
            nightswatch: '"I Am the Shield That Guards the Realms of Men"'
        };
        return words[houseId] || '"Winter is Coming"';
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}