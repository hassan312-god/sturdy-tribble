import { useMemo } from "react";
import { cn } from "@/lib/utils";

function HighlightedLine({ line }: { line: string }) {
  if (line.startsWith('#')) return <span className="text-blue-400 font-bold">{line}</span>;
  if (line.match(/^(\s*)-\s/)) {
    const match = line.match(/^(\s*-\s)(.*)$/);
    if (match) {
      return (
        <>
          <span className="text-accent-foreground opacity-70">{match[1]}</span>
          <HighlightedInline text={match[2]} />
        </>
      );
    }
  }
  if (line.startsWith('```') || line === '---') return <span className="text-muted-foreground">{line}</span>;
  if (line.match(/^[A-Za-z_-]+:/)) {
    const parts = line.split(/(:)(.*)/);
    return (
      <>
        <span className="text-emerald-400">{parts[0]}</span>
        <span className="text-muted-foreground">{parts[1]}</span>
        <HighlightedInline text={parts[2] || ""} />
      </>
    );
  }
  
  return <HighlightedInline text={line} />;
}

function HighlightedInline({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <span key={i} className="text-amber-300 bg-amber-400/10 px-1 rounded mx-0.5">{part}</span>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="font-bold text-foreground">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const lines = useMemo(() => code.split('\n'), [code]);
  
  return (
    <div className={cn("font-mono text-[13px] leading-relaxed py-4", className)}>
      {lines.map((line, i) => (
        <div key={i} className="flex hover:bg-white/5 group">
          <span className="text-muted-foreground w-12 shrink-0 text-right pr-4 select-none opacity-40 group-hover:opacity-70 transition-opacity">
            {i + 1}
          </span>
          <span className="text-foreground whitespace-pre-wrap break-all flex-1">
            {line ? <HighlightedLine line={line} /> : " "}
          </span>
        </div>
      ))}
    </div>
  );
}