import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Shirt, 
  Scissors, 
  Heart, 
  Info,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import stylingNecklines from '@/assets/styling-necklines.jpg';

interface StyleData {
  bodyShape: string;
  proportionType: string;
}

interface StylingTip {
  category: string;
  icon: any;
  title: string;
  description: string;
  why: string;
  preview: string;
  items: {
    text: string;
    reason: string;
    visual: string;
  }[];
}

const StylingSection = ({ styleData }: { styleData: StyleData }) => {
  const getStylingTips = (bodyShape: string): StylingTip[] => {
    const tips = {
      hourglass: [
        {
          category: "Necklines",
          icon: Heart,
          title: "Flattering Necklines",
          description: "Emphasize your balanced proportions and show off your décolletage",
          why: "Your hourglass figure has naturally balanced shoulders and hips with a defined waist. The right neckline draws attention to your face and décolletage while maintaining this beautiful balance.",
          preview: "V-necks and scoop necks create elegant vertical lines that complement your curves",
          items: [
            { 
              text: "V-neck tops and dresses", 
              reason: "Creates vertical lines that elongate your torso and highlight your balanced proportions",
              visual: "📐 Creates an elegant downward triangle that frames your face"
            },
            { 
              text: "Scoop and round necklines", 
              reason: "Softly frames your face and shoulders while showcasing your décolletage",
              visual: "⭕ Gentle curves that mirror your natural silhouette"
            },
            { 
              text: "Sweetheart necklines", 
              reason: "Perfectly complements your curves and creates a romantic, feminine look",
              visual: "💝 Heart-shaped opening that celebrates your natural curves"
            }
          ]
        },
        {
          category: "Fits & Silhouettes",
          icon: Shirt,
          title: "Perfect Fits",
          description: "Highlight your natural waist and showcase your curves",
          why: "Your hourglass shape is about celebrating your natural curves. The right fit emphasizes your smallest point (your waist) while skimming over your curves without hiding them.",
          preview: "Fitted and tailored pieces that nip in at the waist create your most flattering silhouette",
          items: [
            { 
              text: "Fitted blazers with waist definition", 
              reason: "Creates structure while highlighting your narrowest point",
              visual: "👔 Tailored lines that follow your natural curves"
            },
            { 
              text: "Wrap dresses and tops", 
              reason: "Naturally cinches at the waist and creates a beautiful silhouette",
              visual: "🎀 Adjustable wrap creates perfect waist emphasis"
            },
            { 
              text: "High-waisted bottoms", 
              reason: "Sits at your natural waist to create an elongated leg line",
              visual: "📏 Higher waistline creates longer, leaner proportions"
            }
          ]
        },
        {
          category: "Styling Techniques",
          icon: Scissors,
          title: "Essential Styling",
          description: "Simple techniques to enhance your natural silhouette",
          why: "These styling techniques help maintain your hourglass proportions and prevent your curves from being hidden under loose or poorly fitted clothing.",
          preview: "Strategic tucking and belting keeps your waist visible and your proportions balanced",
          items: [
            { 
              text: "Always tuck in your tops", 
              reason: "Prevents fabric from hiding your waist and maintains your silhouette",
              visual: "📎 Clean lines that showcase your waist definition"
            },
            { 
              text: "Use belts at your natural waist", 
              reason: "Draws attention to your narrowest point and creates definition",
              visual: "⚡ Instant waist emphasis that enhances your curves"
            },
            { 
              text: "Avoid oversized, boxy clothing", 
              reason: "Loose fits hide your beautiful proportions and create a shapeless look",
              visual: "❌ Boxy shapes mask your natural hourglass silhouette"
            }
          ]
        }
      ],
      pear: [
        {
          category: "Necklines",
          icon: Heart,
          title: "Balancing Necklines",
          description: "Draw attention upward to balance your proportions",
          why: "Your pear shape has narrower shoulders and a fuller hip area. The right neckline creates visual width on top to balance your proportions and draw attention to your upper body.",
          preview: "Wide and off-shoulder necklines create the illusion of broader shoulders",
          items: [
            { 
              text: "Boat neck and off-shoulder tops", 
              reason: "Creates horizontal lines that visually widen your shoulders",
              visual: "⛵ Wide horizontal opening balances fuller hips"
            },
            { 
              text: "Square and wide scoop necklines", 
              reason: "Adds visual weight to your upper body for better proportion",
              visual: "⬜ Angular lines that create shoulder emphasis"
            },
            { 
              text: "Statement collars and lapels", 
              reason: "Draws attention upward and adds structure to your shoulders",
              visual: "🎭 Eye-catching details that focus attention on your upper body"
            }
          ]
        },
        {
          category: "Fits & Silhouettes",
          icon: Shirt,
          title: "Proportion-Balancing Fits",
          description: "Create balance between your upper and lower body",
          why: "For pear shapes, the goal is to create visual balance by adding structure to your upper body while choosing bottoms that skim over your hips without adding bulk.",
          preview: "Fitted tops with A-line bottoms create the perfect balanced silhouette",
          items: [
            { 
              text: "Fitted tops with structured shoulders", 
              reason: "Creates definition in your upper body to balance fuller hips",
              visual: "💪 Strong shoulder lines that create upper body presence"
            },
            { 
              text: "A-line skirts and dresses", 
              reason: "Skims over hips while creating a feminine, balanced silhouette",
              visual: "🔺 Gentle flare that flatters your hip area"
            },
            { 
              text: "Straight-leg and bootcut pants", 
              reason: "Creates a clean line that balances your proportions",
              visual: "📏 Straight lines that don't add bulk to your lower body"
            }
          ]
        },
        {
          category: "Styling Techniques",
          icon: Scissors,
          title: "Strategic Styling",
          description: "Techniques to enhance your upper body",
          why: "These styling techniques help draw attention to your upper body while creating a balanced, proportionate look that celebrates your pear shape.",
          preview: "Light colors and patterns on top with darker bottoms create perfect balance",
          items: [
            { 
              text: "Wear lighter colors on top", 
              reason: "Light colors advance visually, making your upper body appear larger",
              visual: "🌟 Bright tops that catch the eye and create focus"
            },
            { 
              text: "Add patterns and textures to tops", 
              reason: "Visual interest draws attention upward and adds dimension",
              visual: "🎨 Decorative elements that create upper body emphasis"
            },
            { 
              text: "Choose darker bottoms", 
              reason: "Dark colors recede, creating a slimming effect on your lower body",
              visual: "🌙 Dark bottoms that create a streamlined lower silhouette"
            }
          ]
        }
      ],
      apple: [
        {
          category: "Necklines",
          icon: Heart,
          title: "Elongating Necklines",
          description: "Create vertical lines and draw attention to your face",
          why: "Your apple shape carries weight in your midsection. The right neckline creates vertical lines that elongate your torso and draws attention away from your middle to your beautiful face and décolletage.",
          preview: "V-necks and deep scoops create elegant vertical lines that flatter your upper body",
          items: [
            { 
              text: "Deep V-necks", 
              reason: "Creates strong vertical lines that elongate your torso",
              visual: "⚡ Sharp downward angle that creates length"
            },
            { 
              text: "Scoop and cowl necks", 
              reason: "Softly frames your face while creating a flattering neckline",
              visual: "🌙 Gentle curves that focus on your upper body"
            },
            { 
              text: "Wrap necklines", 
              reason: "Creates a flattering V-shape while adding adjustability",
              visual: "🎀 Adjustable opening that creates perfect proportions"
            }
          ]
        },
        {
          category: "Fits & Silhouettes",
          icon: Shirt,
          title: "Waist-Defining Fits",
          description: "Create a defined waist and elongate your silhouette",
          why: "Apple shapes benefit from fits that create the illusion of a waist while skimming over the midsection. The right silhouette draws attention to your legs and creates a more defined shape.",
          preview: "Empire waists and A-line shapes create a flattering silhouette that defines your waist",
          items: [
            { 
              text: "Empire waist dresses", 
              reason: "Sits just under the bust to create a high waistline",
              visual: "👗 High waist placement that creates length below"
            },
            { 
              text: "A-line and fit-and-flare silhouettes", 
              reason: "Skims over your midsection while creating a feminine shape",
              visual: "🔺 Gentle flare that creates a balanced silhouette"
            },
            { 
              text: "Tunic tops with leggings", 
              reason: "Covers your midsection while showing off your legs",
              visual: "📏 Longer tops that create a streamlined look"
            }
          ]
        },
        {
          category: "Styling Techniques",
          icon: Scissors,
          title: "Lengthening Techniques",
          description: "Create vertical lines and elongate your silhouette",
          why: "These techniques help create the illusion of a longer, leaner torso while drawing attention to your best features like your legs and décolletage.",
          preview: "Vertical lines and strategic layering create a longer, leaner appearance",
          items: [
            { 
              text: "Wear long cardigans and jackets", 
              reason: "Creates vertical lines that elongate your silhouette",
              visual: "📏 Long vertical lines that create height"
            },
            { 
              text: "Use vertical stripes and patterns", 
              reason: "Creates the illusion of length and draws the eye up and down",
              visual: "📊 Vertical lines that make you appear taller"
            },
            { 
              text: "Belt above or below your natural waist", 
              reason: "Creates a defined waist point where it's most flattering",
              visual: "⚡ Strategic belt placement that creates shape"
            }
          ]
        }
      ],
      rectangle: [
        {
          category: "Necklines",
          icon: Heart,
          title: "Curve-Creating Necklines",
          description: "Add dimension and curves to your silhouette",
          why: "Your rectangle shape has a straight silhouette with minimal waist definition. The right neckline adds visual curves and softness to create a more feminine, dimensional look.",
          preview: "Curved and detailed necklines add softness and dimension to your straight silhouette",
          items: [
            { 
              text: "Sweetheart and scoop necklines", 
              reason: "Adds curves to your upper body and creates feminine appeal",
              visual: "💝 Curved openings that add softness to angular lines"
            },
            { 
              text: "Cowl and draped necklines", 
              reason: "Creates soft folds that add dimension and texture",
              visual: "🌊 Flowing fabric that creates visual interest"
            },
            { 
              text: "Detailed collars and embellishments", 
              reason: "Adds visual weight and interest to your neckline",
              visual: "✨ Decorative elements that create focal points"
            }
          ]
        },
        {
          category: "Fits & Silhouettes",
          icon: Shirt,
          title: "Shape-Creating Fits",
          description: "Add curves and definition to your straight silhouette",
          why: "Rectangle shapes benefit from fits that create the illusion of curves and waist definition. The right silhouette adds dimension where your body naturally has less.",
          preview: "Peplum tops and textured fabrics create the curves your body shape can embrace",
          items: [
            { 
              text: "Peplum tops and dresses", 
              reason: "Creates the illusion of curves and adds hip definition",
              visual: "🌸 Flared hem that creates feminine curves"
            },
            { 
              text: "Ruffled and textured pieces", 
              reason: "Adds dimension and visual interest to your silhouette",
              visual: "🎭 Textural elements that create depth and curves"
            },
            { 
              text: "Layered and tiered clothing", 
              reason: "Creates visual breaks that add shape and movement",
              visual: "📚 Multiple layers that create dimensional silhouette"
            }
          ]
        },
        {
          category: "Styling Techniques",
          icon: Scissors,
          title: "Waist-Defining Techniques",
          description: "Create curves and define your waistline",
          why: "These techniques help create the illusion of curves and waist definition, adding feminine appeal to your naturally straight silhouette.",
          preview: "Bold belts and contrasting colors create waist definition and visual curves",
          items: [
            { 
              text: "Use wide, statement belts", 
              reason: "Creates a defined waist point and adds visual interest",
              visual: "⚡ Bold belt that creates instant waist definition"
            },
            { 
              text: "Layer different textures", 
              reason: "Adds dimension and visual weight to create curves",
              visual: "🎨 Mixed textures that create visual depth"
            },
            { 
              text: "Wear contrasting colors at your waist", 
              reason: "Creates a focal point that defines your waistline",
              visual: "🌈 Color contrast that draws attention to your middle"
            }
          ]
        }
      ],
      'inverted triangle': [
        {
          category: "Necklines",
          icon: Heart,
          title: "Softening Necklines",
          description: "Balance your broad shoulders with softer necklines",
          why: "Your inverted triangle shape has broader shoulders and a narrower hip area. The right neckline softens your shoulder line and creates better balance with your lower body.",
          preview: "Softer necklines create balance and draw attention away from broad shoulders",
          items: [
            { 
              text: "Scoop and V-necks", 
              reason: "Softens your shoulder line while creating elegant vertical lines",
              visual: "🌙 Gentle curves that soften angular shoulders"
            },
            { 
              text: "Cowl and draped necklines", 
              reason: "Creates soft folds that add femininity to your upper body",
              visual: "🌊 Flowing fabric that softens strong shoulder lines"
            },
            { 
              text: "Avoid boat necks and wide straps", 
              reason: "These emphasize your already broad shoulders",
              visual: "❌ Horizontal lines that make shoulders appear wider"
            }
          ]
        },
        {
          category: "Fits & Silhouettes",
          icon: Shirt,
          title: "Balancing Silhouettes",
          description: "Create balance between your upper and lower body",
          why: "For inverted triangles, the goal is to add volume to your lower body while minimizing your shoulder area to create a more balanced, proportionate silhouette.",
          preview: "Fitted tops with flared bottoms create perfect proportion balance",
          items: [
            { 
              text: "Fitted tops without shoulder details", 
              reason: "Keeps your upper body streamlined without adding bulk",
              visual: "📏 Clean lines that don't emphasize broad shoulders"
            },
            { 
              text: "A-line and flared skirts", 
              reason: "Adds volume to your lower body for better proportion",
              visual: "🔺 Flared silhouette that balances your upper body"
            },
            { 
              text: "Wide-leg and bootcut pants", 
              reason: "Creates visual weight in your lower body",
              visual: "📏 Wider hem that balances your shoulder width"
            }
          ]
        },
        {
          category: "Styling Techniques",
          icon: Scissors,
          title: "Proportion-Balancing Techniques",
          description: "Balance your silhouette with strategic styling",
          why: "These techniques help redistribute visual weight from your shoulders to your lower body, creating a more balanced and harmonious silhouette.",
          preview: "Light bottoms and darker tops help balance your proportions",
          items: [
            { 
              text: "Wear lighter colors on bottom", 
              reason: "Light colors advance, making your lower body appear larger",
              visual: "🌟 Bright bottoms that create lower body emphasis"
            },
            { 
              text: "Add patterns and details to bottoms", 
              reason: "Draws attention downward and adds visual weight",
              visual: "🎨 Decorative elements that focus on lower body"
            },
            { 
              text: "Keep tops simple and minimal", 
              reason: "Prevents adding bulk to your already prominent shoulder area",
              visual: "✨ Clean, simple lines that don't emphasize shoulders"
            }
          ]
        }
      ]
    };

    return tips[bodyShape as keyof typeof tips] || tips.hourglass;
  };

  const tips = getStylingTips(styleData.bodyShape);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section with Image */}
        <div className="relative mb-16">
          <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
            <img 
              src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Fashion and styling inspiration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-4">
                  Your Personal Styling Guide
                </h1>
                <p className="text-xl mb-6 max-w-2xl mx-auto">
                  Discover expert styling tips tailored specifically for your body shape and let your fashion reflect your unique soul
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="secondary" className="text-lg px-6 py-3 bg-white/90 text-black">
                    {styleData.bodyShape}
                  </Badge>
                  <Badge variant="outline" className="text-lg px-6 py-3 border-white text-white">
                    {styleData.proportionType}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Fashion is more than clothing—it's a language that speaks to your soul. These personalized styling tips will help you create looks that not only flatter your body but also express your authentic self.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <tip.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {tip.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{tip.title}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {tip.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Why Section */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                      Why this matters for {styleData.bodyShape}:
                    </h4>
                  </div>
                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    {tip.why}
                  </p>
                </div>

                {/* Preview Section */}
                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-2 mb-1">
                    <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                      Style Preview:
                    </h4>
                  </div>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    {tip.preview}
                  </p>
                </div>

                <Separator />

                {/* Styling Items */}
                <div className="space-y-4">
                  {tip.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-6 p-2 bg-muted/50 rounded text-xs text-muted-foreground border-l-2 border-accent">
                        <span className="font-medium">Visual Guide:</span> {item.visual}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Tips Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Additional Styling Tips for {styleData.bodyShape}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-primary">Quick Styling Rules:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                    <span>Always consider your proportions when choosing outfits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                    <span>Fit is more important than following every trend</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                    <span>Build a wardrobe around pieces that flatter your shape</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                    <span>Confidence is your best accessory</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-primary">Remember:</h4>
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent-foreground">
                    These are guidelines, not rules! Fashion is about expressing yourself and feeling confident. 
                    Use these tips as a starting point, but don't be afraid to experiment and find what makes YOU feel amazing.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StylingSection;
