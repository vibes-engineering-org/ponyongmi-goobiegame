'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { DaimoPayTransferButton } from '~/components/daimo-pay-transfer-button';

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 20;
const PLAYER_SPEED = 5;
const COIN_SIZE = 15;
const ENEMY_SPAWN_RATE = 0.02;
const COIN_SPAWN_RATE = 0.03;

// Game states
const GAME_STATE = {
  LOADING: 'loading',
  START_SCREEN: 'start_screen',
  PLAYING: 'playing',
  DYING: 'dying',
  GAME_OVER: 'game_over',
  PAUSED: 'paused'
};

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
    color: '#f44336',
    speedMultiplier: 1,
    probability: 0.4
  },
  [ENEMY_TYPES.BROCCOLI]: {
    width: 35,
    height: 45,
    color: '#388E3C',
    speedMultiplier: 0.8,
    probability: 0.3
  },
  [ENEMY_TYPES.DOGE]: {
    width: 40,
    height: 40,
    color: '#2196F3',
    speedMultiplier: 1.3,
    probability: 0.15
  },
  [ENEMY_TYPES.MIGGLES]: {
    width: 25,
    height: 25,
    color: '#FF9800',
    speedMultiplier: 1.7,
    probability: 0.15
  }
};

interface Player {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

interface Enemy {
  x: number;
  y: number;
  type: string;
  speed: number;
}

interface Coin {
  x: number;
  y: number;
  value: number;
}

interface GameStats {
  score: number;
  lives: number;
  level: number;
}

export default function CoinCollectorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Game state
  const [gameState, setGameState] = useState(GAME_STATE.START_SCREEN);
  const [gameMode, setGameMode] = useState<'free' | 'competitive'>('free');
  const [gameStats, setGameStats] = useState<GameStats>({ score: 0, lives: 1, level: 1 });
  const [leaderboard, setLeaderboard] = useState<number[]>([]);
  const [muted, setMuted] = useState(false);
  
