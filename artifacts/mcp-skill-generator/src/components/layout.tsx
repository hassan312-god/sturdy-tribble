import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { LayoutDashboard, Library, Layers, Sun, Moon, Menu, X, LogOut, Wand2, Settings as SettingsIcon, Bell, CheckCircle2, AlertCircle, Info, Check, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNotifications, AppNotification } from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (n: AppNotification) => {
    markRead(n.id);
    if (n.link) {
      setLocation(n.link);
      setIsOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "error": return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="icon" className="h-8 w-8 relative text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse ring-2 ring-background"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 md:bottom-auto md:top-full md:mt-2 md:right-0 md:left-auto w-80 bg-popover border shadow-xl rounded-xl z-50 overflow-hidden flex flex-col max-h-[400px] animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b flex items-center justify-between bg-card shrink-0">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={markAllRead}>
                <Check className="w-3 h-3 mr-1" /> Mark all read
              </Button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-popover">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.slice(0, 20).map((n) => (
                  <div 
                    key={n.id} 
                    className={cn(
                      "p-3 hover:bg-secondary/50 cursor-pointer transition-colors flex gap-3 text-sm border-l-2",
                      n.read ? "border-transparent opacity-70" : "border-primary bg-primary/5",
                      n.link ? "hover:text-primary" : ""
                    )}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium">{n.title}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {n.message && <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t bg-card shrink-0">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-destructive" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Generate (AI)", href: "/generate", icon: Wand2 },
    { label: "Smart Builder", href: "/build", icon: Zap },
    { label: "Templates", href: "/templates", icon: Library },
    { label: "My Skills", href: "/my-skills", icon: Layers },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex h-14 items-center px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="Logo" className="w-7 h-7" />
          <span className="font-bold tracking-tight text-sm font-display">MCP Generator</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href || 
          (item.href === "/templates" && location.startsWith("/templates/"));
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

      <div className="p-4 border-t border-border shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName || ""} className="w-8 h-8 rounded-full bg-secondary shrink-0 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-medium text-xs">
                {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "?"}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user?.fullName || "Developer"}</span>
              <span className="text-[10px] text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <NotificationDropdown />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut({ redirectUrl: basePath || "/" })} className="h-8 px-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-xs">Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <div className="hidden md:flex w-[240px] shrink-0 flex-col">
        <SidebarContent />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[260px] max-w-[80vw] shadow-2xl animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="md:hidden h-14 border-b border-border flex items-center px-4 justify-between bg-card shrink-0">
          <div className="flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="Logo" className="w-6 h-6" />
            <span className="font-bold tracking-tight text-sm font-display">MCP Generator</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationDropdown />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="h-8 w-8 text-muted-foreground">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1 overflow-auto relative bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}