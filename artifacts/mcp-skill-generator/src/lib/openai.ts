const SYSTEM_PROMPT = `You are an expert at writing concise Claude skill files (SKILL.md). Given an MCP (Model Context Protocol) server configuration, generate a compact SKILL.md that:
- Has a YAML frontmatter with name and description
- Lists only the essential tools/capabilities (no padding)
- Uses ultra-compact syntax: bullet points only, no prose
- Skips obvious information Claude already knows
- Uses abbreviations where clear
- Groups related tools together
- Prioritizes: what the tool does, required params, return shape
- Target: under 200 lines total, under 2000 tokens
- Format: valid Markdown, code blocks for examples only when critical
Output ONLY the SKILL.md content, no explanation.`;

export async function* generateSkillStream(apiKey: string, model: string, input: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input }
      ],
      stream: true,
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Error: ${res.status} ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");
  
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const str = trimmed.slice(6);
        if (str === "[DONE]") continue;
        try {
          const data = JSON.parse(str);
          const content = data.choices[0]?.delta?.content;
          if (content) yield content;
        } catch (e) {
          // Ignore parsing errors for incomplete chunks
        }
      }
    }
  }
}