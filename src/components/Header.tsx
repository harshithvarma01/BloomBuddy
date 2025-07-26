import { Activity, Moon, Sun, Heart, Stethoscope, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Enhanced Logo Component
const EnhancedLogo = ({ onClick }: { onClick?: () => void }) => (
  <div 
    className="flex items-center gap-4 cursor-pointer group" 
    onClick={onClick}
  >
    <div className="relative">
      {/* Main Logo Container */}
      <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-white/25 via-white/15 to-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl group-hover:scale-105 transition-all duration-300">
        {/* Primary Icon */}
        <div className="relative">
          <Stethoscope className="w-8 h-8 text-white drop-shadow-lg" />
          {/* Heart Indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border-2 border-white/80 flex items-center justify-center shadow-lg">
            <Heart className="w-2.5 h-2.5 text-white fill-current" />
          </div>
        </div>
        
        {/* Animated Ring */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-pulse"></div>
      </div>
      
      {/* Status Indicators */}
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white animate-pulse shadow-lg">
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-80 animate-bounce delay-300"></div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-lg scale-110 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
    </div>
    
    {/* Enhanced Text */}
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide group-hover:text-white/95 transition-colors duration-300">
          BloomBuddy
        </h1>
        <div className="px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30">
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">AI</span>
        </div>
      </div>
      <p className="text-white/90 text-sm font-medium drop-shadow-sm group-hover:text-white/80 transition-colors duration-300">
        Your AI-Powered Health Companion
      </p>
    </div>
  </div>
);

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header = ({ onLogoClick }: HeaderProps) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl backdrop-blur-xl border-b border-white/20 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-10 w-8 h-8 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-6 right-16 w-6 h-6 bg-white/15 rounded-full animate-float delay-300"></div>
        <div className="absolute bottom-3 left-1/4 w-4 h-4 bg-white/25 rounded-full animate-float delay-700"></div>
        <div className="absolute bottom-2 right-10 w-5 h-5 bg-white/20 rounded-full animate-float delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-6 py-5 relative z-10">
        <div className="flex items-center justify-between">
          <EnhancedLogo onClick={onLogoClick} />
          
          {/* Enhanced Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-xl p-3 backdrop-blur-sm border border-white/20 shadow-lg"
            >
              {isDark ? <Sun className="w-5 h-5 drop-shadow-sm" /> : <Moon className="w-5 h-5 drop-shadow-sm" />}
            </Button>
            
            {/* Enhanced Status Panel */}
            <div className="hidden sm:flex items-center gap-4 bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 shadow-xl">
              {/* Security Status */}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-300 drop-shadow-sm" />
                <span className="text-white/95 text-sm font-medium drop-shadow-sm">Secure</span>
              </div>
              
              <div className="h-4 w-px bg-white/30"></div>
              
              {/* Online Status */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-white/95 text-sm font-medium drop-shadow-sm">Online</span>
              </div>
              
              <div className="h-4 w-px bg-white/30"></div>
              
              {/* AI Status */}
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-300 drop-shadow-sm animate-pulse" />
                <span className="text-white/95 text-sm font-medium drop-shadow-sm">AI Ready</span>
              </div>
            </div>
            
            {/* Mobile Status Indicator */}
            <div className="sm:hidden flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/95 text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};