export const Footer = () => {
  return (
    <footer className="bg-gradient-card border-t border-border/30 mt-12 sm:mt-16 lg:mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-muted-foreground text-center md:text-left">
            <span className="text-sm sm:text-base">Empowering wellness through AI technology</span>
          </div>
          
          <div className="text-center text-muted-foreground order-last md:order-none">
            <p className="text-xs sm:text-sm">
              © 2025 BloomBuddy. Your AI Health Companion.
            </p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
