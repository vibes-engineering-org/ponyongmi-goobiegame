// Game assets
const gameAssets = {
    // Player assets - up direction
    playerUp1: null,
    playerUp2: null,
    playerUp3: null,
    // Player assets - down direction
    playerDown1: null,
    playerDown2: null,
    playerDown3: null,
    // Player assets - left direction
    playerLeft1: null,
    playerLeft2: null,
    playerLeft3: null,
    // Player assets - right direction
    playerRight1: null,
    playerRight2: null,
    playerRight3: null,
    // Death animation assets
    playerDeath1: null,
    playerDeath2: null,
    playerDeath3: null,
    playerDeath4: null,
    playerDeath5: null,
    playerDeath6: null,
    playerDeath7: null,
    playerDeath8: null,
    // Lives icon
    playerLives: null,
    // Background
    backgroundTile: null,
    // Other assets
    coin1: null,
    coin2: null,
    pepeCoin1: null,
    pepeCoin2: null,
    domsCoin1: null,
    domsCoin2: null,
    elonCoin1: null,
    elonCoin2: null,
    hosicoCoin1: null,
    hosicoCoin2: null,
    enemy1: null,
    enemy2: null,
    enemyBroccoli1: null,
    enemyBroccoli2: null,
    enemyDoge1: null,
    enemyDoge2: null,
    enemyMiggles1: null,
    enemyMiggles2: null,
    powerup: null
};

// Sound manager for handling audio
const soundManager = {
    backgroundMusic: null,
    soundEffects: {}, // Object to store all sound effects
    isMuted: false,
    
    init() {
        // Create audio element for background music
        this.backgroundMusic = new Audio('music/goobies_song_v1.mp3');
        this.backgroundMusic.loop = true; // Set music to loop continuously
        this.backgroundMusic.volume = 0.5; // Set volume to 50%
        
        // Load sound effects
        this.loadSoundEffect('normalCoin', 'sfx/normal_coin.mp3', 0.4);
        this.loadSoundEffect('specialCoin', 'sfx/special_coin.mp3', 0.5);
        this.loadSoundEffect('extraLife', 'sfx/extra_life.mp3', 0.5);
        this.loadSoundEffect('playerDies', 'sfx/player_dies.mp3', 0.4);
        
        // Check if user previously muted the game
        const savedMuteState = localStorage.getItem('goobieManMuted');
        if (savedMuteState === 'true') {
            this.mute();
        }
        
        // Update sound button state if it exists
        if (typeof updateSoundButtonState === 'function') {
            updateSoundButtonState();
        }
    },
    
    // Load a sound effect and store it in the soundEffects object
    loadSoundEffect(name, path, volume = 1.0) {
        const audio = new Audio(path);
        audio.volume = volume;
        this.soundEffects[name] = audio;
    },
    
    // Play a sound effect respecting the mute setting
    playSoundEffect(name) {
        const sound = this.soundEffects[name];
        if (sound && !this.isMuted) {
            // Clone the audio to allow multiple plays at the same time
            const soundClone = sound.cloneNode();
            
            // Play the sound
            const playPromise = soundClone.play();
            
            // Handle autoplay policy
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log(`Error playing sound effect ${name}:`, error);
                });
            }
        }
    },
    
    playMusic() {
        const playPromise = this.backgroundMusic.play();
        
        // Handle play() promise to catch autoplay restrictions
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Auto-play was prevented
                console.log("Autoplay prevented. Music will start on user interaction.");
            });
        }
    },
    
    pauseMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
        }
    },
    
    resumeMusic() {
        if (this.backgroundMusic && !this.isMuted && this.backgroundMusic.paused) {
            this.playMusic();
        }
    },
    
    mute() {
        if (this.backgroundMusic) {
            this.backgroundMusic.muted = true;
            this.isMuted = true;
            localStorage.setItem('goobieManMuted', 'true');
        }
    },
    
    unmute() {
        if (this.backgroundMusic) {
            this.backgroundMusic.muted = false;
            this.isMuted = false;
            localStorage.setItem('goobieManMuted', 'false');
        }
    },
    
    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }
};

// High score system
const HIGH_SCORE_KEY = 'goobieManHighScores';
const MAX_HIGH_SCORES = 100; // Changed from 10 to 100
const MAX_NAME_LENGTH = 15;
let currentPlayerName = '';
let isNewHighScore = false;
let isSubmittingHighScore = false; // Flag to prevent multiple submissions
let currentHighScores = []; // Cache for high scores
let currentVisibleScoreRange = '1-20'; // Track which scores are visible

/**
 * Get high scores from Firebase first, fallback to localStorage
 * @returns {Promise<Array>} Promise resolving to an array of high score objects
 */
async function getHighScores() {
    try {
        // Try to get scores from Firebase first
        if (window.firebaseDB && typeof window.firebaseDB.getHighScores === 'function') {
            console.log('Attempting to get high scores from Firebase...');
            const firebaseScores = await window.firebaseDB.getHighScores(MAX_HIGH_SCORES);
            
            // If Firebase returned scores successfully, use them
            if (firebaseScores !== null) {
                console.log('Successfully retrieved scores from Firebase:', firebaseScores.length, 'scores');
                currentHighScores = firebaseScores; // Cache the results
                return firebaseScores;
            }
            
            console.log('Firebase not available, falling back to localStorage');
        }
        
        // Fallback to localStorage if Firebase is unavailable or returned null
        const highScoresJson = localStorage.getItem(HIGH_SCORE_KEY);
        if (highScoresJson) {
            try {
                const highScores = JSON.parse(highScoresJson);
                console.log('Retrieved scores from localStorage:', highScores.length, 'scores');
                currentHighScores = highScores; // Cache the results
                return highScores;
            } catch (e) {
                console.error('Error parsing local high scores:', e);
                return [];
            }
        }
        return [];
    } catch (error) {
        console.error('Error getting high scores:', error);
        return [];
    }
}

/**
 * Check if the current score qualifies for the high score list
 * @param {number} score - Current score
 * @returns {Promise<boolean>} Promise resolving to true if score is a high score
 */
async function isHighScore(score) {
    try {
        // Try Firebase first
        if (window.firebaseDB && typeof window.firebaseDB.isHighScore === 'function') {
            console.log('Checking if score is high score using Firebase...');
            const isFirebaseHighScore = await window.firebaseDB.isHighScore(score, MAX_HIGH_SCORES);
            
            // If Firebase check was successful, use that result
            if (isFirebaseHighScore !== null) {
                console.log('Firebase high score check result:', isFirebaseHighScore);
                return isFirebaseHighScore;
            }
            
            console.log('Firebase check failed, using localStorage fallback');
        }
        
        // Fallback to localStorage-based checking
        const highScores = await getHighScores();
        
        // If we have fewer than MAX_HIGH_SCORES, it's automatically a high score
        if (highScores.length < MAX_HIGH_SCORES) {
            return true;
        }
        
        // Find the lowest score
        const lowestScore = Math.min(...highScores.map(entry => entry.score));
        
        // It's a high score if it's higher than the lowest score
        return score > lowestScore;
    } catch (error) {
        console.error('Error checking high score:', error);
        // On error, assume it's a high score to give the player the benefit of the doubt
        return true;
    }
}

/**
 * Add a new high score to Firebase first, always save to localStorage as backup
 * @param {string} name - Player name
 * @param {number} score - Player score
 * @returns {Promise<boolean>} Promise resolving to success status
 */
async function addHighScore(name, score) {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        let firebaseSuccess = false;
        
        // Try to save to Firebase first
        if (window.firebaseDB && typeof window.firebaseDB.addHighScore === 'function') {
            console.log('Attempting to save high score to Firebase...');
            firebaseSuccess = await window.firebaseDB.addHighScore(name, score, today);
            console.log(`Score ${firebaseSuccess ? 'successfully added to' : 'failed to add to'} Firebase`);
        }
        
        // Always save to localStorage as a backup
        saveHighScoreToLocalStorage(name, score);
        console.log('Score saved to localStorage as backup');
        
        return true; // Return success if either Firebase or localStorage worked
    } catch (error) {
        console.error('Error saving high score:', error);
        // Try to save to localStorage as a last resort
        try {
            saveHighScoreToLocalStorage(name, score);
            console.log('Score saved to localStorage after error');
            return true;
        } catch (e) {
            console.error('Fatal error saving high score to localStorage:', e);
            return false;
        }
    }
}

/**
 * Save high score to localStorage as a backup
 * @param {string} name - Player name
 * @param {number} score - Player score
 */
function saveHighScoreToLocalStorage(name, score) {
    try {
        // Get existing scores
        const highScoresJson = localStorage.getItem(HIGH_SCORE_KEY);
        let highScores = [];
        
        if (highScoresJson) {
            highScores = JSON.parse(highScoresJson);
        }
        
        // Add the new score
        highScores.push({
            name: name.substring(0, MAX_NAME_LENGTH),
            score: score,
            date: new Date().toISOString().split('T')[0]
        });
        
        // Sort by score (highest first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only the top scores
        const topScores = highScores.slice(0, MAX_HIGH_SCORES);
        
        // Save back to localStorage
        localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(topScores));
    } catch (e) {
        console.error('Error saving high score to localStorage:', e);
    }
}

// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
let touchCurrentX = 0;
let touchCurrentY = 0;
let touchActive = false;
let touchThreshold = 20; // Minimum distance to trigger directional movement
// Variables for the virtual d-pad
let dpadCenter = { x: 0, y: 0 };
let dpadRadius = 100; // The active area radius for the d-pad
let dpadVisible = false; // Whether to show the d-pad visually (for debugging)
// Store the currently active touch zones
let activeTouchZones = {
    dpad: false,
    pause: false
};
// Track if we're on a mobile device and using touch controls
let isMobileDevice = false;
let usingTouchControls = false; // Flag to track when touch controls are being used

// Enemy types
const ENEMY_TYPES = {
    BONK: 'bonk',
    BROCCOLI: 'broccoli',
    DOGE: 'doge',
    MIGGLES: 'miggles'
};

// Asset loading tracking
let assetsLoaded = 0;
let totalAssets = 0;
const assetsToLoad = [
    // Player assets - up direction
    { name: 'playerUp1', src: 'images/player_up_1.png' },
    { name: 'playerUp2', src: 'images/player_up_2.png' },
    { name: 'playerUp3', src: 'images/player_up_3.png' },
    // Player assets - down direction
    { name: 'playerDown1', src: 'images/player_down_1.png' },
    { name: 'playerDown2', src: 'images/player_down_2.png' },
    { name: 'playerDown3', src: 'images/player_down_3.png' },
    // Player assets - left direction
    { name: 'playerLeft1', src: 'images/player_left_1.png' },
    { name: 'playerLeft2', src: 'images/player_left_2.png' },
    { name: 'playerLeft3', src: 'images/player_left_3.png' },
    // Player assets - right direction
    { name: 'playerRight1', src: 'images/player_right_1.png' },
    { name: 'playerRight2', src: 'images/player_right_2.png' },
    { name: 'playerRight3', src: 'images/player_right_3.png' },
    // Death animation assets
    { name: 'playerDeath1', src: 'images/player_death_1.png' },
    { name: 'playerDeath2', src: 'images/player_death_2.png' },
    { name: 'playerDeath3', src: 'images/player_death_3.png' },
    { name: 'playerDeath4', src: 'images/player_death_4.png' },
    { name: 'playerDeath5', src: 'images/player_death_5.png' },
    { name: 'playerDeath6', src: 'images/player_death_6.png' },
    { name: 'playerDeath7', src: 'images/player_death_7.png' },
    { name: 'playerDeath8', src: 'images/player_death_8.png' },
    // Lives icon
    { name: 'playerLives', src: 'images/player_lives.png' },
    // Background
    { name: 'backgroundTile', src: 'images/background_tile.png' },
    // Other assets
    { name: 'coin1', src: 'images/golden_coins_v1.8.png' },
    { name: 'coin2', src: 'images/golden_coins_v2.8.png' },
    { name: 'pepeCoin1', src: 'images/pepe_coin_1.png' },
    { name: 'pepeCoin2', src: 'images/pepe_coin_2.png' },
    { name: 'domsCoin1', src: 'images/doms_coin_1.png' },
    { name: 'domsCoin2', src: 'images/doms_coin_2.png' },
    { name: 'elonCoin1', src: 'images/elon_coin_1.png' },
    { name: 'elonCoin2', src: 'images/elon_coin_2.png' },
    { name: 'hosicoCoin1', src: 'images/hosico_coin_1.png' },
    { name: 'hosicoCoin2', src: 'images/hosico_coin_2.png' },
    { name: 'enemy1', src: 'images/enemy-bonk-1.png' },
    { name: 'enemy2', src: 'images/enemy-bonk-2.png' },
    { name: 'enemyBroccoli1', src: 'images/enemy-broccoli-1.png' },
    { name: 'enemyBroccoli2', src: 'images/enemy-broccoli-2.png' },
    { name: 'enemyDoge1', src: 'images/enemy-doge-1.png' },
    { name: 'enemyDoge2', src: 'images/enemy-doge-2.png' },
    { name: 'enemyMiggles1', src: 'images/enemy-miggles-1.png' },
    { name: 'enemyMiggles2', src: 'images/enemy-miggles-2.png' }
    // We'll generate the rest programmatically
];

