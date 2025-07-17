import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler } from 'lucide-react';

interface MeasurementData {
  bust: string;
  waist: string;
  hips: string;
  shoulders: string;
  torsoLength: string;
  legLength: string;
}

interface MeasurementFormProps {
  onSubmit: (data: MeasurementData) => void;
}

const MeasurementForm = ({ onSubmit }: MeasurementFormProps) => {
  const [measurements, setMeasurements] = useState<MeasurementData>({
    bust: '',
    waist: '',
    hips: '',
    shoulders: '',
    torsoLength: '',
    legLength: ''
  });

  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    const allFieldsFilled = Object.values(measurements).every(value => value.trim() !== '');
    
    if (!allFieldsFilled) {
      alert('Please fill out the form before submitting.');
      return;
    }

    // Store in localStorage
    localStorage.setItem('mysticMeasurements', JSON.stringify(measurements));
    
    onSubmit(measurements);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Ruler className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Body Measurements
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your measurements to get personalized styling recommendations
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-center text-primary">Measurement Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bust">Bust (inches)</Label>
                    <Input
                      id="bust"
                      type="number"
                      placeholder="e.g. 36"
                      value={measurements.bust}
                      onChange={(e) => handleInputChange('bust', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist (inches)</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="e.g. 28"
                      value={measurements.waist}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hips">Hips (inches)</Label>
                    <Input
                      id="hips"
                      type="number"
                      placeholder="e.g. 38"
                      value={measurements.hips}
                      onChange={(e) => handleInputChange('hips', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shoulders">Shoulders (inches)</Label>
                    <Input
                      id="shoulders"
                      type="number"
                      placeholder="e.g. 16"
                      value={measurements.shoulders}
                      onChange={(e) => handleInputChange('shoulders', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="torsoLength">Torso Length (inches)</Label>
                    <Input
                      id="torsoLength"
                      type="number"
                      placeholder="e.g. 24"
                      value={measurements.torsoLength}
                      onChange={(e) => handleInputChange('torsoLength', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legLength">Leg Length (inches)</Label>
                    <Input
                      id="legLength"
                      type="number"
                      placeholder="e.g. 32"
                      value={measurements.legLength}
                      onChange={(e) => handleInputChange('legLength', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="gradient"
                  size="xl"
                  className="w-full"
                >
                  Calculate My Body Shape
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeasurementForm;