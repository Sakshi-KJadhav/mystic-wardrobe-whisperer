import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MeasurementForm from '@/components/MeasurementForm';
import StylingSection from '@/components/StylingSection';
import OutfitSection from '@/components/OutfitSection';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Palette, Shirt } from 'lucide-react';
import { calculateBodyShape, BodyShapeResult } from '@/utils/bodyShapeCalculator';
import heroBackground from '@/assets/hero-bg.jpg';

interface MeasurementData {
  bust: string;
  waist: string;
  hips: string;
  shoulders: string;
  torsoLength: string;
  legLength: string;
}

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);
  const [bodyShapeResult, setBodyShapeResult] = useState<BodyShapeResult | null>(null);

  useEffect(() => {
    // Check if measurements exist in localStorage
    const savedMeasurements = localStorage.getItem('mysticMeasurements');
    if (savedMeasurements) {
      const data = JSON.parse(savedMeasurements);
      setMeasurementData(data);
      setBodyShapeResult(calculateBodyShape(data));
    }
  }, []);

  const handleFormSubmit = (data: MeasurementData) => {
    setMeasurementData(data);
    const result = calculateBodyShape(data);
    setBodyShapeResult(result);
    setShowForm(false);
    setCurrentSection('results');
  };

  const handleNavigation = (section: string) => {
    if (section === 'form') {
      setShowForm(true);
      setCurrentSection('form');
    } else if (section === 'styling' && bodyShapeResult) {
      setCurrentSection('styling');
    } else if (section === 'outfits' && bodyShapeResult) {
      setCurrentSection('outfits');
    } else {
      setCurrentSection('home');
      setShowForm(false);
    }
  };

  const renderContent = () => {
    if (showForm) {
      return <MeasurementForm onSubmit={handleFormSubmit} />;
    }

    if (currentSection === 'styling' && bodyShapeResult) {
      return <StylingSection styleData={bodyShapeResult} />;
    }

    if (currentSection === 'outfits' && bodyShapeResult) {
      return <OutfitSection styleData={bodyShapeResult} />;
    }

    if (currentSection === 'results' && bodyShapeResult) {
      return (
        <div className="min-h-screen pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                Your Results Are Ready!
              </h1>
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-primary mb-2">Body Shape</h3>
                  <div className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg text-lg font-medium">
                    {bodyShapeResult.bodyShape}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-primary mb-2">Proportion Type</h3>
                  <div className="bg-accent text-accent-foreground px-6 py-3 rounded-lg text-lg font-medium">
                    {bodyShapeResult.proportionType}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="gradient" 
                  size="xl"
                  onClick={() => setCurrentSection('styling')}
                  className="gap-2"
                >
                  <Palette className="h-5 w-5" />
                  View Styling Tips
                </Button>
                <Button 
                  variant="accent" 
                  size="xl"
                  onClick={() => setCurrentSection('outfits')}
                  className="gap-2"
                >
                  <Shirt className="h-5 w-5" />
                  Browse Outfits
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Home page
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section 
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <Sparkles className="h-16 w-16 text-accent mx-auto mb-6" />
              <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
                Mystic
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
                Discover your perfect style with AI-powered body shape analysis and personalized fashion recommendations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => handleNavigation('form')}
                  className="gap-2"
                >
                  <Users className="h-5 w-5" />
                  Get Your Style Profile
                </Button>
                {bodyShapeResult && (
                  <Button 
                    variant="outline" 
                    size="xl"
                    onClick={() => setCurrentSection('results')}
                    className="gap-2 border-white/30 text-white hover:bg-white/10"
                  >
                    View My Results
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-primary">
                How Mystic Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to unlock your perfect style
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Enter Measurements</h3>
                <p className="text-muted-foreground">
                  Provide your six key body measurements for accurate analysis
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Get Analysis</h3>
                <p className="text-muted-foreground">
                  AI calculates your body shape and proportion type instantly
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Discover Style</h3>
                <p className="text-muted-foreground">
                  Receive personalized styling tips and outfit recommendations
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigation} />
      {renderContent()}
    </div>
  );
};

export default Index;