// Define player direction constants
const PLAYER_DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

// Animation variables
let coinAnimationFrame = 0;
let enemyAnimationFrame = 0;
let playerAnimationFrame = 0;
let playerAnimationSequence = [0, 1, 2, 1]; // The 1,2,3,2 sequence (0-indexed)
let playerAnimationIndex = 0;
let coinAnimationCounter = 0;
let enemyAnimationCounter = 0;
let playerAnimationCounter = 0;
const COIN_ANIMATION_SPEED = 15; // Lower is faster
const ENEMY_ANIMATION_SPEED = 20; // Slightly slower than coins for visual variety
const PLAYER_ANIMATION_SPEED = 10; // Faster than coins and enemies

// Death animation variables
let deathAnimationFrame = 0;
let deathAnimationCounter = 0;
const DEATH_ANIMATION_SPEED = 12; // Speed of death animation
const DEATH_ANIMATION_FRAMES = 8; // Total number of death animation frames

// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const continueScreen = document.getElementById('continueScreen');
const finalScore = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const continueButton = document.getElementById('continueButton');
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgress = document.getElementById('loadingProgress');
const livesDisplay = document.getElementById('livesDisplay');
const livesRemaining = document.getElementById('livesRemaining');
const milestoneBar = document.getElementById('milestoneBar');

// Game state constants
const GAME_STATE = {
    LOADING: 'loading',
    START_SCREEN: 'start_screen',
    PLAYING: 'playing',
    PAUSED: 'paused', // New state for paused game
    DYING: 'dying', // State for death animation
    CONTINUE: 'continue', // New state for continue screen
    HIGH_SCORE: 'high_score', // New state for high score input
    GAME_OVER: 'game_over'
};

// Game state
let gameState = GAME_STATE.LOADING;
let gameRunning = false;
let score = 0;
let lives = 3; // Starting number of lives
const INITIAL_LIVES = 3; // Starting number of lives (was MAX_LIVES)
let lastScoreMilestone = 0; // Tracks the last 1000-point milestone reached
let animationId;
let gameSpeed = 1;
let spawnRate = 0.016; // Reduced from 0.02 (20% easier)
let lastTime = 0;
let debugMode = false; // Debug mode flag to visualize hitboxes

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 64,
    height: 64,
    color: '#4CAF50',
    speed: 5,
    dx: 0,
    dy: 0,
    direction: PLAYER_DIRECTION.UP // Default direction
};

// Collectibles
const collectibles = [];
const enemies = [];

// Enemy definitions
const enemyDefinitions = {
    [ENEMY_TYPES.BONK]: {
        width: 64,
        height: 64,
        color: '#f44336', // Red color
        speedMultiplier: 1,
        image1Key: 'enemy1',
        image2Key: 'enemy2'
    },
    [ENEMY_TYPES.BROCCOLI]: {
        width: 64,
        height: 64,
        color: '#388E3C', // Green color
        speedMultiplier: 0.8, // Slower than bonk enemy
        image1Key: 'enemyBroccoli1',
        image2Key: 'enemyBroccoli2'
    },
    [ENEMY_TYPES.DOGE]: {
        width: 64,
        height: 64,
        color: '#2196F3', // Blue color
        speedMultiplier: 1.3, // Faster than standard enemies
        image1Key: 'enemyDoge1',
        image2Key: 'enemyDoge2'
    },
    [ENEMY_TYPES.MIGGLES]: {
        width: 64,
        height: 64,
        color: '#FF9800', // Orange color
        speedMultiplier: 1.7, // Very fast
        image1Key: 'enemyMiggles1',
        image2Key: 'enemyMiggles2'
    }
};

// Controls
const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false,
    Space: false,
    Enter: false,
    p: false, // Track P key for pause
    w: false,
    a: false,
    s: false,
    d: false, // Track d key for movement
    m: false, // Track m key for mute/unmute
    Escape: false, // Add Escape key for leaderboard navigation
    D: false // Add D key for debug mode
};

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
continueButton.addEventListener('click', continueGame);
const leaderboardButton = document.getElementById('leaderboardButton');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const backButton = document.getElementById('backButton');
const highScoreScreen = document.getElementById('highScoreScreen');
const playerNameInput = document.getElementById('playerNameInput');
const submitScoreButton = document.getElementById('submitScoreButton');
const nameInputError = document.getElementById('nameInputError');
const highScoreValue = document.getElementById('highScoreValue');
const homeButton = document.getElementById('homeButton');

leaderboardButton.addEventListener('click', showLeaderboard);
backButton.addEventListener('click', hideLeaderboard);
submitScoreButton.addEventListener('click', submitHighScore);
if (homeButton) {
    homeButton.addEventListener('click', returnToHomeScreen);
}

// Function to return to the home screen
function returnToHomeScreen() {
    console.log('Returning to home screen');
    
    // Cancel any ongoing animation
    cancelAnimationFrame(animationId);
    
    // Pause background music
    soundManager.pauseMusic();
    
    // Hide all screens
    gameOverScreen.style.display = 'none';
    continueScreen.style.display = 'none';
    highScoreScreen.style.display = 'none';
    leaderboardScreen.style.display = 'none';
    
    // Show start screen
    startScreen.style.display = 'flex';
    
    // Reset game state
    gameState = GAME_STATE.START_SCREEN;
    gameRunning = false;
    
    // Start home screen animations
    startHomeScreenAnimations();
}

// Function to show the leaderboard
function showLeaderboard() {
    console.log('Showing leaderboard');
    
    // Make sure all other screens are hidden
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    continueScreen.style.display = 'none';
    highScoreScreen.style.display = 'none';
    
    // Show the leaderboard screen
    leaderboardScreen.style.display = 'flex';
    
    // Only update previous state if we're coming from the start screen
    // This prevents overriding the START_SCREEN value set in submitHighScore
    if (gameState === GAME_STATE.START_SCREEN) {
        window.previousGameState = gameState;
    }
    
    // Populate with real high scores
    populateLeaderboard();
}

// Function to hide the leaderboard
function hideLeaderboard() {
    console.log('Hiding leaderboard');
    leaderboardScreen.style.display = 'none';
    
    // Reset the submission flag
    isSubmittingHighScore = false;
    
    // Always go back to the start screen
    startScreen.style.display = 'flex';
    // Start home screen animations again
    startHomeScreenAnimations();
    
    // Reset game state to start screen
    gameState = GAME_STATE.START_SCREEN;
    gameRunning = false;
}

// Function to populate leaderboard with real high scores
async function populateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    const loadingIndicator = document.getElementById('leaderboardLoading');
    const positionIndicator = document.getElementById('leaderboardPositionIndicator');
    const tableContainer = document.querySelector('.leaderboard-table-container');
    
    // Show loading indicator while we fetch the data
    loadingIndicator.style.display = 'block';
    
    // Clear existing rows
    leaderboardBody.innerHTML = '';
    
    try {
        // Add or update connection status indicator
        let connectionIndicator = document.getElementById('connectionIndicator');
        if (!connectionIndicator) {
            connectionIndicator = document.createElement('div');
            connectionIndicator.id = 'connectionIndicator';
            connectionIndicator.style.position = 'absolute';
            connectionIndicator.style.top = '10px';
            connectionIndicator.style.right = '10px';
            connectionIndicator.style.fontSize = '12px';
            connectionIndicator.style.padding = '4px 8px';
            connectionIndicator.style.borderRadius = '4px';
            connectionIndicator.style.color = 'white';
            connectionIndicator.style.fontFamily = "'Press Start 2P', cursive";
            document.getElementById('leaderboardScreen').appendChild(connectionIndicator);
        }
        
        // Check Firebase connection status
        let usingFirebase = false;
        if (window.firebaseDB && typeof window.firebaseDB.isConnected === 'function') {
            usingFirebase = window.firebaseDB.isConnected();
        }
        
        // Update connection indicator
        connectionIndicator.textContent = usingFirebase ? '🌐 GLOBAL' : '📱 LOCAL';
        connectionIndicator.style.backgroundColor = usingFirebase ? '#05DB4A' : '#2458f6';
        
        console.log(`Loading leaderboard data - Using ${usingFirebase ? 'Firebase (Global)' : 'localStorage (Local)'}`);
        
        // Get high scores (will try Firebase first, fallback to localStorage)
        const highScores = await getHighScores();
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Check if we have any high scores
        if (highScores.length === 0) {
            // Show empty state message
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" style="text-align: center; padding: 30px;">
                    <div style="color: #05DB4A; margin-bottom: 15px;">No high scores yet!</div>
                    <div style="color: white; font-size: 12px;">Play the game to set a new record.</div>
                </td>
            `;
            leaderboardBody.appendChild(emptyRow);
            positionIndicator.textContent = '';
            return;
        }
        
        // Set initial position indicator
        updatePositionIndicator(positionIndicator, 1, Math.min(20, highScores.length), highScores.length);
        
        // Create rows for each high score
        highScores.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            // Highlight the current player's score if it matches
            if (entry.name === currentPlayerName && entry.score === score && isNewHighScore) {
                row.classList.add('highlight');
            }
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
                <td>${entry.date}</td>
            `;
            leaderboardBody.appendChild(row);
            
            // Add a small delay to each row for a staggered animation effect
            setTimeout(() => {
                row.style.opacity = '1';
            }, index * 50);
        });
        
        // Add scroll event listener to update position indicator
        if (tableContainer) {
            tableContainer.addEventListener('scroll', () => {
                updateScrollPosition(tableContainer, positionIndicator, highScores.length);
            });
            
            // If the current player's score is in the list, scroll to it
            if (isNewHighScore) {
                scrollToCurrentPlayerScore(tableContainer, highScores);
            }
        }
    } catch (error) {
        console.error('Error populating leaderboard:', error);
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Show error message
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `
            <td colspan="4" style="text-align: center; padding: 30px;">
                <div style="color: #ff4444; margin-bottom: 15px;">Error loading high scores</div>
                <div style="color: white; font-size: 12px;">Please try again later.</div>
            </td>
        `;
        leaderboardBody.appendChild(errorRow);
        positionIndicator.textContent = '';
    }
}

/**
 * Update the position indicator based on scroll position
 * @param {HTMLElement} container - The scrollable container
 * @param {HTMLElement} indicator - The position indicator element
 * @param {number} totalScores - Total number of scores
 */
function updateScrollPosition(container, indicator, totalScores) {
    // Calculate which scores are visible
    const scrollTop = container.scrollTop;
    const rowHeight = 39; // Approximate height of each row in pixels
    
    // Calculate the first visible row (1-indexed)
    const firstVisibleRow = Math.floor(scrollTop / rowHeight) + 1;
    
    // Calculate the last visible row (accounting for visible area)
    const visibleRows = Math.floor(container.clientHeight / rowHeight);
    const lastVisibleRow = Math.min(firstVisibleRow + visibleRows - 1, totalScores);
    
    // Update the position indicator
    updatePositionIndicator(indicator, firstVisibleRow, lastVisibleRow, totalScores);
}

