// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Throttle function untuk scroll events
function throttle(func, wait) {
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

// Debounce function
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

// Intersection Observer untuk lazy load
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Lazy load images
            if (element.tagName === 'IMG' && element.loading === 'lazy') {
                element.classList.add('loaded');
            }
            
            // Start animations only when in view
            if (element.classList.contains('trait-card') || 
                element.classList.contains('favorite-card')) {
                element.style.animationPlayState = 'running';
            }
        } else {
            // Pause animations when out of view (save battery!)
            const element = entry.target;
            if (element.classList.contains('trait-card') || 
                element.classList.contains('favorite-card')) {
                element.style.animationPlayState = 'paused';
            }
        }
    });
}, observerOptions);

// Observe all lazy load elements
document.addEventListener('DOMContentLoaded', () => {
    // Observe images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        observer.observe(img);
    });
    
    // Observe animated cards
    document.querySelectorAll('.trait-card').forEach(card => {
        observer.observe(card);
    });
});

// ========================================
// OPTIMIZED PARTICLES (Reduced count on mobile)
// ========================================
const particlesContainer = document.getElementById('particles');
const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 5 : 15; // Drastically reduce on mobile

const particleEmojis = ['✨', '💕', '🎀', '⭐', '💙'];

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.innerText = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.setProperty('--duration', (15 + Math.random() * 10) + 's');
    particle.style.setProperty('--delay', Math.random() * 5 + 's');
    
    if (particlesContainer) {
        particlesContainer.appendChild(particle);
    }
    
    // Remove after animation completes to prevent memory leak
    const duration = parseFloat(particle.style.getPropertyValue('--duration'));
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, duration * 1000);
}

// Only create particles if not on reduced motion
if (particlesContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(), i * 500);
    }
}

// --- CONFIG DATA ---
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

// --- DOM ELEMENTS ---
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

// --- 1. FITUR GANTI MODE (COZY) ---
modeBtn.addEventListener('click', () => {
    // Matikan dark mode dulu kalau aktif
    if (isDarkMode) {
        body.classList.remove('dark-mode');
        isDarkMode = false;
        darkModeBtn.innerText = "🌙 Dark Mode";
    }
    
    isPotatoMode = !isPotatoMode;
    const currentState = isPotatoMode ? potatoState : normalState;

    // Toggle Class Body
    if (isPotatoMode) {
        body.classList.add('potato-mode');
        modeBtn.innerText = "✨ Idol Mode";
    } else {
        body.classList.remove('potato-mode');
        modeBtn.innerText = "💕 Cozy Mode";
    }

    // Ganti Konten Utama
    heroSubtitle.innerText = currentState.subtitle;
    speechBubble.innerText = currentState.bubble;

    // Ganti Konten Cards
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
});

// --- 2. FITUR DARK MODE ---
darkModeBtn.addEventListener('click', () => {
    // Matikan cozy mode dulu kalau aktif
    if (isPotatoMode) {
        body.classList.remove('potato-mode');
        isPotatoMode = false;
        modeBtn.innerText = "💕 Cozy Mode";
    }
    
    isDarkMode = !isDarkMode;
    const currentState = isDarkMode ? darkState : normalState;

    // Toggle Class Body
    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeBtn.innerText = "☀️ Light Mode";
    } else {
        body.classList.remove('dark-mode');
        darkModeBtn.innerText = "🌙 Dark Mode";
    }

    // Ganti Konten Utama
    heroSubtitle.innerText = currentState.subtitle;
    speechBubble.innerText = currentState.bubble;

    // Ganti Konten Cards
    cards.forEach((card, index) => {
        const data = currentState.cards[index];
        card.querySelector('h3').innerText = data.title;
        card.querySelector('p').innerText = data.text;
        card.querySelector('.card-icon').innerText = data.icon;
        
        // Dark mode tidak punya rotasi
        card.style.removeProperty('--rotation');
    });
});

// --- 3. FITUR STICKER DECO ---
const stickerCanvas = document.querySelector('.sticker-canvas');
const stickers = ["🎀", "🐰", "💖", "🧢", "✨", "💙", "🍞", "🔥", "⭐", "🌸"];

if(stickerCanvas) {
    stickerCanvas.addEventListener('click', (e) => {
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

        if (stickerCanvas.children.length > 25) {
            stickerCanvas.removeChild(stickerCanvas.children[1]); 
        }
    });
}

// --- 4. FITUR FORTUNE COOKIE ---
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

if(fortuneBtn) {
    fortuneBtn.addEventListener('click', () => {
        // Animasi cookie crack
        fortuneCookie.style.transform = "rotate(20deg) scale(0.8)";
        
        setTimeout(() => {
            const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
            fortuneText.innerText = randomFortune;
            fortunesCollected++;
            fortuneCount.innerText = fortunesCollected;
            
            // Reset animasi
            fortuneCookie.style.transform = "rotate(0deg) scale(1)";
            
            // Animasi paper
            const paper = document.getElementById('fortune-paper');
            paper.style.transform = "scale(1.05)";
            paper.style.background = "#FFF9C4";
            
            setTimeout(() => {
                paper.style.transform = "scale(1)";
            }, 300);
        }, 300);
    });
}

// --- 5. FITUR BREAD CLICKER GAME ---
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
    floater.style.position = 'fixed';
    floater.style.left = x + 'px';
    floater.style.top = y + 'px';
    floater.style.fontSize = '1.5rem';
    floater.style.fontWeight = 'bold';
    floater.style.color = '#D35400';
    floater.style.pointerEvents = 'none';
    floater.style.zIndex = '1000';
    floater.style.animation = 'floatUp 1s ease-out';
    
    document.body.appendChild(floater);
    
    setTimeout(() => {
        floater.remove();
    }, 1000);
}

// Add CSS animation for floating text
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

if(breadClicker) {
    breadClicker.addEventListener('click', (e) => {
        breadCount += clickPower;
        breadCountDisplay.innerText = breadCount;
        
        // Animasi button
        breadClicker.style.transform = 'scale(0.9) rotate(-10deg)';
        setTimeout(() => {
            breadClicker.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
        
        // Floating text
        createFloatingBread(e.clientX, e.clientY);
        
        // Update level
        updateBreadLevel();
        
        // Update upgrade buttons
        updateUpgradeButtons();
    });
}

// --- 6. UPGRADE SYSTEM ---
const upgradeButtons = document.querySelectorAll('.upgrade-btn');

function updateUpgradeButtons() {
    upgradeButtons.forEach(btn => {
        const cost = parseInt(btn.getAttribute('data-cost'));
        if (breadCount >= cost) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
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

// --- 7. PHOTO BOOTH FEATURE ---
const photoFrame = document.getElementById('photo-frame');
const boothImg = document.getElementById('booth-img');
const frameOverlay = document.getElementById('frame-overlay');
const photoStickersContainer = document.getElementById('photo-stickers');

// Frame buttons
const frameBtns = document.querySelectorAll('.frame-btn');
frameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all
        frameBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const frame = btn.getAttribute('data-frame');
        
        // Remove all frame classes
        frameOverlay.className = 'frame-overlay';
        
        // Add selected frame
        if (frame !== 'none') {
            frameOverlay.classList.add(`frame-${frame}`);
        }
    });
});

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Remove all filter classes (match HTML filter names)
        boothImg.classList.remove('filter-vintage', 'filter-warm', 'filter-cool', 'filter-dream',
                                   'filter-y2k', 'filter-dreamy', 'filter-neon'); // Legacy
        
        // Add selected filter
        if (filter !== 'none') {
            boothImg.classList.add(`filter-${filter}`);
        }
    });
});

