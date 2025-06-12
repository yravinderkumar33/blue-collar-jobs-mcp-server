import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">BC</span>
            </div>
            <span className="text-xl font-bold text-foreground">WorkWise</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/search' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Search Jobs
            </Link>
            <Link 
              to="/applications" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/applications' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Applications
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
