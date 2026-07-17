import { useGetSkillStats, useListSkills, useListTemplates } from "@workspace/api-client-react";
import { BookOpen, Zap, Gauge, LayoutTemplate, Wand2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton, Badge } from "@/components/ui/custom";
import { Link, useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: isLoadingStats } = useGetSkillStats();
  const { data: skills, isLoading: isLoadingSkills } = useListSkills();
  const { data: templates, isLoading: isLoadingTemplates } = useListTemplates();

  const recentSkills = skills?.slice(0, 5) || [];
  const popularTemplates = templates?.slice(0, 4) || [];

  const handleUseTemplate = (template: any) => {
    localStorage.setItem("mcp-template-input", template.content || template.description || "");
    setLocation("/generate");
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        <header>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 font-display">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.firstName || 'Developer'}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your MCP skills.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Skills" 
            value={stats?.totalSkills ?? 0} 
            icon={BookOpen} 
            isLoading={isLoadingStats} 
            color="text-indigo-500" 
            bgColor="bg-indigo-500/10" 
          />
          <StatCard 
            title="Generated This Week" 
            value={stats?.recentCount ?? 0} 
            icon={Zap} 
            isLoading={isLoadingStats} 
            color="text-emerald-500" 
            bgColor="bg-emerald-500/10" 
          />
          <StatCard 
            title="Tokens Saved" 
            value={`~${((stats?.totalSkills || 0) * 850).toLocaleString()}`} 
            icon={Gauge} 
            isLoading={isLoadingStats} 
            color="text-amber-500" 
            bgColor="bg-amber-500/10" 
          />
          <StatCard 
            title="Templates Available" 
            value={templates?.length ?? 0} 
            icon={LayoutTemplate} 
            isLoading={isLoadingTemplates} 
            color="text-blue-500" 
            bgColor="bg-blue-500/10" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Skills (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display tracking-tight">Recent Skills</h2>
              <Link href="/my-skills" className="text-sm font-medium text-primary hover:underline flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              {isLoadingSkills ? (
                <div className="divide-y">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2"><Skeleton className="w-32 h-4" /><Skeleton className="w-24 h-3" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentSkills.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">No skills yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Generate your first MCP skill to see it here.</p>
                  <Button onClick={() => setLocation("/generate")}>Generate Skill</Button>
                </div>
              ) : (
                <div className="divide-y">
                  {recentSkills.map(skill => (
                    <div key={skill.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{skill.name}</h4>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            {format(new Date(skill.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {skill.tokenCount && (
                          <Badge variant="secondary" className="font-mono text-[10px] hidden sm:inline-flex">
                            ~{skill.tokenCount} tkns
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setLocation("/my-skills")}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions (1/3 width) */}
          <div className="space-y-4 min-w-0">
            <h2 className="text-xl font-bold font-display tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Button className="w-full justify-start h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-sans" onClick={() => setLocation("/generate")}>
                <Wand2 className="w-5 h-5 mr-3" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">New Skill</span>
                  <span className="text-[10px] opacity-80 font-normal">Generate from config</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-14 bg-card font-sans shadow-sm" onClick={() => setLocation("/templates")}>
                <LayoutTemplate className="w-5 h-5 mr-3 text-muted-foreground" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Browse Templates</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Use pre-made server configs</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-14 bg-card font-sans shadow-sm" onClick={() => setLocation("/my-skills")}>
                <BookOpen className="w-5 h-5 mr-3 text-muted-foreground" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">View All Skills</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Manage your generated skills</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

          {/* Popular Templates */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display tracking-tight">Popular Templates</h2>
            <Link href="/templates" className="text-sm font-medium text-primary hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {isLoadingTemplates ? (
              [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)
            ) : popularTemplates.map(template => (
              <div key={template.id} className="bg-card border rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-sm line-clamp-1" title={template.name}>{template.name}</h3>
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-mono">
                    {template.category}
                  </Badge>
                </div>
                <div className="flex-1" />
                <Button size="sm" variant="secondary" className="w-full mt-4 font-sans text-xs" onClick={() => handleUseTemplate(template)}>
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, isLoading, color, bgColor }: { title: string, value: string | number, icon: any, isLoading: boolean, color: string, bgColor: string }) {
  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bgColor} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <div className="text-3xl font-bold font-display tracking-tight">{value}</div>
      )}
    </div>
  );
}