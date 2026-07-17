import { useState } from "react";
import { useListTemplates } from "@workspace/api-client-react";
import { Badge, Skeleton } from "@/components/ui/custom";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { FileCode, ArrowRight, Library, Search } from "lucide-react";
import { useNotifications } from "@/lib/notifications";

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: templates, isLoading } = useListTemplates(
    activeCategory !== "all" ? { category: activeCategory } : undefined
  );
  
  const [, setLocation] = useLocation();
  const { addNotification } = useNotifications();

  const categories = ["all", "database", "filesystem", "api", "cloud", "utility"];

  const handleUseTemplate = (template: any) => {
    localStorage.setItem("mcp-template-input", template.content || template.description || "");
    addNotification({
      title: "Template loaded",
      message: `${template.name} loaded into the generator`,
      type: "info",
      link: "/generate"
    });
    setLocation("/generate");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="h-12 border-b flex items-center justify-between px-4 bg-background shrink-0">
        <div className="flex items-center gap-2">
          <Library className="w-4 h-4 text-muted-foreground" />
          <h1 className="font-medium text-sm font-display">Templates</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 font-display">Skill Templates</h2>
              <p className="text-muted-foreground text-sm">
                Pre-configured MCP server configs ready to generate.
              </p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                    activeCategory === cat 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : !templates || templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-card/30">
              <Search className="w-10 h-10 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No templates found</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                We couldn't find any templates for the selected category. Try selecting "all" to see everything available.
              </p>
              <Button 
                variant="outline" 
                className="mt-6 font-sans"
                onClick={() => setActiveCategory("all")}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="group relative flex flex-col p-5 bg-card border rounded-xl hover:border-primary/50 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="secondary" className="uppercase text-[9px] tracking-wider font-mono px-2 bg-primary/10 text-primary border-primary/20">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <FileCode className="w-3.5 h-3.5" />
                      Template
                    </div>
                    <Button variant="ghost" className="text-xs font-medium text-primary flex items-center hover:bg-primary/10 h-8 px-2" onClick={() => handleUseTemplate(template)}>
                      Use <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}