/**
 * Update the position indicator text
 * @param {HTMLElement} indicator - The position indicator element
 * @param {number} first - First visible score position
 * @param {number} last - Last visible score position
 * @param {number} total - Total number of scores
 */
function updatePositionIndicator(indicator, first, last, total) {
    currentVisibleScoreRange = `${first}-${last}`;
    indicator.textContent = `Showing ${first}-${last} of ${total} scores`;
}

/**
 * Scroll to the current player's score if it exists
 * @param {HTMLElement} container - The scrollable container
 * @param {Array} highScores - The array of high scores
 */
function scrollToCurrentPlayerScore(container, highScores) {
    if (!currentPlayerName || !isNewHighScore) return;
    
    // Find the index of the current player's score
    const playerScoreIndex = highScores.findIndex(
        entry => entry.name === currentPlayerName && entry.score === score
    );
    
    if (playerScoreIndex !== -1) {
        // Calculate the scroll position
        const rowHeight = 39; // Approximate height of each row
        const scrollPosition = playerScoreIndex * rowHeight;
        
        // Scroll to the position with a small delay to ensure the table is fully rendered
        setTimeout(() => {
            container.scrollTop = scrollPosition - container.clientHeight / 2 + rowHeight;
        }, 500);
    }
}

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
    
    // Handle keyboard controls for game screens
    if (e.code === 'Space' || e.code === 'Enter') {
        // Start screen - start the game with Space or Enter
        if (gameState === GAME_STATE.START_SCREEN) {
            startGame();
        }
        // Continue screen - continue the game with Space or Enter
        else if (gameState === GAME_STATE.CONTINUE) {
            continueGame();
        }
        // High score screen - submit score with Enter, but only once
        else if (gameState === GAME_STATE.HIGH_SCORE && e.code === 'Enter' && !isSubmittingHighScore) {
            submitHighScore();
        }
        // Game over screen - restart the game with Space or Enter
        else if (gameState === GAME_STATE.GAME_OVER) {
            startGame();
        }
    }

    // Handle pause toggle with P key during gameplay only
    if (e.key === 'p' && (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED)) {
        togglePause();
    }
    
    // Handle Escape key for leaderboard navigation
    if (e.key === 'Escape' && leaderboardScreen.style.display === 'flex') {
        hideLeaderboard();
    }
    
    // Toggle debug mode with D key
    if (e.key === 'd' && (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED)) {
        debugMode = !debugMode;
        console.log('Debug mode:', debugMode ? 'enabled' : 'disabled');
    }
    
    // Toggle mute with M key
    if (e.key === 'm') {
        soundManager.toggleMute();
        // Note: toggleMute now includes updateSoundButtonState()
        console.log('Sound:', soundManager.isMuted ? 'muted' : 'unmuted');
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// --- Home screen player icon animation ---
let playerIconInterval = null;
const playerIconFrames = {
    left: [
        'images/player_left_1.png',
        'images/player_left_2.png',
        'images/player_left_3.png',
        'images/player_left_2.png'
    ],
    right: [
        'images/player_right_1.png',
        'images/player_right_2.png',
        'images/player_right_3.png',
        'images/player_right_2.png'
    ]
};
let playerIconFrameIndex = 0;
const playerIconSequence = [0, 1, 2, 1];

function startPlayerIconAnimation() {
    if (playerIconInterval) return;
    playerIconInterval = setInterval(() => {
        playerIconFrameIndex = (playerIconFrameIndex + 1) % playerIconSequence.length;
        document.querySelectorAll('#startScreen img[data-player]').forEach(img => {
            const side = img.getAttribute('data-player');
            const frame = playerIconSequence[playerIconFrameIndex];
            img.src = playerIconFrames[side][frame];
        });
    }, 200); // Match in-game speed (PLAYER_ANIMATION_SPEED)
}

function stopPlayerIconAnimation() {
    if (playerIconInterval) {
        clearInterval(playerIconInterval);
        playerIconInterval = null;
    }
}

// --- Home screen enemy icon animation ---
let enemyIconInterval = null;
const enemyIconFrames = {
    miggles: [
        'images/enemy-miggles-1.png',
        'images/enemy-miggles-2.png'
    ],
    bonk: [
        'images/enemy-bonk-1.png',
        'images/enemy-bonk-2.png'
    ],
    doge: [
        'images/enemy-doge-1.png',
        'images/enemy-doge-2.png'
    ],
    broccoli: [
        'images/enemy-broccoli-1.png',
        'images/enemy-broccoli-2.png'
    ]
};
let enemyIconFrame = 0;

function startEnemyIconAnimation() {
    if (enemyIconInterval) return;
    enemyIconInterval = setInterval(() => {
        enemyIconFrame = 1 - enemyIconFrame;
        document.querySelectorAll('#startScreen img[data-enemy]').forEach(img => {
            const type = img.getAttribute('data-enemy');
            img.src = enemyIconFrames[type][enemyIconFrame];
        });
    }, 500);
}

function stopEnemyIconAnimation() {
    if (enemyIconInterval) {
        clearInterval(enemyIconInterval);
        enemyIconInterval = null;
    }
}

// --- Update start/stop logic for both enemy and player icons ---
function startHomeScreenAnimations() {
    startEnemyIconAnimation();
    startPlayerIconAnimation();
}
function stopHomeScreenAnimations() {
    stopEnemyIconAnimation();
    stopPlayerIconAnimation();
}

/**
 * Check if the current device supports touch
 * @returns {boolean} - True if the device supports touch
 */
function isTouchDevice() {
    // Check for touch support
    const touchSupport = (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
    
    // Also check user agent for mobile devices
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Debug - log to console
    console.log(`Touch detection: touch support = ${touchSupport}, mobile UA = ${mobileUserAgent}`);
    
    return touchSupport || mobileUserAgent;
}

/**
 * Initialize touch controls for mobile devices
 */
function initTouchControls() {
  // Simple detection of mobile/touch devices
  isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log(`Mobile device detected: ${isMobileDevice}`);
  
  if (!isMobileDevice) return;
  
  // Show the touch overlay
  const touchOverlay = document.getElementById('touchOverlay');
  if (!touchOverlay) {
    console.error('Touch overlay element not found!');
    return;
  }
  
  touchOverlay.style.display = 'block';
  console.log('Touch overlay displayed');
  
  // Get joystick elements
  const touchDpad = document.getElementById('touchDpad');
  const joystickHandle = document.getElementById('joystick-handle');
  const touchPause = document.getElementById('touchPause');
  const touchSound = document.getElementById('touchSound');
  
  if (!touchDpad || !joystickHandle) {
    console.error('Joystick elements not found!');
    return;
  }
  
  // Initialize sound button state
  updateSoundButtonState();
  
  // Add event listener for sound toggle button
  if (touchSound) {
    touchSound.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent default touch behavior
      soundManager.toggleMute();
      updateSoundButtonState();
      console.log('Sound state toggled via touch button');
    });
  }
  
  // Add pause button functionality
  if (touchPause) {
    // Switch from touchstart to touchend to make it work on tap rather than press
    touchPause.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) {
        togglePause();
        console.log('Game paused/unpaused via touch button');
      }
    });
    
    // Add touchstart just to prevent default behavior, but don't toggle pause
    touchPause.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent default behavior but don't toggle pause yet
    });
  }
  
  // Variables to track joystick state
  let joystickActive = false;
  let centerX = 0;
  let centerY = 0;
  let maxDistance = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  
  // Initialize joystick center position and max distance
  function updateJoystickDimensions() {
    const dpadRect = touchDpad.getBoundingClientRect();
    centerX = dpadRect.width / 2;
    centerY = dpadRect.height / 2;
    // Maximum distance is 40% of joystick radius for optimal control
    maxDistance = dpadRect.width * 0.4;
    console.log(`Joystick dimensions set - center: (${centerX}, ${centerY}), max distance: ${maxDistance}`);
  }
  
  // Call once to initialize
  updateJoystickDimensions();
  
  // Update on window resize
  window.addEventListener('resize', updateJoystickDimensions);
  
  // Handle touch start on joystick
  touchDpad.addEventListener('touchstart', function(e) {
    e.preventDefault();
    joystickActive = true;
    
    // Store the initial touch position
    touchStartX = e.touches[0].clientX - touchDpad.getBoundingClientRect().left;
    touchStartY = e.touches[0].clientY - touchDpad.getBoundingClientRect().top;
    
    // Always start with the joystick in the center position
    joystickHandle.style.left = `${centerX}px`;
    joystickHandle.style.top = `${centerY}px`;
    joystickHandle.style.transform = 'translate(-50%, -50%)';
    
    console.log(`Joystick touch started at: (${touchStartX}, ${touchStartY})`);
  });
  
  // Handle touch move for joystick
  touchDpad.addEventListener('touchmove', function(e) {
    e.preventDefault();
    
    if (!joystickActive) return;
    
    const currentTouchX = e.touches[0].clientX - touchDpad.getBoundingClientRect().left;
    const currentTouchY = e.touches[0].clientY - touchDpad.getBoundingClientRect().top;
    
    // Calculate the delta between current touch position and initial touch position
    const deltaX = currentTouchX - touchStartX;
    const deltaY = currentTouchY - touchStartY;
    
    // Update the joystick position relative to the center
    updateJoystickPosition(centerX + deltaX, centerY + deltaY);
  });
  
  // Function to update joystick position and input state
  function updateJoystickPosition(touchX, touchY) {
    // Calculate distance from center
    const deltaX = touchX - centerX;
    const deltaY = touchY - centerY;
    
    // Calculate distance
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Calculate new position with clamping to the max distance
    let newX, newY;
    if (distance > maxDistance) {
      // Normalize direction vector and multiply by maxDistance
      const normalizedX = deltaX / distance;
      const normalizedY = deltaY / distance;
      
      newX = centerX + normalizedX * maxDistance;
      newY = centerY + normalizedY * maxDistance;
    } else {
      newX = touchX;
      newY = touchY;
    }
    
    // Update joystick handle position with transform to ensure proper centering
    joystickHandle.style.left = `${newX}px`;
    joystickHandle.style.top = `${newY}px`;
    joystickHandle.style.transform = 'translate(-50%, -50%)';
    
    // Calculate normalized direction values (-1 to 1)
    const normalizedX = Math.min(Math.max((newX - centerX) / maxDistance, -1), 1);
    const normalizedY = Math.min(Math.max((newY - centerY) / maxDistance, -1), 1);
    
    // Update key states based on normalized values
    // Use threshold of 0.3 to prevent accidental movement
    const threshold = 0.3;
    
    // Reset all directions first
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
    
    // Set directions based on joystick position
    if (normalizedY < -threshold) keys.ArrowUp = true;
    if (normalizedY > threshold) keys.ArrowDown = true;
    if (normalizedX < -threshold) keys.ArrowLeft = true;
    if (normalizedX > threshold) keys.ArrowRight = true;
    
    // Store the fact that we're using touch controls to apply speed boost in updatePlayer
    usingTouchControls = true;
    
    console.log(`Joystick: (${normalizedX.toFixed(2)}, ${normalizedY.toFixed(2)})`);
  }
  
  // Handle touch end for joystick
  function handleTouchEnd(e) {
    e.preventDefault();
    
    // Only reset if no touches remain
    if (e.touches.length === 0) {
      joystickActive = false;
      
      // Reset joystick position
      joystickHandle.style.left = '50%';
      joystickHandle.style.top = '50%';
      joystickHandle.style.transform = 'translate(-50%, -50%)';
      
      // Reset all key states
      keys.ArrowUp = false;
      keys.ArrowDown = false;
      keys.ArrowLeft = false;
      keys.ArrowRight = false;
      
      // Reset touch controls flag
      usingTouchControls = false;
      
      console.log('Joystick reset to center');
    }
  }
  
  touchDpad.addEventListener('touchend', handleTouchEnd);
  touchDpad.addEventListener('touchcancel', handleTouchEnd);
  
  // Set up pause button
  const pauseButton = document.getElementById('touchPause');
  if (pauseButton) {
    // This event listener is now redundant since we've already set one up earlier
    // Removing to avoid conflicts with our modified implementation
    console.log('Pause button already configured');
  } else {
    console.error('Pause button not found!');
  }
  
  // Add touch support to game buttons
  addTouchToButtons();
  
  console.log('Joystick touch controls initialized');
}

