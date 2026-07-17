export interface SkillHistoryItem {
  id: string;
  timestamp: number;
  inputSnippet: string;
  fullInput: string;
  output: string;
}

export function getApiKey(): string {
  if (typeof localStorage === 'undefined') return "";
  return localStorage.getItem("mcp_openai_key") || "";
}

export function setApiKey(key: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem("mcp_openai_key", key);
}

export function getHistory(): SkillHistoryItem[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem("mcp_skill_history");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistoryItem(input: string, output: string) {
  const history = getHistory();
  const newItem: SkillHistoryItem = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    inputSnippet: input.slice(0, 80) + (input.length > 80 ? "..." : ""),
    fullInput: input,
    output
  };
  const updated = [newItem, ...history].slice(0, 5); // keep last 5
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem("mcp_skill_history", JSON.stringify(updated));
  }
  return updated;
}