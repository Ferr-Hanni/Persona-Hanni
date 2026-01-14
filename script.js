// ========================================
// PERFORMANCE UTILITIES
// ========================================

// Debounce function untuk optimize event handlers
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if mobile
const isMobile = window.innerWidth < 768;

// ========================================
// CONFIG DATA
// ========================================

const normalState = {
    subtitle: "Hanni the Idol 🌟",
    bubble: "Naurrr! ~",
    cards: [
        { title: "Viet-Aussie", text: "Logat Australia yang ikonik & multibahasa jenius.", icon: "🇦🇺" },
        { title: "Honey Voice", text: "Suara yang manis seperti madu & dance yang swag.", icon: "🎤" },
        { title: "Bread Lover", text: "Sangat terobsesi dengan roti. Roti is life.", icon: "🥖" }
    ]
};

const potatoState = {
    subtitle: "Soft & Cozy Hanni 💕",
    bubble: "Feels like a warm hug~",
    cards: [
        { title: "Sweet Soul", text: "Kepribadian yang hangat dan menenangkan seperti secangkir teh.", icon: "🫖" },
        { title: "Gentle Heart", text: "Selalu memberikan vibes yang lembut dan caring ke semua orang.", icon: "🌸" },
        { title: "Cozy Vibes", text: "Kehadiran yang bikin nyaman, seperti pelukan di hari yang dingin.", icon: "🧸" }
    ]
};

const darkState = {
    subtitle: "Night Owl Hanni 🌙",
    bubble: "Midnight vibes~",
    cards: [
        { title: "Moon Child", text: "Energi malam yang tenang, perfect untuk late night talks.", icon: "🌙" },
        { title: "Starlight", text: "Bersinar lembut di kegelapan, memberikan cahaya yang menenangkan.", icon: "⭐" },
        { title: "Dream Maker", text: "Menciptakan suasana yang peaceful dan dreamy di malam hari.", icon: "💫" }
    ]
};

let isPotatoMode = false;
let isDarkMode = false;

// ========================================
// DOM ELEMENTS
// ========================================

const body = document.body;
const modeBtn = document.getElementById('mode-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const hanniImg = document.getElementById('hanni-img');
const heroSubtitle = document.getElementById('hero-subtitle');
const speechBubble = document.getElementById('speech-bubble');
const cards = [
    document.getElementById('card-1'),
    document.getElementById('card-2'),
    document.getElementById('card-3')
];

// ========================================
// MODE SWITCHING
// ========================================

function switchToMode(targetMode) {
    // Reset all modes
    isPotatoMode = false;
    isDarkMode = false;
    body.classList.remove('potato-mode', 'dark-mode');
    
    let currentState = normalState;
    
    if (targetMode === 'potato') {
        isPotatoMode = true;
        body.classList.add('potato-mode');
        modeBtn.innerText = "✨ Idol Mode";
        darkModeBtn.innerText = "🌙 Dark Mode";
        currentState = potatoState;
    } else if (targetMode === 'dark') {
        isDarkMode = true;
        body.classList.add('dark-mode');
        darkModeBtn.innerText = "☀️ Light Mode";
        modeBtn.innerText = "💕 Cozy Mode";
        currentState = darkState;
    } else {
        modeBtn.innerText = "💕 Cozy Mode";
        darkModeBtn.innerText = "🌙 Dark Mode";
        currentState = normalState;
    }
    
    // Update content
    heroSubtitle.innerText = currentState.subtitle;
    speechBubble.innerText = currentState.bubble;
    
    // Update cards
    cards.forEach((card, index) => {
        const data = currentState.cards[index];
        card.querySelector('h3').innerText = data.title;
        card.querySelector('p').innerText = data.text;
        card.querySelector('.card-icon').innerText = data.icon;
        
        if (isPotatoMode) {
            const randomRot = Math.random() * 6 - 3;
            card.style.setProperty('--rotation', `${randomRot}deg`);
        } else {
            card.style.removeProperty('--rotation');
        }
    });
}

// Mode button handlers
if (modeBtn) {
    modeBtn.addEventListener('click', () => {
        if (isPotatoMode) {
            switchToMode('normal');
        } else {
            switchToMode('potato');
        }
    });
}

if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        if (isDarkMode) {
            switchToMode('normal');
        } else {
            switchToMode('dark');
        }
    });
}

// ========================================
// STICKER DECO AREA
// ========================================

const stickerCanvas = document.querySelector('.sticker-canvas');
const stickers = ["🎀", "🐰", "💖", "🧢", "✨", "💙", "🍞", "🔥", "⭐", "🌸"];

if (stickerCanvas) {
    const addSticker = (e) => {
        const rect = stickerCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const el = document.createElement('div');
        el.classList.add('sticker');
        el.innerText = stickers[Math.floor(Math.random() * stickers.length)];
        
        const randomRot = Math.random() * 40 - 20;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.setProperty('--rot', `${randomRot}deg`);

        stickerCanvas.appendChild(el);

        // Limit stickers to prevent performance issues
        if (stickerCanvas.children.length > 25) {
            stickerCanvas.removeChild(stickerCanvas.children[1]);
        }
    };
    
    stickerCanvas.addEventListener('click', addSticker);
}

// ========================================
// FORTUNE COOKIE
// ========================================

const fortuneBtn = document.getElementById('fortune-btn');
const fortuneText = document.getElementById('fortune-text');
const fortuneCookie = document.getElementById('fortune-cookie');
const fortuneCount = document.getElementById('fortune-count');

let fortunesCollected = 0;

const fortunes = [
    "🍞 Today is a good day to eat bread! Carbs = happiness!",
    "🎤 Your voice will shine brighter than the sun today!",
    "🐰 A bunny will bring you good luck! (It's me, hehe~)",
    "💕 Someone is thinking about you right now... Naurrr~!",
    "🌟 You're gonna slay today! Main character energy!",
    "🥔 Embrace your inner potato. Rest is productive too!",
    "✨ Your vibe attracts your tribe. Keep shining!",
    "🎀 Pink energy incoming! Something cute will happen!",
    "🍞 Life tip: When in doubt, add more bread!",
    "🎵 Music will save your day today. Play your fave song!",
    "💙 Wear something blue today. Trust Hanni on this!",
    "🌸 Stop and smell the flowers. Life's too short!",
    "🔥 Your charisma level: 100! Use it wisely!",
    "🧢 Fashion tip: Confidence is the best accessory!",
    "🌈 Your rainbow moment is coming. Stay positive!",
    "😴 It's okay to be tired. Rest, queen/king!",
    "🎨 Create something today. Even a doodle counts!",
    "🍕 Treat yourself today. You deserve it!",
    "💫 The universe is conspiring in your favor!",
    "🎭 Life is a stage. Perform your best act today!"
];

function crackFortune() {
    fortuneCookie.style.transform = "rotate(20deg) scale(0.8)";
    
    setTimeout(() => {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        fortuneText.innerText = randomFortune;
        fortunesCollected++;
        fortuneCount.innerText = fortunesCollected;
        
        fortuneCookie.style.transform = "rotate(0deg) scale(1)";
        
        const paper = document.getElementById('fortune-paper');
        paper.style.transform = "scale(1.05)";
        paper.style.background = "#FFF9C4";
        
        setTimeout(() => {
            paper.style.transform = "scale(1)";
        }, 300);
    }, 300);
}

if (fortuneBtn) {
    fortuneBtn.addEventListener('click', crackFortune);
}

if (fortuneCookie) {
    fortuneCookie.addEventListener('click', crackFortune);
}

// ========================================
// BREAD CLICKER GAME
// ========================================

const breadClicker = document.getElementById('bread-clicker');
const breadCountDisplay = document.getElementById('bread-count');
const clickPowerDisplay = document.getElementById('click-power');
const breadLevelDisplay = document.getElementById('bread-level');

let breadCount = 0;
let clickPower = 1;

const breadLevels = [
    { threshold: 0, name: "Bread Rookie" },
    { threshold: 50, name: "Bread Fan" },
    { threshold: 150, name: "Bread Lover" },
    { threshold: 300, name: "Bread Addict" },
    { threshold: 500, name: "Bread Master" },
    { threshold: 1000, name: "Bread Legend" }
];

function updateBreadLevel() {
    for (let i = breadLevels.length - 1; i >= 0; i--) {
        if (breadCount >= breadLevels[i].threshold) {
            breadLevelDisplay.innerText = breadLevels[i].name;
            break;
        }
    }
}

