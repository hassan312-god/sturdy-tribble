import { useState, useEffect } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Settings, Copy, Download, Terminal, History, X, ChevronRight, CheckCircle2, AlertCircle, Play, FileJson, AlignLeft, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Label, Badge } from "@/components/ui";
import { CodeBlock } from "@/components/code-block";
import { generateSkillStream } from "@/lib/openai";
import { getApiKey, setApiKey as saveApiKey, getHistory, addHistoryItem, SkillHistoryItem } from "@/lib/storage";
import { detectFormat } from "@/lib/format-detector";
import { cn } from "@/lib/utils";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<SkillHistoryItem[]>([]);
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    setApiKey(getApiKey());
    setHistory(getHistory());
  }, []);

  const format = detectFormat(input);

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key in settings");
      setSettingsOpen(true);
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

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      if (res.ok) {
        setTestResult({ success: true, message: "Connection successful" });
      } else {
        const err = await res.json().catch(() => ({}));
        setTestResult({ success: false, message: err.error?.message || "Invalid API key" });
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || "Network error" });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background text-foreground font-sans">
      <header className="h-12 border-b flex items-center justify-between px-4 bg-background shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center shadow-sm">
            <Layers className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight">MCP Skill Generator</span>
        </div>
        <div className="flex items-center gap-2">
          {!apiKey && (
            <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 cursor-pointer hover:bg-destructive/20" onClick={() => setSettingsOpen(true)}>
              API Key Required
            </Badge>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {/* Left Panel: Input */}
        <Panel defaultSize={50} minSize={30} className="flex flex-col relative bg-card/30">
          <div className="h-10 border-b flex items-center px-4 justify-between bg-card shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MCP Config</span>
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
              placeholder={`{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "/Users/username/Desktop"\n      ]\n    }\n  }\n}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="p-3 border-t flex justify-between items-center bg-background shrink-0">
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
              disabled={!input.trim() || !apiKey || isGenerating}
              className="font-mono text-xs tracking-tight h-8 px-4"
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
        <Panel defaultSize={50} minSize={30} className="flex flex-col bg-[#0d0d0f] relative">
          <div className="h-10 border-b flex items-center px-4 justify-between bg-card shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SKILL.md</span>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Copy className="w-3 h-3 mr-1.5" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadFile} disabled={!output} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Download className="w-3 h-3 mr-1.5" /> Save
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
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
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">History</span>
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

      {/* Settings Slide-over */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={() => setSettingsOpen(false)} />
          <div className="w-[340px] bg-card border-l h-full flex flex-col relative animate-in slide-in-from-right duration-200 shadow-2xl">
            <div className="h-12 border-b flex items-center px-4 justify-between bg-background">
              <span className="font-semibold text-sm">Settings</span>
              <button onClick={() => setSettingsOpen(false)} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-6">
              <div className="space-y-3">
                <Label className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">OpenAI API Key</Label>
                <Input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    saveApiKey(e.target.value);
                  }} 
                  placeholder="sk-..." 
                  className="font-mono text-sm h-10 bg-background"
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Keys are stored locally in your browser's localStorage and never sent anywhere except directly to OpenAI API.
                </p>
              </div>
              
              <div className="space-y-3">
                <Label className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Model</Label>
                <div className="relative">
                  <select 
                    value={model} 
                    onChange={(e) => setModel(e.target.value)}
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gpt-4o">gpt-4o</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button 
                  variant="secondary" 
                  className="w-full font-mono text-xs h-9 bg-background hover:bg-secondary"
                  onClick={testConnection}
                  disabled={!apiKey || isTesting}
                >
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
                {testResult && (
                  <div className={cn(
                    "mt-3 text-xs p-3 rounded-md border font-mono flex items-start gap-2", 
                    testResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-destructive/10 border-destructive/20 text-destructive-foreground"
                  )}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span className="leading-relaxed">{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}