  // Game objects
  const gameObjects = useRef({
    player: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, direction: 'right' as 'up' | 'down' | 'left' | 'right' },
    enemies: [] as Enemy[],
    coins: [] as Coin[],
    keys: {} as Record<string, boolean>
  });
  
  // Animation variables
  const animationState = useRef({
    coinFrame: 0,
    enemyFrame: 0,
    playerFrame: 0,
    deathFrame: 0,
    coinCounter: 0,
    enemyCounter: 0,
    playerCounter: 0,
    deathCounter: 0,
    playerSequence: [0, 1, 2, 1],
    playerIndex: 0
  });

  // Initialize leaderboard from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('coinCollectorLeaderboard');
    if (savedScores) {
      setLeaderboard(JSON.parse(savedScores));
    }
  }, []);

  // Save score to leaderboard
  const saveScore = useCallback((score: number) => {
    const newLeaderboard = [...leaderboard, score]
      .sort((a, b) => b - a)
      .slice(0, 100);
    
    setLeaderboard(newLeaderboard);
    localStorage.setItem('coinCollectorLeaderboard', JSON.stringify(newLeaderboard));
  }, [leaderboard]);

  // Get random enemy type based on probabilities
  const getRandomEnemyType = useCallback(() => {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [type, definition] of Object.entries(enemyDefinitions)) {
      cumulative += definition.probability;
      if (rand <= cumulative) {
        return type;
      }
    }
    return ENEMY_TYPES.BONK;
  }, []);

  // Collision detection
  const checkCollision = useCallback((rect1: any, rect2: any, size1: number, size2: number) => {
    return rect1.x < rect2.x + size2 &&
           rect1.x + size1 > rect2.x &&
           rect1.y < rect2.y + size2 &&
           rect1.y + size1 > rect2.y;
  }, []);

  // Draw game objects
  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { player, enemies, coins } = gameObjects.current;
    const { coinFrame, enemyFrame, playerFrame, deathFrame } = animationState.current;

    // Draw coins
    coins.forEach(coin => {
      ctx.fillStyle = coinFrame === 0 ? '#FFD700' : '#FFA500';
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, COIN_SIZE, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw enemies
    enemies.forEach(enemy => {
      const def = enemyDefinitions[enemy.type as keyof typeof enemyDefinitions];
      ctx.fillStyle = enemyFrame === 0 ? def.color : '#666';
      ctx.fillRect(enemy.x, enemy.y, def.width, def.height);
    });

    // Draw player or death animation
    if (gameState === GAME_STATE.DYING) {
      // Death animation
      const colors = ['#ff0000', '#ff4444', '#ff8888', '#ffaaaa', '#ffcccc', '#ffdddd', '#ffeeee', '#ffffff'];
      ctx.fillStyle = colors[Math.min(deathFrame, colors.length - 1)];
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
    } else {
      // Normal player
      const playerColors = ['#00ff00', '#00cc00', '#009900'];
      ctx.fillStyle = playerColors[playerFrame % playerColors.length];
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
    }

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${gameStats.score}`, 10, 30);
    ctx.fillText(`Lives: ${gameStats.lives}`, 10, 60);
    ctx.fillText(`Level: ${gameStats.level}`, 10, 90);
    
    if (gameMode === 'competitive') {
      ctx.fillText('COMPETITIVE MODE', CANVAS_WIDTH - 200, 30);
    }

    if (gameState === GAME_STATE.PAUSED) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = '40px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign = 'left';
    }
  }, [gameState, gameStats, gameMode]);

  // Update game logic
  const updateGame = useCallback(() => {
    if (gameState !== GAME_STATE.PLAYING) return;

    const { player, enemies, coins, keys } = gameObjects.current;
    const anim = animationState.current;

    // Update animations
    anim.coinCounter++;
    if (anim.coinCounter >= 15) {
      anim.coinFrame = anim.coinFrame === 0 ? 1 : 0;
      anim.coinCounter = 0;
    }

    anim.enemyCounter++;
    if (anim.enemyCounter >= 20) {
      anim.enemyFrame = anim.enemyFrame === 0 ? 1 : 0;
      anim.enemyCounter = 0;
    }

    anim.playerCounter++;
    if (anim.playerCounter >= 10) {
      anim.playerFrame = anim.playerSequence[anim.playerIndex];
      anim.playerIndex = (anim.playerIndex + 1) % anim.playerSequence.length;
      anim.playerCounter = 0;
    }

    // Handle player movement
    if (keys['ArrowUp'] || keys['KeyW']) {
      player.y = Math.max(0, player.y - PLAYER_SPEED);
      player.direction = 'up';
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      player.y = Math.min(CANVAS_HEIGHT - PLAYER_SIZE, player.y + PLAYER_SPEED);
      player.direction = 'down';
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
      player.x = Math.max(0, player.x - PLAYER_SPEED);
      player.direction = 'left';
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      player.x = Math.min(CANVAS_WIDTH - PLAYER_SIZE, player.x + PLAYER_SPEED);
      player.direction = 'right';
    }

    // Spawn enemies
    if (Math.random() < ENEMY_SPAWN_RATE * (1 + gameStats.level * 0.1)) {
      const enemyType = getRandomEnemyType();
      const def = enemyDefinitions[enemyType as keyof typeof enemyDefinitions];
      enemies.push({
        x: Math.random() * (CANVAS_WIDTH - def.width),
        y: -def.height,
        type: enemyType,
        speed: 2 * def.speedMultiplier * (1 + gameStats.level * 0.1)
      });
    }

    // Spawn coins
    if (Math.random() < COIN_SPAWN_RATE) {
      coins.push({
        x: Math.random() * (CANVAS_WIDTH - COIN_SIZE * 2) + COIN_SIZE,
        y: -COIN_SIZE,
        value: Math.random() < 0.1 ? 50 : 10 // 10% chance for special coin
      });
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].y += enemies[i].speed;
      
      // Remove enemies that are off screen
      if (enemies[i].y > CANVAS_HEIGHT) {
        enemies.splice(i, 1);
        continue;
      }

      // Check collision with player
      const def = enemyDefinitions[enemies[i].type as keyof typeof enemyDefinitions];
      if (checkCollision(player, enemies[i], PLAYER_SIZE, Math.max(def.width, def.height))) {
        setGameState(GAME_STATE.DYING);
        animationState.current.deathFrame = 0;
        animationState.current.deathCounter = 0;
        return;
      }
    }

    // Update coins
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].y += 3;
      
      // Remove coins that are off screen
      if (coins[i].y > CANVAS_HEIGHT) {
        coins.splice(i, 1);
        continue;
      }

      // Check collision with player
      if (checkCollision(player, coins[i], PLAYER_SIZE, COIN_SIZE * 2)) {
        const newScore = gameStats.score + coins[i].value;
        setGameStats(prev => ({
          ...prev,
          score: newScore,
          level: Math.floor(newScore / 1000) + 1
        }));
        coins.splice(i, 1);
      }
    }
  }, [gameState, gameStats, checkCollision, getRandomEnemyType]);

  // Update death animation
  const updateDeathAnimation = useCallback(() => {
    if (gameState !== GAME_STATE.DYING) return;

    const anim = animationState.current;
    anim.deathCounter++;
    
    if (anim.deathCounter >= 12) {
      anim.deathFrame++;
      anim.deathCounter = 0;
      
      if (anim.deathFrame >= 8) {
        saveScore(gameStats.score);
        setGameState(GAME_STATE.GAME_OVER);
      }
    }
  }, [gameState, gameStats.score, saveScore]);

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateGame();
    updateDeathAnimation();
    drawGame(ctx);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, updateDeathAnimation, drawGame]);

  // Keyboard event handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    gameObjects.current.keys[e.code] = true;

    if (e.code === 'KeyP') {
      if (gameState === GAME_STATE.PLAYING) {
        setGameState(GAME_STATE.PAUSED);
      } else if (gameState === GAME_STATE.PAUSED) {
        setGameState(GAME_STATE.PLAYING);
      }
    }

    if (e.code === 'KeyM') {
      setMuted(prev => !prev);
    }

    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (gameState === GAME_STATE.START_SCREEN) {
        startGame();
      } else if (gameState === GAME_STATE.GAME_OVER) {
        resetGame();
      }
    }
  }, [gameState]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    gameObjects.current.keys[e.code] = false;
  }, []);

  // Game control functions
  const startGame = useCallback(() => {
    setGameState(GAME_STATE.PLAYING);
    setGameStats({ score: 0, lives: 1, level: 1 });
    gameObjects.current.player = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, direction: 'right' as 'up' | 'down' | 'left' | 'right' };
    gameObjects.current.enemies = [];
    gameObjects.current.coins = [];
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GAME_STATE.START_SCREEN);
    setGameMode('free');
  }, []);

  const startCompetitiveGame = useCallback(() => {
    setGameMode('competitive');
    startGame();
  }, [startGame]);

  // Set up event listeners and game loop
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.DYING) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, gameLoop, gameState]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Coin Collector</h1>
          <p className="text-gray-600 mb-4">
            Collect coins while avoiding enemies. Use arrow keys or WASD to move.
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-400 bg-gray-900"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {gameState === GAME_STATE.START_SCREEN && (
          <div className="text-center space-y-4">
            <div className="space-x-4">
              <Button onClick={startGame} size="lg">
                Play Free Mode
              </Button>
              <DaimoPayTransferButton
                text="Play Competitive (0.001 ETH)"
                toAddress="0x1234567890123456789012345678901234567890"
                amount="0.001"
                onPaymentCompleted={startCompetitiveGame}
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>Controls: Arrow Keys or WASD to move</p>
              <p>P to pause, M to mute, Space/Enter to start</p>
            </div>
          </div>
        )}

        {gameState === GAME_STATE.GAME_OVER && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Game Over!</h2>
            <p className="text-xl">Final Score: {gameStats.score}</p>
            {gameMode === 'competitive' && (
              <p className="text-lg text-yellow-600">Competitive Mode Complete!</p>
            )}
            <Button onClick={resetGame} size="lg">
              Play Again
            </Button>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              {leaderboard.slice(0, 10).map((score, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">
                  #{index + 1}: {score}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Enemy Types: Bonk (red), Broccoli (green), Doge (blue), Miggles (orange)</p>
          <p>Audio: {muted ? 'Muted' : 'Enabled'}</p>
        </div>
      </Card>
    </div>
  );
}