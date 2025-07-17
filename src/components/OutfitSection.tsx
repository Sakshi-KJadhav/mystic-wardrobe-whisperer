import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import outfitIndian1 from '@/assets/outfit-indian-1.jpg';
import outfitIndian2 from '@/assets/outfit-indian-2.jpg';
import outfitIndian3 from '@/assets/outfit-indian-3.jpg';
import outfitWestern1 from '@/assets/outfit-western-1.jpg';
import outfitWestern2 from '@/assets/outfit-western-2.jpg';
import outfitWestern3 from '@/assets/outfit-western-3.jpg';
import outfitComfort1 from '@/assets/outfit-comfort-1.jpg';
import outfitComfort2 from '@/assets/outfit-comfort-2.jpg';
import outfitComfort3 from '@/assets/outfit-comfort-3.jpg';
import outfitFusion1 from '@/assets/outfit-fusion-1.jpg';
import outfitFusion2 from '@/assets/outfit-fusion-2.jpg';
import outfitFusion3 from '@/assets/outfit-fusion-3.jpg';

interface StyleData {
  bodyShape: string;
  proportionType: string;
}

interface OutfitProps {
  styleData: StyleData;
}

type CategoryType = 'Indian' | 'Western' | 'Comfort' | 'Indo-Fusion';

const OutfitSection = ({ styleData }: OutfitProps) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Western');

  const getOutfitRecommendations = (category: CategoryType, bodyShape: string) => {
    const outfits = {
      Indian: [
        { image: outfitIndian1, description: 'Elegant lehenga with fitted choli for hourglass shape' },
        { image: outfitIndian2, description: 'Anarkali suit with empire waist for apple body type' },
        { image: outfitIndian3, description: 'Saree with peplum blouse for rectangle figure' },
        { image: outfitIndian1, description: 'Straight kurta with palazzo for pear shape' },
        { image: outfitIndian2, description: 'Indo-western crop top with sharara' },
        { image: outfitIndian3, description: 'Traditional silk saree with fitted blouse' },
        { image: outfitIndian1, description: 'Modern churidar with long dupatta' },
        { image: outfitIndian2, description: 'Festive ghagra with mirror work' },
        { image: outfitIndian3, description: 'Contemporary kurti with printed pants' },
        { image: outfitIndian1, description: 'Classic bandhgala jacket with leggings' }
      ],
      Western: [
        { image: outfitWestern1, description: 'A-line dress perfect for pear body shape' },
        { image: outfitWestern2, description: 'High-waisted jeans with fitted blazer' },
        { image: outfitWestern3, description: 'Wrap dress highlighting hourglass figure' },
        { image: outfitWestern1, description: 'Empire waist dress for apple shape' },
        { image: outfitWestern2, description: 'Straight-leg trousers with statement top' },
        { image: outfitWestern3, description: 'Midi skirt with tucked-in blouse' },
        { image: outfitWestern1, description: 'Wide-leg pants with fitted camisole' },
        { image: outfitWestern2, description: 'Bodycon dress with cardigan layer' },
        { image: outfitWestern3, description: 'Pencil skirt with V-neck sweater' },
        { image: outfitWestern1, description: 'Maxi dress with defined waistline' }
      ],
      Comfort: [
        { image: outfitComfort1, description: 'Cozy oversized sweater with leggings' },
        { image: outfitComfort2, description: 'Athleisure set with high-waisted design' },
        { image: outfitComfort3, description: 'Flowy tunic with comfortable jeggings' },
        { image: outfitComfort1, description: 'Soft jersey dress with sneakers' },
        { image: outfitComfort2, description: 'Relaxed fit jeans with cotton tee' },
        { image: outfitComfort3, description: 'Knit cardigan with yoga pants' },
        { image: outfitComfort1, description: 'Casual jumpsuit in soft fabric' },
        { image: outfitComfort2, description: 'Lounge wear set for home comfort' },
        { image: outfitComfort3, description: 'Stretchy midi dress with flats' },
        { image: outfitComfort1, description: 'Comfortable palazzo set' }
      ],
      'Indo-Fusion': [
        { image: outfitFusion1, description: 'Crop top with dhoti pants fusion look' },
        { image: outfitFusion2, description: 'Western jacket over Indian kurta' },
        { image: outfitFusion3, description: 'Palazzo pants with fitted Western top' },
        { image: outfitFusion1, description: 'Saree draped with belt for modern twist' },
        { image: outfitFusion2, description: 'Indo-western dress with ethnic prints' },
        { image: outfitFusion3, description: 'Denim jacket over ethnic dress' },
        { image: outfitFusion1, description: 'Traditional dupatta with Western outfit' },
        { image: outfitFusion2, description: 'Fusion maxi with Indian embroidery' },
        { image: outfitFusion3, description: 'Contemporary kurta with jeans' },
        { image: outfitFusion1, description: 'Ethnic skirt with modern blouse' }
      ]
    };

    return outfits[category];
  };

  const categories: CategoryType[] = ['Indian', 'Western', 'Comfort', 'Indo-Fusion'];
  const outfits = getOutfitRecommendations(selectedCategory, styleData.bodyShape);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Outfit Suggestions
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {styleData.bodyShape}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {styleData.proportionType}
            </Badge>
          </div>
        </div>

        {/* Category Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="transition-all"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Outfit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-fade-in">
          {outfits.map((outfit, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={outfit.image}
                    alt={`Outfit ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {outfit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitSection;