// Image Processing Utility
class ImageProcessor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.processedImages = {};
  }

  loadAndProcess(imagePath, processingFunction, callback) {
    const img = new Image();
    
    img.onload = () => {
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0);
      
      const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
      const pixels = imageData.data;
      
      // Apply the processing function if provided
      if (processingFunction) {
        processingFunction(pixels);
        this.ctx.putImageData(imageData, 0, 0);
      }
      
      // Store the processed image as a data URL
      const processedDataUrl = this.canvas.toDataURL();
      this.processedImages[imagePath] = processedDataUrl;
      
      // Create a new image with the processed data
      const processedImg = new Image();
      processedImg.src = processedDataUrl;
      
      processedImg.onload = () => {
        if (callback) callback(processedImg);
      };
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${imagePath}`);
      if (callback) callback(null);
    };
    
    img.src = imagePath;
    return this;
  }

  // Predefined processing functions
  static invertColors(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = 255 - pixels[i];       // Red
      pixels[i + 1] = 255 - pixels[i + 1]; // Green
      pixels[i + 2] = 255 - pixels[i + 2]; // Blue
      // Alpha channel (pixels[i + 3]) remains unchanged
    }
  }

  static grayscale(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
      const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      pixels[i] = avg;     // Red
      pixels[i + 1] = avg; // Green
      pixels[i + 2] = avg; // Blue
    }
  }

  static brighten(pixels, amount = 50) {
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = Math.min(255, pixels[i] + amount);
      pixels[i + 1] = Math.min(255, pixels[i + 1] + amount);
      pixels[i + 2] = Math.min(255, pixels[i + 2] + amount);
    }
  }

  static tint(pixels, color = {r: 0, g: 0, b: 255}) {
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = Math.min(255, pixels[i] + color.r);
      pixels[i + 1] = Math.min(255, pixels[i + 1] + color.g);
      pixels[i + 2] = Math.min(255, pixels[i + 2] + color.b);
    }
  }
  
  static threshold(pixels, threshold = 128) {
    for (let i = 0; i < pixels.length; i += 4) {
      const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      const value = avg < threshold ? 0 : 255;
      pixels[i] = value;     // Red
      pixels[i + 1] = value; // Green
      pixels[i + 2] = value; // Blue
    }
  }
} 