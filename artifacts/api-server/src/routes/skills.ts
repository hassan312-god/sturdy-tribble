import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, and, gte, count } from "drizzle-orm";
import { db, skillsTable } from "@workspace/db";
import {
  CreateSkillBody,
  UpdateSkillBody,
  GetSkillParams,
  UpdateSkillParams,
  DeleteSkillParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}

// GET /skills - list current user's skills
router.get("/skills", requireAuth, async (req: any, res): Promise<void> => {
  const skills = await db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.userId, req.userId))
    .orderBy(skillsTable.createdAt);
  res.json(skills);
});

// GET /skills/stats - user skill stats
router.get("/skills/stats", requireAuth, async (req: any, res): Promise<void> => {
  const [totalRow] = await db
    .select({ value: count() })
    .from(skillsTable)
    .where(eq(skillsTable.userId, req.userId));

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [recentRow] = await db
    .select({ value: count() })
    .from(skillsTable)
    .where(
      and(
        eq(skillsTable.userId, req.userId),
        gte(skillsTable.createdAt, sevenDaysAgo),
      ),
    );

  res.json({
    totalSkills: totalRow?.value ?? 0,
    recentCount: recentRow?.value ?? 0,
  });
});

// GET /skills/:id
router.get("/skills/:id", requireAuth, async (req: any, res): Promise<void> => {
  const params = GetSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [skill] = await db
    .select()
    .from(skillsTable)
    .where(and(eq(skillsTable.id, params.data.id), eq(skillsTable.userId, req.userId)));

  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  res.json(skill);
});

// POST /skills
router.post("/skills", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [skill] = await db
    .insert(skillsTable)
    .values({ ...parsed.data, userId: req.userId })
    .returning();

  res.status(201).json(skill);
});

// PUT /skills/:id
router.put("/skills/:id", requireAuth, async (req: any, res): Promise<void> => {
  const params = UpdateSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [skill] = await db
    .update(skillsTable)
    .set(parsed.data)
    .where(and(eq(skillsTable.id, params.data.id), eq(skillsTable.userId, req.userId)))
    .returning();

  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  res.json(skill);
});

// DELETE /skills/:id
router.delete("/skills/:id", requireAuth, async (req: any, res): Promise<void> => {
  const params = DeleteSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [skill] = await db
    .delete(skillsTable)
    .where(and(eq(skillsTable.id, params.data.id), eq(skillsTable.userId, req.userId)))
    .returning();

  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
