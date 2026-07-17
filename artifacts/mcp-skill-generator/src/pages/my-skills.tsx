import { useState } from "react";
import { useListSkills, useGetSkillStats, useDeleteSkill, getListSkillsQueryKey, getGetSkillStatsQueryKey } from "@workspace/api-client-react";
import { Badge, Skeleton } from "@/components/ui/custom";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Layers, Search, Trash2, Code2, Copy, FileText, ChevronRight, Check } from "lucide-react";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CodeBlock } from "@/components/code-block";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function MySkillsPage() {
  const { data: skills, isLoading: isLoadingSkills } = useListSkills();
  const { data: stats, isLoading: isLoadingStats } = useGetSkillStats();
  const deleteSkill = useDeleteSkill();
  const queryClient = useQueryClient();

  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const copySkill = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this skill?")) return;
    
    deleteSkill.mutate({ id }, {
      onSuccess: () => {
        toast.success("Skill deleted");
        queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSkillStatsQueryKey() });
        if (selectedSkill?.id === id) {
          setSelectedSkill(null);
        }
      },
      onError: () => toast.error("Failed to delete skill")
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="h-12 border-b flex items-center justify-between px-4 bg-background shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h1 className="font-medium text-sm">My Skills</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                {isLoadingStats ? <Skeleton className="h-8 w-16 mt-1" /> : (
                  <h3 className="text-2xl font-bold">{stats?.totalSkills || 0}</h3>
                )}
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recently Generated</p>
                {isLoadingStats ? <Skeleton className="h-8 w-16 mt-1" /> : (
                  <h3 className="text-2xl font-bold">{stats?.recentCount || 0}</h3>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight mb-4">Saved Library</h2>
            
            {isLoadingSkills ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-xl p-4 flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !skills || skills.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-card/30">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Layers className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Your library is empty</h3>
                <p className="text-muted-foreground text-sm max-w-md mb-6">
                  You haven't saved any skills yet. Go to the generator to create and save your first MCP skill.
                </p>
                <Link href="/dashboard">
                  <Button>Go to Generator</Button>
                </Link>
              </div>
            ) : (
              <div className="bg-card border rounded-xl overflow-hidden divide-y">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="flex items-center p-4 hover:bg-secondary/50 cursor-pointer transition-colors group"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-4">
                      <FileText className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-semibold text-sm truncate">{skill.name}</h3>
                      {skill.description ? (
                        <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground truncate font-mono opacity-50">No description provided</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      {skill.tokenCount && (
                        <Badge variant="secondary" className="font-mono hidden sm:inline-flex bg-background border-border">
                          ~{skill.tokenCount} tkns
                        </Badge>
                      )}
                      <span className="text-muted-foreground hidden sm:inline-block">
                        {format(new Date(skill.createdAt), "MMM d, yyyy")}
                      </span>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                        onClick={(e) => handleDelete(skill.id, e)}
                        title="Delete skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={!!selectedSkill} onOpenChange={(open) => !open && setSelectedSkill(null)}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0 bg-background border-l">
          {selectedSkill && (
            <>
              <SheetHeader className="p-6 pb-4 border-b shrink-0 bg-card/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <SheetTitle className="text-xl mb-1">{selectedSkill.name}</SheetTitle>
                    <SheetDescription>
                      {selectedSkill.description || "Saved skill configuration"}
                    </SheetDescription>
                  </div>
                  <Button 
                    onClick={() => copySkill(selectedSkill.content)} 
                    variant="outline" 
                    size="sm"
                    className="shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied" : "Copy Content"}
                  </Button>
                </div>
                
                <div className="flex items-center gap-3 mt-4 text-xs font-mono text-muted-foreground">
                  <span className="bg-secondary px-2 py-1 rounded-md">ID: {selectedSkill.id}</span>
                  <span>{format(new Date(selectedSkill.createdAt), "MMM d, yyyy HH:mm")}</span>
                  {selectedSkill.tokenCount && (
                    <span>~{selectedSkill.tokenCount} tokens</span>
                  )}
                </div>
              </SheetHeader>
              
              <div className="flex-1 overflow-auto bg-[#0a0c10] dark:bg-[#0a0c10]">
                <CodeBlock code={selectedSkill.content} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
