import { router } from "./trpc";
import { projectsRouter } from "./routers/project";
import { apiKeyRouter } from "./routers/apiKey";

export const appRouter = router({
  projects: projectsRouter,
  apiKeys: apiKeyRouter,
});

export type AppRouter = typeof appRouter;