function createFloatingBread(x, y) {
    const floater = document.createElement('div');
    floater.innerText = `+${clickPower} 🍞`;
    floater.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 1.5rem;
        font-weight: bold;
        color: #D35400;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 1s ease-out;
    `;
    
    document.body.appendChild(floater);
    
    setTimeout(() => {
        floater.remove();
    }, 1000);
}

if (breadClicker) {
    breadClicker.addEventListener('click', (e) => {
        breadCount += clickPower;
        breadCountDisplay.innerText = breadCount;
        
        // Animation
        breadClicker.style.transform = 'scale(0.9) rotate(-10deg)';
        setTimeout(() => {
            breadClicker.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
        
        // Floating text
        createFloatingBread(e.clientX, e.clientY);
        
        // Update level & buttons
        updateBreadLevel();
        updateUpgradeButtons();
    });
}

// ========================================
// UPGRADE SYSTEM
// ========================================

const upgradeButtons = document.querySelectorAll('.upgrade-btn');

function updateUpgradeButtons() {
    upgradeButtons.forEach(btn => {
        const cost = parseInt(btn.getAttribute('data-cost'));
        btn.disabled = breadCount < cost;
    });
}

upgradeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const cost = parseInt(btn.getAttribute('data-cost'));
        const power = parseInt(btn.getAttribute('data-power'));
        
        if (breadCount >= cost) {
            breadCount -= cost;
            clickPower += power;
            breadCountDisplay.innerText = breadCount;
            clickPowerDisplay.innerText = clickPower;
            
            // Update cost (increase by 1.5x)
            const newCost = Math.floor(cost * 1.5);
            btn.setAttribute('data-cost', newCost);
            btn.querySelector('.upgrade-cost').innerText = `Cost: ${newCost}🍞`;
            
            // Animation
            btn.style.transform = 'scale(1.1)';
            btn.style.background = '#90EE90';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
                btn.style.background = '';
            }, 200);
            
            updateUpgradeButtons();
        }
    });
});

// ========================================
// PHOTO BOOTH
// ========================================

const photoFrame = document.getElementById('photo-frame');
const boothImg = document.getElementById('booth-img');
const frameOverlay = document.getElementById('frame-overlay');
const photoStickersContainer = document.getElementById('photo-stickers');

// Frame buttons
const frameBtns = document.querySelectorAll('.frame-btn');
frameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        frameBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const frame = btn.getAttribute('data-frame');
        frameOverlay.className = 'frame-overlay';
        
        if (frame !== 'none') {
            frameOverlay.classList.add(`frame-${frame}`);
        }
    });
});

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        boothImg.className = '';
        
        if (filter !== 'none') {
            boothImg.classList.add(`filter-${filter}`);
        }
    });
});

// Draggable stickers function
function makeStickerDraggable(sticker) {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;

    sticker.addEventListener('mousedown', dragStart);
    sticker.addEventListener('touchstart', dragStart);

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === sticker) {
            isDragging = true;
            sticker.style.zIndex = 1000;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            const rotation = sticker.style.getPropertyValue('--rot') || '0deg';
            sticker.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation})`;
        }
    }

    function dragEnd() {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            sticker.style.zIndex = '';
        }
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
}

// Add stickers to photo
const addStickerBtns = document.querySelectorAll('.add-sticker-btn');
addStickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const stickerText = btn.getAttribute('data-sticker');
        
        const sticker = document.createElement('div');
        sticker.className = 'photo-sticker';
        sticker.innerText = stickerText;
        
        const randomX = Math.random() * 70 + 10;
        const randomY = Math.random() * 70 + 10;
        const randomRot = Math.random() * 40 - 20;
        
        sticker.style.left = randomX + '%';
        sticker.style.top = randomY + '%';
        sticker.style.transform = `rotate(${randomRot}deg)`;
        sticker.style.setProperty('--rot', `${randomRot}deg`);
        
        photoStickersContainer.appendChild(sticker);
        makeStickerDraggable(sticker);
        
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// Clear stickers
const clearStickersBtn = document.getElementById('clear-stickers');
if (clearStickersBtn) {
    clearStickersBtn.addEventListener('click', () => {
        photoStickersContainer.innerHTML = '';
    });
}

// ========================================
// MUSIC PLAYER
// ========================================

const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-pause-btn');
const visualizer = document.getElementById('visualizer');
const volumeSlider = document.getElementById('volume-slider');

let isPlaying = false;

function toggleMusic() {
    if (!audio) return;

    if (isPlaying) {
        audio.pause();
        playBtn.innerText = "▶";
        visualizer.classList.remove('playing');
        isPlaying = false;
    } else {
        audio.play().then(() => {
            playBtn.innerText = "⏸";
            visualizer.classList.add('playing');
            isPlaying = true;
        }).catch(error => {
            console.log("Autoplay prevented. Click play button to start.");
        });
    }
}

if (playBtn) {
    playBtn.addEventListener('click', toggleMusic);
}

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        if (audio) audio.volume = e.target.value;
    });
}

// Don't auto-play on mobile to save bandwidth
if (!isMobile && audio) {
    window.addEventListener('load', () => {
        audio.volume = 0.5;
        audio.play().then(() => {
            playBtn.innerText = "⏸";
            visualizer.classList.add('playing');
            isPlaying = true;
        }).catch(() => {
            console.log("Waiting for user interaction to play music.");
        });
    });
}

// ========================================
// OUTFIT PICKER
// ========================================

const outfitBtns = document.querySelectorAll('.outfit-btn');

outfitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const newSrc = btn.getAttribute('data-img');
        
        hanniImg.style.opacity = "0";
        hanniImg.style.transform = "scale(0.9)";
        
        setTimeout(() => {
            hanniImg.src = newSrc;
            hanniImg.style.opacity = "1";
            hanniImg.style.transform = "scale(1)";
        }, 200);
    });
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize
updateUpgradeButtons();

console.log("🐰 Hanni Persona Website Loaded! Naurrr~ 💕");