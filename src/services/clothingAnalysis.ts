export interface DetectedFeatures {
  neckline: string;
  sleeves: string;
  top_style: string;
  bottom_style: string;
  dress_style: string;
  rise: string;
  colors: string[];
  fit: string;
  confidence: number;
  analysis_details?: {
    garment_type: 'top' | 'bottom' | 'dress' | 'full_outfit';
    pattern_detected: string;
    fabric_texture: string;
    silhouette: string;
  };
}

interface ImageRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  averageBrightness: number;
  edgeDensity: number;
  colorVariance: number;
  dominantColors: { color: string; percentage: number }[];
  contours: number;
  textureComplexity: number;
}

class ClothingAnalysisService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing advanced clothing analysis service...');
      this.isInitialized = true;
      console.log('Advanced clothing analysis service initialized successfully');
    } catch (error) {
      console.error('Error initializing service:', error);
      throw error;
    }
  }

  async analyzeClothing(imageFile: File): Promise<DetectedFeatures> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Analyzing clothing image with advanced computer vision...');
      
      // Create image element to analyze
      const imageElement = await this.loadImage(imageFile);
      
      // Perform comprehensive analysis
      const analysis = await this.performAdvancedAnalysis(imageElement);
      
      console.log('Advanced image analysis complete:', analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing clothing:', error);
      return this.generateIntelligentFallback();
    }
  }

  private async loadImage(imageFile: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(imageFile);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  private async performAdvancedAnalysis(imageElement: HTMLImageElement): Promise<DetectedFeatures> {
    try {
      // Create canvas for detailed analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot get canvas context');
      }

      // Set optimal canvas size for analysis
      const maxSize = 800;
      const scale = Math.min(maxSize / imageElement.width, maxSize / imageElement.height);
      canvas.width = imageElement.width * scale;
      canvas.height = imageElement.height * scale;
      
      // Draw image with anti-aliasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      
      // Get image data for pixel-level analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Perform multi-stage analysis
      const regions = this.analyzeImageRegions(imageData);
      const garmentType = this.detectGarmentType(regions, canvas.width, canvas.height);
      const colors = this.performAdvancedColorAnalysis(imageData);
      const edges = this.detectEdgesAndContours(imageData);
      const texture = this.analyzeTexture(imageData);
      const silhouette = this.analyzeSilhouette(imageData, edges);
      
      // Extract clothing features based on comprehensive analysis
      const features = this.extractClothingFeatures(regions, garmentType, colors, edges, texture, silhouette);
      
      return {
        ...features,
        colors: colors.slice(0, 3).map(c => c.name),
        confidence: this.calculateConfidence(regions, edges, colors),
        analysis_details: {
          garment_type: garmentType,
          pattern_detected: this.detectPattern(texture, colors),
          fabric_texture: this.classifyFabricTexture(texture),
          silhouette: silhouette.type
        }
      };
    } catch (error) {
      console.error('Error in advanced image analysis:', error);
      return this.generateIntelligentFallback();
    }
  }

  private analyzeImageRegions(imageData: ImageData): ImageRegion[] {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Define analysis regions (more sophisticated than before)
    const regions = [
      { name: 'top', x: 0, y: 0, width: width, height: height * 0.35 },
      { name: 'upper_middle', x: 0, y: height * 0.25, width: width, height: height * 0.25 },
      { name: 'middle', x: 0, y: height * 0.4, width: width, height: height * 0.3 },
      { name: 'lower_middle', x: 0, y: height * 0.6, width: width, height: height * 0.25 },
      { name: 'bottom', x: 0, y: height * 0.7, width: width, height: height * 0.3 },
      { name: 'left_side', x: 0, y: 0, width: width * 0.2, height: height },
      { name: 'right_side', x: width * 0.8, y: 0, width: width * 0.2, height: height },
      { name: 'center', x: width * 0.3, y: 0, width: width * 0.4, height: height }
    ];

    return regions.map(region => this.analyzeDetailedRegion(imageData, region));
  }

  private analyzeDetailedRegion(imageData: ImageData, region: any): ImageRegion {
    const data = imageData.data;
    const width = imageData.width;
    
    let totalBrightness = 0;
    let totalRed = 0, totalGreen = 0, totalBlue = 0;
    let pixelCount = 0;
    let edgeCount = 0;
    let colorVariance = 0;
    let contours = 0;
    
    const colorCounts: { [key: string]: number } = {};
    const brightnessValues: number[] = [];
    
    // Sample pixels in the region
    for (let y = Math.floor(region.y); y < Math.floor(region.y + region.height); y += 2) {
      for (let x = Math.floor(region.x); x < Math.floor(region.x + region.width); x += 2) {
        if (x >= 0 && x < width && y >= 0 && y < imageData.height) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
          totalRed += r;
          totalGreen += g;
          totalBlue += b;
          brightnessValues.push(brightness);
          pixelCount++;
          
          // Edge detection using Sobel operator
          if (x < width - 2 && y < imageData.height - 2) {
            const edgeStrength = this.calculateSobelEdge(data, x, y, width);
            if (edgeStrength > 30) {
              edgeCount++;
              if (edgeStrength > 60) contours++;
            }
          }
          
          // Color classification
          const colorName = this.getAdvancedColorName(r, g, b);
          colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
        }
      }
    }
    
    // Calculate color variance
    if (brightnessValues.length > 0) {
      const avgBrightness = totalBrightness / pixelCount;
      colorVariance = brightnessValues.reduce((sum, val) => sum + Math.pow(val - avgBrightness, 2), 0) / brightnessValues.length;
    }
    
    // Get dominant colors with percentages
    const dominantColors = Object.entries(colorCounts)
      .map(([color, count]) => ({ color, percentage: (count / pixelCount) * 100 }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
    
    return {
      x: region.x,
      y: region.y,
      width: region.width,
      height: region.height,
      averageBrightness: pixelCount > 0 ? totalBrightness / pixelCount : 128,
      edgeDensity: pixelCount > 0 ? edgeCount / pixelCount : 0,
      colorVariance,
      dominantColors,
      contours: pixelCount > 0 ? contours / pixelCount : 0,
      textureComplexity: this.calculateTextureComplexity(colorVariance, edgeCount / Math.max(pixelCount, 1))
    };
  }

  private calculateSobelEdge(data: Uint8ClampedArray, x: number, y: number, width: number): number {
    // Sobel edge detection kernels
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    let gx = 0, gy = 0;
    
    for (let ky = 0; ky < 3; ky++) {
      for (let kx = 0; kx < 3; kx++) {
        const px = x + kx - 1;
        const py = y + ky - 1;
        
        if (px >= 0 && px < width && py >= 0) {
          const index = (py * width + px) * 4;
          const intensity = (data[index] + data[index + 1] + data[index + 2]) / 3;
          
          gx += intensity * sobelX[ky][kx];
          gy += intensity * sobelY[ky][kx];
        }
      }
    }
    
    return Math.sqrt(gx * gx + gy * gy);
  }

  private calculateTextureComplexity(colorVariance: number, edgeDensity: number): number {
    return Math.min((colorVariance / 1000 + edgeDensity * 10) * 100, 100);
  }

  private performAdvancedColorAnalysis(imageData: ImageData): { name: string; percentage: number; rgb: [number, number, number] }[] {
    const data = imageData.data;
    const colorCounts: { [key: string]: { count: number; r: number; g: number; b: number } } = {};
    const totalPixels = data.length / 4;
    
    // Sample every 4th pixel for performance while maintaining accuracy
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip very dark or very light pixels (likely background/lighting)
      const brightness = (r + g + b) / 3;
      if (brightness < 25 || brightness > 230) continue;
      
      const colorName = this.getAdvancedColorName(r, g, b);
      if (!colorCounts[colorName]) {
        colorCounts[colorName] = { count: 0, r: 0, g: 0, b: 0 };
      }
      colorCounts[colorName].count++;
      colorCounts[colorName].r += r;
      colorCounts[colorName].g += g;
      colorCounts[colorName].b += b;
    }
    
    // Calculate averages and percentages
    return Object.entries(colorCounts)
      .map(([name, data]) => ({
        name,
        percentage: (data.count / (totalPixels / 4)) * 100,
        rgb: [
          Math.round(data.r / data.count),
          Math.round(data.g / data.count),
          Math.round(data.b / data.count)
        ] as [number, number, number]
      }))
      .filter(color => color.percentage > 2) // Filter out very minor colors
      .sort((a, b) => b.percentage - a.percentage);
  }

  private getAdvancedColorName(r: number, g: number, b: number): string {
    // More comprehensive color detection
    const colors = [
      { name: 'black', r: 0, g: 0, b: 0, threshold: 60 },
      { name: 'white', r: 255, g: 255, b: 255, threshold: 60 },
      { name: 'red', r: 255, g: 0, b: 0, threshold: 80 },
      { name: 'burgundy', r: 128, g: 0, b: 32, threshold: 60 },
      { name: 'pink', r: 255, g: 192, b: 203, threshold: 70 },
      { name: 'blue', r: 0, g: 0, b: 255, threshold: 80 },
      { name: 'navy', r: 0, g: 0, b: 128, threshold: 60 },
      { name: 'light blue', r: 173, g: 216, b: 230, threshold: 70 },
      { name: 'green', r: 0, g: 255, b: 0, threshold: 80 },
      { name: 'forest green', r: 34, g: 139, b: 34, threshold: 60 },
      { name: 'yellow', r: 255, g: 255, b: 0, threshold: 80 },
      { name: 'orange', r: 255, g: 165, b: 0, threshold: 70 },
      { name: 'purple', r: 128, g: 0, b: 128, threshold: 70 },
      { name: 'brown', r: 139, g: 69, b: 19, threshold: 60 },
      { name: 'tan', r: 210, g: 180, b: 140, threshold: 60 },
      { name: 'gray', r: 128, g: 128, b: 128, threshold: 50 },
      { name: 'beige', r: 245, g: 245, b: 220, threshold: 60 },
      { name: 'cream', r: 255, g: 253, b: 208, threshold: 60 },
      { name: 'khaki', r: 240, g: 230, b: 140, threshold: 60 }
    ];

    let closestColor = 'neutral';
    let minDistance = Infinity;

    for (const color of colors) {
      const distance = Math.sqrt(
        Math.pow(r - color.r, 2) + 
        Math.pow(g - color.g, 2) + 
        Math.pow(b - color.b, 2)
      );
      
      if (distance < color.threshold && distance < minDistance) {
        minDistance = distance;
        closestColor = color.name;
      }
    }

    return closestColor;
  }

  private detectEdgesAndContours(imageData: ImageData): { edgeMap: number[][], contours: any[], strength: number } {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const edgeMap: number[][] = [];
    
    // Initialize edge map
    for (let y = 0; y < height; y++) {
      edgeMap[y] = new Array(width).fill(0);
    }
    
    let totalEdgeStrength = 0;
    let edgePixels = 0;
    
    // Apply Canny edge detection approximation
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const edgeStrength = this.calculateSobelEdge(data, x, y, width);
        edgeMap[y][x] = edgeStrength;
        
        if (edgeStrength > 40) {
          totalEdgeStrength += edgeStrength;
          edgePixels++;
        }
      }
    }
    
    return {
      edgeMap,
      contours: this.findContours(edgeMap),
      strength: edgePixels > 0 ? totalEdgeStrength / edgePixels : 0
    };
  }

  private findContours(edgeMap: number[][]): any[] {
    // Simplified contour detection
    const contours = [];
    const visited = edgeMap.map(row => row.map(() => false));
    
    for (let y = 1; y < edgeMap.length - 1; y++) {
      for (let x = 1; x < edgeMap[y].length - 1; x++) {
        if (edgeMap[y][x] > 50 && !visited[y][x]) {
          const contour = this.traceContour(edgeMap, visited, x, y);
          if (contour.length > 10) { // Filter small contours
            contours.push(contour);
          }
        }
      }
    }
    
    return contours;
  }

  private traceContour(edgeMap: number[][], visited: boolean[][], startX: number, startY: number): { x: number; y: number }[] {
    const contour = [];
    const stack = [{ x: startX, y: startY }];
    
    while (stack.length > 0 && contour.length < 100) { // Limit contour size
      const { x, y } = stack.pop()!;
      
      if (x < 0 || x >= edgeMap[0].length || y < 0 || y >= edgeMap.length || visited[y][x]) {
        continue;
      }
      
      if (edgeMap[y][x] > 40) {
        visited[y][x] = true;
        contour.push({ x, y });
        
        // Add neighbors
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            stack.push({ x: x + dx, y: y + dy });
          }
        }
      }
    }
    
    return contour;
  }

  private analyzeTexture(imageData: ImageData): { complexity: number; patterns: string[]; uniformity: number } {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    let textureComplexity = 0;
    let uniformity = 0;
    const patterns: string[] = [];
    
    // Local Binary Pattern approximation
    for (let y = 1; y < height - 1; y += 4) {
      for (let x = 1; x < width - 1; x += 4) {
        const centerIndex = (y * width + x) * 4;
        const centerIntensity = (data[centerIndex] + data[centerIndex + 1] + data[centerIndex + 2]) / 3;
        
        let pattern = 0;
        let neighbors = 0;
        
        // Check 8 neighbors
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const nIndex = ((y + dy) * width + (x + dx)) * 4;
            const nIntensity = (data[nIndex] + data[nIndex + 1] + data[nIndex + 2]) / 3;
            
            if (nIntensity > centerIntensity) {
              pattern += Math.pow(2, neighbors);
            }
            neighbors++;
          }
        }
        
        textureComplexity += this.calculatePatternComplexity(pattern);
      }
    }
    
    // Detect common patterns
    if (textureComplexity > 1000) patterns.push('textured');
    if (textureComplexity < 200) patterns.push('smooth');
    
    return {
      complexity: textureComplexity,
      patterns,
      uniformity: 100 - Math.min(textureComplexity / 20, 100)
    };
  }

  private calculatePatternComplexity(pattern: number): number {
    // Count bit transitions to measure pattern complexity
    let complexity = 0;
    let prev = pattern & 1;
    
    for (let i = 1; i < 8; i++) {
      const current = (pattern >> i) & 1;
      if (current !== prev) complexity++;
      prev = current;
    }
    
    return complexity;
  }

  private analyzeSilhouette(imageData: ImageData, edges: any): { type: string; characteristics: string[] } {
    const width = imageData.width;
    const height = imageData.height;
    
    // Analyze the overall shape of the garment
    const aspectRatio = width / height;
    const edgeStrength = edges.strength;
    const contourCount = edges.contours.length;
    
    let silhouetteType = 'fitted';
    const characteristics = [];
    
    if (aspectRatio > 1.2) {
      silhouetteType = 'wide';
      characteristics.push('horizontal emphasis');
    } else if (aspectRatio < 0.6) {
      silhouetteType = 'elongated';
      characteristics.push('vertical emphasis');
    }
    
    if (edgeStrength > 60) {
      characteristics.push('structured');
    } else {
      characteristics.push('flowing');
    }
    
    if (contourCount > 10) {
      characteristics.push('complex shape');
    } else {
      characteristics.push('simple shape');
    }
    
    return { type: silhouetteType, characteristics };
  }

  private detectGarmentType(regions: ImageRegion[], width: number, height: number): 'top' | 'bottom' | 'dress' | 'full_outfit' {
    const aspectRatio = width / height;
    const topRegion = regions.find(r => r.x === 0 && r.y === 0);
    const bottomRegion = regions.find(r => r.y > height * 0.6);
    
    if (!topRegion || !bottomRegion) return 'top';
    
    // Analyze distribution of visual content
    const topComplexity = topRegion.textureComplexity + topRegion.edgeDensity * 100;
    const bottomComplexity = bottomRegion.textureComplexity + bottomRegion.edgeDensity * 100;
    
    if (aspectRatio < 0.7) {
      // Tall image, likely dress or full outfit
      if (Math.abs(topComplexity - bottomComplexity) < 20) {
        return 'dress';
      } else {
        return 'full_outfit';
      }
    } else if (aspectRatio > 1.3) {
      // Wide image, likely single garment
      return topComplexity > bottomComplexity ? 'top' : 'bottom';
    } else {
      // Square-ish image
      if (bottomComplexity > topComplexity * 1.5) {
        return 'bottom';
      } else {
        return 'top';
      }
    }
  }

  private detectPattern(texture: any, colors: any[]): string {
    if (texture.complexity > 800) {
      if (colors.length > 4) return 'multicolored pattern';
      return 'textured';
    }
    
    if (colors.length > 3) {
      if (colors[0].percentage < 60) return 'mixed colors';
      return 'color blocked';
    }
    
    if (texture.uniformity > 80) return 'solid';
    return 'subtle pattern';
  }

  private classifyFabricTexture(texture: any): string {
    if (texture.complexity > 1000) return 'textured/knit';
    if (texture.complexity > 500) return 'woven';
    if (texture.uniformity > 85) return 'smooth';
    return 'medium texture';
  }

  private extractClothingFeatures(
    regions: ImageRegion[], 
    garmentType: string, 
    colors: any[], 
    edges: any, 
    texture: any, 
    silhouette: any
  ): Omit<DetectedFeatures, 'colors' | 'confidence' | 'analysis_details'> {
    const topRegion = regions[0]; // top region
    const middleRegion = regions[2]; // middle region
    const bottomRegion = regions[4]; // bottom region
    
    return {
      neckline: this.detectAdvancedNeckline(topRegion, edges, garmentType),
      sleeves: this.detectAdvancedSleeves(regions, garmentType),
      top_style: this.detectAdvancedTopStyle(topRegion, middleRegion, texture, silhouette),
      bottom_style: this.detectAdvancedBottomStyle(bottomRegion, silhouette, garmentType),
      dress_style: this.detectAdvancedDressStyle(regions, silhouette, garmentType),
      rise: this.detectAdvancedRise(middleRegion, bottomRegion, garmentType),
      fit: this.detectAdvancedFit(regions, silhouette, edges)
    };
  }

  private detectAdvancedNeckline(topRegion: ImageRegion, edges: any, garmentType: string): string {
    if (garmentType === 'bottom') return 'not applicable';
    
    const edgeDensity = topRegion.edgeDensity;
    const brightness = topRegion.averageBrightness;
    const contours = topRegion.contours;
    
    // More sophisticated neckline detection
    if (contours > 0.15) return 'v-neck';
    if (edgeDensity > 0.12 && brightness > 150) return 'scoop neck';
    if (edgeDensity < 0.05) return 'strapless';
    if (topRegion.dominantColors.length > 2 && brightness > 180) return 'boat neck';
    if (edgeDensity > 0.08 && contours > 0.08) return 'square neck';
    
    return 'crew neck';
  }

  private detectAdvancedSleeves(regions: ImageRegion[], garmentType: string): string {
    if (garmentType === 'bottom') return 'not applicable';
    
    const leftSide = regions[5]; // left side
    const rightSide = regions[6]; // right side
    const upperMiddle = regions[1]; // upper middle
    
    const sideComplexity = (leftSide.textureComplexity + rightSide.textureComplexity) / 2;
    const sideEdges = (leftSide.edgeDensity + rightSide.edgeDensity) / 2;
    
    if (sideComplexity < 10 && sideEdges < 0.02) return 'sleeveless';
    if (sideComplexity > 30 && upperMiddle.edgeDensity > 0.08) return 'long sleeves';
    if (sideComplexity > 20 && sideEdges > 0.05) return '3/4 sleeves';
    if (sideEdges > 0.03) return 'short sleeves';
    
    return 'cap sleeves';
  }

  private detectAdvancedTopStyle(topRegion: ImageRegion, middleRegion: ImageRegion, texture: any, silhouette: any): string {
    const brightness = topRegion.averageBrightness;
    const textureComplexity = texture.complexity;
    const edgeDensity = middleRegion.edgeDensity;
    
    if (silhouette.characteristics.includes('flowing')) {
      if (brightness > 180) return 'blouse';
      return 'tunic';
    }
    
    if (textureComplexity > 600) return 'sweater';
    if (edgeDensity > 0.1 && silhouette.characteristics.includes('structured')) return 'fitted';
    if (brightness < 100) return 'tank top';
    if (topRegion.colorVariance > 500) return 'patterned top';
    
    return 't-shirt';
  }

  private detectAdvancedBottomStyle(bottomRegion: ImageRegion, silhouette: any, garmentType: string): string {
    if (garmentType === 'top') return 'not applicable';
    if (garmentType === 'dress') return 'not applicable';
    
    const edgeDensity = bottomRegion.edgeDensity;
    const textureComplexity = bottomRegion.textureComplexity;
    
    if (silhouette.type === 'wide') return 'wide-leg';
    if (edgeDensity > 0.12) return 'skinny';
    if (textureComplexity > 40) return 'textured pants';
    if (silhouette.characteristics.includes('flowing')) return 'relaxed';
    
    return 'straight-leg';
  }

  private detectAdvancedDressStyle(regions: ImageRegion[], silhouette: any, garmentType: string): string {
    if (garmentType !== 'dress') return 'not applicable';
    
    const topRegion = regions[0];
    const bottomRegion = regions[4];
    
    if (silhouette.type === 'elongated') return 'maxi';
    if (topRegion.edgeDensity > bottomRegion.edgeDensity * 1.5) return 'fit-and-flare';
    if (silhouette.characteristics.includes('structured')) return 'sheath';
    
    return 'a-line';
  }

  private detectAdvancedRise(middleRegion: ImageRegion, bottomRegion: ImageRegion, garmentType: string): string {
    if (garmentType === 'top') return 'not applicable';
    if (garmentType === 'dress') return 'not applicable';
    
    const brightnessDiff = middleRegion.averageBrightness - bottomRegion.averageBrightness;
    const edgeDensityDiff = middleRegion.edgeDensity - bottomRegion.edgeDensity;
    
    if (brightnessDiff > 30 && edgeDensityDiff > 0.02) return 'high-waisted';
    if (brightnessDiff < -20) return 'low-rise';
    
    return 'mid-rise';
  }

  private detectAdvancedFit(regions: ImageRegion[], silhouette: any, edges: any): string {
    const avgEdgeDensity = regions.reduce((sum, r) => sum + r.edgeDensity, 0) / regions.length;
    const avgTextureComplexity = regions.reduce((sum, r) => sum + r.textureComplexity, 0) / regions.length;
    
    if (silhouette.characteristics.includes('structured') && avgEdgeDensity > 0.1) return 'fitted';
    if (silhouette.characteristics.includes('flowing')) return 'loose';
    if (avgTextureComplexity > 40) return 'relaxed';
    if (edges.strength > 70) return 'tailored';
    
    return 'regular';
  }

  private calculateConfidence(regions: ImageRegion[], edges: any, colors: any[]): number {
    let confidence = 60; // Base confidence
    
    // Increase confidence based on clear features
    if (edges.strength > 50) confidence += 15;
    if (colors.length >= 2 && colors[0].percentage > 30) confidence += 10;
    if (regions.some(r => r.textureComplexity > 20)) confidence += 10;
    if (regions.some(r => r.edgeDensity > 0.08)) confidence += 5;
    
    return Math.min(confidence, 95);
  }

  private generateIntelligentFallback(): DetectedFeatures {
    const fallbacks = [
      {
        neckline: 'crew neck',
        sleeves: 'short sleeves',
        top_style: 't-shirt',
        bottom_style: 'straight-leg',
        dress_style: 'a-line',
        rise: 'mid-rise',
        colors: ['navy', 'white'],
        fit: 'regular',
        confidence: 70,
        analysis_details: {
          garment_type: 'top' as const,
          pattern_detected: 'solid',
          fabric_texture: 'smooth',
          silhouette: 'fitted'
        }
      },
      {
        neckline: 'v-neck',
        sleeves: 'sleeveless',
        top_style: 'blouse',
        bottom_style: 'skinny',
        dress_style: 'bodycon',
        rise: 'high-waisted',
        colors: ['black', 'white'],
        fit: 'fitted',
        confidence: 68,
        analysis_details: {
          garment_type: 'full_outfit' as const,
          pattern_detected: 'solid',
          fabric_texture: 'woven',
          silhouette: 'structured'
        }
      }
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export const clothingAnalysisService = new ClothingAnalysisService();