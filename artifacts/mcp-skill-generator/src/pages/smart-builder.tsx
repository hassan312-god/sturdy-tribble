/**
 * Smart Builder — generate SKILL.md without any AI.
 * Pure rule-based assembly from structured form inputs.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wand2, ChevronRight, ChevronLeft, Check,
  Copy, Download, Save, Plus, Trash2, Zap, Info
} from "lucide-react";
import { useCreateSkill } from "@workspace/api-client-react";
import { useNotifications } from "@/lib/notifications";

type Step = "info" | "capabilities" | "workflow" | "config" | "preview";

interface Tool {
  name: string;
  description: string;
  example?: string;
}

interface WorkflowStep {
  title: string;
  description: string;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  author: string;
  version: string;
  license: string;
  tools: Tool[];
  workflowSteps: WorkflowStep[];
  useCases: string[];
  envVars: Array<{ key: string; description: string; required: boolean }>;
  prerequisites: string;
  bestPractices: string[];
  outputFormat: string;
  edgeCases: string;
}

const CATEGORIES = [
  "code", "data", "devops", "security", "database",
  "design", "research", "productivity", "marketing", "writing", "api", "filesystem",
];

const STEPS: { id: Step; label: string }[] = [
  { id: "info", label: "Basic Info" },
  { id: "capabilities", label: "Tools" },
  { id: "workflow", label: "Workflow" },
  { id: "config", label: "Config" },
  { id: "preview", label: "Preview" },
];

function generateSkillMd(form: FormData): string {
  const lines: string[] = [];

  // Frontmatter
  lines.push("---");
  lines.push(`name: ${form.name || "My Skill"}`);
  lines.push(`description: "${form.description || ""}"`);
  if (form.license) lines.push(`license: ${form.license}`);
  lines.push("metadata:");
  if (form.author) lines.push(`  author: ${form.author}`);
  lines.push(`  version: ${form.version || "1.0.0"}`);
  lines.push("---");
  lines.push("");

  // Title
  lines.push(`# ${form.name || "My Skill"}`);
  lines.push("");

  // Description paragraph
  if (form.description) {
    lines.push(form.description);
    lines.push("");
  }

  // Prerequisites
  if (form.prerequisites) {
    lines.push("## Prerequisites");
    lines.push("");
    lines.push(form.prerequisites);
    lines.push("");
  }

  // Available Tools
  if (form.tools.length > 0) {
    lines.push("## Available Tools");
    lines.push("");
    for (const tool of form.tools) {
      if (!tool.name) continue;
      lines.push(`### \`${tool.name}\``);
      lines.push("");
      if (tool.description) {
        lines.push(tool.description);
        lines.push("");
      }
      if (tool.example) {
        lines.push("**Example:**");
        lines.push("```");
        lines.push(tool.example);
        lines.push("```");
        lines.push("");
      }
    }
  }

  // Workflow
  if (form.workflowSteps.length > 0) {
    lines.push("## Workflow");
    lines.push("");
    form.workflowSteps.forEach((step, i) => {
      if (!step.title) return;
      lines.push(`${i + 1}. **${step.title}**`);
      if (step.description) {
        lines.push(`   ${step.description}`);
      }
      lines.push("");
    });
  }

  // Use Cases
  if (form.useCases.filter(Boolean).length > 0) {
    lines.push("## Use Cases");
    lines.push("");
    lines.push("Activate this skill when the user asks to:");
    lines.push("");
    for (const uc of form.useCases) {
      if (!uc) continue;
      lines.push(`- ${uc}`);
    }
    lines.push("");
  }

  // Configuration
  if (form.envVars.filter((e) => e.key).length > 0) {
    lines.push("## Configuration");
    lines.push("");
    lines.push("| Variable | Description | Required |");
    lines.push("|----------|-------------|----------|");
    for (const env of form.envVars) {
      if (!env.key) continue;
      lines.push(`| \`${env.key}\` | ${env.description} | ${env.required ? "✓ Yes" : "Optional"} |`);
    }
    lines.push("");
  }

  // Output Format
  if (form.outputFormat) {
    lines.push("## Output Format");
    lines.push("");
    lines.push(form.outputFormat);
    lines.push("");
  }

  // Best Practices
  if (form.bestPractices.filter(Boolean).length > 0) {
    lines.push("## Best Practices");
    lines.push("");
    for (const bp of form.bestPractices) {
      if (!bp) continue;
      lines.push(`- ${bp}`);
    }
    lines.push("");
  }

  // Edge Cases
  if (form.edgeCases) {
    lines.push("## Edge Cases");
    lines.push("");
    lines.push(form.edgeCases);
    lines.push("");
  }

  return lines.join("\n");
}

export default function SmartBuilderPage() {
  const [step, setStep] = useState<Step>("info");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addNotification } = useNotifications();
  const createSkill = useCreateSkill();

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    category: "code",
    author: "",
    version: "1.0.0",
    license: "MIT",
    tools: [{ name: "", description: "", example: "" }],
    workflowSteps: [
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    useCases: ["", "", ""],
    envVars: [{ key: "", description: "", required: true }],
    prerequisites: "",
    bestPractices: ["", "", ""],
    outputFormat: "",
    edgeCases: "",
  });

  const generatedContent = generateSkillMd(form);
  const currentStepIdx = STEPS.findIndex((s) => s.id === step);

  const goNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setStep(STEPS[currentStepIdx + 1].id);
    }
  };
  const goPrev = () => {
    if (currentStepIdx > 0) {
      setStep(STEPS[currentStepIdx - 1].id);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.name.toLowerCase().replace(/\s+/g, "-") || "skill"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!form.name) {
      addNotification({ title: "Name required", message: "Please enter a skill name", type: "error" });
      return;
    }
    setSaving(true);
    try {
      await createSkill.mutateAsync({
        data: {
          name: form.name,
          description: form.description,
          content: generatedContent,
          tokenCount: generatedContent.split(/\s+/).length,
        },
      });
      addNotification({
        title: "Skill saved!",
        message: `${form.name} saved to My Skills`,
        type: "success",
        link: "/my-skills",
      });
    } catch {
      addNotification({ title: "Save failed", message: "Please try again", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addTool = () =>
    update("tools", [...form.tools, { name: "", description: "", example: "" }]);
  const removeTool = (i: number) =>
    update("tools", form.tools.filter((_, idx) => idx !== i));
  const updateTool = (i: number, field: keyof Tool, val: string) => {
    const tools = [...form.tools];
    tools[i] = { ...tools[i], [field]: val };
    update("tools", tools);
  };

  const addStep = () =>
    update("workflowSteps", [...form.workflowSteps, { title: "", description: "" }]);
  const removeStep = (i: number) =>
    update("workflowSteps", form.workflowSteps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: keyof WorkflowStep, val: string) => {
    const steps = [...form.workflowSteps];
    steps[i] = { ...steps[i], [field]: val };
    update("workflowSteps", steps);
  };

  const inputCls = "w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors font-sans";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b flex items-center justify-between px-4 bg-background shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h1 className="font-medium text-sm font-display">Smart Builder</h1>
          <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-mono">
            No AI needed
          </span>
        </div>

        {/* Step progress */}
        <div className="hidden md:flex items-center gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                s.id === step
                  ? "bg-primary text-primary-foreground font-medium"
                  : i < currentStepIdx
                  ? "text-green-400 hover:bg-green-500/10"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {i < currentStepIdx ? <Check className="w-3 h-3" /> : <span className="font-mono">{i + 1}</span>}
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto flex flex-col md:flex-row">
        {/* Form panel */}
        <div className="flex-1 overflow-auto border-r border-border">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Mobile step indicator */}
            <div className="md:hidden flex items-center gap-2 text-sm">
              <span className="font-medium">{STEPS[currentStepIdx].label}</span>
              <span className="text-muted-foreground">({currentStepIdx + 1}/{STEPS.length})</span>
            </div>

            {/* Step: Basic Info */}
            {step === "info" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold font-display mb-0.5">Skill Information</h2>
                  <p className="text-sm text-muted-foreground">Give your skill a clear name and purpose.</p>
                </div>

                <div>
                  <label className={labelCls}>Skill Name *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Database Query Optimizer"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelCls}>Description *</label>
                  <textarea
                    className={textareaCls}
                    rows={3}
                    placeholder="What does this skill do? When should it be used?"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Category</label>
                    <select
                      className={inputCls}
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>License</label>
                    <select
                      className={inputCls}
                      value={form.license}
                      onChange={(e) => update("license", e.target.value)}
                    >
                      {["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "CC-BY-4.0", "Proprietary"].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Author</label>
                    <input
                      className={inputCls}
                      placeholder="Your name or org"
                      value={form.author}
                      onChange={(e) => update("author", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Version</label>
                    <input
                      className={inputCls}
                      placeholder="1.0.0"
                      value={form.version}
                      onChange={(e) => update("version", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Prerequisites</label>
                  <textarea
                    className={textareaCls}
                    rows={2}
                    placeholder="e.g. Access to PostgreSQL database, Node.js 18+"
                    value={form.prerequisites}
                    onChange={(e) => update("prerequisites", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step: Capabilities / Tools */}
            {step === "capabilities" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold font-display mb-0.5">Available Tools</h2>
                  <p className="text-sm text-muted-foreground">List the MCP tools or capabilities this skill provides.</p>
                </div>

                {form.tools.map((tool, i) => (
                  <div key={i} className="p-4 border border-border/60 rounded-xl space-y-3 bg-card/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">Tool #{i + 1}</span>
                      {form.tools.length > 1 && (
                        <button onClick={() => removeTool(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Tool Name</label>
                      <input
                        className={inputCls}
                        placeholder="e.g. query_database"
                        value={tool.name}
                        onChange={(e) => updateTool(i, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <input
                        className={inputCls}
                        placeholder="What does this tool do?"
                        value={tool.description}
                        onChange={(e) => updateTool(i, "description", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Example Usage (optional)</label>
                      <textarea
                        className={textareaCls}
                        rows={2}
                        placeholder={'query_database({\n  sql: "SELECT * FROM users LIMIT 10"\n})'}
                        value={tool.example}
                        onChange={(e) => updateTool(i, "example", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={addTool} className="gap-1.5 font-sans">
                  <Plus className="w-3.5 h-3.5" /> Add Tool
                </Button>

                {/* Use Cases */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold mb-3">Use Cases</h3>
                  <p className="text-xs text-muted-foreground mb-3">When should this skill be activated?</p>
                  <div className="space-y-2">
                    {form.useCases.map((uc, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          className={inputCls}
                          placeholder={`e.g. "optimize a slow SQL query"`}
                          value={uc}
                          onChange={(e) => {
                            const cases = [...form.useCases];
                            cases[i] = e.target.value;
                            update("useCases", cases);
                          }}
                        />
                        {form.useCases.length > 1 && (
                          <button
                            onClick={() => update("useCases", form.useCases.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => update("useCases", [...form.useCases, ""])} className="gap-1.5 font-sans">
                      <Plus className="w-3.5 h-3.5" /> Add Use Case
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Workflow */}
            {step === "workflow" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold font-display mb-0.5">Workflow Steps</h2>
                  <p className="text-sm text-muted-foreground">Define the step-by-step process the agent should follow.</p>
                </div>

                {form.workflowSteps.map((s, i) => (
                  <div key={i} className="p-4 border border-border/60 rounded-xl space-y-3 bg-card/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Step {i + 1}
                      </span>
                      {form.workflowSteps.length > 1 && (
                        <button onClick={() => removeStep(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Step Title</label>
                      <input
                        className={inputCls}
                        placeholder="e.g. Analyze the query"
                        value={s.title}
                        onChange={(e) => updateStep(i, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Details</label>
                      <textarea
                        className={textareaCls}
                        rows={2}
                        placeholder="What exactly should the agent do in this step?"
                        value={s.description}
                        onChange={(e) => updateStep(i, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={addStep} className="gap-1.5 font-sans">
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </Button>
              </div>
            )}

            {/* Step: Config */}
            {step === "config" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold font-display mb-0.5">Configuration & Output</h2>
                  <p className="text-sm text-muted-foreground">Environment variables, output format, and best practices.</p>
                </div>

                {/* Env vars */}
                <div>
                  <label className={labelCls}>Environment Variables</label>
                  <div className="space-y-2">
                    {form.envVars.map((env, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <input
                          className={inputCls}
                          placeholder="VAR_NAME"
                          value={env.key}
                          onChange={(e) => {
                            const envs = [...form.envVars];
                            envs[i] = { ...envs[i], key: e.target.value };
                            update("envVars", envs);
                          }}
                        />
                        <input
                          className={inputCls}
                          placeholder="Description"
                          value={env.description}
                          onChange={(e) => {
                            const envs = [...form.envVars];
                            envs[i] = { ...envs[i], description: e.target.value };
                            update("envVars", envs);
                          }}
                        />
                        <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap pt-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={env.required}
                            onChange={(e) => {
                              const envs = [...form.envVars];
                              envs[i] = { ...envs[i], required: e.target.checked };
                              update("envVars", envs);
                            }}
                          />
                          Req
                        </label>
                        {form.envVars.length > 1 && (
                          <button
                            onClick={() => update("envVars", form.envVars.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-destructive pt-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => update("envVars", [...form.envVars, { key: "", description: "", required: false }])}
                      className="gap-1.5 font-sans"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Variable
                    </Button>
                  </div>
                </div>

                {/* Output format */}
                <div>
                  <label className={labelCls}>Output Format</label>
                  <textarea
                    className={textareaCls}
                    rows={3}
                    placeholder="Describe what the output looks like. e.g. A markdown report with sections for findings, recommendations, and a severity table."
                    value={form.outputFormat}
                    onChange={(e) => update("outputFormat", e.target.value)}
                  />
                </div>

                {/* Best practices */}
                <div>
                  <label className={labelCls}>Best Practices</label>
                  <div className="space-y-2">
                    {form.bestPractices.map((bp, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          className={inputCls}
                          placeholder={`Best practice #${i + 1}`}
                          value={bp}
                          onChange={(e) => {
                            const bps = [...form.bestPractices];
                            bps[i] = e.target.value;
                            update("bestPractices", bps);
                          }}
                        />
                        {form.bestPractices.length > 1 && (
                          <button
                            onClick={() => update("bestPractices", form.bestPractices.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => update("bestPractices", [...form.bestPractices, ""])}
                      className="gap-1.5 font-sans"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Practice
                    </Button>
                  </div>
                </div>

                {/* Edge cases */}
                <div>
                  <label className={labelCls}>Edge Cases (optional)</label>
                  <textarea
                    className={textareaCls}
                    rows={3}
                    placeholder="Describe known limitations or edge cases the agent should handle gracefully."
                    value={form.edgeCases}
                    onChange={(e) => update("edgeCases", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step: Preview — shown only on mobile, desktop shows live panel */}
            {step === "preview" && (
              <div className="space-y-4 md:hidden">
                <div>
                  <h2 className="text-lg font-bold font-display mb-0.5">Preview</h2>
                  <p className="text-sm text-muted-foreground">Your generated SKILL.md file.</p>
                </div>
                <pre className="text-xs font-mono bg-[#0d0f14] border border-border/50 rounded-xl p-4 overflow-auto max-h-96 text-[#e2e8f0] whitespace-pre-wrap">
                  {generatedContent}
                </pre>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={currentStepIdx === 0}
                className="gap-1.5 font-sans"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>

              <div className="flex gap-2">
                {currentStepIdx === STEPS.length - 1 ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 font-sans">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5 font-sans">
                      <Download className="w-3.5 h-3.5" /> Download
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 font-sans">
                      <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save Skill"}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={goNext} className="gap-1.5 font-sans">
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live preview panel (desktop) */}
        <div className="hidden md:flex flex-col w-[45%] xl:w-[40%]">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wand2 className="w-3.5 h-3.5" />
              <span className="font-mono">SKILL.md</span>
              <span>·</span>
              <span>{generatedContent.split("\n").length} lines</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-[#0d0f14]">
            <pre className="text-xs font-mono text-[#e2e8f0] p-4 whitespace-pre-wrap leading-relaxed">
              {generatedContent || (
                <span className="text-muted-foreground/50">
                  Fill in the form to generate your SKILL.md...
                </span>
              )}
            </pre>
          </div>

          {/* Tip box */}
          <div className="p-3 border-t border-border/50 bg-card/30 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              No AI required — your skill is assembled instantly from your inputs using proven SKILL.md patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