/**
 * Handle touch start event
 * @param {TouchEvent} e - Touch event
 */
function handleTouchStart(e) {
    e.preventDefault();
    
    // Process each touch point
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const rect = canvas.getBoundingClientRect();
        
        // Convert touch position to properly account for canvas scaling
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // Check if the touch is in the D-pad area
        const dpadElement = document.getElementById('dpad');
        if (dpadElement) {
            const dpadRect = dpadElement.getBoundingClientRect();
            if (touch.clientX >= dpadRect.left && 
                touch.clientX <= dpadRect.right &&
                touch.clientY >= dpadRect.top && 
                touch.clientY <= dpadRect.bottom) {
                
                // Add an active class to the dpad
                dpadElement.classList.add('active');
                
                // D-pad touch
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                touchCurrentX = touchStartX;
                touchCurrentY = touchStartY;
                touchActive = true;
                activeTouchZones.dpad = true;
                
                // Update the D-pad center to match the element's center
                dpadCenter = {
                    x: dpadRect.left + dpadRect.width / 2,
                    y: dpadRect.top + dpadRect.height / 2
                };
            }
        }
        
        // Otherwise, it's potentially a button press or other UI interaction
        // These are handled by the button touch handlers
    }
}

/**
 * Handle touch move event
 * @param {TouchEvent} e - Touch event
 */
function handleTouchMove(e) {
    e.preventDefault();
    
    // Only process movement if the D-pad is active
    if (!activeTouchZones.dpad) return;
    
    // Find the touch that's in the D-pad area
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        // We'll process all touches for now, as we can't easily identify which touch is which
        touchCurrentX = touch.clientX;
        touchCurrentY = touch.clientY;
        updateTouchDirection();
    }
}

/**
 * Handle touch end event
 * @param {TouchEvent} e - Touch event
 */
function handleTouchEnd(e) {
    e.preventDefault();
    
    // Remove active class from dpad if it was active
    if (activeTouchZones.dpad) {
        const dpadElement = document.getElementById('dpad');
        if (dpadElement) {
            dpadElement.classList.remove('active');
        }
    }
    
    // Check if no touches remain
    if (e.touches.length === 0) {
        // All touches ended
        touchActive = false;
        
        // Reset all key states if the D-pad was active
        if (activeTouchZones.dpad) {
            keys.ArrowUp = false;
            keys.ArrowDown = false;
            keys.ArrowLeft = false;
            keys.ArrowRight = false;
            activeTouchZones.dpad = false;
        }
        
        // Remove pause area handling since we now use a dedicated pause button
        // with proper touchend event handling
        //if (activeTouchZones.pause) {
        //    if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) {
        //        togglePause();
        //    }
        //    activeTouchZones.pause = false;
        //}
    } else {
        // Some touches remain - we need to check if the d-pad touch ended
        // This is complex with multi-touch, so for simplicity, we'll just check
        // if there are still touches in the d-pad area
        
        let dpadTouchActive = false;
        const dpadElement = document.getElementById('dpad');
        
        if (dpadElement) {
            const dpadRect = dpadElement.getBoundingClientRect();
            
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                if (touch.clientX >= dpadRect.left && 
                    touch.clientX <= dpadRect.right &&
                    touch.clientY >= dpadRect.top && 
                    touch.clientY <= dpadRect.bottom) {
                    dpadTouchActive = true;
                    break;
                }
            }
        }
        
        if (!dpadTouchActive && activeTouchZones.dpad) {
            // D-pad touch ended
            keys.ArrowUp = false;
            keys.ArrowDown = false;
            keys.ArrowLeft = false;
            keys.ArrowRight = false;
            activeTouchZones.dpad = false;
            
            // Remove active class from dpad
            if (dpadElement) {
                dpadElement.classList.remove('active');
            }
        }
    }
}

/**
 * Update player direction based on touch movement
 */
function updateTouchDirection() {
    if (!activeTouchZones.dpad) return;
    
    // Calculate distance from start point
    const dx = touchCurrentX - dpadCenter.x;
    const dy = touchCurrentY - dpadCenter.y;
    
    // Reset all directions
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
    
    // Reset all direction indicators
    const dpadElement = document.getElementById('dpad');
    if (dpadElement) {
        dpadElement.classList.remove('up', 'down', 'left', 'right');
        
        // Reset all direction indicators to default color
        const arrows = dpadElement.querySelectorAll('.direction-indicator');
        arrows.forEach(arrow => {
            if (arrow.classList.contains('up')) {
                arrow.style.borderBottom = '15px solid rgba(255, 255, 255, 0.7)';
            } else if (arrow.classList.contains('right')) {
                arrow.style.borderLeft = '15px solid rgba(255, 255, 255, 0.7)';
            } else if (arrow.classList.contains('down')) {
                arrow.style.borderTop = '15px solid rgba(255, 255, 255, 0.7)';
            } else if (arrow.classList.contains('left')) {
                arrow.style.borderRight = '15px solid rgba(255, 255, 255, 0.7)';
            }
        });
    }
    
    // Calculate distance from center
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only register movement if the touch has moved beyond the threshold
    if (distance > touchThreshold) {
        // Calculate the angle of the touch from the center
        const angle = Math.atan2(dy, dx);
        
        // Convert angle to degrees for easier understanding
        const degrees = angle * 180 / Math.PI;
        
        // Determine direction based on angle
        // Right: -45° to 45°
        // Down: 45° to 135°
        // Left: 135° to -135°
        // Up: -135° to -45°
        
        if (degrees >= -45 && degrees < 45) {
            keys.ArrowRight = true;
            if (dpadElement) {
                dpadElement.classList.add('right');
                // Highlight right arrow
                const rightArrow = dpadElement.querySelector('.direction-indicator.right');
                if (rightArrow) {
                    rightArrow.style.borderLeft = '15px solid #05DB4A';
                }
            }
        } else if (degrees >= 45 && degrees < 135) {
            keys.ArrowDown = true;
            if (dpadElement) {
                dpadElement.classList.add('down');
                // Highlight down arrow
                const downArrow = dpadElement.querySelector('.direction-indicator.down');
                if (downArrow) {
                    downArrow.style.borderTop = '15px solid #05DB4A';
                }
            }
        } else if (degrees >= 135 || degrees < -135) {
            keys.ArrowLeft = true;
            if (dpadElement) {
                dpadElement.classList.add('left');
                // Highlight left arrow
                const leftArrow = dpadElement.querySelector('.direction-indicator.left');
                if (leftArrow) {
                    leftArrow.style.borderRight = '15px solid #05DB4A';
                }
            }
        } else if (degrees >= -135 && degrees < -45) {
            keys.ArrowUp = true;
            if (dpadElement) {
                dpadElement.classList.add('up');
                // Highlight up arrow
                const upArrow = dpadElement.querySelector('.direction-indicator.up');
                if (upArrow) {
                    upArrow.style.borderBottom = '15px solid #05DB4A';
                }
            }
        }
    }
}

/**
 * Add touch event handlers to game buttons
 */
function addTouchToButtons() {
    // Add touch events to the standard game buttons
    const buttons = [
        { id: 'startButton', action: startGame },
        { id: 'continueButton', action: continueGame },
        { id: 'restartButton', action: startGame },
        { id: 'leaderboardButton', action: showLeaderboard },
        { id: 'backButton', action: hideLeaderboard },
        { id: 'submitScoreButton', action: submitHighScore },
        { id: 'homeButton', action: returnToHomeScreen }
    ];
    
    buttons.forEach(buttonInfo => {
        const button = document.getElementById(buttonInfo.id);
        if (button) {
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                buttonInfo.action();
            });
        }
    });
    
    // Add touch event for the name input field to show keyboard on mobile
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput) {
        nameInput.addEventListener('touchend', function(e) {
            // Don't prevent default here to allow the input to be focused
            this.focus();
        });
    }
    
    console.log('Touch events added to game buttons');
}

// Handle window resizing
window.addEventListener('resize', () => {
    updateGameScale();
});

// Preload assets
function preloadAssets(callback) {
    // First load the external images
    totalAssets = assetsToLoad.length;
    
    if (totalAssets === 0) {
        generateGameAssets(callback);
        return;
    }
    
    assetsToLoad.forEach(asset => {
        const img = new Image();
        img.onload = function() {
            gameAssets[asset.name] = img;
            assetsLoaded++;
            
            // Update loading progress
            if (loadingProgress) {
                loadingProgress.style.width = `${(assetsLoaded / totalAssets) * 100}%`;
            }
            
            if (assetsLoaded === totalAssets) {
                // Generate the rest of the assets
                generateGameAssets(callback);
            }
        };
        
        img.onerror = function() {
            console.error(`Failed to load ${asset.src}`);
            assetsLoaded++;
            
            if (assetsLoaded === totalAssets) {
                generateGameAssets(callback);
            }
        };
        
        img.src = asset.src;
    });
}

// Generate programmatic assets
function generateGameAssets(callback) {
    // Use ImageGenerator to create the rest of the assets
    const generator = new ImageGenerator();
    const generatedImages = generator.generateGameImages();
    
    // Assign generated images to gameAssets if not already loaded
    for (const key in generatedImages) {
        if (!gameAssets[key]) {
            const img = new Image();
            img.onload = function() {
                gameAssets[key] = img;
                
                // Check if all assets are now loaded
                if (
                    gameAssets.playerUp1 && 
                    gameAssets.playerUp2 && 
                    gameAssets.playerUp3 && 
                    gameAssets.playerDown1 && 
                    gameAssets.playerDown2 && 
                    gameAssets.playerDown3 &&
                    gameAssets.playerLeft1 &&
                    gameAssets.playerLeft2 &&
                    gameAssets.playerLeft3 &&
                    gameAssets.playerRight1 &&
                    gameAssets.playerRight2 &&
                    gameAssets.playerRight3 &&
                    gameAssets.playerDeath1 &&
                    gameAssets.playerDeath2 &&
                    gameAssets.playerDeath3 &&
                    gameAssets.playerDeath4 &&
                    gameAssets.playerDeath5 &&
                    gameAssets.playerDeath6 &&
                    gameAssets.playerDeath7 &&
                    gameAssets.playerDeath8 &&
                    gameAssets.playerLives &&
                    gameAssets.coin1 && 
                    gameAssets.coin2 && 
                    gameAssets.enemy1 &&
                    gameAssets.enemy2 &&
                    gameAssets.enemyBroccoli1 &&
                    gameAssets.enemyBroccoli2 &&
                    gameAssets.enemyDoge1 &&
                    gameAssets.enemyDoge2 &&
                    gameAssets.enemyMiggles1 &&
                    gameAssets.enemyMiggles2 &&
                    (gameAssets.powerup || key === 'powerup')
                ) {
                    if (callback) callback();
                }
            };
            img.src = generatedImages[key];
        }
    }
    
    // If we already have all assets, call the callback
    if (
        gameAssets.playerUp1 && 
        gameAssets.playerUp2 && 
        gameAssets.playerUp3 && 
        gameAssets.playerDown1 && 
        gameAssets.playerDown2 && 
        gameAssets.playerDown3 &&
        gameAssets.playerLeft1 &&
        gameAssets.playerLeft2 &&
        gameAssets.playerLeft3 &&
        gameAssets.playerRight1 &&
        gameAssets.playerRight2 &&
        gameAssets.playerRight3 &&
        gameAssets.playerDeath1 &&
        gameAssets.playerDeath2 &&
        gameAssets.playerDeath3 &&
        gameAssets.playerDeath4 &&
        gameAssets.playerDeath5 &&
        gameAssets.playerDeath6 &&
        gameAssets.playerDeath7 &&
        gameAssets.playerDeath8 &&
        gameAssets.playerLives &&
        gameAssets.coin1 && 
        gameAssets.coin2 && 
        gameAssets.enemy1 &&
        gameAssets.enemy2 &&
        gameAssets.enemyBroccoli1 &&
        gameAssets.enemyBroccoli2 &&
        gameAssets.enemyDoge1 &&
        gameAssets.enemyDoge2 &&
        gameAssets.enemyMiggles1 &&
        gameAssets.enemyMiggles2 &&
        gameAssets.powerup
    ) {
        if (callback) callback();
    }
}

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize the game
 */
