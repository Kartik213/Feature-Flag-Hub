import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import { router, protectedProcedure } from "../trpc";
import { requireApiKeyAccess, requireProjectAccess } from "@/server/services/authorization";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

function generateApiKey(): string {
  return `ffh_${randomBytes(24).toString("base64url")}`;
}

export const apiKeyRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await requireProjectAccess(ctx.db, input.projectId, userId);
      
      const rawKey = generateApiKey();
      const keyHash = hashKey(rawKey);
      const keyPrefix = rawKey.slice(0, 12);

      // Enforce single API key per project: delete any existing one
      // Since projectId is now unique, we can easily delete the existing one if it exists
      await ctx.db.apiKey.deleteMany({
        where: { projectId: input.projectId }
      });

      const apiKey = await ctx.db.apiKey.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          keyHash,
          keyPrefix,
        },
      });

      // Return the raw key only once — it cannot be retrieved again
      return { key: rawKey, prefix: keyPrefix };
    }),

  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await requireProjectAccess(ctx.db, input.projectId, userId);

      return ctx.db.apiKey.findMany({
        where: {
          projectId: input.projectId,
          project: {
            organization: {
              members: {
                some: { userId },
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          keyPrefix: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  revoke: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const apiKey = await requireApiKeyAccess(ctx.db, input.id, userId);

      await ctx.db.apiKey.delete({ where: { id: apiKey.id } });

      return { success: true };
    }),
});
