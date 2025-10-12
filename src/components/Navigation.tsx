import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileJson, Eye, History, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Schema", path: "/schema", icon: FileJson },
    { name: "Preview", path: "/preview", icon: Eye },
    { name: "History", path: "/history", icon: History },
    { name: "AEIOU Exporter", path: "/aeiou", icon: Zap },
  ];

  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
