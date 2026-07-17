import { useState, useEffect } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Settings as SettingsIcon, Copy, Download, Terminal, History, X, ChevronRight, CheckCircle2, AlertCircle, Play, FileJson, AlignLeft, Layers, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/custom";
import { CodeBlock } from "@/components/code-block";
import { generateSkillStream } from "@/lib/openai";
import { getApiKey, setApiKey as saveApiKey, getHistory, addHistoryItem, SkillHistoryItem } from "@/lib/storage";
import { detectFormat } from "@/lib/format-detector";
import { cn } from "@/lib/utils";
import { useCreateSkill, getListSkillsQueryKey, getGetSkillStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useNotifications } from "@/lib/notifications";
import { useLocation } from "wouter";

export default function GeneratorPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<SkillHistoryItem[]>([]);
  
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  
  const createSkill = useCreateSkill();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const [, setLocation] = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setApiKey(getApiKey());
    setHistory(getHistory());
    
    // Check if template was passed
    const templateInput = localStorage.getItem("mcp-template-input");
    if (templateInput) {
      setInput(templateInput);
      localStorage.removeItem("mcp-template-input");
    }
  }, []);

  const format = detectFormat(input);

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key in settings");
      addNotification({
        title: "API key required",
        message: "Add your OpenAI key in Settings",
        type: "warning",
        link: "/settings"
      });
      setLocation("/settings");
      return;
    }
    
    setIsGenerating(true);
    setOutput("");
    let fullOutput = "";
    
    try {
      const stream = generateSkillStream(apiKey, model, input);
      for await (const chunk of stream) {
        fullOutput += chunk;
        setOutput(fullOutput);
      }
      
      const updatedHistory = addHistoryItem(input, fullOutput);
      setHistory(updatedHistory);
      toast.success("Skill generated successfully");
      
      const tokenCount = Math.round(fullOutput.length / 4);
      addNotification({
        title: "SKILL.md ready",
        message: `Generation complete — ~${tokenCount} tokens`,
        type: "success"
      });
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SKILL.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveSkill = () => {
    if (!output) return;
    setIsSaveDialogOpen(true);
    setSkillName("");
    setSkillDesc("");
  };

  const submitSaveSkill = () => {
    if (!skillName.trim()) {
      toast.error("Name is required");
      return;
    }

    const tokenCount = Math.round(output.length / 4);

    createSkill.mutate({
      data: {
        name: skillName,
        description: skillDesc,
        content: output,
        inputSnippet: input.slice(0, 100),
        tokenCount
      }
    }, {
      onSuccess: () => {
        toast.success("Skill saved to library");
        setIsSaveDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSkillStatsQueryKey() });
        
        addNotification({
          title: "Skill saved",
          message: `${skillName} added to your library`,
          type: "success",
          link: "/my-skills"
        });
      },
      onError: (err) => {
        toast.error("Failed to save skill");
      }
    });
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-background px-3 py-3 md:px-6 md:py-6">
      <div className="flex flex-col h-full rounded-xl overflow-hidden border">
        <header className="h-12 flex items-center justify-between px-4 bg-background shrink-0 border-b">
          <h1 className="font-medium text-sm font-display">Generator</h1>
          <div className="flex items-center gap-2">
            {!apiKey && (
              <Badge variant="destructive" className="cursor-pointer" onClick={() => setLocation("/settings")}>
                API Key Required
              </Badge>
            )}
          </div>
        </header>

        <PanelGroup direction={isMobile ? "vertical" : "horizontal"} className="flex-1 overflow-hidden">
        {/* Left Panel: Input */}
        <Panel defaultSize={50} minSize={30} className="flex flex-col relative bg-card/30">
          <div className="h-10 border-b flex items-center px-4 justify-between bg-card shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">MCP Config</span>
            </div>
            {input.trim() && (
              <Badge variant="secondary" className="text-[10px] uppercase font-mono py-0 h-5">
                {format === "JSON" && <FileJson className="w-3 h-3 mr-1" />}
                {format === "Text" && <AlignLeft className="w-3 h-3 mr-1" />}
                {format === "Mixed" && <Layers className="w-3 h-3 mr-1" />}
                {format}
              </Badge>
            )}
          </div>
          <div className="flex-1 flex flex-col relative">
            <textarea
              className="absolute inset-0 p-4 bg-transparent resize-none outline-none font-mono text-[13px] leading-relaxed placeholder:text-muted-foreground/30 focus:ring-0"
              placeholder={'{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "/Users/username/Desktop"\n      ]\n    }\n  }\n}'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="p-3 border-t flex flex-wrap gap-2 justify-between items-center bg-background shrink-0">
            <div className="flex gap-2">
              <Button 
                variant={historyOpen ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setHistoryOpen(!historyOpen)} 
                title="History"
                className="h-8 px-2"
              >
                <History className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={!input.trim() || isGenerating}
              className="font-mono text-xs tracking-tight h-8 px-4 w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-2 fill-current" />
                  Generate Skill
                </>
              )}
            </Button>
          </div>
        </Panel>
        
        <PanelResizeHandle className="w-px bg-border hover:bg-primary/50 hover:w-[2px] active:bg-primary transition-all cursor-col-resize z-10" />
        
        {/* Right Panel: Output */}
        <Panel defaultSize={50} minSize={30} className="flex flex-col bg-[#0a0c10] dark:bg-[#0a0c10] relative text-slate-200">
          <div className="h-10 border-b flex items-center px-4 justify-between bg-card shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">SKILL.md</span>
            <div className="flex gap-1.5">
              {output && (
                <Button variant="ghost" size="sm" onClick={handleSaveSkill} className="h-6 px-2 text-xs text-primary hover:bg-primary/10">
                  <Save className="w-3 h-3 mr-1.5" /> Save to Library
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Copy className="w-3 h-3 mr-1.5" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadFile} disabled={!output} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Download className="w-3 h-3 mr-1.5" /> DL
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-transparent">
            {output ? (
              <CodeBlock code={output} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-mono flex-col gap-3 opacity-30 select-none">
                <Terminal className="w-10 h-10 mb-2 stroke-1" />
                <p>Waiting for generation...</p>
              </div>
            )}
          </div>
          {output && (
            <div className="h-8 border-t border-white/5 flex items-center px-4 bg-transparent text-[10px] font-mono text-muted-foreground justify-end shrink-0">
              <span className="opacity-50">~{Math.round(output.length / 4)} tokens</span>
            </div>
          )}
        </Panel>

        {historyOpen && (
          <>
            <PanelResizeHandle className="w-px bg-border hover:bg-primary/50 transition-all cursor-col-resize z-10" />
            <Panel defaultSize={20} minSize={15} maxSize={40} className="bg-card border-l flex flex-col">
              <div className="h-10 border-b flex items-center px-4 justify-between bg-background shrink-0">
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">History</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setHistoryOpen(false)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-2">
                {history.length === 0 ? (
                  <div className="text-[11px] font-mono text-muted-foreground text-center p-4 border border-dashed rounded-md bg-background/50">
                    No history yet
                  </div>
                ) : (
                  history.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => { 
                        setInput(item.fullInput || item.inputSnippet);
                        setOutput(item.output); 
                      }}
                      className="w-full text-left p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors flex flex-col gap-2 group text-sm"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-mono text-muted-foreground bg-card px-1.5 py-0.5 rounded">
                          {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <div className="text-[11px] font-mono text-foreground line-clamp-2 break-all opacity-80 leading-relaxed">
                        {item.inputSnippet}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-display">Save Skill to Library</DialogTitle>
            <DialogDescription className="font-sans">
              Name your generated skill to access it later in My Skills.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 font-sans">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                placeholder="e.g. Postgres DB MCP"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="e.g. Read-only queries for pg database"
                value={skillDesc}
                onChange={(e) => setSkillDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitSaveSkill} disabled={createSkill.isPending || !skillName.trim()}>
              {createSkill.isPending ? "Saving..." : "Save Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  );
}