function init() {
    // Show loading screen
    loadingScreen.style.display = 'flex';
    startScreen.style.display = 'none';
    gameState = GAME_STATE.LOADING;
    
    // Initialize previousGameState variable
    window.previousGameState = GAME_STATE.START_SCREEN;
    
    // Initialize sound manager
    soundManager.init();
    
    // Check if we're on a mobile device
    isMobileDevice = isTouchDevice();
    
    // If Firebase is available, initialize it
    if (window.firebaseDB && typeof window.firebaseDB.init === 'function') {
        console.log('Initializing Firebase...');
        window.firebaseDB.init().then(connected => {
            console.log(`Firebase initialization ${connected ? 'successful' : 'failed'}`);
        }).catch(error => {
            console.error('Firebase initialization error:', error);
        });
    } else {
        console.warn('Firebase not available, using localStorage only for high scores');
    }
    
    // Preload assets first
    preloadAssets(() => {
        // Hide loading screen when done
        loadingScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        gameState = GAME_STATE.START_SCREEN;
        
        // Draw initial frame
        drawPlayer();
        // Start home screen animations
        startHomeScreenAnimations();
        
        // Initialize touch controls
        initTouchControls();
        
        // Make sure the game scale is updated
        updateGameScale();
    });
}

function startGame() {
    // Reset game state
    gameRunning = true;
    gameState = GAME_STATE.PLAYING;
    score = 0;
    lastScoreMilestone = 0; // Reset milestone tracker
    lives = INITIAL_LIVES; // Reset lives to initial value (was MAX_LIVES)
    updateMilestoneProgress(); // Initialize milestone progress
    collectibles.length = 0;
    enemies.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    gameSpeed = 1;
    spawnRate = 0.016; // Reduced from 0.02 (20% easier)
    isNewHighScore = false; // Reset high score state
    currentPlayerName = ''; // Reset player name
    isSubmittingHighScore = false; // Reset submission flag
    
    // Reset animation variables
    coinAnimationFrame = 0;
    enemyAnimationFrame = 0;
    playerAnimationFrame = 0;
    playerAnimationIndex = 0;
    coinAnimationCounter = 0;
    enemyAnimationCounter = 0;
    playerAnimationCounter = 0;
    deathAnimationFrame = 0;
    deathAnimationCounter = 0;
    
    // Hide all game screens
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    continueScreen.style.display = 'none';
    highScoreScreen.style.display = 'none';
    leaderboardScreen.style.display = 'none';
    
    // Stop home screen animations
    stopHomeScreenAnimations();
    
    // Update touch controls visibility
    updateTouchControlsVisibility();
    
    // Play background music
    soundManager.playMusic();
    
    // Start the game loop
    lastTime = performance.now();
    gameLoop();
}

/**
 * Draw the virtual D-pad for touch controls
 */
function drawTouchControls() {
    if (!activeTouchZones.dpad) return;
    
    // Show the touch controls container during gameplay
    const touchControls = document.getElementById('touchControls');
    if (touchControls) {
        touchControls.style.display = 'flex';
    }
    
    // We're now using HTML elements for the D-pad, so we don't need to draw on canvas
    // The D-pad is created and styled in updateGameScale and CSS
}

function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw tiled background
    drawTiledBackground();
    
    // Update touch controls visibility based on game state
    updateTouchControlsVisibility();
    
    // Update animation counters based on game state
    if (gameState === GAME_STATE.PLAYING) {
        // Coin animation
        coinAnimationCounter++;
        if (coinAnimationCounter >= COIN_ANIMATION_SPEED) {
            coinAnimationFrame = coinAnimationFrame === 0 ? 1 : 0;
            coinAnimationCounter = 0;
        }
        
        // Pepe coin animation
        pepeCoinAnimationCounter++;
        if (pepeCoinAnimationCounter >= PEPE_COIN_ANIMATION_SPEED) {
            pepeCoinAnimationFrame = pepeCoinAnimationFrame === 0 ? 1 : 0;
            pepeCoinAnimationCounter = 0;
        }
        
        // Doms coin animation
        domsCoinAnimationCounter++;
        if (domsCoinAnimationCounter >= DOMS_COIN_ANIMATION_SPEED) {
            domsCoinAnimationFrame = domsCoinAnimationFrame === 0 ? 1 : 0;
            domsCoinAnimationCounter = 0;
        }
        
        // Elon coin animation
        elonCoinAnimationCounter++;
        if (elonCoinAnimationCounter >= ELON_COIN_ANIMATION_SPEED) {
            elonCoinAnimationFrame = elonCoinAnimationFrame === 0 ? 1 : 0;
            elonCoinAnimationCounter = 0;
        }
        
        // Hosico coin animation
        hosicoCoinAnimationCounter++;
        if (hosicoCoinAnimationCounter >= HOSICO_COIN_ANIMATION_SPEED) {
            hosicoCoinAnimationFrame = hosicoCoinAnimationFrame === 0 ? 1 : 0;
            hosicoCoinAnimationCounter = 0;
        }
        
        // Enemy animation (separate from coin animation)
        enemyAnimationCounter++;
        if (enemyAnimationCounter >= ENEMY_ANIMATION_SPEED) {
            enemyAnimationFrame = enemyAnimationFrame === 0 ? 1 : 0;
            enemyAnimationCounter = 0;
        }
        
        // Player animation
        playerAnimationCounter++;
        if (playerAnimationCounter >= PLAYER_ANIMATION_SPEED) {
            playerAnimationFrame = playerAnimationSequence[playerAnimationIndex];
            playerAnimationIndex = (playerAnimationIndex + 1) % playerAnimationSequence.length;
            playerAnimationCounter = 0;
        }
        
        // Update
        updatePlayer();
        updateCollectibles(deltaTime);
        updateEnemies(deltaTime);
        checkCollisions();
        
        // Spawn new objects
        if (Math.random() < spawnRate) {
            spawnCollectible();
        }
        
        if (Math.random() < spawnRate * 0.4) { // Reduced from 0.5 (20% fewer enemies)
            spawnEnemy();
        }
        
        // Increase difficulty over time
        gameSpeed += 0.00008; // Reduced from 0.0001 (20% slower difficulty increase)
        spawnRate += 0.000016; // Reduced from 0.00002 (20% slower spawn rate increase)
        
        // Draw
        drawPlayer();
        drawCollectibles();
        drawEnemies();
        
        // Draw UI elements on canvas
        drawScoreOnCanvas();
        drawLivesOnCanvas();
        
        // Draw hitboxes in debug mode
        if (debugMode) {
            drawHitboxes();
        }
        
        // Draw touch controls if on mobile
        drawTouchControls();
    }
    else if (gameState === GAME_STATE.PAUSED) {
        // Draw tiled background
        drawTiledBackground();
        
        // Draw all game elements in their current state
        drawPlayer();
        drawCollectibles();
        drawEnemies();
        
        // Also draw UI elements
        drawScoreOnCanvas();
        drawLivesOnCanvas();
        
        // Draw hitboxes in debug mode
        if (debugMode) {
            drawHitboxes();
        }
        
        // Draw touch controls if on mobile
        drawTouchControls();
        
        // Draw pause overlay
        drawPauseOverlay();
    }
    else if (gameState === GAME_STATE.DYING) {
        // Handle death animation
        deathAnimationCounter++;
        if (deathAnimationCounter >= DEATH_ANIMATION_SPEED) {
            deathAnimationFrame++;
            deathAnimationCounter = 0;
            
            // If we've completed all frames, handle life lost instead of directly showing game over
            if (deathAnimationFrame >= DEATH_ANIMATION_FRAMES) {
                handleLifeLost();
                return;
            }
        }
        
        // Draw tiled background
        drawTiledBackground();
        
        // Draw static game elements
        drawCollectibles();
        drawEnemies();
        drawDeathAnimation();
        
        // Also draw UI elements during death animation
        drawScoreOnCanvas();
        drawLivesOnCanvas();
        
        // Draw hitboxes in debug mode
        if (debugMode) {
            drawHitboxes();
        }
        
        // Draw touch controls if on mobile
        drawTouchControls();
    }
    
    // Continue the game loop
    animationId = requestAnimationFrame(gameLoop);
}

/**
 * Draw hitboxes for debugging collision detection
 */
