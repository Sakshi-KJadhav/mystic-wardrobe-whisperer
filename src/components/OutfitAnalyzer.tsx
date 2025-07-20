import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { clothingAnalysisService, DetectedFeatures } from '@/services/clothingAnalysis';

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
  matches: { category: string; recommendation: string; match: boolean; reason: string }[];
  suggestions: string[];
}

const OutfitAnalyzer = ({ styleData }: OutfitAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get styling recommendations for the user's body shape
  const getStylingRecommendations = (bodyShape: string) => {
    const recommendations = {
      hourglass: {
        necklines: "V-necks and scoop necks highlight your balanced proportions",
        sleeves: "Fitted sleeves show off your defined waist",
        tops: "Wrap tops and fitted styles accentuate your curves",
        bottoms: "High-waisted styles maintain your silhouette",
        dresses: "Bodycon and wrap dresses are perfect for you",
        'jeans rise': "High-rise and mid-rise jeans maintain your waist definition",
        'color blocking': "Use color blocking to emphasize your natural curves",
        'tuck/untuck': "Tuck in tops to showcase your defined waistline"
      },
      pear: {
        necklines: "Boat necks and off-shoulder styles balance your shoulders",
        sleeves: "Statement sleeves add volume to your upper body",
        tops: "Bright colors and patterns on top draw attention upward",
        bottoms: "Dark, straight-leg pants elongate your silhouette",
        dresses: "A-line and fit-and-flare dresses are flattering",
        'jeans rise': "High-rise jeans help balance your proportions",
        'color blocking': "Use lighter colors on top, darker below for balance",
        'tuck/untuck': "Partial tucks or half-tucks add visual interest to your upper body"
      },
      apple: {
        necklines: "V-necks and deep scoop necks elongate your torso",
        sleeves: "3/4 sleeves and flutter sleeves are flattering",
        tops: "Empire waist and flowy tops create a defined silhouette",
        bottoms: "High-waisted bottoms with structure support your figure",
        dresses: "Empire waist and A-line dresses are perfect",
        'jeans rise': "High-rise jeans create a defined waistline",
        'color blocking': "Use vertical color blocks to elongate your torso",
        'tuck/untuck': "Leave tops untucked or try a loose front tuck for comfort"
      },
      rectangle: {
        necklines: "Sweetheart and square necks create curves",
        sleeves: "Puffy and gathered sleeves add dimension",
        tops: "Peplum and ruffled tops create the illusion of curves",
        bottoms: "Straight-leg and wide-leg pants are ideal",
        dresses: "Sheath and shift dresses complement your frame",
        'jeans rise': "Mid-rise jeans work best for your straight silhouette",
        'color blocking': "Use horizontal color blocks to create curves",
        'tuck/untuck': "Experiment with both - tuck with belts to create waist definition"
      },
      'inverted triangle': {
        necklines: "Scoop necks and cowl necks soften broad shoulders",
        sleeves: "Sleeveless or cap sleeves don't add bulk",
        tops: "Darker colors on top with lighter bottoms balance proportions",
        bottoms: "Wide-leg pants and flared styles add volume below",
        dresses: "A-line and fit-and-flare dresses are flattering",
        'jeans rise': "Low-rise to mid-rise jeans help balance your proportions",
        'color blocking': "Use darker colors on top, brighter below to balance",
        'tuck/untuck': "Leave tops untucked to soften your shoulder line"
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
        description: "Detecting clothing features from your image",
      });

      // Use image analysis
      const detectedFeatures = await clothingAnalysisService.analyzeClothing(selectedImage);
      
      // Compare with styling recommendations
      const analysis = compareWithRecommendations(detectedFeatures, styleData.bodyShape);
      setAnalysisResult(analysis);
      
      toast({
        title: "Analysis complete!",
        description: `Detected ${detectedFeatures.analysis_details?.garment_type || 'clothing'} with ${detectedFeatures.confidence}% confidence`,
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

  const compareWithRecommendations = (detected: DetectedFeatures, bodyShape: string): AnalysisResult => {
    const recommendations = getStylingRecommendations(bodyShape);
    const matches = [];
    let totalScore = 0;
    const maxScore = 100;

    // Check neckline match
    const necklineMatch = checkFeatureMatch(detected.neckline, recommendations.necklines);
    matches.push({
      category: 'Neckline',
      recommendation: recommendations.necklines,
      match: necklineMatch.match,
      reason: necklineMatch.reason
    });
    if (necklineMatch.match) totalScore += 25;

    // Check sleeves match
    const sleevesMatch = checkFeatureMatch(detected.sleeves, recommendations.sleeves);
    matches.push({
      category: 'Sleeves',
      recommendation: recommendations.sleeves,
      match: sleevesMatch.match,
      reason: sleevesMatch.reason
    });
    if (sleevesMatch.match) totalScore += 25;

    // Check top style match
    const topMatch = checkFeatureMatch(detected.top_style, recommendations.tops);
    matches.push({
      category: 'Top Style',
      recommendation: recommendations.tops,
      match: topMatch.match,
      reason: topMatch.reason
    });
    if (topMatch.match) totalScore += 25;

    // Check bottom/rise match
    const bottomMatch = checkFeatureMatch(detected.rise || detected.bottom_style, recommendations['jeans rise']);
    matches.push({
      category: 'Bottom Style',
      recommendation: recommendations['jeans rise'],
      match: bottomMatch.match,
      reason: bottomMatch.reason
    });
    if (bottomMatch.match) totalScore += 25;

    // Factor in AI confidence score
    const confidenceBonus = Math.round(detected.confidence * 0.1); // Up to 10 bonus points
    totalScore = Math.min(totalScore + confidenceBonus, 100);
    
    // Calculate final score and suitability
    const finalScore = Math.round(totalScore);
    let suitability: 'excellent' | 'good' | 'fair' | 'poor';
    
    if (finalScore >= 75) suitability = 'excellent';
    else if (finalScore >= 50) suitability = 'good';
    else if (finalScore >= 25) suitability = 'fair';
    else suitability = 'poor';

    // Generate suggestions based on mismatches
    const suggestions = [];
    matches.forEach(match => {
      if (!match.match) {
        suggestions.push(`Consider ${match.recommendation.toLowerCase()} for your ${bodyShape} body shape`);
      }
    });

    if (suggestions.length === 0) {
      suggestions.push('This outfit perfectly matches your styling recommendations!');
    }

    return {
      suitability,
      score: finalScore,
      detectedFeatures: detected,
      matches,
      suggestions
    };
  };

  const checkFeatureMatch = (detected: string, recommendation: string): { match: boolean; reason: string } => {
    const detectedLower = detected.toLowerCase();
    const recommendationLower = recommendation.toLowerCase();
    
    // Extract key terms from recommendation
    const keyTerms = recommendationLower.match(/(\w+[\-\w]*)\s*(necks?|sleeves?|waist|style|rise|jeans)/g) || [];
    
    // Check if detected feature matches any key terms
    const isMatch = keyTerms.some(term => {
      const cleanTerm = term.replace(/s$/, '').replace(/necks?|sleeves?|waist|style|rise|jeans/g, '').trim();
      return detectedLower.includes(cleanTerm) || cleanTerm.includes(detectedLower);
    });

    return {
      match: isMatch,
      reason: isMatch 
        ? `✓ ${detected} matches your recommended style`
        : `✗ ${detected} doesn't align with recommended ${keyTerms.join(', ') || 'style'}`
    };
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

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Outfit Analyzer
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Upload your outfit photo to get personalized fit analysis
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {styleData.bodyShape}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {styleData.proportionType}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Outfit Photo
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
                          Supports JPG, PNG, WEBP (max 5MB)
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
                        Analyzing with AI...
                      </>
                    ) : (
                      'Analyze Outfit'
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
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Suitability Score */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium ${getSuitabilityColor(analysisResult.suitability)}`}>
                    {analysisResult.suitability.charAt(0).toUpperCase() + analysisResult.suitability.slice(1)} Match
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {analysisResult.score}/100
                      </div>
                      <div className="text-sm text-muted-foreground">
                        AI Confidence: {analysisResult.detectedFeatures.confidence}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detected Features */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Detected Features:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Neckline:</span> {analysisResult.detectedFeatures.neckline}</div>
                    <div><span className="font-medium">Sleeves:</span> {analysisResult.detectedFeatures.sleeves}</div>
                    <div><span className="font-medium">Top Style:</span> {analysisResult.detectedFeatures.top_style}</div>
                    <div><span className="font-medium">Bottom:</span> {analysisResult.detectedFeatures.bottom_style}</div>
                    <div><span className="font-medium">Fit:</span> {analysisResult.detectedFeatures.fit}</div>
                    <div><span className="font-medium">Colors:</span> {analysisResult.detectedFeatures.colors.join(', ')}</div>
                  </div>
                </div>

                {/* Advanced Analysis Details */}
                {analysisResult.detectedFeatures.analysis_details && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Advanced Analysis:</h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Garment Type:</span>
                          <span className="font-medium capitalize">
                            {analysisResult.detectedFeatures.analysis_details.garment_type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pattern:</span>
                          <span className="font-medium capitalize">
                            {analysisResult.detectedFeatures.analysis_details.pattern_detected}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fabric Texture:</span>
                          <span className="font-medium capitalize">
                            {analysisResult.detectedFeatures.analysis_details.fabric_texture}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Silhouette:</span>
                          <span className="font-medium capitalize">
                            {analysisResult.detectedFeatures.analysis_details.silhouette}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature Matches */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Style Analysis:</h4>
                  <div className="space-y-3">
                    {analysisResult.matches.map((match, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 mt-0.5">
                          {match.match ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{match.category}</div>
                          <div className="text-muted-foreground text-xs mt-1">{match.reason}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Styling suggestions:</h4>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
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