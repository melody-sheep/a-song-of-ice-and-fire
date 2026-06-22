// ============================================
// CLOUD SYSTEM - Shared Cloud Logic
// ============================================

const CloudSystem = {
    // Generate map clouds - 20 clouds with varied opacity
    generateMapClouds: function() {
        const container = document.getElementById('map-clouds-layer');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 20 cloud configurations with varied sizes, speeds, and opacities
        const cloudConfigs = [
            // Large, slow clouds (more visible)
            { width: 500, height: 180, top: '5%', dir: 'left', duration: 110, opacity: 0.18, img: 'cloud1' },
            { width: 450, height: 160, top: '15%', dir: 'right', duration: 100, opacity: 0.20, img: 'cloud2' },
            { width: 480, height: 170, top: '30%', dir: 'left', duration: 120, opacity: 0.16, img: 'cloud3' },
            { width: 420, height: 150, top: '50%', dir: 'right', duration: 105, opacity: 0.22, img: 'cloud1' },
            { width: 460, height: 165, top: '70%', dir: 'left', duration: 115, opacity: 0.18, img: 'cloud2' },
            
            // Medium clouds
            { width: 320, height: 120, top: '8%', dir: 'right', duration: 80, opacity: 0.25, img: 'cloud2' },
            { width: 300, height: 110, top: '22%', dir: 'left', duration: 75, opacity: 0.28, img: 'cloud3' },
            { width: 350, height: 130, top: '40%', dir: 'right', duration: 85, opacity: 0.22, img: 'cloud1' },
            { width: 280, height: 105, top: '55%', dir: 'left', duration: 70, opacity: 0.30, img: 'cloud2' },
            { width: 330, height: 125, top: '75%', dir: 'right', duration: 90, opacity: 0.24, img: 'cloud3' },
            { width: 310, height: 115, top: '10%', dir: 'left', duration: 78, opacity: 0.26, img: 'cloud1' },
            { width: 340, height: 128, top: '45%', dir: 'right', duration: 82, opacity: 0.20, img: 'cloud2' },
            { width: 290, height: 108, top: '62%', dir: 'left', duration: 72, opacity: 0.28, img: 'cloud3' },
            
            // Smaller, faster clouds
            { width: 220, height: 85, top: '3%', dir: 'right', duration: 55, opacity: 0.35, img: 'cloud1' },
            { width: 200, height: 80, top: '18%', dir: 'left', duration: 50, opacity: 0.32, img: 'cloud2' },
            { width: 240, height: 90, top: '35%', dir: 'right', duration: 58, opacity: 0.30, img: 'cloud3' },
            { width: 210, height: 82, top: '48%', dir: 'left', duration: 52, opacity: 0.35, img: 'cloud1' },
            { width: 230, height: 88, top: '60%', dir: 'right', duration: 56, opacity: 0.30, img: 'cloud2' },
            { width: 250, height: 95, top: '80%', dir: 'left', duration: 60, opacity: 0.28, img: 'cloud3' },
            { width: 200, height: 78, top: '90%', dir: 'right', duration: 48, opacity: 0.32, img: 'cloud1' }
        ];
        
        cloudConfigs.forEach((config, index) => {
            const el = document.createElement('div');
            el.className = `map-cloud map-cloud-${index + 1}`;
            const dir = config.dir === 'left' ? 'driftCloudLeft' : 'driftCloudRight';
            const startPos = config.dir === 'left' ? -config.width : window.innerWidth + config.width;
            
            el.style.cssText = `
                width: ${config.width}px;
                height: ${config.height}px;
                top: ${config.top};
                ${config.dir === 'left' ? 'left: -' + config.width + 'px;' : 'right: -' + config.width + 'px;'}
                background-image: url('/assets/images/clouds/${config.img}.png');
                opacity: ${config.opacity};
                --duration: ${config.duration}s;
                animation: ${dir} ${config.duration}s linear infinite;
                animation-delay: ${(Math.random() * 20)}s;
            `;
            container.appendChild(el);
        });
    },
    
    // Preload cloud images
    preloadClouds: function() {
        const cloudImages = ['cloud1.png', 'cloud2.png', 'cloud3.png'];
        cloudImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = `/assets/images/clouds/${img}`;
            document.head.appendChild(link);
        });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    CloudSystem.preloadClouds();
    if (document.getElementById('map-clouds-layer')) {
        setTimeout(() => {
            CloudSystem.generateMapClouds();
        }, 100);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudSystem;
}