import { subscriptionRouter } from "./routers/subscription";
import { userRouter } from "./routers/user";
import { ticketRouter } from "./routers/ticket";
import { organizationRouter } from "./routers/organization";
import { createCallerFactory, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  subscriptionRouter,
  userRouter,
  ticket: ticketRouter,
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
