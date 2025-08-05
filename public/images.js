// Images utility to create game assets programmatically
class ImageGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.images = {};
  }

  createImageDataURL(width, height, drawFunction) {
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Apply drawing function
    drawFunction(this.ctx, width, height);
    
    // Return data URL
    return this.canvas.toDataURL();
  }
  
  generateGameImages() {
    // Create player image frames - UP direction
    this.images.playerUp1 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 8, height/2 - 5, 5, 0, Math.PI * 2);
      ctx.arc(width/2 + 8, height/2 - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 8, height/2 - 5, 2, 0, Math.PI * 2);
      ctx.arc(width/2 + 8, height/2 - 5, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw smile
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 5, 10, 0, Math.PI);
      ctx.stroke();
    });

    // Frame 2 - UP direction
    this.images.playerUp2 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw eyes - slightly different position
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 9, height/2 - 6, 5, 0, Math.PI * 2);
      ctx.arc(width/2 + 9, height/2 - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils - slightly different position
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 9, height/2 - 6, 2, 0, Math.PI * 2);
      ctx.arc(width/2 + 9, height/2 - 6, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw smile - slightly different
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 6, 9, 0.1, Math.PI - 0.1);
      ctx.stroke();
    });

    // Frame 3 - UP direction
    this.images.playerUp3 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#43A047'; // Slightly darker green
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw eyes - slightly different position
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 8, height/2 - 4, 5, 0, Math.PI * 2);
      ctx.arc(width/2 + 8, height/2 - 4, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils - slightly different position
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 8, height/2 - 4, 2.5, 0, Math.PI * 2);
      ctx.arc(width/2 + 8, height/2 - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw bigger smile
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 5, 12, 0, Math.PI);
      ctx.stroke();
    });
    
    // Create player image frames - DOWN direction
    this.images.playerDown1 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw back of head (no eyes visible)
      ctx.fillStyle = '#388E3C'; // Darker green for back of head
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 5, 12, 0, Math.PI, true);
      ctx.fill();
      
      // Draw simple line for back of head
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 5, 12, 0, Math.PI, true);
      ctx.stroke();
    });
    
    // Frame 2 - DOWN direction
    this.images.playerDown2 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw back of head (no eyes visible)
      ctx.fillStyle = '#388E3C'; // Darker green for back of head
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 6, 13, 0, Math.PI, true);
      ctx.fill();
      
      // Draw simple line for back of head
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 6, 13, 0, Math.PI, true);
      ctx.stroke();
    });
    
    // Frame 3 - DOWN direction
    this.images.playerDown3 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#43A047'; // Slightly darker green
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw back of head (no eyes visible)
      ctx.fillStyle = '#2E7D32'; // Darker green for back of head
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 4, 12, 0, Math.PI, true);
      ctx.fill();
      
      // Draw simple line for back of head
      ctx.strokeStyle = '#1B5E20';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 4, 12, 0, Math.PI, true);
      ctx.stroke();
    });
    
    // Create player image frames - LEFT direction
    this.images.playerLeft1 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw left side profile
      // Only draw one eye (left side)
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupil
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 - 5, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw left side of mouth
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 5, height/2 + 5, 5, 0.2, Math.PI * 0.8);
      ctx.stroke();
    });
    
    // Frame 2 - LEFT direction
    this.images.playerLeft2 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw left side profile
      // Only draw one eye (left side) - slightly different position
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 11, height/2 - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupil
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 11, height/2 - 6, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw left side of mouth
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 5, height/2 + 6, 4, 0.2, Math.PI * 0.8);
      ctx.stroke();
    });
    
    // Frame 3 - LEFT direction
    this.images.playerLeft3 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#43A047'; // Slightly darker green
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw left side profile
      // Only draw one eye (left side) - slightly different position
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 9, height/2 - 4, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupil
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 9, height/2 - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw left side of mouth
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 5, height/2 + 5, 6, 0.2, Math.PI * 0.8);
      ctx.stroke();
    });
    
    // Create player image frames - RIGHT direction
    this.images.playerRight1 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw right side profile
      // Only draw one eye (right side)
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 + 10, height/2 - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupil
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 + 10, height/2 - 5, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw right side of mouth
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 + 5, height/2 + 5, 5, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    });
    
    // Frame 2 - RIGHT direction
    this.images.playerRight2 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw right side profile
      // Only draw one eye (right side) - slightly different position
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 + 11, height/2 - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupil
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 + 11, height/2 - 6, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw right side of mouth
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 + 5, height/2 + 6, 4, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    });
    
    // Frame 3 - RIGHT direction
    this.images.playerRight3 = this.createImageDataURL(40, 40, (ctx, width, height) => {
      // Draw green circle
      ctx.fillStyle = '#43A047'; // Slightly darker green
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw right side profile
      // Only draw one eye (right side) - slightly different position
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 + 9, height/2 - 4, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupil
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 + 9, height/2 - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw right side of mouth
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 + 5, height/2 + 5, 6, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    });
    
    // Create coin image
    this.images.coin = this.createImageDataURL(32, 32, (ctx, width, height) => {
      // Draw golden circle
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw dollar sign
      ctx.fillStyle = '#000';
      ctx.font = '10px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', width/2, height/2);
    });
    
    // Create enemy image
    this.images.enemy = this.createImageDataURL(30, 30, (ctx, width, height) => {
      // Draw red circle
      ctx.fillStyle = '#f44336';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw X eyes
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      
      // Left eye
      ctx.beginPath();
      ctx.moveTo(width/2 - 10, height/2 - 5);
      ctx.lineTo(width/2 - 5, height/2);
      ctx.moveTo(width/2 - 10, height/2);
      ctx.lineTo(width/2 - 5, height/2 - 5);
      ctx.stroke();
      
      // Right eye
      ctx.beginPath();
      ctx.moveTo(width/2 + 5, height/2 - 5);
      ctx.lineTo(width/2 + 10, height/2);
      ctx.moveTo(width/2 + 5, height/2);
      ctx.lineTo(width/2 + 10, height/2 - 5);
      ctx.stroke();
      
      // Angry mouth
      ctx.beginPath();
      ctx.moveTo(width/2 - 8, height/2 + 5);
      ctx.lineTo(width/2 + 8, height/2 + 5);
      ctx.stroke();
    });
    
    // Create power-up image
    this.images.powerup = this.createImageDataURL(25, 25, (ctx, width, height) => {
      // Draw star shape
      ctx.fillStyle = '#9C27B0';
      ctx.beginPath();
      
      const spikes = 5;
      const outerRadius = width / 2;
      const innerRadius = height / 4;
      
      let rot = Math.PI / 2 * 3;
      let x = width / 2;
      let y = height / 2;
      let step = Math.PI / spikes;
      
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      
      for (let i = 0; i < spikes; i++) {
        x = width / 2 + Math.cos(rot) * outerRadius;
        y = height / 2 + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        
        x = width / 2 + Math.cos(rot) * innerRadius;
        y = height / 2 + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      
      ctx.lineTo(width / 2, 0);
      ctx.closePath();
      ctx.fill();
      
      // Draw glow effect
      ctx.strokeStyle = '#E1BEE7';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Create player death images
    const deathImages = this.createPlayerDeathImages();
    for (let i = 0; i < deathImages.length; i++) {
      this.images[`playerDeath${i+1}`] = deathImages[i];
    }
    
    return this.images;
  }

  // Create player death animation images
  createPlayerDeathImages() {
    // Frame 1 - Initial shock
    this.images.playerDeath1 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw green circle (character body)
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw shocked eyes (wide open)
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.arc(width/2 + 10, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils (small and centered)
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 - 8, 3, 0, Math.PI * 2);
      ctx.arc(width/2 + 10, height/2 - 8, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw shocked mouth (small o)
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 10, 5, 0, Math.PI * 2);
      ctx.stroke();
    });
    
    // Frame 2 - Start wobbling
    this.images.playerDeath2 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw green circle with slight tilt
      ctx.fillStyle = '#4CAF50';
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(Math.PI / 20);
      ctx.beginPath();
      ctx.arc(0, 0, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Draw shocked eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.arc(width/2 + 8, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils (looking shocked)
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 - 8, 3, 0, Math.PI * 2);
      ctx.arc(width/2 + 8, height/2 - 8, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw mouth (slightly twisted)
      ctx.beginPath();
      ctx.arc(width/2 - 2, height/2 + 10, 6, 0, Math.PI);
      ctx.stroke();
    });
    
    // Frame 3 - Wobbling more
    this.images.playerDeath3 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw green circle with tilt in other direction
      ctx.fillStyle = '#43A047'; // Slightly darker green
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(-Math.PI / 15);
      ctx.beginPath();
      ctx.arc(0, 0, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Draw eyes (getting dizzy)
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 8, height/2 - 7, 7, 0, Math.PI * 2);
      ctx.arc(width/2 + 12, height/2 - 7, 7, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils (swirling)
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 - 7, 3, 0, Math.PI * 2);
      ctx.arc(width/2 + 14, height/2 - 7, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw mouth (grimace)
      ctx.beginPath();
      ctx.moveTo(width/2 - 10, height/2 + 8);
      ctx.quadraticCurveTo(width/2, height/2 + 15, width/2 + 10, height/2 + 8);
      ctx.stroke();
    });
    
    // Frame 4 - Starting to fade
    this.images.playerDeath4 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw green circle getting paler
      ctx.fillStyle = '#66BB6A'; // Lighter green
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(Math.PI / 12);
      ctx.beginPath();
      ctx.arc(0, 0, width/2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Draw crossed eyes
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      
      // Left eye X
      ctx.beginPath();
      ctx.moveTo(width/2 - 15, height/2 - 10);
      ctx.lineTo(width/2 - 5, height/2);
      ctx.moveTo(width/2 - 15, height/2);
      ctx.lineTo(width/2 - 5, height/2 - 10);
      ctx.stroke();
      
      // Right eye X
      ctx.beginPath();
      ctx.moveTo(width/2 + 5, height/2 - 10);
      ctx.lineTo(width/2 + 15, height/2);
      ctx.moveTo(width/2 + 5, height/2);
      ctx.lineTo(width/2 + 15, height/2 - 10);
      ctx.stroke();
      
      // Draw dizzy mouth
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 10, 7, Math.PI + 0.2, Math.PI * 2 - 0.2);
      ctx.stroke();
    });
    
    // Frame 5 - More faded with stars
    this.images.playerDeath5 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw green circle even more faded
      ctx.fillStyle = '#81C784'; // Even lighter green
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw dizzy spiral eyes
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.5;
      
      // Left eye spiral
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 - 5, 6, 0, Math.PI * 4);
      ctx.stroke();
      
      // Right eye spiral
      ctx.beginPath();
      ctx.arc(width/2 + 10, height/2 - 5, 6, 0, Math.PI * 4);
      ctx.stroke();
      
      // Draw stars around head
      this.drawStar(ctx, width/2 - 20, height/2 - 20, 5, 3, 7);
      this.drawStar(ctx, width/2 + 20, height/2 - 15, 5, 3, 7);
      this.drawStar(ctx, width/2, height/2 - 25, 5, 3, 7);
      
      // Draw tongue hanging out
      ctx.fillStyle = '#E57373'; // Light red
      ctx.beginPath();
      ctx.moveTo(width/2 - 5, height/2 + 10);
      ctx.lineTo(width/2 + 5, height/2 + 10);
      ctx.lineTo(width/2, height/2 + 18);
      ctx.fill();
    });
    
    // Frame 6 - Almost gone
    this.images.playerDeath6 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw very faded green circle
      ctx.fillStyle = '#A5D6A7'; // Very light green
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // More stars
      this.drawStar(ctx, width/2 - 25, height/2 - 10, 5, 3, 7);
      this.drawStar(ctx, width/2 + 15, height/2 - 20, 5, 3, 7);
      this.drawStar(ctx, width/2 + 5, height/2 + 20, 5, 3, 7);
      this.drawStar(ctx, width/2 - 15, height/2 + 15, 5, 3, 7);
      
      // Ghost-like eyes
      ctx.fillStyle = 'black';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 - 5, 4, 0, Math.PI * 2);
      ctx.arc(width/2 + 10, height/2 - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
    
    // Frame 7 - Mostly transparent
    this.images.playerDeath7 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw almost transparent circle
      ctx.fillStyle = '#C8E6C9'; // Extremely light green
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // Even more stars
      this.drawStar(ctx, width/2 - 15, height/2 - 15, 5, 2.5, 6);
      this.drawStar(ctx, width/2 + 20, height/2 - 10, 5, 2.5, 6);
      this.drawStar(ctx, width/2, height/2 + 15, 5, 2.5, 6);
      this.drawStar(ctx, width/2 - 10, height/2 + 5, 5, 2.5, 6);
      this.drawStar(ctx, width/2 + 15, height/2 + 5, 5, 2.5, 6);
    });
    
    // Frame 8 - Almost gone/ghost
    this.images.playerDeath8 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw extremely transparent circle
      ctx.fillStyle = '#E8F5E9'; // Almost white green
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      
      // Few final stars
      this.drawStar(ctx, width/2, height/2, 5, 3, 8);
      this.drawStar(ctx, width/2 - 20, height/2, 5, 2, 5);
      this.drawStar(ctx, width/2 + 20, height/2, 5, 2, 5);
    });
    
    return [
      this.images.playerDeath1,
      this.images.playerDeath2,
      this.images.playerDeath3,
      this.images.playerDeath4,
      this.images.playerDeath5,
      this.images.playerDeath6,
      this.images.playerDeath7,
      this.images.playerDeath8
    ];
  }
  
  // Helper function to draw a star
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Create 64x64 enemy images for all types
  generateUpdatedEnemyImages() {
    // Create Bonk enemy images
    this.createBonkEnemyImages();
    
    // Create Broccoli enemy images
    this.createBroccoliEnemyImages();
    
    // Create Doge enemy images
    this.createDogeEnemyImages();
    
    // Create Miggles enemy images
    this.createMigglesEnemyImages();
    
    return this.images;
  }
  
  // Create Bonk enemy images (red with X eyes)
  createBonkEnemyImages() {
    // Frame 1
    this.images.enemyBonk1 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw red circle
      ctx.fillStyle = '#f44336';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw X eyes
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      
      // Left eye
      ctx.beginPath();
      ctx.moveTo(width/2 - 18, height/2 - 10);
      ctx.lineTo(width/2 - 8, height/2);
      ctx.moveTo(width/2 - 18, height/2);
      ctx.lineTo(width/2 - 8, height/2 - 10);
      ctx.stroke();
      
      // Right eye
      ctx.beginPath();
      ctx.moveTo(width/2 + 8, height/2 - 10);
      ctx.lineTo(width/2 + 18, height/2);
      ctx.moveTo(width/2 + 8, height/2);
      ctx.lineTo(width/2 + 18, height/2 - 10);
      ctx.stroke();
      
      // Angry mouth
      ctx.beginPath();
      ctx.moveTo(width/2 - 15, height/2 + 15);
      ctx.lineTo(width/2 + 15, height/2 + 15);
      ctx.stroke();
    });
    
    // Frame 2 (slightly different for animation)
    this.images.enemyBonk2 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw red circle
      ctx.fillStyle = '#d32f2f'; // Slightly darker red
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw X eyes
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      
      // Left eye
      ctx.beginPath();
      ctx.moveTo(width/2 - 20, height/2 - 12);
      ctx.lineTo(width/2 - 10, height/2 - 2);
      ctx.moveTo(width/2 - 20, height/2 - 2);
      ctx.lineTo(width/2 - 10, height/2 - 12);
      ctx.stroke();
      
      // Right eye
      ctx.beginPath();
      ctx.moveTo(width/2 + 10, height/2 - 12);
      ctx.lineTo(width/2 + 20, height/2 - 2);
      ctx.moveTo(width/2 + 10, height/2 - 2);
      ctx.lineTo(width/2 + 20, height/2 - 12);
      ctx.stroke();
      
      // Angry mouth
      ctx.beginPath();
      ctx.moveTo(width/2 - 18, height/2 + 12);
      ctx.lineTo(width/2 + 18, height/2 + 12);
      ctx.stroke();
    });
  }
  
  // Create Broccoli enemy images (green with happy face)
  createBroccoliEnemyImages() {
    // Frame 1
    this.images.enemyBroccoli1 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw green base
      ctx.fillStyle = '#388E3C';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw broccoli texture (small bumps on top)
      ctx.fillStyle = '#2E7D32';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI;
        const x = width/2 + Math.cos(angle) * (width/2 - 10);
        const y = height/2 - 15 + Math.sin(angle) * 10;
        const size = 8 + Math.random() * 6;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 + 5, 8, 0, Math.PI * 2);
      ctx.arc(width/2 + 12, height/2 + 5, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 + 5, 4, 0, Math.PI * 2);
      ctx.arc(width/2 + 12, height/2 + 5, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw mouth
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 18, 10, 0, Math.PI);
      ctx.stroke();
    });
    
    // Frame 2 (slightly different for animation)
    this.images.enemyBroccoli2 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw green base
      ctx.fillStyle = '#2E7D32'; // Slightly darker green
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw broccoli texture (small bumps on top)
      ctx.fillStyle = '#1B5E20';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI + 0.2; // Slightly shifted
        const x = width/2 + Math.cos(angle) * (width/2 - 10);
        const y = height/2 - 15 + Math.sin(angle) * 10;
        const size = 7 + Math.random() * 6;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 + 5, 8, 0, Math.PI * 2);
      ctx.arc(width/2 + 12, height/2 + 5, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 10, height/2 + 5, 4, 0, Math.PI * 2); // Slightly shifted
      ctx.arc(width/2 + 14, height/2 + 5, 4, 0, Math.PI * 2); // Slightly shifted
      ctx.fill();
      
      // Draw mouth
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 18, 12, 0, Math.PI);
      ctx.stroke();
    });
  }
  
  // Create Doge enemy images (blue with sunglasses)
  createDogeEnemyImages() {
    // Frame 1
    this.images.enemyDoge1 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw blue circle
      ctx.fillStyle = '#2196F3';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw hair
      ctx.fillStyle = '#1565C0';
      ctx.beginPath();
      ctx.ellipse(width/2, height/2 - 20, 25, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw sunglasses
      ctx.fillStyle = 'black';
      ctx.fillRect(width/2 - 25, height/2 - 5, 50, 10);
      
      // Draw sunglasses lenses
      ctx.beginPath();
      ctx.ellipse(width/2 - 15, height/2, 10, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(width/2 + 15, height/2, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw smile
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 18, 12, 0.1, Math.PI - 0.1);
      ctx.stroke();
    });
    
    // Frame 2 (slightly different for animation)
    this.images.enemyDoge2 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw blue circle
      ctx.fillStyle = '#1976D2'; // Slightly darker blue
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw hair
      ctx.fillStyle = '#0D47A1';
      ctx.beginPath();
      ctx.ellipse(width/2, height/2 - 22, 27, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw sunglasses
      ctx.fillStyle = 'black';
      ctx.fillRect(width/2 - 25, height/2 - 3, 50, 10);
      
      // Draw sunglasses lenses
      ctx.beginPath();
      ctx.ellipse(width/2 - 15, height/2 + 2, 10, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(width/2 + 15, height/2 + 2, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw smirk
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2 + 2, height/2 + 18, 12, 0.2, Math.PI - 0.2);
      ctx.stroke();
    });
  }
  
  // Create Miggles enemy images (orange with frown)
  createMigglesEnemyImages() {
    // Frame 1
    this.images.enemyMiggles1 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw orange circle
      ctx.fillStyle = '#FF9800';
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw ears
      ctx.beginPath();
      ctx.ellipse(width/2 - 25, height/2 - 20, 10, 15, Math.PI/4, 0, Math.PI * 2);
      ctx.ellipse(width/2 + 25, height/2 - 20, 10, 15, -Math.PI/4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.arc(width/2 + 12, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 - 8, 4, 0, Math.PI * 2);
      ctx.arc(width/2 + 12, height/2 - 8, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw frown
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 15, 15, Math.PI, Math.PI * 2);
      ctx.stroke();
    });
    
    // Frame 2 (slightly different for animation)
    this.images.enemyMiggles2 = this.createImageDataURL(64, 64, (ctx, width, height) => {
      // Draw orange circle
      ctx.fillStyle = '#F57C00'; // Slightly darker orange
      ctx.beginPath();
      ctx.arc(width/2, height/2, width/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw ears
      ctx.beginPath();
      ctx.ellipse(width/2 - 26, height/2 - 22, 11, 14, Math.PI/4, 0, Math.PI * 2);
      ctx.ellipse(width/2 + 26, height/2 - 22, 11, 14, -Math.PI/4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(width/2 - 12, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.arc(width/2 + 12, height/2 - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils (squinted)
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.ellipse(width/2 - 12, height/2 - 8, 4, 2, 0, 0, Math.PI * 2);
      ctx.ellipse(width/2 + 12, height/2 - 8, 4, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw deeper frown
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width/2, height/2 + 18, 12, Math.PI, Math.PI * 2);
      ctx.stroke();
    });
  }
  
  // Download all generated images
  downloadAllEnemyImages() {
    this.generateUpdatedEnemyImages();
    
    // List of enemy images to download
    const imagesToDownload = [
      { name: 'enemy-bonk-1.png', dataUrl: this.images.enemyBonk1 },
      { name: 'enemy-bonk-2.png', dataUrl: this.images.enemyBonk2 },
      { name: 'enemy-broccoli-1.png', dataUrl: this.images.enemyBroccoli1 },
      { name: 'enemy-broccoli-2.png', dataUrl: this.images.enemyBroccoli2 },
      { name: 'enemy-doge-1.png', dataUrl: this.images.enemyDoge1 },
      { name: 'enemy-doge-2.png', dataUrl: this.images.enemyDoge2 },
      { name: 'enemy-miggles-1.png', dataUrl: this.images.enemyMiggles1 },
      { name: 'enemy-miggles-2.png', dataUrl: this.images.enemyMiggles2 }
    ];
    
    // For each image, create a download link
    imagesToDownload.forEach(image => {
      const link = document.createElement('a');
      link.href = image.dataUrl;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
} 