import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import stylingImage from '@/assets/styling-necklines.jpg';

interface StyleData {
  bodyShape: string;
  proportionType: string;
}

interface StylingProps {
  styleData: StyleData;
}

const StylingSection = ({ styleData }: StylingProps) => {
  const getStylingRecommendations = (bodyShape: string, proportionType: string) => {
    const recommendations = {
      hourglass: {
        necklines: { tip: "V-necks and scoop necks highlight your balanced proportions", image: stylingImage },
        sleeves: { tip: "Fitted sleeves show off your defined waist", image: stylingImage },
        tops: { tip: "Wrap tops and fitted styles accentuate your curves", image: stylingImage },
        bottoms: { tip: "High-waisted styles maintain your silhouette", image: stylingImage },
        dresses: { tip: "Bodycon and wrap dresses are perfect for you", image: stylingImage },
        'jeans rise': { tip: "High-rise and mid-rise jeans maintain your waist definition", image: stylingImage },
        'color blocking': { tip: "Use color blocking to emphasize your natural curves", image: stylingImage },
        'tuck/untuck': { tip: "Tuck in tops to showcase your defined waistline", image: stylingImage }
      },
      pear: {
        necklines: { tip: "Boat necks and off-shoulder styles balance your shoulders", image: stylingImage },
        sleeves: { tip: "Statement sleeves add volume to your upper body", image: stylingImage },
        tops: { tip: "Bright colors and patterns on top draw attention upward", image: stylingImage },
        bottoms: { tip: "Dark, straight-leg pants elongate your silhouette", image: stylingImage },
        dresses: { tip: "A-line and fit-and-flare dresses are flattering", image: stylingImage },
        'jeans rise': { tip: "High-rise jeans help balance your proportions", image: stylingImage },
        'color blocking': { tip: "Use lighter colors on top, darker below for balance", image: stylingImage },
        'tuck/untuck': { tip: "Partial tucks or half-tucks add visual interest to your upper body", image: stylingImage }
      },
      apple: {
        necklines: { tip: "V-necks and deep scoop necks elongate your torso", image: stylingImage },
        sleeves: { tip: "3/4 sleeves and flutter sleeves are flattering", image: stylingImage },
        tops: { tip: "Empire waist and flowy tops create a defined silhouette", image: stylingImage },
        bottoms: { tip: "High-waisted bottoms with structure support your figure", image: stylingImage },
        dresses: { tip: "Empire waist and A-line dresses are perfect", image: stylingImage },
        'jeans rise': { tip: "High-rise jeans create a defined waistline", image: stylingImage },
        'color blocking': { tip: "Use vertical color blocks to elongate your torso", image: stylingImage },
        'tuck/untuck': { tip: "Leave tops untucked or try a loose front tuck for comfort", image: stylingImage }
      },
      rectangle: {
        necklines: { tip: "Sweetheart and square necks create curves", image: stylingImage },
        sleeves: { tip: "Puffy and gathered sleeves add dimension", image: stylingImage },
        tops: { tip: "Peplum and ruffled tops create the illusion of curves", image: stylingImage },
        bottoms: { tip: "Straight-leg and wide-leg pants are ideal", image: stylingImage },
        dresses: { tip: "Sheath and shift dresses complement your frame", image: stylingImage },
        'jeans rise': { tip: "Mid-rise jeans work best for your straight silhouette", image: stylingImage },
        'color blocking': { tip: "Use horizontal color blocks to create curves", image: stylingImage },
        'tuck/untuck': { tip: "Experiment with both - tuck with belts to create waist definition", image: stylingImage }
      },
      'inverted triangle': {
        necklines: { tip: "Scoop necks and cowl necks soften broad shoulders", image: stylingImage },
        sleeves: { tip: "Sleeveless or cap sleeves don't add bulk", image: stylingImage },
        tops: { tip: "Darker colors on top with lighter bottoms balance proportions", image: stylingImage },
        bottoms: { tip: "Wide-leg pants and flared styles add volume below", image: stylingImage },
        dresses: { tip: "A-line and fit-and-flare dresses are flattering", image: stylingImage },
        'jeans rise': { tip: "Low-rise to mid-rise jeans help balance your proportions", image: stylingImage },
        'color blocking': { tip: "Use darker colors on top, brighter below to balance", image: stylingImage },
        'tuck/untuck': { tip: "Leave tops untucked to soften your shoulder line", image: stylingImage }
      }
    };

    return recommendations[bodyShape as keyof typeof recommendations] || recommendations.hourglass;
  };

  const recommendations = getStylingRecommendations(styleData.bodyShape, styleData.proportionType);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Your Styling Guide
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

        <Card className="shadow-elegant animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center text-primary">Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-primary">Category</th>
                    <th className="text-left p-4 font-semibold text-primary">Styling Tip</th>
                    <th className="text-left p-4 font-semibold text-primary">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(recommendations).map(([category, data]) => (
                    <tr key={category} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium capitalize">
                        {category}
                      </td>
                      <td className="p-4 text-muted-foreground max-w-md">
                        {data.tip}
                      </td>
                      <td className="p-4">
                        <div className="w-20 h-16 rounded-lg overflow-hidden shadow-sm">
                          <img 
                            src={data.image} 
                            alt={`${category} styling example`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StylingSection;