// Fungsi untuk membuat stiker bisa di-drag
function makeStickerDraggable(sticker) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Mouse events
    sticker.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events untuk mobile
    sticker.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        // Cek apakah mouse atau touch
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        // Cek apakah klik pada sticker ini
        if (e.target === sticker) {
            isDragging = true;
            sticker.style.zIndex = 1000; // Taruh di depan semua stiker lain
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

            // Get rotation value
            const rotation = sticker.style.getPropertyValue('--rot') || '0deg';
            
            // Update posisi stiker
            setTranslate(currentX, currentY, sticker, rotation);
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            sticker.style.zIndex = ''; // Reset z-index
        }
    }

    function setTranslate(xPos, yPos, el, rotation) {
        el.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${rotation})`;
    }
}

// Add stickers to photo
const addStickerBtns = document.querySelectorAll('.add-sticker-btn');
addStickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const stickerText = btn.getAttribute('data-sticker');
        
        const sticker = document.createElement('div');
        sticker.className = 'photo-sticker';
        sticker.innerText = stickerText;
        
        // Random position
        const randomX = Math.random() * 70 + 10; // 10-80%
        const randomY = Math.random() * 70 + 10;
        const randomRot = Math.random() * 40 - 20; // -20 to 20 degrees
        
        sticker.style.left = randomX + '%';
        sticker.style.top = randomY + '%';
        sticker.style.transform = `rotate(${randomRot}deg)`;
        sticker.style.setProperty('--rot', `${randomRot}deg`);
        
        photoStickersContainer.appendChild(sticker);
        
        // ✨ TAMBAHKAN FUNGSI DRAG! ✨
        makeStickerDraggable(sticker);
        
        // Button animation
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// Clear stickers
const clearStickersBtn = document.getElementById('clear-stickers');
if(clearStickersBtn) {
    clearStickersBtn.addEventListener('click', () => {
        photoStickersContainer.innerHTML = '';
    });
}

// --- 8. FITUR MUSIK PLAYER ---
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
            console.log("Autoplay dicegah browser. Klik tombol play untuk mulai.");
        });
    }
}

if(playBtn) {
    playBtn.addEventListener('click', toggleMusic);
}

if(volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        if(audio) audio.volume = e.target.value;
    });
}

// Auto-play saat load (kalau browser izinkan)
window.addEventListener('load', () => {
    if(audio) {
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                playBtn.innerText = "⏸";
                visualizer.classList.add('playing');
                isPlaying = true;
            }).catch(error => {
                console.log("Menunggu interaksi user untuk play musik.");
            });
        }
    }
});

// --- 9. FITUR OOTD PICKER ---
const outfitBtns = document.querySelectorAll('.outfit-btn');
const mainImg = document.getElementById('hanni-img');

outfitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const newSrc = btn.getAttribute('data-img');
        
        mainImg.style.opacity = "0";
        mainImg.style.transform = "scale(0.9)";
        
        setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = "1";
            mainImg.style.transform = "scale(1)";
        }, 200);
    });
});

// Initialize
updateUpgradeButtons();

// ===== NEW FEATURES JAVASCRIPT =====

// --- 10. FLOATING PARTICLES BACKGROUND ---
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particles = ['🌸', '💕', '⭐', '✨', '🐰', '💙', '🎀', '🌺'];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerText = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.setProperty('--duration', (15 + Math.random() * 10) + 's');
        particle.style.setProperty('--delay', Math.random() * 5 + 's');
        particlesContainer.appendChild(particle);
    }
}

// --- 11. THEME SELECTOR ---
const themeModal = document.getElementById('theme-modal');
const themeSelectorBtn = document.getElementById('theme-selector-btn');
const closeModal = document.querySelector('.close-modal');
const themeCards = document.querySelectorAll('.theme-card');

if (themeSelectorBtn) {
    themeSelectorBtn.addEventListener('click', () => {
        themeModal.style.display = 'block';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        themeModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === themeModal) {
        themeModal.style.display = 'none';
    }
});

themeCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove active from all
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const theme = card.getAttribute('data-theme');
        document.body.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem('hanniTheme', theme);
    });
});

// Load saved theme
const savedTheme = localStorage.getItem('hanniTheme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    themeCards.forEach(card => {
        if (card.getAttribute('data-theme') === savedTheme) {
            card.classList.add('active');
        }
    });
}

// --- 16. MEMORY MATCH GAME ---
const memoryGrid = document.getElementById('memory-grid');
const startMemoryBtn = document.getElementById('start-memory-game');
const memoryMovesDisplay = document.getElementById('memory-moves');
const memoryTimeDisplay = document.getElementById('memory-time');

let memoryCards = ['🐰', '💕', '⭐', '🍞', '🎀', '💙', '🌸', '✨'];
let memoryDeck = [...memoryCards, ...memoryCards];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let memoryTimer = 0;
let memoryInterval = null;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createMemoryGame() {
    memoryGrid.innerHTML = '';
    memoryDeck = shuffleArray([...memoryCards, ...memoryCards]);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    memoryTimer = 0;
    memoryMovesDisplay.innerText = '0';
    memoryTimeDisplay.innerText = '0';
    
    if (memoryInterval) clearInterval(memoryInterval);
    memoryInterval = setInterval(() => {
        memoryTimer++;
        memoryTimeDisplay.innerText = memoryTimer;
    }, 1000);
    
    memoryDeck.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerText = '?';
        card.addEventListener('click', flipMemoryCard);
        memoryGrid.appendChild(card);
    });
}

function flipMemoryCard(e) {
    const card = e.target;
    
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    card.innerText = card.dataset.symbol;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        memoryMovesDisplay.innerText = moves;
        
        setTimeout(() => {
            if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                flippedCards.forEach(c => c.classList.add('matched'));
                matchedPairs++;
                
                if (matchedPairs === memoryCards.length) {
                    clearInterval(memoryInterval);
                    setTimeout(() => {
                        alert(`🎉 You won! Time: ${memoryTimer}s, Moves: ${moves}`);
                    }, 300);
                }
            } else {
                flippedCards.forEach(c => {
                    c.classList.remove('flipped');
                    c.innerText = '?';
                });
            }
            flippedCards = [];
        }, 800);
    }
}

if (startMemoryBtn) {
    startMemoryBtn.addEventListener('click', createMemoryGame);
}

// --- 17. SLIDE PUZZLE GAME ---
const puzzleGrid = document.getElementById('puzzle-grid');
const startPuzzleBtn = document.getElementById('start-puzzle-game');
const puzzleMovesDisplay = document.getElementById('puzzle-moves');

let puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let puzzleMoves = 0;

function createPuzzle() {
    puzzleGrid.innerHTML = '';
    puzzleMoves = 0;
    puzzleMovesDisplay.innerText = '0';
    
    // Shuffle
    for (let i = 0; i < 100; i++) {
        const emptyIndex = puzzleState.indexOf(0);
        const possibleMoves = getPossibleMoves(emptyIndex);
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [puzzleState[emptyIndex], puzzleState[randomMove]] = [puzzleState[randomMove], puzzleState[emptyIndex]];
    }
    
    renderPuzzle();
}

function getPossibleMoves(emptyIndex) {
    const moves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    
    if (row > 0) moves.push(emptyIndex - 3); // Up
    if (row < 2) moves.push(emptyIndex + 3); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < 2) moves.push(emptyIndex + 1); // Right
    
    return moves;
}

function renderPuzzle() {
    puzzleGrid.innerHTML = '';
    
    puzzleState.forEach((num, index) => {
        const tile = document.createElement('div');
        tile.className = num === 0 ? 'puzzle-tile empty' : 'puzzle-tile';
        tile.innerText = num === 0 ? '' : num;
        tile.dataset.index = index;
        
        if (num !== 0) {
            tile.addEventListener('click', () => movePuzzleTile(index));
        }
        
        puzzleGrid.appendChild(tile);
    });
}

function movePuzzleTile(tileIndex) {
    const emptyIndex = puzzleState.indexOf(0);
    const possibleMoves = getPossibleMoves(emptyIndex);
    
    if (possibleMoves.includes(tileIndex)) {
        [puzzleState[emptyIndex], puzzleState[tileIndex]] = [puzzleState[tileIndex], puzzleState[emptyIndex]];
        puzzleMoves++;
        puzzleMovesDisplay.innerText = puzzleMoves;
        renderPuzzle();
        
        // Check win
        const solved = puzzleState.every((num, idx) => num === idx + 1 || (idx === 8 && num === 0));
        if (solved) {
            setTimeout(() => {
                alert(`🎉 Puzzle solved in ${puzzleMoves} moves!`);
            }, 300);
        }
    }
}

if (startPuzzleBtn) {
    startPuzzleBtn.addEventListener('click', createPuzzle);
}

// Add bounce animation to CSS dynamically
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0) scale(1); }
        25% { transform: translateY(-20px) scale(1.05); }
        50% { transform: translateY(0) scale(1); }
        75% { transform: translateY(-10px) scale(1.02); }
    }
`;
document.head.appendChild(bounceStyle);

// --- 20. MOOD TRACKER - Hanni's Mood ---
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
});

// ========================================
// NAVBAR SCROLL BEHAVIOR FIX
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) {
        console.warn('⚠️ Navbar not found!');
        return;
    }

    let lastScrollTop = 0;
    const scrollThreshold = 50; // Trigger scrolled class after 50px

    // Throttled scroll handler untuk performance
    const handleNavbarScroll = throttle(function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Toggle 'scrolled' class
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // OPTIONAL: Auto-hide navbar saat scroll down
        // Uncomment jika mau navbar hide/show saat scroll
        /*
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling DOWN - hide navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling UP - show navbar
            navbar.style.transform = 'translateY(0)';
        }
        */
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, 100); // Throttle to 100ms

    // Add scroll listener dengan passive untuk performa
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // Initial state
    navbar.classList.add('show');
    
    console.log('✅ Navbar scroll behavior initialized');
});