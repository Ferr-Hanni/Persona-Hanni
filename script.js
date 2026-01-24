// ========================================
// UTILITY FUNCTIONS
// ========================================

function throttle(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ========================================
// PARTICLES SYSTEM
// ========================================

const ParticlesManager = {
    container: null,
    particleEmojis: ['✨', '💕', '🎀', '⭐', '💙'],
    
    init() {
        this.container = document.getElementById('particles');
        if (!this.container) return;
        
        const isMobile = window.innerWidth <= 768;
        const count = isMobile ? 5 : 15;
        
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            for (let i = 0; i < count; i++) {
                setTimeout(() => this.createParticle(), i * 500);
            }
        }
    },
    
    createParticle() {
        if (!this.container) return;
        
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.textContent = this.particleEmojis[Math.floor(Math.random() * this.particleEmojis.length)];
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.setProperty('--duration', (15 + Math.random() * 10) + 's');
        particle.style.setProperty('--delay', Math.random() * 5 + 's');
        
        this.container.appendChild(particle);
        
        const duration = parseFloat(particle.style.getPropertyValue('--duration'));
        setTimeout(() => particle.remove(), duration * 1000);
    }
};

// ========================================
// THEME MANAGER
// ========================================

const ThemeManager = {
    modal: null,
    
    init() {
        this.modal = document.getElementById('theme-modal');
        const btn = document.getElementById('theme-selector-btn');
        const close = document.querySelector('.close-modal');
        const cards = document.querySelectorAll('.theme-card');
        
        if (btn) btn.addEventListener('click', () => this.modal.style.display = 'block');
        if (close) close.addEventListener('click', () => this.modal.style.display = 'none');
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.modal.style.display = 'none';
        });
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const theme = card.dataset.theme;
                document.body.setAttribute('data-theme', theme);
            });
        });
    }
};

// ========================================
// MODE SWITCHER (Cozy & Dark)
// ========================================

const ModeState = {
    normal: {
        subtitle: "Hanni the Idol 🌟",
        bubble: "Naurrr! ~",
        cards: [
            { title: "Viet-Aussie", text: "Logat Australia yang ikonik & multibahasa jenius.", icon: "🇦🇺" },
            { title: "Honey Voice", text: "Suara yang manis seperti madu & dance yang swag.", icon: "🎤" },
            { title: "Bread Lover", text: "Sangat terobsesi dengan roti. Roti is life.", icon: "🥖" }
        ]
    },
    cozy: {
        subtitle: "Soft & Cozy Hanni 💕",
        bubble: "Feels like a warm hug~",
        cards: [
            { title: "Sweet Soul", text: "Kepribadian yang hangat dan menenangkan.", icon: "🫖" },
            { title: "Gentle Heart", text: "Selalu memberikan vibes yang lembut dan caring.", icon: "🌸" },
            { title: "Cozy Vibes", text: "Kehadiran yang bikin nyaman seperti pelukan.", icon: "🧸" }
        ]
    },
    dark: {
        subtitle: "Night Owl Hanni 🌙",
        bubble: "Midnight vibes~",
        cards: [
            { title: "Moon Child", text: "Energi malam yang tenang untuk late night talks.", icon: "🌙" },
            { title: "Starlight", text: "Bersinar lembut di kegelapan.", icon: "⭐" },
            { title: "Dream Maker", text: "Menciptakan suasana peaceful dan dreamy.", icon: "💫" }
        ]
    }
};