function drawHitboxes() {
    // Draw player hitbox
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const playerRadius = player.width / 2;
    
    ctx.beginPath();
    ctx.arc(playerCenterX, playerCenterY, playerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw enemy hitboxes
    enemies.forEach(enemy => {
        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        const enemyRadius = enemy.width / 2;
        
        ctx.beginPath();
        ctx.arc(enemyCenterX, enemyCenterY, enemyRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function updatePlayer() {
    // Reset velocity
    player.dx = 0;
    player.dy = 0;
    
    // Track if any movement keys are pressed
    let isMoving = false;
    
    // Calculate the effective player speed - 20% faster when using touch controls
    const effectiveSpeed = usingTouchControls ? player.speed * 1.2 : player.speed;
    
    // Handle directional movement
    // Note: We check each direction separately to handle diagonal movement
    // Priority order: left/right first, then up/down
    
    if ((keys.ArrowRight || keys.d) && player.x < canvas.width - player.width) {
        player.dx = effectiveSpeed;
        player.direction = PLAYER_DIRECTION.RIGHT;
        isMoving = true;
    }
    else if ((keys.ArrowLeft || keys.a) && player.x > 0) {
        player.dx = -effectiveSpeed;
        player.direction = PLAYER_DIRECTION.LEFT;
        isMoving = true;
    }
    
    // Only change to up/down direction if not moving left/right
    if (!isMoving) {
        if ((keys.ArrowDown || keys.s) && player.y < canvas.height - player.height) {
            player.dy = effectiveSpeed;
            player.direction = PLAYER_DIRECTION.DOWN;
            isMoving = true;
        }
        else if ((keys.ArrowUp || keys.w) && player.y > 0) {
            player.dy = -effectiveSpeed;
            player.direction = PLAYER_DIRECTION.UP;
            isMoving = true;
        }
    } 
    else {
        // If we're already moving left/right, still allow up/down movement
        if ((keys.ArrowDown || keys.s) && player.y < canvas.height - player.height) {
            player.dy = effectiveSpeed;
        }
        else if ((keys.ArrowUp || keys.w) && player.y > 0) {
            player.dy = -effectiveSpeed;
        }
    }
    
    // If no movement keys are pressed, revert to UP direction
    if (!isMoving && 
        !keys.ArrowUp && !keys.ArrowDown && !keys.ArrowLeft && !keys.ArrowRight &&
        !keys.w && !keys.a && !keys.s && !keys.d) {
        player.direction = PLAYER_DIRECTION.UP;
    }
    
    // Update position
    player.x += player.dx;
    player.y += player.dy;
    
    // Keep player within bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function drawPlayer() {
    // Check if we have all player direction sprites loaded
    if (
        gameAssets.playerUp1 && gameAssets.playerUp2 && gameAssets.playerUp3 &&
        gameAssets.playerDown1 && gameAssets.playerDown2 && gameAssets.playerDown3 &&
        gameAssets.playerLeft1 && gameAssets.playerLeft2 && gameAssets.playerLeft3 &&
        gameAssets.playerRight1 && gameAssets.playerRight2 && gameAssets.playerRight3
    ) {
        // Get the current player image based on direction and animation frame
        let currentPlayerImage;
        
        switch(player.direction) {
            case PLAYER_DIRECTION.UP:
                switch(playerAnimationFrame) {
                    case 0: currentPlayerImage = gameAssets.playerUp1; break;
                    case 1: currentPlayerImage = gameAssets.playerUp2; break;
                    case 2: currentPlayerImage = gameAssets.playerUp3; break;
                    default: currentPlayerImage = gameAssets.playerUp1;
                }
                break;
                
            case PLAYER_DIRECTION.DOWN:
                switch(playerAnimationFrame) {
                    case 0: currentPlayerImage = gameAssets.playerDown1; break;
                    case 1: currentPlayerImage = gameAssets.playerDown2; break;
                    case 2: currentPlayerImage = gameAssets.playerDown3; break;
                    default: currentPlayerImage = gameAssets.playerDown1;
                }
                break;
                
            case PLAYER_DIRECTION.LEFT:
                switch(playerAnimationFrame) {
                    case 0: currentPlayerImage = gameAssets.playerLeft1; break;
                    case 1: currentPlayerImage = gameAssets.playerLeft2; break;
                    case 2: currentPlayerImage = gameAssets.playerLeft3; break;
                    default: currentPlayerImage = gameAssets.playerLeft1;
                }
                break;
                
            case PLAYER_DIRECTION.RIGHT:
                switch(playerAnimationFrame) {
                    case 0: currentPlayerImage = gameAssets.playerRight1; break;
                    case 1: currentPlayerImage = gameAssets.playerRight2; break;
                    case 2: currentPlayerImage = gameAssets.playerRight3; break;
                    default: currentPlayerImage = gameAssets.playerRight1;
                }
                break;
                
            default:
                currentPlayerImage = gameAssets.playerUp1;
        }
        
        ctx.drawImage(
            currentPlayerImage,
            player.x,
            player.y,
            player.width,
            player.height
        );
    } else {
        // Fallback to original drawing code
        ctx.fillStyle = player.color;
        
        // Draw body
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2 - 8, player.y + player.height / 2 - 5, 5, 0, Math.PI * 2);
        ctx.arc(player.x + player.width / 2 + 8, player.y + player.height / 2 - 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2 - 8, player.y + player.height / 2 - 5, 2, 0, Math.PI * 2);
        ctx.arc(player.x + player.width / 2 + 8, player.y + player.height / 2 - 5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw smile
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height / 2 + 5, 10, 0, Math.PI);
        ctx.stroke();
    }
}

function spawnCollectible() {
    // First decide if this will be a special coin (any kind) or regular coin
    const isSpecialCoin = Math.random() < SPECIAL_COIN_SPAWN_CHANCE;
    
    if (isSpecialCoin) {
        // Then decide which special coin to spawn with equal probability
        const specialCoinRandom = Math.random();
        let coinType;
        
        if (specialCoinRandom < 0.25) {
            coinType = COIN_TYPES.PEPE;
        } else if (specialCoinRandom < 0.5) {
            coinType = COIN_TYPES.DOMS;
        } else if (specialCoinRandom < 0.75) {
            coinType = COIN_TYPES.ELON;
        } else {
            coinType = COIN_TYPES.HOSICO;
        }
        
        const collectible = {
            type: coinType,
            x: Math.random() * (canvas.width - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: 2 + Math.random() * 2
        };
        collectibles.push(collectible);
    } else {
        const collectible = {
            type: COIN_TYPES.REGULAR,
            x: Math.random() * (canvas.width - 32),
            y: -32,
            width: 32,
            height: 32,
            speed: 2 + Math.random() * 2
        };
        collectibles.push(collectible);
    }
}

function updateCollectibles(deltaTime) {
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const collectible = collectibles[i];
        
        // Move collectible down
        collectible.y += collectible.speed * gameSpeed * (deltaTime / 16);
        
        // Remove if off screen
        if (collectible.y > canvas.height) {
            collectibles.splice(i, 1);
        }
    }
}

function drawCollectibles() {
    collectibles.forEach(collectible => {
        if (collectible.type === COIN_TYPES.PEPE) {
            const currentPepeCoinImage = pepeCoinAnimationFrame === 0 ? gameAssets.pepeCoin1 : gameAssets.pepeCoin2;
            if (currentPepeCoinImage) {
                ctx.drawImage(
                    currentPepeCoinImage,
                    collectible.x,
                    collectible.y,
                    collectible.width,
                    collectible.height
                );
            } else {
                // Fallback: draw a green coin with a Pepe face (simple)
                ctx.fillStyle = '#39FF14';
                ctx.beginPath();
                ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = '10px "Press Start 2P", cursive';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🐸', collectible.x + collectible.width / 2, collectible.y + collectible.height / 2);
            }
        } else if (collectible.type === COIN_TYPES.DOMS) {
            const currentDomsCoinImage = domsCoinAnimationFrame === 0 ? gameAssets.domsCoin1 : gameAssets.domsCoin2;
            if (currentDomsCoinImage) {
                ctx.drawImage(
                    currentDomsCoinImage,
                    collectible.x,
                    collectible.y,
                    collectible.width,
                    collectible.height
                );
            } else {
                // Fallback: draw a purple coin with DOMS text
                ctx.fillStyle = '#8A2BE2'; // Purple
                ctx.beginPath();
                ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFF';
                ctx.font = '10px "Press Start 2P", cursive';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('DOMS', collectible.x + collectible.width / 2, collectible.y + collectible.height / 2);
            }
        } else if (collectible.type === COIN_TYPES.ELON) {
            const currentElonCoinImage = elonCoinAnimationFrame === 0 ? gameAssets.elonCoin1 : gameAssets.elonCoin2;
            if (currentElonCoinImage) {
                ctx.drawImage(
                    currentElonCoinImage,
                    collectible.x,
                    collectible.y,
                    collectible.width,
                    collectible.height
                );
            } else {
                // Fallback: draw a blue coin with ELON text
                ctx.fillStyle = '#1DA1F2'; // Twitter blue
                ctx.beginPath();
                ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFF';
                ctx.font = '10px "Press Start 2P", cursive';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('ELON', collectible.x + collectible.width / 2, collectible.y + collectible.height / 2);
            }
        } else if (collectible.type === COIN_TYPES.HOSICO) {
            const currentHosicoCoinImage = hosicoCoinAnimationFrame === 0 ? gameAssets.hosicoCoin1 : gameAssets.hosicoCoin2;
            if (currentHosicoCoinImage) {
                ctx.drawImage(
                    currentHosicoCoinImage,
                    collectible.x,
                    collectible.y,
                    collectible.width,
                    collectible.height
                );
            } else {
                // Fallback: draw an orange coin with CAT text
                ctx.fillStyle = '#FF9900'; // Orange
                ctx.beginPath();
                ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFF';
                ctx.font = '10px "Press Start 2P", cursive';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('CAT', collectible.x + collectible.width / 2, collectible.y + collectible.height / 2);
            }
        } else {
            // Regular coin
            const currentCoinImage = coinAnimationFrame === 0 ? gameAssets.coin1 : gameAssets.coin2;
            if (currentCoinImage) {
                ctx.drawImage(
                    currentCoinImage,
                    collectible.x,
                    collectible.y,
                    collectible.width,
                    collectible.height
                );
            } else {
                // Fallback to original drawing code
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = '10px "Press Start 2P", cursive';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', collectible.x + collectible.width / 2, collectible.y + collectible.height / 2);
                ctx.fillStyle = '#FFD700';
            }
        }
    });
}

function spawnEnemy() {
    // Randomly select enemy type with balanced distribution
    const randomValue = Math.random();
    let enemyType;
    
    if (randomValue < 0.45) {
        enemyType = ENEMY_TYPES.BONK;       // 45% chance (up from 40%)
    } else if (randomValue < 0.8) {
        enemyType = ENEMY_TYPES.BROCCOLI;   // 35% chance (up from 30% - easier enemy)
    } else if (randomValue < 0.9) {
        enemyType = ENEMY_TYPES.DOGE;       // 10% chance (down from 15% - harder enemy)
    } else {
        enemyType = ENEMY_TYPES.MIGGLES;    // 10% chance (down from 15% - hardest enemy)
    }
    
    // Get enemy definition based on type
    const enemyDef = enemyDefinitions[enemyType];
    
    // Create enemy with properties from definition
    const enemy = {
        type: enemyType,
        x: Math.random() * (canvas.width - enemyDef.width),
        y: -enemyDef.height,
        width: enemyDef.width,
        height: enemyDef.height,
        color: enemyDef.color,
        speed: (2.4 + Math.random() * 2.4) * enemyDef.speedMultiplier, // Reduced from (3 + random * 3) by 20%
        image1Key: enemyDef.image1Key,
        image2Key: enemyDef.image2Key
    };
    
    enemies.push(enemy);
}

function updateEnemies(deltaTime) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // Move enemy down
        enemy.y += enemy.speed * gameSpeed * (deltaTime / 16);
        
        // Remove if off screen
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
        }
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Determine which enemy image to use based on enemy type and animation frame
        const image1Key = enemy.image1Key;
        const image2Key = enemy.image2Key;
        
        const currentEnemyImage = enemyAnimationFrame === 0 ? 
            gameAssets[image1Key] : gameAssets[image2Key];
        
        if (currentEnemyImage) {
            ctx.drawImage(
                currentEnemyImage,
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );
        } else {
            // Fallback to drawing based on enemy type
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 
                    enemy.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw enemy features based on type
            if (enemy.type === ENEMY_TYPES.BONK) {
                // Draw X eyes for bonk enemy
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                
                // Left eye
                ctx.beginPath();
                ctx.moveTo(enemy.x + enemy.width / 2 - 10, enemy.y + enemy.height / 2 - 5);
                ctx.lineTo(enemy.x + enemy.width / 2 - 5, enemy.y + enemy.height / 2);
                ctx.moveTo(enemy.x + enemy.width / 2 - 10, enemy.y + enemy.height / 2);
                ctx.lineTo(enemy.x + enemy.width / 2 - 5, enemy.y + enemy.height / 2 - 5);
                ctx.stroke();
                
                // Right eye
                ctx.beginPath();
                ctx.moveTo(enemy.x + enemy.width / 2 + 5, enemy.y + enemy.height / 2 - 5);
                ctx.lineTo(enemy.x + enemy.width / 2 + 10, enemy.y + enemy.height / 2);
                ctx.moveTo(enemy.x + enemy.width / 2 + 5, enemy.y + enemy.height / 2);
                ctx.lineTo(enemy.x + enemy.width / 2 + 10, enemy.y + enemy.height / 2 - 5);
                ctx.stroke();
                
                // Angry mouth
                ctx.beginPath();
                ctx.moveTo(enemy.x + enemy.width / 2 - 8, enemy.y + enemy.height / 2 + 5);
                ctx.lineTo(enemy.x + enemy.width / 2 + 8, enemy.y + enemy.height / 2 + 5);
                ctx.stroke();
            } else if (enemy.type === ENEMY_TYPES.BROCCOLI) {
                // Draw broccoli enemy features
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                
                // Eyes
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2 - 6, enemy.y + enemy.height / 2 - 8, 4, 0, Math.PI * 2);
                ctx.arc(enemy.x + enemy.width / 2 + 6, enemy.y + enemy.height / 2 - 8, 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Pupils
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2 - 6, enemy.y + enemy.height / 2 - 8, 2, 0, Math.PI * 2);
                ctx.arc(enemy.x + enemy.width / 2 + 6, enemy.y + enemy.height / 2 - 8, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Mouth
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 + 5, 8, 0, Math.PI);
                ctx.stroke();
            } else if (enemy.type === ENEMY_TYPES.DOGE) {
                // Draw Doge enemy features
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                
                // Sunglasses
                ctx.fillStyle = 'black';
                ctx.fillRect(enemy.x + enemy.width / 2 - 12, enemy.y + enemy.height / 2 - 7, 24, 5);
                
                // Smile
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 + 5, 8, 0.2, Math.PI - 0.2);
                ctx.stroke();
            } else if (enemy.type === ENEMY_TYPES.MIGGLES) {
                // Draw Miggles enemy features
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                
                // Eyes
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2 - 5, enemy.y + enemy.height / 2 - 5, 3, 0, Math.PI * 2);
                ctx.arc(enemy.x + enemy.width / 2 + 5, enemy.y + enemy.height / 2 - 5, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Pupils
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2 - 5, enemy.y + enemy.height / 2 - 5, 1.5, 0, Math.PI * 2);
                ctx.arc(enemy.x + enemy.width / 2 + 5, enemy.y + enemy.height / 2 - 5, 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                // Frown
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 + 5, 6, Math.PI, Math.PI * 2);
                ctx.stroke();
            }
        }
    });
}

