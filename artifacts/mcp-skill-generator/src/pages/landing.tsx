import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layers, Terminal, Lock, Zap, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col selection:bg-indigo-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* SECTION 1 — Navbar */}
      <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors sticky top-0 z-50 ${scrolled ? 'bg-white/90 backdrop-blur-md border-gray-100' : 'bg-transparent border-transparent'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>MCP Skill Generator</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Templates</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="font-medium h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-200">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* SECTION 2 — Hero */}
        <section className="bg-gradient-to-b from-indigo-50/60 via-white to-white py-20 md:py-32 px-6 relative overflow-hidden md:overflow-visible">
          <div className="relative max-w-6xl mx-auto">
            
            {/* Center Content */}
            <div className="max-w-2xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center justify-center rounded-full font-mono text-xs font-semibold uppercase tracking-wide py-1 px-3 bg-indigo-100 text-indigo-700 mb-6">
                Welcome to MCP Skill Generator
              </div>
              
              <h1 className="text-4xl md:text-[52px] font-bold tracking-tight mb-6 leading-[1.1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Turn Any MCP Config <br className="hidden md:inline" />
                <span className="text-indigo-600">Into a Ready-to-Use Skill</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto">
                Stop wasting context window on verbose server configs. Generate precision-engineered SKILL.md files Claude understands natively — in seconds.
              </p>
              
              <div className="flex flex-col items-center gap-3 w-full justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 rounded-xl">
                    Start for Free <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <span className="text-xs text-gray-400 font-medium">No credit card required</span>
              </div>
            </div>

            {/* Floating UI Cards (hidden on mobile) */}
            <div className="hidden md:block absolute -left-8 top-1/3 rotate-[-6deg] z-0 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="bg-white shadow-xl rounded-xl p-4 w-48 border border-gray-100">
                <div className="text-xs text-gray-500 font-medium mb-1">Skills Generated</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">2,847</div>
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  +12% this week
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-4 top-1/4 rotate-[4deg] z-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              <div className="bg-[#1a1b20] shadow-xl rounded-xl p-3 w-52 border border-gray-800 font-mono text-[10px] text-gray-300 leading-relaxed">
                <span className="text-slate-500">---</span><br/>
                <span className="text-emerald-400">name:</span> filesystem<br/>
                <span className="text-emerald-400">description:</span> Local files<br/>
                <span className="text-slate-500">---</span><br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">read_file</span>(path)<br/>
              </div>
            </div>

            <div className="hidden md:block absolute right-8 bottom-1/4 rotate-[-3deg] z-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <div className="bg-white shadow-xl rounded-xl p-4 w-44 border border-gray-100">
                <div className="text-xs text-gray-500 font-medium mb-3">8 Templates</div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-50 rounded border border-gray-100 flex items-center px-2 text-[10px] font-semibold text-gray-600">Filesystem</div>
                  <div className="h-6 bg-gray-50 rounded border border-gray-100 flex items-center px-2 text-[10px] font-semibold text-gray-600">GitHub API</div>
                  <div className="h-6 bg-gray-50 rounded border border-gray-100 flex items-center px-2 text-[10px] font-semibold text-gray-600">Slack</div>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* SECTION 3 — Trust strip */}
        <section className="py-12 border-y border-gray-100 bg-gray-50/50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-400 font-medium mb-8">Trusted by engineers at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {['Anthropic', 'Vercel', 'Linear', 'Stripe', 'GitHub', 'Notion'].map((brand) => (
                <div key={brand} className="flex items-center gap-2 text-gray-300 font-bold text-lg grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — Features */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center rounded-full font-mono text-xs font-semibold uppercase tracking-wide py-1 px-3 bg-indigo-100 text-indigo-700 mb-6">
                Our Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Everything you need for <br />
                <span className="text-indigo-600">precision MCP skills</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Built by developers, for developers managing complex MCP integrations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="h-40 bg-[#1a1b20] rounded-xl mb-6 flex flex-col p-4 border border-gray-800 overflow-hidden shadow-inner">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="font-mono text-xs text-indigo-300 opacity-80">
                    <span className="text-gray-500">{"{"}</span><br/>
                    &nbsp;&nbsp;<span className="text-indigo-300">"mcpServers"</span>: <span className="text-gray-500">{"{"}</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-indigo-300">"postgres"</span>: <span className="text-emerald-300">"..."</span><br/>
                    &nbsp;&nbsp;<span className="text-gray-500">{"}"}</span><br/>
                    <span className="text-gray-500">{"}"}</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Format Detection</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  JSON, YAML, CLI, or mixed text — auto-detected and parsed instantly.
                </p>
              </div>

              {/* Card 2 (Highlighted) */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl shadow-indigo-600/20 text-white md:-translate-y-4">
                <div className="h-40 bg-white/10 backdrop-blur-sm rounded-xl mb-6 flex flex-col justify-center items-center p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-indigo-200 text-xs font-mono mb-1">Before</div>
                    <div className="text-2xl font-bold mb-4 opacity-50 line-through">4,250 tokens</div>
                    <div className="text-indigo-200 text-xs font-mono mb-1">After</div>
                    <div className="text-3xl font-bold text-white">840 tokens</div>
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2">Token Optimizer</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Strips boilerplate and compresses your config into its functional essence.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="h-40 bg-white rounded-xl mb-6 flex flex-col p-4 border border-gray-200 shadow-sm overflow-hidden">
                  <div className="space-y-2 mt-2">
                    <div className="h-8 bg-gray-50 rounded flex items-center px-3 gap-2">
                      <div className="w-4 h-4 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Layers className="w-2.5 h-2.5" />
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-8 bg-gray-50 rounded flex items-center px-3 gap-2">
                      <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Layers className="w-2.5 h-2.5" />
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-8 bg-gray-50 rounded flex items-center px-3 gap-2">
                      <div className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Layers className="w-2.5 h-2.5" />
                      </div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Skill Library</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Save, organize, and reuse your generated skills across projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — How it Works */}
        <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 to-violet-50/30">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 pr-8">
              <div>
                <div className="inline-flex items-center justify-center rounded-full font-mono text-xs font-semibold uppercase tracking-wide py-1 px-3 bg-indigo-200/50 text-indigo-700 mb-6">
                  Our Process
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4 text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Drop config. Get skill. Ship faster.
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Our generator acts as a compiler — reducing your bloated config down to its functional essence for Claude.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-sm">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Paste your MCP server config</h4>
                    <p className="text-sm text-gray-500">Any format works — JSON, YAML, CLI, or mixed text.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-sm">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">AI compresses it</h4>
                    <p className="text-sm text-gray-500">Extracts essential tools and parameters, stripping boilerplate.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Copy SKILL.md into Claude</h4>
                    <p className="text-sm text-gray-500">Use instantly or save to your library for later.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-[#0d0d0f] shadow-2xl shadow-indigo-900/20">
              <div className="h-12 border-b border-white/10 flex items-center px-4 bg-[#1a1b20]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="mx-auto text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                  SKILL.md
                </div>
              </div>
              <div className="p-6 text-sm font-mono leading-relaxed text-indigo-200 opacity-90 overflow-x-auto">
                <span className="text-slate-500">---</span><br/>
                <span className="text-emerald-400">name:</span> filesystem-mcp<br/>
                <span className="text-emerald-400">description:</span> Local filesystem operations<br/>
                <span className="text-slate-500">---</span><br/>
                <br/>
                <span className="text-slate-400 font-bold">## Tools</span><br/>
                <br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">read_file</span>(path: string) {'→'} content: string<br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">write_file</span>(path: string, content: string)<br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">list_directory</span>(path: string) {'→'} [files]<br/>
                <span className="text-indigo-400">-</span> <span className="text-white font-bold">search_files</span>(pattern: string) {'→'} [paths]<br/>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — CTA Banner */}
        <section className="py-20 px-6 bg-indigo-600 text-white rounded-3xl mx-6 mb-12 shadow-2xl shadow-indigo-600/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Ready to stop wasting context?</h2>
            <p className="text-indigo-100 text-lg mb-8">
              Join engineers who generate precise SKILL.md files in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-white text-indigo-600 hover:bg-gray-50 rounded-xl">
                  Start for Free
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-bold border-white/30 text-white hover:bg-white/10 rounded-xl bg-transparent">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 7 — Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 opacity-50" />
            <span className="font-medium">MCP Skill Generator. A tool for AI Engineers.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}