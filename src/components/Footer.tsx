
import { Mail, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-footer text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-accent animate-float" />
              <h3 className="text-2xl font-bold">Mystic</h3>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Your personal AI-powered fashion consultant that analyzes your body shape and provides 
              personalized styling recommendations to help you look and feel confident in every outfit.
            </p>
          </div>

          {/* What Mystic Does For You Section */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-accent">What Mystic Does For You</h3>
            <ul className="space-y-3 text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✨</span>
                <span>Instantly identifies your unique body shape with precision</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">👗</span>
                <span>Curates personalized outfit recommendations for any occasion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">🎨</span>
                <span>Provides expert styling tips for colors, patterns, and silhouettes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">📏</span>
                <span>Offers guidance on proportions and flattering necklines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">🌟</span>
                <span>Helps you discover your authentic style across cultures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">💫</span>
                <span>Analyzes your existing outfits for styling improvements</span>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4 text-accent">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-end gap-2 text-primary-foreground/80 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                <a href="mailto:yourmystic13@gmail.com" className="hover:underline">
                  yourmystic13@gmail.com
                </a>
              </div>
              <p className="text-primary-foreground/60 text-sm">
                Questions? Feedback? We'd love to hear from you!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-primary-foreground/60 text-sm">
                © 2025 Mystic. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-accent" />
              <span>for fashion enthusiasts everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
