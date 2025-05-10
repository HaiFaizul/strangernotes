
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-muted mt-12 py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="font-cursive text-xl text-stranger">
              Stranger Notes
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Share anonymous inspiration with strangers
            </p>
          </div>
          
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-stranger">
              Home
            </Link>
            <Link to="/notes" className="text-sm text-muted-foreground hover:text-stranger">
              All Notes
            </Link>
            <Link to="/create" className="text-sm text-muted-foreground hover:text-stranger">
              Write a Note
            </Link>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} Stranger Notes. All notes are anonymous by default.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