function drawDeathAnimation() {
    // Get the current death frame image
    const deathFrameKey = `playerDeath${deathAnimationFrame + 1}`;
    const currentDeathImage = gameAssets[deathFrameKey];
    
    if (currentDeathImage) {
        ctx.drawImage(
            currentDeathImage,
            player.x,
            player.y,
            player.width,
            player.height
        );
    } else {
        // Fallback if image not available - draw fading green circle
        const alpha = 1 - (deathAnimationFrame / DEATH_ANIMATION_FRAMES);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw X eyes
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        
        // Left eye
        ctx.beginPath();
        ctx.moveTo(player.x + player.width/2 - 10, player.y + player.height/2 - 5);
        ctx.lineTo(player.x + player.width/2 - 5, player.y + player.height/2);
        ctx.moveTo(player.x + player.width/2 - 10, player.y + player.height/2);
        ctx.lineTo(player.x + player.width/2 - 5, player.y + player.height/2 - 5);
        ctx.stroke();
        
        // Right eye
        ctx.beginPath();
        ctx.moveTo(player.x + player.width/2 + 5, player.y + player.height/2 - 5);
        ctx.lineTo(player.x + player.width/2 + 10, player.y + player.height/2);
        ctx.moveTo(player.x + player.width/2 + 5, player.y + player.height/2);
        ctx.lineTo(player.x + player.width/2 + 10, player.y + player.height/2 - 5);
        ctx.stroke();
        
        // Draw frowning mouth
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2 + 5, 8, Math.PI, Math.PI * 2);
        ctx.stroke();
        
        // Reset alpha
        ctx.globalAlpha = 1.0;
    }
}

/**
 * Display a centered special coin notification
 * @param {string} text - The notification text to display
 * @param {string} color - The text color (optional)
 */
function showSpecialCoinNotification(text, color = '#05DB4A') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'special-coin-notification';
    notification.textContent = text;
    notification.style.color = color;
    
    // Position in the center of the game container
    const gameContainer = document.getElementById('gameContainer');
    notification.style.position = 'absolute';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    // Font size now defined in CSS
    notification.style.fontFamily = '"Press Start 2P", cursive';
    notification.style.textAlign = 'center';
    notification.style.zIndex = '1000';
    notification.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    notification.style.pointerEvents = 'none';
    
    // Add to game container
    gameContainer.appendChild(notification);
    
    // Add fade-out animation
    notification.style.animation = 'fadeInOut 2s ease-in-out';
    
    // Remove after animation completes
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function checkCollisions() {
    // Check collectible collisions
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const collectible = collectibles[i];
        if (
            player.x < collectible.x + collectible.width &&
            player.x + player.width > collectible.x &&
            player.y < collectible.y + collectible.height &&
            player.y + player.height > collectible.y
        ) {
            // Collect and increase score
            collectibles.splice(i, 1);
            if (collectible.type === COIN_TYPES.PEPE) {
                score += 300; // Increased from 250 to 300
                // Play special coin sound effect
                soundManager.playSoundEffect('specialCoin');
                // Show notification centered on screen
                showSpecialCoinNotification('+300! PEPE COIN!', '#05DB4A');
            } else if (collectible.type === COIN_TYPES.DOMS) {
                score += 200; // Already correct at 200
                // Play special coin sound effect
                soundManager.playSoundEffect('specialCoin');
                // Show notification centered on screen
                showSpecialCoinNotification('+200! DOMS COIN!', '#8A2BE2'); // Purple to match the coin
            } else if (collectible.type === COIN_TYPES.ELON) {
                score += 150; // Already correct at 150
                // Play special coin sound effect
                soundManager.playSoundEffect('specialCoin');
                // Show notification centered on screen
                showSpecialCoinNotification('+150! ELON COIN!', '#1DA1F2'); // Twitter blue to match the coin
            } else if (collectible.type === COIN_TYPES.HOSICO) {
                score += 250; // Already correct at 250
                // Play special coin sound effect
                soundManager.playSoundEffect('specialCoin');
                // Show notification centered on screen
                showSpecialCoinNotification('+250! HOSICO COIN!', '#FF9900'); // Orange to match the coin
            } else {
                score += 10;
                // Play normal coin sound effect
                soundManager.playSoundEffect('normalCoin');
            }
            updateMilestoneProgress();
            checkScoreMilestone();
        }
    }
    
    // Only check enemy collisions if we're in the playing state
    if (gameState === GAME_STATE.PLAYING) {
        // Check enemy collisions
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            
            // Calculate centers of player and enemy
            const playerCenterX = player.x + player.width / 2;
            const playerCenterY = player.y + player.height / 2;
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2;
            
            // Calculate distance between centers using Pythagorean theorem
            const dx = playerCenterX - enemyCenterX;
            const dy = playerCenterY - enemyCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Define radii for player and enemy (half of their width or height)
            const playerRadius = player.width / 2;
            const enemyRadius = enemy.width / 2;
            
            // Collision occurs if distance is less than the sum of radii
            if (distance < playerRadius + enemyRadius) {
                // Start death animation instead of immediately ending game
                startDeathAnimation();
                break;
            }
        }
    }
}

/**
 * Check if player has reached a new score milestone
 * and award extra life if they have
 */
function checkScoreMilestone() {
    const currentMilestone = Math.floor(score / 1000);
    
    if (currentMilestone > lastScoreMilestone) {
        // Player has reached a new milestone (or possibly multiple)
        const milestonesReached = currentMilestone - lastScoreMilestone;
        
        // Award lives (no maximum cap)
        const newLives = lives + milestonesReached;
        // Only show notification if player actually gains lives
        showExtraLifeNotification(milestonesReached);
        lives = newLives;
        
        // Update milestone tracker
        lastScoreMilestone = currentMilestone;
    }
}

/**
 * Show notification that player has gained extra lives
 * @param {number} numLives - Number of extra lives gained
 */
function showExtraLifeNotification(numLives) {
    // Play extra life sound
    soundManager.playSoundEffect('extraLife');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `+${numLives} LIFE${numLives > 1 ? 'S' : ''}!`;
    
    // Add it to the game container
    document.getElementById('gameContainer').appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Function to initiate death animation
function startDeathAnimation() {
    gameState = GAME_STATE.DYING;
    deathAnimationFrame = 0;
    deathAnimationCounter = 0;
    
    // Play player death sound
    soundManager.playSoundEffect('playerDies');
}

// New function to handle life lost
function handleLifeLost() {
    lives--;
    
    if (lives > 0) {
        showContinueScreen();
    } else {
        showGameOver();
    }
}

// New function to show continue screen
function showContinueScreen() {
    gameState = GAME_STATE.CONTINUE;
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    // Update lives text on continue screen
    const livesRemaining = document.getElementById('livesRemaining');
    livesRemaining.innerHTML = 'Lives: ';
    
    // Determine how many life icons to show in UI
    const maxIconsToShow = 3;
    const displayedLives = Math.min(lives, maxIconsToShow);
    
    // Add life icons based on current lives count
    for (let i = 0; i < displayedLives; i++) {
        const lifeIcon = document.createElement('img');
        lifeIcon.src = 'images/player_lives.png';
        lifeIcon.className = 'lifeIcon';
        livesRemaining.appendChild(lifeIcon);
    }
    
    // If the player has more than the maximum displayable icons, show a count
    if (lives > maxIconsToShow) {
        const countSpan = document.createElement('span');
        countSpan.textContent = ` +${lives - maxIconsToShow}`;
        countSpan.style.marginLeft = '5px';
        countSpan.style.color = '#05DB4A';
            countSpan.className = 'lifeCounter';
        livesRemaining.appendChild(countSpan);
    }
    
    continueScreen.style.display = 'flex';
    
    // Update touch controls visibility
    updateTouchControlsVisibility();
        
    // Start a new canvas rendering specifically for the continue screen
    renderContinueScreenUI();
}

/**
 * Render the UI elements (score and lives) on the continue screen
 */
function renderContinueScreenUI() {
    if (gameState !== GAME_STATE.CONTINUE) return;
    
    // Clear just the top portion of the canvas where the UI will be
    ctx.clearRect(0, 0, canvas.width, 50);
    
    // Draw score and lives
    drawScoreOnCanvas();
    drawLivesOnCanvas();
    
    // Continue rendering UI while on the continue screen
    requestAnimationFrame(renderContinueScreenUI);
}

// New function to continue game after losing a life
function continueGame() {
    // Hide continue screen
    continueScreen.style.display = 'none';
    
    // Reset player position
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    player.direction = PLAYER_DIRECTION.UP;
    
    // Clear all enemies
    enemies.length = 0;
    
    // Update milestone progress
    updateMilestoneProgress();
    
    // Resume game
    gameState = GAME_STATE.PLAYING;
    gameRunning = true;
    
    // Resume background music
    soundManager.resumeMusic();
    
    // Update touch controls visibility
    updateTouchControlsVisibility();
    
    lastTime = performance.now();
    gameLoop();
}

// Function to show game over screen after running out of lives
async function showGameOver() {
    // Check if this is a high score before changing game state
    try {
        isNewHighScore = await isHighScore(score);
        
        if (isNewHighScore) {
            showHighScoreScreen();
            return;
        }
        
        // Not a high score, proceed to game over
        gameState = GAME_STATE.GAME_OVER;
        gameRunning = false;
        cancelAnimationFrame(animationId);
        
        // Pause background music
        soundManager.pauseMusic();
        
        // Show game over screen
        gameOverScreen.style.display = 'flex';
        finalScore.textContent = `Final Score: ${score}`;
        
        // Update touch controls visibility
        updateTouchControlsVisibility();
        
        // Start a new canvas rendering specifically for the game over screen
        renderGameOverScreenUI();
    } catch (error) {
        console.error('Error checking high score:', error);
        
        // Fallback to game over screen on error
        gameState = GAME_STATE.GAME_OVER;
        gameRunning = false;
        cancelAnimationFrame(animationId);
        
        // Pause background music
        soundManager.pauseMusic();
        
        // Show game over screen
        gameOverScreen.style.display = 'flex';
        finalScore.textContent = `Final Score: ${score}`;
        
        // Update touch controls visibility
        updateTouchControlsVisibility();
        
        // Start a new canvas rendering specifically for the game over screen
        renderGameOverScreenUI();
    }
}

/**
 * Render the UI elements (score and lives) on the game over screen
 */
function renderGameOverScreenUI() {
    if (gameState !== GAME_STATE.GAME_OVER) return;
    
    // Clear just the top portion of the canvas where the UI will be
    ctx.clearRect(0, 0, canvas.width, 50);
    
    // Draw score (lives will show as 0)
    drawScoreOnCanvas();
    
    // Continue rendering UI while on the game over screen
    requestAnimationFrame(renderGameOverScreenUI);
}

/**
 * Calculate and apply scaling for the game container based on window size
 * while maintaining aspect ratio and ensuring the game is always fully visible
 * and centered horizontally and vertically
 */
function updateGameScale() {
    const gameContainer = document.getElementById('gameContainer');
    const branding = document.getElementById('branding');
    
    // Get the current window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate available space (accounting for some margin)
    const availableWidth = windowWidth * 0.98;
    const availableHeight = windowHeight * 0.98;
    
    // Original game container dimensions (including the space for branding at bottom)
    const gameWidth = 804; // 800 + 2px border on each side
    const gameHeight = 660; // 600 + 2px border on each side + ~50px for branding
    
    // Calculate scale factors for width and height
    const scaleX = availableWidth / gameWidth;
    const scaleY = availableHeight / gameHeight;
    
    // Use the smaller scale factor to ensure the game fits completely in the window
    // while maintaining aspect ratio
    const scale = Math.min(scaleX, scaleY);
    
    // Apply the scale transform to the game container
    gameContainer.style.transform = `scale(${scale})`;
    
    // Calculate scaled dimensions
    const scaledWidth = gameWidth * scale;
    const scaledHeight = gameHeight * scale;
    
    // Calculate margins to center the container after scaling
    const horizontalMargin = Math.max(0, (windowWidth - scaledWidth) / 2);
    const verticalMargin = Math.max(0, (windowHeight - scaledHeight) / 2);
    
    // Apply centering with absolute positioning
    gameContainer.style.position = 'absolute';
    gameContainer.style.left = `${horizontalMargin}px`;
    gameContainer.style.top = `${verticalMargin}px`;
    gameContainer.style.transformOrigin = 'top left';
    
    // Ensure the leaderboard screen fits properly
    const leaderboardScreen = document.getElementById('leaderboardScreen');
    if (leaderboardScreen) {
        leaderboardScreen.style.width = `${canvas.width}px`;
        leaderboardScreen.style.height = `${canvas.height}px`;
    }
    
    // Handle the touch overlay - make it work with the new implementation
    const touchOverlay = document.getElementById('touchOverlay');
    if (touchOverlay) {
        // Since the overlay is now inside the gameContainer, we don't need to position it separately
        // The transform applied to gameContainer will affect all children including the overlay
        
        // Make sure the overlay covers the entire canvas area
        touchOverlay.style.width = `${canvas.width}px`;
        touchOverlay.style.height = `${canvas.height}px`;
        
        console.log(`Touch overlay dimensions set: ${canvas.width}px x ${canvas.height}px`);
    }
    
    // Update the touch controls visibility based on current state
    updateTouchControlsVisibility();
}

// Initial scaling on page load
document.addEventListener('DOMContentLoaded', () => {
    updateGameScale();
});

/**
 * Update the milestone progress bar based on current score
 * Now just updates the internal state, actual drawing is done in drawMilestoneBarOnCanvas
 */
function updateMilestoneProgress() {
    // This function now just exists for compatibility
    // Actual progress calculation is done in drawMilestoneBarOnCanvas
}

// New function to toggle pause state
function togglePause() {
    if (gameState === GAME_STATE.PLAYING) {
        gameState = GAME_STATE.PAUSED;
        soundManager.pauseMusic(); // Pause background music
    } else if (gameState === GAME_STATE.PAUSED) {
        gameState = GAME_STATE.PLAYING;
        soundManager.resumeMusic(); // Resume background music
    }
    
    // Update touch controls visibility
    updateTouchControlsVisibility();
}

// New function to draw pause overlay
function drawPauseOverlay() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pause text
    ctx.fillStyle = '#05DB4A';
    ctx.font = '36px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 30);
    
    // Instructions text
    ctx.fillStyle = 'white';
    ctx.font = '16px "Press Start 2P", cursive';
    ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 30);
    
    // Mute status text - keep at center position for consistency
    if (soundManager.isMuted) {
        ctx.fillStyle = '#FF6347'; // Tomato color for muted state
        ctx.fillText('Sound: OFF (M)', canvas.width / 2, canvas.height / 2 + 70);
    } else {
        ctx.fillStyle = 'white';
        ctx.fillText('Sound: ON (M)', canvas.width / 2, canvas.height / 2 + 70);
    }
}