const ModeSwitcher = {
    isCozy: false,
    isDark: false,
    
    init() {
        const cozyBtn = document.getElementById('mode-btn');
        const darkBtn = document.getElementById('dark-mode-btn');
        
        if (cozyBtn) cozyBtn.addEventListener('click', () => this.toggleCozy());
        if (darkBtn) darkBtn.addEventListener('click', () => this.toggleDark());
    },
    
    toggleCozy() {
        const body = document.body;
        const modeBtn = document.getElementById('mode-btn');
        
        if (this.isDark) {
            body.classList.remove('dark-mode');
            this.isDark = false;
            document.getElementById('dark-mode-btn').textContent = "🌙 Dark";
        }
        
        this.isCozy = !this.isCozy;
        const state = this.isCozy ? ModeState.cozy : ModeState.normal;
        
        body.classList.toggle('potato-mode', this.isCozy);
        modeBtn.textContent = this.isCozy ? "✨ Idol" : "💕 Cozy";
        
        this.updateContent(state);
    },
    
    toggleDark() {
        const body = document.body;
        const darkBtn = document.getElementById('dark-mode-btn');
        
        if (this.isCozy) {
            body.classList.remove('potato-mode');
            this.isCozy = false;
            document.getElementById('mode-btn').textContent = "💕 Cozy";
        }
        
        this.isDark = !this.isDark;
        const state = this.isDark ? ModeState.dark : ModeState.normal;
        
        body.classList.toggle('dark-mode', this.isDark);
        darkBtn.textContent = this.isDark ? "☀️ Light" : "🌙 Dark";
        
        this.updateContent(state);
    },
    
    updateContent(state) {
        const subtitle = document.getElementById('hero-subtitle');
        const bubble = document.getElementById('speech-bubble');
        const cards = [document.getElementById('card-1'), document.getElementById('card-2'), document.getElementById('card-3')];
        
        if (subtitle) subtitle.textContent = state.subtitle;
        if (bubble) bubble.textContent = state.bubble;
        
        cards.forEach((card, i) => {
            if (!card) return;
            const data = state.cards[i];
            card.querySelector('h3').textContent = data.title;
            card.querySelector('p').textContent = data.text;
            card.querySelector('.card-icon').textContent = data.icon;
        });
    }
};

// ========================================
// STICKER CANVAS
// ========================================

const StickerCanvas = {
    canvas: null,
    stickers: ["🎀", "🐰", "💖", "🧢", "✨", "💙", "🍞", "🔥", "⭐", "🌸"],
    
    init() {
        this.canvas = document.querySelector('.sticker-canvas');
        if (!this.canvas) return;
        
        this.canvas.addEventListener('click', (e) => this.addSticker(e));
    },
    
    addSticker(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const el = document.createElement('div');
        el.classList.add('sticker');
        el.textContent = this.stickers[Math.floor(Math.random() * this.stickers.length)];
        
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
        
        this.canvas.appendChild(el);
        
        if (this.canvas.children.length > 25) {
            this.canvas.removeChild(this.canvas.children[1]);
        }
    }
};

// ========================================
// FORTUNE COOKIE
// ========================================

const FortuneCookie = {
    count: 0,
    fortunes: [
        "🍞 Today is a good day to eat bread!",
        "🎤 Your voice will shine brighter than the sun!",
        "🐰 A bunny will bring you good luck!",
        "💕 Someone is thinking about you right now...",
        "🌟 You're gonna slay today!",
        "🥔 Embrace your inner potato. Rest is productive!",
        "✨ Your vibe attracts your tribe!",
        "🎀 Pink energy incoming!",
        "🍞 Life tip: When in doubt, add more bread!",
        "🎵 Music will save your day today!",
        "💙 Wear something blue today!",
        "🌸 Stop and smell the flowers!",
        "🔥 Your charisma level: 100!",
        "🧢 Confidence is the best accessory!",
        "🌈 Your rainbow moment is coming!"
    ],
    
    init() {
        const btn = document.getElementById('fortune-btn');
        if (!btn) return;
        
        btn.addEventListener('click', () => this.crack());
    },
    
    crack() {
        const cookie = document.getElementById('fortune-cookie');
        const text = document.getElementById('fortune-text');
        const counter = document.getElementById('fortune-count');
        
        cookie.style.transform = "rotate(20deg) scale(0.8)";
        
        setTimeout(() => {
            text.textContent = this.fortunes[Math.floor(Math.random() * this.fortunes.length)];
            this.count++;
            counter.textContent = this.count;
            cookie.style.transform = "rotate(0deg) scale(1)";
        }, 300);
    }
};

// ========================================
// BREAD CLICKER GAME
// ========================================

const BreadGame = {
    count: 0,
    power: 1,
    levels: [
        { threshold: 0, name: "Bread Rookie" },
        { threshold: 50, name: "Bread Fan" },
        { threshold: 150, name: "Bread Lover" },
        { threshold: 300, name: "Bread Addict" },
        { threshold: 500, name: "Bread Master" },
        { threshold: 1000, name: "Bread Legend" }
    ],
    
    init() {
        const clicker = document.getElementById('bread-clicker');
        if (!clicker) return;
        
        clicker.addEventListener('click', (e) => this.click(e));
        
        const upgradeBtns = document.querySelectorAll('.upgrade-btn');
        upgradeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.upgrade(btn));
        });
        
        this.updateUI();
    },
    
    click(e) {
        this.count += this.power;
        this.updateUI();
        this.createFloater(e.clientX, e.clientY);
        
        const btn = e.target;
        btn.style.transform = 'scale(0.9) rotate(-10deg)';
        setTimeout(() => btn.style.transform = 'scale(1) rotate(0deg)', 100);
    },
    
    createFloater(x, y) {
        const floater = document.createElement('div');
        floater.textContent = `+${this.power} 🍞`;
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
        setTimeout(() => floater.remove(), 1000);
    },
    
    upgrade(btn) {
        const cost = parseInt(btn.dataset.cost);
        const power = parseInt(btn.dataset.power);
        
        if (this.count >= cost) {
            this.count -= cost;
            this.power += power;
            
            const newCost = Math.floor(cost * 1.5);
            btn.dataset.cost = newCost;
            btn.querySelector('.upgrade-cost').textContent = `Cost: ${newCost}🍞`;
            
            this.updateUI();
        }
    },
    
    updateUI() {
        document.getElementById('bread-count').textContent = this.count;
        document.getElementById('click-power').textContent = this.power;
        
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (this.count >= this.levels[i].threshold) {
                document.getElementById('bread-level').textContent = this.levels[i].name;
                break;
            }
        }
        
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.disabled = this.count < parseInt(btn.dataset.cost);
        });
    }
};

// ========================================
// MUSIC PLAYER
// ========================================

const MusicPlayer = {
    audio: null,
    isPlaying: false,
    
    init() {
        this.audio = document.getElementById('bg-music');
        const playBtn = document.getElementById('play-pause-btn');
        const volumeSlider = document.getElementById('volume-slider');
        
        if (!this.audio || !playBtn) return;
        
        playBtn.addEventListener('click', () => this.toggle());
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value;
            });
        }
        
        this.audio.volume = 0.5;
    },
    
    toggle() {
        const playBtn = document.getElementById('play-pause-btn');
        const visualizer = document.getElementById('visualizer');
        
        if (this.isPlaying) {
            this.audio.pause();
            playBtn.textContent = "▶";
            visualizer.classList.remove('playing');
            this.isPlaying = false;
        } else {
            this.audio.play().then(() => {
                playBtn.textContent = "⏸";
                visualizer.classList.add('playing');
                this.isPlaying = true;
            }).catch(err => console.log('Autoplay prevented'));
        }
    }
};

// ========================================
// OUTFIT SELECTOR
// ========================================

const OutfitSelector = {
    init() {
        const btns = document.querySelectorAll('.outfit-btn');
        const img = document.getElementById('hanni-img');
        
        if (!img) return;
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                img.style.opacity = "0";
                img.style.transform = "scale(0.9)";
                
                setTimeout(() => {
                    img.src = btn.dataset.img;
                    img.style.opacity = "1";
                    img.style.transform = "scale(1)";
                }, 200);
            });
        });
    }
};

// ========================================
// PHOTO BOOTH
// ========================================

