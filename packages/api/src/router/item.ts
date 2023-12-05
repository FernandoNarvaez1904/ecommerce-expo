import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const itemRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.items.findMany({
      include: {
        category: {
          select: {
            id: true,
          },
        },
      },
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number().positive() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.items.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          category: {
            select: {
              id: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number().nonnegative(),
        stock: z.number(),
        categoryId: z.number().positive().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.items.create({
        data: {
          name: input.name,
          price: input.price,
          stock: input.stock,
          description: input.description,
          categoryId: input.categoryId
        },
        include: {
          category: {
            select: {
              id: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().positive(),
        name: z.string().optional(),
        price: z.number().nonnegative().optional(),
        stock: z.number().optional(),
        categoryId: z.number().positive().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.items.update({
        where: {
          id: id,
        },
        data: input,
        include: {
          category: {
            select: {
              id: true,
            },
          },
        },
      });
    }),
});
