import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-elegant border-b border-border' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Mystic
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('styling')}
              className="hover:text-primary"
            >
              Styling
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('outfits')}
              className="hover:text-primary"
            >
              Outfits
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('analyzer')}
              className="hover:text-primary"
            >
              Analyzer
            </Button>
            <ThemeToggle />
            <Button
              variant="gradient"
              size="sm"
              onClick={() => onNavigate('form')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;