const PhotoBooth = {
    init() {
        this.initFrames();
        this.initFilters();
        this.initStickers();
    },
    
    initFrames() {
        const btns = document.querySelectorAll('.frame-btn');
        const overlay = document.getElementById('frame-overlay');
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                overlay.className = 'frame-overlay';
                const frame = btn.dataset.frame;
                if (frame !== 'none') overlay.classList.add(`frame-${frame}`);
            });
        });
    },
    
    initFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        const img = document.getElementById('booth-img');
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                img.className = 'booth-img';
                const filter = btn.dataset.filter;
                if (filter !== 'none') img.classList.add(`filter-${filter}`);
            });
        });
    },
    
    initStickers() {
        const btns = document.querySelectorAll('.add-sticker-btn');
        const container = document.getElementById('photo-stickers');
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sticker = document.createElement('div');
                sticker.className = 'photo-sticker';
                sticker.textContent = btn.dataset.sticker;
                
                sticker.style.left = (Math.random() * 70 + 10) + '%';
                sticker.style.top = (Math.random() * 70 + 10) + '%';
                sticker.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
                
                container.appendChild(sticker);
                this.makeDraggable(sticker);
            });
        });
    },
    
    makeDraggable(el) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;
        
        el.addEventListener('mousedown', dragStart);
        el.addEventListener('touchstart', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
        
        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            
            if (e.target === el) isDragging = true;
        }
        
        function drag(e) {
            if (!isDragging) return;
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
            
            const rotation = el.style.getPropertyValue('--rot') || '0deg';
            el.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation})`;
        }
        
        function dragEnd() {
            isDragging = false;
        }
    }
};

// ========================================
// MINI GAMES
// ========================================

// Bunny Hop Game
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
        
        this.bunny.velocityY += this.gravity;
        this.bunny.y += this.bunny.velocityY;
        
        if (this.bunny.y >= 200) {
            this.bunny.y = 200;
            this.bunny.velocityY = 0;
            this.bunny.jumping = false;
        }
        
        this.frameCount++;
        if (this.frameCount % 100 === 0) {
            this.obstacles.push({ x: this.canvas.width, y: 220, width: 30, height: 50 });
        }
        
        this.obstacles.forEach((obs, index) => {
            obs.x -= this.gameSpeed;
            
            if (obs.x + obs.width < 0) {
                this.obstacles.splice(index, 1);
                this.score++;
            }
            
            if (this.bunny.x < obs.x + obs.width &&
                this.bunny.x + this.bunny.width > obs.x &&
                this.bunny.y < obs.y + obs.height &&
                this.bunny.y + this.bunny.height > obs.y) {
                this.gameOver = true;
            }
        });
        
        document.getElementById('bunny-score').textContent = this.score;
    }
    
    draw() {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#98FB98';
        this.ctx.fillRect(0, 240, this.canvas.width, 60);
        
        this.ctx.fillStyle = '#FFB6C1';
        this.ctx.fillRect(this.bunny.x, this.bunny.y, this.bunny.width, this.bunny.height);
        this.ctx.fillText('🐰', this.bunny.x + 5, this.bunny.y + 30);
        
        this.ctx.fillStyle = '#8B4513';
        this.obstacles.forEach(obs => {
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('Game Over!', 220, 130);
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

let bunnyGame = null;

function initBunnyGame() {
    const canvas = document.getElementById('bunny-game');
    const startBtn = document.getElementById('start-bunny-game');
    
    if (!canvas || !startBtn) return;
    
    startBtn.addEventListener('click', () => {
        bunnyGame = new BunnyHopGame(canvas);
        bunnyGame.start();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && bunnyGame && !bunnyGame.gameOver) {
            e.preventDefault();
            bunnyGame.jump();
        }
    });
}

// Memory Match Game
const MemoryGame = {
    cards: ['🐰', '💕', '⭐', '🍞', '🎀', '💙', '🌸', '✨'],
    deck: [],
    flipped: [],
    matched: 0,
    moves: 0,
    timer: 0,
    interval: null,
    
    init() {
        const startBtn = document.getElementById('start-memory-game');
        if (!startBtn) return;
        
        startBtn.addEventListener('click', () => this.start());
    },
    
    start() {
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';
        
        this.deck = this.shuffle([...this.cards, ...this.cards]);
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.timer = 0;
        
        document.getElementById('memory-moves').textContent = '0';
        document.getElementById('memory-time').textContent = '0';
        
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.timer++;
            document.getElementById('memory-time').textContent = this.timer;
        }, 1000);
        
        this.deck.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            card.textContent = '?';
            card.addEventListener('click', (e) => this.flip(e));
            grid.appendChild(card);
        });
    },
    
    flip(e) {
        const card = e.target;
        
        if (this.flipped.length >= 2 || card.classList.contains('flipped') || 
            card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        this.flipped.push(card);
        
        if (this.flipped.length === 2) {
            this.moves++;
            document.getElementById('memory-moves').textContent = this.moves;
            
            setTimeout(() => {
                if (this.flipped[0].dataset.symbol === this.flipped[1].dataset.symbol) {
                    this.flipped.forEach(c => c.classList.add('matched'));
                    this.matched++;
                    
                    if (this.matched === this.cards.length) {
                        clearInterval(this.interval);
                        setTimeout(() => alert(`🎉 Won! Time: ${this.timer}s, Moves: ${this.moves}`), 300);
                    }
                } else {
                    this.flipped.forEach(c => {
                        c.classList.remove('flipped');
                        c.textContent = '?';
                    });
                }
                this.flipped = [];
            }, 800);
        }
    },
    
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

// Slide Puzzle
const PuzzleGame = {
    state: [1, 2, 3, 4, 5, 6, 7, 8, 0],
    moves: 0,
    
    init() {
        const startBtn = document.getElementById('start-puzzle-game');
        if (!startBtn) return;
        
        startBtn.addEventListener('click', () => this.start());
    },
    
    start() {
        this.moves = 0;
        document.getElementById('puzzle-moves').textContent = '0';
        
        for (let i = 0; i < 100; i++) {
            const empty = this.state.indexOf(0);
            const possible = this.getPossibleMoves(empty);
            const random = possible[Math.floor(Math.random() * possible.length)];
            [this.state[empty], this.state[random]] = [this.state[random], this.state[empty]];
        }
        
        this.render();
    },
    
    getPossibleMoves(emptyIndex) {
        const moves = [];
        const row = Math.floor(emptyIndex / 3);
        const col = emptyIndex % 3;
        
        if (row > 0) moves.push(emptyIndex - 3);
        if (row < 2) moves.push(emptyIndex + 3);
        if (col > 0) moves.push(emptyIndex - 1);
        if (col < 2) moves.push(emptyIndex + 1);
        
        return moves;
    },
    
    render() {
        const grid = document.getElementById('puzzle-grid');
        grid.innerHTML = '';
        
        this.state.forEach((num, index) => {
            const tile = document.createElement('div');
            tile.className = num === 0 ? 'puzzle-tile empty' : 'puzzle-tile';
            tile.textContent = num === 0 ? '' : num;
            
            if (num !== 0) {
                tile.addEventListener('click', () => this.move(index));
            }
            
            grid.appendChild(tile);
        });
    },
    
    move(tileIndex) {
        const empty = this.state.indexOf(0);
        const possible = this.getPossibleMoves(empty);
        
        if (possible.includes(tileIndex)) {
            [this.state[empty], this.state[tileIndex]] = [this.state[tileIndex], this.state[empty]];
            this.moves++;
            document.getElementById('puzzle-moves').textContent = this.moves;
            this.render();
            
            const solved = this.state.every((num, idx) => 
                num === idx + 1 || (idx === 8 && num === 0)
            );
            
            if (solved) {
                setTimeout(() => alert(`🎉 Solved in ${this.moves} moves!`), 300);
            }
        }
    }
};

// ========================================
// SPARKLE EFFECT
// ========================================

const SparkleEffect = {
    init() {
        const container = document.getElementById('sparkle-container');
        const img = document.getElementById('hanni-img');
        
        if (!container || !img) return;
        
        img.addEventListener('mouseenter', (e) => this.create(e, container));
        img.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.7) this.create(e, container);
        });
    },
    
    create(e, container) {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        const rect = container.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: absolute;
                left: ${e.clientX - rect.left + (Math.random() - 0.5) * 50}px;
                top: ${e.clientY - rect.top + (Math.random() - 0.5) * 50}px;
                font-size: 1.5rem;
                pointer-events: none;
                opacity: 1;
                transition: all 1s ease-out;
            `;
            
            container.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.style.transform = 'translateY(-80px) scale(0)';
                sparkle.style.opacity = '0';
            }, 50);
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
};

