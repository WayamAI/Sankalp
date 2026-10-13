import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <div className="text-center">
        <h1 className="mb-4 font-display text-display-5xl text-foreground">404</h1>
        <p className="mb-6 text-body-lg text-tertiary">Oops! Page not found</p>
        <a href="/" className="text-secondary underline underline-offset-4 hover:text-foreground transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
