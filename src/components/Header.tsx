
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b border-muted">
      <div className="container flex justify-between items-center h-16">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-cursive font-bold text-stranger">Stranger Notes</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-stranger">
            Home
          </Link>
          <Link to="/notes" className="text-foreground hover:text-stranger">
            All Notes
          </Link>
        </nav>
        
        <Button asChild variant="default" size="sm" className="gap-1">
          <Link to="/create">
            <PenIcon className="h-4 w-4 mr-1" />
            Write a Note
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
