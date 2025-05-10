
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <p className="text-sm text-muted-foreground">
          Whispers of Strangers — Share anonymous notes with the world
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="https://www.instagram.com/hai_faizul/"
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={18} />
            <span className="text-sm">@hai_faizul</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
