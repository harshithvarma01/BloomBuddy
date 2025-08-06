import { Activity, Moon, Sun, Heart, Stethoscope, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Enhanced Logo Component
const EnhancedLogo = ({ onClick }: { onClick?: () => void }) => (
  <div 
    className="flex items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer group" 
    onClick={onClick}
  >
    <div className="relative">
      {/* Main Logo Container */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-white/25 via-white/15 to-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl group-hover:scale-105 transition-all duration-300">
        {/* Primary Icon */}
        <div className="relative">
          <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
          {/* Heart Indicator */}
          <div className="absolute -top-0.5 sm:-top-1 lg:-top-1 -right-0.5 sm:-right-1 lg:-right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border-2 border-white/80 flex items-center justify-center shadow-lg">
            <Heart className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 text-white fill-current" />
          </div>
        </div>
        
        {/* Animated Ring */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-2xl lg:rounded-3xl border-2 border-white/30 animate-pulse"></div>
      </div>
      
      {/* Status Indicators */}
      <div className="absolute -top-0.5 sm:-top-1 lg:-top-1 -left-0.5 sm:-left-1 lg:-left-1 w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white animate-pulse shadow-lg">
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute -bottom-1 sm:-bottom-2 lg:-bottom-2 -right-1 sm:-right-2 lg:-right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-80 animate-bounce delay-300"></div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-lg scale-110 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
    </div>
    
    {/* Enhanced Text */}
    <div className="space-y-0.5 sm:space-y-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-3">
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white drop-shadow-lg tracking-wide group-hover:text-white/95 transition-colors duration-300">
          BloomBuddy
        </h1>
        <div className="px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 mx-auto sm:mx-0 w-fit">
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">AI</span>
        </div>
      </div>
      <p className="text-white/90 text-xs sm:text-sm font-medium drop-shadow-sm group-hover:text-white/80 transition-colors duration-300 text-center sm:text-left">
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
        <div className="absolute top-2 left-4 sm:left-10 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-3 sm:top-6 right-8 sm:right-16 w-4 h-4 sm:w-6 sm:h-6 bg-white/15 rounded-full animate-float delay-300"></div>
        <div className="absolute bottom-2 sm:bottom-3 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-white/25 rounded-full animate-float delay-700"></div>
        <div className="absolute bottom-2 right-6 sm:right-10 w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full animate-float delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 relative z-10">
        <div className="flex items-center justify-between">
          <EnhancedLogo onClick={onLogoClick} />
          
          {/* Enhanced Controls */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-lg sm:rounded-xl p-2 sm:p-3 backdrop-blur-sm border border-white/20 shadow-lg"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" />}
            </Button>
            
            {/* Enhanced Status Panel */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4 bg-white/15 backdrop-blur-md rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 border border-white/20 shadow-xl">
              {/* Security Status */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 drop-shadow-sm" />
                <span className="text-white/95 text-xs sm:text-sm font-medium drop-shadow-sm">Secure</span>
              </div>
              
              <div className="h-3 sm:h-4 w-px bg-white/30"></div>
              
              {/* Online Status */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-white/95 text-xs sm:text-sm font-medium drop-shadow-sm">Online</span>
              </div>
              
              <div className="h-3 sm:h-4 w-px bg-white/30"></div>
              
              {/* AI Status */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 drop-shadow-sm animate-pulse" />
                <span className="text-white/95 text-xs sm:text-sm font-medium drop-shadow-sm">AI Ready</span>
              </div>
            </div>
            
            {/* Mobile Status Indicator */}
            <div className="md:hidden flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/95 text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};