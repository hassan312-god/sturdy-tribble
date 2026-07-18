import { useState } from "react";
import { useListTemplates } from "@workspace/api-client-react";
import { Badge, Skeleton } from "@/components/ui/custom";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { FileCode, ArrowRight, Library, Search, User, ExternalLink, Tag } from "lucide-react";
import { useNotifications } from "@/lib/notifications";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  all:          { label: "All",          color: "" },
  code:         { label: "Code",         color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  data:         { label: "Data",         color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  devops:       { label: "DevOps",       color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  security:     { label: "Security",     color: "bg-red-500/10 text-red-400 border-red-500/20" },
  database:     { label: "Database",     color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  design:       { label: "Design",       color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  research:     { label: "Research",     color: "bg-green-500/10 text-green-400 border-green-500/20" },
  productivity: { label: "Productivity", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  marketing:    { label: "Marketing",    color: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  writing:      { label: "Writing",      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  api:          { label: "API",          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  filesystem:   { label: "Filesystem",   color: "bg-stone-500/10 text-stone-400 border-stone-500/20" },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: templates, isLoading } = useListTemplates(
    activeCategory !== "all" ? { category: activeCategory } : undefined
  );

  const [, setLocation] = useLocation();
  const { addNotification } = useNotifications();

  const handleUseTemplate = (template: any, e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem("mcp-template-input", template.content || template.description || "");
    addNotification({
      title: "Template loaded",
      message: `${template.name} loaded into the generator`,
      type: "info",
      link: "/generate",
    });
    setLocation("/generate");
  };

  const handleViewDetail = (id: number) => {
    setLocation(`/templates/${id}`);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="h-12 border-b flex items-center justify-between px-4 bg-background shrink-0">
        <div className="flex items-center gap-2">
          <Library className="w-4 h-4 text-muted-foreground" />
          <h1 className="font-medium text-sm font-display">Templates</h1>
          {templates && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
              {templates.length}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 font-display">Skill Templates</h2>
              <p className="text-muted-foreground text-sm">
                Real skills from open-source repos — browse, preview, and use them instantly.
              </p>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const conf = CATEGORY_CONFIG[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors whitespace-nowrap border ${
                    isActive
                      ? cat === "all"
                        ? "bg-primary text-primary-foreground border-primary"
                        : conf.color + " border-current"
                      : "bg-transparent border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {conf.label}
                </button>
              );
            })}
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
                No templates for this category yet. Try "All" to see everything.
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
              {templates.map((template) => {
                const catConf = CATEGORY_CONFIG[template.category] ?? { label: template.category, color: "bg-muted text-muted-foreground border-border" };
                return (
                  <div
                    key={template.id}
                    className="group relative flex flex-col p-5 bg-card border rounded-xl hover:border-primary/40 transition-all shadow-sm cursor-pointer"
                    onClick={() => handleViewDetail(template.id)}
                  >
                    {/* Category + tags row */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border capitalize ${catConf.color}`}>
                        {catConf.label}
                      </span>
                      {(template as any).tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] bg-secondary text-secondary-foreground border border-border/50">
                          <Tag className="w-2.5 h-2.5" /> {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{template.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{template.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        {(template as any).author && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <User className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[100px]">{(template as any).author}</span>
                          </span>
                        )}
                        {!(template as any).author && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                            <FileCode className="w-2.5 h-2.5" /> SKILL.md
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {(template as any).sourceUrl && (
                          <a
                            href={(template as any).sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          className="text-xs font-medium text-primary flex items-center hover:bg-primary/10 h-7 px-2"
                          onClick={(e) => handleUseTemplate(template, e)}
                        >
                          Use <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
