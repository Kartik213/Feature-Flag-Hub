import { router } from "./trpc";
import { projectsRouter } from "./routers/project";
import { apiKeyRouter } from "./routers/apiKey";
import { flagsRouter } from "./routers/flag";

export const appRouter = router({
  projects: projectsRouter,
  apiKeys: apiKeyRouter,
  flags: flagsRouter,
});

export type AppRouter = typeof appRouter;
