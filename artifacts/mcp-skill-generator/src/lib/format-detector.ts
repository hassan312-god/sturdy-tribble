export function detectFormat(input: string): "JSON" | "Text" | "Mixed" {
  if (!input.trim()) return "Text";
  
  try {
    JSON.parse(input);
    return "JSON";
  } catch (e) {
    if (input.includes("{") && input.includes("}") && input.includes('":')) {
      return "Mixed";
    }
    return "Text";
  }
}