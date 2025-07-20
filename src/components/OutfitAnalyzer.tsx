import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  suggestions: string[];
  reasons: string[];
}

const OutfitAnalyzer = ({ styleData }: OutfitAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis - In a real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis based on body shape
      const mockAnalysis = generateMockAnalysis(styleData.bodyShape, styleData.proportionType);
      setAnalysisResult(mockAnalysis);
      
      toast({
        title: "Analysis complete!",
        description: "Your outfit has been analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (bodyShape: string, proportionType: string): AnalysisResult => {
    // Mock analysis logic based on body shape and proportion type
    const analyses = {
      hourglass: {
        suitability: 'excellent' as const,
        score: 92,
        suggestions: [
          'This outfit beautifully accentuates your waist',
          'The fit perfectly complements your balanced proportions',
          'Consider adding a belt to further highlight your natural waistline'
        ],
        reasons: [
          'Emphasizes your natural curves',
          'Balanced silhouette matches your body shape',
          'Proportions are well-suited for your figure'
        ]
      },
      pear: {
        suitability: 'good' as const,
        score: 78,
        suggestions: [
          'Try adding volume to the upper body with structured shoulders',
          'A-line silhouettes work wonderfully for your shape',
          'Consider lighter colors on top to balance your proportions'
        ],
        reasons: [
          'Balances your lower body proportions',
          'Creates visual interest in the upper body',
          'Maintains your natural silhouette'
        ]
      },
      apple: {
        suitability: 'fair' as const,
        score: 65,
        suggestions: [
          'Empire waistlines would be more flattering',
          'Try flowing fabrics that don\'t cling to the midsection',
          'V-necks help elongate your torso'
        ],
        reasons: [
          'Could better accommodate your midsection',
          'Might benefit from different cut styles',
          'Alternative silhouettes could be more flattering'
        ]
      },
      rectangle: {
        suitability: 'good' as const,
        score: 81,
        suggestions: [
          'Add curves with ruching or gathering at the waist',
          'Layering can create more dimension',
          'Peplum styles would add feminine curves'
        ],
        reasons: [
          'Works well with your straight silhouette',
          'Creates visual interest and shape',
          'Complements your athletic build'
        ]
      },
      'inverted triangle': {
        suitability: 'good' as const,
        score: 76,
        suggestions: [
          'Add volume to your lower body for balance',
          'A-line skirts would complement your shoulders',
          'Softer fabrics can balance your strong shoulder line'
        ],
        reasons: [
          'Balances your shoulder width',
          'Creates harmony in your proportions',
          'Maintains your strong upper body presence'
        ]
      }
    };

    return analyses[bodyShape as keyof typeof analyses] || analyses.hourglass;
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
      case 'fair': case 'poor': return <XCircle className="h-5 w-5" />;
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
                        Analyzing...
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
                  <div className="text-3xl font-bold mt-2 text-primary">
                    {analysisResult.score}/100
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Why this works for you:</h4>
                  <ul className="space-y-2">
                    {analysisResult.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
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