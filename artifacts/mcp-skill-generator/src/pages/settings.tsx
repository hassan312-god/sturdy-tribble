import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/react";
import { User, Key, Eye, EyeOff, MonitorSmartphone, Monitor, Moon, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiKey, setApiKey as saveApiKey } from "@/lib/storage";
import { useTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const { theme, setTheme } = useTheme();
  
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gpt-4o-mini");
  const [outputFormat, setOutputFormat] = useState("Detailed");

  useEffect(() => {
    setApiKey(getApiKey());
    setModel(localStorage.getItem("openai-model") || "gpt-4o-mini");
    setOutputFormat(localStorage.getItem("default-format") || "Detailed");
  }, []);

  const handleSaveApiSettings = () => {
    saveApiKey(apiKey);
    localStorage.setItem("openai-model", model);
    toast.success("API settings saved successfully");
  };

  const handleSavePreferences = () => {
    localStorage.setItem("default-format", outputFormat);
    toast.success("Preferences saved successfully");
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your generation history? This action cannot be undone.")) {
      localStorage.removeItem("mcp_skill_history");
      toast.success("History cleared successfully");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-auto p-6 md:p-8">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-display">Settings</h1>
          <p className="text-muted-foreground">Manage your account, API keys, and application preferences.</p>
        </header>

        <div className="grid gap-8">
          {/* Profile Section */}
          <section className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold font-display">Profile</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="shrink-0">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-background shadow-md object-cover bg-secondary" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold">
                    {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div>
                  <h3 className="text-lg font-bold">{user?.fullName || "Developer"}</h3>
                  <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <Button onClick={() => openUserProfile()} variant="outline" className="font-sans">
                  Manage Account in Clerk
                </Button>
              </div>
            </div>
          </section>

          {/* API Configuration */}
          <section className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold font-display">API Configuration</h2>
            </div>
            <div className="space-y-6 max-w-xl">
              <div className="space-y-3">
                <Label htmlFor="api-key" className="font-semibold">OpenAI API Key</Label>
                <div className="relative flex items-center">
                  <Input 
                    id="api-key"
                    type={showKey ? "text" : "password"} 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                    placeholder="sk-..." 
                    className="font-mono pr-10"
                  />
                  <button 
                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowKey(!showKey)}
                    type="button"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Stored securely in your browser's local storage. Never sent to our servers.
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="model-select" className="font-semibold">Default Model</Label>
                <select 
                  id="model-select"
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                  className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (Faster, cheaper)</option>
                  <option value="gpt-4o">gpt-4o (More capable)</option>
                  <option value="gpt-4-turbo">gpt-4-turbo (Legacy high-tier)</option>
                </select>
              </div>

              <Button onClick={handleSaveApiSettings} className="font-sans">Save API Settings</Button>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <MonitorSmartphone className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold font-display">Preferences</h2>
            </div>
            
            <div className="space-y-8 max-w-xl">
              <div className="space-y-3">
                <Label className="font-semibold">Theme</Label>
                <div className="flex items-center gap-3">
                  <Button 
                    variant={theme === "light" ? "default" : "outline"} 
                    onClick={() => setTheme("light")}
                    className="w-32 justify-start font-sans"
                  >
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </Button>
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"} 
                    onClick={() => setTheme("dark")}
                    className="w-32 justify-start font-sans"
                  >
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </Button>
                  <Button 
                    variant={theme === "system" ? "default" : "outline"} 
                    onClick={() => setTheme("system")}
                    className="w-32 justify-start font-sans"
                  >
                    <Monitor className="w-4 h-4 mr-2" /> System
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">Default Output Format</Label>
                <div className="flex flex-col gap-2">
                  {["Detailed", "Compact", "Minimal"].map((fmt) => (
                    <label key={fmt} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input 
                        type="radio" 
                        name="output-format" 
                        value={fmt} 
                        checked={outputFormat === fmt}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-4 h-4 text-primary accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{fmt}</span>
                        <span className="text-xs text-muted-foreground">
                          {fmt === "Detailed" && "Includes full markdown headers, tool descriptions, and examples."}
                          {fmt === "Compact" && "Streamlined format with essential schemas only."}
                          {fmt === "Minimal" && "Bare minimum parameters, aggressively token-optimized."}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="font-sans">Save Preferences</Button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-semibold text-destructive font-display">Danger Zone</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Clearing history will permanently remove all locally cached generation inputs and outputs. Your saved skills in the library will not be affected.
            </p>
            <Button variant="destructive" onClick={handleClearHistory} className="font-sans">
              Clear Local History
            </Button>
          </section>

        </div>
      </div>
    </div>
  );
}