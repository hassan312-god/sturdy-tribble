import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, templatesTable } from "@workspace/db";
import { GetTemplateParams, ListTemplatesQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /templates
router.get("/templates", async (req, res): Promise<void> => {
  const query = ListTemplatesQueryParams.safeParse(req.query);
  const category = query.success ? query.data.category : undefined;

  const results = category
    ? await db.select().from(templatesTable).where(eq(templatesTable.category, category)).orderBy(templatesTable.name)
    : await db.select().from(templatesTable).orderBy(templatesTable.name);

  res.json(results);
});

// GET /templates/:id
router.get("/templates/:id", async (req, res): Promise<void> => {
  const params = GetTemplateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [template] = await db
    .select()
    .from(templatesTable)
    .where(eq(templatesTable.id, params.data.id));

  if (!template) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  res.json(template);
});

export default router;
