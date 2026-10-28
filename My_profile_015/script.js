const greetingBtn = document.getElementById('greetingBtn');
const message = document.getElementById('greetingmassege');
const img = document.getElementById('img');
 img

const originalMessage = message.textContent;
let resetTimer = null;

function createSparkles(x, y) {
    const sparkleCount = 35;
    const symbols = ['✨', '⭐', '🌟', '💖', '✦', '✧', '💫'];
    const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#FFFFFF', '#FF85EA', '#FFA500'];

    for (let i = 0; i < sparkleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'sparkle-particle';
        
        
        const isSymbol = Math.random() > 0.35;
        if (isSymbol) {
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.fontSize = (Math.random() * 16 + 14) + 'px';
        } else {
            const size = Math.random() * 8 + 6;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.borderRadius = '50%';
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 12px ${color}, 0 0 20px #fff`;
        }

        
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 140 + 40;
        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--dx', `${destX}px`);
        particle.style.setProperty('--dy', `${destY}px`);

        document.body.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

greetingBtn.addEventListener('click', function(e) {
    
    message.textContent = 'สวัสดีครับ ยินดีที่รู้จัก ✨💖';

    
    message.classList.remove('sparkle-text');
    greetingBtn.classList.remove('btn-sparkle');
    void message.offsetWidth;
    void greetingBtn.offsetWidth;
    message.classList.add('sparkle-text');
    greetingBtn.classList.add('btn-sparkle');

    
    const rect = greetingBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    createSparkles(centerX, centerY);

    
    if (resetTimer) {
        clearTimeout(resetTimer);
    }

    
    resetTimer = setTimeout(function() {
        message.textContent = originalMessage;
        message.classList.remove('sparkle-text');
        greetingBtn.classList.remove('btn-sparkle');
    }, 20000);
});


