import { Link } from "wouter";
import { Layers, Terminal, Lock, Zap, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      <header className="h-16 flex items-center justify-between px-6 border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight">MCP Skill Generator</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="font-medium h-9 px-4">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-6 flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <Badge className="mb-6 font-mono text-[10px] tracking-widest uppercase py-1 px-3 bg-primary/10 text-primary border border-primary/20">
            Developer Preview
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mb-6 leading-[1.1]">
            From Config to Claude <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">in 3 seconds flat.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Convert verbose MCP server configurations into ultra-compact, precision-engineered SKILL.md files. Save tokens, preserve context window, and get Claude working with your tools instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-medium shadow-xl shadow-primary/20">
                Start Generating <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-medium bg-background">
              <Github className="w-4 h-4 mr-2" /> View Source
            </Button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 bg-card/30 border-y border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Precision Engineering for AI Tooling</h2>
              <p className="text-muted-foreground">Built by developers, for developers managing complex MCP integrations.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Terminal}
                title="Format Agnostic"
                description="Paste raw JSON, CLI commands, or mixed text. The engine automatically detects and parses your server config."
              />
              <FeatureCard 
                icon={Zap}
                title="Token Optimized"
                description="We strip out the boilerplate and prose, generating bulleted markdown that Claude digests natively without wasting your context window."
              />
              <FeatureCard 
                icon={Lock}
                title="Private & Secure"
                description="Your OpenAI keys stay in your browser. We never log your configs, and generated skills belong to you."
              />
            </div>
          </div>
        </section>

        {/* How it works Code visualization */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 pr-8">
              <h2 className="text-3xl font-bold tracking-tight leading-tight">Drop your config.<br/>Get the skill.</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most MCP configs are thousands of lines of boilerplate. Providing them directly to Claude eats context and confuses the model. Our generator acts as a compiler — reducing your config down to its functional essence.
              </p>
              <ul className="space-y-4">
                {[
                  "YAML frontmatter with tool names",
                  "Bulleted parameter requirements",
                  "Return shape schemas",
                  "Zero conversational filler"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                      <span className="text-[10px]">✓</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-border/50 bg-[#0d0d0f] shadow-2xl shadow-black/50">
              <div className="h-10 border-b border-white/10 flex items-center px-4 bg-[#1a1b20]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="mx-auto text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                  SKILL.md
                </div>
              </div>
              <div className="p-6 text-sm font-mono leading-relaxed text-indigo-200 opacity-90">
                <span className="text-slate-400">---</span><br/>
                <span className="text-emerald-400">name:</span> filesystem-mcp<br/>
                <span className="text-emerald-400">description:</span> Local filesystem operations<br/>
                <span className="text-slate-400">---</span><br/>
                <br/>
                <span className="text-slate-300">## Tools</span><br/>
                <br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">read_file</span>(path: string) {'→'} content: string<br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">write_file</span>(path: string, content: string)<br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">list_directory</span>(path: string) {'→'} [files]<br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">search_files</span>(pattern: string) {'→'} [paths]<br/>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 opacity-50" />
            <span>MCP Skill Generator. A tool for AI Engineers.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-medium ${className}`}>
      {children}
    </span>
  );
}
