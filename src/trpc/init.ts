// import { db } from "@/db";
// import { users } from "@/db/schema";
// import { ratelimit } from "@/lib/ratelimit";
// import { auth } from "@clerk/nextjs/server";
// import { initTRPC, TRPCError } from "@trpc/server";
// import { eq } from "drizzle-orm";
// import { cache } from "react";
// import superjson from "superjson";

// export const createTRPCContext = cache(async () => {
//   const { userId } = await auth();

//   return { clerkUserId: userId };
// });

// export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// // Avoid exporting the entire t-object
// // since it's not very descriptive.
// // For instance, the use of a t variable
// // is common in i18n libraries.
// const t = initTRPC.context<Context>().create({
//   /**
//    * @see https://trpc.io/docs/server/data-transformers
//    */
//   transformer: superjson,
// });
// // Base router and procedure helpers
// export const createTRPCRouter = t.router;
// export const createCallerFactory = t.createCallerFactory;
// export const baseProcedure = t.procedure;

// export const protectedProcedure = t.procedure.use(
//   async function isAuthed(opts) {
//     const { ctx } = opts;

//     if (!ctx.clerkUserId) {
//       throw new TRPCError({ code: "UNAUTHORIZED" });
//     }

//     const [user] = await db
//       .select()
//       .from(users)
//       .where(eq(users.clerkId, ctx.clerkUserId))
//       .limit(1);

//     if (!user) {
//       throw new TRPCError({ code: "UNAUTHORIZED" });
//     }

//     const { success } = await ratelimit.limit(user.id);

//     if (!success) {
//       throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
//     }

//     return opts.next({
//       ctx: {
//         ...ctx,
//         user,
//       },
//     });
//   },
// );

import { db } from "@/db";
import { users } from "@/db/schema";
import { ratelimit } from "@/lib/ratelimit";
import { clerkClient } from "@clerk/nextjs/server"; // Add this import
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return { clerkUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;
    if (!ctx.clerkUserId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, ctx.clerkUserId))
      .limit(1);

    // If no user in DB, create it synchronously
    if (!user) {
      try {
        // Await clerkClient() to get the actual Clerk client instance
        const clerk = await clerkClient();

        const clerkUser = await clerk.users.getUser(ctx.clerkUserId);
        if (!clerkUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Clerk user not found",
          });
        }

        const userName =
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.emailAddresses?.[0]?.emailAddress ||
          "User";

        await db.insert(users).values({
          clerkId: ctx.clerkUserId,
          name: userName,
          imageUrl: clerkUser.imageUrl || "",
        });

        // Re-query to get the new user
        [user] = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, ctx.clerkUserId))
          .limit(1);

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user record",
          });
        }
      } catch (error) {
        console.error("❌ Failed to create user in tRPC context:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User creation failed during auth",
        });
      }
    }

    const { success } = await ratelimit.limit(user.id);
    if (!success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }

    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    });
  },
);
