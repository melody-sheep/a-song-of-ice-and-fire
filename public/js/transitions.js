// ============================================
// TRANSITION SYSTEM - Simple Fade
// ============================================

const TransitionSystem = {
    isTransitioning: false,
    
    transitionToMap: function(selectedHouse) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        // Store in session so button works after returning
        sessionStorage.setItem('hasTransitioned', 'true');
        
        const house = HOUSES[selectedHouse];
        
        // Create fade overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #050302;
            z-index: 999;
            opacity: 0;
            transition: opacity 0.8s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // House name message
        const message = document.createElement('div');
        message.style.cssText = `
            color: ${house.color};
            font-family: 'Cinzel', serif;
            font-size: 2.5rem;
            letter-spacing: 8px;
            text-shadow: 0 0 60px ${house.color}44, 0 0 120px ${house.color}22, 0 2px 40px rgba(0,0,0,0.9);
            text-align: center;
            line-height: 1.6;
            opacity: 0;
            transition: opacity 0.6s ease;
            pointer-events: none;
        `;
        message.innerHTML = `
            ${house.sigil} ${house.name}
            <div style="font-size: 1.1rem; color: rgba(196,163,90,0.4); letter-spacing: 5px; margin-top: 8px; font-family: 'Lora', serif; font-style: italic; text-shadow: 0 2px 20px rgba(0,0,0,0.9);">
                ${house.words}
            </div>
        `;
        overlay.appendChild(message);
        document.body.appendChild(overlay);
        
        // Step 1: Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        // Step 2: Show message
        setTimeout(() => {
            message.style.opacity = '1';
        }, 300);
        
        // Step 3: Navigate to map
        setTimeout(() => {
            window.location.href = '/map.html';
        }, 1200);
        
        // Cleanup
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            this.isTransitioning = false;
        }, 1500);
    }
};

// Reset transition flag on page load
document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('hasTransitioned')) {
        // Button will be re-enabled by main.js
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitionSystem;
}