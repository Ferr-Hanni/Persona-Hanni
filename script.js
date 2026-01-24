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
    document.querySelectorAll('.trait-card, .favorite-card').forEach(card => {
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
        
        // Remove all filter classes
        boothImg.className = '';
        
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

// --- 12. DOWNLOAD PHOTO BOOTH ---
const downloadPhotoBtn = document.getElementById('download-photo');
if (downloadPhotoBtn) {
    downloadPhotoBtn.addEventListener('click', async () => {
        const photoFrame = document.getElementById('photo-frame');
        
        try {
            // Use html2canvas if available, otherwise basic download
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(photoFrame, {
                    backgroundColor: null,
                    scale: 2
                });
                
                const link = document.createElement('a');
                link.download = 'hanni-photo-booth.png';
                link.href = canvas.toDataURL();
                link.click();
            } else {
                alert('📸 Screenshot feature requires html2canvas library. For now, you can use browser screenshot!');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Use browser screenshot feature (Ctrl/Cmd + Shift + S) to save your photo!');
        }
    });
}

// --- 13. RANDOM QUOTE GENERATOR ---
const quoteBtn = document.getElementById('quote-btn');
const quoteText = document.getElementById('quote-text');

const hanniQuotes = [
    "Naurrr! That's so not right! 😂",
    "I love bread so much, it's like my best friend! 🍞",
    "Phammily forever! 💙",
    "Australian accent? Yeah, I can't help it mate! 🇦🇺",
    "NewJeans never dies! We're always fresh! 🐰",
    "Being silly is part of my charm, right? 😊",
    "Vietnam and Australia vibes together! 🇻🇳🇦🇺",
    "Music is my life, my passion, my everything! 🎵",
    "I'm just naturally cute, can't help it! 🥰",
    "Bunnies are the best! That's why I'm one! 🐇",
    "Let's make beautiful memories together! ✨",
    "Dance like nobody's watching! 💃",
    "Positive vibes only! 🌈",
    "Food is happiness, especially bread! 🥖",
    "Every day is a new adventure! 🌟"
];

if (quoteBtn) {
    quoteBtn.addEventListener('click', () => {
        const randomQuote = hanniQuotes[Math.floor(Math.random() * hanniQuotes.length)];
        quoteText.style.opacity = '0';
        
        setTimeout(() => {
            quoteText.innerText = randomQuote;
            quoteText.style.opacity = '1';
        }, 200);
    });
}

// --- 14. MESSAGE BOARD ---
const messageNameInput = document.getElementById('message-name');
const messageTextInput = document.getElementById('message-text');
const postMessageBtn = document.getElementById('post-message-btn');
const messagesDisplay = document.getElementById('messages-display');
const charCount = document.getElementById('char-count');

// Character counter
if (messageTextInput) {
    messageTextInput.addEventListener('input', () => {
        const count = messageTextInput.value.length;
        charCount.innerText = `${count}/200`;
    });
}

// Post message
if (postMessageBtn) {
    postMessageBtn.addEventListener('click', () => {
        const name = messageNameInput.value.trim() || 'Anonymous Bunny';
        const text = messageTextInput.value.trim();
        
        if (!text) {
            alert('Please write a message! 💕');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-author">${name}</span>
                <span class="message-time">Just now</span>
            </div>
            <div class="message-content">${text}</div>
        `;
        
        messagesDisplay.insertBefore(messageDiv, messagesDisplay.firstChild);
        
        // Clear inputs
        messageNameInput.value = '';
        messageTextInput.value = '';
        charCount.innerText = '0/200';
        
        // Limit messages
        if (messagesDisplay.children.length > 10) {
            messagesDisplay.removeChild(messagesDisplay.lastChild);
        }
    });
}

// --- 15. BUNNY HOP GAME ---
const bunnyCanvas = document.getElementById('bunny-game');
const startBunnyBtn = document.getElementById('start-bunny-game');
const bunnyScoreDisplay = document.getElementById('bunny-score');
const bunnyHighScoreDisplay = document.getElementById('bunny-high-score');

let bunnyGame = null;
let bunnyHighScore = localStorage.getItem('bunnyHighScore') || 0;
bunnyHighScoreDisplay.innerText = bunnyHighScore;

class BunnyHopGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.score = 0;
        this.gameOver = false;
        this.bunny = { x: 50, y: 200, width: 40, height: 40, velocityY: 0, jumping: false };
        this.obstacles = [];
        this.gravity = 0.6;
        this.jumpForce = -12;
        this.gameSpeed = 3;
        this.frameCount = 0;
    }
    
    start() {
        this.gameOver = false;
        this.score = 0;
        this.obstacles = [];
        this.bunny.y = 200;
        this.bunny.velocityY = 0;
        this.gameLoop();
    }
    
    jump() {
        if (!this.bunny.jumping) {
            this.bunny.velocityY = this.jumpForce;
            this.bunny.jumping = true;
        }
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update bunny
        this.bunny.velocityY += this.gravity;
        this.bunny.y += this.bunny.velocityY;
        
        // Ground collision
        if (this.bunny.y >= 200) {
            this.bunny.y = 200;
            this.bunny.velocityY = 0;
            this.bunny.jumping = false;
        }
        
        // Spawn obstacles
        this.frameCount++;
        if (this.frameCount % 100 === 0) {
            this.obstacles.push({ x: this.canvas.width, y: 220, width: 30, height: 50 });
        }
        
        // Update obstacles
        this.obstacles.forEach((obs, index) => {
            obs.x -= this.gameSpeed;
            
            // Remove off-screen obstacles
            if (obs.x + obs.width < 0) {
                this.obstacles.splice(index, 1);
                this.score++;
            }
            
            // Collision detection
            if (
                this.bunny.x < obs.x + obs.width &&
                this.bunny.x + this.bunny.width > obs.x &&
                this.bunny.y < obs.y + obs.height &&
                this.bunny.y + this.bunny.height > obs.y
            ) {
                this.gameOver = true;
                if (this.score > bunnyHighScore) {
                    bunnyHighScore = this.score;
                    localStorage.setItem('bunnyHighScore', bunnyHighScore);
                    bunnyHighScoreDisplay.innerText = bunnyHighScore;
                }
            }
        });
        
        bunnyScoreDisplay.innerText = this.score;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#98FB98';
        this.ctx.fillRect(0, 240, this.canvas.width, 60);
        
        // Draw bunny
        this.ctx.fillStyle = '#FFB6C1';
        this.ctx.fillRect(this.bunny.x, this.bunny.y, this.bunny.width, this.bunny.height);
        this.ctx.fillText('🐰', this.bunny.x + 5, this.bunny.y + 30);
        
        // Draw obstacles
        this.ctx.fillStyle = '#8B4513';
        this.obstacles.forEach(obs => {
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        // Game over text
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('Game Over!', 220, 130);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press Start to play again', 180, 170);
        }
    }
    
    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        } else {
            this.draw();
        }
    }
}

if (startBunnyBtn && bunnyCanvas) {
    startBunnyBtn.addEventListener('click', () => {
        bunnyGame = new BunnyHopGame(bunnyCanvas);
        bunnyGame.start();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && bunnyGame && !bunnyGame.gameOver) {
            e.preventDefault();
            bunnyGame.jump();
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

// --- 18. WALLPAPER DOWNLOAD ---
const downloadWallpaperBtns = document.querySelectorAll('.download-wallpaper-btn');

downloadWallpaperBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const imgSrc = btn.getAttribute('data-img');
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = 'hanni-wallpaper.jpg';
        link.click();
    });
});

// --- 19. FAVORITES SECTION - Interactive Cards ---
const favoriteCards = document.querySelectorAll('.favorite-card');

favoriteCards.forEach(card => {
    card.addEventListener('click', () => {
        // Add bounce animation
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'bounce 0.6s';
        }, 10);
        
        // Create floating hearts
        createFloatingHearts(card);
    });
});

function createFloatingHearts(element) {
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        heart.style.left = rect.left + Math.random() * rect.width + 'px';
        heart.style.top = rect.top + 'px';
        
        document.body.appendChild(heart);
        
        // Animate upwards
        let pos = 0;
        const interval = setInterval(() => {
            pos += 5;
            heart.style.top = rect.top - pos + 'px';
            heart.style.opacity = 1 - (pos / 200);
            
            if (pos > 200) {
                clearInterval(interval);
                heart.remove();
            }
        }, 20);
    }
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
const moodBtns = document.querySelectorAll('.mood-btn');
const moodMessage = document.getElementById('mood-message');

const moodData = {
    happy: {
        message: "Yayyy! Hanni's having the best day ever! 😊✨ Time for some bread and dancing!",
        color: '#FFD6E8'
    },
    excited: {
        message: "NAURRR THIS IS SO EXCITING! 🤩💫 Hanni can't wait to share this energy with Phoning!",
        color: '#FFC0D9'
    },
    sleepy: {
        message: "Zzz... Hanni needs her beauty sleep 😴💤 Five more minutes please~",
        color: '#E6E6FA'
    },
    silly: {
        message: "Hehehe Hanni's in silly mode! 🤪✨ Time for some funny faces and jokes!",
        color: '#FFE5CC'
    },
    bread: {
        message: "BREAD BREAD BREAD! 🥖🥐 Nothing makes Hanni happier than fresh baked goods!",
        color: '#FFDAB9'
    },
    aussie: {
        message: "G'day mate! 🇦🇺🦘 Hanni's channeling her Aussie roots and that iconic accent~",
        color: '#D6EAF8'
    }
};

moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all buttons
        moodBtns.forEach(b => b.classList.remove('active'));
        
        // Add active to clicked button
        btn.classList.add('active');
        
        // Get mood data
        const mood = btn.getAttribute('data-mood');
        const data = moodData[mood];
        
        // Animate message change
        moodMessage.style.opacity = '0';
        moodMessage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            moodMessage.querySelector('p').innerText = data.message;
            moodMessage.style.background = `linear-gradient(135deg, ${data.color}, white)`;
            moodMessage.style.opacity = '1';
            moodMessage.style.transform = 'scale(1)';
            moodMessage.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 200);
        
        // Create confetti effect
        createConfetti();
    });
});

function createConfetti() {
    const emojis = ['✨', '💕', '🎀', '⭐', '💖', '🌸'];
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.fontSize = '1.5rem';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-50px';
        
        document.body.appendChild(confetti);
        
        // Animate downwards
        let pos = -50;
        const speed = 2 + Math.random() * 3;
        const drift = (Math.random() - 0.5) * 200;
        
        const interval = setInterval(() => {
            pos += speed;
            confetti.style.top = pos + 'px';
            confetti.style.transform = `translateX(${drift * (pos / window.innerHeight)}px) rotate(${pos * 2}deg)`;
            confetti.style.opacity = 1 - (pos / window.innerHeight);
            
            if (pos > window.innerHeight) {
                clearInterval(interval);
                confetti.remove();
            }
        }, 20);
    }
}

// Initialize particles on load
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initGreetingCards();
    initFactCarousel();
    initSparkleEffect();
});

// ========================================
// GREETING CARDS - Dynamic Messages
// ========================================
function initGreetingCards() {
    const greetingText = document.getElementById('greeting-text');
    if (!greetingText) return;

    const greetings = [
        "Welcome to Hanni's World! 🌟",
        "G'day mate! Ready for some fun? 🇦🇺",
        "Naurrr! So happy you're here! 💕",
        "Let's vibe together! ✨",
        "Bread lovers unite! 🥖",
        "Time for some Phoning energy! 🐰"
    ];

    let currentIndex = 0;

    setInterval(() => {
        greetingText.style.opacity = '0';
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % greetings.length;
            greetingText.textContent = greetings[currentIndex];
            greetingText.style.opacity = '1';
        }, 300);
    }, 4000);
}

// ========================================
// FACT CAROUSEL - Random Hanni Facts
// ========================================
function initFactCarousel() {
    const factCard = document.getElementById('fact-card');
    if (!factCard) return;

    const facts = [
        { icon: '💡', text: 'Did you know? Hanni can speak 3 languages fluently!' },
        { icon: '🥖', text: 'Hanni eats bread almost every single day!' },
        { icon: '🇦🇺', text: 'Born in Melbourne, Australia - home of the iconic accent!' },
        { icon: '🎤', text: 'Hanni trained for 4 months before debuting with NewJeans!' },
        { icon: '💕', text: 'She loves to sleep and is the ultimate cozy queen!' },
        { icon: '👜', text: 'Hanni is a Gucci Global Ambassador!' },
        { icon: '🎨', text: 'Her favorite color is pink and purple!' },
        { icon: '🐰', text: 'Hanni adores bunnies and all cute animals!' }
    ];

    let currentFactIndex = 0;

    setInterval(() => {
        factCard.style.animation = 'none';
        setTimeout(() => {
            currentFactIndex = (currentFactIndex + 1) % facts.length;
            const fact = facts[currentFactIndex];
            factCard.querySelector('.fact-icon').textContent = fact.icon;
            factCard.querySelector('.fact-text').textContent = fact.text;
            factCard.style.animation = 'fact-slide-in 0.6s ease-out';
        }, 100);
    }, 6000);
}

// ========================================
// SPARKLE EFFECT - Interactive Mouse Sparkles
// ========================================
function initSparkleEffect() {
    const sparkleContainer = document.getElementById('sparkle-container');
    const hanniImg = document.getElementById('hanni-img');
    
    if (!sparkleContainer || !hanniImg) return;

    hanniImg.addEventListener('mouseenter', (e) => {
        createSparkles(e, sparkleContainer);
    });

    hanniImg.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) {
            createSparkles(e, sparkleContainer);
        }
    });
}

function createSparkles(e, container) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    const rect = container.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.left = (e.clientX - rect.left + (Math.random() - 0.5) * 50) + 'px';
        sparkle.style.top = (e.clientY - rect.top + (Math.random() - 0.5) * 50) + 'px';
        sparkle.style.opacity = '1';
        sparkle.style.transition = 'all 1s ease-out';
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.style.transform = `translateY(-80px) scale(0)`;
            sparkle.style.opacity = '0';
        }, 50);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}