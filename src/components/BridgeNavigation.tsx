import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, GitBranch, Download, Upload, ArrowLeft, FileText } from "lucide-react";

export default function BridgeNavigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/bridge", label: "Bridge", icon: GitBranch },
    { path: "/self-extractor", label: "Export", icon: Download },
    { path: "/import", label: "Import", icon: Upload },
    { path: "/return-to-builder", label: "Return", icon: ArrowLeft },
    { path: "/admin", label: "Docs", icon: FileText }
  ];

  return (
    <nav className="w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 space-x-1 sm:space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
