export const Footer = () => {
  return (
    <footer className="bg-gradient-card border-t border-border/30 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Empowering wellness through AI technology</span>
          </div>
          
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2025 BloomBuddy. Your AI Health Companion.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
