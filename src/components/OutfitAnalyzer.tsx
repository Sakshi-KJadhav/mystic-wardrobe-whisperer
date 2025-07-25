
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { clothingAnalysisService, DetectedFeatures } from '@/services/clothingAnalysis';

type OutfitCategory = 'western' | 'indian' | 'fusion' | 'comfort';

interface StyleData {
  bodyShape: string;
  proportionType: string;
}

interface OutfitAnalyzerProps {
  styleData: StyleData;
}

interface AnalysisResult {
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
  score: number;
  detectedFeatures: DetectedFeatures;
  matches: { category: string; recommendation: string; match: boolean; reason: string; impact: 'high' | 'medium' | 'low' }[];
  suggestions: string[];
  stylistNotes: string[];
}

const OutfitAnalyzer = ({ styleData }: OutfitAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OutfitCategory>('western');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category-specific styling recommendations
  const getCategoryRecommendations = (category: OutfitCategory) => {
    switch (category) {
      case 'indian':
        return {
          garmentTypes: ['saree', 'lehenga', 'kurti', 'salwar', 'anarkali', 'sharara'],
          necklines: ['boat neck', 'v-neck', 'square neck', 'sweetheart', 'high neck'],
          fabrics: ['silk', 'cotton', 'chiffon', 'georgette', 'crepe'],
          styling: {
            draping: 'Focus on draping techniques that complement your body shape',
            accessories: 'Use traditional jewelry to enhance the outfit',
            colors: 'Experiment with rich colors and traditional prints'
          }
        };
      case 'western':
        return {
          garmentTypes: ['dress', 'blouse', 'top', 'shirt', 'pants', 'skirt', 'blazer'],
          necklines: ['v-neck', 'scoop neck', 'crew neck', 'off-shoulder', 'halter'],
          fabrics: ['cotton', 'denim', 'polyester', 'wool', 'linen'],
          styling: {
            layering: 'Use layers to create depth and interest',
            fit: 'Focus on tailored fits that enhance your silhouette',
            colors: 'Mix neutrals with statement pieces'
          }
        };
      case 'fusion':
        return {
          garmentTypes: ['indo-western', 'crop top with skirt', 'palazzo with top', 'dhoti pants'],
          necklines: ['mixed styles', 'contemporary cuts', 'fusion necklines'],
          fabrics: ['mixed textures', 'contemporary fabrics', 'traditional with modern twist'],
          styling: {
            balance: 'Balance traditional and modern elements',
            proportion: 'Mix silhouettes for contemporary look',
            colors: 'Blend traditional and modern color palettes'
          }
        };
      case 'comfort':
        return {
          garmentTypes: ['casual wear', 'loungewear', 'activewear', 'relaxed fit'],
          necklines: ['comfortable cuts', 'relaxed necklines'],
          fabrics: ['cotton', 'jersey', 'modal', 'bamboo', 'breathable fabrics'],
          styling: {
            comfort: 'Prioritize comfort without compromising style',
            fit: 'Choose relaxed but flattering fits',
            versatility: 'Select pieces that work for multiple occasions'
          }
        };
      default:
        return getCategoryRecommendations('western');
    }
  };

  // Professional stylist recommendations by body shape
  const getStylistRecommendations = (bodyShape: string) => {
    const recommendations = {
      hourglass: {
        necklines: {
          ideal: ['v-neck', 'scoop neck', 'sweetheart', 'wrap'],
          avoid: ['high neck', 'turtleneck', 'boat neck'],
          reasoning: "Show off your balanced proportions and defined waist"
        },
        fits: {
          ideal: ['fitted', 'tailored', 'wrap'],
          avoid: ['boxy', 'oversized', 'loose'],
          reasoning: "Emphasize your natural curves without hiding them"
        },
        styling: {
          tucking: "Always tuck in tops to highlight your waist",
          belting: "Use belts to accentuate your narrowest point",
          layering: "Keep layers fitted to maintain your silhouette"
        }
      },
      pear: {
        necklines: {
          ideal: ['boat neck', 'off-shoulder', 'square neck', 'wide scoop'],
          avoid: ['narrow v-neck', 'halter'],
          reasoning: "Draw attention upward to balance your proportions"
        },
        fits: {
          ideal: ['fitted on top', 'a-line bottom', 'straight leg'],
          avoid: ['tight bottom', 'skinny fit below'],
          reasoning: "Balance wider hips with structured shoulders"
        },
        styling: {
          tucking: "Tuck into high-waisted bottoms to elongate your torso",
          belting: "Use belts at your natural waist",
          layering: "Add visual interest on top with patterns or textures"
        }
      },
      apple: {
        necklines: {
          ideal: ['v-neck', 'deep scoop', 'wrap', 'cowl neck'],
          avoid: ['crew neck', 'high neck', 'boat neck'],
          reasoning: "Create vertical lines and draw attention to your décolletage"
        },
        fits: {
          ideal: ['empire waist', 'a-line', 'flowy', 'structured bottom'],
          avoid: ['tight around middle', 'clingy fabrics'],
          reasoning: "Create a defined waist and elongate your torso"
        },
        styling: {
          tucking: "Avoid full tucks; try loose front tucks instead",
          belting: "Belt under the bust or at the narrowest point",
          layering: "Use open cardigans and jackets to create vertical lines"
        }
      },
      rectangle: {
        necklines: {
          ideal: ['sweetheart', 'scoop neck', 'square neck', 'cowl neck'],
          avoid: ['straight across', 'high neck'],
          reasoning: "Create curves and add dimension to your frame"
        },
        fits: {
          ideal: ['peplum', 'wrap', 'ruffled', 'textured'],
          avoid: ['straight', 'boxy', 'shapeless'],
          reasoning: "Add curves and definition to your silhouette"
        },
        styling: {
          tucking: "Tuck with statement belts to create a waist",
          belting: "Use wide belts to define your waist",
          layering: "Add dimension with textures and patterns"
        }
      },
      'inverted triangle': {
        necklines: {
          ideal: ['scoop neck', 'v-neck', 'cowl neck', 'wrap'],
          avoid: ['boat neck', 'off-shoulder', 'wide neck'],
          reasoning: "Soften broad shoulders and create balance"
        },
        fits: {
          ideal: ['fitted on top', 'flared bottom', 'wide leg', 'a-line'],
          avoid: ['shoulder pads', 'tight bottom', 'narrow cuts'],
          reasoning: "Balance broad shoulders with volume below"
        },
        styling: {
          tucking: "Leave tops untucked to soften your shoulder line",
          belting: "Use belts to define your waist",
          layering: "Keep layers simple on top, add interest below"
        }
      }
    };

    return recommendations[bodyShape as keyof typeof recommendations] || recommendations.hourglass;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  };

  const analyzeOutfit = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Analyzing outfit...",
        description: "Getting professional styling insights",
      });

      const detectedFeatures = await clothingAnalysisService.analyzeClothing(selectedImage);
      const analysis = provideStylistAnalysis(detectedFeatures, styleData.bodyShape, selectedCategory);
      setAnalysisResult(analysis);
      
      toast({
        title: "Analysis complete!",
        description: "Here's your professional styling assessment",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Analysis failed",
        description: `Error: ${errorMessage}. Please try again with a clear clothing image.`,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const provideStylistAnalysis = (detected: DetectedFeatures, bodyShape: string, category: OutfitCategory): AnalysisResult => {
    const recommendations = getStylistRecommendations(bodyShape);
    const categoryRecs = getCategoryRecommendations(category);
    const matches = [];
    let totalScore = 0;

    // Neckline Analysis (30% weight)
    const necklineAnalysis = analyzeNeckline(detected.neckline, recommendations.necklines, bodyShape);
    matches.push({
      category: 'Neckline',
      recommendation: necklineAnalysis.recommendation,
      match: necklineAnalysis.isIdeal,
      reason: necklineAnalysis.reason,
      impact: 'high' as const
    });
    totalScore += necklineAnalysis.score * 0.3;

    // Fit Analysis (25% weight)
    const fitAnalysis = analyzeFit(detected.fit, detected.top_style, recommendations.fits, bodyShape);
    matches.push({
      category: 'Fit',
      recommendation: fitAnalysis.recommendation,
      match: fitAnalysis.isIdeal,
      reason: fitAnalysis.reason,
      impact: 'high' as const
    });
    totalScore += fitAnalysis.score * 0.25;

    // Styling Analysis (20% weight)
    const stylingAnalysis = analyzeStyling(detected, recommendations.styling, bodyShape);
    matches.push({
      category: 'Styling',
      recommendation: stylingAnalysis.recommendation,
      match: stylingAnalysis.isIdeal,
      reason: stylingAnalysis.reason,
      impact: 'medium' as const
    });
    totalScore += stylingAnalysis.score * 0.2;

    // Color Analysis (15% weight)
    const colorAnalysis = analyzeColors(detected.colors, bodyShape);
    matches.push({
      category: 'Color Choice',
      recommendation: colorAnalysis.recommendation,
      match: colorAnalysis.isIdeal,
      reason: colorAnalysis.reason,
      impact: 'medium' as const
    });
    totalScore += colorAnalysis.score * 0.15;

    // Category Analysis (15% weight)
    const categoryAnalysis = analyzeCategorySpecific(detected, categoryRecs, category);
    matches.push({
      category: `${category.charAt(0).toUpperCase() + category.slice(1)} Style`,
      recommendation: categoryAnalysis.recommendation,
      match: categoryAnalysis.isIdeal,
      reason: categoryAnalysis.reason,
      impact: 'high' as const
    });
    totalScore += categoryAnalysis.score * 0.15;

    // Proportion Analysis (10% weight)
    const proportionAnalysis = analyzeProportions(detected, bodyShape);
    matches.push({
      category: 'Proportions',
      recommendation: proportionAnalysis.recommendation,
      match: proportionAnalysis.isIdeal,
      reason: proportionAnalysis.reason,
      impact: 'low' as const
    });
    totalScore += proportionAnalysis.score * 0.1;

    const finalScore = Math.min(Math.max(Math.round(totalScore), 0), 100);
    
    let suitability: 'excellent' | 'good' | 'fair' | 'poor';
    if (finalScore >= 80) suitability = 'excellent';
    else if (finalScore >= 65) suitability = 'good';
    else if (finalScore >= 45) suitability = 'fair';
    else suitability = 'poor';

    return {
      suitability,
      score: finalScore,
      detectedFeatures: detected,
      matches,
      suggestions: generateStylistSuggestions(matches, bodyShape, detected, category),
      stylistNotes: generateStylistNotes(matches, bodyShape, detected, category)
    };
  };

  const analyzeNeckline = (neckline: string, necklineRecs: any, bodyShape: string) => {
    const necklineLower = neckline.toLowerCase();
    const isIdeal = necklineRecs.ideal.some((ideal: string) => 
      necklineLower.includes(ideal.toLowerCase()) || ideal.toLowerCase().includes(necklineLower)
    );
    const shouldAvoid = necklineRecs.avoid.some((avoid: string) => 
      necklineLower.includes(avoid.toLowerCase()) || avoid.toLowerCase().includes(necklineLower)
    );

    let score = 50; // neutral
    let reason = '';

    if (isIdeal) {
      score = 90;
      reason = `✓ ${neckline} is perfect for ${bodyShape} - ${necklineRecs.reasoning}`;
    } else if (shouldAvoid) {
      score = 20;
      reason = `✗ ${neckline} may not be the most flattering for ${bodyShape} - ${necklineRecs.reasoning}`;
    } else {
      score = 60;
      reason = `~ ${neckline} works okay for ${bodyShape}, but ${necklineRecs.ideal.join(', ')} would be more flattering`;
    }

    return {
      isIdeal,
      score,
      reason,
      recommendation: `For ${bodyShape}: ${necklineRecs.ideal.join(', ')} work best`
    };
  };

  const analyzeFit = (fit: string, topStyle: string, fitRecs: any, bodyShape: string) => {
    const fitLower = fit.toLowerCase();
    const styleLower = topStyle.toLowerCase();
    
    const isIdealFit = fitRecs.ideal.some((ideal: string) => 
      fitLower.includes(ideal.toLowerCase()) || ideal.toLowerCase().includes(fitLower) ||
      styleLower.includes(ideal.toLowerCase()) || ideal.toLowerCase().includes(styleLower)
    );
    
    const shouldAvoidFit = fitRecs.avoid.some((avoid: string) => 
      fitLower.includes(avoid.toLowerCase()) || avoid.toLowerCase().includes(fitLower) ||
      styleLower.includes(avoid.toLowerCase()) || avoid.toLowerCase().includes(styleLower)
    );

    let score = 50;
    let reason = '';

    if (isIdealFit) {
      score = 85;
      reason = `✓ ${fit} fit is excellent for ${bodyShape} - ${fitRecs.reasoning}`;
    } else if (shouldAvoidFit) {
      score = 25;
      reason = `✗ ${fit} fit may not enhance your ${bodyShape} figure - ${fitRecs.reasoning}`;
    } else {
      score = 55;
      reason = `~ ${fit} fit is okay, but ${fitRecs.ideal.join(', ')} would be more flattering for ${bodyShape}`;
    }

    return {
      isIdeal: isIdealFit,
      score,
      reason,
      recommendation: `For ${bodyShape}: ${fitRecs.ideal.join(', ')} fits work best`
    };
  };

  const analyzeStyling = (detected: DetectedFeatures, stylingRecs: any, bodyShape: string) => {
    let score = 50;
    let reason = '';
    let recommendations = [];

    // Analyze based on garment type and styling advice
    if (detected.analysis_details?.garment_type === 'top' || detected.analysis_details?.garment_type === 'full_outfit') {
      recommendations.push(stylingRecs.tucking);
      recommendations.push(stylingRecs.belting);
      
      // Simple heuristic: if it's a structured top, it's likely styled well
      if (detected.fit === 'fitted' || detected.top_style.includes('structured')) {
        score = 70;
        reason = `✓ Good styling choices for ${bodyShape}`;
      } else {
        score = 45;
        reason = `~ Could be styled better for ${bodyShape}`;
      }
    }

    return {
      isIdeal: score >= 70,
      score,
      reason,
      recommendation: recommendations.join('. ')
    };
  };

  const analyzeColors = (colors: string[], bodyShape: string) => {
    let score = 60; // neutral score for colors
    let reason = '';
    
    // Color analysis based on styling principles
    if (colors.includes('black') || colors.includes('navy')) {
      score = 75;
      reason = `✓ Classic colors like ${colors.join(', ')} are versatile and flattering`;
    } else if (colors.includes('white') || colors.includes('cream')) {
      score = 65;
      reason = `✓ Light colors like ${colors.join(', ')} create a fresh, clean look`;
    } else if (colors.length === 1) {
      score = 70;
      reason = `✓ Monochromatic ${colors[0]} creates a streamlined look`;
    } else {
      score = 55;
      reason = `~ Color combination of ${colors.join(', ')} is interesting`;
    }

    return {
      isIdeal: score >= 70,
      score,
      reason,
      recommendation: `Consider colors that complement your ${bodyShape} silhouette`
    };
  };

  const analyzeProportions = (detected: DetectedFeatures, bodyShape: string) => {
    let score = 60;
    let reason = '';

    // Basic proportion analysis
    if (detected.analysis_details?.silhouette === 'structured' || detected.analysis_details?.silhouette === 'fitted') {
      score = 75;
      reason = `✓ Well-proportioned ${detected.analysis_details.silhouette} silhouette enhances your ${bodyShape} figure`;
    } else {
      score = 50;
      reason = `~ Proportions are okay, but more structure could enhance your ${bodyShape} silhouette`;
    }

    return {
      isIdeal: score >= 70,
      score,
      reason,
      recommendation: `Focus on proportions that complement your ${bodyShape} body shape`
    };
  };

  const analyzeCategorySpecific = (detected: DetectedFeatures, categoryRecs: any, category: OutfitCategory) => {
    let score = 50;
    let reason = '';
    let recommendation = '';

    // Check if the detected garment type matches category expectations
    const detectedType = detected.analysis_details?.garment_type || '';
    const expectedTypes = categoryRecs.garmentTypes;
    
    const topStyle = detected.top_style.toLowerCase();
    const bottomStyle = detected.bottom_style.toLowerCase();
    const dressStyle = detected.dress_style.toLowerCase();

    let categoryMatch = false;

    switch (category) {
      case 'indian':
        categoryMatch = expectedTypes.some((type: string) => 
          topStyle.includes(type) || bottomStyle.includes(type) || dressStyle.includes(type) ||
          detected.neckline.toLowerCase().includes('traditional') ||
          detected.colors.some(color => ['red', 'gold', 'maroon', 'green'].includes(color.toLowerCase()))
        );
        if (categoryMatch) {
          score = 85;
          reason = `✓ This appears to be traditional Indian wear that complements your style`;
        } else {
          score = 40;
          reason = `~ This might be western wear. For Indian category, consider traditional garments like ${expectedTypes.slice(0, 3).join(', ')}`;
        }
        recommendation = `For Indian wear: Try ${expectedTypes.slice(0, 3).join(', ')} in rich fabrics like ${categoryRecs.fabrics.slice(0, 3).join(', ')}`;
        break;

      case 'western':
        categoryMatch = expectedTypes.some((type: string) => 
          topStyle.includes(type) || bottomStyle.includes(type) || dressStyle.includes(type)
        ) || detectedType === 'top' || detectedType === 'full_outfit';
        if (categoryMatch) {
          score = 80;
          reason = `✓ This western outfit style works well for your body shape`;
        } else {
          score = 45;
          reason = `~ Consider classic western pieces for better versatility`;
        }
        recommendation = `For western wear: Focus on ${expectedTypes.slice(0, 4).join(', ')} in structured fits`;
        break;

      case 'fusion':
        // Fusion is more flexible - look for mix of elements
        const hasMixedElements = detected.colors.length > 1 || 
          detected.neckline.includes('contemporary') ||
          topStyle.includes('crop') || bottomStyle.includes('palazzo');
        if (hasMixedElements) {
          score = 75;
          reason = `✓ This fusion style blends traditional and modern elements beautifully`;
        } else {
          score = 50;
          reason = `~ For fusion wear, try mixing traditional silhouettes with modern cuts`;
        }
        recommendation = `For Indo-fusion: ${categoryRecs.styling.balance}`;
        break;

      case 'comfort':
        const isComfortable = detected.fit.includes('relaxed') || detected.fit.includes('loose') ||
          topStyle.includes('casual') || bottomStyle.includes('casual');
        if (isComfortable) {
          score = 85;
          reason = `✓ This comfortable outfit maintains style while prioritizing ease`;
        } else {
          score = 45;
          reason = `~ For comfort wear, choose more relaxed fits in breathable fabrics`;
        }
        recommendation = `For comfort wear: ${categoryRecs.styling.comfort}`;
        break;
    }

    return {
      isIdeal: categoryMatch,
      score,
      reason,
      recommendation
    };
  };

  const generateStylistSuggestions = (matches: any[], bodyShape: string, detected: DetectedFeatures, category: OutfitCategory): string[] => {
    const suggestions = [];
    
    // Generate specific suggestions based on what didn't match
    const poorMatches = matches.filter(m => !m.match);
    
    if (poorMatches.some(m => m.category === 'Neckline')) {
      const recs = getStylistRecommendations(bodyShape);
      suggestions.push(`Try ${recs.necklines.ideal.join(' or ')} necklines to better complement your ${bodyShape} figure`);
    }
    
    if (poorMatches.some(m => m.category === 'Fit')) {
      suggestions.push(`Consider a more fitted silhouette to enhance your natural proportions`);
    }
    
    if (poorMatches.some(m => m.category === 'Styling')) {
      suggestions.push(`Add a belt at your natural waist to define your silhouette`);
    }

    // Add general styling tips
    const bodyShapeAdvice = {
      hourglass: "Highlight your waist with belts and fitted styles",
      pear: "Draw attention upward with statement tops and accessories",
      apple: "Create vertical lines with V-necks and open cardigans",
      rectangle: "Add curves with peplum tops and textured fabrics",
      'inverted triangle': "Balance your silhouette with A-line bottoms"
    };

    suggestions.push(bodyShapeAdvice[bodyShape as keyof typeof bodyShapeAdvice] || "Focus on proportions that flatter your body type");

    return suggestions.length > 0 ? suggestions : ["This outfit works well for your body shape!"];
  };

  const generateStylistNotes = (matches: any[], bodyShape: string, detected: DetectedFeatures, category: OutfitCategory): string[] => {
    const notes = [];
    
    // Professional styling notes
    notes.push(`For ${bodyShape} body shape: Focus on creating balance and highlighting your best features`);
    
    if (detected.analysis_details?.garment_type === 'top') {
      notes.push("Consider how this top would pair with different bottom styles");
    }
    
    if (detected.colors.length > 1) {
      notes.push("Multi-color pieces can be versatile - pair with neutrals for easy styling");
    }
    
    // Add confidence-boosting note
    notes.push("Remember: confidence is your best accessory!");

    return notes;
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return 'bg-emerald-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case 'excellent': case 'good': return <CheckCircle className="h-5 w-5" />;
      case 'fair': return <AlertTriangle className="h-5 w-5" />;
      case 'poor': return <XCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Professional Styling Analysis
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Get expert fashion advice tailored to your body shape
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {styleData.bodyShape}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {styleData.proportionType}
            </Badge>
          </div>

          {/* Outfit Category Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Select Outfit Category</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {(['western', 'indian', 'fusion', 'comfort'] as OutfitCategory[]).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'fusion' ? 'Indo-Fusion' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Outfit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Outfit preview" 
                        className="max-h-64 mx-auto rounded-lg object-cover"
                      />
                      <p className="text-sm text-muted-foreground">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <div>
                        <p className="text-lg font-medium">Upload an outfit photo</p>
                        <p className="text-sm text-muted-foreground">
                          Get professional styling advice
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {selectedImage && (
                  <Button 
                    onClick={analyzeOutfit} 
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Getting Professional Analysis...
                      </>
                    ) : (
                      'Get Styling Analysis'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSuitabilityIcon(analysisResult.suitability)}
                  Professional Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Suitability Score */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium ${getSuitabilityColor(analysisResult.suitability)}`}>
                    {analysisResult.suitability.charAt(0).toUpperCase() + analysisResult.suitability.slice(1)} Choice
                  </div>
                  <div className="text-3xl font-bold text-primary mt-2 mb-1">
                    {analysisResult.score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Professional Styling Score
                  </div>
                </div>

                {/* Style Analysis */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Style Analysis:</h4>
                  <div className="space-y-3">
                    {analysisResult.matches.map((match, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 mt-0.5">
                          {match.match ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{match.category}</span>
                            <span className={`text-xs px-2 py-1 rounded ${getImpactColor(match.impact)}`}>
                              {match.impact} impact
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">{match.reason}</div>
                          <div className="text-xs text-muted-foreground/80">{match.recommendation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Suggestions */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Professional Recommendations:</h4>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stylist Notes */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Stylist Notes:</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {analysisResult.stylistNotes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                          <span className="italic">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitAnalyzer;
