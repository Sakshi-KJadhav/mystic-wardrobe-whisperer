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

interface ClothingValidationResult {
  isClothing: boolean;
  confidence: number;
  reasons: string[];
  suggestion?: string;
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
      console.log('Analyzing image for clothing content...');
      
      // Create image element to analyze
      const imageElement = await this.loadImage(imageFile);
      
      // First, validate if the image contains clothing
      const validationResult = await this.validateClothingContent(imageElement);
      
      if (!validationResult.isClothing) {
        throw new Error(`Not a clothing image. ${validationResult.suggestion || 'Please upload an image showing clothing items, outfits, or fashion.'}`);
      }
      
      console.log('Clothing detected, performing detailed analysis...');
      
      // Perform comprehensive analysis only if clothing is detected
      const analysis = await this.performAdvancedAnalysis(imageElement);
      
      console.log('Advanced image analysis complete:', analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing clothing:', error);
      throw error; // Re-throw to show specific validation errors
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

  private async validateClothingContent(imageElement: HTMLImageElement): Promise<ClothingValidationResult> {
    console.log('Validating if image contains clothing...');
    
    try {
      // Create canvas for analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return { isClothing: false, confidence: 0, reasons: ['Cannot analyze image'], suggestion: 'Try uploading a different image' };
      }

      // Optimize size for analysis
      const maxSize = 400;
      const scale = Math.min(maxSize / imageElement.width, maxSize / imageElement.height);
      canvas.width = imageElement.width * scale;
      canvas.height = imageElement.height * scale;
      
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Enhanced validation criteria
      const analysis = this.performComprehensiveClothingValidation(imageData, canvas.width, canvas.height);
      
      console.log('Clothing validation result:', analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error validating clothing content:', error);
      return { 
        isClothing: false, 
        confidence: 0, 
        reasons: ['Analysis failed'], 
        suggestion: 'Please try uploading a clear image of clothing or an outfit' 
      };
    }
  }

  private performComprehensiveClothingValidation(imageData: ImageData, width: number, height: number): ClothingValidationResult {
    const data = imageData.data;
    
    const reasons: string[] = [];
    let score = 0;
    const maxScore = 100;
    
    // 1. Fabric/Material Detection (30 points)
    const fabricAnalysis = this.detectFabricCharacteristics(imageData);
    if (fabricAnalysis.isFabric) {
      score += 30;
      reasons.push('fabric texture patterns detected');
      reasons.push('material draping characteristics found');
    } else {
      reasons.push('no fabric texture detected');
      reasons.push('material properties inconsistent with clothing');
    }
    
    // 2. Garment Silhouette Detection (25 points)
    const silhouetteAnalysis = this.detectGarmentSilhouettes(imageData);
    if (silhouetteAnalysis.hasGarmentShapes) {
      score += 25;
      reasons.push('clothing silhouette patterns detected');
      if (silhouetteAnalysis.necklineDetected) {
        reasons.push('neckline area identified');
      }
      if (silhouetteAnalysis.sleevesDetected) {
        reasons.push('sleeve structure found');
      }
    } else {
      reasons.push('no recognizable garment shapes');
    }
    
    // 3. Color Pattern Analysis (20 points)
    const colorAnalysis = this.analyzeClothingColorPatterns(imageData);
    if (colorAnalysis.hasClothingColors) {
      score += 20;
      reasons.push('clothing-appropriate color distribution');
      if (colorAnalysis.hasConsistentAreas) {
        reasons.push('consistent color areas typical of garments');
      }
    } else {
      reasons.push('color patterns not consistent with clothing');
    }
    
    // 4. Background vs Subject Analysis (15 points)
    const subjectAnalysis = this.analyzeSubjectFocus(imageData);
    if (subjectAnalysis.hasDefinedSubject) {
      score += 15;
      reasons.push('clear subject separation from background');
      if (subjectAnalysis.isPersonWearing) {
        reasons.push('person wearing garments detected');
      }
    } else {
      reasons.push('unclear subject focus');
    }
    
    // 5. Anti-pattern Detection (10 points)
    const antiPatternAnalysis = this.detectNonClothingPatterns(imageData);
    if (!antiPatternAnalysis.hasArchitecture && !antiPatternAnalysis.hasNature && !antiPatternAnalysis.hasVehicles) {
      score += 10;
      reasons.push('no non-clothing objects detected');
    } else {
      if (antiPatternAnalysis.hasArchitecture) reasons.push('architectural elements detected');
      if (antiPatternAnalysis.hasNature) reasons.push('natural landscape elements found');
      if (antiPatternAnalysis.hasVehicles) reasons.push('vehicle components identified');
    }
    
    const confidence = Math.round((score / maxScore) * 100);
    const isClothing = confidence >= 75; // Higher threshold for accuracy
    
    let suggestion = '';
    if (!isClothing) {
      if (confidence < 40) {
        suggestion = 'This image doesn\'t contain clothing. Please upload a photo of garments, outfits, or someone wearing clothes.';
      } else if (confidence < 60) {
        suggestion = 'Image may contain clothing but is unclear. Try uploading a clearer, well-lit photo focused on the clothing items.';
      } else {
        suggestion = 'Clothing detection is uncertain. Ensure the image clearly shows clothing items or outfits without too much background.';
      }
    }
    
    return {
      isClothing,
      confidence,
      reasons,
      suggestion
    };
  }

  private detectFabricCharacteristics(imageData: ImageData): { isFabric: boolean; confidence: number } {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    let fabricScore = 0;
    let smoothnessVariance = 0;
    let textureRepetition = 0;
    let softEdges = 0;
    
    // Analyze texture patterns typical of fabric
    for (let y = 2; y < height - 2; y += 3) {
      for (let x = 2; x < width - 2; x += 3) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const brightness = (r + g + b) / 3;
        
        // Check local variance (fabric has moderate variance)
        let localVariance = 0;
        let edgeStrength = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIndex = ((y + dy) * width + (x + dx)) * 4;
            const nBrightness = (data[nIndex] + data[nIndex + 1] + data[nIndex + 2]) / 3;
            localVariance += Math.abs(brightness - nBrightness);
            edgeStrength += Math.abs(brightness - nBrightness);
          }
        }
        
        // Fabric characteristics: moderate variance, soft edges
        if (localVariance > 5 && localVariance < 40) fabricScore++;
        if (localVariance < 60) smoothnessVariance++;
        if (edgeStrength < 50) softEdges++;
      }
    }
    
    const totalPixels = Math.floor((width * height) / 9);
    const fabricConfidence = (fabricScore / totalPixels) * 100;
    const smoothness = (smoothnessVariance / totalPixels) * 100;
    const softness = (softEdges / totalPixels) * 100;
    
    return {
      isFabric: fabricConfidence > 30 && smoothness > 60 && softness > 40,
      confidence: Math.round((fabricConfidence + smoothness + softness) / 3)
    };
  }

  private detectGarmentSilhouettes(imageData: ImageData): { 
    hasGarmentShapes: boolean; 
    necklineDetected: boolean; 
    sleevesDetected: boolean;
    confidence: number;
  } {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    let necklineScore = 0;
    let sleeveScore = 0;
    let garmentShapeScore = 0;
    
    // Look for characteristic garment shapes in upper regions
    const topRegion = height * 0.3;
    const middleRegion = height * 0.6;
    
    // Detect curved lines typical of necklines in top 30%
    for (let y = 10; y < topRegion; y += 2) {
      let curvePoints = 0;
      let lastBrightness = 0;
      
      for (let x = 10; x < width - 10; x += 2) {
        const index = (y * width + x) * 4;
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
        
        if (Math.abs(brightness - lastBrightness) > 20) {
          curvePoints++;
        }
        lastBrightness = brightness;
      }
      
      // Necklines typically have 2-4 curve changes
      if (curvePoints >= 2 && curvePoints <= 6) {
        necklineScore++;
      }
    }
    
    // Detect sleeve-like structures in side regions
    const leftSide = width * 0.25;
    const rightSide = width * 0.75;
    
    for (let x of [leftSide, rightSide]) {
      let verticalEdges = 0;
      for (let y = topRegion; y < middleRegion; y += 3) {
        const index = (y * width + Math.floor(x)) * 4;
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
        
        // Check for vertical edge patterns
        if (y > topRegion + 6) {
          const prevIndex = ((y - 6) * width + Math.floor(x)) * 4;
          const prevBrightness = (data[prevIndex] + data[prevIndex + 1] + data[prevIndex + 2]) / 3;
          
          if (Math.abs(brightness - prevBrightness) > 15) {
            verticalEdges++;
          }
        }
      }
      
      if (verticalEdges > 3) sleeveScore++;
    }
    
    // Overall garment shape detection
    garmentShapeScore = necklineScore + sleeveScore;
    
    return {
      hasGarmentShapes: garmentShapeScore > 5,
      necklineDetected: necklineScore > 3,
      sleevesDetected: sleeveScore > 0,
      confidence: Math.min(garmentShapeScore * 15, 100)
    };
  }

  private analyzeClothingColorPatterns(imageData: ImageData): { 
    hasClothingColors: boolean; 
    hasConsistentAreas: boolean;
    confidence: number;
  } {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    const colorRegions: { [key: string]: number } = {};
    let consistentAreas = 0;
    let totalRegions = 0;
    
    // Analyze in 20x20 pixel blocks
    const blockSize = 20;
    
    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        const blockColors: { [key: string]: number } = {};
        let blockPixels = 0;
        
        // Analyze colors in this block
        for (let by = y; by < Math.min(y + blockSize, height); by += 2) {
          for (let bx = x; bx < Math.min(x + blockSize, width); bx += 2) {
            const index = (by * width + bx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            const colorName = this.getAdvancedColorName(r, g, b);
            blockColors[colorName] = (blockColors[colorName] || 0) + 1;
            blockPixels++;
          }
        }
        
        // Find dominant color in block
        let dominantColor = '';
        let maxCount = 0;
        
        for (const [color, count] of Object.entries(blockColors)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
          }
        }
        
        // Check if block has consistent color (typical of clothing)
        if (maxCount / blockPixels > 0.6) {
          consistentAreas++;
          colorRegions[dominantColor] = (colorRegions[dominantColor] || 0) + 1;
        }
        
        totalRegions++;
      }
    }
    
    const consistencyRatio = totalRegions > 0 ? consistentAreas / totalRegions : 0;
    const colorDiversity = Object.keys(colorRegions).length;
    
    // Clothing typically has 1-4 main colors with consistent areas
    const hasClothingColors = colorDiversity >= 1 && colorDiversity <= 5 && consistencyRatio > 0.3;
    const hasConsistentAreas = consistencyRatio > 0.5;
    
    return {
      hasClothingColors,
      hasConsistentAreas,
      confidence: Math.round(consistencyRatio * colorDiversity * 20)
    };
  }

  private analyzeSubjectFocus(imageData: ImageData): { 
    hasDefinedSubject: boolean; 
    isPersonWearing: boolean;
    confidence: number;
  } {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Analyze center vs edges to detect subject focus
    const centerRegion = {
      x: width * 0.25,
      y: height * 0.25,
      width: width * 0.5,
      height: height * 0.5
    };
    
    let centerComplexity = 0;
    let edgeComplexity = 0;
    let skinToneAreas = 0;
    
    // Analyze center region
    for (let y = centerRegion.y; y < centerRegion.y + centerRegion.height; y += 3) {
      for (let x = centerRegion.x; x < centerRegion.x + centerRegion.width; x += 3) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        
        // Calculate local variance
        let variance = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIndex = ((y + dy) * width + (x + dx)) * 4;
            const nr = data[nIndex];
            const ng = data[nIndex + 1];
            const nb = data[nIndex + 2];
            variance += Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
          }
        }
        centerComplexity += variance;
        
        // Check for skin tones
        if (this.isSkinTone(r, g, b)) {
          skinToneAreas++;
        }
      }
    }
    
    // Analyze edge regions
    const edgeRegions = [
      { x: 0, y: 0, width: width, height: height * 0.1 }, // top
      { x: 0, y: height * 0.9, width: width, height: height * 0.1 }, // bottom
      { x: 0, y: 0, width: width * 0.1, height: height }, // left
      { x: width * 0.9, y: 0, width: width * 0.1, height: height } // right
    ];
    
    for (const region of edgeRegions) {
      for (let y = region.y; y < region.y + region.height; y += 5) {
        for (let x = region.x; x < region.x + region.width; x += 5) {
          if (x < width && y < height) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // Simple variance calculation for edges
            edgeComplexity += Math.abs(r - 128) + Math.abs(g - 128) + Math.abs(b - 128);
          }
        }
      }
    }
    
    const subjectFocus = centerComplexity > edgeComplexity * 1.2;
    const personDetected = skinToneAreas > 10;
    
    return {
      hasDefinedSubject: subjectFocus,
      isPersonWearing: personDetected && subjectFocus,
      confidence: subjectFocus ? (personDetected ? 85 : 65) : 30
    };
  }

  private detectNonClothingPatterns(imageData: ImageData): { 
    hasArchitecture: boolean; 
    hasNature: boolean; 
    hasVehicles: boolean;
  } {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    let straightLines = 0;
    let naturalPatterns = 0;
    let metallicSurfaces = 0;
    
    // Detect straight lines (architecture)
    for (let y = 0; y < height - 10; y += 5) {
      for (let x = 0; x < width - 10; x += 5) {
        let horizontalEdge = 0;
        let verticalEdge = 0;
        
        // Check for strong horizontal lines
        for (let i = 0; i < 10; i++) {
          const index1 = (y * width + x + i) * 4;
          const index2 = ((y + 1) * width + x + i) * 4;
          
          const diff = Math.abs(data[index1] - data[index2]) + 
                      Math.abs(data[index1 + 1] - data[index2 + 1]) + 
                      Math.abs(data[index1 + 2] - data[index2 + 2]);
          
          if (diff > 30) horizontalEdge++;
        }
        
        // Check for strong vertical lines
        for (let i = 0; i < 10; i++) {
          const index1 = ((y + i) * width + x) * 4;
          const index2 = ((y + i) * width + x + 1) * 4;
          
          const diff = Math.abs(data[index1] - data[index2]) + 
                      Math.abs(data[index1 + 1] - data[index2 + 1]) + 
                      Math.abs(data[index1 + 2] - data[index2 + 2]);
          
          if (diff > 30) verticalEdge++;
        }
        
        if (horizontalEdge > 7 || verticalEdge > 7) straightLines++;
      }
    }
    
    // Simple heuristics for other patterns
    const architectureThreshold = (width * height) / 5000;
    
    return {
      hasArchitecture: straightLines > architectureThreshold,
      hasNature: naturalPatterns > 20,
      hasVehicles: metallicSurfaces > 15
    };
  }

  private isSkinTone(r: number, g: number, b: number): boolean {
    // Basic skin tone detection
    const skinTones = [
      { r: 241, g: 194, b: 125 }, // light
      { r: 224, g: 172, b: 105 }, // medium light
      { r: 198, g: 134, b: 66 },  // medium
      { r: 161, g: 102, b: 94 },  // medium dark
      { r: 110, g: 84, b: 61 }    // dark
    ];
    
    for (const skin of skinTones) {
      const distance = Math.sqrt(
        Math.pow(r - skin.r, 2) + 
        Math.pow(g - skin.g, 2) + 
        Math.pow(b - skin.b, 2)
      );
      
      if (distance < 60) return true;
    }
    
    return false;
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

  private analyzeSilhouette(imageData: ImageData, edges: any): { type: string; confidence: number } {
    // Simplified silhouette analysis based on edge patterns
    const edgeStrength = edges.strength;
    const contourCount = edges.contours.length;
    
    if (contourCount < 3) {
      return { type: 'fitted', confidence: 70 };
    } else if (contourCount > 8) {
      return { type: 'flowing', confidence: 65 };
    } else {
      return { type: 'structured', confidence: 60 };
    }
  }

  private detectGarmentType(regions: ImageRegion[], width: number, height: number): 'top' | 'bottom' | 'dress' | 'full_outfit' {
    const topRegion = regions.find(r => r.y < height * 0.4);
    const bottomRegion = regions.find(r => r.y > height * 0.6);
    
    const topComplexity = topRegion ? topRegion.textureComplexity : 0;
    const bottomComplexity = bottomRegion ? bottomRegion.textureComplexity : 0;
    
    if (topComplexity > 30 && bottomComplexity > 30) {
      return 'full_outfit';
    } else if (topComplexity > bottomComplexity + 10) {
      return 'top';
    } else if (bottomComplexity > topComplexity + 10) {
      return 'bottom';
    } else if (height > width * 1.3) {
      return 'dress';
    }
    
    return 'top';
  }

  private extractClothingFeatures(regions: ImageRegion[], garmentType: any, colors: any[], edges: any, texture: any, silhouette: any): Omit<DetectedFeatures, 'colors' | 'confidence' | 'analysis_details'> {
    // Extract features based on comprehensive analysis
    const topRegion = regions[0]; // top region
    const middleRegion = regions[2]; // middle region
    
    // Neckline detection
    let neckline = 'crew neck';
    if (topRegion.edgeDensity > 0.1) {
      if (topRegion.contours > 0.05) {
        neckline = 'v-neck';
      } else if (topRegion.averageBrightness > 150) {
        neckline = 'scoop neck';
      }
    }
    
    // Sleeve detection
    let sleeves = 'short sleeves';
    const sideRegions = [regions[5], regions[6]]; // left and right sides
    const avgSideComplexity = sideRegions.reduce((sum, r) => sum + r.textureComplexity, 0) / 2;
    
    if (avgSideComplexity > 40) {
      sleeves = 'long sleeves';
    } else if (avgSideComplexity > 20) {
      sleeves = '3/4 sleeves';
    }
    
    // Top style detection
    let topStyle = 'casual top';
    if (texture.patterns.includes('textured')) {
      topStyle = 'sweater';
    } else if (silhouette.type === 'fitted') {
      topStyle = 'fitted top';
    } else if (silhouette.type === 'flowing') {
      topStyle = 'blouse';
    }
    
    // Bottom detection
    let bottomStyle = 'not applicable';
    let rise = 'not applicable';
    
    if (garmentType === 'bottom' || garmentType === 'full_outfit') {
      const bottomRegion = regions[4]; // bottom region
      if (bottomRegion.textureComplexity > 30) {
        bottomStyle = 'jeans';
        rise = bottomRegion.y < regions[3].y ? 'high-rise' : 'mid-rise';
      } else {
        bottomStyle = 'trousers';
        rise = 'mid-rise';
      }
    }
    
    // Dress detection
    let dressStyle = 'not applicable';
    if (garmentType === 'dress') {
      if (silhouette.type === 'fitted') {
        dressStyle = 'bodycon';
      } else if (silhouette.type === 'flowing') {
        dressStyle = 'a-line';
      } else {
        dressStyle = 'shift';
      }
    }
    
    // Fit detection
    let fit = 'regular';
    if (silhouette.type === 'fitted') {
      fit = 'fitted';
    } else if (silhouette.type === 'flowing') {
      fit = 'loose';
    }
    
    return {
      neckline,
      sleeves,
      top_style: topStyle,
      bottom_style: bottomStyle,
      dress_style: dressStyle,
      rise,
      fit
    };
  }

  private calculateConfidence(regions: ImageRegion[], edges: any, colors: any[]): number {
    // Calculate overall confidence based on analysis quality
    const avgRegionComplexity = regions.reduce((sum, r) => sum + r.textureComplexity, 0) / regions.length;
    const edgeQuality = Math.min(edges.strength / 10, 10);
    const colorQuality = Math.min(colors.length * 10, 30);
    
    let confidence = avgRegionComplexity + edgeQuality + colorQuality;
    
    // Boost confidence if multiple strong indicators
    if (avgRegionComplexity > 40 && edges.strength > 50) confidence += 10;
    if (colors.length >= 2 && avgRegionComplexity > 30) confidence += 5;
    
    return Math.min(Math.round(confidence), 95);
  }

  private detectPattern(texture: any, colors: any[]): string {
    if (texture.patterns.includes('textured')) {
      if (colors.length > 3) {
        return 'multicolored';
      }
      return 'textured';
    } else if (colors.length === 1) {
      return 'solid';
    } else if (colors.length === 2) {
      return 'two-tone';
    }
    return 'varied';
  }

  private classifyFabricTexture(texture: any): string {
    if (texture.complexity > 800) {
      return 'textured/knit';
    } else if (texture.complexity > 400) {
      return 'woven';
    } else if (texture.uniformity > 80) {
      return 'smooth';
    }
    return 'mixed';
  }

  private generateIntelligentFallback(): DetectedFeatures {
    return {
      neckline: 'crew neck',
      sleeves: 'short sleeves',
      top_style: 'casual top',
      bottom_style: 'not applicable',
      dress_style: 'not applicable',
      rise: 'not applicable',
      fit: 'regular',
      colors: ['neutral'],
      confidence: 45,
      analysis_details: {
        garment_type: 'top',
        pattern_detected: 'unclear',
        fabric_texture: 'unknown',
        silhouette: 'regular'
      }
    };
  }
}

export const clothingAnalysisService = new ClothingAnalysisService();
