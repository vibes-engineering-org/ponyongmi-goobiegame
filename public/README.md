# Goobie Man Game

A simple HTML5 canvas game where you control a character to collect coins while avoiding enemies.

## Game Controls

- **Arrow keys or WASD**: Move the player
- **P**: Pause the game
- **M**: Toggle mute
- **Space/Enter**: Start game, continue after losing a life, or restart after game over

## Features

- Multiple enemy types with different speeds and behaviors
- Special coin types with different point values
- Lives system with extra lives earned every 1000 points
- Death animation when colliding with enemies
- Pause functionality
- Local leaderboard system with top 100 scores
- Retro-style pixel art and fonts

## How to Play

1. Open `index.html` in your browser
2. Wait for the game assets to load
3. Click the "Start Game" button
4. Use the arrow keys to move your character:
   - ↑ (up arrow): Move up
   - ↓ (down arrow): Move down
   - ← (left arrow): Move left
   - → (right arrow): Move right
5. Collect animated golden coins to earn points
6. Avoid animated enemies - watch out for four different types:
   - Bonk (red): Normal speed and size
   - Broccoli (green): Larger and slower
   - Doge (blue): Medium size but faster
   - Miggles (orange): Small and very fast
7. If you hit an enemy, a death animation will play before showing the game over screen
8. The game gets progressively harder as you play longer

## Game Features

- Simple and intuitive controls
- Progressively increasing difficulty
- Score tracking
- Player character with directional animations
- Death animation sequence when the player collides with an enemy
- Game over screen with final score
- Restart option
- External image support for game sprites
- Asset preloading system with loading screen
- Animated coins and enemies using sprite alternation
- Multiple enemy types with unique characteristics
- Balanced enemy spawning probabilities

## Technical Details

This game is built using pure HTML5, CSS, and JavaScript with no external libraries. It demonstrates:

- Canvas rendering
- Game loop using requestAnimationFrame
- Collision detection
- Game state management
- Input handling
- Delta-time based animation
- Image asset loading and management
- Fallback rendering when images aren't available
- Basic sprite animation techniques
- Independent animation timers for different game elements
- Object-oriented enemy type definitions
- Weighted random selection for balanced gameplay
- Multi-frame animation sequences (1,2,3,2 pattern and 8-frame death animation)
- State-based game flow with playing, dying, and game over states

## Custom Game Assets

The game supports both programmatically generated images and external PNG files:

- The coins use two alternating PNG images (`images/golden_coins_v1.8.png` and `images/golden_coins_v2.8.png`) for animation
- The enemies use multiple image sets:
  - Bonk enemies: `images/enemy-bonk-1.png` and `images/enemy-bonk-2.png`
  - Broccoli enemies: `images/enemy-broccoli-1.png` and `images/enemy-broccoli-2.png`
  - Doge enemies: `images/enemy-doge-1.png` and `images/enemy-doge-2.png`
  - Miggles enemies: `images/enemy-miggles-1.png` and `images/enemy-miggles-2.png`
- The player uses directional sprite sets for up, down, left, and right movements
- The player death animation consists of 8 frames (`images/player_death_1.png` through `images/player_death_8.png`)
- Other game elements use programmatically generated graphics with the `ImageGenerator` class
- The `ImageProcessor` class provides utilities for image manipulation

## Enemy Types

The game features four enemy types with unique characteristics:

```javascript
// Enemy types
const ENEMY_TYPES = {
    BONK: 'bonk',
    BROCCOLI: 'broccoli',
    DOGE: 'doge',
    MIGGLES: 'miggles'
};

// Enemy definitions
const enemyDefinitions = {
    [ENEMY_TYPES.BONK]: {
        width: 30,
        height: 30,
        color: '#f44336', // Red color
        speedMultiplier: 1,
        image1Key: 'enemy1',
        image2Key: 'enemy2'
    },
    [ENEMY_TYPES.BROCCOLI]: {
        width: 35,
        height: 45, // Taller than bonk enemy
        color: '#388E3C', // Green color
        speedMultiplier: 0.8, // Slower than bonk enemy
        image1Key: 'enemyBroccoli1',
        image2Key: 'enemyBroccoli2'
    },
    [ENEMY_TYPES.DOGE]: {
        width: 40,
        height: 40,
        color: '#2196F3', // Blue color
        speedMultiplier: 1.3, // Faster than standard enemies
        image1Key: 'enemyDoge1',
        image2Key: 'enemyDoge2'
    },
    [ENEMY_TYPES.MIGGLES]: {
        width: 25,
        height: 25, // Smaller than other enemies
        color: '#FF9800', // Orange color
        speedMultiplier: 1.7, // Very fast
        image1Key: 'enemyMiggles1',
        image2Key: 'enemyMiggles2'
    }
};
```

