import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  // Convert cm to inches (1 inch = 2.54 cm)
  const convertToInches = (value: string, unit: 'inches' | 'cm'): string => {
    if (unit === 'inches' || !value) return value;
    const cm = parseFloat(value);
    return (cm / 2.54).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    const allFieldsFilled = Object.values(measurements).every(value => value.trim() !== '');
    
    if (!allFieldsFilled) {
      alert('Please fill out the form before submitting.');
      return;
    }

    // Convert measurements to inches if needed
    const convertedMeasurements: MeasurementData = {
      bust: convertToInches(measurements.bust, unit),
      waist: convertToInches(measurements.waist, unit),
      hips: convertToInches(measurements.hips, unit),
      shoulders: convertToInches(measurements.shoulders, unit),
      torsoLength: convertToInches(measurements.torsoLength, unit),
      legLength: convertToInches(measurements.legLength, unit)
    };

    // Store in localStorage with unit info
    localStorage.setItem('mysticMeasurements', JSON.stringify({ measurements, unit }));
    
    onSubmit(convertedMeasurements);
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
                <div className="mb-6">
                  <Label htmlFor="unit">Measurement Unit</Label>
                  <Select value={unit} onValueChange={(value: 'inches' | 'cm') => setUnit(value)}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">Inches</SelectItem>
                      <SelectItem value="cm">Centimeters (cm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bust">Bust ({unit})</Label>
                    <Input
                      id="bust"
                      type="number"
                      placeholder={unit === 'inches' ? 'e.g. 36' : 'e.g. 91'}
                      value={measurements.bust}
                      onChange={(e) => handleInputChange('bust', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist ({unit})</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder={unit === 'inches' ? 'e.g. 28' : 'e.g. 71'}
                      value={measurements.waist}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hips">Hips ({unit})</Label>
                    <Input
                      id="hips"
                      type="number"
                      placeholder={unit === 'inches' ? 'e.g. 38' : 'e.g. 96'}
                      value={measurements.hips}
                      onChange={(e) => handleInputChange('hips', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shoulders">Shoulders ({unit})</Label>
                    <Input
                      id="shoulders"
                      type="number"
                      placeholder={unit === 'inches' ? 'e.g. 16' : 'e.g. 41'}
                      value={measurements.shoulders}
                      onChange={(e) => handleInputChange('shoulders', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="torsoLength">Torso Length ({unit})</Label>
                    <Input
                      id="torsoLength"
                      type="number"
                      placeholder={unit === 'inches' ? 'e.g. 24' : 'e.g. 61'}
                      value={measurements.torsoLength}
                      onChange={(e) => handleInputChange('torsoLength', e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legLength">Leg Length ({unit})</Label>
                    <Input
                      id="legLength"
                      type="number"
                      placeholder={unit === 'inches' ? 'e.g. 32' : 'e.g. 81'}
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