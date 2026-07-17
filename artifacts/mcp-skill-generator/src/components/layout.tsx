import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { LayoutDashboard, Library, Layers, Sun, Moon, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on navigate
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Templates", href: "/templates", icon: Library },
    { label: "My Skills", href: "/my-skills", icon: Layers },
  ];

  const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="Logo" className="w-7 h-7" />
          <span className="font-semibold tracking-tight text-sm">MCP Generator</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "opacity-70")} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Footer / User */}
      <div className="p-4 border-t border-border shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName || ""} className="w-8 h-8 rounded-full bg-secondary shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-medium text-xs">
                {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "?"}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.fullName || "Developer"}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut({ redirectUrl: basePath || "/" })} className="h-8 px-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-xs">Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[220px] shrink-0 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[260px] max-w-[80vw] shadow-2xl animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Topbar */}
        <div className="md:hidden h-14 border-b border-border flex items-center px-4 justify-between bg-card shrink-0">
          <div className="flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="Logo" className="w-6 h-6" />
            <span className="font-semibold tracking-tight text-sm">MCP Generator</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="h-8 w-8 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
