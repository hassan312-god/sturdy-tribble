import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetTemplate } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Copy, Check, ExternalLink, BookOpen,
  Tag, User, Calendar, ArrowRight, FileCode
} from "lucide-react";
import { useNotifications } from "@/lib/notifications";

export default function TemplateDetailPage() {
  const [, params] = useRoute("/templates/:id");
  const [, setLocation] = useLocation();
  const { addNotification } = useNotifications();
  const [copied, setCopied] = useState(false);

  const id = params?.id ? parseInt(params.id, 10) : undefined;
  const { data: template, isLoading, isError } = useGetTemplate(id!, {
    query: { enabled: !!id },
  });

  const categoryColors: Record<string, string> = {
    code: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    data: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    devops: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    security: "bg-red-500/10 text-red-400 border-red-500/20",
    database: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    research: "bg-green-500/10 text-green-400 border-green-500/20",
    productivity: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    marketing: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    writing: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  const handleCopy = async () => {
    if (!template) return;
    await navigator.clipboard.writeText(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addNotification({
      title: "Copied!",
      message: `${template.name} content copied to clipboard`,
      type: "success",
    });
  };

  const handleUseTemplate = () => {
    if (!template) return;
    localStorage.setItem("mcp-template-input", template.content);
    addNotification({
      title: "Template loaded",
      message: `${template.name} loaded into the generator`,
      type: "info",
      link: "/generate",
    });
    setLocation("/generate");
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <header className="h-12 border-b flex items-center px-4 bg-background shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/templates")} className="text-muted-foreground hover:text-foreground mr-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Templates
          </Button>
        </header>
        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            <div className="h-96 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="h-full flex flex-col bg-background">
        <header className="h-12 border-b flex items-center px-4 bg-background shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/templates")} className="text-muted-foreground hover:text-foreground mr-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Templates
          </Button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileCode className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Template not found</h3>
            <p className="text-muted-foreground text-sm mb-6">This template may have been removed.</p>
            <Button onClick={() => setLocation("/templates")}>Back to Templates</Button>
          </div>
        </div>
      </div>
    );
  }

  const catColor = categoryColors[template.category] ?? "bg-muted text-muted-foreground border-border";
  const createdDate = new Date(template.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // Parse markdown sections from the content for a nice display
  const lines = template.content.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# "));
  const displayTitle = titleLine ? titleLine.replace(/^#\s+/, "") : template.name;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b flex items-center justify-between px-4 bg-background shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/templates")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Templates
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 font-sans h-8" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" className="gap-1.5 font-sans h-8 bg-primary" onClick={handleUseTemplate}>
            Use Template <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 md:px-8">
          {/* Title + meta */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${catColor}`}>
                {template.category}
              </span>
              {template.tags?.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground border border-border/50">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold tracking-tight font-display mb-3">{displayTitle}</h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">{template.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {template.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {template.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {createdDate}
              </span>
              {template.sourceUrl && (
                <a
                  href={template.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Source
                </a>
              )}
            </div>
          </div>

          {/* Content card */}
          <div className="border rounded-xl overflow-hidden shadow-sm">
            {/* Content header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span className="font-mono text-xs">SKILL.md</span>
                <span className="text-xs">·</span>
                <span className="text-xs">{template.content.split("\n").length} lines</span>
                <span className="text-xs">·</span>
                <span className="text-xs">{(template.content.length / 1024).toFixed(1)} KB</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy raw"}
              </button>
            </div>

            {/* Markdown content */}
            <div className="overflow-auto max-h-[60vh] bg-card">
              <MarkdownPreview content={template.content} />
            </div>
          </div>

          {/* Use CTA */}
          <div className="mt-8 p-6 rounded-xl border bg-primary/5 border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Ready to use this skill?</h3>
              <p className="text-sm text-muted-foreground">Load it directly into the generator to customize and save it.</p>
            </div>
            <Button onClick={handleUseTemplate} className="shrink-0 gap-2 font-sans">
              Open in Generator <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown renderer with syntax highlighting for code blocks
function MarkdownPreview({ content }: { content: string }) {
  const rendered = renderMarkdown(content);
  return (
    <div
      className="prose prose-sm prose-invert max-w-none p-6 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:text-muted-foreground [&_ol]:space-y-1 [&_li]:leading-relaxed [&_code]:font-mono [&_code]:text-xs [&_code]:bg-muted/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary [&_pre]:bg-[#0d0f14] [&_pre]:border [&_pre]:border-border/50 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[#e2e8f0] [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_th]:pb-2 [&_th]:border-b [&_th]:border-border [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-border/30 [&_td]:text-muted-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_strong]:text-foreground [&_strong]:font-semibold [&_hr]:border-border [&_hr]:my-6"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

function renderMarkdown(md: string): string {
  // Strip YAML frontmatter
  const noFrontmatter = md.replace(/^---[\s\S]*?---\n?/, "");

  let html = noFrontmatter
    // Code blocks with language
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
    })
    // H1
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // H2
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    // H3
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr>")
    // Tables
    .replace(/\|(.+)\|/g, (line) => {
      if (line.match(/^\|[\s\-|]+\|$/)) return ""; // separator
      const cells = line.split("|").filter((_, i, arr) => i > 0 && i < arr.length - 1);
      const isHeader = false; // simplified
      const tag = "td";
      return `<tr>${cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("")}</tr>`;
    })
    // Wrap table rows
    .replace(/((<tr>.*<\/tr>\n?)+)/gs, "<table>$1</table>")
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Bullet lists
    .replace(/^[\*\-] (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> in <ul>
    .replace(/((<li>.*<\/li>\n?)+)/gs, "<ul>$1</ul>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Paragraphs: blank-line separated text blocks not starting with HTML tags
    .replace(/^(?!<)(.+)$/gm, "<p>$1</p>")
    // Clean up double-wrapped paragraphs inside list items, table cells
    .replace(/<(li|td|th)><p>(.*?)<\/p><\/(li|td|th)>/g, "<$1>$2</$3>")
    // Remove empty paragraphs
    .replace(/<p>\s*<\/p>/g, "");

  return html;
}