// --- Add a new variable for pepe coin animation ---
let pepeCoinAnimationFrame = 0;
let pepeCoinAnimationCounter = 0;
const PEPE_COIN_ANIMATION_SPEED = 15;
const PEPE_COIN_SPAWN_CHANCE = 0.03; // 3% as often as regular coin 

// --- Add variables for doms coin animation ---
let domsCoinAnimationFrame = 0;
let domsCoinAnimationCounter = 0;
const DOMS_COIN_ANIMATION_SPEED = 15;

// --- Add variables for elon coin animation ---
let elonCoinAnimationFrame = 0;
let elonCoinAnimationCounter = 0;
const ELON_COIN_ANIMATION_SPEED = 15;

// --- Add variables for hosico coin animation ---
let hosicoCoinAnimationFrame = 0;
let hosicoCoinAnimationCounter = 0;
const HOSICO_COIN_ANIMATION_SPEED = 15;

// --- Define the total special coin chance and individual chances ---
const SPECIAL_COIN_SPAWN_CHANCE = PEPE_COIN_SPAWN_CHANCE; // Keep the same total probability
const COIN_TYPES = {
    REGULAR: 'regular',
    PEPE: 'pepe',
    DOMS: 'doms',
    ELON: 'elon',
    HOSICO: 'hosico'
};

/**
 * Draw the score directly on the canvas
 */
function drawScoreOnCanvas() {
    ctx.font = '16px "Press Start 2P", cursive';
    ctx.fillStyle = '#05DB4A'; // Match the previous score color
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 30, 10); // Moved from 10 to 30 (20px to the right)
    
    // Draw mute indicator
    if (soundManager.isMuted) {
        ctx.font = '12px "Press Start 2P", cursive';
        ctx.fillStyle = '#FF6347'; // Tomato color for muted state
        ctx.textAlign = 'center'; // Center text horizontally
        ctx.fillText('MUTED (M)', canvas.width / 2, 10); // Position at top center
        ctx.textAlign = 'left'; // Reset text alignment for other elements
    }
}

/**
 * Draw the lives directly on the canvas
 */
function drawLivesOnCanvas() {
    // Start position for lives display
    const startX = canvas.width - 20;
    const startY = 10;
    
    // Draw "Lives:" text
    ctx.font = '16px "Press Start 2P", cursive';
    ctx.fillStyle = '#05DB4A'; // Match the previous lives color
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`Lives:`, startX - 98, startY); // Adjusted to have 2px space
    
    // Determine how many life icons to show
    const maxIconsToShow = 3;
    const displayedLives = Math.min(lives, maxIconsToShow);
    
    // If we have the player lives asset
    if (gameAssets.playerLives) {
        // Heart icons start position - 2px from the text
        const heartsStartX = startX - 96;
        
        // Draw heart icons
        for (let i = 0; i < displayedLives; i++) {
            ctx.drawImage(
                gameAssets.playerLives,
                heartsStartX + (i * 25), // Position each heart with spacing
                startY,
                24, // Width
                24  // Height
            );
        }
        
        // If the player has more than the maximum displayable icons, show a count
        if (lives > maxIconsToShow) {
            ctx.font = '14px "Press Start 2P", cursive';
            ctx.fillStyle = '#05DB4A';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`+${lives - maxIconsToShow}`, heartsStartX + (maxIconsToShow * 25) + 5, startY + 5);
        }
        
        // Calculate fixed milestone bar coordinates
        const livesTextX = startX - 98; // The X position of "Lives:" text 
        // Calculate the position of the right edge of the third heart (rightmost heart position)
        const lastHeartEdgeX = heartsStartX + (maxIconsToShow - 1) * 25 + 24; // Right edge of the 3rd heart
        // Fixed width based on positions of text and rightmost heart position
        const milestoneWidth = lastHeartEdgeX - livesTextX;
        
        // Draw milestone progress bar below the lives display with fixed width
        drawMilestoneBarOnCanvas(livesTextX, startY + 30, milestoneWidth, 5);
    } else {
        // Fallback if image not available
        ctx.fillStyle = '#05DB4A';
        ctx.textAlign = 'right';
        ctx.fillText(`× ${lives}`, startX, startY);
        
        // Draw milestone progress bar below the lives display with fallback width
        drawMilestoneBarOnCanvas(startX - 150, startY + 30, 150, 5);
    }
}

/**
 * Draw the milestone progress bar directly on the canvas
 * @param {number} x - X position of the bar
 * @param {number} y - Y position of the bar
 * @param {number} width - Width of the bar
 * @param {number} height - Height of the bar
 */
function drawMilestoneBarOnCanvas(x, y, width, height) {
    // Draw the background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, width, height);
    
    // Calculate progress
    const nextMilestone = (lastScoreMilestone + 1) * 1000;
    const prevMilestone = lastScoreMilestone * 1000;
    const progress = (score - prevMilestone) / (nextMilestone - prevMilestone);
    
    // Draw the progress
    ctx.fillStyle = '#05DB4A';
    ctx.fillRect(x, y, width * progress, height);
}

/**
 * Update visibility of touch controls based on game state
 */
function updateTouchControlsVisibility() {
    const touchOverlay = document.getElementById('touchOverlay');
    if (!touchOverlay) return;
    
    // Only show touch controls on mobile devices
    if (!isMobileDevice) {
        touchOverlay.style.display = 'none';
        return;
    }
    
    // Show touch controls during gameplay and pause states
    if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) {
        touchOverlay.style.display = 'block';
        touchOverlay.style.opacity = '1';
    } else {
        // Lower opacity during non-gameplay states but keep visible for UI interaction
        touchOverlay.style.display = 'block';
        touchOverlay.style.opacity = '0.5';
    }
    
    console.log(`Touch overlay visibility updated: ${touchOverlay.style.display}, opacity: ${touchOverlay.style.opacity}`);
}

/**
 * Show high score input screen
 */
function showHighScoreScreen() {
    gameState = GAME_STATE.HIGH_SCORE;
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    // Reset any previous input
    playerNameInput.value = '';
    nameInputError.textContent = '';
    highScoreValue.textContent = `Score: ${score}`;
    
    // Show high score screen
    highScoreScreen.style.display = 'flex';
    
    // Focus on the name input field
    setTimeout(() => {
        playerNameInput.focus();
    }, 100);
    
    // Update touch controls visibility
    updateTouchControlsVisibility();
    
    // Start a new canvas rendering specifically for the high score screen
    renderHighScoreScreenUI();
}

/**
 * Render the UI elements on the high score screen
 */
function renderHighScoreScreenUI() {
    if (gameState !== GAME_STATE.HIGH_SCORE) return;
    
    // Clear just the top portion of the canvas where the UI will be
    ctx.clearRect(0, 0, canvas.width, 50);
    
    // Draw score
    drawScoreOnCanvas();
    
    // Continue rendering UI while on the high score screen
    requestAnimationFrame(renderHighScoreScreenUI);
}

/**
 * Submit high score and proceed to leaderboard screen
 */
async function submitHighScore() {
    // Prevent multiple submissions
    if (isSubmittingHighScore) return;
    
    // Set the flag to prevent additional submissions
    isSubmittingHighScore = true;
    
    // Validate name input
    const playerName = playerNameInput.value.trim();
    
    if (!playerName) {
        nameInputError.textContent = 'Please enter your name';
        // Reset the flag since submission failed
        isSubmittingHighScore = false;
        return;
    }
    
    try {
        // Save the high score
        currentPlayerName = playerName;
        await addHighScore(playerName, score);
        
        // Hide high score screen
        highScoreScreen.style.display = 'none';
        
        // Show leaderboard screen instead of game over screen
        showLeaderboard();
        
        // Update touch controls visibility
        updateTouchControlsVisibility();
        
        // Always go back to home screen when pressing back from leaderboard
        window.previousGameState = GAME_STATE.START_SCREEN;
    } catch (error) {
        console.error('Error submitting high score:', error);
        nameInputError.textContent = 'Error submitting score. Please try again.';
        isSubmittingHighScore = false;
    }
}

/**
 * Update the sound button class to reflect current mute state
 */
function updateSoundButtonState() {
  const touchSound = document.getElementById('touchSound');
  if (!touchSound) return;
  
  if (soundManager.isMuted) {
    touchSound.classList.remove('sound-on');
    touchSound.classList.add('sound-off');
  } else {
    touchSound.classList.remove('sound-off');
    touchSound.classList.add('sound-on');
  }
}

// Update the toggleMute function in soundManager to also update the button state
soundManager.toggleMute = function() {
  if (this.isMuted) {
    this.unmute();
  } else {
    this.mute();
  }
  
  // Update the sound button state
  updateSoundButtonState();
}; 

/**
 * Draw a tiled background using the backgroundTile image
 */
function drawTiledBackground() {
    if (!gameAssets.backgroundTile) return;
    
    const tileWidth = gameAssets.backgroundTile.width;
    const tileHeight = gameAssets.backgroundTile.height;
    
    // Calculate how many tiles we need horizontally and vertically
    const tilesX = Math.ceil(canvas.width / tileWidth);
    const tilesY = Math.ceil(canvas.height / tileHeight);
    
    // Draw the tiles in a grid
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            ctx.drawImage(
                gameAssets.backgroundTile,
                x * tileWidth,
                y * tileHeight
            );
        }
    }
}