Enemy types are spawned with weighted probabilities:
- Bonk: 40% chance (common, normal difficulty)
- Broccoli: 30% chance (common, easier to avoid)
- Doge: 15% chance (uncommon, harder to avoid)
- Miggles: 15% chance (uncommon, hardest to avoid)

New enemy types can be easily added by extending this object-oriented approach.

## Animation System

The game implements multiple animation systems for different game elements:

### Coin and Enemy Animation
```javascript
// Animation variables
let coinAnimationFrame = 0;
let enemyAnimationFrame = 0;
let coinAnimationCounter = 0;
let enemyAnimationCounter = 0;
const COIN_ANIMATION_SPEED = 15; // Lower is faster
const ENEMY_ANIMATION_SPEED = 20; // Different speed for variety

// In the game loop
// Coin animation
coinAnimationCounter++;
if (coinAnimationCounter >= COIN_ANIMATION_SPEED) {
    coinAnimationFrame = coinAnimationFrame === 0 ? 1 : 0;
    coinAnimationCounter = 0;
}

// Enemy animation (separate from coin animation)
enemyAnimationCounter++;
if (enemyAnimationCounter >= ENEMY_ANIMATION_SPEED) {
    enemyAnimationFrame = enemyAnimationFrame === 0 ? 1 : 0;
    enemyAnimationCounter = 0;
}
```

### Player Animation
```javascript
// Animation variables for player
let playerAnimationFrame = 0;
let playerAnimationSequence = [0, 1, 2, 1]; // The 1,2,3,2 sequence (0-indexed)
let playerAnimationIndex = 0;
let playerAnimationCounter = 0;
const PLAYER_ANIMATION_SPEED = 10;

// In the game loop
playerAnimationCounter++;
if (playerAnimationCounter >= PLAYER_ANIMATION_SPEED) {
    playerAnimationFrame = playerAnimationSequence[playerAnimationIndex];
    playerAnimationIndex = (playerAnimationIndex + 1) % playerAnimationSequence.length;
    playerAnimationCounter = 0;
}
```

### Death Animation
```javascript
// Death animation variables
let deathAnimationFrame = 0;
let deathAnimationCounter = 0;
const DEATH_ANIMATION_SPEED = 12;
const DEATH_ANIMATION_FRAMES = 8;

// In the game loop when in dying state
deathAnimationCounter++;
if (deathAnimationCounter >= DEATH_ANIMATION_SPEED) {
    deathAnimationFrame++;
    deathAnimationCounter = 0;
    
    // If we've completed all frames, move to game over
    if (deathAnimationFrame >= DEATH_ANIMATION_FRAMES) {
        showGameOver();
    }
}
```

## Game States

The game uses a state machine to control different phases:

```javascript
const GAME_STATE = {
    LOADING: 'loading',
    START_SCREEN: 'start_screen',
    PLAYING: 'playing',
    DYING: 'dying',
    GAME_OVER: 'game_over'
};
```

This approach allows for clear separation of concerns and makes it easy to add new states or transitions.

## Development

Feel free to modify and extend this game. Some ideas for enhancements:

- Add different types of collectibles with various point values
- Implement power-ups (e.g., temporary invincibility, increased speed)
- Add sound effects and background music
- Implement different enemy movement patterns
- Add multiple levels with increasing difficulty
- Store and display high scores
- Add touch controls for mobile devices
- Create more custom sprite images for game elements
- Add more complex animations for special events

## Adding Your Own Images

To add your own game sprites:

1. Add PNG files to the `images` folder
2. Update the `assetsToLoad` array in `game.js` with your image information:
   ```javascript
   const assetsToLoad = [
     { name: 'player', src: 'images/player.png' },
     { name: 'coin1', src: 'images/coin1.png' },
     { name: 'coin2', src: 'images/coin2.png' },
     { name: 'enemy1', src: 'images/enemy1.png' },
     { name: 'enemy2', src: 'images/enemy2.png' },
     // Add more images here
   ];
   ```
3. The game will automatically load and use them

## License

Free to use and modify for any purpose. 