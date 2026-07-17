import React from 'react';

// Basic CodeBlock component as it's missing in imports
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="p-4 m-0 overflow-auto font-mono text-sm leading-relaxed text-slate-200">
      <code>{code}</code>
    </pre>
  );
}