// ========================================
// NAVBAR SCROLL
// ========================================

const NavbarScroll = {
    init() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const handler = throttle(() => {
            const scroll = window.pageYOffset || document.documentElement.scrollTop;
            navbar.classList.toggle('scrolled', scroll > 50);
        }, 100);
        
        window.addEventListener('scroll', handler, { passive: true });
    }
};

// ========================================
// INTERSECTION OBSERVER (Lazy Load)
// ========================================

const LazyLoader = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    if (el.tagName === 'IMG' && el.loading === 'lazy') {
                        el.classList.add('loaded');
                    }
                    
                    if (el.classList.contains('trait-card')) {
                        el.style.animationPlayState = 'running';
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => observer.observe(img));
        document.querySelectorAll('.trait-card').forEach(card => observer.observe(card));
    }
};

// ========================================
// ADD FLOAT UP ANIMATION
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========================================
// INITIALIZE ALL
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🐰 Initializing Hanni Persona Website...');
    
    // Core Systems
    ParticlesManager.init();
    ThemeManager.init();
    ModeSwitcher.init();
    NavbarScroll.init();
    LazyLoader.init();
    
    // Interactive Features
    StickerCanvas.init();
    FortuneCookie.init();
    BreadGame.init();
    MusicPlayer.init();
    OutfitSelector.init();
    PhotoBooth.init();
    SparkleEffect.init();
    
    // Mini Games
    initBunnyGame();
    MemoryGame.init();
    PuzzleGame.init();
    
    console.log('✅ All systems initialized!');
});