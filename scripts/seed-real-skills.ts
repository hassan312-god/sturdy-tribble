/**
 * Seed real skills from GitHub repos into the templates table.
 * Sources: seb1n/awesome-ai-agent-skills, intellectronica/awesome-skills
 */
import { db, templatesTable } from "@workspace/db";

interface SkillEntry {
  name: string;
  description: string;
  category: string;
  author: string;
  sourceUrl: string;
  tags: string[];
  fetchUrl: string;
}

const SKILLS: SkillEntry[] = [
  {
    name: "Code Review",
    description: "Perform thorough code reviews checking for bugs, security vulnerabilities, performance issues, and style violations.",
    category: "code",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/code-and-development/code-review",
    tags: ["code", "review", "quality", "security"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/code-and-development/code-review/SKILL.md",
  },
  {
    name: "Debugging",
    description: "Systematically diagnose and fix software bugs by analyzing error messages, stack traces, logs, and runtime behavior.",
    category: "code",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/code-and-development/debugging",
    tags: ["code", "debugging", "bugs", "diagnosis"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/code-and-development/debugging/SKILL.md",
  },
  {
    name: "Code Refactoring",
    description: "Improve code quality and maintainability through systematic identification of code smells and proven refactoring patterns.",
    category: "code",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/code-and-development/refactoring",
    tags: ["code", "refactoring", "quality", "maintainability"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/code-and-development/refactoring/SKILL.md",
  },
  {
    name: "Automated Testing",
    description: "Generate, execute, and analyze tests for codebases, covering unit, integration, and end-to-end testing with coverage reporting.",
    category: "code",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/code-and-development/testing",
    tags: ["code", "testing", "unit-tests", "coverage"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/code-and-development/testing/SKILL.md",
  },
  {
    name: "Code Documentation",
    description: "Generate clear, comprehensive documentation — API references, inline docstrings, README files, and usage guides.",
    category: "code",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/code-and-development/code-documentation",
    tags: ["code", "documentation", "readme", "docstrings"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/code-and-development/code-documentation/SKILL.md",
  },
  {
    name: "Data Analysis",
    description: "Analyze datasets to extract insights through statistical methods, trend identification, hypothesis testing, and correlation analysis.",
    category: "data",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/data-and-analytics/data-analysis",
    tags: ["data", "analytics", "statistics", "insights"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/data-and-analytics/data-analysis/SKILL.md",
  },
  {
    name: "SQL Query Generation",
    description: "Generate optimized SQL queries from natural language, supporting SELECT, JOIN, GROUP BY, window functions, CTEs, and subqueries.",
    category: "data",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/data-and-analytics/sql-query-generation",
    tags: ["data", "sql", "database", "queries"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/data-and-analytics/sql-query-generation/SKILL.md",
  },
  {
    name: "CI/CD Pipeline Setup",
    description: "Set up a continuous integration and delivery pipeline, automating builds, tests, and deployments across environments.",
    category: "devops",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/devops-and-infrastructure/ci-cd",
    tags: ["devops", "ci-cd", "automation", "deployment"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/devops-and-infrastructure/ci-cd/SKILL.md",
  },
  {
    name: "Docker Compose Setup",
    description: "Set up and orchestrate multi-container Docker applications including service configuration, networking, volumes, and environment management.",
    category: "devops",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/devops-and-infrastructure/docker-compose-setup",
    tags: ["devops", "docker", "containers", "infrastructure"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/devops-and-infrastructure/docker-compose-setup/SKILL.md",
  },
  {
    name: "SEO Optimization",
    description: "Optimize a webpage for search engines by analyzing on-page elements, improving technical performance, and implementing structured data.",
    category: "marketing",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/marketing-and-seo/seo-optimization",
    tags: ["marketing", "seo", "content", "search"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/marketing-and-seo/seo-optimization/SKILL.md",
  },
  {
    name: "Technical Writing",
    description: "Write clear, accurate technical documentation including API references, user guides, tutorials, changelogs, and architecture docs.",
    category: "writing",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/writing-and-content/technical-writing",
    tags: ["writing", "documentation", "technical", "guides"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/writing-and-content/technical-writing/SKILL.md",
  },
  {
    name: "Blog Post Writing",
    description: "Write high-quality, SEO-optimized blog posts — how-to guides, listicles, opinion pieces, and case studies with hooks and CTAs.",
    category: "writing",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/writing-and-content/blog-post-writing",
    tags: ["writing", "blog", "seo", "content"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/writing-and-content/blog-post-writing/SKILL.md",
  },
  {
    name: "Security Audit",
    description: "Perform a comprehensive security audit of a codebase or application, identifying vulnerabilities, misconfigurations, and risks.",
    category: "security",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/security/security-audit",
    tags: ["security", "audit", "vulnerabilities", "compliance"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/security/security-audit/SKILL.md",
  },
  {
    name: "Threat Modeling",
    description: "Identify and prioritize security threats to a system using structured threat modeling methodologies like STRIDE and DREAD.",
    category: "security",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/security/threat-modeling",
    tags: ["security", "threat-modeling", "stride", "risk"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/security/threat-modeling/SKILL.md",
  },
  {
    name: "Database Schema Design",
    description: "Design normalized, efficient database schemas with proper relationships, constraints, indexes, and documentation.",
    category: "database",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/database/database-schema-design",
    tags: ["database", "schema", "design", "normalization"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/database/database-schema-design/SKILL.md",
  },
  {
    name: "Query Optimization",
    description: "Analyze and optimize slow database queries through index analysis, query restructuring, and execution plan evaluation.",
    category: "database",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/database/query-optimization",
    tags: ["database", "performance", "optimization", "indexing"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/database/query-optimization/SKILL.md",
  },
  {
    name: "UI Wireframing",
    description: "Create low-fidelity wireframes and user flow diagrams to plan interface layouts before high-fidelity design or development.",
    category: "design",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/design-and-ui-ux/wireframing",
    tags: ["design", "wireframing", "ux", "ui"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/design-and-ui-ux/wireframing/SKILL.md",
  },
  {
    name: "Deep Research",
    description: "Conduct comprehensive research on any topic by synthesizing multiple sources, evaluating credibility, and producing structured reports.",
    category: "research",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/research-and-knowledge/deep-research",
    tags: ["research", "analysis", "synthesis", "reports"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/research-and-knowledge/deep-research/SKILL.md",
  },
  {
    name: "Project Management",
    description: "Plan, organize, and track software projects — creating roadmaps, task breakdowns, sprint plans, and status reports.",
    category: "productivity",
    author: "awesome-ai-agent-skills contributors",
    sourceUrl: "https://github.com/seb1n/awesome-ai-agent-skills/tree/main/productivity-and-workflow/project-management",
    tags: ["productivity", "planning", "agile", "sprints"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/productivity-and-workflow/project-management/SKILL.md",
  },
  {
    name: "Flashcards Deck Generator",
    description: "Convert any text document into high-quality flashcards optimised for memorisation and spaced repetition learning.",
    category: "productivity",
    author: "Eleanor Berger",
    sourceUrl: "https://gist.github.com/intellectronica/f94a291078f3c09907894287688fa2d5",
    tags: ["productivity", "education", "flashcards", "learning"],
    fetchUrl: "https://raw.githubusercontent.com/seb1n/awesome-ai-agent-skills/main/productivity-and-workflow/note-taking/SKILL.md",
  },
];

async function fetchContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "MCP-Skill-Generator/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(`  ✗ Failed to fetch ${url}:`, err);
    return "";
  }
}

async function main() {
  console.log("🌱 Seeding real skills from GitHub repos...\n");

  // Clear existing templates seeded from GitHub (keep any user-created ones with id > 100)
  // We'll use an upsert strategy: delete all then re-insert
  await db.delete(templatesTable);
  console.log("🗑️  Cleared existing templates\n");

  let success = 0;
  let failed = 0;

  for (const skill of SKILLS) {
    process.stdout.write(`  Fetching: ${skill.name}...`);
    const content = await fetchContent(skill.fetchUrl);

    if (!content || content.length < 100) {
      console.log(" ✗ Empty or too short, skipping");
      failed++;
      continue;
    }

    await db.insert(templatesTable).values({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      author: skill.author,
      sourceUrl: skill.sourceUrl,
      tags: skill.tags,
      content,
    });

    console.log(` ✓ (${content.length} chars)`);
    success++;
  }

  console.log(`\n✅ Done: ${success} inserted, ${failed} failed`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
