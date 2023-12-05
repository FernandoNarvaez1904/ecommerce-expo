import { protectedProcedure, publicProcedure, router } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.auth.session;
  }),

  getUserEmail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await clerkClient.users.getUser(input.id);
      return user.emailAddresses[0]?.emailAddress ?? "";
    }),
});
