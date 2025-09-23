import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md p-8">
        <div className="absolute top-6 left-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Wizard
            </Link>
          </Button>
        </div>
        
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild className="flex items-center gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
